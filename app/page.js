'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '../context/ThemeContext';
import ModeSwitcher from '../components/ModeSwitcher';
import { AnimatePresence, motion } from 'motion/react';
import BootSequence from '../components/BootSequence';
import LandingIntro from '../components/LandingIntro';
import RecruiterView from '../components/RecruiterView';

// Use dynamic imports with SSR disabled to prevent hydration mismatches
const XPMode = dynamic(() => import('../components/XPMode'), { ssr: false });
const DevMode = dynamic(() => import('../components/DevMode'), { ssr: false });
const CreativeMode = dynamic(() => import('../components/CreativeMode'), { ssr: false });

export default function Home() {
  const { mode } = useTheme();
  const [appState, setAppState] = useState('booting'); // booting, landing, recruiter, interactive

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
      <AnimatePresence mode="wait">
        {appState === 'booting' && (
          <BootSequence key="boot" onComplete={() => setAppState('landing')} />
        )}

        {appState === 'landing' && (
          <LandingIntro 
            key="landing" 
            onEnter={() => setAppState('interactive')} 
            onRecruiterView={() => setAppState('recruiter')} 
          />
        )}

        {appState === 'recruiter' && (
          <motion.div
            key="recruiter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <RecruiterView onBack={() => setAppState('landing')} />
          </motion.div>
        )}

        {appState === 'interactive' && (
          <motion.div
            key="interactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
