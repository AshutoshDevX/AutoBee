import express from 'express';

import { addCar } from "../Controllers/cars.js";
import { processCarImageWithAI } from '../Controllers/cars.js';


const router = express.Router();

router.post("/addcar", addCar);
router.post("/processcar", processCarImageWithAI)

export default router;