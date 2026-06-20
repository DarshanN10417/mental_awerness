import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  makeJournalAnalysisPrompt,
  makeChatBuddyPrompt,
  makeWeeklyReportPrompt,
  makeTomorrowShieldPrompt,
  makeInterventionPrompt
} from '../prompts/templates.js';

// Helper to clean JSON string from Markdown wraps if present
const parseStructuredJSON = (text) => {
  try {
    let clean = text.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```json\s*/i, '');
      clean = clean.replace(/^```\s*/, '');
      clean = clean.replace(/```$/, '');
    }
    return JSON.parse(clean.trim());
  } catch (error) {
    console.error('Failed to parse AI JSON, returning raw text or structure. Error:', error.message);
    throw error;
  }
};

// Check if we should use mock outputs
const useMock = () => {
  return process.env.USE_MOCK_AI === 'true' || !process.env.GEMINI_API_KEY;
};

// Initialize Gemini
let model;
if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

// 1. Analyze Journal Entry
export const analyzeJournal = async (userProfile, content) => {
  if (useMock()) {
    console.log('AI_SERVICE: Using mock journal analysis.');
    
    // Custom mock analysis depending on keywords in the content
    const text = content.toLowerCase();
    let severity = 3;
    let burnout = 20;
    const emotions = ['Reflective'];
    const triggers = ['Exam pressure'];
    const negatives = ['Overthinking'];
    const positives = ['Self-reflection'];
    
    if (text.includes('physics') || text.includes('math') || text.includes('solve')) {
      triggers.push('Academic problem solving difficulties');
      emotions.push('Frustrated');
    }
    if (text.includes('sleep') || text.includes('tired') || text.includes('exhausted')) {
      triggers.push('Sleep schedule disruption');
      emotions.push('Fatigued');
      burnout += 30;
      severity += 2;
    }
    if (text.includes('mock') || text.includes('test') || text.includes('score') || text.includes('rank')) {
      triggers.push('Mock test score drop');
      emotions.push('Anxious');
      negatives.push('Comparison with peers');
      severity += 2;
    }
    if (text.includes('parent') || text.includes('father') || text.includes('mother') || text.includes('family')) {
      triggers.push('Family expectation pressure');
      negatives.push('Fear of disappointing family');
      severity += 1;
    }
    if (text.includes('fail') || text.includes('behind') || text.includes('wasting')) {
      emotions.push('Guilt');
      negatives.push('Procrastination guilt');
      burnout += 20;
      severity += 1;
    }
    
    // Safety triggers
    if (text.includes('give up') || text.includes('hopeless') || text.includes('die') || text.includes('disappear') || text.includes('end this') || text.includes('can\'t do this anymore')) {
      severity = 9; // Triggers safety block
      emotions.push('Severely Overwhelmed');
      negatives.push('Hopelessness indicators');
    }

    if (emotions.length === 1) emotions.push('Apprehensive');
    
    return {
      summary: `Student expresses ${emotions.join(' and ').toLowerCase()} feelings regarding ${triggers[0].toLowerCase()}.`,
      emotions_detected: emotions,
      stress_triggers: triggers,
      negative_patterns: negatives,
      positive_patterns: positives,
      burnout_risk: Math.min(burnout, 100),
      recommended_support_type: severity > 7 ? 'gentle' : userProfile.supportStyle || 'calm mentor',
      suggested_actions: [
        'Take a 10-minute mindful breathing break right now.',
        'Review your study block for tomorrow and reduce it by 20% to restore focus.',
        'Reach out to a study partner or trusted friend to talk about non-exam topics.'
      ],
      severity_score: Math.min(severity, 10)
    };
  }

  try {
    const prompt = makeJournalAnalysisPrompt(userProfile, content);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return parseStructuredJSON(responseText);
  } catch (error) {
    console.error('Gemini API Journal Analysis error:', error);
    // Dynamic fallback if API fails
    return {
      summary: 'Analysis failed, displaying temporary safety evaluation.',
      emotions_detected: ['Stressed'],
      stress_triggers: ['Exam pressure'],
      negative_patterns: ['Anxious loop'],
      positive_patterns: ['Writing journal'],
      burnout_risk: 40,
      recommended_support_type: 'calm mentor',
      suggested_actions: ['Practice 2-minute breathing reset.', 'Review daily logs.'],
      severity_score: 4
    };
  }
};

// 2. SprintBuddy Chatbot Companion
export const generateChatBuddyResponse = async (userProfile, currentPhase, recentMoodLogs, recentInsights, chatHistory, userMessage) => {
  if (useMock()) {
    console.log('AI_SERVICE: Using mock chatbot response.');
    const text = userMessage.toLowerCase();
    
    // Safety check in chatbot
    if (text.includes('hopeless') || text.includes('die') || text.includes('disappear') || text.includes('self-harm') || text.includes('suicide') || text.includes('kill myself') || text.includes('end my life')) {
      return `I hear how incredibly heavy things feel right now, and I want you to know you don't have to carry this alone. Please know that your life and well-being are far more important than any exam. I strongly encourage you to reach out to a trusted loved one or contact a professional support service immediately (like the resources in our Safety tab). Let's take a deep breath together. I'm here to support you safely.`;
    }

    if (text.includes('focus') || text.includes('concentrate') || text.includes('distracted')) {
      return `It's completely normal to lose focus, especially in the ${currentPhase} phase. Let's do a 2-minute reset: close your eyes, take three deep breaths, and commit to studying just one simple topic for 15 minutes. No pressure. Shall we try a micro-breathing reset?`;
    }
    if (text.includes('mock') || text.includes('test') || text.includes('score') || text.includes('mark') || text.includes('rank')) {
      return `Mock scores are diagnostic tools, not a final verdict on your potential. In this ${currentPhase} phase, scores can fluctuate due to fatigue. Instead of focusing on the final number, let's pick just two specific mistakes from this test, review them, and let the rest go for tonight. You are learning.`;
    }
    if (text.includes('behind') || text.includes('comparison') || text.includes('everyone else')) {
      return `Comparison is a quick way to exhaust your mental energy. Everyone highlights their progress and hides their struggles. Focus entirely on your own track—improving by just 1% today is a massive win. You are exactly where you need to be.`;
    }
    if (text.includes('panic') || text.includes('scared') || text.includes('anxious') || text.includes('nervous')) {
      return `I hear you, and it's okay to feel scared. Panic is just your body trying to protect you from the importance of this exam. Let's ground ourselves: name 3 things you can see in your room and exhale slowly. You've prepared for this, and we can handle this step-by-step.`;
    }
    
    // Default empathetic response matching support style
    const style = userProfile.supportStyle || 'calm mentor';
    if (style === 'motivational') {
      return `You've got this! The ${currentPhase} phase builds the mental muscles you need. Focus on one small block, push aside the doubt, and take action. What's one quick topic we can conquer right now?`;
    } else if (style === 'gentle') {
      return `It sounds like you've been working so hard, and you might just be tired. Please be kind to yourself today. It is completely okay to take a break and rest. You are doing enough.`;
    } else if (style === 'structured') {
      return `Understood. In this ${currentPhase} phase, let's structure your approach: 1) Identify today's top stressor, 2) Break study tasks into 25-minute Pomodoros, 3) Set a hard stop time for sleep. What is your primary focus block for the next hour?`;
    } else {
      return `As your wellness companion, I want to remind you that your exam is a journey, not a single day. In the ${currentPhase} phase, managing fatigue is just as important as studying. Let's take a deep breath and outline one small adjustment we can make today.`;
    }
  }

  try {
    const prompt = makeChatBuddyPrompt(userProfile, currentPhase, recentMoodLogs, recentInsights, chatHistory, userMessage);
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API Chat Response error:', error);
    return 'I am here with you. Take a slow deep breath. Let us tackle one small challenge at a time.';
  }
};

