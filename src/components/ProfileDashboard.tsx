import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Award, Settings, Shield, Bell, Key, CreditCard, 
  Sparkles, Code2, Database, BarChart2, Plus, Users, 
  Check, Copy, Terminal, Activity, FileText, ChevronRight,
  UserCheck, ExternalLink, Calendar, HelpCircle, Save,
  Rocket, Briefcase, GraduationCap, Target, Send,
  Globe, Twitter, Linkedin, Github, Mail, Sparkle, Heart, Flame,
  Camera, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Moon, Sun, Smartphone, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress } from '../types';
import { soundManager } from '../utils/sound';

interface ProfileDashboardProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

const SKILLS_LIST = [
  { name: "Agentic Swarm Orchestration", lvl: "98%", status: "Sovereign Master" },
  { name: "LLM Fine-Tuning & Alignments", lvl: "95%", status: "Expert Core" },
  { name: "Neural Cognitive Architectures", lvl: "92%", status: "Architect" },
  { name: "Vibe-Coding Platform Design", lvl: "97%", status: "Sovereign Master" },
  { name: "SaaS Low-Latency Vector Nodes", lvl: "90%", status: "Advanced" }
];

const NOTIFICATIONS_LOG = [
  { id: 'n1', title: 'Sovereign Network Active', desc: 'Your custom AI agent mesh is synchronized globally across 12 zones.', date: 'Just now' },
  { id: 'n2', title: 'Founder Milestone Unlocked', desc: 'KRONEX community exceeded 10,000 verified platform developers.', date: '4h ago' },
  { id: 'n3', title: 'Enterprise SLA Seed Initiated', desc: 'Secure database parameters successfully deployed to mainnet.', date: '1d ago' }
];

const FOUNDER_PROJECTS = [
  { 
    title: "KRONEX Oracle-v2", 
    tech: "Rust • DeepMind Agent", 
    desc: "A cognitive mastermind reasoning LLM framework with automated feedback loop compiling.",
    stats: "15K Queries/sec"
  },
  { 
    title: "Cognitive Router v1", 
    tech: "TypeScript • Vector Node", 
    desc: "A low-latency vector database router capable of zero-overhead semantic redirection.",
    stats: "1.2ms Latency"
  },
  { 
    title: "Sovereign Agent Node", 
    tech: "Go • Cryptographic Mesh", 
    desc: "Isolated high-assurance sandbox execution nodes for autonomous multi-agent swarms.",
    stats: "99.999% SLA Uptime"
  }
];

// Helper for live counting numbers simulation
function CountUpNumber({ endValue, suffix = "", duration = 1500 }: { endValue: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(endValue / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        clearInterval(timer);
        setVal(endValue);
      } else {
        setVal(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [endValue, duration]);

  return <span>{val}{suffix}</span>;
}

// Interactive background particles
export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{ x: number; y: number; r: number; dx: number; dy: number; alpha: number }> = [];

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 500;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const run = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#22D3EE';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0; // reset
      animId = requestAnimationFrame(run);
    };

    run();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 rounded-3xl" />;
}

