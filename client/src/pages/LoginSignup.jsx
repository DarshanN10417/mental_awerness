import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Mail, Lock, User as UserIcon, Calendar, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const LoginSignup = () => {
  const { loginUser, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Set mode based on URL query param (e.g. /login?mode=signup)
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Log in
        const response = await api.auth.login({ email, password });
        loginUser(response.user, response.token);
        navigate('/dashboard');
      } else {
        // Sign up. Provide default mock values for onboarding next
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 90); // default 90 days out
        
        const response = await api.auth.signup({
          name,
          email,
          password,
          examDate: defaultDate.toISOString(),
          examType: 'custom',
          supportStyle: 'calm mentor',
          dailyStudyHours: 8,
          sleepHours: 7,
          baselineStress: 5
        });
        loginUser(response.user, response.token);
        // Direct new signups to Onboarding flow!
        navigate('/onboarding');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-card max-w-md w-full p-8 shadow-2xl relative">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-2">
            <Sparkles className="h-5 w-5" />
            <span>MindSprint AI</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isLogin ? 'Welcome Back Student' : 'Create Your Copilot Account'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 font-medium">
            {isLogin 
              ? 'Log in to sync your exam phase metrics and talk to SprintBuddy.' 
              : 'Sign up to begin your exam phase-aware mental resilience journey.'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-450 rounded-xl p-3.5 text-xs mb-6">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 dark:text-slate-550" />
                <input
                  id="name"
                  type="text"
                  placeholder="Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 dark:text-slate-550" />
              <input
                id="email"
                type="email"
                placeholder="aarav@mindsprint.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 dark:text-slate-550" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center flex items-center justify-center gap-2 mt-2 text-sm py-2.5"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-xs font-medium">
          <p className="text-slate-650 dark:text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-650 dark:text-indigo-400 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        {/* Demo Credentials Alert Helper */}
        {isLogin && (
          <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] text-slate-500 dark:text-slate-450 text-center font-medium">
            <span className="text-indigo-600 dark:text-indigo-350 font-bold uppercase tracking-wider block mb-1">Evaluation Demo Credentials</span>
            <span>Email: <strong className="text-slate-950 dark:text-slate-300">aarav@mindsprint.ai</strong> | Password: <strong className="text-slate-950 dark:text-slate-300">password123</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
