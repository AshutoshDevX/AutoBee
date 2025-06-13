import { serializeCarData } from "../lib/helper";
import prisma from "../lib/prisma";


export async function getCarFilters(req, res) {
    try {
        // Get unique makes
        const makes = await prisma.car.findMany({
            where: { status: "AVAILABLE" },
            select: { make: true },
            distinct: ["make"],
            orderBy: { make: "asc" },
        });

        // Get unique body types
        const bodyTypes = await prisma.car.findMany({
            where: { status: "AVAILABLE" },
            select: { bodyType: true },
            distinct: ["bodyType"],
            orderBy: { bodyType: "asc" },
        });

        // Get unique fuel types
        const fuelTypes = await prisma.car.findMany({
            where: { status: "AVAILABLE" },
            select: { fuelType: true },
            distinct: ["fuelType"],
            orderBy: { fuelType: "asc" },
        });

        // Get unique transmissions
        const transmissions = await prisma.car.findMany({
            where: { status: "AVAILABLE" },
            select: { transmission: true },
            distinct: ["transmission"],
            orderBy: { transmission: "asc" },
        });

        // Get min and max prices using Prisma aggregations
        const priceAggregations = await prisma.car.aggregate({
            where: { status: "AVAILABLE" },
            _min: { price: true },
            _max: { price: true },
        });

        res.json({
            success: true,
            data: {
                makes: makes.map((item) => item.make),
                bodyTypes: bodyTypes.map((item) => item.bodyType),
                fuelTypes: fuelTypes.map((item) => item.fuelType),
                transmissions: transmissions.map((item) => item.transmission),
                priceRange: {
                    min: priceAggregations._min.price
                        ? parseFloat(priceAggregations._min.price.toString())
                        : 0,
                    max: priceAggregations._max.price
                        ? parseFloat(priceAggregations._max.price.toString())
                        : 100000,
                },
            },
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching car filters"
        })
    }
}

/**
 * Get cars with simplified filters
 */
