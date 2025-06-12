import express from 'express';
import { getDealerShipInfo, saveWorkingHours, updateUserRole } from '../Controllers/settings.js';
import { getUsers } from '../Controllers/settings.js';
const router = express.Router();

router.get("/:userId", getDealerShipInfo);
router.get("/users/:userId", getUsers);
router.post("/workinghours", saveWorkingHours);
router.put("/updaterole", updateUserRole);
export default router;