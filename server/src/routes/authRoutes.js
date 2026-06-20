import express from 'express';
import { signup, login, getMe, updateProfile } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public auth routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile); // Support profile updates under /api/auth/profile or /api/users/profile

export default router;
