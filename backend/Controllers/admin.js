import prisma from "../lib/prisma.js";




export const getAdmin = async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user || user.role !== "ADMIN") {
        res.status(401).json({
            authorized: false,
            message: "not-admin"
        })
    }

    res.json({
        authorized: true,
        message: "success"
    })
}