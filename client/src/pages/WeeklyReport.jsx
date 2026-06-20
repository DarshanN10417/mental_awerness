import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileText, Sparkles, AlertTriangle, ShieldCheck, Heart, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

const WeeklyReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.reports.getWeekly();
      setReport(res);
    } catch (err) {
      console.error('Failed to load weekly report:', err);
      setError('Could not retrieve weekly progressive analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleReflectionSubmit = (e) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;
    setReflectionSubmitted(true);
    setReflectionText('');
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-transparent">
        <div className="text-center font-medium">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-650 dark:text-slate-400 text-xs font-semibold">Compiling weekly progress aggregates...</p>
        </div>
      </div>
    );
  }

  const riskColors = {
    low: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    medium: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    high: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
  };

  return (
    <div className="max-w-4xl mx-auto py-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
            <span>Weekly AI Wellness Auditor</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Review weekly patterns and structured advice generated from your exam prep check-ins.
          </p>
        </div>
        
        {report && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${riskColors[report.riskLevel] || riskColors.low}`}>
            Risk Level: {report.riskLevel}
          </span>
        )}
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl p-4 text-xs">
          {error}
        </div>
      )}

      {report ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Summary and Advice */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Summary */}
            <div className="glass-card p-6 relative overflow-hidden">
              {/* background glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
              
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>Executive Summary</span>
              </h3>
              <p className="text-slate-800 dark:text-white text-sm leading-relaxed">
                {report.summary}
              </p>
            </div>

            {/* Recommendations */}
            <div className="glass-card border-indigo-500/10 dark:border-indigo-500/10 p-6">
              <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <span>Coping Recommendations For Next Week</span>
              </h3>
              
              <div className="flex flex-col gap-3">
                {report.aiRecommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-3 bg-slate-50 dark:bg-slate-950/40 p-3 border border-slate-200 dark:border-slate-800/80 rounded-xl">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-normal mt-0.5">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Strengths & Stress Loops */}
          <div className="flex flex-col gap-6">
            
            {/* Strengths */}
            <div className="glass-card p-6">
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                <span>Strengths Highlighted</span>
              </h3>
              
              <ul className="flex flex-col gap-3">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-normal">
                    <span className="text-indigo-500 dark:text-indigo-400 font-bold mt-0.5">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stress Patterns */}
            <div className="glass-card p-6">
              <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                <span>Anxiety loops caught</span>
              </h3>
              
              <ul className="flex flex-col gap-3">
                {report.stressPatterns.map((pat, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-normal">
                    <span className="text-rose-500 dark:text-rose-400 font-bold mt-0.5">•</span>
                    <span>{pat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reflection Widget (Full Width bottom row) */}
          <div className="md:col-span-3 glass-card p-6">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-500 dark:text-rose-400" />
              <span>Resilience Self-Reflection</span>
            </h3>
            
            {reflectionSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-xl p-4 flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <div>
                  <span className="font-semibold block">Reflection saved!</span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Reviewing what helped you is key to building neural resilience pathways. Keep showing up.</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReflectionSubmit} className="flex flex-col gap-3">
                <label className="block text-slate-700 dark:text-slate-300 text-xs">
                  What helped you feel most stable or focused during studies this week? (e.g. taking a specific break style, a chat response, sleep, exercise)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Taking a 10-minute walk after chemistry class helped clear my fatigue..."
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <button
                    type="submit"
                    className="btn-primary text-xs flex items-center gap-1 px-5 shadow-indigo-500/10 shrink-0"
                  >
                    <span>Save Reflection</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          No reports computed for this week yet.
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;
