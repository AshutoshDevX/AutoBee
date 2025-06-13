import express from 'express';
import { getCarById, getCarFilters, getCars, getSavedCars, toggleSavedCar } from "../Controllers/carlisting";


const router = express.Router();

router.get('/carfilters', getCarFilters);
router.post('/cars', getCars);
router.get("/togglesavedcar", toggleSavedCar);
router.get("/:id", getCarById);
router.get("/:id", getSavedCars);

export default router;