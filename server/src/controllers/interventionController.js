import { InterventionHistory } from '../models/InterventionHistory.js';
import * as aiService from '../services/aiService.js';

// @desc    Generate a custom mental wellness intervention guide
// @route   POST /api/interventions
export const generateInterventionGuide = async (req, res, next) => {
  try {
    const { category, reason } = req.body;

    const validCategories = ['breathing', 'grounding', 'anti-procrastination', 'recovery', 'sleep-reset', 'confidence-reboot'];
    
    let normalizedCategory = category || 'breathing';
    if (!validCategories.includes(normalizedCategory)) {
      normalizedCategory = 'breathing';
    }

    // Map frontend short names to prompt categories
    let promptCategory = 'stress';
    if (normalizedCategory === 'breathing') promptCategory = 'panic';
    if (normalizedCategory === 'grounding') promptCategory = 'panic';
    if (normalizedCategory === 'anti-procrastination') promptCategory = 'focus';
    if (normalizedCategory === 'sleep-reset') promptCategory = 'sleep';
    if (normalizedCategory === 'confidence-reboot') promptCategory = 'confidence';
    if (normalizedCategory === 'recovery') promptCategory = 'stress';

    const defaultReason = `Self-initiated reset for exam-prep stress categories.`;
    const actualReason = reason || defaultReason;

    // Call AI to construct custom sequence
    let guide;
    try {
      guide = await aiService.generateIntervention(promptCategory, actualReason, req.user);
    } catch (aiErr) {
      console.error('Failed to generate intervention, using default values:', aiErr);
      guide = {
        title: '3-Step Centering Breathing',
        reason: actualReason,
        duration: '2 minutes',
        category: promptCategory,
        steps: [
          'Inhale slowly through your nose for 4 counts.',
          'Hold the breath gently at the top for 4 counts.',
          'Exhale fully through your mouth for 6 counts, releasing all body tension.'
        ]
      };
    }

    // Save in history
    const record = await InterventionHistory.create({
      userId: req.user._id,
      interventionType: normalizedCategory,
      title: guide.title || 'Wellness Reset',
      reason: actualReason,
      completed: false
    });

    res.status(201).json({
      recordId: record._id,
      title: record.title,
      reason: record.reason,
      duration: guide.duration || '3 minutes',
      steps: guide.steps || [],
      category: normalizedCategory
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark an intervention as completed
// @route   PUT /api/interventions/:id/complete
export const completeIntervention = async (req, res, next) => {
  try {
    const record = await InterventionHistory.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Intervention record not found.' });
    }

    res.json({
      message: 'Intervention marked as completed.',
      record
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's intervention history
// @route   GET /api/interventions
export const getInterventionHistory = async (req, res, next) => {
  try {
    const history = await InterventionHistory.find({ userId: req.user._id });
    res.json(history);
  } catch (err) {
    next(err);
  }
};
