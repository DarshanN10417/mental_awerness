import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SafetyModal from '../components/SafetyModal';
import { MessageSquare, Sparkles, Send, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const [safetyOpen, setSafetyOpen] = useState(false);
  
  const chatEndRef = useRef(null);

  const starterPrompts = [
    "I can't focus today",
    "I'm scared about my mock test score",
    "I feel behind everyone",
    "I studied a lot but still feel guilty",
    "I'm panicking because the exam is close"
  ];

  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await api.chat.getHistory();
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setError('Could not restore past conversations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Auto Scroll to Bottom on message update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    setInput('');
    setError('');
    
    // Add user message immediately to the screen
    const tempUserMsg = { _id: Date.now().toString(), role: 'user', message: text, createdAt: new Date() };
    setMessages((prev) => [...prev, tempUserMsg]);

    setTyping(true);

    // Safety word check on client side
    const lowerText = text.toLowerCase();
    if (lowerText.includes('hopeless') || lowerText.includes('die') || lowerText.includes('disappear') || lowerText.includes('suicide') || lowerText.includes('kill myself') || lowerText.includes('end my life')) {
      setSafetyOpen(true);
    }

    try {
      const response = await api.chat.send(text);
      setMessages((prev) => [...prev, response.assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Connection interrupted. Let us try again.');
    } finally {
      setTyping(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Do you want to clear your chat history with SprintBuddy?')) return;
    try {
      await api.chat.clearHistory();
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-2 flex flex-col h-[85vh] gap-4 font-medium">
      {/* Safety Alert Modal */}
      <SafetyModal isOpen={safetyOpen} onClose={() => setSafetyOpen(false)} />

      {/* Header Panel */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 px-4 py-3.5 rounded-xl shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-none">SprintBuddy</h3>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-1 uppercase font-semibold">Empathetic Wellness Companion</p>
          </div>
        </div>

        <button
          onClick={handleClear}
          disabled={messages.length === 0}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-50"
          title="Clear Conversation"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 rounded-xl p-3 text-xs shrink-0 font-medium">
          {error}
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        {loading ? (
          <div className="m-auto flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-xs">Opening SprintBuddy's log...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="m-auto text-center max-w-sm">
            <Sparkles className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mx-auto mb-3 animate-pulse" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">Hello, I'm SprintBuddy</p>
            <p className="text-xs text-slate-550 dark:text-slate-500 mt-1 leading-relaxed">
              I'm here as your exam wellness copilot. Feel free to talk to me about mock test panic, feeling behind, lack of focus, or parental pressure. How can I help you adjust your mindset today?
            </p>
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item._id}
              className={`flex flex-col max-w-[80%] ${
                item.role === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  item.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-500/5'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}
              >
                {item.message}
              </div>
              <span className="text-[9px] text-slate-500 dark:text-slate-650 mt-1 px-1 font-semibold">
                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}

        {/* Typing indicator bubble */}
        {typing && (
          <div className="flex flex-col self-start items-start max-w-[80%]">
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl rounded-bl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length < 5 && (
        <div className="flex gap-2 overflow-x-auto py-1 shrink-0 scrollbar-none no-scrollbar">
          {starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/20 dark:hover:border-indigo-500/20 text-slate-600 dark:text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-300 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap transition-colors shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex gap-2 shrink-0 bg-white dark:bg-slate-900/40 p-2 border border-slate-200 dark:border-slate-800 rounded-2xl items-center shadow-sm"
      >
        <input
          type="text"
          placeholder="Message SprintBuddy (e.g. I scored low on CAT mock, can't focus)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={typing}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-450 dark:placeholder-slate-600 focus:outline-none"
        />
        
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:hover:bg-indigo-600 shrink-0 shadow"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
