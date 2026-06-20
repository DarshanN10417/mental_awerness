/**
 * Exam Journey Phase Engine
 * Determines the student's active exam preparation stage.
 */

export const calculateExamPhase = (examDateStr, dailyStudyHours, stressBaseline, averageBurnout = 0) => {
  const today = new Date();
  const examDate = new Date(examDateStr);
  
  // Calculate difference in days
  const diffTime = examDate.getTime() - today.getTime();
  const daysToExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let phase = 'FOUNDATION';
  let description = '';
  let tips = [];

  if (daysToExam < 0) {
    phase = 'POST_EXAM_RECOVERY';
    description = 'The exam is behind you. This is a critical time for mental recovery, processing uncertainty, and resetting your routine.';
    tips = [
      'Focus on sleep restoration and catching up on hobbies.',
      'Refrain from over-analyzing question papers or comparing answers.',
      'Allow yourself to feel proud of completing the journey.'
    ];
  } else if (daysToExam <= 7) {
    phase = 'FINAL_COUNTDOWN';
    description = 'The exam is less than a week away. Your focus should shift to panic control, stabilizing sleep, and light review rather than new topics.';
    tips = [
      'Prioritize 7-8 hours of sleep above all else; a fatigued mind forgets facts.',
      'Use the 5-4-3-2-1 Sensory Grounding exercise if panic flashes show up.',
      'Avoid starting any new complex topics; focus on formulas or keywords.'
    ];
  } else if (daysToExam <= 30) {
    phase = 'REVISION_STRESS';
    description = 'With the exam less than a month away, anxiety, mock test comparison, and fear of failure are at their peak.';
    tips = [
      'Limit peer score comparisons; focus only on identifying your own weak spots.',
      'Implement mock-test disappointment resets to clear test anxiety.',
      'Incorporate Tomorrow Shield mindset resets every evening.'
    ];
  } else if (daysToExam <= 90) {
    // If stress or burnout is extremely high, escalate to Revision Stress
    if (averageBurnout > 75 || stressBaseline > 7) {
      phase = 'REVISION_STRESS';
      description = 'Escalated Phase: Although the exam is 1-3 months away, high burnout and stress thresholds indicate severe revision fatigue.';
      tips = [
        'Temporarily scale back study hours by 1-2 hours per day to prevent complete crash.',
        'Use the Procrastination Interrupt exercise to kickstart sessions without overwhelm.',
        'Establish a clear line between study time and relaxation.'
      ];
    } else {
      phase = 'INTENSIVE_PREP';
      description = 'You are in the thick of preparation. Balancing high study volume with fatigue management is crucial here.';
      tips = [
        'Divide your day into clear study cycles (e.g. 50-minute Pomodoros with 10-minute breaks).',
        'Maintain a baseline of 6.5 hours of sleep to sustain brain plasticity.',
        'Log your daily mood to detect early signs of study blocks.'
      ];
    }
  } else if (daysToExam <= 180) {
    if (dailyStudyHours > 10) {
      phase = 'INTENSIVE_PREP';
      description = 'Escalated Phase: Although the exam is over 3 months away, your high daily study intensity (>10 hours) demands intensive prep management.';
      tips = [
        'Be careful of early-stage burnout; incorporate physical stretches every 2 hours.',
        'Balance heavy subjects with lighter review topics.',
        'Ensure daily hydration and fresh air.'
      ];
    } else {
      phase = 'BUILDUP';
      description = 'Building your core routine, mastering subject blocks, and establishing solid habits.';
      tips = [
        'Formulate a weekly study planner and build consistency.',
        'Create self-compassion triggers when you miss minor daily goals.',
        'Focus on understanding fundamental concepts without exam-day panic.'
      ];
    }
  } else {
    phase = 'FOUNDATION';
    description = 'The early stage of preparation. Focus on foundational concepts, reducing procrastination, and boosting confidence.';
    tips = [
      'Establish a stable study environment free of distractions.',
      'Reward effort, not just correctness in exercises.',
      'Keep a light journal to trace study satisfaction trends.'
    ];
  }

  return {
    phase,
    daysToExam,
    description,
    tips
  };
};
