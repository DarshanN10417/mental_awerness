import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TomorrowShieldCard from '../components/TomorrowShieldCard';
import BreathingReset from '../components/BreathingReset';
import { 
  Smile, 
  BookOpen, 
  MessageSquare, 
  Wind, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Hourglass, 
  CheckCircle,
  HelpCircle,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resetOpen, setResetOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.dashboard.get();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Could not fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-transparent">
        <div className="text-center font-medium">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-650 dark:text-slate-400 text-xs font-semibold">Assembling exam phase diagnostics...</p>
        </div>
      </div>
    );
  }

  const {
    todayCheckInLogged,
    todayMetrics,
    burnoutRisk,
    focusScore,
    phaseInfo,
    actionPlan,
    latestInsight,
    shieldUnlocked,
    tomorrowShield
  } = data || {};

  // Formats remaining days
  const formatDaysText = (days) => {
    if (days < 0) return 'Completed';
    if (days === 0) return 'Today!';
    return `${days} days left`;
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-indigo-500/10 via-slate-50/50 to-transparent dark:from-indigo-950/40 dark:via-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-sans">Aspirant Workspace</h2>
            <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 animate-spin" />
              <span>Active</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
            Tracking wellness metrics and study load for your upcoming <strong className="text-slate-800 dark:text-white">{user?.examType}</strong>.
          </p>
        </div>

        {/* Short Exam Countdown Badge */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl">
          <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Exam Countdown</p>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{phaseInfo ? formatDaysText(phaseInfo.daysToExam) : 'N/A'}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl p-4 text-xs">
          {error}
        </div>
      )}

      {/* 2. Main Grid: Statuses, Phase, Shield */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Phase Card */}
        <div className="glass-card p-6 flex flex-col justify-between hover:border-indigo-500/15 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 font-semibold tracking-wider text-xs uppercase">
                <Hourglass className="h-4 w-4" />
                <span>Exam Journey Phase</span>
              </span>
              <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wide">
                {phaseInfo?.phase}
              </span>
            </div>
            <p className="text-slate-900 dark:text-white font-bold text-lg leading-snug mb-2">
              {phaseInfo?.phase.replace(/_/g, ' ')}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
              {phaseInfo?.description}
            </p>
          </div>

          <div>
            <div className="h-px bg-slate-200 dark:bg-slate-800/80 my-4"></div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 tracking-wider">Phase Advice</span>
            <ul className="flex flex-col gap-2 text-xs text-slate-700 dark:text-slate-300">
              {phaseInfo?.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <span className="text-indigo-500 dark:text-indigo-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Metrics Card: Focus and Burnout Meter */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <span className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 font-semibold tracking-wider text-xs uppercase mb-4">
              <TrendingUp className="h-4 w-4" />
              <span>Study Friction Meters</span>
            </span>

            {/* Circular or Progress Visualizers */}
            <div className="flex flex-col gap-6 mt-4">
              
              {/* Focus consistency */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Focus Consistency</span>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">{focusScore}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800/60">
                  <div 
                    style={{ width: `${focusScore}%` }} 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                  ></div>
                </div>
                <span className="text-[10px] text-slate-550 mt-1 block">
                  Copes well with study targets. Stabilizes with consecutive logs.
                </span>
              </div>

              {/* Burnout risk */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-550 dark:text-slate-400 font-semibold">Burnout Risk Score</span>
                  <span className={`font-bold ${burnoutRisk > 60 ? 'text-rose-500 dark:text-rose-400' : burnoutRisk > 40 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-555'}`}>
                    {burnoutRisk}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800/60">
                  <div 
                    style={{ width: `${burnoutRisk}%` }} 
                    className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${
                      burnoutRisk > 60 
                        ? 'from-rose-500 to-red-400' 
                        : burnoutRisk > 40 
                          ? 'from-amber-500 to-yellow-400' 
                          : 'from-emerald-500 to-teal-400'
                    }`}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-550 mt-1 block">
                  Based on recent fatigue levels and emotional stress markers in journal entries.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-px bg-slate-200 dark:bg-slate-800/80 mb-4"></div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 p-3 rounded-xl">
              <Flame className="h-5 w-5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Preferred support style</p>
                <p className="text-xs font-semibold text-slate-850 dark:text-white capitalize">{user?.supportStyle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tomorrow Shield Forecast Panel */}
        <TomorrowShieldCard data={tomorrowShield} shieldUnlocked={shieldUnlocked} />
      </div>

      {/* 3. Action checklists and Quick buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Checklist */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <span>Action Agenda for Today</span>
          </h3>

          <div className="flex flex-col gap-3">
            {actionPlan && actionPlan.length > 0 ? (
              actionPlan.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
                  </div>

                  {item.action === 'log-mood' && (
                    <Link to="/mood-checkin" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1">
                      <span>Log Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {item.action === 'write-journal' && (
                    <Link to="/journal" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1">
                      <span>Write Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {item.action === 'take-reset' && (
                    <button 
                      onClick={() => setResetOpen(true)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Reset</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
                <CheckCircle className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-850 dark:text-white">All wellness logs complete!</p>
                <p className="text-[10px] text-slate-500 mt-1">You are fully prepared for today's studies. Keep it up.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Buttons Grid */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Quick Interventions</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/mood-checkin" className="flex flex-col items-center justify-center p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white">
              <Smile className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mb-2" />
              <span className="text-[10px] font-semibold">Log Mood</span>
            </Link>
            
            <Link to="/journal" className="flex flex-col items-center justify-center p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white">
              <BookOpen className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mb-2" />
              <span className="text-[10px] font-semibold">Write Journal</span>
            </Link>
            
            <Link to="/chat" className="flex flex-col items-center justify-center p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white">
              <MessageSquare className="h-5 w-5 text-blue-500 dark:text-blue-400 mb-2" />
              <span className="text-[10px] font-semibold">Talk to AI</span>
            </Link>

            <button 
              onClick={() => setResetOpen(true)}
              className="flex flex-col items-center justify-center p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500/30 transition-all text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              <Wind className="h-5 w-5 text-amber-500 dark:text-amber-400 mb-2" />
              <span className="text-[10px] font-semibold">2-Min Reset</span>
            </button>
          </div>

          <Link
            to="/weekly-report"
            className="btn-secondary w-full text-center flex items-center justify-center gap-2 mt-4 py-2 text-xs border-slate-250 dark:border-slate-800 hover:border-indigo-500/25"
          >
            <FileText className="h-4 w-4" />
            <span>Weekly Report</span>
          </Link>
        </div>
      </div>

      {/* 4. Journal Analytics Insight Box */}
      {latestInsight && (
        <div className="glass-card p-6">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Latest Reflection Insight ({new Date(latestInsight.createdAt).toLocaleDateString()})</span>
          <p className="text-slate-800 dark:text-white font-bold text-base mt-1.5 mb-2 leading-relaxed">
            "{latestInsight.summary}"
          </p>
          
          <div className="flex flex-wrap gap-2 mt-3.5">
            {latestInsight.emotionsDetected.map((emotion, idx) => (
              <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-lg text-[10px] font-medium">
                {emotion}
              </span>
            ))}
            {latestInsight.stressTriggers.map((trigger, idx) => (
              <span key={idx} className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-lg text-[10px] font-medium">
                Trigger: {trigger}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Breathing Interventive Modal Overlay */}
      <BreathingReset isOpen={resetOpen} onClose={() => setResetOpen(false)} />
    </div>
  );
};

export default Dashboard;
