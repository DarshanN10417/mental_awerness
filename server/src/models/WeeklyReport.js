import mongoose from 'mongoose';
import { makeResilientModel } from '../config/db.js';

const WeeklyReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  summary: { type: String, required: true },
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'low', 'moderate'], default: 'low' },
  strengths: [{ type: String }],
  stressPatterns: [{ type: String }],
  aiRecommendations: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const MongoWeeklyReport = mongoose.model('WeeklyReport', WeeklyReportSchema);
export const WeeklyReport = makeResilientModel('WeeklyReport', MongoWeeklyReport);
