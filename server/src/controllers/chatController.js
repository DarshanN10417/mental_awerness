import { ChatMessage } from '../models/ChatMessage.js';
import { MoodLog } from '../models/MoodLog.js';
import { JournalInsight } from '../models/JournalInsight.js';
import { calculateExamPhase } from '../services/examPhaseEngine.js';
import * as aiService from '../services/aiService.js';

// @desc    Send a message to SprintBuddy and get an empathetic response
// @route   POST /api/chat
export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message content cannot be empty.' });
    }

    // 1. Fetch recent context for the prompt builder
    // Fetch last 3 mood logs
    const moodLogs = await MoodLog.find({ userId: req.user._id });
    const recentMoods = moodLogs.slice(0, 3);
    
    // Fetch last 2 journal insights
    const insights = await JournalInsight.find({ userId: req.user._id });
    const recentInsights = insights.slice(0, 2);

    // Calculate current exam phase
    const averageBurnout = recentInsights.length > 0
      ? recentInsights.reduce((acc, curr) => acc + curr.burnoutRisk, 0) / recentInsights.length
      : 0;
    const phaseInfo = calculateExamPhase(
      req.user.examDate, 
      req.user.dailyStudyHours, 
      req.user.baselineStress, 
      averageBurnout
    );

    // 2. Fetch past chat history (last 10 messages for context)
    const chatHistory = await ChatMessage.find({ userId: req.user._id });
    const last10Messages = chatHistory.slice(0, 10).reverse(); // Sort so chronologically oldest is first

    // 3. Save User Message
    const userMsg = await ChatMessage.create({
      userId: req.user._id,
      role: 'user',
      message
    });

    // 4. Generate AI response
    let botReplyText = '';
    try {
      botReplyText = await aiService.generateChatBuddyResponse(
        req.user,
        phaseInfo.phase,
        recentMoods,
        recentInsights,
        last10Messages,
        message
      );
    } catch (aiErr) {
      console.error('Chat response generation failed:', aiErr);
      botReplyText = 'I am here. Take a gentle breath. Let us deal with this one small step at a time. What is one tiny thing causing you pressure right now?';
    }

    // 5. Save AI Message
    const botMsg = await ChatMessage.create({
      userId: req.user._id,
      role: 'assistant',
      message: botReplyText,
      aiContextSnapshot: {
        examPhase: phaseInfo.phase,
        moodBaseline: req.user.baselineStress,
        recentBurnoutRisk: Math.round(averageBurnout)
      }
    });

    res.status(201).json({
      userMessage: userMsg,
      assistantMessage: botMsg
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complete chat history for active user
// @route   GET /api/chat
export const getChatHistory = async (req, res, next) => {
  try {
    // Return sorted oldest to newest for direct display
    const chat = await ChatMessage.find({ userId: req.user._id });
    res.json(chat.reverse()); // Reverse to get chronological order from mongoose sort
  } catch (err) {
    next(err);
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat
export const clearChatHistory = async (req, res, next) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id });
    res.json({ message: 'Conversation history cleared.' });
  } catch (err) {
    next(err);
  }
};
