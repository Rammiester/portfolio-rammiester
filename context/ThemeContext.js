'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { portfolioData } from '../lib/data';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('xp'); // 'xp' or 'dev'
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [profile, setProfile] = useState(portfolioData);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'profile', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data());
      }
    }, (error) => {
      console.error("Error fetching profile data:", error);
    });
    return () => unsubscribe();
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      if (prev === 'xp') return 'dev';
      if (prev === 'dev') return 'creative';
      return 'xp';
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeMode = (newMode) => {
    if (['xp', 'dev', 'creative'].includes(newMode)) {
      setMode(newMode);
    }
  };

  useEffect(() => {
    const handleSwitch = (e) => {
      changeMode(e.detail);
    };
    window.addEventListener('switch-mode', handleSwitch);
    return () => window.removeEventListener('switch-mode', handleSwitch);
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      mode, toggleMode, changeMode, 
      isDarkMode, setIsDarkMode, toggleDarkMode,
      profile, setProfile
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
