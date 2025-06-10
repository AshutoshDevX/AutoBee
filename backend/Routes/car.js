import express from 'express';

import { addCar } from "../Controllers/cars.js";

const router = express.Router();

router.post("/addcar", addCar);

export default router;