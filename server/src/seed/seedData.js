import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { MoodLog } from '../models/MoodLog.js';
import { JournalEntry } from '../models/JournalEntry.js';
import { JournalInsight } from '../models/JournalInsight.js';
import { ChatMessage } from '../models/ChatMessage.js';
import { WeeklyReport } from '../models/WeeklyReport.js';
import { InterventionHistory } from '../models/InterventionHistory.js';

dotenv.config();

const seed = async () => {
  try {
    console.log('Starting Database Seed...');
    await connectDB();

    // Clear existing tables
    await User.deleteMany({});
    await MoodLog.deleteMany({});
    await JournalEntry.deleteMany({});
    await JournalInsight.deleteMany({});
    await ChatMessage.deleteMany({});
    await WeeklyReport.deleteMany({});
    await InterventionHistory.deleteMany({});

    console.log('Cleaned existing records.');

    // 1. Create Demo User
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Exam date: 25 days in the future (Revision phase)
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 25);

    const demoUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@mindsprint.ai',
      passwordHash,
      examType: 'JEE',
      examDate: examDate,
      supportStyle: 'calm mentor',
      dailyStudyHours: 9,
      sleepHours: 7,
      baselineStress: 6,
      emergencyContact: '+91 98765 43210'
    });

    console.log(`Demo User Created: ${demoUser.email} (Password: password123)`);

    // 2. Create Past 5 Days of Mood Logs
    const logDates = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      logDates.push(date);
    }

    const moodData = [
      { mood: 7, energy: 8, focus: 8, anxiety: 4, sleepQuality: 8, studyHours: 9, studySatisfaction: 8, stressor: 'None', note: 'Good productive day' },
      { mood: 6, energy: 7, focus: 7, anxiety: 5, sleepQuality: 7, studyHours: 8, studySatisfaction: 7, stressor: 'Syllabus backlog', note: 'A bit tired in the afternoon' },
      { mood: 4, energy: 5, focus: 5, anxiety: 8, sleepQuality: 5, studyHours: 6, studySatisfaction: 4, stressor: 'Mock Test Physics', note: 'Felt very stressed during mock test' },
      { mood: 5, energy: 6, focus: 6, anxiety: 7, sleepQuality: 6, studyHours: 8, studySatisfaction: 6, stressor: 'Mock Test Physics', note: 'Reviewing mistakes, feeling guilty' },
      { mood: 6, energy: 7, focus: 8, anxiety: 5, sleepQuality: 7, studyHours: 9.5, studySatisfaction: 8, stressor: 'None', note: 'Recovered focus today' }
    ];

    for (let i = 0; i < 5; i++) {
      await MoodLog.create({
        userId: demoUser._id,
        ...moodData[i],
        createdAt: logDates[i]
      });
    }
    console.log('Seeded 5 daily check-ins.');

    // 3. Create Journal Entries & AI Insights
    // Entry 1: Syllabus Stress (4 days ago)
    const journal1 = await JournalEntry.create({
      userId: demoUser._id,
      title: 'Backlog panic',
      content: 'I have so much organic chemistry left and my exam is less than a month away. I spent three hours today staring at the screen and ended up playing games because I felt so overwhelmed by the sheer size of the chapter. I feel like I am wasting time and disappointing my parents who have put so much faith in me.',
      createdAt: logDates[1]
    });

    await JournalInsight.create({
      journalEntryId: journal1._id,
      userId: demoUser._id,
      summary: 'Aarav is experiencing procrastination triggered by organic chemistry syllabus volume and fear of disappointing family.',
      emotionsDetected: ['Overwhelmed', 'Guilt', 'Anxious'],
      stressTriggers: ['Syllabus backlog', 'Parental expectations'],
      negativePatterns: ['Procrastination loops', 'Disappointment guilt'],
      positivePatterns: ['Self-awareness of triggers'],
      burnoutRisk: 45,
      severityScore: 6,
      recommendedSupportType: 'calm mentor',
      suggestedActions: [
        'Break organic chemistry into 15-minute revision cards instead of full blocks.',
        'Apply the Procrastination Interrupt method to kickstart studies.',
        'Take a 10-minute walk without your phone to reset negative loops.'
      ],
      createdAt: logDates[1]
    });

    // Entry 2: Mock disappointment (2 days ago)
    const journal2 = await JournalEntry.create({
      userId: demoUser._id,
      title: 'Mock test score drop',
      content: 'Got my mock test result today. I scored 160. My target was 220+. I felt like crying because everyone in my coaching institute is scoring above 200. I studied so much last week but it feels like none of it made a difference. I don\'t think I am cut out for JEE. I feel completely hopeless.',
      createdAt: logDates[3]
    });

    await JournalInsight.create({
      journalEntryId: journal2._id,
      userId: demoUser._id,
      summary: 'Student is experiencing imposter syndrome and self-doubt after scoring 160 on a mock test, compared to peers.',
      emotionsDetected: ['Inadequate', 'Frustrated', 'Hopeless'],
      stressTriggers: ['Mock test score', 'Peer comparison'],
      negativePatterns: ['Imposter syndrome', 'All-or-nothing thinking'],
      positivePatterns: ['Expressing emotions in journal'],
      burnoutRisk: 70,
      severityScore: 8, // Escalates safety disclaimer trigger flag
      recommendedSupportType: 'gentle',
      suggestedActions: [
        'Perform the Mock-Test Disappointment Reset routine immediately.',
        'Write down 3 concepts you did correctly, validating your progress.',
        'Speak to your mentor about concept gaps rather than final scores.'
      ],
      createdAt: logDates[3]
    });

    console.log('Seeded 2 journals and matching AI insights.');

    // 4. Seed Chat History
    const chatData = [
      { role: 'user', message: 'I feel like I cannot finish this syllabus in time. There is just too much stuff.' },
      { role: 'assistant', message: 'It is completely understandable to feel overwhelmed by the sheer size of the syllabus, Aarav. Let us take a deep breath. Instead of looking at the whole mountain, let us pick just one small sub-topic for the next 20 minutes. What is one formula sheet or chapter you can review right now?' },
      { role: 'user', message: 'Probably organic chemistry name reactions. It has a lot of details.' },
      { role: 'assistant', message: 'Excellent choice. Let us focus only on name reactions. Set a timer for 15 minutes, write down 3 reactions, and then take a quick water break. You do not need to master the whole textbook tonight, just these three. I am right here.' }
    ];

    for (let msg of chatData) {
      await ChatMessage.create({
        userId: demoUser._id,
        role: msg.role === 'user' ? 'user' : 'assistant',
        message: msg.message,
        createdAt: new Date(Date.now() - 3600000)
      });
    }
    console.log('Seeded chat logs.');

    // 5. Seed Weekly Report
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    await WeeklyReport.create({
      userId: demoUser._id,
      weekStart: oneWeekAgo,
      weekEnd: new Date(),
      summary: 'This week, Aarav faced significant mock exam anxiety and syllabus pressure, causing sleep quality fluctuations. However, he maintained core study hours and utilized journals to restore focus.',
      riskLevel: 'medium',
      strengths: ['Maintained consistent daily check-ins', 'Identified backlog stressors early'],
      stressPatterns: ['Peer score comparison', 'Late-night mock review fatigue'],
      aiRecommendations: [
        'Establish a mock cooldown routine before reviewing questions.',
        'Winding down screens 30 minutes earlier to support sleep restoration.',
        'Begin daily cycles with comfortable subjects to build immediate momentum.'
      ],
      createdAt: new Date()
    });
    console.log('Seeded Weekly Report.');

    // 6. Seed Intervention History
    await InterventionHistory.create({
      userId: demoUser._id,
      interventionType: 'breathing',
      title: '5-4-3-2-1 Sensory Grounding',
      reason: 'User experienced high score anxiety.',
      completed: true,
      createdAt: logDates[3]
    });
    
    await InterventionHistory.create({
      userId: demoUser._id,
      interventionType: 'recovery',
      title: 'Mock-Test Disappointment Reset',
      reason: 'Self-initiated reset after mock exam.',
      completed: false,
      createdAt: new Date()
    });

    console.log('Seeded Intervention History.');
    console.log('==========================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY.');
    console.log(`Use user login: ${demoUser.email} / password123`);
    console.log('==========================================');

    // If connected to mongo, close connection
    if (process.env.USE_MEMORY_DB !== 'true') {
      await mongoose.disconnect();
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

seed();
