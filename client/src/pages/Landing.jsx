import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Brain, Heart, GraduationCap, Flame, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen flex flex-col justify-center px-4 overflow-hidden pt-12">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Banner Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-6 uppercase tracking-wider animate-bounce">
          <Sparkles className="h-4 w-4" />
          <span>Exam Phase-Aware Wellness Copilot</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-sans mb-6">
          Sustain Focus. Beat Burnout. <br />
          <span className="text-glow-indigo bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-500 bg-clip-text text-transparent">
            Conquer Your Exams.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          MindSprint AI is a generative wellness companion customized for JEE, NEET, UPSC, and CAT aspirants. We track your academic pressure, analyze logs for burnout triggers, and predict your emotional state day by day.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {user ? (
            <Link
              to="/dashboard"
              className="btn-primary flex items-center gap-2 text-sm px-8 py-3.5 font-bold"
            >
              <span>Go to Your Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-primary flex items-center gap-2 text-sm px-8 py-3.5 font-bold w-full sm:w-auto justify-center"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login?mode=login"
                className="btn-secondary text-sm px-8 py-3.5 w-full sm:w-auto text-center font-bold"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
          {/* Card 1 */}
          <div className="glass-card p-6 relative hover:border-indigo-500/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Phase-Aware AI Engine</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
              We sync with your exam timeline. Support transitions from routine building (Foundation) to focus restoration (Intensive) and score anxiety protection.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 relative hover:border-indigo-500/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tomorrow Shield</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
              Unlock a next-day predictive readiness card based on today's logs. Identify upcoming fatigue hurdles, study tweaks, and mindset actions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 relative hover:border-indigo-500/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Flame className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">SprintBuddy Chatbot</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
              An empathetic, calm wellness copilot who knows your profile, exam type, study load, and daily anxiety levels to guide you through focus blocks.
            </p>
          </div>
        </div>

        {/* Footer disclaimer */}
        <p className="text-[10px] text-slate-500 italic max-w-lg mx-auto">
          Disclaimer: MindSprint AI is an emotional wellness support copilot. It provides pattern detection and coping suggestions and is not a clinical medical diagnosis or therapist replacement.
        </p>
      </div>
    </div>
  );
};

export default Landing;
