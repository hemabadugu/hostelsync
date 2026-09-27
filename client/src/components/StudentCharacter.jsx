import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function StudentCharacter() {
  const { isNight, isTransitioning } = useTheme();

  return (
    <div className="relative w-full h-full flex items-end justify-center pointer-events-none">
      
      {/* 1. STUDY MODE (Sitting at Desk) */}
      {!isNight && !isTransitioning && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute left-[15%] bottom-[12%] flex flex-col items-center z-20"
        >
          {/* Student Head & Torso Sitting */}
          <div className="relative flex flex-col items-center">
            {/* Hair & Head */}
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 shadow-md relative">
              <div className="w-8 h-4 bg-slate-700 rounded-t-full absolute top-0 left-1" />
            </div>
            
            {/* Hoodie Torso */}
            <motion.div 
              animate={{ y: [0, -1.5, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-14 h-14 bg-indigo-600 rounded-t-2xl border border-indigo-400 mt-0.5 flex flex-col items-center justify-end pb-1 shadow-md"
            >
              {/* Typing Hands Movement */}
              <div className="flex gap-2">
                <motion.div 
                  animate={{ y: [0, -3, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.3 }}
                  className="w-3 h-2 bg-amber-200 rounded-full"
                />
                <motion.div 
                  animate={{ y: [-3, 0, -3] }} 
                  transition={{ repeat: Infinity, duration: 0.3 }}
                  className="w-3 h-2 bg-amber-200 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* 2. TRANSITION MODE (Walking to Bed) */}
      {isTransitioning && (
        <motion.div
          initial={{ x: '-100%', opacity: 1 }}
          animate={{ x: '100%', opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-[20%] bottom-[14%] z-20 flex flex-col items-center"
        >
          <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-900" />
          <div className="w-12 h-16 bg-indigo-600 rounded-2xl border border-indigo-400 mt-0.5" />
        </motion.div>
      )}

      {/* 3. SLEEP MODE (Lying in Bed) */}
      {isNight && !isTransitioning && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute right-[18%] bottom-[13%] z-20 flex items-center gap-1.5"
        >
          {/* Head Resting on Pillow */}
          <div className="w-9 h-9 rounded-full bg-amber-200 border-2 border-slate-900 shadow-md relative">
            <div className="w-8 h-4 bg-slate-800 rounded-t-full absolute top-0 left-0.5" />
          </div>

          {/* Sleeping Body under Blanket with Breathing Motion */}
          <motion.div
            animate={{ scaleY: [1, 0.94, 1], y: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="w-24 h-10 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl border border-indigo-400/60 shadow-lg"
          />

          {/* Floating ZZZ Particles */}
          <div className="absolute -top-12 left-4 flex flex-col items-center font-bold text-indigo-300">
            <motion.span
              animate={{ opacity: [0, 1, 0], y: [0, -25], scale: [0.7, 1.2] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-xs"
            >
              Z
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0], y: [0, -35], scale: [0.7, 1.4] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1, ease: "easeInOut" }}
              className="text-sm text-cyan-300"
            >
              z
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0], y: [0, -45], scale: [0.7, 1.6] }}
              transition={{ repeat: Infinity, duration: 3, delay: 2, ease: "easeInOut" }}
              className="text-base text-purple-300"
            >
              z
            </motion.span>
          </div>
        </motion.div>
      )}

    </div>
  );
}
