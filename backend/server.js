// backend/index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get all cars
app.get('/api/cars', async (req, res) => {
    const cars = await prisma.car.findMany();
    res.json(cars);
});

// Save a car (example route)
app.post('/api/save-car', async (req, res) => {
    const { userId, carId } = req.body;
    const saved = await prisma.userSavedCar.create({
        data: { userId, carId }
    });
    res.json(saved);
});

app.listen(3000, () => {
    console.log('Backend running on http://localhost:3000');
});
