import express from 'express';
import { getAdmin, getDashboardData, updateTestDriveStatus } from '../Controllers/admin.js';
import { getAdminTestDrives } from '../Controllers/admin.js';
import { cancelTestDrive } from '../Controllers/testdrive.js';
const router = express.Router();

router.get("/:userId", getAdmin);
router.post("/admintestdrives", getAdminTestDrives);
router.put("/updatestatus", updateTestDriveStatus);
router.delete("/canceltestdrive", cancelTestDrive);
router.get("/dashboarddata/:userId", getDashboardData);
export default router;