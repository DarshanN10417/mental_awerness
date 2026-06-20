import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area 
} from 'recharts';
import { BarChart3, TrendingUp, Sparkles, Smile, ShieldAlert, Award, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const moodLogs = await api.mood.getLogs();
      const analyticsSummary = await api.mood.getAnalytics();
      
      // Sort logs by date oldest to newest for Recharts timeline
      const sorted = moodLogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      setLogs(sorted);
      setSummary(analyticsSummary);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError('Could not fetch analytics history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-650 dark:text-slate-400 text-xs font-semibold">Processing historical metrics...</p>
        </div>
      </div>
    );
  }

  // Calculate stressor occurrences for trigger chart
  const getStressorChartData = () => {
    const counts = {};
    logs.forEach(l => {
      if (l.stressor && l.stressor !== 'None') {
        counts[l.stressor] = (counts[l.stressor] || 0) + 1;
      }
    });

    return Object.keys(counts).map(key => ({
      trigger: key,
      count: counts[key]
    })).sort((a, b) => b.count - a.count);
  };

  const stressorData = getStressorChartData();

  // Map logs to simple readable timeline dates
  const chartTimelineData = logs.map(l => ({
    date: new Date(l.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    mood: l.mood,
    energy: l.energy,
    focus: l.focus,
    anxiety: l.anxiety,
    sleep: l.sleepQuality,
    studyHours: l.studyHours,
    studySatisfaction: l.studySatisfaction
  }));

  const hasData = logs.length > 0;
  const gridStroke = isDarkMode ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.22)';
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    borderColor: isDarkMode ? '#232f48' : '#e2e8f0',
    color: isDarkMode ? '#e2e8f0' : '#0f172a',
    borderRadius: '8px',
    fontSize: '11px',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)'
  };
  const labelColor = isDarkMode ? '#94a3b8' : '#475569';

  return (
    <div className="flex flex-col gap-6 py-4 font-medium">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-650 dark:text-indigo-400" />
          <span>Analytics & Stress Insights</span>
        </h2>
        <p className="text-slate-650 dark:text-slate-400 text-xs mt-1 font-semibold">
          Correlate your exam preparation study intensity with emotional burnout triggers.
        </p>
      </div>

      {!hasData ? (
        <div className="glass-card p-12 text-center max-w-lg mx-auto shadow-xl">
          <AlertCircle className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Daily Metrics Recorded</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-6 font-semibold">
            We need at least one daily cognitive check-in log to construct analytics trends and track correlations.
          </p>
          <button
            onClick={() => navigate('/mood-checkin')}
            className="btn-primary text-xs py-2 px-6"
          >
            Log Today's Mood
          </button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Card 1 */}
            <div className="glass-card p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-450 tracking-wider">Average Mood</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{summary?.averageMood}/10</p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-450 tracking-wider">Mind Anxiety</span>
              <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{summary?.averageAnxiety}/10</p>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-450 tracking-wider">Focus Rating</span>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{summary?.averageFocus}/10</p>
            </div>

            {/* Card 4 */}
            <div className="glass-card p-4 shadow-sm border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-450 tracking-wider">Study Hours avg</span>
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{summary?.averageStudyHours}h</p>
            </div>

            {/* Card 5 */}
            <div className="glass-card p-4 shadow-sm border border-slate-200 dark:border-slate-800 col-span-2 md:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-450 tracking-wider">Check-in Streak</span>
              <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <span>{summary?.streakDays} Days</span>
                <span className="text-xs">🔥</span>
              </p>
            </div>
          </div>

          {/* Charts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Mood and Anxiety trends */}
            <div className="glass-card p-5 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Mood vs Anxiety Trends</h3>
                <TrendingUp className="h-4 w-4 text-indigo-650 dark:text-indigo-400" />
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="date" stroke={labelColor} fontSize={10} />
                    <YAxis domain={[1, 10]} stroke={labelColor} fontSize={10} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="mood" stroke="#34d399" name="Mood Rating" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="anxiety" stroke="#f87171" name="Anxiety Level" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Study hours vs anxiety correlation */}
            <div className="glass-card p-5 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Study Intensity vs Mind Noise</h3>
                <Sparkles className="h-4 w-4 text-indigo-650 dark:text-indigo-400" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="date" stroke={labelColor} fontSize={10} />
                    <YAxis stroke={labelColor} fontSize={10} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="studyHours" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} name="Hours Studied" />
                    <Area type="monotone" dataKey="anxiety" stackId="2" stroke="#ec4899" fill="#ec4899" fillOpacity={0.15} name="Anxiety" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Focus and Sleep correlation */}
            <div className="glass-card p-5 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Sleep Quality vs Cognitive Focus</h3>
                <Smile className="h-4 w-4 text-indigo-650 dark:text-indigo-400" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="date" stroke={labelColor} fontSize={10} />
                    <YAxis domain={[1, 10]} stroke={labelColor} fontSize={10} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="sleep" stroke="#fbbf24" name="Sleep Quality" strokeWidth={2} />
                    <Line type="monotone" dataKey="focus" stroke="#818cf8" name="Focus Scale" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Stress Triggers Histogram */}
            <div className="glass-card p-5 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top Recurrent Anxiety Triggers</h3>
                <ShieldAlert className="h-4 w-4 text-rose-500" />
              </div>

              <div className="h-64">
                {stressorData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-450 text-xs font-bold">
                    No major stress triggers logged. Excellent mental resilience!
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stressorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                      <XAxis dataKey="trigger" stroke={labelColor} fontSize={8} interval={0} />
                      <YAxis stroke={labelColor} fontSize={10} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" fill="#f87171" radius={[4, 4, 0, 0]} name="Log Occurrences" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
