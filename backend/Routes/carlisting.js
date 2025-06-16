import express from 'express';
import { getCarById, getCarFilters, getCars, getSavedCars, toggleSavedCar } from "../Controllers/carlisting.js";


const router = express.Router();

router.get('/carfilters', getCarFilters);
router.post('/cars', getCars);
router.get("/togglesavedcar", toggleSavedCar);
router.get("/cars", getCarById);
router.get("/savedcars/:userId", getSavedCars);

export default router;