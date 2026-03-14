'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '../context/ThemeContext';
import ModeSwitcher from '../components/ModeSwitcher';
import { AnimatePresence, motion } from 'motion/react';

// Use dynamic imports with SSR disabled to prevent hydration mismatches
const XPMode = dynamic(() => import('../components/XPMode'), { ssr: false });
const DevMode = dynamic(() => import('../components/DevMode'), { ssr: false });
const CreativeMode = dynamic(() => import('../components/CreativeMode'), { ssr: false });

export default function Home() {
  const { mode } = useTheme();

  const renderMode = () => {
    switch (mode) {
      case 'xp': return <XPMode />;
      case 'dev': return <DevMode />;
      case 'creative': return <CreativeMode />;
      default: return <XPMode />;
    }
  };

  return (
    <main className="relative min-h-screen">
      <ModeSwitcher />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderMode()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
