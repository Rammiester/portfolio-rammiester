'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, Minus, Play, Pause, 
  SkipBack, SkipForward, Square,
  Volume2, List, Music
} from 'lucide-react';
import { portfolioData } from '../lib/data';

export default function Winamp({ onClose, isDarkMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visualizerData, setVisualizerData] = useState(Array(32).fill(10));

  const tracks = portfolioData.projects.map(p => p.title);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 1));
        setVisualizerData(Array(32).fill(0).map(() => Math.random() * 100));
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
      setVisualizerData(Array(32).fill(10));
    };
  }, [isPlaying]);

  const nextTrack = () => setCurrentTrack((currentTrack + 1) % tracks.length);
  const prevTrack = () => setCurrentTrack((currentTrack - 1 + tracks.length) % tracks.length);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: 400, y: 100, opacity: 0 }}
      animate={{ x: 400, y: 100, opacity: 1 }}
      className={`absolute w-72 shadow-2xl border-2 rounded-sm overflow-hidden flex flex-col font-mono z-[200] ${
        isDarkMode ? 'bg-[#2b2b2b] border-[#1a1a1a]' : 'bg-[#D6D3CE] border-[#7B7B7B]'
      }`}
    >
      {/* Title Bar */}
      <div className={`h-6 flex items-center justify-between px-2 cursor-move select-none ${
        isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#000080]'
      }`}>
        <div className="flex items-center gap-2 text-white text-[10px] font-bold">
          <Music size={10} />
          <span>WINAMP</span>
        </div>
        <button onClick={onClose} className="text-white hover:text-red-500">
          <X size={12} />
        </button>
      </div>

      {/* Main Interface */}
      <div className="p-2 bg-black text-[#00FF00] flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#00FF00]/60">0{currentTrack + 1}/{tracks.length.toString().padStart(2, '0')}</span>
            <div className="text-xs truncate w-40 font-bold tracking-tighter">
              {isPlaying ? 'PLAYING: ' : 'PAUSED: '} {tracks[currentTrack]}
            </div>
          </div>
          <div className="text-xl font-bold tabular-nums">
            00:{Math.floor(progress / 2).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Visualizer Mockup */}
        <div className="h-8 flex items-end gap-[1px] px-1 bg-[#111]">
          {visualizerData.map((height, i) => (
            <motion.div
              key={i}
              animate={{
                height: `${height}%`
              }}
              className="flex-1 bg-[#00FF00]"
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-[#333] relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#00FF00]"
            animate={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-1">
          <div className="flex gap-1">
            <button onClick={prevTrack} className="p-1 hover:bg-white/10 rounded"><SkipBack size={14} /></button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-1 hover:bg-white/10 rounded">
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button onClick={() => setIsPlaying(false)} className="p-1 hover:bg-white/10 rounded"><Square size={14} /></button>
            <button onClick={nextTrack} className="p-1 hover:bg-white/10 rounded"><SkipForward size={14} /></button>
          </div>
          <div className="flex items-center gap-1">
            <Volume2 size={12} />
            <div className="w-12 h-1 bg-[#333]">
              <div className="w-3/4 h-full bg-[#00FF00]" />
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Area */}
      <div className="h-24 bg-[#111] border-t border-[#333] overflow-y-auto p-1 text-[9px]">
        {tracks.map((track, i) => (
          <div 
            key={i}
            onClick={() => setCurrentTrack(i)}
            className={`flex justify-between px-1 py-0.5 cursor-default ${
              currentTrack === i ? 'bg-[#000080] text-white' : 'text-[#00FF00]/80 hover:text-[#00FF00]'
            }`}
          >
            <span className="truncate">{i + 1}. {track}</span>
            <span>3:42</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