export async function getCars(req, res) {
    try {
        const {
            search = "",
            make = "",
            bodyType = "",
            fuelType = "",
            transmission = "",
            minPrice = 0,
            maxPrice = Number.MAX_SAFE_INTEGER,
            sortBy = "newest",
            page = 1,
            limit = 6,
            userId
        } = req.body;
        // Get current user if authenticated
        let prismaUser = null;

        if (userId) {
            prismaUser = await prisma.user.findUnique({
                where: { clerkUserId: userId },
            });
        }

        // Build where conditions
        let where = {
            status: "AVAILABLE",
        };

        if (search) {
            where.OR = [
                { make: { contains: search, mode: "insensitive" } },
                { model: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        if (make) where.make = { equals: make, mode: "insensitive" };
        if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" };
        if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" };
        if (transmission)
            where.transmission = { equals: transmission, mode: "insensitive" };

        // Add price range
        where.price = {
            gte: parseFloat(minPrice) || 0,
        };

        if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
            where.price.lte = parseFloat(maxPrice);
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Determine sort order
        let orderBy = {};
        switch (sortBy) {
            case "priceAsc":
                orderBy = { price: "asc" };
                break;
            case "priceDesc":
                orderBy = { price: "desc" };
                break;
            case "newest":
            default:
                orderBy = { createdAt: "desc" };
                break;
        }

        // Get total count for pagination
        const totalCars = await prisma.car.count({ where });

        // Execute the main query
        const cars = await prisma.car.findMany({
            where,
            take: limit,
            skip,
            orderBy,
        });

        // If we have a user, check which cars are wishlisted
        let wishlisted = new Set();
        if (prismaUser) {
            const savedCars = await prisma.userSavedCar.findMany({
                where: { userId: prismaUser.id },
                select: { carId: true },
            });

            wishlisted = new Set(savedCars.map((saved) => saved.carId));
        }

        // Serialize and check wishlist status
        const serializedCars = cars.map((car) =>
            serializeCarData(car, wishlisted.has(car.id))
        );

        res.json({
            success: true,
            data: serializedCars,
            pagination: {
                total: totalCars,
                page,
                limit,
                pages: Math.ceil(totalCars / limit),
            },
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching car filters"
        })
    }
}

/**
 * Toggle car in user's wishlist
 */
export async function toggleSavedCar(req, res) {
    try {
        const { carId, userId } = req.params;

        if (!userId) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        // Check if car exists
        const car = await prisma.car.findUnique({
            where: { id: carId },
        });

        if (!car) {
            return {
                success: false,
                error: "Car not found",
            };
        }

        // Check if car is already saved
        const existingSave = await prisma.userSavedCar.findUnique({
            where: {
                userId_carId: {
                    userId: user.id,
                    carId,
                },
            },
        });

        // If car is already saved, remove it
        if (existingSave) {
            await prisma.userSavedCar.delete({
                where: {
                    userId_carId: {
                        userId: user.id,
                        carId,
                    },
                },
            });

            revalidatePath(`/saved-cars`);
            return {
                success: true,
                saved: false,
                message: "Car removed from favorites",
            };
        }

        // If car is not saved, add it
        await prisma.userSavedCar.create({
            data: {
                userId: user.id,
                carId,
            },
        });

        revalidatePath(`/saved-cars`);
        return {
            success: true,
            saved: true,
            message: "Car added to favorites",
        };
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching car filters"
        })
    }
}

/**
 * Get car details by ID
 */
export async function getCarById(req, res) {
    try {
        // Get current user if authenticated
        const { carId, userId } = req.params;

        let prismaUser = null;

        if (userId) {
            prismaUser = await prisma.user.findUnique({
                where: { clerkUserId: userId },
            });
        }

        // Get car details
        const car = await prisma.car.findUnique({
            where: { id: carId },
        });

        if (!car) {
            return {
                success: false,
                error: "Car not found",
            };
        }

        // Check if car is wishlisted by user
        let isWishlisted = false;
        if (prismaUser) {
            const savedCar = await prisma.userSavedCar.findUnique({
                where: {
                    userId_carId: {
                        userId: prismaUser.id,
                        carId,
                    },
                },
            });

            isWishlisted = !!savedCar;
        }

        // Check if user has already booked a test drive for this car
        const existingTestDrive = await prisma.testDriveBooking.findFirst({
            where: {
                carId,
                userId: prismaUser.id,
                status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        let userTestDrive = null;

        if (existingTestDrive) {
            userTestDrive = {
                id: existingTestDrive.id,
                status: existingTestDrive.status,
                bookingDate: existingTestDrive.bookingDate.toISOString(),
            };
        }

        // Get dealership info for test drive availability
        const dealership = await prisma.dealershipInfo.findFirst({
            include: {
                workingHours: true,
            },
        });

        res.json({
            success: true,
            data: {
                ...serializeCarData(car, isWishlisted),
                testDriveInfo: {
                    userTestDrive,
                    dealership: dealership
                        ? {
                            ...dealership,
                            createdAt: dealership.createdAt.toISOString(),
                            updatedAt: dealership.updatedAt.toISOString(),
                            workingHours: dealership.workingHours.map((hour) => ({
                                ...hour,
                                createdAt: hour.createdAt.toISOString(),
                                updatedAt: hour.updatedAt.toISOString(),
                            })),
                        }
                        : null,
                },
            },
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching car filters"
        })
    }
}

/**
 * Get user's saved cars
 */
export async function getSavedCars(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return {
                success: false,
                error: "Unauthorized",
            };
        }

        // Get the user from our database
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            return {
                success: false,
                error: "User not found",
            };
        }

        // Get saved cars with their details
        const savedCars = await prisma.userSavedCar.findMany({
            where: { userId: user.id },
            include: {
                car: true,
            },
            orderBy: { savedAt: "desc" },
        });

        // Extract and format car data
        const cars = savedCars.map((saved) => serializeCarData(saved.car));

        res.json({
            success: true,
            data: cars,
        });
    } catch (error) {
        console.error("Error fetching saved cars:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}