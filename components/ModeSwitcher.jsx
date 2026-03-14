'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Monitor, Code, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function ModeSwitcher() {
  const { mode, toggleMode } = useTheme();

  const getModeStyles = () => {
    switch (mode) {
      case 'xp': return 'bg-blue-600 text-white border-blue-400';
      case 'dev': return 'bg-zinc-900 text-green-400 border-zinc-700 font-mono';
      case 'creative': return 'bg-orange-500 text-white border-orange-300';
      default: return 'bg-white text-black';
    }
  };

  const getModeContent = () => {
    switch (mode) {
      case 'xp': return { icon: Code, label: 'Switch to Dev Mode' };
      case 'dev': return { icon: Sparkles, label: 'Switch to Creative Mode' };
      case 'creative': return { icon: Monitor, label: 'Switch to XP Mode' };
      default: return { icon: Monitor, label: 'Switch Mode' };
    }
  };

  const { icon: Icon, label } = getModeContent();

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMode}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border transition-all duration-500 ${getModeStyles()}`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </motion.button>
    </div>
  );
}
