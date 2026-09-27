import React, { useState } from 'react';
import { Sun, Moon, Lamp, Sparkles, BookOpen, Coffee } from 'lucide-react';
import './animatedRoom.css';

export default function AnimatedRoom() {
  // Mode: 'day' | 'evening' | 'night'
  const [mode, setMode] = useState('night');

  return (
    <div className={`animated-room-container ${mode} flex flex-col justify-between p-6 relative select-none`}>
      
      {/* Time of Day Control Bar */}
      <div className="flex items-center justify-between z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
          {mode === 'day' && <span className="flex items-center gap-1 text-amber-300"><Sun className="w-3.5 h-3.5" /> 07:30 AM — Studying</span>}
          {mode === 'evening' && <span className="flex items-center gap-1 text-orange-300"><Coffee className="w-3.5 h-3.5" /> 08:00 PM — Late Review</span>}
          {mode === 'night' && <span className="flex items-center gap-1 text-indigo-300"><Moon className="w-3.5 h-3.5" /> 11:00 PM — Sleeping</span>}
        </div>

        {/* Scene Toggle Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          <button
            onClick={() => setMode('day')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              mode === 'day' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' : 'text-slate-300 hover:text-white'
            }`}
            title="Day Mode"
          >
            ☀️ Day
          </button>
          <button
            onClick={() => setMode('evening')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              mode === 'evening' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'text-slate-300 hover:text-white'
            }`}
            title="Evening Mode"
          >
            💡 Study
          </button>
          <button
            onClick={() => setMode('night')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              mode === 'night' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:text-white'
            }`}
            title="Night Mode"
          >
            🌙 Night
          </button>
        </div>
      </div>

      {/* WINDOW ILLUSTRATION (Left Top Background) */}
      <div className="absolute top-12 left-8 w-36 h-44 rounded-t-full border-4 border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-inner z-0">
        {mode === 'day' && (
          <div className="w-full h-full bg-gradient-to-b from-sky-400 to-indigo-300 relative flex items-center justify-center">
            {/* Sun */}
            <div className="w-12 h-12 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(253,224,71,0.8)] animate-pulse" />
            <div className="absolute top-4 left-2 w-10 h-4 rounded-full bg-white/70 blur-[1px]" />
          </div>
        )}

        {mode === 'evening' && (
          <div className="w-full h-full bg-gradient-to-b from-orange-500 via-purple-600 to-slate-900 relative">
            <div className="w-10 h-10 rounded-full bg-amber-400 absolute bottom-4 right-4 shadow-[0_0_25px_rgba(251,146,60,0.9)]" />
          </div>
        )}

        {mode === 'night' && (
          <div className="w-full h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 relative">
            {/* Moon */}
            <div className="w-10 h-10 rounded-full bg-slate-100 absolute top-4 right-4 shadow-[0_0_15px_rgba(255,255,255,0.7)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-950 translate-x-2 -translate-y-1" />
            </div>
            {/* Twinkling Stars */}
            <div className="star w-1 h-1 top-6 left-4" />
            <div className="star w-1.5 h-1.5 top-16 left-10" />
            <div className="star w-1 h-1 top-24 left-6" />
          </div>
        )}
      </div>

      {/* LAMP GLOW DIFFUSED EFFECT */}
      <div className="lamp-glow" />

      {/* ZZZ FLOATING PARTICLES IN NIGHT MODE */}
      {mode === 'night' && (
        <>
          <div className="zzz-particle zzz-particle-1">Z</div>
          <div className="zzz-particle zzz-particle-2">z</div>
          <div className="zzz-particle zzz-particle-3">z</div>
        </>
      )}

      {/* ROOM SCENE GRAPHICS */}
      <div className="relative z-10 mt-auto pt-24 grid grid-cols-12 gap-4 items-end">
        
        {/* LEFT: STUDY DESK & LAMP */}
        <div className="col-span-6 relative flex flex-col items-center">
          
          {/* Desk Lamp */}
          <div className="relative mb-1">
            <div className={`w-8 h-10 border-l-4 border-t-4 rounded-tl-xl ${mode === 'night' ? 'border-slate-700' : 'border-amber-400'}`} />
            <div className={`w-6 h-4 rounded-t-full -mt-2 -ml-2 ${mode === 'night' ? 'bg-slate-700' : 'bg-amber-300 shadow-[0_0_15px_#fde047]'}`} />
          </div>

          {/* Laptop & Study Materials */}
          <div className="flex items-end gap-1 mb-1">
            <div className="w-10 h-6 bg-slate-800 rounded-t-md border border-slate-600 flex items-center justify-center">
              <div className={`w-8 h-4 rounded ${mode === 'night' ? 'bg-slate-900' : 'bg-cyan-500/80 animate-pulse'}`} />
            </div>
            <div className="w-5 h-3 bg-indigo-500 rounded-sm" />
            <div className="w-4 h-2 bg-emerald-500 rounded-sm" />
          </div>

          {/* Desk Furniture */}
          <div className="w-full h-4 bg-amber-900/90 rounded-t-lg border-t border-amber-700 shadow-md" />
          <div className="w-[85%] flex justify-between">
            <div className="w-3 h-16 bg-amber-950" />
            <div className="w-3 h-16 bg-amber-950" />
          </div>

          {/* Sitting Student at Desk (Day/Evening) */}
          {mode !== 'night' && (
            <div className="absolute right-4 bottom-5 flex flex-col items-center animate-bounce" style={{ animationDuration: '4s' }}>
              {/* Head */}
              <div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-slate-900 shadow-md mb-0.5" />
              {/* Torso sitting */}
              <div className="w-10 h-10 bg-indigo-600 rounded-t-xl border border-indigo-400" />
            </div>
          )}
        </div>

        {/* RIGHT: HOSTEL BED & SLEEPING STUDENT */}
        <div className="col-span-6 relative flex flex-col items-end">
          
          {/* Sleeping Student (Night Mode) */}
          {mode === 'night' && (
            <div className="absolute right-6 bottom-8 z-20 student-sleeping-body flex items-center gap-1">
              {/* Head on Pillow */}
              <div className="w-7 h-7 rounded-full bg-amber-200 border-2 border-slate-950 shadow-md" />
              {/* Covered Body */}
              <div className="w-16 h-8 bg-indigo-600 rounded-2xl border border-indigo-400" />
            </div>
          )}

          {/* Bed Structure */}
          <div className="w-full relative">
            {/* Pillow */}
            <div className="w-8 h-5 bg-slate-100 rounded-lg absolute left-2 -top-4 border border-slate-300 shadow-sm" />
            {/* Mattress */}
            <div className="w-full h-7 bg-indigo-900/80 rounded-t-xl border-t-2 border-indigo-400 shadow-lg flex items-center px-2">
              <div className="w-full h-4 bg-indigo-600/70 rounded-md" />
            </div>
            {/* Bed Frame Legs */}
            <div className="w-full h-3 bg-amber-950 rounded-b-md flex justify-between px-2">
              <div className="w-3 h-8 bg-amber-950 -mt-1" />
              <div className="w-3 h-8 bg-amber-950 -mt-1" />
            </div>
          </div>

        </div>

      </div>

      {/* Status Overlay Footer */}
      <div className="relative z-10 mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
        <span className="font-semibold">Hostel Block B • Room B-204</span>
        <span className="text-indigo-300 font-bold">
          {mode === 'night' ? '🌙 Quiet Hours Active (Lamp OFF)' : '💡 Study Hours Active'}
        </span>
      </div>

    </div>
  );
}
