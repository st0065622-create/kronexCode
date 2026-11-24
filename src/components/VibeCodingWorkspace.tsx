import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Terminal, Play, CheckCircle, RefreshCw, Eye, Code2, 
  GitBranch, Folder, FileCode, MessageSquare, Send, Volume2, 
  VolumeX, Maximize2, Minimize2, X, ChevronRight, Plus, Search, 
  HelpCircle, Activity, Cpu, Sliders, User, Check, Loader2, 
  Lock, Settings, FileText, ChevronDown, Layers, TerminalSquare, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';
import LoginInterface from './LoginInterface';
import Integrations from './Integrations';

// Premium syntax-highlighted code templates
const CODE_FILES = {
  'App.tsx': `import React, { useState } from 'react';
import { Sparkles, Brain } from 'lucide-react';

export default function App() {
  const [active, setActive] = useState(true);

  return (
    <div className="p-8 rounded-3xl bg-black border border-white/10 text-center">
      <Brain className="w-12 h-12 text-[#22D3EE] mx-auto animate-pulse" />
      <h1 className="text-2xl font-display font-black text-white mt-4">
        KRONEX AI Suite
      </h1>
      <p className="text-xs text-zinc-400 mt-2">
        Sub-millisecond cognitive latency online.
      </p>
    </div>
  );
}`,
  'index.css': `@import "tailwindcss";

@theme {
  --font-sans: "Inter", sans-serif;
  --font-display: "Space Grotesk", sans-serif;
}

body {
  background-color: #000000;
  color: #FFFFFF;
}`,
  'server.ts': `import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/api/health', (req, res) => {
  res.json({ status: 'SLA SECURED', uptime: 99.992 });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});`,
  'types.ts': `export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  unlockedAchievements: string[];
}`
};

interface VibeCodingWorkspaceProps {
  onClose?: () => void;
}

