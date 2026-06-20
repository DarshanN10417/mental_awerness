import mongoose from 'mongoose';
import { makeResilientModel } from '../config/db.js';

const MoodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: Number, required: true, min: 1, max: 10 },
  energy: { type: Number, required: true, min: 1, max: 10 },
  focus: { type: Number, required: true, min: 1, max: 10 },
  anxiety: { type: Number, required: true, min: 1, max: 10 },
  sleepQuality: { type: Number, required: true, min: 1, max: 10 },
  studyHours: { type: Number, default: 0 },
  studySatisfaction: { type: Number, default: 5, min: 1, max: 10 },
  stressor: { type: String, default: 'None' },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongoMoodLog = mongoose.model('MoodLog', MoodLogSchema);
export const MoodLog = makeResilientModel('MoodLog', MongoMoodLog);
