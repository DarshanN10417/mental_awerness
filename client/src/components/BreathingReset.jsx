import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Wind, Sparkles } from 'lucide-react';

const BreathingReset = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Inhale: 4s, Hold: 4s, Exhale: 6s, Hold: 2s (Box variant adapted)
  const phases = {
    Inhale: { duration: 4, next: 'Hold', text: 'Breathe In Slowly...', scale: 1.4, color: 'bg-emerald-500/20 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300' },
    Hold: { duration: 4, next: 'Exhale', text: 'Hold Your Breath...', scale: 1.4, color: 'bg-indigo-500/20 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300' },
    Exhale: { duration: 6, next: 'HoldEmpty', text: 'Exhale Fully...', scale: 1.0, color: 'bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300' },
    HoldEmpty: { duration: 2, next: 'Inhale', text: 'Pause and Empty...', scale: 1.0, color: 'bg-slate-200 dark:bg-slate-700/30 text-slate-650 dark:text-slate-400' }
  };

  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const nextPhase = phases[phase].next;
            setPhase(nextPhase);
            
            if (nextPhase === 'Inhale') {
              setCyclesCompleted((c) => c + 1);
            }
            
            return phases[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('Inhale');
    setSecondsLeft(4);
    setCyclesCompleted(0);
  };

  if (!isOpen) return null;

  const currentPhaseConfig = phases[phase];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="glass-card max-w-md w-full border border-slate-200 dark:border-indigo-500/30 bg-white dark:bg-[#0f172a] p-8 text-center relative overflow-hidden font-medium">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-bold tracking-wider text-xs uppercase mb-6">
            <Wind className="h-4 w-4 animate-pulse" />
            <span>2-Minute Mindful Reset</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Breathing Calming Circle</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs mb-8 max-w-xs font-semibold">
            Follow the expanding circle. This triggers your parasympathetic nervous system to clear panic and focus blocks.
          </p>

          {/* Calming Circle Visualizer */}
          <div className="relative w-56 h-56 flex items-center justify-center mb-10">
            {/* Outer pulsating circle */}
            <div 
              className={`absolute rounded-full border border-indigo-500/10 transition-all duration-[2000ms] ${
                isActive ? 'w-56 h-56 opacity-10' : 'w-36 h-36 opacity-0'
              }`}
            ></div>
            
            {/* Main Interactive Circle */}
            <div
              style={{
                transform: `scale(${currentPhaseConfig.scale})`,
                transition: `transform ${phase === 'Inhale' ? 4000 : phase === 'Exhale' ? 6000 : 500}ms cubic-bezier(0.4, 0, 0.2, 1)`
              }}
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-lg transition-colors duration-1000 ${currentPhaseConfig.color}`}
            >
              {/* Inner core */}
              <div className="text-center p-4">
                <span className="text-2xl font-bold font-sans text-slate-900 dark:text-white block">
                  {secondsLeft}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 block mt-1">
                  {phase === 'HoldEmpty' ? 'Hold' : phase}
                </span>
              </div>
            </div>
          </div>

          {/* Instruction Text */}
          <p className="text-lg font-medium text-indigo-650 dark:text-white h-8 mb-6 animate-pulse">
            {isActive ? currentPhaseConfig.text : 'Ready to begin? Press Play.'}
          </p>

          {/* Stats */}
          <div className="flex justify-between w-full bg-slate-50 dark:bg-slate-900/60 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 mb-8 font-semibold">
            <span>Cycle: <strong className="text-slate-900 dark:text-white">{cyclesCompleted}</strong></span>
            <span>Pattern: <strong className="text-slate-900 dark:text-white">4s - 4s - 6s - 2s</strong></span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Reset"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={handleStartStop}
              className="px-6 py-3 bg-indigo-600 rounded-full font-semibold text-white flex items-center gap-2 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
            >
              {isActive ? (
                <>
                  <Pause className="h-5 w-5" />
                  <span>Pause Reset</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  <span>Start Reset</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingReset;
