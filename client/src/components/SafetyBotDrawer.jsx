import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Shield, PhoneCall, Clock, HelpCircle } from 'lucide-react';

export default function SafetyBotDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your HostelSync AI Safety & Rules Assistant. Ask me anything about curfew timings, emergency contacts, hostel policies, or leave rules.',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiResponseText = "For immediate hostel assistance, please reach out to the Warden's Desk or submit a ticket through the Complaint Tracker.";
      const queryLower = textToSend.toLowerCase();

      if (queryLower.includes('curfew') || queryLower.includes('timing') || queryLower.includes('time') || queryLower.includes('gate')) {
        aiResponseText = "🕒 **Hostel Gate Curfew**: Main hostel gates strictly lock at **10:00 PM** on weekdays and **10:30 PM** on weekends. Late entry requests must be approved 2 hours prior by your Warden.";
      } else if (queryLower.includes('emergency') || queryLower.includes('doctor') || queryLower.includes('ambulance') || queryLower.includes('contact')) {
        aiResponseText = "🚨 **Emergency Hotlines**:\n- Warden Office: +91-9876543210\n- Campus Medical Clinic: +91-9876543211\n- Security Control Room: Ext 108";
      } else if (queryLower.includes('mess') || queryLower.includes('food') || queryLower.includes('meal')) {
        aiResponseText = "🍽️ **Mess Schedule**:\n- Breakfast: 07:30 AM - 09:30 AM\n- Lunch: 12:30 PM - 02:30 PM\n- Evening Snacks: 05:00 PM - 06:00 PM\n- Dinner: 07:30 PM - 09:30 PM";
      } else if (queryLower.includes('leave') || queryLower.includes('pass')) {
        aiResponseText = "📜 **Outing & Night Leave Rule**: Submit your leave request via the Student Dashboard at least 12 hours in advance. Attendance >75% is evaluated by our AI Leave Agent before Warden approval.";
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setLoading(false);
    }, 750);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-900/95 backdrop-blur-2xl border-l border-indigo-500/20 shadow-2xl flex flex-col transition-all">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-sm">HostelSync AI Assistant</h3>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">Antigravity Safety & Rules Engine</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 border-b border-white/5 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => handleSend("What is the hostel gate curfew timing?")}
          className="px-2.5 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium whitespace-nowrap flex items-center gap-1"
        >
          <Clock className="w-3 h-3" /> Gate Curfew
        </button>
        <button 
          onClick={() => handleSend("What are the emergency contacts?")}
          className="px-2.5 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-[11px] font-medium whitespace-nowrap flex items-center gap-1"
        >
          <PhoneCall className="w-3 h-3" /> Emergency Numbers
        </button>
        <button 
          onClick={() => handleSend("What is the mess meal timing?")}
          className="px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-[11px] font-medium whitespace-nowrap flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3" /> Mess Schedule
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none shadow-md'
                : 'bg-slate-800/90 border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
            }`}>
              <div className="whitespace-pre-line">{msg.text}</div>
              <div className={`mt-1.5 text-[10px] text-right opacity-60`}>{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl bg-slate-800/90 border border-white/10 text-xs text-indigo-400 flex items-center gap-2">
              <Bot className="w-4 h-4 animate-spin text-indigo-400" />
              <span>AI Assistant is analyzing hostel guidelines...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-white/10 bg-slate-950">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about curfew, mess, rules..."
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
