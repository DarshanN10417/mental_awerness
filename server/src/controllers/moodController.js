import { MoodLog } from '../models/MoodLog.js';

// @desc    Create a new daily check-in (mood log)
// @route   POST /api/mood
export const logMood = async (req, res, next) => {
  try {
    const { mood, energy, focus, anxiety, sleepQuality, studyHours, studySatisfaction, stressor, note } = req.body;

    if (mood === undefined || energy === undefined || focus === undefined || anxiety === undefined || sleepQuality === undefined) {
      return res.status(400).json({ message: 'Please provide all required scaling scores (mood, energy, focus, anxiety, sleepQuality).' });
    }

    // Save mood check-in
    const newLog = await MoodLog.create({
      userId: req.user._id,
      mood: Number(mood),
      energy: Number(energy),
      focus: Number(focus),
      anxiety: Number(anxiety),
      sleepQuality: Number(sleepQuality),
      studyHours: studyHours !== undefined ? Number(studyHours) : 0,
      studySatisfaction: studySatisfaction !== undefined ? Number(studySatisfaction) : 5,
      stressor: stressor || 'None',
      note: note || ''
    });

    res.status(201).json({
      message: 'Daily check-in logged successfully.',
      log: newLog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all daily mood check-ins for the active user
// @route   GET /api/mood
export const getMoodLogs = async (req, res, next) => {
  try {
    const logs = await MoodLog.find({ userId: req.user._id });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

// @desc    Get brief analytics statistics
// @route   GET /api/mood/analytics
export const getMoodAnalytics = async (req, res, next) => {
  try {
    const logs = await MoodLog.find({ userId: req.user._id });
    
    if (logs.length === 0) {
      return res.json({
        totalLogs: 0,
        averageMood: 0,
        averageAnxiety: 0,
        averageStudyHours: 0,
        averageSleepQuality: 0,
        averageFocus: 0,
        streakDays: 0
      });
    }

    let totalMood = 0;
    let totalAnxiety = 0;
    let totalStudyHours = 0;
    let totalSleep = 0;
    let totalFocus = 0;

    logs.forEach(l => {
      totalMood += l.mood;
      totalAnxiety += l.anxiety;
      totalStudyHours += l.studyHours || 0;
      totalSleep += l.sleepQuality;
      totalFocus += l.focus;
    });

    const count = logs.length;

    // Simple streak calculator based on creation dates
    let streak = 0;
    const sortedDates = logs
      .map(l => new Date(l.createdAt).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i); // unique dates
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
      let currentCheck = sortedDates.includes(today) ? new Date() : new Date(Date.now() - 86400000);
      while (true) {
        if (sortedDates.includes(currentCheck.toDateString())) {
          streak++;
          currentCheck.setDate(currentCheck.getDate() - 1);
        } else {
          break;
        }
      }
    }

    res.json({
      totalLogs: count,
      averageMood: parseFloat((totalMood / count).toFixed(1)),
      averageAnxiety: parseFloat((totalAnxiety / count).toFixed(1)),
      averageStudyHours: parseFloat((totalStudyHours / count).toFixed(1)),
      averageSleepQuality: parseFloat((totalSleep / count).toFixed(1)),
      averageFocus: parseFloat((totalFocus / count).toFixed(1)),
      streakDays: streak
    });
  } catch (err) {
    next(err);
  }
};
