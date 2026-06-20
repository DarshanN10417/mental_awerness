import { MoodLog } from '../models/MoodLog.js';
import { JournalInsight } from '../models/JournalInsight.js';
import { calculateExamPhase } from '../services/examPhaseEngine.js';
import * as aiService from '../services/aiService.js';

// @desc    Get consolidated dashboard metrics and Tomorrow Shield predictions
// @route   GET /api/dashboard
export const getDashboardData = async (req, res, next) => {
  try {
    const todayStr = new Date().toDateString();
    
    // 1. Fetch today's mood log
    const logs = await MoodLog.find({ userId: req.user._id });
    const todayLog = logs.find(l => new Date(l.createdAt).toDateString() === todayStr);

    // 2. Fetch latest journal insight
    const insights = await JournalInsight.find({ userId: req.user._id });
    const latestInsight = insights.length > 0 ? insights[0] : null;

    // 3. Compute Burnout Risk and Focus Consistency
    let burnoutRisk = latestInsight ? latestInsight.burnoutRisk : 25; // default baseline
    
    // Dynamic fallback calculation if no journal is logged but mood check-ins exist
    if (logs.length > 0) {
      const avgAnxiety = logs.slice(0, 5).reduce((acc, curr) => acc + curr.anxiety, 0) / Math.min(logs.length, 5);
      const avgSleep = logs.slice(0, 5).reduce((acc, curr) => acc + curr.sleepQuality, 0) / Math.min(logs.length, 5);
      // More anxiety + less sleep = higher burnout
      const calculatedRisk = Math.round((avgAnxiety * 7) + ((10 - avgSleep) * 3));
      burnoutRisk = Math.min(Math.max(calculatedRisk, burnoutRisk), 100);
    }

    // Focus consistency score: (average focus / 10) * 100, adjusting for study satisfaction
    let focusScore = 75; // default
    if (logs.length > 0) {
      const recentLogs = logs.slice(0, 5);
      const sumFocus = recentLogs.reduce((acc, curr) => acc + curr.focus, 0);
      const sumSatisfaction = recentLogs.reduce((acc, curr) => acc + curr.studySatisfaction, 0);
      focusScore = Math.round(((sumFocus / recentLogs.length) * 6) + ((sumSatisfaction / recentLogs.length) * 4) * 10);
      focusScore = Math.min(Math.max(focusScore, 10), 100);
    }

    // 4. Calculate Exam Phase Details
    const phaseInfo = calculateExamPhase(
      req.user.examDate,
      req.user.dailyStudyHours,
      req.user.baselineStress,
      burnoutRisk
    );

    // 5. Generate Tomorrow Shield
    let tomorrowShield = null;
    let shieldUnlocked = false;

    if (todayLog) {
      shieldUnlocked = true;
      try {
        tomorrowShield = await aiService.generateTomorrowShield(
          req.user,
          phaseInfo.phase,
          todayLog.mood,
          todayLog.stressor,
          todayLog.studyHours,
          latestInsight
        );
      } catch (shieldErr) {
        console.error('Failed to generate Tomorrow Shield card:', shieldErr);
        tomorrowShield = {
          challenge_prediction: 'Fatigue from dense study sessions.',
          thing_to_avoid: 'Postponing breaks when head starts feeling heavy.',
          mindset_reminder: 'Every bit of focused effort is a building block for your exam day.',
          tiny_wellness_action: 'Take 2 minutes for shoulder rolls and deep breathing.',
          study_adjustment: 'Begin with your most comfortable sub-topic to gain momentum.'
        };
      }
    }

    // 6. Action items checklist for today
    const actionPlan = [];
    if (!todayLog) {
      actionPlan.push({ text: 'Log your mood & focus metrics to unlock the Tomorrow Shield.', action: 'log-mood' });
    }
    if (!latestInsight || new Date(latestInsight.createdAt).toDateString() !== todayStr) {
      actionPlan.push({ text: 'Write a short journal reflection about today\'s revision.', action: 'write-journal' });
    }
    
    // Phase-specific dashboard tips
    if (phaseInfo.phase === 'FINAL_COUNTDOWN') {
      actionPlan.push({ text: 'Execute the 2-minute anxiety breathing grounding exercise.', action: 'take-reset' });
      actionPlan.push({ text: 'Keep study hours under 6 hours and wind down early.', action: 'info' });
    } else if (burnoutRisk > 60) {
      actionPlan.push({ text: 'Burnout risk is elevated. Start the Procrastination Interrupt exercise.', action: 'take-reset' });
    } else {
      actionPlan.push({ text: 'Initiate a quick mental centering check-in before studying.', action: 'take-reset' });
    }

    res.json({
      todayCheckInLogged: !!todayLog,
      todayMetrics: todayLog || null,
      burnoutRisk,
      focusScore,
      phaseInfo,
      actionPlan,
      latestInsight,
      shieldUnlocked,
      tomorrowShield
    });
  } catch (err) {
    next(err);
  }
};
