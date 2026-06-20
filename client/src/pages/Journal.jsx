import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import SafetyModal from '../components/SafetyModal';
import { BookOpen, Sparkles, AlertCircle, Calendar, Send, Activity, ShieldAlert, Heart } from 'lucide-react';

const Journal = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentEntries, setRecentEntries] = useState([]);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [activeInsight, setActiveInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  
  // Safety Modal triggers
  const [safetyOpen, setSafetyOpen] = useState(false);

  // Fetch entries on load
  const loadJournals = async () => {
    try {
      const list = await api.journal.getEntries();
      setRecentEntries(list);
      if (list.length > 0) {
        setSelectedEntryId(list[0]._id);
        fetchInsight(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to load journals:', err);
    }
  };

  const fetchInsight = async (id) => {
    try {
      setInsightLoading(true);
      const insight = await api.journal.getInsight(id);
      setActiveInsight(insight);
    } catch (err) {
      console.error('Failed to load journal insight:', err);
      setActiveInsight(null);
    } finally {
      setInsightLoading(false);
    }
  };

  useEffect(() => {
    loadJournals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!content.trim()) {
      setError('Reflection content cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      const result = await api.journal.submit(content, title || 'Reflection Entry');
      setContent('');
      setTitle('');
      
      // Seed newly created item as active
      const updatedList = [result.entry, ...recentEntries];
      setRecentEntries(updatedList);
      setSelectedEntryId(result.entry._id);
      setActiveInsight(result.insight);

      // Check if crisis triggers were caught
      if (result.safetyAlert) {
        setSafetyOpen(true);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.message || 'Could not submit journal reflection.');
    } finally {
      setLoading(false);
    }
  };

  const selectEntry = (id) => {
    setSelectedEntryId(id);
    fetchInsight(id);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 py-4">
      {/* Safety Alert Modal */}
      <SafetyModal isOpen={safetyOpen} onClose={() => setSafetyOpen(false)} />

      {/* Column 1: Journal Editor */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Editor Card */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              <span>Write Daily Reflection</span>
            </h3>
            <span className="flex items-center gap-1 text-[10px] text-slate-550 dark:text-slate-500 font-semibold uppercase">
              <Sparkles className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
              <span>AI analysis active</span>
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl p-3 text-xs mb-4">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="Entry Title (e.g. Syllabus backlog panic, Post mock review)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-750 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <textarea
                rows="6"
                placeholder="Write free-form... Speak honestly about study blocks, pressure, how you felt during mock tests, procrastination guilt, or sleep difficulties. Write at least 2 sentences for better diagnostics."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-750 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 py-2.5 text-xs font-bold self-end px-6 shadow-indigo-500/15"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Extracting emotional indicators...</span>
                </>
              ) : (
                <>
                  <span>Analyze Reflection</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Entries Checklist */}
        <div className="glass-card p-6 flex-1 min-h-[250px]">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Reflection Archives</h3>
          {recentEntries.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No journal logs written yet. Write your first log to generate wellness patterns.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-2">
              {recentEntries.map((item) => (
                <div
                  key={item._id}
                  onClick={() => selectEntry(item._id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 text-left ${
                    selectedEntryId === item._id
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500/50 text-indigo-950 dark:text-white font-semibold'
                      : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:border-indigo-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{item.title}</h4>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1 uppercase font-bold shrink-0">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="text-[11px] leading-normal line-clamp-2 text-slate-500 dark:text-slate-400">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Column 2: AI Insights */}
      <div className="w-full lg:w-[400px] shrink-0">
        <div className="glass-card bg-gradient-to-b from-indigo-50/30 to-slate-50 dark:from-[#131b2e] dark:to-[#0f172a] p-6 sticky top-24 min-h-[500px] flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">AI Diagnostic Insight</h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Real-time parser logs</p>
            </div>
          </div>

          {insightLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Parsing mental triggers...</p>
            </div>
          ) : activeInsight ? (
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Summary Block */}
              <div>
                <div className="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30 rounded-xl p-3.5 mb-5 text-xs text-indigo-950 dark:text-slate-300 leading-relaxed italic">
                  "{activeInsight.summary}"
                </div>

                {/* Scaling burnout */}
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Burnout Risk Scale</span>
                    <span className={`font-bold ${activeInsight.burnoutRisk > 60 ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-555'}`}>
                      {activeInsight.burnoutRisk}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-900">
                    <div 
                      style={{ width: `${activeInsight.burnoutRisk}%` }} 
                      className={`h-full rounded-full bg-gradient-to-r ${
                        activeInsight.burnoutRisk > 60 ? 'from-rose-500 to-red-400' : 'from-indigo-500 to-indigo-600'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Emotions detected */}
                <div className="mb-5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 tracking-wider">Emotions Detected</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeInsight.emotionsDetected.map((emo, idx) => (
                      <span key={idx} className="bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[10px] px-2.5 py-0.5 rounded-lg font-bold">
                        {emo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stress triggers */}
                <div className="mb-5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 tracking-wider">Exam Stress Triggers</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeInsight.stressTriggers.map((trig, idx) => (
                      <span key={idx} className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[10px] px-2.5 py-0.5 rounded-lg font-bold">
                        {trig}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested actions list */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 tracking-wider">Suggested Coping Plan</span>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    {activeInsight.suggestedActions.map((action, idx) => (
                      <li key={idx} className="flex gap-2 leading-relaxed bg-slate-100 dark:bg-slate-950/40 p-2 border border-slate-200 dark:border-slate-800/80 rounded-lg">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Urgency Badge */}
              <div className="border-t border-slate-800/80 mt-5 pt-3 flex justify-between items-center text-[10px] text-slate-500">
                <span>Severity Check: <strong>{activeInsight.severityScore}/10</strong></span>
                {activeInsight.severityScore >= 8 && (
                  <span className="flex items-center gap-1 text-rose-400 font-bold uppercase animate-pulse">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Safety Intervention Triggered</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
              <Calendar className="h-8 w-8 mb-2" />
              <p>Select a journal entry to load AI wellness insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
