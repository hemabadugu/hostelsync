import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import AnimatedHostelScene from '../components/AnimatedHostelScene.jsx';
import LoginCard from '../components/LoginCard.jsx';

export default function LoginPage({ onLoginSuccess }) {
  const { isNight } = useTheme();

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden select-none">
      
      {/* 1. FULL-SCREEN 100VW x 100VH CINEMATIC ANIMATED HOSTEL ROOM BACKGROUND */}
      <AnimatedHostelScene />

      {/* 2. MAIN HERO & FLOATING LOGIN CARD CONTENT OVERLAY */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 my-auto">
        
        {/* Left Column: Hero Text & AI Feature Cards */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-lg transition-all duration-700 ${
            isNight 
              ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border-indigo-500/30 text-indigo-300 shadow-indigo-500/10'
              : 'bg-white/80 border-slate-300 text-slate-800 shadow-slate-900/10 backdrop-blur-md'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Smart AI-Powered Hostel Platform</span>
          </div>

          {/* Highlighted Website Name: HostelSync */}
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                isNight 
                  ? 'from-indigo-400 via-cyan-300 via-violet-300 to-indigo-200 animate-shimmer-text drop-shadow-[0_0_35px_rgba(99,102,241,0.5)]'
                  : 'from-slate-900 via-indigo-900 to-slate-800 drop-shadow-sm'
              }`}>
                HostelSync
              </span>
            </h1>
            <p className={`text-sm font-semibold tracking-wide uppercase transition-colors duration-700 ${
              isNight ? 'text-indigo-300/90' : 'text-indigo-700'
            }`}>
              Full-Screen Cinematic SaaS Experience
            </p>
          </div>

          <p className={`text-sm leading-relaxed max-w-lg transition-colors duration-700 ${
            isNight ? 'text-slate-300' : 'text-slate-700 font-medium'
          }`}>
            HostelSync coordinates multi-agent intelligence to streamline room allocations, automate maintenance complaint triage, and manage attendance & leave workflows.
          </p>

          {/* AI Feature Cards */}
          <div className="space-y-3 pt-2">
            {[
              { title: "AI Room Allocation Agent", desc: "Matches compatible roommates based on preferences & department" },
              { title: "Smart Complaint Triage", desc: "Categorizes maintenance tickets & auto-assigns SLA priorities" },
              { title: "Attendance-Guided Leave Agent", desc: "Provides data-driven leave recommendations to Wardens" }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-3.5 p-3.5 rounded-2xl border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] shadow-md group ${
                  isNight
                    ? 'bg-slate-950/70 border-white/10 text-white hover:border-indigo-500/40 hover:bg-slate-900/90'
                    : 'bg-white/75 border-slate-200 text-slate-900 hover:border-indigo-400 hover:bg-white/95'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-cyan-500/30 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold group-hover:text-indigo-500 transition-colors">{feature.title}</h4>
                  <p className={`text-[11px] mt-0.5 ${isNight ? 'text-slate-400' : 'text-slate-600'}`}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Floating Glassmorphism Login Card */}
        <div className="lg:col-span-6">
          <LoginCard onLoginSuccess={onLoginSuccess} />
        </div>

      </div>

    </div>
  );
}
