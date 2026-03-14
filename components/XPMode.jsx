'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  X, Minus, Square, 
  Folder, FileText, Recycle, 
  Gamepad2, Mail, Info,
  Search, Menu, Monitor, Music,
  Image as ImageIcon, Settings, HelpCircle, ExternalLink, LogIn, LogOut, ShieldCheck, Download
} from 'lucide-react';
import { portfolioData } from '../lib/data';
import { useTheme } from '../context/ThemeContext';
import Winamp from './Winamp';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const XPWindow = ({ title, icon: Icon, children, onClose, zIndex, onFocus, colorScheme = 'blue' }) => {
  const { isDarkMode } = useTheme();

  const getColors = () => {
    if (isDarkMode) return {
      bg: 'bg-[#2b2b2b]',
      border: 'border-[#1a1a1a]',
      titleBar: 'bg-gradient-to-r from-[#1a1a1a] to-[#333333]',
      menuBar: 'bg-[#333] border-white/10 text-gray-300',
      content: 'bg-[#1a1a1a] border-[#444] text-gray-200'
    };

    switch (colorScheme) {
      case 'olive':
        return {
          bg: 'bg-[#E5E2D1]',
          border: 'border-[#748346]',
          titleBar: 'bg-gradient-to-r from-[#748346] via-[#A3B372] to-[#748346]',
          menuBar: 'bg-[#E5E2D1] border-white/50 text-black',
          content: 'bg-white border-[#748346] text-gray-800'
        };
      case 'silver':
        return {
          bg: 'bg-[#D6D3CE]',
          border: 'border-[#7B7B7B]',
          titleBar: 'bg-gradient-to-r from-[#7B7B7B] via-[#BDBDBD] to-[#7B7B7B]',
          menuBar: 'bg-[#D6D3CE] border-white/50 text-black',
          content: 'bg-white border-[#7B7B7B] text-gray-800'
        };
      default: // blue
        return {
          bg: 'bg-[#ECE9D8]',
          border: 'border-[#0054E3]',
          titleBar: 'bg-gradient-to-r from-[#0054E3] via-[#2788F5] to-[#0054E3]',
          menuBar: 'bg-[#ECE9D8] border-white/50 text-black',
          content: 'bg-white border-gray-400 text-gray-800'
        };
    }
  };

  const colors = getColors();

  return (
    <motion.div
      drag
      dragMomentum={false}
      onMouseDown={onFocus}
      initial={{ scale: 0.5, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.5, opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      style={{ zIndex }}
      className={`absolute top-10 left-10 w-[700px] max-h-[85vh] border-2 rounded-t-lg shadow-2xl overflow-hidden flex flex-col transition-colors duration-500 ${colors.bg} ${colors.border}`}
    >
      {/* Title Bar */}
      <div className={`h-8 flex items-center justify-between px-2 cursor-move select-none transition-colors duration-500 ${colors.titleBar}`}>
        <div className="flex items-center gap-2 text-white font-bold text-sm drop-shadow-md">
          <Icon size={16} />
          <span>{title}</span>
        </div>
        <div className="flex gap-1">
          <button className={`w-5 h-5 border border-white/50 rounded flex items-center justify-center transition-colors ${isDarkMode ? 'bg-[#1a1a1a]' : (colorScheme === 'olive' ? 'bg-[#748346]' : (colorScheme === 'silver' ? 'bg-[#7B7B7B]' : 'bg-[#0054E3]'))}`}>
            <Minus size={12} className="text-white" />
          </button>
          <button className={`w-5 h-5 border border-white/50 rounded flex items-center justify-center transition-colors ${isDarkMode ? 'bg-[#1a1a1a]' : (colorScheme === 'olive' ? 'bg-[#748346]' : (colorScheme === 'silver' ? 'bg-[#7B7B7B]' : 'bg-[#0054E3]'))}`}>
            <Square size={10} className="text-white" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-5 h-5 bg-[#E81123] border border-white/50 rounded flex items-center justify-center hover:bg-[#f1707a] transition-colors"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className={`h-6 border-b flex items-center px-2 gap-4 text-xs ${colors.menuBar}`}>
        {['File', 'Edit', 'View', 'Help'].map(item => (
          <span 
            key={item}
            className={`px-1 cursor-default transition-colors ${isDarkMode ? 'hover:bg-[#444] hover:text-white' : 'hover:bg-[#316AC5] hover:text-white'}`}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Content Area */}
      <div className={`flex-1 m-1 border overflow-auto p-4 text-sm ${colors.content}`}>
        {children}
      </div>
    </motion.div>
  );
};

const DesktopIcon = ({ icon: Icon, label, onClick, index }) => (
  <motion.button 
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: index * 0.05, type: "spring", stiffness: 260, damping: 20 }}
    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="w-20 flex flex-col items-center gap-1 p-2 rounded group transition-colors"
  >
    <div className="text-blue-100 group-hover:text-white drop-shadow-md">
      <Icon size={40} strokeWidth={1.5} />
    </div>
    <span className="text-white text-xs text-center drop-shadow-md font-medium">
      {label}
    </span>
  </motion.button>
);

const FolderIcon = ({ icon: Icon, label, onClick, isDarkMode }) => (
  <div 
    onClick={onClick}
    className={`w-24 flex flex-col items-center gap-1 p-2 rounded cursor-pointer group transition-colors ${
      isDarkMode ? 'hover:bg-[#444]' : 'hover:bg-blue-100'
    }`}
  >
    <Icon size={48} strokeWidth={1} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
    <span className={`text-xs text-center break-words w-full ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
      {label}
    </span>
  </div>
);

export default function XPMode() {
  const { isDarkMode, toggleDarkMode, profile, setProfile } = useTheme();
  const [xpColorScheme, setXpColorScheme] = useState('blue'); // blue, olive, silver
  const [openWindows, setOpenWindows] = useState({
    about: false,
    systemProps: false,
    secrets: false,
    projects: false,
    resume: false,
    contact: false,
    minesweeper: false,
    display: false,
    winamp: false,
    myMusic: false,
    myPictures: false,
    controlPanel: false,
    help: false,
    musicSettings: false,
    profileEditor: false
  });
  const [musicProfileUrl, setMusicProfileUrl] = useState('https://music.youtube.com/channel/UCJYJLgLIYyjplin7pQ2rbWg?si=ePCM8BiBTHh2lLAg');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'ramitg0@gmail.com' && currentUser.emailVerified) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'musicProfileUrl'), (snapshot) => {
      if (snapshot.exists()) {
        setMusicProfileUrl(snapshot.data().value);
      }
    }, (error) => {
      console.error("Error fetching music profile URL:", error);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSaveMusicUrl = async (newUrl) => {
    const path = 'settings/musicProfileUrl';
    try {
      await setDoc(doc(db, 'settings', 'musicProfileUrl'), {
        value: newUrl,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.uid
      });
      toggleWindow('musicSettings');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleSaveProfile = async (newProfile) => {
    const path = 'profile/main';
    try {
      await setDoc(doc(db, 'profile', 'main'), {
        ...newProfile,
        updatedAt: serverTimestamp()
      });
      toggleWindow('profileEditor');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    try {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const base64Data = event.target.result.split(',')[1];
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: {
                parts: [
                  {
                    inlineData: {
                      data: base64Data,
                      mimeType: "application/pdf"
                    }
                  },
                  {
                    text: "Extract the following details from this resume in JSON format: name, title, email, location, bio, skills (array of strings), experience (array of {company, role, period, description}), projects (array of {title, description, tech (array of strings)}). Return ONLY the JSON object."
                  }
                ]
              },
              config: {
                responseMimeType: "application/json"
              }
            });
            
            if (response.text) {
              const parsedData = JSON.parse(response.text);
              setProfile(prev => ({ ...prev, ...parsedData }));
            }
          } catch (err) {
            console.error("Gemini PDF parsing failed:", err);
          } finally {
            setIsImporting(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          const lines = text.split('\n');
          const newProfile = { ...profile };
          
          if (lines[0]) newProfile.name = lines[0].trim();
          if (lines[1]) newProfile.title = lines[1].trim();
          
          const skillsLine = lines.find(l => l.toLowerCase().includes('skills'));
          if (skillsLine) {
            newProfile.skills = skillsLine.split(':')[1]?.split(',').map(s => s.trim()) || newProfile.skills;
          }

          setProfile(newProfile);
          setIsImporting(false);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Import failed:", error);
      setIsImporting(false);
    }
  };
  const [activeWindow, setActiveWindow] = useState(null);
  const [time, setTime] = useState(null);
  const [wallpaper, setWallpaper] = useState('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop');
  const [msGrid, setMsGrid] = useState(() => 
    Array(81).fill(null).map(() => (Math.random() < 0.15 ? 'M' : null))
  );
  const [isExploding, setIsExploding] = useState(false);
  const [msStatus, setMsStatus] = useState('playing'); // 'playing', 'lost', 'won'
  const [isImporting, setIsImporting] = useState(false);

  const initMinesweeper = () => {
    setIsExploding(false);
    setMsStatus('playing');
    setMsGrid(Array(81).fill(null).map(() => (Math.random() < 0.15 ? 'M' : null)));
  };

  const handleMsClick = (i) => {
    if (isExploding || msStatus !== 'playing') return;
    const newGrid = [...msGrid];
    if (newGrid[i] === 'M') {
      setIsExploding(true);
      setMsStatus('lost');
    } else {
      newGrid[i] = '0';
      setMsGrid(newGrid);
      // Check for win
      const remainingSafe = newGrid.filter((cell, idx) => msGrid[idx] !== 'M' && cell === null).length;
      if (remainingSafe === 0) {
        setMsStatus('won');
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const timeout = setTimeout(() => setTime(new Date()), 0);
    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  const toggleWindow = (id) => {
    setOpenWindows(prev => ({ ...prev, [id]: !prev[id] }));
    if (!openWindows[id]) setActiveWindow(id);
  };

  const focusWindow = (id) => setActiveWindow(id);

  const [startMenuOpen, setStartMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#3A6EA5] select-none" onClick={() => setStartMenuOpen(false)}>
      {/* Bliss Background */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={wallpaper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url("${wallpaper}")` }}
        />
      </AnimatePresence>

      {/* Start Menu */}
      <AnimatePresence>
        {startMenuOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`absolute bottom-8 left-0 w-80 shadow-2xl z-[101] rounded-t-lg border-2 overflow-hidden flex flex-col transition-colors duration-500 ${
              isDarkMode ? 'bg-[#2b2b2b] border-[#1a1a1a]' : 'bg-white border-[#0054E3]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-14 p-2 flex items-center justify-between transition-colors duration-500 ${
              isDarkMode ? 'bg-gradient-to-r from-[#1a1a1a] to-[#333333]' : 'bg-gradient-to-r from-[#0054E3] to-[#2788F5]'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded border-2 border-white/50 overflow-hidden">
                  {user?.photoURL ? (
                    <div className="relative w-full h-full">
                      <Image 
                        src={user.photoURL} 
                        alt="User" 
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold drop-shadow-md leading-tight">{user?.displayName || profile.name}</span>
                  {isAdmin && <span className="text-[10px] text-white/80 flex items-center gap-1"><ShieldCheck size={10} /> Administrator</span>}
                </div>
              </div>
              {!user && (
                <button 
                  onClick={handleLogin}
                  className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full transition-colors"
                  title="Log In"
                >
                  <LogIn size={16} />
                </button>
              )}
            </div>
            <div className={`flex transition-colors duration-500 ${isDarkMode ? 'bg-[#2b2b2b]' : 'bg-white'}`}>
              <div className="flex-1 p-2 space-y-1">
                {[
                  { id: 'about', icon: Monitor, label: "My Computer", color: isDarkMode ? "text-blue-400" : "text-blue-600" },
                  { id: 'projects', icon: Folder, label: "My Projects", color: isDarkMode ? "text-yellow-400" : "text-yellow-500" },
                  { id: 'resume', icon: FileText, label: "Resume.doc", color: isDarkMode ? "text-blue-300" : "text-blue-400" },
                  { id: 'display', icon: Monitor, label: "Display Properties", color: isDarkMode ? "text-green-400" : "text-green-500" },
                ].map((item, i) => (
                  <motion.button 
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                    whileHover={{ backgroundColor: isDarkMode ? '#444' : '#316AC5', color: 'white' }}
                    className="w-full flex items-center gap-3 p-2 rounded group text-sm text-left" 
                    onClick={() => { toggleWindow(item.id); setStartMenuOpen(false); }}
                  >
                    <item.icon size={24} className={`${item.color} group-hover:text-white`} />
                    <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{item.label}</span>
                  </motion.button>
                ))}
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`w-32 border-l p-2 space-y-2 text-xs transition-colors duration-500 ${
                  isDarkMode ? 'bg-[#1a1a1a] border-[#333] text-gray-400' : 'bg-[#D3E5FA] border-[#91B0E8] text-[#00156E]'
                }`}
              >
                <div className={`font-bold mb-1 ${isDarkMode ? 'text-gray-300' : ''}`}>My Documents</div>
                <div className="hover:underline cursor-pointer" onClick={() => { toggleWindow('myPictures'); setStartMenuOpen(false); }}>My Pictures</div>
                <div className="hover:underline cursor-pointer" onClick={() => { toggleWindow('myMusic'); setStartMenuOpen(false); }}>My Music</div>
                <div className={`border-t my-2 ${isDarkMode ? 'border-[#333]' : 'border-[#91B0E8]'}`} />
                <div className={`font-bold mb-1 ${isDarkMode ? 'text-gray-300' : ''}`}>System</div>
                <div className="hover:underline cursor-pointer" onClick={() => { toggleWindow('controlPanel'); setStartMenuOpen(false); }}>Control Panel</div>
                <div className="hover:underline cursor-pointer" onClick={() => { toggleWindow('help'); setStartMenuOpen(false); }}>Help and Support</div>
              </motion.div>
            </div>
            <div className={`h-10 p-2 flex justify-end items-center gap-4 transition-colors duration-500 ${
              isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gradient-to-r from-[#0054E3] to-[#2788F5]'
            }`}>
               {user ? (
                 <button 
                   onClick={handleLogout}
                   className="flex items-center gap-1 text-white text-xs hover:underline"
                 >
                   <div className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center text-[10px]"><LogOut size={10} /></div>
                   Log Off
                 </button>
               ) : (
                 <button 
                   onClick={handleLogin}
                   className="flex items-center gap-1 text-white text-xs hover:underline"
                 >
                   <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-[10px]"><LogIn size={10} /></div>
                   Log In
                 </button>
               )}
               <button className="flex items-center gap-1 text-white text-xs hover:underline">
                 <div className="w-4 h-4 bg-red-600 rounded flex items-center justify-center text-[10px]">T</div>
                 Turn Off
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Icons */}
      <div className="absolute inset-0 z-10 p-4 flex flex-col flex-wrap gap-4 content-start">
        {[
          { id: 'about', icon: Monitor, label: "My Computer" },
          { id: 'projects', icon: Folder, label: "My Projects" },
          { id: 'resume', icon: FileText, label: "Resume.doc" },
          { id: 'recycle', icon: Recycle, label: "Recycle Bin" },
          { id: 'minesweeper', icon: Gamepad2, label: "Minesweeper" },
          { id: 'winamp', icon: Music, label: "Winamp" },
          { id: 'display', icon: Monitor, label: "Display" },
          { id: 'contact', icon: Mail, label: "Contact Me" }
        ].map((icon, i) => (
          <DesktopIcon 
            key={icon.id} 
            icon={icon.icon} 
            label={icon.label} 
            index={i}
            onClick={() => icon.id !== 'recycle' && toggleWindow(icon.id)} 
          />
        ))}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {openWindows.about && (
          <XPWindow 
            key="about"
            title="My Computer" 
            icon={Monitor} 
            onClose={() => toggleWindow('about')}
            zIndex={activeWindow === 'about' ? 50 : 40}
            onFocus={() => focusWindow('about')}
            colorScheme={xpColorScheme}
          >
            <div className="flex flex-wrap gap-4 p-4">
              <FolderIcon icon={Folder} label="Projects" onClick={() => toggleWindow('projects')} isDarkMode={isDarkMode} />
              <FolderIcon icon={FileText} label="Resume.doc" onClick={() => toggleWindow('resume')} isDarkMode={isDarkMode} />
              <FolderIcon icon={Monitor} label="System Properties" onClick={() => toggleWindow('systemProps')} isDarkMode={isDarkMode} />
              {/* Hidden Secrets folder */}
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                <FolderIcon icon={Folder} label="Secrets" onClick={() => toggleWindow('secrets')} isDarkMode={isDarkMode} />
              </div>
            </div>
          </XPWindow>
        )}

        {openWindows.systemProps && (
          <XPWindow 
            key="systemProps"
            title="System Properties" 
            icon={Monitor} 
            onClose={() => toggleWindow('systemProps')}
            zIndex={activeWindow === 'systemProps' ? 50 : 40}
            onFocus={() => focusWindow('systemProps')}
            colorScheme={xpColorScheme}
          >
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <h2 className={`text-2xl font-bold border-b pb-2 ${isDarkMode ? 'text-blue-400 border-[#444]' : 'text-blue-800 border-gray-200'}`}>System Information</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className={`col-span-1 flex flex-col items-center justify-center p-4 border rounded ${isDarkMode ? 'bg-[#222] border-[#444]' : 'bg-gray-100 border-gray-200'}`}>
                  <Monitor size={64} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div className="col-span-2 space-y-2">
                  <p><strong>User:</strong> {profile.name}</p>
                  <p><strong>Role:</strong> {profile.title}</p>
                  <p><strong>Location:</strong> {profile.location}</p>
                  <p className={`mt-4 italic ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>&quot;{profile.bio}&quot;</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>Installed Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={`${skill}-${i}`} className={`px-2 py-1 rounded border text-xs ${isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-800' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                      {skill}.dll
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </XPWindow>
        )}

        {openWindows.secrets && (
          <XPWindow 
            key="secrets"
            title="C:\Secrets" 
            icon={Folder} 
            onClose={() => toggleWindow('secrets')}
            zIndex={activeWindow === 'secrets' ? 50 : 40}
            onFocus={() => focusWindow('secrets')}
            colorScheme={xpColorScheme}
          >
            <div className={`p-6 text-center space-y-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <h2 className="text-xl font-bold">You found the secret folder!</h2>
              <p>There are 10 types of people in this world: those who understand binary, and those who don&apos;t.</p>
              <p className="text-sm italic opacity-70">More secrets coming soon...</p>
            </div>
          </XPWindow>
        )}

        {openWindows.projects && (
          <XPWindow 
            key="projects"
            title="C:\Documents and Settings\Projects" 
            icon={Folder} 
            onClose={() => toggleWindow('projects')}
            zIndex={activeWindow === 'projects' ? 50 : 40}
            onFocus={() => focusWindow('projects')}
            colorScheme={xpColorScheme}
          >
            <div className="grid grid-cols-2 gap-4">
              {(profile.projects || portfolioData.projects).map((project, i) => (
                <div 
                  key={i} 
                  className={`border p-3 cursor-pointer group transition-colors ${isDarkMode ? 'bg-[#333] border-[#444] hover:bg-[#444]' : 'bg-white border-gray-200 hover:bg-blue-50'}`}
                  onClick={() => toggleWindow('projects')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Folder size={24} className={isDarkMode ? "text-yellow-400 fill-yellow-900" : "text-yellow-500 fill-yellow-200"} />
                    <h3 className={`font-bold group-hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{project.title}</h3>
                  </div>
                  <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((t, j) => (
                      <span key={`${t}-${j}`} className={`text-[10px] px-1 rounded ${isDarkMode ? 'bg-[#444] text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </XPWindow>
        )}

        {openWindows.resume && (
          <XPWindow 
            key="resume"
            title="Resume.doc - WordPad" 
            icon={FileText} 
            onClose={() => toggleWindow('resume')}
            zIndex={activeWindow === 'resume' ? 50 : 40}
            onFocus={() => focusWindow('resume')}
            colorScheme={xpColorScheme}
          >
            <div className={`font-serif max-w-2xl mx-auto transition-colors duration-500 ${isDarkMode ? 'text-gray-200' : 'text-black'}`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex-1"></div>
                <div className="flex-1 text-center">
                  <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{profile.title} | {profile.email || portfolioData.email}</p>
                </div>
                <div className="flex-1 flex justify-end">
                  <a 
                    href="/resume.pdf" 
                    download
                    className={`flex items-center gap-1 px-3 py-1 text-xs border rounded transition-colors ${
                      isDarkMode 
                        ? 'bg-[#333] border-[#555] text-gray-200 hover:bg-[#444]' 
                        : 'bg-gray-100 border-gray-300 text-black hover:bg-gray-200'
                    }`}
                  >
                    <Download size={12} /> Download PDF
                  </a>
                </div>
              </div>
              
              <h2 className={`text-lg font-bold border-b-2 mb-2 ${isDarkMode ? 'border-gray-600' : 'border-black'}`}>EXPERIENCE</h2>
              {(profile.experience || portfolioData.experience).map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between font-bold">
                    <span>{exp.role} @ {exp.company}</span>
                    <span>{exp.period}</span>
                  </div>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{exp.description}</p>
                </div>
              ))}
            </div>
          </XPWindow>
        )}

        {openWindows.contact && (
          <XPWindow 
            key="contact"
            title="Outlook Express - New Message" 
            icon={Mail} 
            onClose={() => toggleWindow('contact')}
            zIndex={activeWindow === 'contact' ? 50 : 40}
            onFocus={() => focusWindow('contact')}
            colorScheme={xpColorScheme}
          >
            <div className={`space-y-3 transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
              <div className={`flex items-center gap-2 border-b pb-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className="text-gray-500 w-12">To:</span>
                <span className="font-medium">{profile.email || portfolioData.email}</span>
              </div>
              <div className={`flex items-center gap-2 border-b pb-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className="text-gray-500 w-12">Cc:</span>
                <input type="text" className="flex-1 outline-none bg-transparent" />
              </div>
              <div className={`flex items-center gap-2 border-b pb-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className="text-gray-500 w-12">Subject:</span>
                <input id="contact-subject" type="text" className="flex-1 outline-none font-bold bg-transparent" defaultValue="Hello from Portfolio!" />
              </div>
              <textarea 
                id="contact-body"
                className="w-full h-48 mt-2 outline-none resize-none bg-transparent"
                placeholder="Type your message here..."
              />
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    const subject = document.getElementById('contact-subject')?.value || 'Hello from Portfolio!';
                    const body = document.getElementById('contact-body')?.value || '';
                    window.location.href = `mailto:${profile.email || portfolioData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                  className={`border-2 px-6 py-1 transition-colors ${
                  isDarkMode 
                    ? 'bg-[#333] border-[#444] text-gray-200 hover:bg-[#444] active:border-gray-500' 
                    : 'bg-gray-100 border-gray-400 text-black hover:bg-gray-200 active:border-gray-600'
                }`}>
                  Send
                </button>
              </div>
            </div>
          </XPWindow>
        )}

        {openWindows.minesweeper && (
          <XPWindow 
            key="minesweeper"
            title="Minesweeper" 
            icon={Gamepad2} 
            onClose={() => toggleWindow('minesweeper')}
            zIndex={activeWindow === 'minesweeper' ? 50 : 40}
            onFocus={() => focusWindow('minesweeper')}
            colorScheme={xpColorScheme}
          >
            <div className={`flex flex-col items-center justify-center h-full p-4 border-4 transition-colors duration-500 ${
              isDarkMode 
                ? 'bg-[#2b2b2b] border-t-gray-600 border-l-gray-600 border-r-[#1a1a1a] border-b-[#1a1a1a]' 
                : 'bg-[#BDBDBD] border-t-white border-l-white border-r-[#7B7B7B] border-b-[#7B7B7B]'
            }`}>
               <div className={`border-4 p-2 mb-4 flex justify-between w-full items-center transition-colors duration-500 ${
                 isDarkMode 
                   ? 'bg-[#2b2b2b] border-b-gray-600 border-r-gray-600 border-l-[#1a1a1a] border-t-[#1a1a1a]' 
                   : 'bg-[#BDBDBD] border-b-white border-r-white border-l-[#7B7B7B] border-t-[#7B7B7B]'
               }`}>
                  <div className="bg-black text-red-600 font-mono text-2xl px-2">010</div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={initMinesweeper}
                    className={`w-10 h-10 border-2 flex items-center justify-center text-2xl transition-colors duration-500 ${
                      isDarkMode 
                        ? 'border-t-gray-600 border-l-gray-600 border-r-[#1a1a1a] border-b-[#1a1a1a]' 
                        : 'border-t-white border-l-white border-r-[#7B7B7B] border-b-[#7B7B7B]'
                    }`}
                  >
                    {msStatus === 'lost' ? '😵' : msStatus === 'won' ? '😎' : '😊'}
                  </motion.button>
                  <div className="bg-black text-red-600 font-mono text-2xl px-2">000</div>
               </div>
               <motion.div 
                 animate={isExploding ? { x: [-2, 2, -2, 2, 0], transition: { duration: 0.1, repeat: 5 } } : {}}
                 className={`grid grid-cols-9 gap-0 border-4 transition-colors duration-500 ${
                   isDarkMode 
                     ? 'border-b-gray-600 border-r-gray-600 border-l-[#1a1a1a] border-t-[#1a1a1a]' 
                     : 'border-b-white border-r-white border-l-[#7B7B7B] border-t-[#7B7B7B]'
                 }`}
               >
                  {msGrid.map((cell, i) => (
                    <motion.div 
                      key={i} 
                      onClick={() => handleMsClick(i)}
                      initial={false}
                      animate={cell === '0' ? { backgroundColor: isDarkMode ? '#1a1a1a' : '#BDBDBD', scale: [1, 0.9, 1] } : {}}
                      className={`w-6 h-6 border flex items-center justify-center text-xs font-bold cursor-default transition-colors duration-500 ${
                        isDarkMode ? 'border-[#333]' : 'border-[#7B7B7B]'
                      } ${
                        cell === '0' 
                          ? (isDarkMode ? 'bg-[#1a1a1a] shadow-none' : 'bg-[#BDBDBD] shadow-none') 
                          : (isDarkMode 
                              ? 'bg-[#333] border-t-gray-600 border-l-gray-600 shadow-inner active:shadow-none' 
                              : 'bg-[#BDBDBD] border-t-white border-l-white shadow-inner active:shadow-none')
                      }`}
                    >
                      {cell === '0' ? '' : (isExploding && cell === 'M' ? '💣' : '')}
                    </motion.div>
                  ))}
               </motion.div>
            </div>
          </XPWindow>
        )}

        {openWindows.display && (
          <XPWindow 
            key="display"
            title="Display Properties" 
            icon={Monitor} 
            onClose={() => toggleWindow('display')}
            zIndex={activeWindow === 'display' ? 50 : 40}
            onFocus={() => focusWindow('display')}
            colorScheme={xpColorScheme}
          >
            <div className="space-y-4">
              <div className={`p-2 border flex justify-center transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1a1a] border-[#333]' : 'bg-gray-200 border-gray-400'}`}>
                <div className={`w-32 h-20 border-4 rounded relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'border-gray-800' : 'border-gray-800'}`}>
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${wallpaper}")` }} />
                </div>
              </div>
              
              <div className={`p-2 border rounded flex items-center justify-between transition-colors duration-500 ${isDarkMode ? 'bg-black/20 border-white/20' : 'bg-white/50 border-black/10'}`}>
                <span className="text-xs font-bold">Dark Mode</span>
                <button 
                  onClick={toggleDarkMode}
                  className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-green-600' : 'bg-gray-400'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              {!isDarkMode && (
                <div>
                  <label className="block text-xs font-bold mb-1">Color Scheme:</label>
                  <select 
                    value={xpColorScheme}
                    onChange={(e) => setXpColorScheme(e.target.value)}
                    className="w-full text-xs border border-gray-400 p-1 bg-white outline-none"
                  >
                    <option value="blue">Default (Blue)</option>
                    <option value="olive">Olive Green</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1">Background:</label>
                <div className={`border h-32 overflow-y-auto p-1 space-y-1 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-400'}`}>
                  {[
                    { name: 'Bliss', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop' },
                    { name: 'Autumn', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop' },
                    { name: 'Azul', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop' },
                    { name: 'Red Moon Desert', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop' }
                  ].map(wp => (
                    <div 
                      key={wp.name}
                      onClick={() => setWallpaper(wp.url)}
                      className={`px-2 py-1 text-xs cursor-default transition-colors ${
                        wallpaper === wp.url 
                          ? 'bg-[#316AC5] text-white' 
                          : (isDarkMode ? 'hover:bg-[#333] text-gray-300' : 'hover:bg-gray-100 text-black')
                      }`}
                    >
                      {wp.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </XPWindow>
        )}

        {openWindows.myMusic && (
          <XPWindow 
            key="myMusic"
            title="My Music" 
            icon={Music} 
            onClose={() => toggleWindow('myMusic')}
            zIndex={activeWindow === 'myMusic' ? 50 : 40}
            onFocus={() => focusWindow('myMusic')}
            colorScheme={xpColorScheme}
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-black rounded border border-gray-600 overflow-hidden">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/videoseries?list=PLMC9KNkIncKtPojQhKuB607_6tS5CfVIC" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-gray-500 italic">Now playing from YouTube Playlist</p>
                <a 
                  href={musicProfileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] bg-[#316AC5] text-white px-2 py-0.5 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <ExternalLink size={10} /> Visit My Profile
                </a>
              </div>
            </div>
          </XPWindow>
        )}

        {openWindows.myPictures && (
          <XPWindow 
            key="myPictures"
            title="My Pictures" 
            icon={ImageIcon} 
            onClose={() => toggleWindow('myPictures')}
            zIndex={activeWindow === 'myPictures' ? 50 : 40}
            onFocus={() => focusWindow('myPictures')}
            colorScheme={xpColorScheme}
          >
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
                const imgSrc = (portfolioData.pictures && portfolioData.pictures[i]) 
                  ? portfolioData.pictures[i] 
                  : `https://picsum.photos/seed/xp-${i + 1}/200/200`;
                return (
                  <div key={i} className="aspect-square border p-1 bg-white hover:border-blue-500 cursor-pointer transition-colors relative">
                    <Image 
                      src={imgSrc} 
                      alt={`Picture ${i + 1}`} 
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                );
              })}
            </div>
          </XPWindow>
        )}

        {openWindows.controlPanel && (
          <XPWindow 
            key="controlPanel"
            title="Control Panel" 
            icon={Settings} 
            onClose={() => toggleWindow('controlPanel')}
            zIndex={activeWindow === 'controlPanel' ? 50 : 40}
            onFocus={() => focusWindow('controlPanel')}
            colorScheme={xpColorScheme}
          >
            <div className={`grid grid-cols-2 gap-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <div 
                className={`flex flex-col items-center p-4 border rounded cursor-pointer transition-colors ${isDarkMode ? 'border-[#444] hover:bg-[#333]' : 'border-gray-200 hover:bg-blue-50'}`}
                onClick={() => toggleWindow('display')}
              >
                <Monitor size={32} className={isDarkMode ? 'text-blue-400 mb-2' : 'text-blue-600 mb-2'} />
                <span className="text-sm font-bold">Display</span>
                <span className={`text-[10px] text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Change desktop background and theme</span>
              </div>
              <div 
                className={`flex flex-col items-center p-4 border rounded cursor-pointer transition-colors ${isDarkMode ? 'border-[#444] hover:bg-[#333]' : 'border-gray-200 hover:bg-blue-50'}`}
                onClick={() => toggleWindow('about')}
              >
                <Info size={32} className={isDarkMode ? 'text-blue-400 mb-2' : 'text-blue-600 mb-2'} />
                <span className="text-sm font-bold">User Accounts</span>
                <span className={`text-[10px] text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage users and passwords</span>
              </div>
              {isAdmin && (
                <>
                  <div 
                    className={`flex flex-col items-center p-4 border rounded cursor-pointer transition-colors ${isDarkMode ? 'border-[#444] hover:bg-[#333]' : 'border-gray-200 hover:bg-blue-50'}`}
                    onClick={() => toggleWindow('musicSettings')}
                  >
                    <Music size={32} className={isDarkMode ? 'text-purple-400 mb-2' : 'text-purple-600 mb-2'} />
                    <span className="text-sm font-bold">Music</span>
                    <span className={`text-[10px] text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Set your YouTube Music profile</span>
                  </div>
                  <div 
                    className={`flex flex-col items-center p-4 border rounded cursor-pointer transition-colors ${isDarkMode ? 'border-[#444] hover:bg-[#333]' : 'border-gray-200 hover:bg-blue-50'}`}
                    onClick={() => toggleWindow('profileEditor')}
                  >
                    <FileText size={32} className={isDarkMode ? 'text-green-400 mb-2' : 'text-green-600 mb-2'} />
                    <span className="text-sm font-bold">Resume Editor</span>
                    <span className={`text-[10px] text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Edit your portfolio details</span>
                  </div>
                </>
              )}
              <div 
                className={`flex flex-col items-center p-4 border rounded cursor-pointer transition-colors ${isDarkMode ? 'border-[#444] hover:bg-[#333]' : 'border-gray-200 hover:bg-blue-50'}`}
                onClick={() => toggleWindow('help')}
              >
                <HelpCircle size={32} className={isDarkMode ? 'text-blue-400 mb-2' : 'text-blue-600 mb-2'} />
                <span className="text-sm font-bold">Help</span>
                <span className={`text-[10px] text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get help and support</span>
              </div>
            </div>
          </XPWindow>
        )}

        {openWindows.musicSettings && (
          <XPWindow 
            key="musicSettings"
            title="Music Settings" 
            icon={Music} 
            onClose={() => toggleWindow('musicSettings')}
            zIndex={activeWindow === 'musicSettings' ? 50 : 40}
            onFocus={() => focusWindow('musicSettings')}
            colorScheme={xpColorScheme}
          >
            <div className="space-y-4 p-2">
              <div className="space-y-2">
                <label className="text-xs font-bold">YouTube Music Profile URL</label>
                <input 
                  type="text" 
                  value={musicProfileUrl} 
                  onChange={(e) => setMusicProfileUrl(e.target.value)}
                  className="w-full border p-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://music.youtube.com/channel/..."
                />
                <p className="text-[10px] text-gray-400 italic">Example: https://music.youtube.com/channel/UC...</p>
              </div>
              <button 
                onClick={() => handleSaveMusicUrl(musicProfileUrl)}
                className="w-full bg-[#316AC5] text-white py-2 rounded text-xs font-bold hover:bg-blue-700 active:bg-blue-800"
              >
                Save Settings
              </button>
            </div>
          </XPWindow>
        )}

        {openWindows.profileEditor && (
          <XPWindow 
            key="profileEditor"
            title="Resume & Profile Editor" 
            icon={FileText} 
            onClose={() => toggleWindow('profileEditor')}
            zIndex={activeWindow === 'profileEditor' ? 50 : 40}
            onFocus={() => focusWindow('profileEditor')}
            colorScheme={xpColorScheme}
          >
            <div className={`space-y-4 p-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <div className={`p-3 border rounded mb-4 ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  <ExternalLink size={14} /> Quick Import
                </h4>
                <p className={`text-[10px] mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Upload a PDF or TXT resume to auto-fill your details.</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept=".pdf,.txt" 
                    onChange={handleResumeUpload}
                    className="text-xs"
                    disabled={isImporting}
                  />
                  {isImporting && <span className="text-[10px] text-blue-800 animate-pulse">Processing...</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className={`w-full border p-1 text-sm rounded outline-none ${isDarkMode ? 'bg-[#222] border-[#444] text-white' : 'bg-white border-gray-300 text-black'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold">Job Title</label>
                  <input 
                    type="text" 
                    value={profile.title} 
                    onChange={(e) => setProfile({...profile, title: e.target.value})}
                    className={`w-full border p-1 text-sm rounded outline-none ${isDarkMode ? 'bg-[#222] border-[#444] text-white' : 'bg-white border-gray-300 text-black'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold">Location</label>
                  <input 
                    type="text" 
                    value={profile.location} 
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className={`w-full border p-1 text-sm rounded outline-none ${isDarkMode ? 'bg-[#222] border-[#444] text-white' : 'bg-white border-gray-300 text-black'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold">Email</label>
                  <input 
                    type="text" 
                    value={profile.email || portfolioData.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className={`w-full border p-1 text-sm rounded outline-none ${isDarkMode ? 'bg-[#222] border-[#444] text-white' : 'bg-white border-gray-300 text-black'}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold">Bio</label>
                <textarea 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className={`w-full border p-1 text-sm rounded h-20 outline-none ${isDarkMode ? 'bg-[#222] border-[#444] text-white' : 'bg-white border-gray-300 text-black'}`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold">Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={profile.skills.join(', ')} 
                  onChange={(e) => setProfile({...profile, skills: e.target.value.split(',').map(s => s.trim())})}
                  className={`w-full border p-1 text-sm rounded outline-none ${isDarkMode ? 'bg-[#222] border-[#444] text-white' : 'bg-white border-gray-300 text-black'}`}
                />
              </div>

              {/* Experience Section */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between items-center">
                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>Experience</h4>
                  <button 
                    onClick={() => {
                      const newExp = { company: '', role: '', period: '', description: '' };
                      setProfile({ ...profile, experience: [...(profile.experience || []), newExp] });
                    }}
                    className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    + Add Experience
                  </button>
                </div>
                {(profile.experience || []).map((exp, idx) => (
                  <div key={idx} className={`p-2 border rounded space-y-2 relative group ${isDarkMode ? 'bg-[#222] border-[#444]' : 'bg-gray-50 border-gray-200'}`}>
                    <button 
                      onClick={() => {
                        const newExp = [...profile.experience];
                        newExp.splice(idx, 1);
                        setProfile({ ...profile, experience: newExp });
                      }}
                      className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...profile.experience];
                          newExp[idx].company = e.target.value;
                          setProfile({ ...profile, experience: newExp });
                        }}
                        className={`text-xs border p-1 rounded outline-none ${isDarkMode ? 'bg-[#333] border-[#555] text-white' : 'bg-white border-gray-300 text-black'}`}
                      />
                      <input 
                        placeholder="Role"
                        value={exp.role}
                        onChange={(e) => {
                          const newExp = [...profile.experience];
                          newExp[idx].role = e.target.value;
                          setProfile({ ...profile, experience: newExp });
                        }}
                        className={`text-xs border p-1 rounded outline-none ${isDarkMode ? 'bg-[#333] border-[#555] text-white' : 'bg-white border-gray-300 text-black'}`}
                      />
                    </div>
                    <input 
                      placeholder="Period (e.g. 2022 - Present)"
                      value={exp.period}
                      onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[idx].period = e.target.value;
                        setProfile({ ...profile, experience: newExp });
                      }}
                      className={`text-xs border p-1 rounded w-full outline-none ${isDarkMode ? 'bg-[#333] border-[#555] text-white' : 'bg-white border-gray-300 text-black'}`}
                    />
                    <textarea 
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[idx].description = e.target.value;
                        setProfile({ ...profile, experience: newExp });
                      }}
                      className={`text-xs border p-1 rounded w-full h-16 outline-none ${isDarkMode ? 'bg-[#333] border-[#555] text-white' : 'bg-white border-gray-300 text-black'}`}
                    />
                  </div>
                ))}
              </div>

              {/* Projects Section */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between items-center">
                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>Projects</h4>
                  <button 
                    onClick={() => {
                      const newProj = { title: '', description: '', tech: [], link: '#' };
                      setProfile({ ...profile, projects: [...(profile.projects || []), newProj] });
                    }}
                    className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    + Add Project
                  </button>
                </div>
                {(profile.projects || []).map((proj, idx) => (
                  <div key={idx} className={`p-2 border rounded space-y-2 relative group ${isDarkMode ? 'bg-[#222] border-[#444]' : 'bg-gray-50 border-gray-200'}`}>
                    <button 
                      onClick={() => {
                        const newProj = [...profile.projects];
                        newProj.splice(idx, 1);
                        setProfile({ ...profile, projects: newProj });
                      }}
                      className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    <input 
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const newProj = [...profile.projects];
                        newProj[idx].title = e.target.value;
                        setProfile({ ...profile, projects: newProj });
                      }}
                      className={`text-xs border p-1 rounded w-full font-bold outline-none ${isDarkMode ? 'bg-[#333] border-[#555] text-white' : 'bg-white border-gray-300 text-black'}`}
                    />
                    <textarea 
                      placeholder="Description"
                      value={proj.description}
                      onChange={(e) => {
                        const newProj = [...profile.projects];
                        newProj[idx].description = e.target.value;
                        setProfile({ ...profile, projects: newProj });
                      }}
                      className={`text-xs border p-1 rounded w-full h-12 outline-none ${isDarkMode ? 'bg-[#333] border-[#555] text-white' : 'bg-white border-gray-300 text-black'}`}
                    />
                    <input 
                      placeholder="Tech Stack (comma separated)"
                      value={proj.tech?.join(', ')}
                      onChange={(e) => {
                        const newProj = [...profile.projects];
                        newProj[idx].tech = e.target.value.split(',').map(t => t.trim());
                        setProfile({ ...profile, projects: newProj });
                      }}
                      className={`text-xs border p-1 rounded w-full outline-none ${isDarkMode ? 'bg-[#333] border-[#555] text-white' : 'bg-white border-gray-300 text-black'}`}
                    />
                  </div>
                ))}
              </div>

              <div className={`flex justify-end gap-2 pt-4 sticky bottom-0 pb-2 border-t ${isDarkMode ? 'bg-[#1a1a1a] border-[#444]' : 'bg-white border-gray-200'}`}>
                <button 
                  onClick={() => toggleWindow('profileEditor')}
                  className={`px-4 py-1 border rounded text-xs ${isDarkMode ? 'border-[#555] hover:bg-[#333] text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-black'}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSaveProfile(profile)}
                  className="px-4 py-1 bg-[#316AC5] text-white rounded text-xs font-bold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </XPWindow>
        )}
        {openWindows.help && (
          <XPWindow 
            key="help"
            title="Help and Support Center" 
            icon={HelpCircle} 
            onClose={() => toggleWindow('help')}
            zIndex={activeWindow === 'help' ? 50 : 40}
            onFocus={() => focusWindow('help')}
            colorScheme={xpColorScheme}
          >
            <div className={`space-y-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <h2 className={`text-xl font-bold border-b pb-2 ${isDarkMode ? 'text-blue-400 border-[#444]' : 'text-blue-800 border-gray-200'}`}>Welcome to Help and Support</h2>
              <p className="text-sm">This is a simulated Windows XP environment built with React and Tailwind CSS.</p>
              <div className={`p-4 border rounded ${isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Did you know?</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>You can drag windows around the desktop.</li>
                  <li>The Start Menu is fully functional.</li>
                  <li>You can switch modes using the button in the top right.</li>
                  <li>Winamp actually &quot;plays&quot; your projects!</li>
                </ul>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>For more info, contact {profile.email || portfolioData.email}</p>
            </div>
          </XPWindow>
        )}

        {openWindows.winamp && (
          <Winamp 
            onClose={() => toggleWindow('winamp')} 
            isDarkMode={isDarkMode} 
          />
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <motion.div 
        layout
        className={`absolute bottom-0 left-0 right-0 h-8 z-[100] flex items-center shadow-[0_-2px_10px_rgba(0,0,0,0.3)] transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-[#1a1a1a] via-[#333333] to-[#1a1a1a]' 
          : (xpColorScheme === 'olive' 
              ? 'bg-gradient-to-b from-[#748346] via-[#A3B372] to-[#748346]' 
              : (xpColorScheme === 'silver' 
                  ? 'bg-gradient-to-b from-[#7B7B7B] via-[#BDBDBD] to-[#7B7B7B]' 
                  : 'bg-gradient-to-b from-[#245EDC] via-[#3F8CF3] to-[#245EDC]'))
      }`}>
        {/* Start Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); setStartMenuOpen(!startMenuOpen); }}
          className={`h-full px-4 flex items-center gap-2 rounded-r-xl shadow-lg group transition-all italic font-bold text-white ${
            isDarkMode 
              ? 'bg-gradient-to-b from-[#333] to-[#000] hover:from-[#444] hover:to-[#111]' 
              : (xpColorScheme === 'olive'
                  ? 'bg-gradient-to-b from-[#A3B372] to-[#748346] hover:from-[#B9C989] hover:to-[#859457]'
                  : (xpColorScheme === 'silver'
                      ? 'bg-gradient-to-b from-[#BDBDBD] to-[#7B7B7B] hover:from-[#D6D3CE] hover:to-[#8E8E8E]'
                      : 'bg-gradient-to-b from-[#388238] to-[#245EDC] hover:from-[#4CAF50] hover:to-[#2E7D32]'))
          }`}
        >
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 opacity-80" />
          </div>
          <span className="drop-shadow-md">start</span>
        </button>

        {/* Taskbar Items */}
        <div className="flex-1 flex items-center px-2 gap-1 overflow-hidden h-full">
          <AnimatePresence>
            {Object.entries(openWindows).map(([id, isOpen]) => isOpen && (
              <motion.button 
                key={id}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onClick={() => focusWindow(id)}
                className={`h-7 px-3 flex items-center gap-2 rounded text-xs text-white min-w-[80px] max-w-[150px] truncate transition-colors ${
                  activeWindow === id ? 'bg-[#1E4199] shadow-inner' : 'bg-[#3C81F3] hover:bg-[#5296F6]'
                }`}
              >
                <span className="capitalize">{id}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* System Tray */}
        <div className={`h-full px-4 flex items-center gap-3 border-l shadow-inner ${
          isDarkMode ? 'bg-[#111] border-white/10' : (xpColorScheme === 'olive' ? 'bg-[#A3B372] border-green-800/30' : (xpColorScheme === 'silver' ? 'bg-[#BDBDBD] border-gray-600/30' : 'bg-[#0996F1] border-blue-400/30'))
        }`}>
          <div className="flex gap-1">
             <Monitor size={14} className="text-white/80" />
             <Info size={14} className="text-white/80" />
          </div>
          <span className="text-white text-xs font-medium">
            {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
