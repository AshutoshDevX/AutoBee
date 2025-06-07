import express from 'express';
import { getAdmin } from '../Controllers/admin.js';

const router = express.Router();

router.get("/:userId", getAdmin);

export default router;