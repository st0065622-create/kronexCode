import React, { useState } from 'react';
import { 
  Bot, LayoutDashboard, GitBranch, Cpu, Zap, Activity, Sliders, 
  Settings, Layers, Sparkles, MessageSquare, ArrowUpRight, CheckCircle2,
  TrendingUp, Clock, ShieldCheck, Terminal, Play, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardOSPreviewProps {
  onLaunchDashboard?: (tab?: string) => void;
}

export default function DashboardOSPreview({ onLaunchDashboard }: DashboardOSPreviewProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hello! I am Kronex Core 2.5. How can I help you optimize your AI agents today?' }
  ]);

  const sidebarItems = [
    { id: 'Overview', icon: LayoutDashboard },
    { id: 'Agents', icon: Bot, count: '24' },
    { id: 'Workflows', icon: GitBranch, count: '142' },
    { id: 'Models', icon: Cpu, count: '100+' },
    { id: 'Automation', icon: Zap },
    { id: 'Analytics', icon: Activity },
    { id: 'Studio', icon: Sparkles },
    { id: 'Integrations', icon: Layers },
    { id: 'Settings', icon: Settings },
  ];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) return;
    
    const userText = chatMessage;
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');

    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { sender: 'bot', text: `Analyzing prompt: "${userText}". Executing multi-model agent pipeline... Complete with 99.9% confidence!` }
      ]);
    }, 800);
  };

  return (
    <section id="dashboard-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-mono font-bold uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
          <span>REALISTIC AI OS DASHBOARD</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight"
        >
          Next-Gen AI Operating System
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-base text-zinc-400 font-sans font-medium"
        >
          Monitor active agents, execute serverless workflows, and analyze real-time cognitive metrics in one unified glass interface.
        </motion.p>
      </div>

      {/* Main Glass OS Dashboard Shell */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-[32px] bg-[#0A0F1E]/90 border border-white/10 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden relative"
      >
        {/* Top Window Bar */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-4 text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase hidden sm:inline">
              KRONEX AI OS v2.5 • SYSTEM ONLINE
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SLA 99.99%
            </span>
            <button 
              onClick={() => onLaunchDashboard && onLaunchDashboard('ai-agents')}
              className="px-3 py-1 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#00D4FF] font-bold hover:bg-[#7C3AED]/30 transition-all cursor-pointer hidden sm:flex items-center gap-1"
            >
              <span>Full OS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dashboard OS Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3 bg-slate-950/60 border-r border-white/10 p-4 space-y-2">
            <span className="px-3 text-[10px] font-mono uppercase tracking-[2px] font-bold text-zinc-400 block mb-2">
              NAVIGATION
            </span>

            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#7C3AED]/20 to-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#00D4FF]' : 'text-zinc-400'}`} />
                    <span>{item.id}</span>
                  </div>
                  {item.count && (
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN DASHBOARD CONTENT */}
          <div className="lg:col-span-6 p-6 space-y-6 bg-slate-950/30">
            
            {/* Top 4 Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-all">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Total Agents</span>
                <span className="text-xl font-display font-black text-white mt-1 block">24 Active</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12% this week
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 transition-all">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Workflows</span>
                <span className="text-xl font-display font-black text-white mt-1 block">142 Running</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> 0 Errors
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-all">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">API Calls</span>
                <span className="text-xl font-display font-black text-white mt-1 block">1.2M Today</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> Avg 32ms
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition-all">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Success Rate</span>
                <span className="text-xl font-display font-black text-emerald-400 mt-1 block">99.98%</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3" /> SOC2 Verified
                </span>
              </div>
            </div>

            {/* Interactive Analytics Graph */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-display">Real-Time Cognitive Token Throughput</h4>
                  <p className="text-[11px] text-zinc-400">Live token processing speed across active agent clusters</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[#00D4FF] text-[10px] font-mono font-bold">
                  LIVE STREAM
                </span>
              </div>

              {/* SVG Line Graph */}
              <div className="h-44 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                  {/* Filled Area */}
                  <path 
                    d="M 0 90 Q 60 40, 120 70 T 240 30 T 360 50 T 500 20 L 500 120 L 0 120 Z" 
                    fill="url(#chartGradient)" 
                  />

                  {/* Neon Line */}
                  <path 
                    d="M 0 90 Q 60 40, 120 70 T 240 30 T 360 50 T 500 20" 
                    fill="none" 
                    stroke="#00D4FF" 
                    strokeWidth="3" 
                  />

                  {/* Active Pulse Dots */}
                  <circle cx="240" cy="30" r="5" fill="#00FFA3" className="animate-ping" />
                  <circle cx="240" cy="30" r="4" fill="#00FFA3" />
                  <circle cx="500" cy="20" r="5" fill="#00D4FF" className="animate-pulse" />
                </svg>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: CUTE AI ASSISTANT PANEL */}
          <div className="lg:col-span-3 bg-slate-950/80 border-l border-white/10 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Robot Avatar & Online Status */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#00D4FF] p-[2px] relative shrink-0 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-[#00D4FF] animate-bounce" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_#00FFA3]" />
                </div>

                <div>
                  <span className="block font-display font-bold text-sm text-white">Kronex Assistant</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE & READY
                  </span>
                </div>
              </div>

              {/* Chat Message Bubble */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {chatHistory.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-2xl text-xs font-sans leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-white ml-4' 
                        : 'bg-white/[0.05] border border-white/10 text-zinc-300 mr-2'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className="space-y-2">
                <p className="text-[11px] font-medium text-zinc-400 font-sans">
                  "How can I help you today?"
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask AI assistant..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00D4FF]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 px-2.5 py-1 rounded-lg bg-[#00D4FF] text-slate-950 font-bold text-[10px] uppercase cursor-pointer hover:bg-cyan-300 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>

            </div>

            {/* Large Glowing Start Chat CTA Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => onLaunchDashboard && onLaunchDashboard('simple-chat')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#00D4FF] text-white font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Start Chat</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

          </div>

        </div>
      </motion.div>

    </section>
  );
}
