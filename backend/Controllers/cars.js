import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import prisma from "../lib/prisma.js";
import { serializeCarData } from "../lib/helper.js";
const fileToBase64 = async (file) => {
    const buffer = file.split(',')[1];
    return buffer.toString("base64");
};
export const processCarImageWithAI = async (req, res) => {
    const { uploadedAiImage } = req.body;
    try {

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API key is not configured")
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


        const base64Image = await fileToBase64(uploadedAiImage)
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: "image/jpg",
            },
        };
        const prompt = `
      Analyze this car image and extract the following information:
      1. Make (manufacturer)
      2. Model
      3. Year (approximately)
      4. Color
      5. Body type (SUV, Sedan, Hatchback, etc.)
      6. Mileage
      7. Fuel type (your best guess)
      8. Transmission type (your best guess)
      9. Price (your best guess)
      9. Short Description as to be added to a car listing

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

        const result = await model.generateContent([imagePart, prompt]);
        const response = result.response;
        const text = response.text();

        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();


        try {
            const carDetails = JSON.parse(cleanedText);

            // Validate the response format
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
                (field) => !(field in carDetails)
            );

            if (missingFields.length > 0) {
                throw new Error(
                    `AI response missing required fields: ${missingFields.join(", ")}`
                );
            }

            // Return success response with data
            res.json({
                success: true,
                data: carDetails,
            });
        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            console.log("Raw response:", text);
            res.status(501).json()({
                success: false,
                error: "Failed to parse AI response",
            });
        }

    } catch (err) {
        console.error();
        throw new Error("Gemini API error:" + err.message);
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


        const supabase = createClient(
            process.env.VITE_SUPABASE_URL,
            process.env.VITE_SUPABASE_ANON_KEY // Use service role for uploads
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

        const car = await prisma.car.create({
            data: {
                id: carId,
                make: carData.make,
                model: carData.model,
                year: carData.year,
                price: carData.price,
                mileage: carData.mileage,
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
            const supabase = createClient(
                process.env.VITE_SUPABASE_URL,
                process.env.VITE_SUPABASE_ANON_KEY
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
