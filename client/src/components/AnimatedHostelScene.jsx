import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import StudentCharacter from './StudentCharacter';

export default function AnimatedHostelScene() {
  const { isNight, isTransitioning } = useTheme();

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-0">
      
      {/* 1. ROOM BACKGROUND GRADIENT (Transitions 1.5s) */}
      <motion.div
        animate={{
          background: isNight
            ? 'linear-gradient(135deg, #030712 0%, #0f172a 40%, #1e1b4b 100%)'
            : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 40%, #fef3c7 100%)'
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute inset-0 w-full h-full"
      />

      {/* 2. WINDOW ILLUSTRATION (Left Top View) */}
      <div className="absolute top-16 left-12 w-48 h-64 rounded-t-full border-8 border-slate-800 bg-slate-950 overflow-hidden shadow-2xl z-0">
        <AnimatePresence mode="wait">
          {!isNight ? (
            /* Sunset / Study Sky */
            <motion.div
              key="day-sky"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full h-full bg-gradient-to-b from-orange-400 via-amber-300 to-sky-300 relative flex items-center justify-center"
            >
              {/* Sun */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-16 h-16 rounded-full bg-amber-200 shadow-[0_0_40px_rgba(253,224,71,0.9)]"
              />
              {/* Moving Soft Clouds */}
              <motion.div
                animate={{ x: [-20, 140] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute top-6 left-0 w-14 h-5 bg-white/80 rounded-full blur-[1px]"
              />
            </motion.div>
          ) : (
            /* Midnight Starry Sky */
            <motion.div
              key="night-sky"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 relative"
            >
              {/* Glowing Moon */}
              <div className="w-12 h-12 rounded-full bg-slate-100 absolute top-6 right-6 shadow-[0_0_25px_rgba(255,255,255,0.8)] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-950 translate-x-3 -translate-y-1" />
              </div>

              {/* Twinkling Stars */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.5 + (i % 3), delay: i * 0.2 }}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: i % 2 === 0 ? '3px' : '2px',
                    height: i % 2 === 0 ? '3px' : '2px',
                    top: `${(i * 18) % 80 + 10}%`,
                    left: `${(i * 25) % 80 + 10}%`
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Window Grill Cross Lines */}
        <div className="absolute inset-0 border-r-2 border-b-2 border-slate-800/80 pointer-events-none" />
      </div>

      {/* SWAYING CURTAINS */}
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-14 left-8 w-10 h-72 bg-gradient-to-r from-indigo-900/60 to-transparent blur-[1px] z-10"
      />

      {/* CEILING FAN ROTATING CONTINUOUSLY */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 flex flex-col items-center z-10">
        <div className="w-2 h-16 bg-slate-800" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-36 h-36 relative flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900" />
          <div className="w-16 h-3 bg-slate-800 rounded-full absolute -left-12" />
          <div className="w-16 h-3 bg-slate-800 rounded-full absolute -right-12" />
          <div className="w-3 h-16 bg-slate-800 rounded-full absolute -top-12" />
          <div className="w-3 h-16 bg-slate-800 rounded-full absolute -bottom-12" />
        </motion.div>
      </div>

      {/* WALL CLOCK */}
      <div className="absolute top-20 left-[42%] w-16 h-16 rounded-full border-4 border-slate-800 bg-slate-900 flex flex-col items-center justify-center text-[10px] font-bold text-slate-300 shadow-md z-10">
        <span className="text-[9px] text-amber-400 font-mono">{isNight ? '10:30' : '08:00'}</span>
        <span className="text-[7px] text-slate-500">{isNight ? 'PM' : 'PM'}</span>
      </div>

      {/* LAMP GLOW LIGHT CONE */}
      <AnimatePresence>
        {!isNight && (
          <motion.div
            key="lamp-glow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.8 }}
            className="absolute left-[12%] bottom-[15%] w-80 h-80 rounded-full bg-gradient-to-tr from-amber-300/40 via-yellow-400/20 to-transparent blur-3xl pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* STUDY DESK & FURNITURE (LEFT SIDE) */}
      <div className="absolute left-[8%] bottom-[8%] w-80 flex flex-col items-center z-10">
        
        {/* Desk Lamp */}
        <div className="relative mb-1 self-start ml-12">
          <div className={`w-10 h-14 border-l-4 border-t-4 rounded-tl-2xl transition-colors duration-700 ${isNight ? 'border-slate-800' : 'border-amber-400'}`} />
          <div className={`w-8 h-5 rounded-t-full -mt-3 -ml-2 transition-colors duration-700 ${isNight ? 'bg-slate-800' : 'bg-amber-300 shadow-[0_0_20px_#fde047]'}`} />
        </div>

        {/* Laptop & Books */}
        <div className="flex items-end gap-2 mb-1 self-start ml-20">
          <div className="w-14 h-8 bg-slate-800 rounded-t-lg border border-slate-600 flex items-center justify-center">
            <div className={`w-11 h-6 rounded transition-colors duration-700 ${isNight ? 'bg-slate-950' : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'}`} />
          </div>
          <div className="w-6 h-4 bg-indigo-600 rounded-sm" />
          <div className="w-5 h-3 bg-emerald-600 rounded-sm" />
        </div>

        {/* Desk Surface */}
        <div className="w-full h-5 bg-amber-950 rounded-t-xl border-t-2 border-amber-800 shadow-xl" />
        <div className="w-[90%] flex justify-between">
          <div className="w-4 h-24 bg-amber-950" />
          <div className="w-4 h-24 bg-amber-950" />
        </div>
      </div>

      {/* HOSTEL BED & FRAME (RIGHT SIDE) */}
      <div className="absolute right-[8%] bottom-[8%] w-96 flex flex-col items-end z-10">
        <div className="w-full relative">
          {/* Headboard */}
          <div className="w-4 h-20 bg-amber-950 absolute -left-2 -top-10 rounded-t-md" />
          {/* Pillow */}
          <div className="w-12 h-7 bg-slate-100 rounded-xl absolute left-4 -top-5 border border-slate-300 shadow-md" />
          {/* Mattress */}
          <div className="w-full h-10 bg-indigo-950 rounded-t-2xl border-t-4 border-indigo-400 shadow-2xl flex items-center px-3">
            <div className="w-full h-6 bg-indigo-700/80 rounded-lg" />
          </div>
          {/* Bed Frame Legs */}
          <div className="w-full h-4 bg-amber-950 rounded-b-lg flex justify-between px-3">
            <div className="w-4 h-12 bg-amber-950 -mt-1" />
            <div className="w-4 h-12 bg-amber-950 -mt-1" />
          </div>
        </div>
      </div>

      {/* ANIMATED STUDENT CHARACTER ENGINE */}
      <StudentCharacter />

      {/* AMBIENT DUST PARTICLES IN DAY / FIREFLIES IN NIGHT */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-10, -80, -10],
            x: [0, (i % 2 === 0 ? 30 : -30), 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{ repeat: Infinity, duration: 6 + (i % 4), delay: i * 0.5 }}
          className={`absolute rounded-full ${isNight ? 'bg-cyan-300 shadow-[0_0_8px_#67e8f9]' : 'bg-amber-200/60'}`}
          style={{
            width: '4px',
            height: '4px',
            top: `${(i * 15) % 70 + 20}%`,
            left: `${(i * 12) % 80 + 10}%`
          }}
        />
      ))}

    </div>
  );
}