export default function ProfileDashboard({ progress, onUpdateProgress }: ProfileDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'edit-profile' | 'usage' | 'settings' | 'notifications'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuteState());

  // Unified global profile state
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('kronex_founder_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      name: 'THE SHASHVAT',
      username: 'shashvat_ceo',
      email: 'st0065622@gmail.com',
      phone: '+91 7869261291',
      bio: "Creator & Lead Architect of KRONEX AI. Passionate about AI Agents, Automation, LLMs, Prompt Engineering, and building world-class AI operating systems.",
      country: 'India',
      language: 'English',
      twoFactor: false,
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      avatar: '/src/assets/images/shashvat_profile_1785747313447.jpg'
    };
  });

  useEffect(() => {
    localStorage.setItem('kronex_founder_profile', JSON.stringify(profile));
  }, [profile]);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Profile Edit fields temp states
  const [editName, setEditName] = useState(profile.name);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editCountry, setEditCountry] = useState(profile.country);
  const [editLanguage, setEditLanguage] = useState(profile.language);
  const [editTwoFactor, setEditTwoFactor] = useState(profile.twoFactor);
  const [editTheme, setEditTheme] = useState(profile.theme);
  const [editNotifEmail, setEditNotifEmail] = useState(profile.notifications.email);
  const [editNotifPush, setEditNotifPush] = useState(profile.notifications.push);
  const [editNotifSms, setEditNotifSms] = useState(profile.notifications.sms);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Sync temp states if tab changes or profile changes
  useEffect(() => {
    setEditName(profile.name);
    setEditUsername(profile.username);
    setEditEmail(profile.email);
    setEditPhone(profile.phone);
    setEditBio(profile.bio);
    setEditCountry(profile.country);
    setEditLanguage(profile.language);
    setEditTwoFactor(profile.twoFactor);
    setEditTheme(profile.theme);
    setEditNotifEmail(profile.notifications.email);
    setEditNotifPush(profile.notifications.push);
    setEditNotifSms(profile.notifications.sms);
  }, [profile, activeTab]);

  const [notifications, setNotifications] = useState(NOTIFICATIONS_LOG);

  // Contact Founder State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Settings state
  const [subscription] = useState('Enterprise SLA Plan ($1B Vault)');
  const [apiKey] = useState('krnx_live_sk_84bf92a01ce94b1a8d052a2337a6_shashvat_ceo');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Mouse Parallax coordinates for 3D card tilt effect
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range: -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * -8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    notify("Copied secure founder API key.");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleClearNotice = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      notify("Please populate all fields to sync neural connection.");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      notify(`Message broadcasted to ${profile.name}'s secure terminal!`);
      setTimeout(() => {
        setSendSuccess(false);
        setContactName('');
        setContactEmail('');
        setContactMsg('');
      }, 4000);
    }, 1500);
  };

  // Premium Photo Uploader Handler
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
        notify("Photo selected. Crop optimized with realistic glowing lighting.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Save Action
  const handleSaveProfile = () => {
    if (!editName.trim() || !editUsername.trim() || !editEmail.trim()) {
      notify("Name, Username, and Email are mandatory parameters.");
      return;
    }

    const updated = {
      ...profile,
      name: editName,
      username: editUsername,
      email: editEmail,
      phone: editPhone,
      bio: editBio,
      country: editCountry,
      language: editLanguage,
      twoFactor: editTwoFactor,
      theme: editTheme,
      notifications: {
        email: editNotifEmail,
        push: editNotifPush,
        sms: editNotifSms
      },
      avatar: previewAvatar || profile.avatar
    };

    setProfile(updated);
    setPreviewAvatar(null);
    notify("Founder profile matrix compiled successfully. Local storage synced.");

    // Simulate Firebase Firestore write
    console.log("Saving user profile to Firestore: ", updated);
  };

  // Secure Password Change Action
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      notify("All credential fields must be parsed.");
      return;
    }
    if (newPassword !== confirmPassword) {
      notify("New passwords do not match.");
      return;
    }
    notify("Security credentials compiled. Password successfully rotated.");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // 2FA Backup codes generator
  const backupCodes = [
    '8302-1847', '2948-9102', '1103-9948', '5829-3011'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 relative select-none">
      
      {/* 1. TOP COVER CARD - ULTRA PREMIUM 3D GLASSMORPHISM */}
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: tilt.y,
          rotateY: tilt.x,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="glass-panel rounded-[32px] p-8 border border-purple-500/10 relative overflow-hidden shadow-2xl bg-gradient-to-br from-[#0B1020]/90 via-slate-900/60 to-[#0B1020]/90 backdrop-blur-2xl"
      >
        <BackgroundParticles />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#7C3AED]/10 blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          
          {/* Floating Avatar Frame with Electric Dual Glowing Ring */}
          <div className="relative group shrink-0">
            {/* Soft futuristic spinning neon radial border */}
            <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#22D3EE] to-[#7C3AED] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-spin-slow" />
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] opacity-90 animate-pulse" />
            
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white/20 bg-slate-950 flex items-center justify-center shadow-2xl"
            >
              <img 
                src={previewAvatar || profile.avatar} 
                alt={profile.name} 
                className="w-full h-full object-cover scale-105"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          <div className="text-center md:text-left flex-grow space-y-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  {profile.name}
                </h2>
                <span className="px-3 py-1 rounded-full text-[9px] font-mono font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white border border-[#7C3AED]/20 shadow-md shadow-[#7C3AED]/15">
                  @{profile.username}
                </span>
                <span className="px-3 py-1 rounded-full text-[9px] font-mono font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  VERIFIED FOUNDER ✓
                </span>
              </div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#22D3EE] flex items-center justify-center md:justify-start gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
                Active Executive Account Portal
              </p>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-medium font-sans">
              "{profile.bio}"
            </p>

            {/* Glowing Badges Row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2.5 pt-1">
              {[
                { label: "Founder", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                { label: "CEO", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
                { label: "AI Architect", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
                { label: "Startup Builder", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
                { label: "Verified", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
              ].map((badge) => (
                <span key={badge.label} className={`px-2.5 py-1 rounded-lg text-[9.5px] font-mono font-bold uppercase tracking-wider border ${badge.color}`}>
                  {badge.label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#22D3EE]" /> Active since 2026</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#7C3AED]" /> 10K+ Community Developers</span>
              <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-[#22D3EE]" /> 100% Verified SLA Node</span>
            </div>
          </div>

          {/* Luxury $1B Valuation Metric Widget */}
          <div className="shrink-0 p-5 bg-white/3 border border-white/5 rounded-3xl text-center min-w-[170px] relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            <span className="text-[8.5px] font-mono text-slate-400 block uppercase tracking-widest">KRONEX SYSTEM STAGE:</span>
            <span className="text-white font-black text-sm block mt-1 tracking-wide">ACTIVE DEVELOPMENT</span>
            <span className="text-[10px] text-[#22D3EE] font-mono block mt-1.5 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">SLA SECURE GATEWAY</span>
          </div>

        </div>
      </motion.div>

      {/* 2. STATS SECTION - NUMBERS COUNT-UP */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Founded Year', val: 2026, suffix: '', icon: Calendar, color: 'text-purple-400' },
          { label: 'AI Products Built', val: 20, suffix: '+', icon: Sparkles, color: 'text-cyan-400' },
          { label: 'Community Growth', val: 10, suffix: 'K+', icon: Users, color: 'text-emerald-400' },
          { label: 'Active Projects', val: 100, suffix: '+', icon: Rocket, color: 'text-orange-400' },
          { label: 'Built Models', val: 15, suffix: '+', icon: CpuComponent, color: 'text-pink-400' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.label}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-panel rounded-2xl p-4.5 border border-white/5 bg-white/3 flex flex-col justify-between hover:border-white/10 transition-all text-center md:text-left"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="mt-2">
                <span className="text-xl md:text-2xl font-display font-black text-white block">
                  <CountUpNumber endValue={stat.val} suffix={stat.suffix} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. SUB TAB NAVIGATION BAR */}
      <div className="flex border-b border-white/10 overflow-x-auto gap-4 scrollbar-thin">
        {[
          { id: 'overview', label: 'Founder Portfolio', icon: User },
          { id: 'edit-profile', label: 'Edit Profile & Credentials', icon: UserCheck },
          { id: 'usage', label: 'SaaS AI Analytics', icon: BarChart2 },
          { id: 'settings', label: 'Secure Access & Keys', icon: Settings },
          { id: 'notifications', label: 'Sovereign Comms', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-3.5 pt-1 text-xs font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all shrink-0 ${
                isActive 
                  ? 'border-b-[#22D3EE] text-white border-white' 
                  : 'border-transparent text-slate-500 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-[#7C3AED]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. MAIN WORKSPACE CONTENT */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: FOUNDER PORTFOLIO HUB */}
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* L1: Journey and Vision */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Founder Journey Section */}
              <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] bg-[#111111] space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="text-[10px] font-mono font-extrabold text-[#A1A1AA] block uppercase tracking-wider">
                    FOUNDER JOURNEY & TIMELINE
                  </span>
                  <Rocket className="w-4 h-4 text-[#22D3EE]" />
                </div>
                
                <div className="space-y-4 relative pl-3 border-l-2 border-[#7C3AED]/30">
                  <div className="relative">
                    <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-[#22D3EE] shadow-md shadow-[#22D3EE]/50" />
                    <span className="text-[10px] font-mono text-[#22D3EE] font-bold">2026 — Present</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">Founding KRONEX AI</h4>
                    <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">
                      Launched KRONEX AI to modularize multi-agent workflows, enabling developers and enterprise networks to deploy fully sandboxed autonomous nodes instantly.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                    <span className="text-[10px] font-mono text-slate-400 font-bold">2025</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">Cognitive Core Formulation</h4>
                    <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">
                      Conducted deep development research into agentic compiler heuristics, creating the foundation of low-latency vector routers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Vision & Mission Section */}
              <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] bg-[#111111] relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                  <span className="text-[10px] font-mono font-extrabold text-[#A1A1AA] block uppercase tracking-wider">
                    VISION & CORE MISSION
                  </span>
                  <Target className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#09090B] border border-white/[0.08] space-y-2">
                    <span className="text-[9px] font-mono text-[#22D3EE] font-bold block uppercase">01 / REASONING FIRST</span>
                    <h4 className="text-xs font-bold text-white">Sovereign Intelligent Mesh</h4>
                    <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                      Building a highly-aligned generative computing framework where AI agents can autonomously execute, self-debug, and interact securely.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#09090B] border border-white/[0.08] space-y-2">
                    <span className="text-[9px] font-mono text-[#7C3AED] font-bold block uppercase">02 / DEMOCRATIZATION</span>
                    <h4 className="text-xs font-bold text-white">Empower 100M Builders</h4>
                    <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                      Providing enterprise-grade cognitive layers with beautiful minimalist developer tooling, making state-of-the-art AI integration seamless.
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Projects Section */}
              <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] bg-[#111111] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-extrabold text-[#A1A1AA] block uppercase tracking-wider">
                    FEATURED KRONEX SYSTEMS
                  </span>
                  <Code2 className="w-4 h-4 text-[#22D3EE]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FOUNDER_PROJECTS.map((p) => (
                    <motion.div 
                      key={p.title} 
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="p-4 rounded-2xl bg-[#09090B] border border-white/[0.08] hover:border-[#7C3AED]/30 hover:bg-[#18181B] transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono text-[#22D3EE] font-bold uppercase block tracking-wider bg-[#22D3EE]/5 px-2 py-0.5 rounded border border-[#22D3EE]/10 w-max">{p.tech}</span>
                        <h4 className="text-xs font-bold text-white leading-tight">{p.title}</h4>
                        <p className="text-[10.5px] text-[#A1A1AA] leading-normal">{p.desc}</p>
                      </div>
                      <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-[9px] font-mono text-slate-500">
                        <span>METRIC:</span>
                        <span className="text-[#10B981] font-bold">{p.stats}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>

            {/* R1: Skills, Awards, Contacts */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* AI Skills Section */}
              <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] bg-[#111111] space-y-4 shadow-sm">
                <span className="text-[10px] font-mono font-extrabold text-[#A1A1AA] block uppercase tracking-wider">
                  FOUNDER AI SKILLS MATRIX
                </span>
                <div className="space-y-3.5">
                  {SKILLS_LIST.map((sk) => (
                    <div key={sk.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-semibold flex items-center gap-1.5">
                          <Sparkle className="w-3 h-3 text-[#22D3EE]" />
                          {sk.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#22D3EE] font-bold">{sk.lvl}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: sk.lvl }}
                          transition={{ duration: 1.2, delay: 0.1 }}
                          className="h-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE]" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards & Achievements Section */}
              <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] bg-[#111111] space-y-3 shadow-sm">
                <span className="text-[10px] font-mono font-extrabold text-[#A1A1AA] block uppercase tracking-wider">
                  GLOBAL ACHIEVEMENTS
                </span>
                <div className="space-y-2">
                  {[
                    "AI Innovation Core Award (2026)",
                    "SOC2 Gold Security Compliance Flag",
                    "Top-Tier Global Cognitive Hack Leader"
                  ].map((award, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2 bg-[#09090B] border border-white/[0.08] rounded-xl text-[11px] text-white">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">{award}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Startup Roadmap Stepper */}
              <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] bg-[#111111] space-y-4 shadow-sm">
                <span className="text-[10px] font-mono font-extrabold text-[#A1A1AA] block uppercase tracking-wider">
                  KRONEX STARTUP ROADMAP
                </span>
                <div className="space-y-3">
                  {[
                    { phase: "Q1 2026", task: "Foundation Sandbox Heuristics", status: "Done", done: true },
                    { phase: "Q2 2026", task: "Multi-Agent System Compiler", status: "Current", current: true },
                    { phase: "Q3 2026", task: "Enterprise Sovereign Network Nodes", status: "Next" }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                        step.done 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : step.current 
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                          : 'bg-white/5 text-slate-400 border border-white/5'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-white">{step.phase}</span>
                          {step.status && (
                            <span className={`text-[8px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded ${
                              step.done ? 'bg-emerald-500/10 text-emerald-400' : step.current ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-slate-400'
                            }`}>{step.status}</span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-[#A1A1AA]">{step.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Founder Section */}
              <div className="glass-panel rounded-3xl p-5 border border-white/[0.08] bg-[#111111] space-y-4 shadow-sm">
                <span className="text-[10px] font-mono font-extrabold text-[#A1A1AA] block uppercase tracking-wider">
                  CONNECT & SOCIAL LINKS
                </span>
                
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { icon: Twitter, href: "https://twitter.com/kronexai", name: "X" },
                    { icon: Github, href: "https://github.com/shashvat", name: "GitHub" },
                    { icon: Linkedin, href: "https://linkedin.com", name: "LinkedIn" },
                    { icon: Mail, href: `mailto:${profile.email}`, name: "Mail" }
                  ].map((social) => {
                    const SIcon = social.icon;
                    return (
                      <a 
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 p-2 bg-[#09090B] border border-white/[0.08] hover:bg-[#22D3EE]/10 hover:border-[#22D3EE]/30 transition-all cursor-pointer group"
                      >
                        <SIcon className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#22D3EE] transition-colors" />
                        <span className="text-[9px] font-mono text-slate-400 group-hover:text-[#22D3EE] transition-colors">{social.name}</span>
                      </a>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-mono text-[#A1A1AA] uppercase block tracking-wider">DIRECT NEURAL TERMINAL PING</label>
                    <input 
                      type="text" 
                      placeholder="Your Name / Organization"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#22D3EE] transition-all placeholder-slate-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <input 
                      type="email" 
                      placeholder="Your Secure Mail"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#22D3EE] transition-all placeholder-slate-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <textarea 
                      placeholder="Transmission Message..."
                      rows={2}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#22D3EE] resize-none transition-all placeholder-slate-500"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full py-2 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-95 text-white text-[10.5px] font-display font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#7C3AED]/20"
                  >
                    {isSending ? (
                      <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 animate-spin" /> BROADCASTING...</span>
                    ) : (
                      <span className="flex items-center gap-1.5"><Send className="w-3 h-3" /> TRANSMIT PING</span>
                    )}
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: EDIT PROFILE & CREDENTIALS (THE PREMIUM EDIT PAGE REQUESTED) */}
        {activeTab === 'edit-profile' && (
          <motion.div 
            key="edit-profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Hand: Upload Avatar + Identity Fields */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="glass-panel rounded-3xl p-6 border border-white/[0.08] bg-[#111111] shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="text-[10px] font-mono font-extrabold text-[#A1A1AA] block uppercase tracking-wider">
                    FOUNDER IDENTITY CRITERIA
                  </span>
                  <User className="w-4 h-4 text-[#7C3AED]" />
                </div>

                {/* Circular neon-glow avatar manager */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#09090B] rounded-2xl border border-white/[0.08]">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] opacity-80 blur-md animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 bg-[#050505] flex items-center justify-center shadow">
                      <img 
                        src={previewAvatar || profile.avatar} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="text-xs font-bold text-white">Founder Avatar Portal</h4>
                    <p className="text-[10.5px] text-[#A1A1AA] leading-normal max-w-sm">
                      Upload your high-resolution portrait. The system center-crops the image dynamically and embeds realistic glowing lighting rings matching KRONEX standards.
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-[10.5px] font-display font-black uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/10 transition-all"
                    >
                      <Camera className="w-3.5 h-3.5 text-white" />
                      <span>Select Founder Photo</span>
                    </button>
                  </div>
                </div>

                {/* Profile fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">Founder Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-[#09090B] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#7C3AED] transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">Username</label>
                    <input 
                      type="text" 
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="w-full bg-[#09090B] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#7C3AED] transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">Email Address</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-[#09090B] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#7C3AED] transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">Phone Number</label>
                    <input 
                      type="text" 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[#09090B] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#7C3AED] transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">Executive Bio Statement</label>
                    <textarea 
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={3}
                      className="w-full bg-[#09090B] border border-white/[0.08] text-white rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#7C3AED] resize-none transition-all leading-normal"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">Country / Jurisdiction</label>
                    <select 
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full bg-[#09090B] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                    >
                      <option className="bg-[#111111] text-white">India</option>
                      <option className="bg-[#111111] text-white">United States</option>
                      <option className="bg-[#111111] text-white">Singapore</option>
                      <option className="bg-[#111111] text-white">United Kingdom</option>
                      <option className="bg-[#111111] text-white">Germany</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">Primary Language</label>
                    <select 
                      value={editLanguage}
                      onChange={(e) => setEditLanguage(e.target.value)}
                      className="w-full bg-[#09090B] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                    >
                      <option className="bg-[#111111] text-white">English</option>
                      <option className="bg-[#111111] text-white">Hindi</option>
                      <option className="bg-[#111111] text-white">Spanish</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 active:scale-98 transition-all"
                  >
                    <Save className="w-4 h-4 text-white" />
                    <span>Save Founder Matrix</span>
                  </button>
                </div>
              </div>

              {/* Password credentials rotation */}
              <div className="glass-panel rounded-3xl p-6 border border-purple-500/10 bg-white/95 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-mono font-extrabold text-slate-400 block uppercase tracking-wider">
                    CREDENTIALS SECURE ROTATION
                  </span>
                  <Lock className="w-4 h-4 text-[#7C3AED]" />
                </div>

                <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"} 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#7C3AED] pr-10"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">New Password</label>
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 block uppercase">Confirm New Password</label>
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2 flex justify-end">
                    <button 
                      type="submit"
                      className="px-4 py-2.5 bg-[#050510] text-white text-[10px] font-display font-black uppercase tracking-wider rounded-xl cursor-pointer hover:bg-slate-900 shadow-sm"
                    >
                      Rotate Passkey
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Right Hand: 2FA + Notifications + Theme Panel */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Interactive Two-Factor Authentication (2FA) */}
              <div className="glass-panel rounded-3xl p-5 border border-purple-500/10 bg-white/95 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 block uppercase tracking-wider">
                  TWO-FACTOR AUTHENTICATION (2FA)
                </span>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <Smartphone className="w-4 h-4 text-[#7C3AED]" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">SLA Secure 2FA</span>
                      <span className={`text-[9.5px] font-mono font-extrabold uppercase ${editTwoFactor ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {editTwoFactor ? '● SECURED ACTIVE' : '● DEACTIVATED'}
                      </span>
                    </div>
                  </div>
                  {/* Custom interactive switch */}
                  <button 
                    onClick={() => {
                      setEditTwoFactor(!editTwoFactor);
                      notify(editTwoFactor ? "Deactivated Two-Factor parameters." : "Sovereign 2FA activated successfully. Recovery codes initialized.");
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${editTwoFactor ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-[3.5px] transition-transform ${editTwoFactor ? 'right-[4px]' : 'left-[4px]'}`} />
                  </button>
                </div>

                {editTwoFactor && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-3"
                  >
                    <span className="text-[9px] font-mono text-emerald-800 block uppercase font-bold">printable backup recovery keys</span>
                    <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono text-slate-700">
                      {backupCodes.map(code => (
                        <div key={code} className="p-1.5 bg-white rounded border border-emerald-100 text-center font-bold">
                          {code}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(backupCodes.join('\n'));
                        notify("Copied secure 2FA recovery backup codes.");
                      }}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] font-mono font-bold uppercase tracking-wider rounded-lg text-center"
                    >
                      Copy codes
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Notification Toggles */}
              <div className="glass-panel rounded-3xl p-5 border border-purple-500/10 bg-white/95 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 block uppercase tracking-wider">
                  SYSTEM COMMUNICATIONS ALERTS
                </span>

                <div className="space-y-3">
                  {[
                    { state: editNotifEmail, setter: setEditNotifEmail, label: "Email notifications", desc: "SLA compliance reports and milestones" },
                    { state: editNotifPush, setter: setEditNotifPush, label: "Realtime push alerts", desc: "Sandbox compiler events and diagnostics" },
                    { state: editNotifSms, setter: setEditNotifSms, label: "SMS dispatch", desc: "Sovereign login security updates" }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-all">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{notif.label}</span>
                        <span className="text-[9.5px] text-slate-400">{notif.desc}</span>
                      </div>
                      <button 
                        onClick={() => notif.setter(!notif.state)}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${notif.state ? 'bg-[#7C3AED]' : 'bg-slate-200'}`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${notif.state ? 'right-[3px]' : 'left-[3px]'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Audio Settings Override */}
              <div className="glass-panel rounded-3xl p-5 border border-purple-500/10 bg-white/95 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 block uppercase tracking-wider">
                  COGNITIVE AUDIO SETTINGS
                </span>

                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-all font-sans">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl border transition-all ${isMuted ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-cyan-50 border-cyan-100 text-cyan-500'}`}>
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">UI Sound Effects</span>
                      <span className="text-[9.5px] text-slate-400">Play responsive clicks, hover and success tones</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const nextMuted = soundManager.toggleMute();
                      setIsMuted(nextMuted);
                      if (!nextMuted) {
                        soundManager.playClick();
                      }
                      notify(nextMuted ? "Audio feedback deactivated." : "Acoustic audio feedback synchronized.");
                    }}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${!isMuted ? 'bg-[#22D3EE]' : 'bg-slate-200'}`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${!isMuted ? 'right-[3px]' : 'left-[3px]'}`} />
                  </button>
                </div>
              </div>

              {/* Theme Settings Override */}
              <div className="glass-panel rounded-3xl p-5 border border-purple-500/10 bg-white/95 shadow-sm space-y-4">
                <span className="text-[10px] font-mono font-extrabold text-slate-400 block uppercase tracking-wider">
                  VISUAL PRESENTATION THEME
                </span>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: ShieldCheck }
                  ].map(thm => {
                    const TIcon = thm.icon;
                    const isSel = editTheme === thm.id;
                    return (
                      <button
                        key={thm.id}
                        onClick={() => {
                          setEditTheme(thm.id);
                          notify(`Render theme shifted to ${thm.label}.`);
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSel 
                            ? 'border-[#7C3AED] bg-[#7C3AED]/5 text-[#7C3AED] font-bold' 
                            : 'border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <TIcon className="w-4 h-4" />
                        <span className="text-[10px] font-mono">{thm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 3: SAAS AI ANALYTICS */}
        {activeTab === 'usage' && (
          <motion.div 
            key="usage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { label: 'Prompt queries compiled', val: '2,410', limit: '5,000 / mo', icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
              { label: 'Images Synthesized', val: '142', limit: '300 / mo', icon: FileText, color: 'text-cyan-600 bg-cyan-50' },
              { label: 'API tokens processed', val: '142.5K', limit: '500K / mo', icon: Database, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Active VM cycles utilized', val: '24.2h', limit: '50h / mo', icon: Code2, color: 'text-orange-600 bg-orange-50' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass-panel rounded-3xl p-6 border border-purple-500/10 bg-white/95 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block leading-relaxed max-w-[130px]">{stat.label}</span>
                    <Icon className={`w-5 h-5 ${stat.color.split(' ')[0]}`} />
                  </div>
                  <div className="mt-6">
                    <span className="text-3xl font-display font-black text-slate-800 block">{stat.val}</span>
                    <span className="text-[9.5px] font-mono text-slate-500 block mt-1">Allocation limit: {stat.limit}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* TAB 4: SECURE ACCESS & API KEYS */}
        {activeTab === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* API Keys Panel */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-purple-500/10 bg-white/95 space-y-6 shadow-sm">
              <div>
                <h3 className="text-md font-display font-black text-slate-800 flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#22D3EE]" />
                  <span>KRONEX Developer Sandbox Keys</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Use these security tokens to securely query the KRONEX intelligence models externally.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-400 block uppercase mb-1.5">LIVE SECRET KEY (SLA BOUNDS)</label>
                  <div className="flex gap-2">
                    <div className="flex-grow bg-[#05050A] border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-teal-400 select-all truncate block shadow-inner">
                      {showApiKey ? apiKey : '•'.repeat(45)}
                    </div>
                    <button 
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm"
                    >
                      {showApiKey ? 'Hide' : 'Reveal'}
                    </button>
                    <button 
                      onClick={copyApiKey}
                      className="px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                      <span className="hidden sm:inline">Copy</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#7C3AED]/5 border border-[#7C3AED]/10 rounded-xl text-[10.5px] font-mono text-slate-500 flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5" />
                  <p>Never commit secret tokens directly inside standard browser source files. Secure environment proxies should be routed via active node gateways instead.</p>
                </div>
              </div>
            </div>

            {/* Subscription & Billing */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-purple-500/10 bg-white/95 space-y-6 shadow-sm">
              <div>
                <h3 className="text-md font-display font-black text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#22D3EE]" />
                  <span>Active Subscription Matrix</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Administer standard billing telemetry and quota thresholds here.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                  <div>
                    <span className="block text-[9px] font-mono text-slate-400 uppercase">ACTIVE PLAN:</span>
                    <span className="text-slate-800 font-bold">{subscription}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20">Active SLA</span>
                </div>

                <div className="flex justify-between text-xs font-mono pt-2">
                  <span className="text-slate-500">Billing cycle:</span>
                  <span className="text-slate-800 font-bold">Monthly (Next: Aug 19)</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Linked instrument:</span>
                  <span className="text-slate-800 font-bold">Visa ending in •••• 4022</span>
                </div>

                <button 
                  onClick={() => notify("Redirecting to Stripe Billing Gateway telemetry secure portal...")}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-250 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-sm"
                >
                  Manage Billing Invoices
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: SOVEREIGN COMMS & NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <motion.div 
            key="notifications"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-800">Active Telemetry Alert logs</span>
              <button 
                onClick={() => {
                  setNotifications([]);
                  notify("Cleared notification history.");
                }}
                className="text-xs text-red-500 hover:underline cursor-pointer"
              >
                Clear All Alerts
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center p-8 text-slate-400 space-y-2 bg-white rounded-3xl border border-slate-150 shadow-inner">
                <Bell className="w-10 h-10 mx-auto text-slate-200" />
                <span className="text-xs font-semibold block">All communications resolved</span>
                <span className="text-[10px]">No unread system telemetries or registry alerts currently pending.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notice) => (
                  <div key={notice.id} className="p-4 bg-white border border-slate-200 hover:border-[#7C3AED]/20 rounded-2xl flex items-start justify-between gap-4 transition-all shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 block">{notice.title}</span>
                        <span className="text-[8.5px] font-mono text-slate-400">{notice.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{notice.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleClearNotice(notice.id)}
                      className="text-xs text-slate-400 hover:text-slate-800 p-1 shrink-0 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* Luxury Signature Bottom Block */}
      <div className="mt-16 pt-8 border-t border-slate-200/60 text-center space-y-2">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-sans">
          Made with ❤️ by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] font-extrabold uppercase tracking-wide">Shashvat</span>
        </p>
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          KRONEX AI v2.0 // Ultra version is here
        </p>
      </div>

      {/* Floating Success Alert Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white border border-white/10 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-mono font-bold animate-fade-in"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Inline component for Cpu component rendering to avoid missing import
function CpuComponent(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3" />
      <path d="M15 1v3" />
      <path d="M9 20v3" />
      <path d="M15 20v3" />
      <path d="M20 9h3" />
      <path d="M20 15h3" />
      <path d="M1 9h3" />
      <path d="M1 15h3" />
    </svg>
  );
}
