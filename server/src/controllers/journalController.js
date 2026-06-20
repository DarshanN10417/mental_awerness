import { JournalEntry } from '../models/JournalEntry.js';
import { JournalInsight } from '../models/JournalInsight.js';
import * as aiService from '../services/aiService.js';

// @desc    Submit a new student journal entry and analyze it
// @route   POST /api/journal
export const submitJournal = async (req, res, next) => {
  try {
    const { content, title } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Journal content cannot be empty.' });
    }

    // 1. Save raw journal entry
    const entry = await JournalEntry.create({
      userId: req.user._id,
      title: title || 'Reflection',
      content
    });

    // 2. Perform AI Analysis (utilizing the model's user profile details)
    let insightData;
    try {
      insightData = await aiService.analyzeJournal(req.user, content);
    } catch (aiError) {
      console.error('Failed AI journal analysis, saving default fallback:', aiError);
      insightData = {
        summary: 'Journal saved. AI analysis failed or timed out.',
        emotions_detected: ['Reflective'],
        stress_triggers: ['Syllabus stress'],
        negative_patterns: ['Overthinking'],
        positive_patterns: ['Writing routine'],
        burnout_risk: 30,
        severity_score: 3,
        recommended_support_type: req.user.supportStyle,
        suggested_actions: ['Take a 5-minute break', 'Write out a small study block']
      };
    }

    // 3. Save insight
    const insight = await JournalInsight.create({
      journalEntryId: entry._id,
      userId: req.user._id,
      summary: insightData.summary,
      emotionsDetected: insightData.emotions_detected || [],
      stressTriggers: insightData.stress_triggers || [],
      negativePatterns: insightData.negative_patterns || [],
      positivePatterns: insightData.positive_patterns || [],
      burnoutRisk: Number(insightData.burnout_risk) || 0,
      severityScore: Number(insightData.severity_score) || 1,
      recommendedSupportType: insightData.recommended_support_type || req.user.supportStyle,
      suggestedActions: insightData.suggested_actions || []
    });

    // 4. Return both, flagging safety alerts if severity score is high (>= 8)
    const triggerSafetyAlert = insight.severityScore >= 8;

    res.status(201).json({
      entry,
      insight,
      safetyAlert: triggerSafetyAlert,
      message: triggerSafetyAlert 
        ? 'High stress/distress pattern detected. Activating wellness guidance.' 
        : 'Reflection saved and analyzed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all journal entries for the active user
// @route   GET /api/journal
export const getJournalEntries = async (req, res, next) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user._id });
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all analyzed insights for the active user
// @route   GET /api/insights
export const getInsights = async (req, res, next) => {
  try {
    const insights = await JournalInsight.find({ userId: req.user._id });
    res.json(insights);
  } catch (err) {
    next(err);
  }
};

// @desc    Get insight for a specific journal entry
// @route   GET /api/journal/:id/insight
export const getJournalInsight = async (req, res, next) => {
  try {
    const insight = await JournalInsight.findOne({ 
      userId: req.user._id, 
      journalEntryId: req.params.id 
    });
    
    if (!insight) {
      return res.status(404).json({ message: 'Insight not found for this journal entry.' });
    }
    
    res.json(insight);
  } catch (err) {
    next(err);
  }
};
