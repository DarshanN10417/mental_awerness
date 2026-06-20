import express from 'express';
import { logMood, getMoodLogs, getMoodAnalytics } from '../controllers/moodController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, logMood);
router.get('/', auth, getMoodLogs);
router.get('/analytics', auth, getMoodAnalytics);

export default router;
