import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Building2, 
  Bell, 
  Bot, 
  UserCheck, 
  ShieldCheck, 
  LogOut, 
  Radio, 
  Sparkles 
} from 'lucide-react';

export default function Navbar({ 
  user, 
  onLogout, 
  activeTab, 
  setActiveTab, 
  unreadNotifications, 
  onToggleNotifications, 
  onToggleBot 
}) {
  let isNight = true;
  try {
    const theme = useTheme();
    if (theme) isNight = theme.isNight;
  } catch (e) {
    // Fallback if rendered outside ThemeProvider
  }

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-2xl px-4 lg:px-8 py-3 transition-all duration-700 ${
      isNight 
        ? 'bg-slate-950/80 border-white/10 text-slate-100' 
        : 'bg-white/80 border-slate-200 text-slate-900 shadow-md shadow-slate-900/5'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                HostelSync
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> AI Powered
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Smart Hostel Management & Agentic Orchestration</p>
          </div>
        </div>

        {/* Action Controls & Profile info */}
        <div className="flex items-center gap-3">
          
          {/* Socket.io Live Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Socket.io Connected</span>
          </div>

          {/* Antigravity AI Assistant Trigger */}
          <button 
            onClick={onToggleBot}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all transform hover:scale-105"
          >
            <Bot className="w-4 h-4 text-indigo-200" />
            <span className="hidden sm:inline">AI Safety Assistant</span>
          </button>

          {/* Notifications Button */}
          <button 
            onClick={onToggleNotifications}
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 transition-all"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* User Role Switcher / Profile Badge */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-200">{user.name}</p>
                <span className={`inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${
                  user.role === 'warden' 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : user.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  {user.role}
                </span>
              </div>

              <button 
                onClick={onLogout}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
