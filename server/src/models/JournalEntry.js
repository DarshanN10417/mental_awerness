import mongoose from 'mongoose';
import { makeResilientModel } from '../config/db.js';

const JournalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongoJournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);
export const JournalEntry = makeResilientModel('JournalEntry', MongoJournalEntry);
