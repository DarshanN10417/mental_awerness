import express from 'express';
import { sendMessage, getChatHistory, clearChatHistory } from '../controllers/chatController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, sendMessage);
router.get('/', auth, getChatHistory);
router.delete('/', auth, clearChatHistory);

export default router;
