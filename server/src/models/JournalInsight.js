import mongoose from "mongoose";
import { makeResilientModel } from '../config/db.js';

const journalInsightSchema = new mongoose.Schema(
  {
    journalEntryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JournalEntry",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    summary: {
      type: String,
      default: "",
    },
    emotionsDetected: {
      type: [String],
      default: [],
    },
    stressTriggers: {
      type: [String],
      default: [],
    },
    negativePatterns: {
      type: [String],
      default: [],
    },
    positivePatterns: {
      type: [String],
      default: [],
    },
    burnoutRisk: {
      type: Number,
      default: 0,
    },
    severityScore: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    },
    recommendedSupportType: {
      type: String,
      default: "",
    },
    suggestedActions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const MongoJournalInsight = mongoose.model("JournalInsight", journalInsightSchema);
export const JournalInsight = makeResilientModel('JournalInsight', MongoJournalInsight);
export default JournalInsight;