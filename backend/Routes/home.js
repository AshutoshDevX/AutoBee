import express from 'express';
import { getFeaturedCars, processImageSearch } from '../Controllers/home.js';
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/", upload.single("image"), processImageSearch)
router.get("/", getFeaturedCars);
export default router;