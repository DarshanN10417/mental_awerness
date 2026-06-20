import express from 'express';
import { submitJournal, getJournalEntries, getInsights, getJournalInsight } from '../controllers/journalController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, submitJournal);
router.get('/', auth, getJournalEntries);
router.get('/insights', auth, getInsights);
router.get('/:id/insight', auth, getJournalInsight);

export default router;
