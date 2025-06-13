import prisma from "../lib/prisma";
import { aj } from "../lib/arcjet";


export async function getFeaturedCars(req, res) {
    try {
        const limit = 3;
        const cars = await prisma.car.findMany({
            where: {
                featured: true,
                status: "AVAILABLE",
            },
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        const newCars = cars.map(serializeCarData);

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

                res.status(429).json({
                    message: "Too many requests"
                })
            }

            res.status(403).json({
                message: "Request blocked"
            })
        }

        // Check if API key is available
        if (!process.env.GEMINI_API_KEY) {
            return res.status(401).json({
                message: "Gemini API key is not configured"

            })
        }

        // Initialize Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert image file to base64
        const base64Image = await fileToBase64(file);

        // Create image part for the model
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: file.type,
            },
        };

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

        // Get response from Gemini
        const result = await model.generateContent([imagePart, prompt]);
        const response = await result.response;
        const text = response.text();
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
            res.status(501).json({
                success: false,
                error: "Failed to parse AI response",
            });
        }
    } catch (error) {
        throw new Error("AI Search error:" + error.message);
    }
}