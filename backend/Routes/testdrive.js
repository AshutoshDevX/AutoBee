import express from 'express';
import { bookTestDrive, cancelTestDrive, getUserTestDrives } from '../Controllers/testdrive.js';

const router = express.Router();

router.post("/testdrive", bookTestDrive);
router.get("/usertestdrives/:userId", getUserTestDrives);
router.delete("/canceltestdrive", cancelTestDrive);
export default router;