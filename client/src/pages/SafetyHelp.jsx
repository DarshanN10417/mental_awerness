import React, { useState } from 'react';
import { ShieldAlert, Heart, Phone, Info, Wind, ExternalLink, Calendar, Users } from 'lucide-react';
import BreathingReset from '../components/BreathingReset';
import { useAuth } from '../context/AuthContext';

const SafetyHelp = () => {
  const { user } = useAuth();
  const [breathingOpen, setBreathingOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-4 flex flex-col gap-6">
      
      {/* Visual Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500 dark:text-rose-400">
          <ShieldAlert className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Empathetic Safety & Help Center</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Always available resources and crisis grounding steps for exam-day stress or extreme fatigue.
          </p>
        </div>
      </div>

      {/* Main product disclaimer Alert */}
      <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex gap-4">
        <Info className="h-6 w-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <strong className="text-slate-900 dark:text-white block mb-1">MindSprint AI Product Disclaimer & Scope</strong>
          MindSprint AI is designed exclusively as an emotional resilience copilot to log mood patterns and build healthy coping routines. 
          It <strong className="text-slate-900 dark:text-white">does not provide clinical counseling, psychiatric diagnostics, or mental health therapy</strong>. 
          If you are experiencing severe, persistent anxiety, depression, or distress, please consult a certified mental health professional or reached out to one of the resources below.
        </div>
      </div>

      {/* Grid: Helplines and Grounding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Column 1: Helplines */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Phone className="h-4.5 w-4.5 text-rose-500 dark:text-rose-400" />
              <span>Professional Helplines</span>
            </h3>

            <p className="text-slate-550 dark:text-slate-400 text-xs leading-relaxed mb-6">
              If you feel heavily overwhelmed or have thoughts of giving up, please call these free, confidential, 24/7 services right away:
            </p>

            <div className="flex flex-col gap-3.5">
              
              {/* Vandrevala */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-850 rounded-xl">
                <span className="text-slate-850 dark:text-white font-bold text-xs block">Vandrevala Foundation</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 block mt-0.5 leading-normal">Crisis intervention, mental health counseling support in India.</span>
                <div className="flex justify-between items-center mt-3">
                  <a href="tel:+919999666555" className="text-rose-600 dark:text-rose-400 font-bold text-xs hover:underline">+91 9999 666 555</a>
                  <a href="https://www.vandrevalafoundation.com" target="_blank" rel="noreferrer" className="text-[9px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Kiran */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-850 rounded-xl">
                <span className="text-slate-850 dark:text-white font-bold text-xs block">KIRAN Mental Health Support Line</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 block mt-0.5 leading-normal">Government helpline managed by the Ministry of Social Justice.</span>
                <div className="flex justify-between items-center mt-3">
                  <a href="tel:18005990019" className="text-rose-600 dark:text-rose-400 font-bold text-xs hover:underline">1800-599-0019</a>
                  <span className="text-[9px] text-slate-500 dark:text-slate-650 uppercase font-bold">Govt of India</span>
                </div>
              </div>

              {/* Sneha */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-850 rounded-xl">
                <span className="text-slate-850 dark:text-white font-bold text-xs block">Sneha Suicide Prevention India</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 block mt-0.5 leading-normal">Specialized crisis support based out of Chennai.</span>
                <div className="flex justify-between items-center mt-3">
                  <a href="tel:+914424640050" className="text-rose-600 dark:text-rose-400 font-bold text-xs hover:underline">+91 44 2464 0050</a>
                  <a href="https://snehaindia.org" target="_blank" rel="noreferrer" className="text-[9px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {user?.emergencyContact && (
            <div className="mt-6 p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-xl">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Your Saved Mentor Contact</span>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-xs font-semibold text-white">Direct call:</span>
                <a href={`tel:${user.emergencyContact}`} className="text-indigo-400 font-bold text-sm hover:underline">
                  {user.emergencyContact}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Grounding */}
        <div className="flex flex-col gap-6">
          
          {/* Grounding Exercise */}
          <div className="glass-card p-6 flex-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Heart className="h-4.5 w-4.5 text-rose-500 dark:text-rose-400" />
              <span>Sensory Grounding Protocol</span>
            </h3>

            <p className="text-slate-650 dark:text-slate-400 text-xs leading-relaxed mb-4">
              If you experience a sudden wave of exam panic, rapid heart rate, or spiraling fear of failure, follow the <strong>5-4-3-2-1 method</strong> to slow down:
            </p>

            <div className="flex flex-col gap-3.5 text-xs">
              <div className="flex items-start gap-3 bg-slate-50/50 dark:bg-slate-950/40 p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl">
                <span className="text-rose-500 dark:text-rose-400 font-black text-sm shrink-0">5</span>
                <p className="text-slate-600 dark:text-slate-300"><strong className="text-slate-850 dark:text-white">Things you can see:</strong> Scan your room. Focus on shapes (e.g. your pencil box, window frame, wall clock).</p>
              </div>
              
              <div className="flex items-start gap-3 bg-slate-50/50 dark:bg-slate-950/40 p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl">
                <span className="text-rose-500 dark:text-rose-400 font-black text-sm shrink-0">4</span>
                <p className="text-slate-600 dark:text-slate-300"><strong className="text-slate-850 dark:text-white">Things you can touch:</strong> Feel the wooden table surface, your cotton clothes, your feet on the hard floor.</p>
              </div>

              <div className="flex items-start gap-3 bg-slate-50/50 dark:bg-slate-950/40 p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl">
                <span className="text-rose-500 dark:text-rose-400 font-black text-sm shrink-0">3</span>
                <p className="text-slate-600 dark:text-slate-300"><strong className="text-slate-850 dark:text-white">Things you can hear:</strong> Listen closely for distant traffic, a ceiling fan whirring, or birds outside.</p>
              </div>

              <div className="flex items-start gap-3 bg-slate-50/50 dark:bg-slate-950/40 p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl">
                <span className="text-rose-500 dark:text-rose-400 font-black text-sm shrink-0">2</span>
                <p className="text-slate-600 dark:text-slate-300"><strong className="text-slate-850 dark:text-white">Things you can smell:</strong> Notice coffee, pages in a textbook, or fresh air.</p>
              </div>

              <div className="flex items-start gap-3 bg-slate-50/50 dark:bg-slate-950/40 p-2.5 border border-slate-200 dark:border-slate-850 rounded-xl">
                <span className="text-rose-500 dark:text-rose-400 font-black text-sm shrink-0">1</span>
                <p className="text-slate-600 dark:text-slate-300"><strong className="text-slate-850 dark:text-white">Thing you can say to yourself:</strong> Repeat: "I have prepared. I am breathing. I can handle this hour step-by-step."</p>
              </div>
            </div>
          </div>

          {/* Quick Breathing Reset Trigger */}
          <div className="glass-card border-indigo-200 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50/30 to-[#ffffff] dark:from-indigo-950/30 dark:to-[#0f172a] p-6 text-center">
            <Wind className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mx-auto mb-2 animate-pulse" />
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">Feeling Tight In Your Chest?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-xs max-w-xs mx-auto mb-4 leading-normal">
              Activate our 2-minute visual breathing circles to immediately slow your breathing rhythm.
            </p>
            <button
              onClick={() => setBreathingOpen(true)}
              className="btn-primary text-xs py-2 w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-indigo-500/10"
            >
              <Wind className="h-4.5 w-4.5" />
              <span>Launch Calming Circle</span>
            </button>
          </div>

        </div>
      </div>

      {/* Interactive visualizer */}
      <BreathingReset isOpen={breathingOpen} onClose={() => setBreathingOpen(false)} />
    </div>
  );
};

export default SafetyHelp;
