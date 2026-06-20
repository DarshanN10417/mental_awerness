import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, AlertTriangle, Sparkles, Smile, ArrowRight } from 'lucide-react';

const TomorrowShieldCard = ({ data, shieldUnlocked }) => {
  if (!shieldUnlocked || !data) {
    return (
      <div className="relative glass-card border border-slate-200 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50/50 to-slate-100/80 dark:from-[#1e293b]/70 dark:to-[#0f172a]/90 p-6 overflow-hidden min-h-[300px] flex flex-col justify-between shadow-md font-medium">
        {/* Decorative backdrop glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl"></div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="flex items-center gap-2 text-indigo-655 dark:text-indigo-400 font-bold tracking-wider text-xs uppercase">
              <Shield className="h-4 w-4" />
              <span>Tomorrow Shield</span>
            </span>
            <span className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
              <Lock className="h-3 w-3" />
              <span>Locked</span>
            </span>
          </div>

          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Emotional Preparation Shield</h4>
          <p className="text-slate-600 dark:text-slate-405 text-xs leading-relaxed font-semibold">
            Your Tomorrow Shield acts as a custom predictive safety net. It forecasts tomorrow's emotional hurdles and details specific study tweaks to bypass anxiety.
          </p>
        </div>

        {/* Frosted Block overlay */}
        <div className="my-6 p-4 rounded-lg bg-slate-100/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 dark:text-amber-400 mb-2 animate-bounce" />
          <p className="text-slate-800 dark:text-slate-305 text-xs font-bold">Today's Check-in Required</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[200px] mt-1 font-semibold">
            Complete your daily mood and study log to unlock your next-day preparation card.
          </p>
        </div>

        <Link
          to="/mood-checkin"
          className="btn-primary w-full text-center flex items-center justify-center gap-2 text-xs py-2"
        >
          <span>Complete Check-in</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative glass-card border border-slate-200 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100/50 dark:from-slate-900 dark:via-[#131b2e] dark:to-[#0f172a] p-6 overflow-hidden min-h-[300px] flex flex-col justify-between hover:border-indigo-500/40 dark:hover:border-indigo-400/40 transition-all duration-300 shadow-md font-medium">
      {/* Decorative backdrop glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl animate-pulse-slow"></div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-bold tracking-wider text-xs uppercase">
            <Shield className="h-4 w-4 text-indigo-650 dark:text-indigo-400" />
            <span>Tomorrow Shield Active</span>
          </span>
          <span className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase animate-pulse">
            <Sparkles className="h-3 w-3" />
            <span>Armed</span>
          </span>
        </div>

        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Your Readiness Forecast</h4>
        <p className="text-slate-650 dark:text-slate-400 text-[11px] mb-4 font-semibold">
          Predicted emotional blocker and tactical adjustments prepared for tomorrow:
        </p>

        {/* Prediction block */}
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 rounded-xl p-3.5 mb-4">
          <span className="text-[10px] uppercase font-bold text-indigo-650 dark:text-indigo-305 tracking-wider">Anticipated Challenge</span>
          <p className="text-slate-900 dark:text-white text-xs font-semibold mt-0.5 leading-relaxed">
            {data.challenge_prediction}
          </p>
        </div>

        {/* Adjustments */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
            <div>
              <span className="text-[9px] uppercase font-bold text-rose-600 dark:text-rose-400 block tracking-wide">Thing to Avoid</span>
              <p className="text-slate-800 dark:text-slate-300 text-xs mt-0.5 leading-normal">{data.thing_to_avoid}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5 shrink-0"></div>
            <div>
              <span className="text-[9px] uppercase font-bold text-indigo-650 dark:text-indigo-300 block tracking-wide">Mindset Reminder</span>
              <p className="text-slate-805 dark:text-slate-300 text-xs italic mt-0.5 leading-normal">"{data.mindset_reminder}"</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-1.5 shrink-0"></div>
            <div>
              <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block tracking-wide">Tiny Wellness Action</span>
              <p className="text-slate-800 dark:text-slate-300 text-xs mt-0.5 leading-normal">{data.tiny_wellness_action}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0"></div>
            <div>
              <span className="text-[9px] uppercase font-bold text-indigo-600 dark:text-indigo-300 block tracking-wide">Study Adjustment</span>
              <p className="text-slate-800 dark:text-slate-300 text-xs mt-0.5 leading-normal">{data.study_adjustment}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800/80 mt-5 pt-3 text-[10px] text-slate-500 text-center font-bold">
        Generated dynamically based on today's study details and stress triggers.
      </div>
    </div>
  );
};

export default TomorrowShieldCard;
