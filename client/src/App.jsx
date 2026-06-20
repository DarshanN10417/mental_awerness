import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Import Pages
import Landing from './pages/Landing';
import LoginSignup from './pages/LoginSignup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import MoodCheckIn from './pages/MoodCheckIn';
import Journal from './pages/Journal';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import WeeklyReport from './pages/WeeklyReport';
import Profile from './pages/Profile';
import SafetyHelp from './pages/SafetyHelp';

// Private Route Guard
const PrivateRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm font-medium">Gathering focus parameters...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      {/* Navigation bar is visible only when the user is logged in */}
      {user && <Navbar />}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginSignup />} />

          {/* Protected Routes */}
          <Route path="/onboarding" element={
            <PrivateRoute>
              <Onboarding />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/mood-checkin" element={
            <PrivateRoute>
              <MoodCheckIn />
            </PrivateRoute>
          } />
          <Route path="/journal" element={
            <PrivateRoute>
              <Journal />
            </PrivateRoute>
          } />
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
          <Route path="/analytics" element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } />
          <Route path="/weekly-report" element={
            <PrivateRoute>
              <WeeklyReport />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/safety" element={
            <PrivateRoute>
              <SafetyHelp />
            </PrivateRoute>
          } />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
