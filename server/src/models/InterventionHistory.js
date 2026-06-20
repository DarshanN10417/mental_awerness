import mongoose from 'mongoose';
import { makeResilientModel } from '../config/db.js';

const InterventionHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interventionType: { 
    type: String, 
    enum: ['breathing', 'grounding', 'anti-procrastination', 'recovery', 'sleep-reset', 'confidence-reboot'], 
    required: true 
  },
  title: { type: String, required: true },
  reason: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MongoInterventionHistory = mongoose.model('InterventionHistory', InterventionHistorySchema);
export const InterventionHistory = makeResilientModel('InterventionHistory', MongoInterventionHistory);
