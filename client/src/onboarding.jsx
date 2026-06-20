import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { GraduationCap, Calendar, Clock, Smile, Award, Shield, User, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

const Onboarding = () => {
  const { user, updateProfileState } = useAuth();
  const navigate = useNavigate();

  const [examType, setExamType] = useState('JEE');
  const [examDate, setExamDate] = useState('');
  const [dailyStudyHours, setDailyStudyHours] = useState(8);
  const [sleepHours, setSleepHours] = useState(7);
  const [baselineStress, setBaselineStress] = useState(5);
  const [supportStyle, setSupportStyle] = useState('calm mentor');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supportStyles = [
    {
      id: 'calm mentor',
      title: 'Calm Mentor',
      desc: 'Wise, grounding guidance providing helpful perspectives.',
      color: 'border-indigo-500/30 hover:border-indigo-400'
    },
    {
      id: 'gentle',
      title: 'Gentle & Soft',
      desc: 'Highly validating, comforting, and focused on self-kindness.',
      color: 'border-emerald-500/30 hover:border-emerald-400'
    },
    {
      id: 'motivational',
      title: 'Motivational Catalyst',
      desc: 'High energy, inspiring resilience, and pushing performance.',
      color: 'border-amber-500/30 hover:border-amber-400'
    },
    {
      id: 'structured',
      title: 'Structured Plan',
      desc: 'Logical, step-by-step action sheets and productivity tools.',
      color: 'border-blue-500/30 hover:border-blue-400'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!examDate) {
      setError('Please select your target exam date.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.updateProfile({
        examType,
        examDate: new Date(examDate).toISOString(),
        dailyStudyHours: Number(dailyStudyHours),
        sleepHours: Number(sleepHours),
        baselineStress: Number(baselineStress),
        supportStyle,
        emergencyContact
      });
      updateProfileState(response.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Onboarding update failed:', err);
      setError(err.message || 'Failed to save onboarding settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center items-center">
      <div className="glass-card max-w-2xl w-full border-slate-800 bg-[#0f172a]/70 p-8 shadow-2xl relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-3">
            <GraduationCap className="h-8 w-8 animate-bounce" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Configure Your Copilot Context</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-md mx-auto">
            Hello {user?.name}, let's tailor MindSprint AI to your exact exam countdown and study dynamics.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl p-3.5 text-xs mb-6">
            <AlertCircle className="h-4.5 w-4.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Section 1: Exam Profile */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
              <span>1. Exam Specifics</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="examType">
                  Exam Type
                </label>
                <select
                  id="examType"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="JEE">JEE (Joint Entrance Examination)</option>
                  <option value="NEET">NEET (National Eligibility cum Entrance Test)</option>
                  <option value="CAT">CAT (Common Admission Test)</option>
                  <option value="GATE">GATE (Graduate Aptitude Test in Engineering)</option>
                  <option value="UPSC">UPSC (Civil Services Examination)</option>
                  <option value="CUET">CUET (Common University Entrance Test)</option>
                  <option value="custom">Other / Custom Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="examDate">
                  Target Exam Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 pointer-events-none" />
                  <input
                    id="examDate"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Study Benchmarks */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-indigo-400" />
              <span>2. Daily Benchmarks & Baseline</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="studyHours">
                  Study Hours Goal (Per Day)
                </label>
                <input
                  id="studyHours"
                  type="number"
                  min="1"
                  max="20"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="sleepHours">
                  Sleep Target (Hours)
                </label>
                <input
                  id="sleepHours"
                  type="number"
                  min="3"
                  max="12"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Baseline Stress Level (1-10)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={baselineStress}
                    onChange={(e) => setBaselineStress(Number(e.target.value))}
                    className="flex-1 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 w-8 text-center shrink-0">
                    {baselineStress}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Copilot Tone */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-indigo-400" />
              <span>3. AI Support Style Preference</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportStyles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => setSupportStyle(style.id)}
                  className={`p-4 rounded-xl border-2 bg-slate-900/40 cursor-pointer transition-all duration-200 ${
                    supportStyle === style.id
                      ? 'border-indigo-500 bg-indigo-950/20 text-white'
                      : 'border-slate-800/80 text-slate-300'
                  } ${style.color}`}
                >
                  <p className="text-sm font-bold block">{style.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">{style.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Emergency Contacts */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-indigo-400" />
              <span>4. Emergency / Mentor Contact (Optional)</span>
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5" htmlFor="emergency">
                Mobile Number / Phone (Parent, Mentor, or Trusted Friend)
              </label>
              <input
                id="emergency"
                type="text"
                placeholder="+91 98765 43210"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Recommended if you experience acute score anxiety or panic and need to reach out instantly.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-indigo-500 to-indigo-600 font-bold"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Unlock Your Dashboard</span>
                <ArrowRight className="h-4.5 w-4.5 animate-pulse" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
