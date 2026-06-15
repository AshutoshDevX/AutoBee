import prisma from "../lib/prisma.js";
import { aj } from "../lib/arcjet.js";
import { GoogleGenAI } from "@google/genai";
import { serializeCarData } from "../lib/helper.js";


export async function getFeaturedCars(req, res) {
    try {
        const { userId } = req.query;
        const limit = 3;
        const cars = await prisma.car.findMany({
            where: {
                featured: true,
                status: "AVAILABLE",
            },
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        // Check wishlist status if user is logged in
        let wishlisted = new Set();
        if (userId) {
            const user = await prisma.user.findUnique({
                where: { clerkUserId: userId },
            });
            if (user) {
                const savedCars = await prisma.userSavedCar.findMany({
                    where: { userId: user.id },
                    select: { carId: true },
                });
                wishlisted = new Set(savedCars.map((saved) => saved.carId));
            }
        }

        const newCars = cars.map((car) => serializeCarData(car, wishlisted.has(car.id)));

        res.json({
            cars: newCars
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}



export async function processImageSearch(req, res) {
    try {

        // Check rate limit
        const file = req.file;


        const decision = await aj.protect(req, {
            requested: 1, // Specify how many tokens to consume
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: {
                        remaining,
                        resetInSeconds: reset,
                    },
                });

                return res.status(429).json({
                    message: "Too many requests"
                })
            }

            return res.status(403).json({
                message: "Request blocked"
            })
        }

        // Check if API key is available
        if (!process.env.GEMINI_API_KEY) {
            return res.status(401).json({
                message: "Gemini API key is not configured",
            });
        }

        // Initialize Gemini API (new @google/genai client)
        const ai = new GoogleGenAI({});

        // Convert image file to base64
        const base64Image = file.buffer.toString("base64");

        // Define the prompt for car search extraction
        const prompt = `
      Analyze this car image and extract the following information for a search query:
      1. Make (manufacturer)
      2. Body type (SUV, Sedan, Hatchback, etc.)
      3. Color

      Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "bodyType": "",
        "color": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
    `;

        // Get response from Gemini using multimodal generateContent
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    inlineData: {
                        mimeType: file.mimetype,
                        data: base64Image,
                    },
                },
                { text: prompt },
            ],
        });
        // New @google/genai: text is in candidates[0].content.parts[].text
        const content = result.candidates?.[0]?.content;
        const text = content?.parts?.map((p) => p.text).filter(Boolean).join("") ?? "";
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

        // Parse the JSON response
        try {
            const carDetails = JSON.parse(cleanedText);

            // Return success response with data
            res.json({
                success: true,
                data: carDetails,
            });
        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            console.log("Raw response:", text);
            return res.status(501).json({
                success: false,
                error: "Failed to parse AI response",
            });
        }
    } catch (error) {
        console.error("AI Search error:", error);
        return res.status(500).json({
            success: false,
            error: "AI search failed",
        });
    }
}

