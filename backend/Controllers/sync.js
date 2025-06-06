import express from 'express';
import prisma from '../lib/prisma.js'

const router = express.Router();

router.post('/sync', async (req, res) => {
    try {
        const { clerkUserId, email, name, imageUrl } = req.body;

        let user = await prisma.user.findUnique({ where: { clerkUserId } });

        if (user) {
            return res.status(200).json({ user });
        }

        if (!user) {
            user = await prisma.user.create({
                data: { clerkUserId, email, name, imageUrl },
            });
        }

        return res.status(200).json({ user });

    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
