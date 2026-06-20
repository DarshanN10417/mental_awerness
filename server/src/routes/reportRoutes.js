import express from 'express';
import { getWeeklyReport } from '../controllers/reportController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/weekly', auth, getWeeklyReport);

export default router;
