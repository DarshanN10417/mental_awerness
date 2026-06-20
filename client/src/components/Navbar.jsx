import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Smile, 
  BookOpen, 
  MessageSquare, 
  BarChart2, 
  FileText, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mood Log', path: '/mood-checkin', icon: Smile },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'SprintBuddy', path: '/chat', icon: MessageSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Weekly Report', path: '/weekly-report', icon: FileText },
    { name: 'Safety Help', path: '/safety', icon: ShieldAlert },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-card sticky top-4 z-40 mx-4 my-2 px-6 py-3 bg-[#0f172a]/80 dark:bg-[#0f172a]/85 border-slate-200 dark:border-slate-800/80">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
          <Sparkles className="h-6 w-6 text-indigo-500 dark:text-indigo-400 animate-pulse-slow" />
          <span>MindSprint <span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-indigo-600/10 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Theme, Profile & Settings / Logout */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Day/Night Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
            title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
          </button>

          <Link
            to="/profile"
            className={`p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors ${
              isActive('/profile') ? 'text-indigo-600 dark:text-indigo-300 bg-slate-100 dark:bg-slate-800/30' : ''
            }`}
            title="Profile & Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">{user.examType} Candidate</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger & Theme layout */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5.5 w-5.5 text-amber-400" /> : <Moon className="h-5.5 w-5.5 text-indigo-600" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-indigo-600/10 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-300 border-l-4 border-indigo-500'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
          <div className="flex items-center justify-between px-4 py-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <Settings className="h-5 w-5" />
              <span className="text-base font-medium">Settings & Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-rose-500 hover:text-rose-450"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

