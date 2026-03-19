'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export default function CustomCursor() {
  const { mode } = useTheme();
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      );
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  const getCursorStyles = () => {
    switch (mode) {
      case 'xp':
        return {
          width: isPointer ? 24 : 16,
          height: isPointer ? 24 : 16,
          backgroundColor: 'white',
          border: '2px solid black',
          borderRadius: 0,
          mixBlendMode: 'normal',
        };
      case 'dev':
        return {
          width: isPointer ? 32 : 4,
          height: isPointer ? 32 : 24,
          backgroundColor: '#4ade80', // green-400
          borderRadius: isPointer ? '50%' : 0,
          mixBlendMode: isPointer ? 'difference' : 'normal',
          boxShadow: '0 0 10px #4ade80',
        };
      case 'creative':
        return {
          width: isPointer ? 64 : 12,
          height: isPointer ? 64 : 12,
          backgroundColor: 'white',
          borderRadius: '50%',
          mixBlendMode: 'difference',
          filter: isPointer ? 'blur(4px)' : 'none',
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] hidden md:block"
      style={{
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div
        animate={getCursorStyles()}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />
      
      {/* Trailing effect for Creative Mode */}
      {mode === 'creative' && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-full border border-white/20"
          animate={{
            scale: isPointer ? 1.5 : 2,
            opacity: isPointer ? 0.5 : 0.2,
          }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </motion.div>
  );
}
