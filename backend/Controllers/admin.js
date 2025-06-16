import { serializeCarData } from "../lib/helper.js";
import prisma from "../lib/prisma.js";


export async function getAdmin(req, res) {
    const { userId } = req.params;
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
    });

    // If user not found in our prisma or not an admin, return not authorized
    if (!user || user.role !== "ADMIN") {
        res.status(401).json({ authorized: false, reason: "not-admin" });
    }

    res.json({ authorized: true, user });
}

/**
 * Get all test drives for admin with filters
 */
export async function getAdminTestDrives(req, res) {
    try {
        const { userId, search = "", status = "" } = req.body;

        if (!userId) throw new Error("Unauthorized");

        // Verify admin status
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized access");
        }

        // Build where conditions
        let where = {};

        // Add status filter
        if (status) {
            where.status = status;
        }

        // Add search filter
        if (search) {
            where.OR = [
                {
                    car: {
                        OR: [
                            { make: { contains: search, mode: "insensitive" } },
                            { model: { contains: search, mode: "insensitive" } },
                        ],
                    },
                },
                {
                    user: {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { email: { contains: search, mode: "insensitive" } },
                        ],
                    },
                },
            ];
        }

        // Get bookings
        const bookings = await prisma.testDriveBooking.findMany({
            where,
            include: {
                car: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        imageUrl: true,
                        phone: true,
                    },
                },
            },
            orderBy: [{ bookingDate: "desc" }, { startTime: "asc" }],
        });

        // Format the bookings
        const formattedbookings = bookings.map((booking) => ({
            id: booking.id,
            carId: booking.carId,
            car: serializeCarData(booking.car),
            userId: booking.userId,
            user: booking.user,
            bookingDate: booking.bookingDate.toISOString(),
            startTime: booking.startTime,
            endTime: booking.endTime,
            status: booking.status,
            notes: booking.notes,
            createdAt: booking.createdAt.toISOString(),
            updatedAt: booking.updatedAt.toISOString(),
        }));

        res.json({
            success: true,
            data: formattedbookings,
        });
    } catch (error) {
        console.error("Error fetching test drives:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

/**
 * Update test drive status
 */
export async function updateTestDriveStatus(req, res) {
    try {
        const { userId, bookingId, newStatus } = req.body;
        if (!userId) throw new Error("Unauthorized");

        // Verify admin status
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user || user.role !== "ADMIN") {
            throw new Error("Unauthorized access");
        }

        // Get the booking
        const booking = await prisma.testDriveBooking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new Error("Booking not found");
        }

        // Validate status
        const validStatuses = [
            "PENDING",
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
            "NO_SHOW",
        ];
        if (!validStatuses.includes(newStatus)) {
            res.status(403).json({
                success: false,
                error: "Invalid status",
            });
        }

        // Update status
        await prisma.testDriveBooking.update({
            where: { id: bookingId },
            data: { status: newStatus },
        });

        // Revalidate paths


        res.json({
            success: true,
            message: "Test drive status updated successfully",
        });
    } catch (error) {
        throw new Error("Error updating test drive status:" + error.message);
    }
}

export async function getDashboardData(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) throw new Error("Unauthorized");

        // Get user
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user || user.role !== "ADMIN") {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        // Fetch all necessary data in a single parallel operation
        const [cars, testDrives] = await Promise.all([
            // Get all cars with minimal fields
            prisma.car.findMany({
                select: {
                    id: true,
                    status: true,
                    featured: true,
                },
            }),

            // Get all test drives with minimal fields
            prisma.testDriveBooking.findMany({
                select: {
                    id: true,
                    status: true,
                    carId: true,
                },
            }),
        ]);

        // Calculate car statistics
        const totalCars = cars.length;
        const availableCars = cars.filter(
            (car) => car.status === "AVAILABLE"
        ).length;
        const soldCars = cars.filter((car) => car.status === "SOLD").length;
        const unavailableCars = cars.filter(
            (car) => car.status === "UNAVAILABLE"
        ).length;
        const featuredCars = cars.filter((car) => car.featured === true).length;

        // Calculate test drive statistics
        const totalTestDrives = testDrives.length;
        const pendingTestDrives = testDrives.filter(
            (td) => td.status === "PENDING"
        ).length;
        const confirmedTestDrives = testDrives.filter(
            (td) => td.status === "CONFIRMED"
        ).length;
        const completedTestDrives = testDrives.filter(
            (td) => td.status === "COMPLETED"
        ).length;
        const cancelledTestDrives = testDrives.filter(
            (td) => td.status === "CANCELLED"
        ).length;
        const noShowTestDrives = testDrives.filter(
            (td) => td.status === "NO_SHOW"
        ).length;

        // Calculate test drive conversion rate
        const completedTestDriveCarIds = testDrives
            .filter((td) => td.status === "COMPLETED")
            .map((td) => td.carId);

        const soldCarsAfterTestDrive = cars.filter(
            (car) =>
                car.status === "SOLD" && completedTestDriveCarIds.includes(car.id)
        ).length;

        const conversionRate =
            completedTestDrives > 0
                ? (soldCarsAfterTestDrive / completedTestDrives) * 100
                : 0;

        res.json({
            success: true,
            data: {
                cars: {
                    total: totalCars,
                    available: availableCars,
                    sold: soldCars,
                    unavailable: unavailableCars,
                    featured: featuredCars,
                },
                testDrives: {
                    total: totalTestDrives,
                    pending: pendingTestDrives,
                    confirmed: confirmedTestDrives,
                    completed: completedTestDrives,
                    cancelled: cancelledTestDrives,
                    noShow: noShowTestDrives,
                    conversionRate: parseFloat(conversionRate.toFixed(2)),
                },
            },
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
