import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Monitor, Sparkles, FileText } from 'lucide-react';

export default function LandingIntro({ onEnter, onRecruiterView }) {
  return (
    <div className="fixed inset-0 bg-[#0a0502] text-white flex flex-col items-center justify-center p-6 z-[9998] font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #ff4e00 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #3a1510 0%, transparent 70%)' }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl w-full text-center space-y-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Ramit Kr. Gupta</h1>
        <p className="text-xl md:text-2xl text-white/70 font-serif italic">
          Explore my portfolio in three modes: a nostalgic desktop, a developer terminal, and an immersive project showcase.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnter}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-3 shadow-xl shadow-white/10 transition-shadow hover:shadow-white/20"
          >
            <Monitor size={20} />
            Enter Experience
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRecruiterView}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-white/5 transition-colors"
          >
            <FileText size={20} />
            Quick Recruiter View
          </motion.button>
        </div>

        <div className="flex justify-center gap-8 mt-16 text-white/40">
          <div className="flex flex-col items-center gap-2">
            <Monitor size={24} />
            <span className="text-xs uppercase tracking-widest">XP Mode</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Terminal size={24} />
            <span className="text-xs uppercase tracking-widest">Dev Mode</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Sparkles size={24} />
            <span className="text-xs uppercase tracking-widest">Creative Mode</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
