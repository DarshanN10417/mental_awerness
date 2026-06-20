import express from 'express';
import {
  generateInterventionGuide,
  completeIntervention,
  getInterventionHistory
} from '../controllers/interventionController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, generateInterventionGuide);
router.put('/:id/complete', auth, completeIntervention);
router.get('/', auth, getInterventionHistory);

export default router;
