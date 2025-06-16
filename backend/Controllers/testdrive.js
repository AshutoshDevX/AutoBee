
import prisma from "../lib/prisma.js";
import { serializeCarData } from "../lib/helper.js";

/**
 * Books a test drive for a car
 */
export async function bookTestDrive(req, res) {
    try {
        // Authenticate user
        const {
            carId,
            bookingDate,
            startTime,
            endTime,
            notes,
            userId
        } = req.body;

        if (!userId) throw new Error("You must be logged in to book a test drive");

        // Find user in our database
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found in database");

        // Check if car exists and is available
        const car = await prisma.car.findUnique({
            where: { id: carId, status: "AVAILABLE" },
        });

        if (!car) throw new Error("Car not available for test drive");

        // Check if slot is already booked
        const existingBooking = await prisma.testDriveBooking.findFirst({
            where: {
                carId,
                bookingDate: new Date(bookingDate),
                startTime,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });

        if (existingBooking) {
            throw new Error(
                "This time slot is already booked. Please select another time."
            );
        }

        // Create the booking
        const booking = await prisma.testDriveBooking.create({
            data: {
                carId,
                userId: user.id,
                bookingDate: new Date(bookingDate),
                startTime,
                endTime,
                notes: notes || null,
                status: "PENDING",
            },
        });


        res.json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error("Error booking test drive:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to book test drive",
        });
    }
}

/**
 * Get user's test drive bookings - reservations page
 */
export async function getUserTestDrives(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        // Get the user from our database
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });



        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        // Get user's test drive bookings
        const bookings = await prisma.testDriveBooking.findMany({
            where: { userId: user.id },
            include: {
                car: true,
            },
            orderBy: { bookingDate: "desc" },
        });

        // Format the bookings
        const formattedBookings = bookings.map((booking) => ({
            id: booking.id,
            carId: booking.carId,
            car: serializeCarData(booking.car),
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
            data: formattedBookings,
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
 * Cancel a test drive booking
 */
export async function cancelTestDrive(req, res) {
    try {
        const { userId, bookingId } = req.query;
        if (!userId) {
            res.json(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        // Get the user from our database
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        // Get the booking
        const booking = await prisma.testDriveBooking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            res.status(404).json({
                success: false,
                error: "Booking not found",
            });
        }

        // Check if user owns this booking
        if (booking.userId !== user.id || user.role !== "ADMIN") {
            res.status(401).json({
                success: false,
                error: "Unauthorized to cancel this booking",
            });
        }

        // Check if booking can be cancelled
        if (booking.status === "CANCELLED") {
            res.status(403).json({
                success: false,
                error: "Booking is already cancelled",
            });
        }

        if (booking.status === "COMPLETED") {
            res.status(403).json({
                success: false,
                error: "Cannot cancel a completed booking",
            });
        }

        // Update the booking status
        await prisma.testDriveBooking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" },
        });


        res.json({
            success: true,
            message: "Test drive cancelled successfully",
        });
    } catch (error) {
        console.error("Error cancelling test drive:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}