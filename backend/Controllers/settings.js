import prisma from "../lib/prisma";



export const getDealerShipInfo = async () => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }


        let dealership = await prisma.dealershipInfo.findFirst({
            include: {
                workingHours: {
                    orderBy: {
                        dayOfWeek: "asc",
                    },
                },
            },
        });


        if (!dealership) {
            dealership = await prisma.dealershipInfo.create({
                data: {
                    // Default values will be used from schema
                    workingHours: {
                        create: [
                            {
                                dayOfWeek: "MONDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                dayOfWeek: "TUESDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                dayOfWeek: "WEDNESDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                dayOfWeek: "THURSDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                dayOfWeek: "FRIDAY",
                                openTime: "09:00",
                                closeTime: "18:00",
                                isOpen: true,
                            },
                            {
                                dayOfWeek: "SATURDAY",
                                openTime: "10:00",
                                closeTime: "16:00",
                                isOpen: true,
                            },
                            {
                                dayOfWeek: "SUNDAY",
                                openTime: "10:00",
                                closeTime: "16:00",
                                isOpen: false,
                            },
                        ],
                    },
                },
                include: {
                    workingHours: {
                        orderBy: {
                            dayOfWeek: "asc",
                        },
                    },
                },
            });
        }



        res.json({
            success: true,
            data: {
                ...dealership,
                createdAt: dealership.createdAt.toISOString(),
                updatedAt: dealership.updatedAt.toISOString(),
            },
        })
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: "Internal server error"
        })
    }
}


export const saveWorkingHours = async () => {
    try {
        const { userId, workingHours } = req.body;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        })

        if (!user || user.role !== "ADMIN") {
            return res.status(404).json({
                message: "Unauthorized: Admin access required"
            })
        }

        const dealership = await prisma.dealershipInfo.findFirst();

        if (!dealership) {
            return res.stats(404).json({
                message: "Dealership not found"
            })
        }

        for (const hour of workingHours) {
            await db.workingHour.create({
                data: {
                    dayOfWeek: hour.dayOfWeek,
                    openTime: hour.openTime,
                    closeTime: hour.closeTime,
                    isOpen: hour.isOpen,
                    dealershipId: dealership.id,
                },
            });
        }

        await prisma.workingHour.deleteMany({
            where: { dealershipId: dealership.id },
        });

    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: "Internal server error"
        })
    }
}


export const getUsers = async () => {
    try {
        const { userId } = req.body;
        if (!userId) throw new Error("Unauthorized");


        const adminUser = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!adminUser || adminUser.role !== "ADMIN") {
            res.status(401).json({
                message: "Unauthorized: Admin access required"
            })
        }


        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });

        res.json({
            success: true,
            data: users.map((user) => ({
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            })),
        });
    } catch (error) {
        console.log(error)
        res.status(501).json({
            message: "Internal server error"
        })
    }
}


export const updateUserRole = async () => {
    try {
        const { userId: adminId, role } = req.body;
        if (!adminId) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const adminUser = await prisma.user.findUnique({
            where: { clerkUserId: adminId },
        });

        if (!adminUser || adminUser.role !== "ADMIN") {
            return res.status(401).json({
                message: "Unauthorized: Admin access required"
            })
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        res.json({
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            message: "Internal server error"
        })
    }
}
