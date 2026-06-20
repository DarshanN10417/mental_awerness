import mongoose from 'mongoose';
import { makeResilientModel } from '../config/db.js';

const ChatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'model', 'assistant'], required: true },
  message: { type: String, required: true },
  aiContextSnapshot: {
    examPhase: { type: String },
    moodBaseline: { type: Number },
    recentBurnoutRisk: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

const MongoChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
export const ChatMessage = makeResilientModel('ChatMessage', MongoChatMessage);