export default function VibeCodingWorkspace({ onClose }: VibeCodingWorkspaceProps) {
  // Navigation & UI States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'explorer' | 'search' | 'git' | 'assistant'>('explorer');
  const [selectedFile, setSelectedFile] = useState<string>('App.tsx');
  const [openTabs, setOpenTabs] = useState<string[]>(['App.tsx', 'index.css', 'server.ts']);
  const [activePreviewTab, setActivePreviewTab] = useState<'app' | 'login' | 'integrations' | 'synth'>('app');
  
  // Audio Controls state
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [volume, setVolume] = useState(soundManager.getVolume());

  // Input Prompting States
  const [promptInput, setPromptInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    { sender: 'ai', text: 'Cognitive agent initialized. Ask me to write, optimize, or compile code sections instantly.', time: '04:57' }
  ]);
  const [isSendingToAI, setIsSendingToAI] = useState(false);

  // Editor States & Simulators
  const [editorCode, setEditorCode] = useState(CODE_FILES['App.tsx']);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [suggestionText, setSuggestionText] = useState('const [loading, setLoading] = useState(false);');

  // Terminal & Log States
  const [activeTerminalTab, setActiveTerminalTab] = useState<'terminal' | 'build' | 'output'>('terminal');
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'Microsoft Windows [Version 10.0.22631]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
    'C:\\Users\\shashvat\\kronex-ai> npm run dev',
    '> dev',
    '> vite --port=3000 --host=0.0.0.0',
    '',
    '  VITE v6.2.3  ready in 142 ms',
    '  ➜  Local:   http://localhost:3000/',
    '  ➜  Network: use --host to expose',
    ''
  ]);
  
  // Git Controller States
  const [commitMessage, setCommitMessage] = useState('feat: optimize telemetry routes');
  const [isGitSyncing, setIsGitSyncing] = useState(false);

  // Build & Deployment states
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'compiling' | 'success' | 'failed'>('idle');
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success'>('idle');

  // References for terminal and typing scrolls
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Sync mute state globally
  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    soundManager.setMuted(newMute);
    soundManager.playToggle();
  };

  // Sync volume globally
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundManager.setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
      soundManager.setMuted(false);
    }
  };

  // Handle Tab changes and typing simulations
  const selectFile = (fileName: string) => {
    soundManager.playClick();
    setSelectedFile(fileName);
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
    
    // Simulate typing animations
    setIsTyping(true);
    let fullText = CODE_FILES[fileName as keyof typeof CODE_FILES] || '';
    let currentIdx = 0;
    setEditorCode('');
    
    const typingTimer = setInterval(() => {
      if (currentIdx < fullText.length) {
        setEditorCode(prev => prev + fullText.charAt(currentIdx));
        currentIdx += 2; // Speed up rendering for better responsiveness
        if (Math.random() > 0.4) {
          soundManager.playTyping();
        }
      } else {
        clearInterval(typingTimer);
        setIsTyping(false);
      }
    }, 12);
  };

  // Close Tab
  const closeTab = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    const remaining = openTabs.filter(t => t !== fileName);
    setOpenTabs(remaining);
    if (selectedFile === fileName && remaining.length > 0) {
      setSelectedFile(remaining[remaining.length - 1]);
    }
  };

  // Run Compiler (The play button)
  const runCodeCompiler = () => {
    if (buildStatus === 'compiling') return;
    soundManager.playClick();
    setBuildStatus('compiling');
    setBuildProgress(0);
    setTerminalLines(prev => [...prev, `[KRONEX JIT] Starting typecheck compilation on ${selectedFile}...`]);

    const interval = setInterval(() => {
      setBuildProgress(prev => {
        if (prev < 100) {
          const next = prev + 10;
          if (next === 40) {
            setTerminalLines(p => [...p, '[VITE] Checking dynamic import tree bounds...']);
          } else if (next === 70) {
            setTerminalLines(p => [...p, '[TYPESCRIPT] Transpiling TSX wrappers into optimized CJS blocks...']);
          }
          return next;
        } else {
          clearInterval(interval);
          setBuildStatus('success');
          soundManager.playSuccess();
          setTerminalLines(p => [...p, '[SUCCESS] Built successfully! SLA Cognitive compliance factor: 99.98%', '']);
          setTimeout(() => setBuildStatus('idle'), 3000);
          return 100;
        }
      });
    }, 150);
  };

  // Deploy to Production Container
  const runDeployer = () => {
    if (deployStatus === 'deploying') return;
    soundManager.playClick();
    setDeployStatus('deploying');
    setTerminalLines(prev => [...prev, '[DEPLOY] Handshaking secure Docker virtualization clusters...']);

    setTimeout(() => {
      setTerminalLines(prev => [...prev, '[DEPLOY] Uploading built bundle (dist/server.cjs) to regional cloud edge...', '[DEPLOY] Re-routing DNS records with active SSL handshakes...']);
      setTimeout(() => {
        setDeployStatus('success');
        soundManager.playDeploy();
        setTerminalLines(prev => [...prev, '[SUCCESS] Sovereign Deployment Complete! Active SLA Online: 99.99%', '']);
        setTimeout(() => setDeployStatus('idle'), 4000);
      }, 1500);
    }, 1500);
  };

  // Send AI Chat Query
  const sendAIMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isSendingToAI) return;
    
    soundManager.playClick();
    const userMsg = promptInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: '04:57' }]);
    setPromptInput('');
    setIsSendingToAI(true);

    setTimeout(() => {
      soundManager.playNotification();
      let aiReply = "I have scanned the files in the directory. I suggest appending background blurs and aligning the active parameters inside App.tsx to suppress layout shifts.";
      
      if (userMsg.toLowerCase().includes('login')) {
        aiReply = "I have verified the premium authentication protocols. The biometric fingerprint and Face Unlock UI simulations are functional under the 'login' preview tab.";
      } else if (userMsg.toLowerCase().includes('integrations') || userMsg.toLowerCase().includes('logo')) {
        aiReply = "The Integrations section features 16 custom hovering modules. You can view the live rendering under the 'integrations' preview tab.";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply, time: '04:58' }]);
      setIsSendingToAI(false);
      setShowSuggestion(true);
      setSuggestionText('// AI optimization: Injecting high-contrast layouts\nconst blurAmount = "backdrop-blur-3xl";');
    }, 1500);
  };

  // Accept Auto-suggestion (Tab)
  const acceptSuggestion = () => {
    soundManager.playClick();
    setEditorCode(prev => prev + '\n' + suggestionText);
    setShowSuggestion(false);
  };

  // Git commit simulation
  const executeGitCommit = () => {
    if (isGitSyncing) return;
    soundManager.playClick();
    setIsGitSyncing(true);
    setTerminalLines(prev => [...prev, `[GIT] Ingesting files: ${openTabs.join(', ')}`, `[GIT] Committing SHA: f8a1bc92e -- "${commitMessage}"`]);

    setTimeout(() => {
      soundManager.playSuccess();
      setIsGitSyncing(false);
      setTerminalLines(prev => [...prev, '[GIT] Synced with remote origin/main successfully!', '']);
      setCommitMessage('feat: sync complete');
    }, 1800);
  };

  // Scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  return (
    <motion.div 
      id="vscode-workspace-root"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className={`w-full bg-[#030305]/95 border border-white/10 rounded-2xl flex flex-col overflow-hidden text-white shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative ${
        isFullscreen ? 'fixed inset-4 z-55' : 'h-[680px]'
      }`}
    >
      {/* Decorative Aurora background inside code window */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 1. TOP WINDOW BAR */}
      <div className="bg-[#08080C] px-4 py-3 flex items-center justify-between border-b border-white/[0.08] relative z-20">
        {/* Linux dots */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          <span className="hidden md:inline pl-2 text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">KRONEX AI STUDIO IDE v2.5</span>
        </div>

        {/* Global project breadcrumbs */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1 text-[10px] font-mono text-zinc-300 flex items-center space-x-1.5 shrink-0">
          <Folder className="w-3.5 h-3.5 text-cyan-400" />
          <span>kronex-app</span>
          <ChevronRight className="w-2.5 h-2.5 text-zinc-600" />
          <span>src</span>
          <ChevronRight className="w-2.5 h-2.5 text-zinc-600" />
          <span className="text-[#22D3EE] font-bold">{selectedFile}</span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Compiling spinner */}
          {buildStatus === 'compiling' && (
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[9px] font-bold">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>COMPILING ({buildProgress}%)</span>
            </div>
          )}

          {/* Quick compiler play button */}
          <button
            onClick={runCodeCompiler}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#00FFA3] text-[#A1A1AA] hover:text-[#00FFA3] transition-all cursor-pointer"
            title="Compile & Run Sandbox"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>

          {/* Screen Controls */}
          <button 
            onClick={() => { soundManager.playClick(); setIsFullscreen(!isFullscreen); }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#22D3EE] text-[#A1A1AA] hover:text-[#22D3EE] transition-all cursor-pointer"
            title="Toggle Fullscreen IDE"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button 
              onClick={() => { soundManager.playClick(); onClose(); }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-red-500 text-[#A1A1AA] hover:text-red-400 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. CORE WORKSPACE GRID */}
      <div className="flex-grow flex items-stretch overflow-hidden relative z-10">
        
        {/* ACTIVITY BAR (Left vertical rail) */}
        <div className="bg-[#050508] border-r border-white/[0.08] w-12 flex flex-col justify-between items-center py-4 shrink-0">
          <div className="space-y-4">
            {[
              { id: 'explorer', icon: Folder, tooltip: 'File Explorer' },
              { id: 'search', icon: Search, tooltip: 'Global Search' },
              { id: 'git', icon: GitBranch, tooltip: 'Git Control' },
              { id: 'assistant', icon: MessageSquare, tooltip: 'AI Code Assistant' }
            ].map((btn) => {
              const Icon = btn.icon;
              const isActive = activeSidebar === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => { soundManager.playClick(); setActiveSidebar(btn.id as any); }}
                  className={`p-2.5 rounded-xl transition-all relative group flex items-center justify-center cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-tr from-[#7C3AED]/20 to-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/30 shadow-md' 
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span className="absolute left-14 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all bg-black border border-white/10 text-white font-mono text-[9px] font-bold px-2 py-1 rounded-md shadow-xl backdrop-blur-md whitespace-nowrap z-30">
                    {btn.tooltip}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <Settings className="w-4.5 h-4.5 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* EXPANDED SIDEBAR PANELS */}
        <div className="bg-[#08080C] w-64 border-r border-white/[0.08] flex flex-col justify-between shrink-0 hidden md:flex">
          
          {/* PANEL CONTENT */}
          <div className="p-4 flex-grow overflow-y-auto space-y-4">
            
            {/* EXPLORER VIEW */}
            {activeSidebar === 'explorer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">File Explorer</span>
                  <Plus className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-[10px] font-mono font-bold text-zinc-400 px-2 py-1 select-none">
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                    <span>KRONEX-APP</span>
                  </div>
                  
                  {Object.keys(CODE_FILES).map((file) => {
                    const isActive = selectedFile === file;
                    return (
                      <button
                        key={file}
                        onClick={() => selectFile(file)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-mono font-bold text-left transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-[#7C3AED]/15 text-[#22D3EE] border border-[#7C3AED]/25' 
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-[#22D3EE]' : 'text-zinc-500'}`} />
                          <span className="truncate">{file}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GLOBAL SEARCH VIEW */}
            {activeSidebar === 'search' && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Search Workspace</span>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Search query..."
                    className="w-full bg-[#030305] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#7C3AED]/40"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                  Deep scanning local neural embeddings for matching keywords or variables.
                </p>
              </div>
            )}

            {/* GIT PANEL VIEW */}
            {activeSidebar === 'git' && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center space-x-1">
                  <GitBranch className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Git Source Control</span>
                </span>

                <div className="space-y-2">
                  <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-[10px] font-mono">
                    <div className="flex justify-between text-[#22D3EE]">
                      <span>Branch: main</span>
                      <span className="text-zinc-600">Sync with Origin</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Uncommitted changes (dirty):</span>
                    {openTabs.map((tab) => (
                      <div key={tab} className="flex items-center justify-between p-1.5 rounded bg-white/5 border border-white/5 text-[10px] font-mono text-amber-400 font-bold">
                        <span>{tab}</span>
                        <span className="text-[9px] font-bold">Modified (M)</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <input
                      type="text"
                      placeholder="Commit message..."
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="w-full bg-[#030305] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#7C3AED]/40"
                    />

                    <button
                      onClick={executeGitCommit}
                      disabled={isGitSyncing}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-sans font-bold text-xs hover:bg-indigo-500 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      {isGitSyncing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Pushing Node SHA...</span>
                        </>
                      ) : (
                        <span>Commit & Sync</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AI CHAT PANEL */}
            {activeSidebar === 'assistant' && (
              <div className="flex flex-col h-[400px] justify-between">
                <div className="space-y-3.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">KRONEX Chat Assistant</span>
                  
                  {/* Messages container */}
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`p-3 rounded-xl text-xs leading-relaxed font-sans ${
                        msg.sender === 'user' 
                          ? 'bg-purple-600/10 border border-purple-500/20 text-purple-200 ml-4' 
                          : 'bg-white/[0.02] border border-white/[0.06] text-zinc-300 mr-4'
                      }`}>
                        <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono mb-1">
                          <span className="font-bold uppercase tracking-wider">{msg.sender === 'user' ? 'Shashvat' : 'KRONEX Agent'}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Send Prompt Form */}
                <form onSubmit={sendAIMessage} className="relative flex items-center pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Optimize files..."
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    className="w-full bg-[#030305] border border-white/[0.08] rounded-lg pl-3 pr-10 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#7C3AED]/40 font-sans"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-1.5 rounded-md hover:bg-white/5 text-cyan-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Quick Metrics in sidebar footer */}
          <div className="p-4 bg-[#050508] border-t border-white/[0.06] text-[10px] font-mono space-y-1.5 text-zinc-500">
            <div className="flex justify-between">
              <span>SLA LOAD LIMIT:</span>
              <span className="text-emerald-400 font-bold">42.21%</span>
            </div>
            <div className="flex justify-between">
              <span>CLUSTER COREGUARD:</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
          </div>
        </div>

        {/* CENTRAL AREA (Editor + Terminal) */}
        <div className="flex-grow flex flex-col justify-between overflow-hidden bg-[#0a0a0f]">
          
          {/* TABS BAR */}
          <div className="bg-[#050508] border-b border-white/[0.08] flex items-center overflow-x-auto shrink-0 scrollbar-none">
            {openTabs.map((tab) => {
              const isActive = selectedFile === tab;
              return (
                <button
                  key={tab}
                  onClick={() => selectFile(tab)}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-mono font-bold border-r border-white/[0.06] transition-all relative cursor-pointer ${
                    isActive 
                      ? 'bg-[#111115] text-white' 
                      : 'bg-[#050508]/80 text-zinc-500 hover:bg-[#08080C] hover:text-zinc-300'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-zinc-600'}`} />
                  <span>{tab}</span>
                  <X 
                    className="w-3 h-3 text-zinc-600 hover:text-white rounded-full p-0.5 hover:bg-white/10 transition-all ml-1.5"
                    onClick={(e) => closeTab(tab, e)}
                  />
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#22D3EE]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* CORE EDITOR (Syntax Highlighter Window) */}
          <div className="flex-grow p-5 overflow-y-auto font-mono text-xs leading-relaxed bg-[#0c0c12] relative flex flex-col justify-between selection:bg-[#7C3AED]/20">
            {/* Background absolute blinking cursor head */}
            <div className="flex-grow relative overflow-x-auto select-text font-semibold">
              <pre className="text-zinc-300 whitespace-pre">
                <code>
                  {editorCode}
                  {/* Blinking Vertical Caret */}
                  <span className="inline-block w-1.5 h-4 bg-[#22D3EE] ml-0.5 animate-pulse" />
                </code>
              </pre>

              {/* FLOATING AI SUGGESTIONS HUD */}
              {showSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 p-4 rounded-2xl bg-[#08080C]/90 border border-purple-500/30 backdrop-blur-md max-w-sm shadow-2xl relative overflow-hidden space-y-2 z-20"
                >
                  {/* Tracing line */}
                  <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-purple-500" />
                  
                  <div className="flex items-center justify-between text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3 h-3 animate-spin-slow" />
                      <span>Copilot AI Suggestion</span>
                    </span>
                    <button 
                      onClick={() => setShowSuggestion(false)}
                      className="p-1 hover:bg-white/5 rounded text-zinc-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <pre className="text-[10px] text-zinc-400 font-mono leading-tight whitespace-pre bg-black/40 p-2 rounded-lg border border-white/5">
                    {suggestionText}
                  </pre>

                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <button
                      onClick={acceptSuggestion}
                      className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-200 rounded font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Accept (Tab)
                    </button>
                    <span className="text-zinc-600">Press Tab to auto-complete</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* BOTTOM TERMINAL PANEL */}
          <div className="bg-[#050508] border-t border-white/[0.08] min-h-[140px] flex flex-col justify-between shrink-0">
            {/* Terminal Tab switcher */}
            <div className="bg-[#08080C] px-4 py-1.5 border-b border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <div className="flex space-x-4">
                {[
                  { id: 'terminal', label: 'TERMINAL' },
                  { id: 'build', label: 'BUILD LOGS' },
                  { id: 'output', label: 'OUTPUT FEED' }
                ].map((termTab) => (
                  <button
                    key={termTab.id}
                    onClick={() => { soundManager.playClick(); setActiveTerminalTab(termTab.id as any); }}
                    className={`font-bold transition-colors cursor-pointer ${
                      activeTerminalTab === termTab.id ? 'text-[#22D3EE] border-b-2 border-[#22D3EE] pb-0.5' : 'hover:text-zinc-300'
                    }`}
                  >
                    {termTab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#10B981] font-bold uppercase tracking-wider">SSL GATEWAY SECURED</span>
              </div>
            </div>

            {/* Terminal Feed */}
            <div className="p-4 flex-grow bg-black/90 font-mono text-[11px] leading-relaxed text-zinc-400 max-h-24 overflow-y-auto">
              {activeTerminalTab === 'terminal' && (
                <div className="space-y-0.5">
                  {terminalLines.map((line, idx) => (
                    <p key={idx} className="truncate select-text">
                      <span className="text-slate-600 select-none mr-2">$</span>
                      {line}
                    </p>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              )}

              {activeTerminalTab === 'build' && (
                <div className="space-y-1 text-zinc-400">
                  <p className="text-zinc-500">// TypeScript React bundling parameters:</p>
                  <p>✓ Loaded vite.config.ts successfully.</p>
                  <p>✓ Initialized tailwind JIT core compiler cache.</p>
                  <p>✓ Output path bound cleanly to dist/ folder.</p>
                  <p>✓ Handshaked Google Gemini Cloud SDK key (server-side proxy).</p>
                </div>
              )}

              {activeTerminalTab === 'output' && (
                <div className="space-y-1 text-cyan-400 font-bold text-[10px]">
                  <p className="text-zinc-500">// Real-time node outputs:</p>
                  <p>12:04:12 - [Node 42] Heartbeat synchronized. 12ms ping latency.</p>
                  <p>12:04:15 - [Node 42] Allocated memory: 142MB / 512MB.</p>
                  <p>12:04:18 - [Node 42] Diagnostic AST security audit matches 100% compliant.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* LIVE PREVIEW CANVAS (Right column) */}
        <div className="w-[380px] bg-[#050508] border-l border-white/[0.08] flex flex-col justify-between shrink-0 hidden lg:flex">
          
          {/* Preview Header / Browser top bar */}
          <div className="bg-[#08080C] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between shrink-0">
            <span className="font-display font-black text-xs text-white flex items-center space-x-1.5">
              <Eye className="w-4 h-4 text-[#22D3EE]" />
              <span>LIVE RENDER TARGETS</span>
            </span>

            {/* Selector dropdown inside browser */}
            <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-[10px] font-mono text-zinc-300">
              <select
                value={activePreviewTab}
                onChange={(e) => { soundManager.playClick(); setActivePreviewTab(e.target.value as any); }}
                className="bg-transparent border-0 font-bold focus:ring-0 outline-none text-zinc-300 cursor-pointer"
              >
                <option value="app" className="bg-[#08080C]">App.tsx Card</option>
                <option value="login" className="bg-[#08080C]">Auth Page</option>
                <option value="integrations" className="bg-[#08080C]">Integrations</option>
                <option value="synth" className="bg-[#08080C]">Audio Synth</option>
              </select>
            </div>
          </div>

          {/* Browser Address bar */}
          <div className="px-4 py-2 bg-[#050508] border-b border-white/[0.04] flex items-center space-x-2 shrink-0">
            <div className="flex space-x-1 text-zinc-600">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            </div>
            <div className="flex-grow bg-black border border-white/5 px-3 py-1 rounded-lg text-[9px] font-mono text-zinc-500 truncate flex items-center space-x-1.5">
              <Lock className="w-3 h-3 text-[#10B981]" />
              <span>https://sandbox.kronex-app.ai/preview</span>
            </div>
            <button 
              onClick={runCodeCompiler}
              className="px-2 py-1 text-[10px] font-mono font-bold bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#22D3EE] rounded hover:bg-[#7C3AED]/35 transition-colors cursor-pointer"
            >
              RUN
            </button>
          </div>

          {/* Core render box */}
          <div className="flex-grow p-6 flex flex-col items-center justify-center relative bg-black select-none overflow-y-auto max-h-[380px]">
            {/* Holographic grid backing */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

            <div className="relative z-10 w-full">
              <AnimatePresence mode="wait">
                
                {/* PREVIEW 1: APP CARD */}
                {activePreviewTab === 'app' && (
                  <motion.div
                    key="app"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-3xl bg-[#09090B] border border-white/10 text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#22D3EE]" />
                    <Cpu className="w-10 h-10 text-[#22D3EE] mx-auto animate-pulse" />
                    <h3 className="font-display font-black text-white text-md mt-4">KRONEX JIT RENDERING</h3>
                    <p className="text-[10px] text-zinc-400 mt-2 font-sans leading-relaxed">
                      Sovereign code compiler is actively rendering the dynamic template parameters successfully.
                    </p>
                    <div className="mt-4 py-2 bg-white/5 border border-white/5 rounded-xl font-mono text-[9px] text-[#00FFA3] uppercase font-bold tracking-wider">
                      Uptime Verified: 100% Stable
                    </div>
                  </motion.div>
                )}

                {/* PREVIEW 2: PREMIUM AUTHENTICATION PAGE */}
                {activePreviewTab === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full scale-85 origin-center"
                  >
                    <LoginInterface />
                  </motion.div>
                )}

                {/* PREVIEW 3: ECOSYSTEM INTEGRATIONS */}
                {activePreviewTab === 'integrations' && (
                  <motion.div
                    key="integrations"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full scale-80 origin-center max-h-[300px] overflow-y-auto scrollbar-none"
                  >
                    <Integrations />
                  </motion.div>
                )}

                {/* PREVIEW 4: INTERACTIVE AUDIO SYNTH CONTROL */}
                {activePreviewTab === 'synth' && (
                  <motion.div
                    key="synth"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-3xl bg-[#09090B] border border-white/10 relative overflow-hidden space-y-4"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-[#7C3AED]" />
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">KRONEX INTERACTIVE OSCILLATOR</span>
                      <span className="text-[8px] font-mono bg-cyan-400/10 text-[#22D3EE] px-2 py-0.5 rounded font-bold">48kHz BUFFER</span>
                    </div>

                    <div className="text-center py-4 bg-black rounded-2xl border border-white/5 relative">
                      {/* Interactive Sine bar oscillation */}
                      <div className="flex justify-center items-center h-16 space-x-1 px-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => {
                          const h = isMuted ? 4 : Math.floor(Math.sin(bar + Date.now()/120) * 16 + 24);
                          return (
                            <div 
                              key={bar} 
                              className="w-1.5 bg-[#22D3EE] rounded-full transition-all duration-150"
                              style={{ height: `${h}px` }}
                            />
                          );
                        })}
                      </div>
                      <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-2">Oscillation Waveform Stream</p>
                    </div>

                    {/* Volume and synthesis controllers */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-mono text-zinc-400 font-bold uppercase">
                        <span>SYNTH GAIN ENVELOPE:</span>
                        <span>{isMuted ? 'MUTED' : `${Math.round(volume * 100)}%`}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full h-1 accent-[#22D3EE] bg-zinc-850 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <button 
                        onClick={() => { soundManager.playSuccess(); }}
                        className="p-2.5 bg-white/5 hover:bg-[#7C3AED]/15 border border-white/10 hover:border-[#7C3AED]/30 rounded-xl text-[9px] font-mono font-bold text-zinc-300 hover:text-[#22D3EE] uppercase tracking-wide transition-all cursor-pointer"
                      >
                        Play Success Chime
                      </button>
                      <button 
                        onClick={() => { soundManager.playNotification(); }}
                        className="p-2.5 bg-white/5 hover:bg-[#7C3AED]/15 border border-white/10 hover:border-[#7C3AED]/30 rounded-xl text-[9px] font-mono font-bold text-zinc-300 hover:text-[#22D3EE] uppercase tracking-wide transition-all cursor-pointer"
                      >
                        Play Chimes
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Quick Sandbox actions */}
          <div className="p-4 bg-[#08080C] border-t border-white/[0.08] space-y-2 shrink-0">
            <button
              onClick={runDeployer}
              disabled={deployStatus === 'deploying'}
              className="w-full py-3.5 bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#22D3EE] text-white font-display font-black text-xs uppercase tracking-widest hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-indigo-500/10"
            >
              {deployStatus === 'deploying' ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  <span>Sovereign Deploying Container...</span>
                </>
              ) : deployStatus === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-[#00FFA3]" />
                  <span>Sovereign Deploy Complete!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#00FFA3]" />
                  <span>Deploy to cloud Edge</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* 3. VS CODE BLUE/PURPLE STATUS BAR */}
      <div className="bg-[#1e1e24] px-4 py-1.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-400 shrink-0 select-none relative z-20">
        
        {/* Left Side: Git & Errors */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 font-bold text-white">
            <GitBranch className="w-3.5 h-3.5" />
            <span>main</span>
          </div>

          {/* Git sync status indicator */}
          <div className="flex items-center space-x-1 text-[#22D3EE] font-bold">
            <RefreshCw className={`w-3 h-3 ${isGitSyncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </div>

          {/* Warning metrics */}
          <div className="flex items-center space-x-2 text-zinc-500">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>0</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Center Side: Telemetry SLA */}
        <div className="hidden md:flex items-center space-x-1.5 font-bold text-zinc-500 uppercase">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>SLA Secure Node Cluster: Active</span>
        </div>

        {/* Right Side: Cursor, Language, Audio */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:inline">Ln 42, Col 18</div>
          <div className="hidden sm:inline">UTF-8</div>
          <div className="hidden sm:inline text-white font-bold">TypeScript React</div>

          {/* Integrated sound mute toggle & volume slider */}
          <div className="flex items-center space-x-2 border-l border-white/10 pl-4">
            <button
              onClick={toggleMute}
              className={`p-1 rounded-md transition-colors ${
                isMuted ? 'text-rose-400 hover:bg-rose-500/10' : 'text-[#22D3EE] hover:bg-[#22D3EE]/10'
              }`}
              title={isMuted ? 'Unmute UI Sound Synth' : 'Mute UI Sound Synth'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-12 h-1 accent-[#22D3EE] bg-zinc-700 rounded-lg cursor-pointer shrink-0"
              title="UI Audio Synthesis volume"
            />
          </div>
        </div>

      </div>

    </motion.div>
  );
}
