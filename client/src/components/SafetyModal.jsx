import React from 'react';
import { ShieldAlert, Heart, Phone, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const SafetyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="glass-card max-w-lg w-full border-rose-500/40 bg-slate-950 p-6 relative overflow-hidden animate-float">
        {/* Glow Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Safety Icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 mb-4">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">We Are Here For You</h3>
          
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            We noticed some heavy sentiments in your writing. Please remember that your health, well-being, and peace of mind are worth far more than any exam, score, or career. It is okay to feel exhausted, but you don't have to carry this weight alone.
          </p>

          {/* Urgent Hotline Options */}
          <div className="w-full bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 text-left mb-6">
            <div className="flex items-center gap-2 text-rose-300 font-semibold mb-2">
              <Phone className="h-4 w-4" />
              <span>Available Professional Resources</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              If you feel like giving up or are experiencing overwhelming despair, please connect with someone who can help right away:
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="font-semibold text-white">Vandrevala Foundation Helpline</span>
                <a href="tel:+919999666555" className="text-rose-400 font-bold hover:underline">+91 9999 666 555</a>
              </div>
              <div className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="font-semibold text-white">KIRAN Mental Health Support (Govt)</span>
                <a href="tel:18005990019" className="text-rose-400 font-bold hover:underline">1800-599-0019</a>
              </div>
            </div>
          </div>

          {/* Practical steps */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-slate-900/60 rounded-lg text-left border border-slate-800">
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs mb-1">
                <Heart className="h-3.5 w-3.5" />
                <span>Talk to Someone</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Call a parent, sibling, or reliable friend. Let them know you're feeling pressured.
              </p>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg text-left border border-slate-800">
              <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs mb-1">
                <Heart className="h-3.5 w-3.5" />
                <span>Reset Your Day</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Put away the syllabus for today. Drink water, step outside, or sleep for 8 hours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary text-sm"
            >
              Close and Resume
            </button>
            <Link
              to="/safety"
              onClick={onClose}
              className="flex-1 btn-primary text-sm flex items-center justify-center gap-1 bg-gradient-to-r from-rose-500 to-rose-600 shadow-rose-500/20"
            >
              <span>More Help Resources</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyModal;
