'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, Music, Heart, Share2,
  Info, Sparkles, Github, Linkedin, Twitter
} from 'lucide-react';
import { portfolioData } from '../lib/data';
import { useTheme } from '../context/ThemeContext';

export default function CreativeMode() {
  const { profile } = useTheme();
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const projects = profile.projects || portfolioData.projects;
  const currentProject = projects[currentProjectIndex];

  const handleNext = useCallback(() => {
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
    setProgress(0);
  }, [projects.length]);

  const handlePrev = useCallback(() => {
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setProgress(0);
  }, [projects.length]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0502] text-white overflow-hidden font-sans selection:bg-orange-500/30">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #ff4e00 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #3a1510 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col h-screen p-6 md:p-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{portfolioData.name}</h1>
              <p className="text-xs text-orange-500/80 font-medium uppercase tracking-widest">Portfolio 2026</p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            {['Projects', 'Experience', 'Skills', 'Contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ color: '#fff', y: -2 }}
                className="transition-colors"
              >
                {item}
              </motion.button>
            ))}
          </nav>
        </header>

        {/* Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Immersive Project Display */}
          <div className="relative aspect-square max-w-lg mx-auto lg:mx-0 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProjectIndex}
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
              >
                <Image 
                  src={`https://picsum.photos/seed/${currentProject.title}/800/800`} 
                  alt={currentProject.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-4xl font-bold mb-2">{currentProject.title}</h2>
                    <div className="flex gap-2 mb-4">
                      {currentProject.tech.map((t) => (
                        <span key={t} className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-orange-500/30 rounded-tr-3xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-orange-500/30 rounded-bl-3xl" />
          </div>

          {/* Right: "Lyrics" / Bio Section */}
          <div className="flex flex-col h-full justify-center">
            <div className="mb-12">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Artist Statement</span>
              <div className="space-y-6 text-2xl md:text-3xl font-serif text-white/40 leading-relaxed italic">
                <p className="transition-colors duration-500 hover:text-white/90 cursor-default">
                  &quot;{profile.bio}&quot;
                </p>
              </div>
            </div>

            {/* Experience "Tracks" */}
            <div className="space-y-4">
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-4 block">Recent Tracks (Experience)</span>
              {(profile.experience || portfolioData.experience).map((exp, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * i }}
                  className="flex items-center gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-orange-500 transition-colors">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm group-hover:text-orange-500 transition-colors">{exp.role}</h4>
                    <p className="text-xs text-white/40">{exp.company} • {exp.period}</p>
                  </div>
                  <div className="text-[10px] text-white/20 font-mono">0{i + 3}:42</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Player Controls */}
        <footer className="mt-12">
          <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
            {/* Project Info */}
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg relative">
                <Image 
                  src={`https://picsum.photos/seed/${currentProject.title}/100/100`} 
                  alt="" 
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{currentProject.title}</h3>
                <p className="text-xs text-white/40 truncate">{profile.name}</p>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} className="text-white/40 hover:text-red-500 transition-colors">
                <Heart size={18} />
              </motion.button>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 w-full md:w-1/3">
              <div className="flex items-center gap-6">
                <button onClick={handlePrev} className="text-white/60 hover:text-white transition-colors">
                  <SkipBack size={20} fill="currentColor" />
                </button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl shadow-white/10"
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                </motion.button>
                <button onClick={handleNext} className="text-white/60 hover:text-white transition-colors">
                  <SkipForward size={20} fill="currentColor" />
                </button>
              </div>
              
              <div className="w-full flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/40">0:{Math.floor(progress / 3).toString().padStart(2, '0')}</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-white/40">0:33</span>
              </div>
            </div>

            {/* Extra Controls */}
            <div className="hidden md:flex items-center justify-end gap-6 w-1/3 text-white/40">
              <button className="hover:text-white transition-colors"><Volume2 size={18} /></button>
              <button className="hover:text-white transition-colors"><Music size={18} /></button>
              <button className="hover:text-white transition-colors"><Share2 size={18} /></button>
              <div className="flex gap-3 ml-4 border-l border-white/10 pl-6">
                <a href={profile.socials?.github || portfolioData.socials.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github size={18} /></a>
                <a href={profile.socials?.linkedin || portfolioData.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
                <a href={profile.socials?.twitter || portfolioData.socials.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Twitter size={18} /></a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Info Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white z-50"
      >
        <Info size={20} />
      </motion.button>
    </div>
  );
}
