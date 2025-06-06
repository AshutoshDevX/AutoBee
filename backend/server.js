import express from 'express';
import prisma from './lib/prisma.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/api/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