// 3. Generate Weekly AI Report
export const generateWeeklyReport = async (userProfile, moodLogs, insights) => {
  if (useMock()) {
    console.log('AI_SERVICE: Using mock weekly report.');
    return {
      summary: `This week, the student preparing for ${userProfile.examType} maintained a steady focus, though mood logs reveal heightened stress triggers on review days. Workload fatigue is present but manageable.`,
      riskLevel: 'medium',
      strengths: [
        'Consistently logged study hours close to the baseline goal.',
        'Actively journaled to process negative emotional loops.'
      ],
      stressPatterns: [
        'Anxiety peaks visible during exam countdown pressure.',
        'Drop in sleep quality on nights preceding mock tests.'
      ],
      aiRecommendations: [
        'Establish a mock test cooldown routine: 15 minutes of relaxation post-exam before looking at answers.',
        'Aim for a hard stop on studies at least 60 minutes before bed to stabilize sleep.',
        'Utilize the 2-minute breathing reset between study sessions.'
      ]
    };
  }

  try {
    const prompt = makeWeeklyReportPrompt(userProfile, moodLogs, insights);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return parseStructuredJSON(responseText);
  } catch (error) {
    console.error('Gemini API Weekly Report error:', error);
    return {
      summary: 'Temporary weekly report generated due to service limitation.',
      riskLevel: 'low',
      strengths: ['Staying consistent with logs.'],
      stressPatterns: ['Routine exam anxiety.'],
      aiRecommendations: ['Take regular breaks.', 'Maintain steady sleep hours.']
    };
  }
};

