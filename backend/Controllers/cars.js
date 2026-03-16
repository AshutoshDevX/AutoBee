import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import prisma from "../lib/prisma.js";
import { serializeCarData } from "../lib/helper.js";
const fileToBase64 = async (file) => {
    const buffer = file.split(',')[1];
    return buffer.toString("base64");
};

// Coerce various price formats (including ranges / currency symbols) into a single numeric value
const normalizePriceToNumber = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        // Remove currency symbols and spaces, keep digits, dots, commas, and dashes
        const cleaned = value.replace(/[^\d.,-]/g, "");
        // Extract all numbers; use the first as the stored price (e.g. lower bound of a range)
        const matches = cleaned.replace(/,/g, "").match(/\d+(\.\d+)?/g);
        if (!matches || matches.length === 0) return null;
        const first = parseFloat(matches[0]);
        return Number.isNaN(first) ? null : first;
    }
    return null;
};
export const processCarImageWithAI = async (req, res) => {
    const { uploadedAiImage } = req.body;
    try {

        if (!process.env.GEMINI_API_KEY) {
            return res.status(401).json({
                success: false,
                error: "Gemini API key is not configured",
            });
        }

        const ai = new GoogleGenAI({});


        const base64Image = await fileToBase64(uploadedAiImage);
        const prompt = `
      Analyze this car image and extract the following information:
      1. Make (manufacturer)
      2. Model
      3. Year (approximately)
      4. Color
      5. Body type (SUV, Sedan, Hatchback, etc.)
      6. Mileage (approximately. Don't give ranges, just a single number that's your best guess)
      7. Fuel type (your best guess)
      8. Transmission type (your best guess)
      9. Price (your best guess in indian rupees. Don't give ranges, just a single number that's your best guess)
      10. Short Description as to be added to a car listing

      Format your response as a clean JSON object with these fields:
      {
        "make": "",
        "model": "",
        "year": 0000,
        "color": "",
        "price": "",
        "mileage": "",
        "bodyType": "",
        "fuelType": "",
        "transmission": "",
        "description": "",
        "confidence": 0.0
      }

      For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification.
      Only respond with the JSON object, nothing else.
    `;

        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    inlineData: {
                        mimeType: "image/jpeg",
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


        try {
            const raw = JSON.parse(cleanedText);

            // Normalize Gemini response into the shape the frontend expects
            const id = raw.car_identification || {};
            const specs = raw.specifications || {};

            const normalized = {
                make: raw.make ?? id.make ?? "",
                model: raw.model ?? id.model ?? "",
                year: typeof raw.year === "number"
                    ? raw.year
                    : (typeof id.year === "string"
                        ? parseInt(id.year, 10) || 0
                        : 0),
                color: raw.color ?? specs.exterior_color ?? "",
                price: raw.price ?? "",
                mileage: raw.mileage ?? "",
                bodyType: raw.bodyType ?? specs.body_style ?? "",
                fuelType: raw.fuelType ?? specs.fuel_type ?? "",
                transmission: raw.transmission ?? specs.transmission ?? "",
                description:
                    raw.description ??
                    (Array.isArray(raw.visible_features)
                        ? raw.visible_features.join(", ")
                        : ""),
                confidence:
                    typeof raw.confidence === "number" ? raw.confidence : 0.7,
            };

            // Validate the response format against required fields
            const requiredFields = [
                "make",
                "model",
                "year",
                "color",
                "bodyType",
                "price",
                "mileage",
                "fuelType",
                "transmission",
                "description",
                "confidence",
            ];

            const missingFields = requiredFields.filter(
                (field) => normalized[field] === undefined
            );

            if (missingFields.length > 0) {
                throw new Error(
                    `AI response missing required fields after normalization: ${missingFields.join(", ")}`
                );
            }

            // Return success response with normalized data
            return res.json({
                success: true,
                data: normalized,
            });
        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            return res.status(501).json({                success: false,
                error: "Failed to parse AI response",
            });
        }

    } catch (err) {
        console.error("Gemini API error:", err);
        return res.status(500).json({
            success: false,
            error: "Gemini API error: " + err.message,
        });
    }
}


export const addCar = async (req, res) => {
    try {

        const { userId, carData, images } = req.body;
        if (!userId) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");


        const carId = uuidv4();
        const folderPath = `cars/${carId}`;

        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey) {
            return res.status(500).json({
                success: false,
                error: "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is not set",
            });
        }
        const supabase = createClient(
            process.env.VITE_SUPABASE_URL,
            serviceRoleKey
        );


        const imageUrls = [];

        for (let i = 0; i < images.length; i++) {
            const base64Data = images[i];


            if (!base64Data || !base64Data.startsWith("data:image/")) {
                console.warn("Skipping invalid image data");
                continue;
            }


            const base64 = base64Data.split(",")[1];
            const imageBuffer = Buffer.from(base64, "base64");


            const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
            const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";


            const fileName = `image-${Date.now()}-${i}.${fileExtension}`;
            const filePath = `${folderPath}/${fileName}`;


            const { data, error } = await supabase.storage
                .from("car-images")
                .upload(filePath, imageBuffer, {
                    contentType: `image/${fileExtension}`,
                });

            if (error) {
                console.error("Error uploading image:", error);
                throw new Error(`Failed to upload image: ${error.message}`);
            }


            const publicUrl = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`; // disable cache in config

            imageUrls.push(publicUrl);
        }

        if (imageUrls.length === 0) {
            throw new Error("No valid images were uploaded");
        }


        const normalizedPrice = normalizePriceToNumber(carData.price);
        if (normalizedPrice === null) {
            return res.status(400).json({
                success: false,
                error: "Invalid or missing price. Please enter a numeric price (you can still show a range in the UI).",
            });
        }
        const normalizedMileage = normalizePriceToNumber(carData.mileage);
        if (normalizedMileage === null) {
            return res.status(400).json({
                success: false,
                error: "Invalid or missing mileage. Please enter a numeric mileage (you can still show a range in the UI).",
            });
        }

        const car = await prisma.car.create({
            data: {
                id: carId,
                make: carData.make,
                model: carData.model,
                year: carData.year,
                price: normalizedPrice,
                mileage: normalizedMileage,
                color: carData.color,
                fuelType: carData.fuelType,
                transmission: carData.transmission,
                bodyType: carData.bodyType,
                seats: carData.seats,
                description: carData.description,
                status: carData.status,
                featured: carData.featured,
                images: imageUrls,
            },
        });


        // revalidatePath("/admin/cars");

        res.json({
            car,
            success: true,
        });
    } catch (error) {
        throw new Error("Error adding car:" + error.message);
    }
}


export const getCars = async (req, res) => {
    try {
        const { userId, search } = req.body;

        if (!userId) throw new Error("Unauthorized");


        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        })


        if (!user) throw new Error("User not found")


        let where = {}

        if (search) {
            where.OR = [
                { make: { contains: search, mode: "insensitive" } },
                { model: { contains: search, mode: "insensitive" } },
                { color: { contains: search, mode: "insensitive" } },
            ]
        }


        const cars = await prisma.car.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });


        const serializedCars = cars.map(serializeCarData);

        res.json({
            success: true,
            data: serializedCars,
        })


    } catch (err) {
        console.log("Error fetching cars:", err);

        res.status(500).json({
            success: false,
            err: err.message
        })
    }
}


export const deleteCar = async (req, res) => {
    try {
        const data = req.body;
        const { userId, id } = data;

        if (!userId) throw new Error("Unauthorized");


        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        })


        if (!user) throw new Error("User not found");


        const car = await prisma.car.findUnique({
            where: { id },
            select: { images: true },
        });

        if (!car) {
            return {
                success: false,
                error: "Car not found",
            };
        }

        await prisma.car.delete({
            where: { id },
        });


        try {
            const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            if (serviceRoleKey) {
                const supabase = createClient(
                    process.env.VITE_SUPABASE_URL,
                    serviceRoleKey
                );



            const filePaths = car.images
                .map((imageUrl) => {
                    const url = new URL(imageUrl);
                    const pathMatch = url.pathname.match(/\/car-images\/(.*)/);
                    return pathMatch ? pathMatch[1] : null;
                }).filter(Boolean);


            if (filePaths.length > 0) {
                const { error } = await supabase.storage.from("car-images").remove(filePaths);

                if (error) {
                    console.error("Error deleting images:", error);
                }
            }
            }
        } catch (storageError) {
            console.error("Error with storage operations:", storageError);
        }

        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }

}


export const updateCarStatus = async (req, res) => {
    try {
        const { status, featured, userId, id } = req.body;

        if (!userId) throw new Error("Unauthorized");


        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        })

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }


        const updateData = {};

        if (status !== undefined) {
            updateData.status = status;
        }

        if (featured !== undefined) {
            updateData.featured = featured;
        }


        await prisma.car.update({
            where: { id },
            data: updateData,
        });

        res.json({
            success: true,
        })
    } catch (error) {
        console.error("Error updating car status:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
