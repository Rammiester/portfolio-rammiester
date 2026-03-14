'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, Book, Code2, GitPullRequest, 
  Play, Star, GitFork, Eye,
  FileCode, FileJson, FileText, ChevronRight,
  Terminal, Search, Bell, Plus, User,
  ExternalLink, Mail, MapPin, Link as LinkIcon,
  Menu, Moon, Sun
} from 'lucide-react';
import { portfolioData } from '../lib/data';
import { useTheme } from '../context/ThemeContext';

const SidebarItem = ({ icon: Icon, label, isActive, onClick, theme, color = "text-gray-400" }) => (
  <motion.button 
    whileHover={{ x: 4, backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors relative ${
      isActive 
        ? (theme === 'light' ? 'text-black font-semibold' : 'text-white') 
        : (theme === 'light' ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-gray-200')
    }`}
  >
    {isActive && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.05)' : '#1f2937' }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <ChevronRight size={14} className={isActive ? 'rotate-90' : ''} />
    <Icon size={16} className={color} />
    <span className="truncate">{label}</span>
  </motion.button>
);

export default function DevMode() {
  const { isDarkMode, setIsDarkMode, toggleDarkMode, profile } = useTheme();
  const [activeTab, setActiveTab] = useState('readme');
  const [theme, setTheme] = useState(isDarkMode ? 'dark' : 'light'); // dark, dim, light
  const [accentColor, setAccentColor] = useState('#f78166');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);

  useEffect(() => {
    if (isDarkMode && theme === 'light') {
      setTheme('dark');
    } else if (!isDarkMode && theme !== 'light') {
      setTheme('light');
    }
  }, [isDarkMode, theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'light') {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const initialLines = [
      { type: 'input', text: 'npm start' },
      { type: 'output', text: '> portfolio@1.0.0 start' },
      { type: 'output', text: '> next dev' },
      { type: 'output', text: 'ready - started server on 0.0.0.0:3000, url: http://localhost:3000' }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < initialLines.length) {
        setTerminalHistory(prev => [...prev, initialLines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const newHistory = [...terminalHistory, { type: 'input', text: terminalInput }];
    const cmd = terminalInput.trim().toLowerCase();
    
    if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (cmd === 'ls') {
      newHistory.push({ type: 'output', text: 'README.md  projects.sh  resume.json  contact.api' });
    } else if (cmd === 'help') {
      newHistory.push({ type: 'output', text: 'Available commands: ls, clear, help, whoami, date, switch [xp|creative], theme [dark|dim|light], projects, experience, skills, resume, contact, achievements' });
    } else if (cmd === 'whoami') {
      newHistory.push({ type: 'output', text: profile.name });
    } else if (cmd === 'date') {
      newHistory.push({ type: 'output', text: new Date().toString() });
    } else if (cmd === 'projects') {
      const projectsText = (profile.projects || portfolioData.projects).map(p => `- ${p.title}: ${p.description} [${p.tech.join(', ')}]`).join('\n');
      newHistory.push({ type: 'output', text: projectsText });
    } else if (cmd === 'experience') {
      const expText = (profile.experience || portfolioData.experience).map(e => `- ${e.role} @ ${e.company} (${e.period})\n  ${e.description}`).join('\n\n');
      newHistory.push({ type: 'output', text: expText });
    } else if (cmd === 'skills') {
      newHistory.push({ type: 'output', text: (profile.skills || portfolioData.skills).join(', ') });
    } else if (cmd === 'resume') {
      newHistory.push({ type: 'output', text: 'Downloading resume.pdf...' });
      window.open('/resume.pdf', '_blank');
    } else if (cmd === 'contact') {
      newHistory.push({ type: 'output', text: `Email: ${profile.email || portfolioData.email}\nLinkedIn: ${profile.socials?.linkedin || portfolioData.socials.linkedin}\nGitHub: ${profile.socials?.github || portfolioData.socials.github}` });
    } else if (cmd === 'achievements') {
      const achText = (profile.achievements || portfolioData.achievements).map(a => `🏆 ${a}`).join('\n');
      newHistory.push({ type: 'output', text: achText });
    } else if (cmd.startsWith('switch ')) {
      const target = cmd.split(' ')[1];
      if (['xp', 'creative'].includes(target)) {
        newHistory.push({ type: 'output', text: `Switching to ${target} mode...` });
        setTimeout(() => {
          // We need to access toggleMode or setMode from context
          // Since we only have toggleMode in context, we'll just use that or update context
          window.dispatchEvent(new CustomEvent('switch-mode', { detail: target }));
        }, 1000);
      } else {
        newHistory.push({ type: 'output', text: 'Usage: switch [xp|creative]' });
      }
    } else if (cmd.startsWith('theme ')) {
      const target = cmd.split(' ')[1];
      if (['dark', 'dim', 'light'].includes(target)) {
        handleThemeChange(target);
        newHistory.push({ type: 'output', text: `Theme changed to ${target}` });
      } else {
        newHistory.push({ type: 'output', text: 'Usage: theme [dark|dim|light]' });
      }
    } else {
      newHistory.push({ type: 'output', text: `command not found: ${cmd}` });
    }
    
    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const getThemeColors = () => {
    switch(theme) {
      case 'dim': return { bg: '#22272e', header: '#2d333b', border: '#444c56', text: '#adbac7' };
      case 'light': return { bg: '#ffffff', header: '#f6f8fa', border: '#d0d7de', text: '#24292f' };
      default: return { bg: '#0d1117', header: '#161b22', border: '#30363d', text: '#c9d1d9' };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div 
      key={`${theme}-${accentColor}`}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen font-sans overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* GitHub Header */}
      <header 
        className="h-16 border-b flex items-center justify-between px-4 shrink-0 transition-colors duration-300"
        style={{ backgroundColor: colors.header, borderColor: colors.border }}
      >
        <div className="flex items-center gap-4">
          <Github size={32} className={theme === 'light' ? 'text-black' : 'text-white'} />
          <div className="flex items-center bg-opacity-50 border rounded-md px-3 py-1 w-64" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
            <Search size={16} className="text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search or jump to..." 
              className="bg-transparent outline-none text-sm w-full"
            />
            <span className="border rounded px-1 text-[10px] text-gray-500" style={{ borderColor: colors.border }}>/</span>
          </div>
          <nav className={`hidden md:flex items-center gap-4 text-sm font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            <a href="#" className={theme === 'light' ? 'hover:text-black' : 'hover:text-white'}>Pull requests</a>
            <a href="#" className={theme === 'light' ? 'hover:text-black' : 'hover:text-white'}>Issues</a>
            <a href="#" className={theme === 'light' ? 'hover:text-black' : 'hover:text-white'}>Marketplace</a>
            <a href="#" className={theme === 'light' ? 'hover:text-black' : 'hover:text-white'}>Explore</a>
          </nav>
        </div>
        <div className={`flex items-center gap-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          <Bell size={18} className={theme === 'light' ? 'hover:text-black cursor-pointer' : 'hover:text-white cursor-pointer'} />
          <Plus size={18} className={theme === 'light' ? 'hover:text-black cursor-pointer' : 'hover:text-white cursor-pointer'} />
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full" />
        </div>
      </header>

      {/* Repo Header */}
      <div 
        className="border-b pt-4 px-8 shrink-0 transition-colors duration-300"
        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 text-xl"
        >
          <Book size={20} className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'} />
          <span className="text-[#58a6ff] hover:underline cursor-pointer">ramit-gupta</span>
          <span className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>/</span>
          <span className="font-bold hover:underline cursor-pointer">portfolio-v2</span>
          <span className={`text-xs border rounded-full px-2 py-0.5 ml-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} style={{ borderColor: colors.border }}>Public</span>
        </motion.div>
        
        <div className="flex items-center gap-6 mt-4 text-sm relative">
          {[
            { id: 'readme', label: 'Code', icon: Code2 },
            { id: 'pull-requests', label: 'Pull requests', icon: GitPullRequest, count: 1 },
            { id: 'settings', label: 'Settings', icon: Bell },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 transition-colors relative ${activeTab === tab.id ? (theme === 'light' ? 'text-black font-bold' : 'text-white') : (theme === 'light' ? 'text-gray-600 hover:text-black' : 'text-gray-400 hover:text-white')}`}
            >
              <tab.icon size={18} /> 
              {tab.label} 
              {tab.count && <span className="bg-opacity-20 rounded-full px-1.5 text-xs" style={{ backgroundColor: colors.text }}>{tab.count}</span>}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: accentColor }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className="w-64 border-r hidden lg:block overflow-y-auto transition-colors duration-300"
          style={{ backgroundColor: colors.bg, borderColor: colors.border }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-gray-500">Explorer</span>
            </div>
            <div className="space-y-0.5">
              <SidebarItem 
                icon={FileText} 
                label="README.md" 
                isActive={activeTab === 'readme'} 
                onClick={() => setActiveTab('readme')}
                theme={theme}
                color="text-blue-400"
              />
              <SidebarItem 
                icon={Terminal} 
                label="projects.sh" 
                isActive={activeTab === 'projects'} 
                onClick={() => setActiveTab('projects')}
                theme={theme}
                color="text-green-400"
              />
              <SidebarItem 
                icon={FileJson} 
                label="resume.json" 
                isActive={activeTab === 'resume'} 
                onClick={() => setActiveTab('resume')}
                theme={theme}
                color="text-yellow-400"
              />
              <SidebarItem 
                icon={FileCode} 
                label="contact.api" 
                isActive={activeTab === 'pull-requests'} 
                onClick={() => setActiveTab('pull-requests')}
                theme={theme}
                color="text-purple-400"
              />
              <SidebarItem 
                icon={Bell} 
                label="settings.yaml" 
                isActive={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
                theme={theme}
                color="text-orange-400"
              />
            </div>
          </div>

          <div className="p-4 border-t" style={{ borderColor: colors.border }}>
            <h3 className="text-sm font-bold mb-3">About</h3>
            <p className={`text-sm mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{profile.bio}</p>
            <div className="space-y-2 text-sm">
              {[
                { icon: LinkIcon, text: "ramit.dev", href: "#", color: "text-[#58a6ff]" },
                { icon: Star, text: "128 stars" },
                { icon: GitFork, text: "42 forks" },
                { icon: Eye, text: "12 watching" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center gap-2"
                >
                  <item.icon size={14} /> 
                  {item.href ? (
                    <a href={item.href} className={`${item.color} hover:underline`}>{item.text}</a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'readme' && (
                <motion.div 
                  key="readme"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border rounded-md transition-colors duration-300" 
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <div className="border-b px-4 py-2 flex items-center justify-between" style={{ backgroundColor: colors.header, borderColor: colors.border }}>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Menu size={16} /> README.md
                    </div>
                  </div>
                  <div className={`p-8 max-w-none ${theme === 'light' ? 'prose' : 'prose prose-invert'}`} style={{ color: colors.text }}>
                    <h1 className="text-3xl font-bold border-b pb-2 mb-4" style={{ borderColor: colors.border }}>Hi, I&apos;m {profile.name} 👋</h1>
                    <p className={`text-lg mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{profile.title}</p>
                    
                    <h2 className="text-xl font-bold border-b pb-1 mb-4" style={{ borderColor: colors.border }}>Experience</h2>
                    <div className="space-y-6">
                      {(profile.experience || portfolioData.experience).map((exp, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="relative pl-6 border-l-2" 
                          style={{ borderColor: colors.border }}
                        >
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2" style={{ backgroundColor: colors.header, borderColor: colors.border }} />
                          <h3 className="font-bold" style={{ color: colors.text }}>{exp.role} @ {exp.company}</h3>
                          <p className="text-sm text-gray-500 mb-2">{exp.period}</p>
                          <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>{exp.description}</p>
                        </motion.div>
                      ))}
                    </div>

                    <h2 className="text-xl font-bold border-b pb-1 mt-8 mb-4" style={{ borderColor: colors.border }}>Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, i) => (
                        <motion.span 
                          key={`${skill}-${i}`} 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border px-3 py-1 rounded-full text-sm" 
                          style={{ backgroundColor: colors.header, borderColor: colors.border }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div 
                  key="projects"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-md border overflow-hidden font-mono transition-colors duration-300"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <div className="px-4 py-2 flex items-center gap-2 border-b transition-colors duration-300" style={{ backgroundColor: colors.header, borderColor: colors.border }}>
                    <Terminal size={16} /> <span>bash — projects.sh</span>
                  </div>
                  <div className="p-4 h-[500px] overflow-y-auto text-sm">
                    <AnimatePresence initial={false}>
                      {terminalHistory.map((line, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mb-1"
                        >
                          {line.type === 'input' ? (
                            <div className="flex gap-2">
                              <span className="text-green-400">➜</span>
                              <span className="text-blue-400">~/portfolio</span>
                              <span className={theme === 'light' ? 'text-gray-800' : 'text-gray-300'}>{line.text}</span>
                            </div>
                          ) : (
                            <div className={`whitespace-pre-wrap ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{line.text}</div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(profile.projects || portfolioData.projects).map((project, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ y: -5 }}
                          className="border p-4 rounded hover:bg-opacity-50 transition-colors group"
                          style={{ borderColor: colors.border, backgroundColor: colors.header }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-[#58a6ff] font-bold group-hover:underline">{project.title}</h3>
                            <ExternalLink size={14} className="text-gray-500" />
                          </div>
                          <p className={`text-xs mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{project.description}</p>
                          <div className="flex gap-2">
                            {project.tech.map((t, j) => (
                              <span key={`${t}-${j}`} className="text-[10px] text-gray-500 border px-1.5 rounded" style={{ borderColor: colors.border }}>{t}</span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <form onSubmit={handleTerminalSubmit} className="mt-4 flex gap-2 items-center">
                      <span className="text-green-400">➜</span>
                      <span className="text-blue-400">~/portfolio</span>
                      <div className="flex-1 flex items-center">
                        <input 
                          type="text" 
                          autoFocus
                          className={`bg-transparent outline-none w-full ${theme === 'light' ? 'text-gray-800' : 'text-gray-300'}`}
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                        />
                        <motion.div 
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-2 h-5 bg-gray-400 ml-[-100%] pointer-events-none"
                          style={{ display: terminalInput ? 'none' : 'block' }}
                        />
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'resume' && (
                <motion.div 
                  key="resume"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border rounded-md p-8 font-mono transition-colors duration-300"
                  style={{ backgroundColor: colors.header, borderColor: colors.border }}
                >
                  <pre className={`text-sm overflow-x-auto ${theme === 'light' ? 'text-blue-600' : 'text-yellow-200'}`}>
                    {JSON.stringify(profile, null, 2)}
                  </pre>
                </motion.div>
              )}

              {activeTab === 'pull-requests' && (
                <motion.div 
                  key="pull-requests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="border rounded-md transition-colors duration-300"
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <div className="p-6 border-b" style={{ borderColor: colors.border }}>
                    <h2 className="text-2xl font-bold mb-2">Open a Pull Request</h2>
                    <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Want to collaborate? Send me a message.</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Name</label>
                        <input type="text" className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#58a6ff] transition-colors duration-300" style={{ backgroundColor: colors.bg, borderColor: colors.border }} placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Email</label>
                        <input type="email" className="w-full border rounded-md px-3 py-2 outline-none focus:border-[#58a6ff] transition-colors duration-300" style={{ backgroundColor: colors.bg, borderColor: colors.border }} placeholder="your@email.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Message</label>
                      <textarea className="w-full h-32 border rounded-md px-3 py-2 outline-none focus:border-[#58a6ff] resize-none transition-colors duration-300" style={{ backgroundColor: colors.bg, borderColor: colors.border }} placeholder="What's on your mind?" />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-2 px-4 rounded-md transition-colors"
                    >
                      Submit Pull Request
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {activeTab === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, rotateX: -10 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  exit={{ opacity: 0, rotateX: 10 }}
                  className="border rounded-md p-8" 
                  style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                >
                  <h2 className="text-2xl font-bold mb-6">GitHub Settings</h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-center justify-between p-4 bg-opacity-10 rounded-lg" style={{ backgroundColor: colors.text }}>
                      <div>
                        <h3 className="font-bold">Dark Mode</h3>
                        <p className="text-sm text-gray-500">Enable dark theme across the application</p>
                      </div>
                      <button 
                        onClick={toggleDarkMode}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-green-500' : 'bg-gray-400'}`}
                      >
                        <motion.div 
                          animate={{ x: isDarkMode ? 24 : 0 }}
                          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" 
                        />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold mb-4 uppercase text-gray-500">Theme Preferences</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: 'dark', label: 'Dark Default', bg: '#0d1117' },
                          { id: 'dim', label: 'Dark Dimmed', bg: '#22272e' },
                          { id: 'light', label: 'Light Default', bg: '#ffffff' }
                        ].map(t => (
                          <motion.button 
                            key={t.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleThemeChange(t.id)}
                            className={`p-4 rounded-md border-2 transition-all ${theme === t.id ? 'border-[#58a6ff]' : 'border-transparent hover:border-gray-500'}`}
                            style={{ backgroundColor: t.bg }}
                          >
                            <div className={`text-xs font-bold ${t.id === 'light' ? 'text-black' : 'text-white'}`}>{t.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold mb-4 uppercase text-gray-500">Accent Color</h3>
                      <div className="flex gap-4">
                        {['#f78166', '#58a6ff', '#3fb950', '#d29922', '#bc8cff'].map(color => (
                          <motion.button 
                            key={color}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setAccentColor(color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${accentColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer 
        className="h-10 border-t flex items-center justify-between px-8 text-xs text-gray-500 shrink-0 transition-colors duration-300"
        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
      >
        <div className="flex gap-4">
          <span>© 2026 {profile.name}</span>
          {['Terms', 'Privacy', 'Security'].map(item => (
            <motion.a 
              key={item}
              href="#" 
              whileHover={{ color: '#58a6ff', x: 2 }}
              className="hover:text-[#58a6ff]"
            >
              {item}
            </motion.a>
          ))}
        </div>
        <div className="flex gap-4">
          {[
            { name: 'GitHub', url: profile.socials?.github || portfolioData.socials.github },
            { name: 'LinkedIn', url: profile.socials?.linkedin || portfolioData.socials.linkedin },
            { name: 'Twitter', url: profile.socials?.twitter || portfolioData.socials.twitter }
          ].map(social => (
            <motion.a 
              key={social.name}
              href={social.url} 
              whileHover={{ color: '#58a6ff', scale: 1.1 }}
              className="hover:text-[#58a6ff]"
            >
              {social.name}
            </motion.a>
          ))}
        </div>
      </footer>
    </motion.div>
  );
}
