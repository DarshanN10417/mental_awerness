import mongoose from 'mongoose';
import { makeResilientModel } from '../config/db.js';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  examType: { 
    type: String, 
    enum: ['JEE', 'NEET', 'CAT', 'GATE', 'UPSC', 'CUET', 'custom'],
    default: 'custom' 
  },
  examDate: { type: Date, required: true },
  supportStyle: { 
    type: String, 
    enum: ['gentle', 'motivational', 'structured', 'calm mentor'],
    default: 'calm mentor'
  },
  dailyStudyHours: { type: Number, default: 8 },
  sleepHours: { type: Number, default: 7 },
  baselineStress: { type: Number, default: 5 }, // 1 to 10
  emergencyContact: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.model('User', UserSchema);
export const User = makeResilientModel('User', MongoUser);
