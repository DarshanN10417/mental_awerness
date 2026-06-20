import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Smile, AlertCircle, ArrowLeft, Send, Sparkles, BookOpen } from 'lucide-react';

const MoodCheckIn = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState(6);
  const [energy, setEnergy] = useState(6);
  const [focus, setFocus] = useState(6);
  const [anxiety, setAnxiety] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(6);
  const [studyHours, setStudyHours] = useState('');
  const [studySatisfaction, setStudySatisfaction] = useState(6);
  const [stressor, setStressor] = useState('None');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const stressorsList = [
    'None',
    'Syllabus backlog',
    'Mock Test Physics',
    'Mock Test Chemistry',
    'Mock Test Mathematics',
    'Peer score comparison',
    'Parental expectation pressure',
    'Lack of sleep/exhaustion',
    'Memory retrieval retention issues',
    'Procrastination blocks',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (studyHours === '' || isNaN(studyHours) || Number(studyHours) < 0) {
      setError('Please provide a valid number of study hours (e.g. 0 or 8.5).');
      setLoading(false);
      return;
    }

    try {
      await api.mood.log({
        mood: Number(mood),
        energy: Number(energy),
        focus: Number(focus),
        anxiety: Number(anxiety),
        sleepQuality: Number(sleepQuality),
        studyHours: Number(studyHours),
        studySatisfaction: Number(studySatisfaction),
        stressor,
        note
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit mood log:', err);
      setError(err.message || 'Could not submit daily check-in.');
    } finally {
      setLoading(false);
    }
  };

  const renderSlider = (label, value, onChange, minLabel = 'Low', maxLabel = 'High', colorClass = 'accent-indigo-500') => {
    return (
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-slate-750 dark:text-slate-300 font-bold tracking-wide">{label}</span>
          <span className="text-slate-900 dark:text-white font-black text-sm bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 w-8 text-center">{value}</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full ${colorClass} h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer`}
        />
        <div className="flex justify-between text-[9px] text-slate-500 font-semibold mt-1">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-4 flex flex-col gap-4 font-medium">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 flex items-center gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-1.5 rounded-lg shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </button>
      </div>

      <div className="glass-card p-6 md:p-8 shadow-2xl relative">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 mb-2">
            <Smile className="h-6 w-6" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Daily Cognitive Check-in</h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-normal max-w-sm mx-auto font-medium">
            Log your focus, energy, and stress metrics to update your dashboard trackers and Tomorrow Shield.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 rounded-xl p-3.5 text-xs mb-6 animate-pulse">
            <AlertCircle className="h-4.5 w-4.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Sliders Grid */}
          <div>
            <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider mb-3">1. Emotional & Physical Scales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSlider('Mood / Emotional State', mood, setMood, 'Flat/Down', 'Exuberant')}
              {renderSlider('Energy / Physical Stamina', energy, setEnergy, 'Exhausted', 'Vibrant')}
              {renderSlider('Focus / Retention Clarity', focus, setFocus, 'Distracted', 'Laser Sharp')}
              {renderSlider('Anxiety / Mind Noise', anxiety, setAnxiety, 'Serene', 'Panicked', 'accent-rose-500')}
              {renderSlider('Sleep Quality (Last Night)', sleepQuality, setSleepQuality, 'Restless', 'Restorative')}
            </div>
          </div>

          {/* Academic inputs */}
          <div>
            <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider mb-3">2. Academic Study Logs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl flex flex-col justify-between shadow-sm">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="studyHours">
                  Study Hours Completed Today
                </label>
                <input
                  id="studyHours"
                  type="text"
                  placeholder="e.g. 8.5"
                  value={studyHours}
                  onChange={(e) => setStudyHours(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                  required
                />
                <span className="text-[9px] text-slate-500 mt-1 block">
                  Decimal points allowed (e.g. 7.5 for 7 hours 30 mins)
                </span>
              </div>

              {renderSlider('Study Satisfaction', studySatisfaction, setStudySatisfaction, 'Wasted', 'Highly Satisfied')}
            </div>
          </div>

          {/* Stressors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="stressor">
                Primary Stress Trigger Today
              </label>
              <select
                id="stressor"
                value={stressor}
                onChange={(e) => setStressor(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                {stressorsList.map((st, idx) => (
                  <option className="bg-white dark:bg-slate-950" key={idx} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="note">
                Optional Reflection Note
              </label>
              <textarea
                id="note"
                rows="2"
                placeholder="Write a quick line about how you navigated distractions or study fatigue..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-medium"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center flex items-center justify-center gap-2 mt-2 font-bold"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Submit Check-in logs</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MoodCheckIn;
