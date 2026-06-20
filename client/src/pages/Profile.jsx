import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Settings, User, BookOpen, Clock, Heart, Shield, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateProfileState } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [examType, setExamType] = useState(user?.examType || 'JEE');
  const [examDate, setExamDate] = useState('');
  const [dailyStudyHours, setDailyStudyHours] = useState(user?.dailyStudyHours || 8);
  const [sleepHours, setSleepHours] = useState(user?.sleepHours || 7);
  const [baselineStress, setBaselineStress] = useState(user?.baselineStress || 5);
  const [supportStyle, setSupportStyle] = useState(user?.supportStyle || 'calm mentor');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Set exam date formatted for input on load
  useEffect(() => {
    if (user?.examDate) {
      const date = new Date(user.examDate);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      setExamDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    setLoading(true);

    try {
      const response = await api.auth.updateProfile({
        name,
        examType,
        examDate: new Date(examDate).toISOString(),
        dailyStudyHours: Number(dailyStudyHours),
        sleepHours: Number(sleepHours),
        baselineStress: Number(baselineStress),
        supportStyle,
        emergencyContact
      });
      
      updateProfileState(response.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // clear banner after 3 seconds
    } catch (err) {
      console.error('Update profile failed:', err);
      setError(err.message || 'Could not update profile configurations.');
    } finally {
      setLoading(false);
    }
  };

  const supportStyles = ['calm mentor', 'gentle', 'motivational', 'structured'];

  return (
    <div className="max-w-2xl mx-auto py-4 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <span>Profile & Wellness Targets</span>
        </h2>
        <p className="text-slate-550 dark:text-slate-400 text-xs mt-1">
          Adjust your target exam dates, daily sleep baselines, and chat tone.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8 shadow-xl font-medium">
        {success && (
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 rounded-xl p-3.5 text-xs mb-6">
            <CheckCircle2 className="h-4.5 w-4.5" />
            <span>Profile settings updated successfully. Copilot context refreshed.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-450 rounded-xl p-3.5 text-xs mb-6">
            <AlertCircle className="h-4.5 w-4.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Group 1: General Credentials */}
          <div>
            <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>General Settings</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="name">
                  Aspirant Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl px-4 py-2.5 text-sm text-slate-450 dark:text-slate-550 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Exam & Proximity */}
          <div>
            <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Exam Timings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="examType">
                  Exam Type Target
                </label>
                <select
                  id="examType"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="JEE">JEE</option>
                  <option value="NEET">NEET</option>
                  <option value="CAT">CAT</option>
                  <option value="GATE">GATE</option>
                  <option value="UPSC">UPSC</option>
                  <option value="CUET">CUET</option>
                  <option value="custom">Custom Exam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="examDate">
                  Target Date
                </label>
                <input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Group 3: Core benchmarks */}
          <div>
            <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Study & Wellness Baselines</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="studyHours">
                  Study Hours Goal (Per Day)
                </label>
                <input
                  id="studyHours"
                  type="number"
                  min="1"
                  max="20"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="sleepHours">
                  Sleep Goal (Hours)
                </label>
                <input
                  id="sleepHours"
                  type="number"
                  min="3"
                  max="12"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Baseline Stress Level (1-10)
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={baselineStress}
                    onChange={(e) => setBaselineStress(Number(e.target.value))}
                    className="flex-1 accent-indigo-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                    {baselineStress}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Group 4: Coping */}
          <div>
            <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>SprintBuddy Companion Tone</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Preferred AI Support Tone Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {supportStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSupportStyle(style)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                      supportStyle === style
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Group 5: Emergency Support */}
          <div>
            <h3 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Emergency Mentor Contact</span>
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="emergency">
                Mentor or Guardian Mobile/Contact Number
              </label>
              <input
                id="emergency"
                type="text"
                placeholder="+91 98765 43210"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
              />
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
                <Save className="h-4 w-4" />
                <span>Save Copilot Target Settings</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
