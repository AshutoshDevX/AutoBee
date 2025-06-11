import express from 'express';
import { addCar, deleteCar, getCars, updateCarStatus } from "../Controllers/cars.js";
import { processCarImageWithAI } from '../Controllers/cars.js';


const router = express.Router();

router.post("/addcar", addCar);
router.post("/processcar", processCarImageWithAI);
router.delete("/deletecar", deleteCar)
router.post("/", getCars);
router.put("/updatecar", updateCarStatus);

export default router;