// 4. Tomorrow Shield Predictor
export const generateTomorrowShield = async (userProfile, currentPhase, todayMood, todayStressor, todayStudyHours, recentInsights) => {
  if (useMock()) {
    console.log('AI_SERVICE: Using mock Tomorrow Shield.');
    return {
      challenge_prediction: `Anxiety regarding mock performance or comparison with other ${userProfile.examType} aspirants.`,
      thing_to_avoid: 'Re-evaluating full test papers late in the evening when your mind is fatigued.',
      mindset_reminder: 'Your score does not measure your intelligence, only your current alignment with the test structure. You are improving.',
      tiny_wellness_action: 'Spend 2 minutes stretching your shoulders and neck after your first morning session.',
      study_adjustment: 'Begin your day with your strongest, most comfortable sub-topic to build immediate momentum.'
    };
  }

  try {
    const prompt = makeTomorrowShieldPrompt(userProfile, currentPhase, todayMood, todayStressor, todayStudyHours, recentInsights);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return parseStructuredJSON(responseText);
  } catch (error) {
    console.error('Gemini API Tomorrow Shield error:', error);
    return {
      challenge_prediction: 'General study tiredness or pressure build-up.',
      thing_to_avoid: 'Skipping meals or ignoring physical fatigue.',
      mindset_reminder: 'You are capable of handling today’s schedule piece by piece.',
      tiny_wellness_action: 'Take 2 minutes to step away from your desk and stretch.',
      study_adjustment: 'Divide long chapters into smaller, bite-sized revision segments.'
    };
  }
};

// 5. Wellness Intervention Creator
export const generateIntervention = async (category, reason, userProfile) => {
  if (useMock()) {
    console.log('AI_SERVICE: Using mock wellness intervention.');
    
    const responses = {
      'stress': {
        title: 'Mock-Test Disappointment Reset',
        reason: 'Recommended due to high anxiety surrounding mock examination metrics.',
        duration: '5 minutes',
        category: 'stress',
        steps: [
          'Close your exam workbook. Push your chair back, sit upright, and plant both feet flat on the floor.',
          'Inhale deeply for 4 seconds, hold for 4 seconds, exhale for 6 seconds. Repeat this cycle 5 times.',
          'Remind yourself: "This score is code diagnostics. It shows me what gaps to bridge, not what my worth is."',
          'Write down exactly 2 concepts you will review tomorrow. Do not study them now. Close your notebook and step away.'
        ]
      },
      'focus': {
        title: 'Procrastination Interrupt Routine',
        reason: 'Recommended to help you overcome study fatigue or high barriers to starting.',
        duration: '3 minutes',
        category: 'focus',
        steps: [
          'Choose the absolute smallest sub-task on your plate. For example, "read just one paragraph" or "solve one formula".',
          'Set a timer for exactly 5 minutes. Promise yourself you can stop when the timer rings.',
          'Clear your desk of all books except the one for this specific task. Put your phone in another room.',
          'Press start and begin. Initiating is 90% of the battle.'
        ]
      },
      'panic': {
        title: '5-4-3-2-1 Sensory Grounding',
        reason: 'Recommended for instant calming during acute exam anxiety or panic attacks.',
        duration: '2 minutes',
        category: 'panic',
        steps: [
          'Look around and name 5 things you can see (e.g. your pen, desk, lamp, window, book).',
          'Name 4 things you can physically feel (e.g. the chair against your back, your feet on the ground, the texture of your desk).',
          'Name 3 things you can hear (e.g. traffic outside, the fan spinning, birds chirping).',
          'Name 2 things you can smell (e.g. coffee, paper, fresh air).',
          'Name 1 positive quality about yourself (e.g. "I am resilient"). Take one long, slow breath.'
        ]
      },
      'sleep': {
        title: 'Pre-Sleep Mind Declutter',
        reason: 'Recommended to calm an overactive mind and prepare for restorative sleep.',
        duration: '4 minutes',
        category: 'sleep',
        steps: [
          'Take a blank sheet of paper and write down everything you need to study tomorrow. Get it out of your head.',
          'Fold the paper and put it away. Say to yourself: "Today’s work is done. Tomorrow is planned. I can safely rest now."',
          'Lie down and do a progressive muscle relaxation: tense your feet for 5 seconds, then relax. Tense your legs, then relax. Work your way up to your shoulders.',
          'Breathe slowly, focusing only on the cool air entering your nose and warm air leaving.'
        ]
      },
      'confidence': {
        title: 'Imposter Syndrome Reboot',
        reason: 'Recommended to counter peer comparison and low-confidence tendencies.',
        duration: '3 minutes',
        category: 'confidence',
        steps: [
          'List 3 challenging exam topics you already mastered or understand better now than you did three months ago.',
          'Acknowledge the effort: "I have showed up consistently. That effort counts, and I am building capacity every single day."',
          'Write down a single focus area for today. Ignore the overall syllabus scope for the next two hours.'
        ]
      }
    };

    return responses[category] || responses['stress'];
  }

  try {
    const prompt = makeInterventionPrompt(category, reason, userProfile);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return parseStructuredJSON(responseText);
  } catch (error) {
    console.error('Gemini API Intervention error:', error);
    return {
      title: 'Simple Rest Reset',
      reason: 'Take a break from active studying.',
      duration: '5 minutes',
      category: category,
      steps: ['Sit back and close your eyes.', 'Focus on your breath.', 'Resume with single-minded focus.']
    };
  }
};
