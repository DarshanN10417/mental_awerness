import { WeeklyReport } from '../models/WeeklyReport.js';
import { MoodLog } from '../models/MoodLog.js';
import { JournalInsight } from '../models/JournalInsight.js';
import * as aiService from '../services/aiService.js';

// @desc    Get or generate the weekly AI wellness report
// @route   GET /api/reports/weekly
export const getWeeklyReport = async (req, res, next) => {
  try {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    // Look for an existing report created in the last 3 days to avoid duplicate API calls
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);

    const existingReport = await WeeklyReport.findOne({
      userId: req.user._id,
      createdAt: { $gte: threeDaysAgo }
    });

    if (existingReport) {
      return res.json(existingReport);
    }

    // If no recent report, gather data from the last 7 days
    const moodLogs = await MoodLog.find({
      userId: req.user._id,
      createdAt: { $gte: oneWeekAgo }
    });

    const insights = await JournalInsight.find({
      userId: req.user._id,
      createdAt: { $gte: oneWeekAgo }
    });

    // Generate weekly report via AI
    let reportData;
    try {
      reportData = await aiService.generateWeeklyReport(req.user, moodLogs, insights);
    } catch (aiErr) {
      console.error('Failed to generate weekly report via AI:', aiErr);
      reportData = {
        summary: 'Your weekly report is ready. You have shown strong commitment by logging your mood levels regularly.',
        riskLevel: 'medium',
        strengths: ['Consistent daily mood checking', 'Acknowledging stressors'],
        stressPatterns: ['Routine exam fatigue'],
        aiRecommendations: ['Maintain a regular sleep schedule', 'Incorporate short 2-minute stretch breaks']
      };
    }

    // Save report in database
    const newReport = await WeeklyReport.create({
      userId: req.user._id,
      weekStart: oneWeekAgo,
      weekEnd: today,
      summary: reportData.summary,
      riskLevel: reportData.riskLevel || 'low',
      strengths: reportData.strengths || [],
      stressPatterns: reportData.stressPatterns || [],
      aiRecommendations: reportData.aiRecommendations || []
    });

    res.status(201).json(newReport);
  } catch (err) {
    next(err);
  }
};
