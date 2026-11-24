import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LandingFeatures from './components/LandingFeatures';
import LandingTestimonials from './components/LandingTestimonials';
import LandingPricingFAQ from './components/LandingPricingFAQ';
import VibeCodingWorkspace from './components/VibeCodingWorkspace';
import CertificateShowcase from './components/CertificateShowcase';
import LoginInterface from './components/LoginInterface';
import Integrations from './components/Integrations';
import CameraToolsModal from './components/CameraToolsModal';
import PasskeyManagerModal from './components/PasskeyManagerModal';
import { auth, onAuthStateChanged, logoutFirebase } from './lib/firebase';

// Dashboard / App Components
import TutorialWorkspace from './components/TutorialWorkspace';
import InteractiveCourses from './components/InteractiveCourses';
import ResourceLibrary from './components/ResourceLibrary';
import CommunityForum from './components/CommunityForum';
import ProgressTracker from './components/ProgressTracker';

// Premium Sections
import AIAgentPlatform from './components/AIAgentPlatform';
import AIPlayground from './components/AIPlayground';
import VoiceConversion from './components/VoiceConversion';
import FuturisticBackground from './components/FuturisticBackground';
import LearningPath from './components/LearningPath';
import CodexSection from './components/CodexSection';
import ProfileDashboard from './components/ProfileDashboard';
import SimpleMobileChatView from './components/SimpleMobileChatView';
import ASMRBackground from './components/ui/asmr-background';
import SplashScreen from './components/SplashScreen';
import CursorGlow from './components/CursorGlow';
import FloatingAssistantDock from './components/FloatingAssistantDock';
import DashboardOSPreview from './components/DashboardOSPreview';
import WorkflowBuilder from './components/workflow/WorkflowBuilder';

import { UserProgress } from './types';
import { TUTORIALS, ACHIEVEMENTS } from './data';
import { soundManager } from './utils/sound';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, BrainCircuit, Github, Twitter, Linkedin, 
  Slack, ArrowRight, Compass, Shield, Heart, Bot,
  Mail, Phone, Instagram, MapPin, Search, Code, Terminal, User, Trophy, Activity, Award, MessageSquare, BookOpen, X, ChevronRight, CheckCircle2, Volume2, Bell, ShieldAlert
} from 'lucide-react';

// Interactive Command Palette Component (Ctrl+K)
function CommandPalette({ 
  isOpen, 
  onClose, 
  onNavigate,
  onLaunchVibe 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onNavigate: (view: 'landing' | 'dashboard', tab?: string) => void;
  onLaunchVibe: () => void;
}) {
  const [search, setSearch] = useState('');
  
  const commands = [
    { label: 'Go to Enterprise Workflow Builder', desc: 'Visual node-based AI agent workflow automation builder', tab: 'workflow-builder', view: 'dashboard', icon: Sparkles },
    { label: 'Go to AI Agents Hub', desc: 'Deploy & converse with autonomous cognitive agents', tab: 'ai-agents', view: 'dashboard', icon: Bot },
    { label: 'Go to AI Playground', desc: 'Interact with Gemini & Advanced Engines', tab: 'playground', view: 'dashboard', icon: Sparkles },
    { label: 'Go to Coding Sandbox', desc: 'Write code & prompt files interactively', tab: 'tutorials', view: 'dashboard', icon: Terminal },
    { label: 'Launch Vibe Coding Studio', desc: 'Autonomous coding with real-time compilers', action: onLaunchVibe, icon: BrainCircuit },
    { label: 'Go to AI Codex Code Library', desc: 'Pre-engineered system prompts & models', tab: 'codex', view: 'dashboard', icon: Code },
    { label: 'Go to Profile Dashboard', desc: 'Check levels, streaks, and certificates', tab: 'profile-dashboard', view: 'dashboard', icon: User },
    { label: 'Go to Learning Path Masterclass', desc: 'Interactive lessons & modules', tab: 'learning-path', view: 'dashboard', icon: Trophy },
    { label: 'Go to Courses Library', desc: 'Browse syllabus and syllabus certificates', tab: 'courses', view: 'dashboard', icon: Award },
    { label: 'Go to Blueprint Library', desc: 'Download components & prompt snippets', tab: 'resources', view: 'dashboard', icon: BookOpen },
    { label: 'Go to Community Forums', desc: 'Discuss AI development with colleagues', tab: 'forum', view: 'dashboard', icon: MessageSquare },
    { label: 'Go to Progress Tracker', desc: 'Track XP gains and unlocked achievements', tab: 'progress', view: 'dashboard', icon: Activity },
    { label: 'Go to Landing Page', desc: 'Return to KRONEX main presentation', tab: '', view: 'landing', icon: Compass }
  ];

  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 bg-slate-950/85 backdrop-blur-md flex items-start justify-center pt-24 px-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#101828]/95 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Glowing border trace */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] via-[#00E5FF] to-[#00FFA3]" />
        
        {/* Search header */}
        <div className="flex items-center space-x-3 px-4 py-3.5 border-b border-white/5">
          <Search className="w-5 h-5 text-[#00E5FF]" />
          <input 
            type="text" 
            placeholder="Type a command or search workspace... (e.g. playground)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 text-sm outline-none"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Commands list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (cmd.action) {
                      cmd.action();
                    } else if (cmd.view) {
                      onNavigate(cmd.view as any, cmd.tab);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#7C3AED]/15 text-left transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#7C3AED]/20 group-hover:border-[#7C3AED]/30 transition-all">
                      <Icon className="w-4 h-4 text-[#00E5FF] group-hover:text-white" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors">{cmd.label}</span>
                      <span className="block text-[10px] text-slate-400">{cmd.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands found. Try searching for "playground" or "sandbox".
            </div>
          )}
        </div>

        {/* Footer badges */}
        <div className="bg-slate-950/40 px-4 py-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center space-x-1">
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↑↓</span>
            <span>to navigate</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ml-2">ESC</span>
            <span>to close</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↵ Enter</span>
            <span>to execute</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// $1 Billion Transparent Glass Dock Component (anchored at bottom center)
function GlassDock({ 
  currentTab, 
  onNavigate,
  onLaunchVibe 
}: { 
  currentTab: string; 
  onNavigate: (view: 'landing' | 'dashboard', tab?: string) => void;
  onLaunchVibe: () => void;
}) {
  const dockItems = [
    { id: 'ai-agents', label: 'AI Agents', icon: Bot },
    { id: 'playground', label: 'AI Playground', icon: Sparkles },
    { id: 'voice-conversion', label: 'Voice Conversion', icon: Volume2 },
    { id: 'tutorials', label: 'Sandbox', icon: Terminal },
    { id: 'codex', label: 'AI Codex', icon: Code },
    { id: 'profile-dashboard', label: 'Profile DB', icon: User },
    { id: 'forum', label: 'Forums', icon: MessageSquare },
    { id: 'progress', label: 'Progress', icon: Activity },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center space-x-4 bg-[#101828]/70 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group hover:scale-102 hover:border-[#7C3AED]/40 transition-all duration-300">
      {/* Visual background gradient reflection inside Dock */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED]/5 to-[#00E5FF]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Dock navigation links */}
      {dockItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate('dashboard', item.id)}
            className="relative p-2.5 rounded-full transition-all group/item flex items-center justify-center cursor-pointer animate-float-robot"
            style={{
              background: isActive ? 'linear-gradient(135deg, rgba(124, 92, 255, 0.2), rgba(0, 229, 255, 0.2))' : 'transparent',
              border: isActive ? '1px solid rgba(124, 92, 255, 0.4)' : '1px solid transparent'
            }}
          >
            <Icon 
              className="w-5 h-5 transition-transform duration-300 group-hover/item:-translate-y-1.5" 
              style={{ color: isActive ? '#00E5FF' : '#A1A8C3' }}
            />
            {/* Animated tooltip */}
            <span className="absolute bottom-14 opacity-0 group-hover/item:opacity-100 pointer-events-none scale-95 group-hover/item:scale-100 bg-[#101828] border border-white/10 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-xl backdrop-blur-md transition-all duration-300 whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Vertical separating track line */}
      <div className="h-5 w-[1px] bg-white/15" />

      {/* Autonomous Vibe studio launcher */}
      <button
        onClick={onLaunchVibe}
        className="relative p-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#00E5FF] text-white flex items-center justify-center cursor-pointer group/item hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:scale-110 transition-all"
      >
        <BrainCircuit className="w-5 h-5 text-white animate-pulse" />
        <span className="absolute bottom-14 opacity-0 group-hover/item:opacity-100 pointer-events-none scale-95 group-hover/item:scale-100 bg-[#101828] border border-white/10 text-[#00FFA3] font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-xl backdrop-blur-md transition-all duration-300 whitespace-nowrap">
          Vibe Coding
        </span>
      </button>
    </div>
  );
}

const STORAGE_KEY = 'kronex_ai_progress';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 3,
  completedLessons: [],
  unlockedAchievements: [],
  savedResources: [],
  registeredCourses: ['ai-prompt-engineering'] // auto-registered for first course to look warm
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('tutorials');
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [isVibeStudioOpen, setIsVibeStudioOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isPasskeyOpen, setIsPasskeyOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar: string; role: string; uid?: string } | null>(() => {
    try {
      const stored = localStorage.getItem('kronex_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { name: 'THE SHASHVAT', email: 'st0065622@gmail.com', avatar: '/src/assets/images/shashvat_profile_1785747313447.jpg', role: 'Creator & Lead Architect' };
  });

  // Persistent Firebase Auth state management
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Sovereign Member',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || '👨‍💻',
          role: firebaseUser.email?.toLowerCase().includes('shashvat') ? 'Creator & Lead Architect' : 'Sovereign AI Member',
          uid: firebaseUser.uid
        };
        setCurrentUser(userData);
        localStorage.setItem('kronex_user', JSON.stringify(userData));
      }
    });
    return () => unsubscribe();
  }, []);
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('kronex_theme');
      if (saved === 'light') return 'light';
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      if (theme === 'light') {
        document.body.classList.add('light-theme');
        localStorage.setItem('kronex_theme', 'light');
      } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('kronex_theme', 'dark');
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [theme]);
  
  // Track mouse coordinates globally and register Ctrl+K command palette shortcut
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Load progress from local storage if available
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage failed to load', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Sync state with local storage
  const handleUpdateProgress = (newProgress: Partial<UserProgress>) => {
    setProgress((prev) => {
      const updated = { ...prev, ...newProgress };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage failed to save', e);
      }
      return updated;
    });
  };

  // Define Toast Notification layout
  interface ToastNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'lesson' | 'achievement' | 'level';
    title: string;
    description: string;
    color?: string;
  }

  interface GlobalNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'lesson' | 'achievement' | 'level';
    title: string;
    description: string;
    date: string;
    read: boolean;
  }

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [notificationsHistory, setNotificationsHistory] = useState<GlobalNotification[]>([
    { id: 'n-1', type: 'info', title: 'System Synchronized', description: 'Core neural network pathways successfully mapped with 0.08ms latency.', date: 'Just now', read: false },
    { id: 'n-2', type: 'success', title: 'KRONEX Mainnet Deployed', description: 'Version 2.0 compiler nodes are live globally across 24 edge zones.', date: '3 mins ago', read: false },
    { id: 'n-3', type: 'warning', title: 'High Memory Influx', description: 'Interactive AI sandbox processing requests surged by 150%. No throttling applied.', date: '1 hour ago', read: false },
  ]);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const prevProgressRef = useRef<UserProgress | null>(null);

  // Helper to dynamically check achievement IDs based on current progress fields
  const getUnlockedAchievementIds = (p: UserProgress) => {
    const ids: string[] = [];
    
    // 1. First Contact (First step)
    if (p.completedLessons.length >= 1) {
      ids.push('ach-first-step');
    }
    
    // 2. Prompt Alchemist (Prompt wizard)
    const promptLessons = p.completedLessons.filter(id => id.startsWith('prompting'));
    if (promptLessons.length >= 2) {
      ids.push('ach-prompt-wizard');
    }
    
    // 3. Streak Novitiate
    if (p.streak >= 3) {
      ids.push('ach-streak-builder');
    }
    
    // 4. Voice of the Nebula (Forum post)
    if (p.xp >= 150) {
      ids.push('ach-forum-post');
    }
    
    return ids;
  };

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Append to global history
    const historyItem: GlobalNotification = {
      id,
      type: toast.type,
      title: toast.title,
      description: toast.description,
      date: 'Just now',
      read: false
    };
    setNotificationsHistory(prev => [historyItem, ...prev]);

    // Play corresponding sound if it is a general custom toast type
    if (toast.type === 'success') {
      soundManager.playSuccess();
    } else if (toast.type === 'error') {
      soundManager.playError();
    } else if (toast.type === 'warning') {
      soundManager.playWarning();
    } else if (toast.type === 'info') {
      soundManager.playNotification();
    }

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    // Set initial reference on first load and skip triggering toasts
    if (!prevProgressRef.current) {
      prevProgressRef.current = progress;
      return;
    }

    const prev = prevProgressRef.current;
    
    // Check for new completed lessons
    const newCompletedLessons = progress.completedLessons.filter(
      id => !prev.completedLessons.includes(id)
    );

    newCompletedLessons.forEach(lessonId => {
      const tutorial = TUTORIALS.find(t => t.id === lessonId);
      const title = tutorial ? tutorial.title : 'AI Lesson';
      
      addToast({
        type: 'lesson',
        title: 'Lesson Completed!',
        description: `You've passed "${title}" and earned +100 XP!`,
        color: '#00FFA3' // bright tech emerald
      });
      soundManager.playSuccess();
    });

    // Check for newly unlocked achievements
    const prevUnlocked = getUnlockedAchievementIds(prev);
    const currUnlocked = getUnlockedAchievementIds(progress);

    const newlyUnlockedAchievements = currUnlocked.filter(
      id => !prevUnlocked.includes(id)
    );

    newlyUnlockedAchievements.forEach(achId => {
      const ach = ACHIEVEMENTS.find(a => a.id === achId);
      if (ach) {
        addToast({
          type: 'achievement',
          title: 'Achievement Unlocked!',
          description: `${ach.title}: ${ach.description}`,
          color: '#F59E0B' // gold / amber
        });
        setTimeout(() => {
          soundManager.playNotification();
        }, 300);
      }
    });

    // Check for level ups
    if (progress.level > prev.level) {
      addToast({
        type: 'level',
        title: 'Level Up!',
        description: `Congratulations! You've reached Level ${progress.level}!`,
        color: '#7C3AED' // purple
      });
      setTimeout(() => {
        soundManager.playNotification();
      }, 600);
    }

    // Update reference
    prevProgressRef.current = progress;
  }, [progress]);

  // Automatically navigate inside dashboard or slide down to pricing
  const handleNavigate = (view: 'landing' | 'dashboard', tab?: string) => {
    setCurrentView(view);
    if (tab) {
      setCurrentTab(tab);
    }
    // Scroll to top upon transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans selection:bg-[#7C3AED]/20 relative overflow-hidden bg-[#050510] text-white">
      
      {/* Animated Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Premium ASMR Animated Background */}
      <ASMRBackground />

      {/* Mouse Cursor Follower Glow */}
      <CursorGlow />

      {/* Premium Futuristic Background (Animated Canvas Nodes and Aurora) */}
      {theme === 'dark' && <FuturisticBackground />}

      {/* Dynamic Header */}
      <Navbar 
        currentView={currentView}
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onLaunchVibeStudio={() => setIsVibeStudioOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        onCameraClick={() => setIsCameraOpen(true)}
        onPasskeyClick={() => setIsPasskeyOpen(true)}
        user={currentUser}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        notifications={notificationsHistory as any}
        unreadNotificationsCount={notificationsHistory.filter(n => !n.read).length}
        onDismissNotification={(id) => setNotificationsHistory(prev => prev.filter(n => n.id !== id))}
        onMarkAllNotificationsRead={() => setNotificationsHistory(prev => prev.map(n => ({ ...n, read: true })))}
        onClearAllNotifications={() => setNotificationsHistory([])}
        onLogout={() => {
          logoutFirebase();
          setCurrentUser(null);
          localStorage.removeItem('kronex_user');
        }}
      />

      {/* Primary Route/View Controller */}
      <main className="flex-grow">
        {currentView === 'landing' ? (
          /* ====================================================
             1. THE PREMIUM MULTI-MILLION-DOLLAR LANDING PAGE
             ==================================================== */
          <div id="landing-page-root">
            <Hero 
              onExploreCourses={() => {
                const element = document.getElementById('courses');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onLaunchPlatform={() => handleNavigate('dashboard', 'tutorials')}
              onLaunchVibeStudio={() => setIsVibeStudioOpen(true)}
            />
            
            <LandingTestimonials 
              onEnrollCourse={(courseId) => {
                // Pre-enroll in course and launch dashboard directly
                if (!progress.registeredCourses.includes(courseId)) {
                  handleUpdateProgress({
                    registeredCourses: [...progress.registeredCourses, courseId]
                  });
                }
                handleNavigate('dashboard', 'courses');
              }}
            />

            <LandingFeatures />

            <DashboardOSPreview onLaunchDashboard={(tab) => handleNavigate('dashboard', tab)} />

            <Integrations />

            <CertificateShowcase />

            <LandingPricingFAQ 
              onLaunchPlatform={() => handleNavigate('dashboard', 'tutorials')}
            />

          </div>
        ) : (
          /* ====================================================
             2. THE IMMERSIVE STUDENTS LEARNING PORTAL (DASHBOARD)
             ==================================================== */
          <div id="dashboard-portal-root" className={`bg-brand-background min-h-screen ${
            currentTab === 'workflow-builder' || currentTab === 'codex' 
              ? 'pt-16 pb-0 flex flex-col h-screen overflow-hidden' 
              : 'pt-24 pb-16'
          }`}>
            
            {/* Dashboard Sub Tab Renderer */}
            {currentTab === 'workflow-builder' && (
              <WorkflowBuilder />
            )}

            {currentTab === 'simple-chat' && (
              <SimpleMobileChatView onBack={() => handleNavigate('dashboard', 'ai-agents')} />
            )}

            {currentTab === 'ai-agents' && (
              <AIAgentPlatform onNavigateTab={(tab) => handleNavigate('dashboard', tab)} />
            )}

            {currentTab === 'playground' && (
              <AIPlayground />
            )}

            {currentTab === 'learning-path' && (
              <LearningPath 
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {currentTab === 'voice-conversion' && (
              <VoiceConversion />
            )}

            {currentTab === 'codex' && (
              <CodexSection />
            )}

            {currentTab === 'profile-dashboard' && (
              <ProfileDashboard 
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {currentTab === 'tutorials' && (
              <TutorialWorkspace 
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {currentTab === 'courses' && (
              <InteractiveCourses 
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {currentTab === 'resources' && (
              <ResourceLibrary 
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {currentTab === 'forum' && (
              <CommunityForum 
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressTracker 
                progress={progress}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

          </div>
        )}
      </main>

      {/* ====================================================
         3. FOOTER (ONLY ON LANDING FOR PERFECT PRESENTATION)
         ==================================================== */}
      {currentView === 'landing' && (
        <footer id="main-footer" className="bg-[#050505] text-white pt-20 pb-12 border-t border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 mb-16">
              
              {/* Brand Col */}
              <div className="md:col-span-4 space-y-5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-display font-black text-lg tracking-tight">
                    KRONEX<span className="text-[#7C3AED]">AI</span>
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed">
                  KRONEX AI is a modern SaaS platform featuring automated compilers, prompt sandboxes, certificate protocols, and production-grade integration pipelines.
                </p>
                <div className="p-4 rounded-xl bg-[#09090B] border border-white/[0.08] text-xs italic text-[#A1A1AA] leading-relaxed font-sans">
                  "KRONEX AI is built to empower creators, developers, and innovators with next-generation AI tools to build the future."
                </div>
                <div className="flex space-x-4 pt-2">
                  <a href="#twitter" className="text-white/40 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
                  <a href="#github" className="text-white/40 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
                  <a href="#linkedin" className="text-white/40 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
                  <a href="#slack" className="text-white/40 hover:text-white transition-colors"><Slack className="w-4 h-4" /></a>
                </div>
              </div>

              {/* QUICK LINKS Col */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">QUICK LINKS</h4>
                <ul className="space-y-2.5 text-xs text-white/50">
                  <li><a href="#" className="hover:text-[#22D3EE] transition-colors">Home</a></li>
                  <li><a href="#success-stories" className="hover:text-[#22D3EE] transition-colors">About Us</a></li>
                  <li><a href="#features" className="hover:text-[#22D3EE] transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-[#22D3EE] transition-colors">Pricing</a></li>
                  <li><a href="#certificates" className="hover:text-[#22D3EE] transition-colors">Docs</a></li>
                  <li><a href="#connect" className="hover:text-[#22D3EE] transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Col 2 */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">Academies</h4>
                <ul className="space-y-2.5 text-xs text-white/50">
                  <li><a href="#courses" className="hover:text-white transition-colors">Prompting Masterclass</a></li>
                  <li><a href="#courses" className="hover:text-white transition-colors">Python for Scientists</a></li>
                  <li><a href="#courses" className="hover:text-white transition-colors">Next.js AI Orchestration</a></li>
                  <li><a href="#courses" className="hover:text-white transition-colors">UI UX Luxury Systems</a></li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">Platform</h4>
                <ul className="space-y-2.5 text-xs text-white/50">
                  <li><button onClick={() => handleNavigate('dashboard', 'tutorials')} className="hover:text-white transition-colors cursor-pointer text-left">Interactive Sandbox</button></li>
                  <li><button onClick={() => handleNavigate('dashboard', 'resources')} className="hover:text-white transition-colors cursor-pointer text-left">BLUEPRINT LIBRARY</button></li>
                  <li><button onClick={() => handleNavigate('dashboard', 'forum')} className="hover:text-white transition-colors cursor-pointer text-left">Student forums</button></li>
                  <li><button onClick={() => handleNavigate('dashboard', 'progress')} className="hover:text-white transition-colors cursor-pointer text-left">Progress tracker</button></li>
                </ul>
              </div>

              {/* CONNECT WITH US Col */}
              <div id="connect" className="space-y-4 md:col-span-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">CONNECT WITH US</h4>
                <ul className="space-y-3 text-xs text-white/50">
                  <li className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                    <a href="mailto:st0065622@gmail.com" className="hover:text-[#22D3EE] transition-colors break-all">
                      st0065622@gmail.com
                    </a>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                    <a href="tel:+917869261291" className="hover:text-[#22D3EE] transition-colors">
                      +91 7869261291
                    </a>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Instagram className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                    <a 
                      href="https://instagram.com/kronexaiindiaofficial" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-[#22D3EE] transition-colors"
                    >
                      @kronexaiindiaofficial
                    </a>
                  </li>
                  <li className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Mana Basti, Raipur, Chhattisgarh, India
                    </span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Base Bar */}
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-white/40">
              <p>© 2026 KRONEX AI. All Rights Reserved.</p>
              <div className="flex items-center space-x-1.5">
                <span>Designed with</span>
                <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" />
                <span>for modern AI explorers.</span>
              </div>
            </div>

          </div>
        </footer>
      )}

      {isVibeStudioOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <VibeCodingWorkspace onClose={() => setIsVibeStudioOpen(false)} />
        </div>
      )}

      {isLoginOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md my-auto">
            <LoginInterface 
              onClose={() => setIsLoginOpen(false)} 
              onSuccess={(userData) => {
                if (userData) {
                  setCurrentUser(userData);
                }
                setIsLoginOpen(false);
                addToast({
                  type: 'success',
                  title: 'Cognitive Session Verified',
                  description: `Welcome back, ${userData?.name || 'Operator'}! Biometric credentials authorized.`,
                  color: '#22D3EE'
                });
                handleNavigate('dashboard', 'tutorials');
              }}
            />
          </div>
        </div>
      )}

      {/* $1 Billion Searchable Command Palette Overlay */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onLaunchVibe={() => setIsVibeStudioOpen(true)}
      />

      {/* Premium Apple-style Glass Dock Navigation */}
      {currentView === 'dashboard' && (
        <GlassDock 
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onLaunchVibe={() => setIsVibeStudioOpen(true)}
        />
      )}

      {/* Premium Floating Toasts Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden p-4 rounded-2xl flex items-start space-x-3.5 border shadow-2xl backdrop-blur-xl transition-all duration-300 pointer-events-auto group ${
                theme === 'light' 
                  ? 'bg-white/95 border-slate-200/80 text-slate-900 shadow-slate-200/50' 
                  : 'bg-[#0B0F19]/95 border-white/10 text-white shadow-black/80'
              }`}
              style={{
                boxShadow: theme === 'light'
                  ? '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 16px -6px rgba(0,0,0,0.05)'
                  : `0 10px 30px -10px rgba(0,0,0,0.7), 0 0 20px -5px ${toast.color || '#7C3AED'}20`
              }}
            >
              {/* Colored top indicator */}
              <div 
                className="absolute top-0 left-0 right-0 h-[2.5px]" 
                style={{
                  background: `linear-gradient(90deg, ${
                    toast.type === 'success' ? '#10B981' : 
                    toast.type === 'error' ? '#EF4444' : 
                    toast.type === 'warning' ? '#F59E0B' : 
                    toast.type === 'info' ? '#22D3EE' : 
                    toast.color || '#7C3AED'
                  } 0%, transparent 100%)`
                }}
              />

              {/* Icon frame */}
              <div 
                className="p-2 rounded-xl shrink-0 flex items-center justify-center transition-all duration-500"
                style={{
                  background: theme === 'light'
                    ? `${toast.color || '#7C3AED'}0d`
                    : `${toast.color || '#7C3AED'}15`,
                  boxShadow: `0 0 12px -3px ${toast.color || '#7C3AED'}25`
                }}
              >
                {(toast.type === 'lesson' || toast.type === 'success') && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                {toast.type === 'achievement' && <Trophy className="w-5 h-5 text-amber-400" />}
                {toast.type === 'level' && <Award className="w-5 h-5 text-purple-400" />}
                {toast.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />}
                {toast.type === 'warning' && <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />}
                {toast.type === 'info' && <Bell className="w-5 h-5 text-cyan-400" />}
              </div>

              {/* Details */}
              <div className="flex-grow min-w-0 pr-2">
                <h4 className="font-display font-black text-sm tracking-tight leading-none mb-1.5 flex items-center text-inherit">
                  {toast.title}
                  {toast.type === 'achievement' && (
                    <span className="ml-1.5 text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      UNLOCKED
                    </span>
                  )}
                  {toast.type === 'level' && (
                    <span className="ml-1.5 text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
                      RANK UP
                    </span>
                  )}
                </h4>
                <p className={`text-xs leading-relaxed font-sans ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                }`}>
                  {toast.description}
                </p>
              </div>

              {/* Close action */}
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className={`p-1 rounded-lg shrink-0 transition-colors self-center cursor-pointer ${
                  theme === 'light' 
                    ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Ticking loading line */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-[2px] opacity-80"
                style={{ backgroundColor: toast.color || '#7C3AED' }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sliding Notification History Panel */}
      <AnimatePresence>
        {isNotificationDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsNotificationDrawerOpen(false);
                soundManager.playClick();
              }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-[#0b1020]/95 border-l border-white/10 z-50 shadow-2xl flex flex-col backdrop-blur-2xl"
            >
              <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-400/20 text-cyan-400">
                    <Bell className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-black text-slate-100 uppercase tracking-wider">Cognitive Notifications</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">System action history logs</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setNotificationsHistory([]);
                      soundManager.playWarning();
                    }}
                    className="p-1.5 rounded-lg text-[10px] uppercase font-mono font-bold text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Clear Logs
                  </button>
                  <button 
                    onClick={() => {
                      setIsNotificationDrawerOpen(false);
                      soundManager.playClick();
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification feed list */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {notificationsHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                    <Shield className="w-12 h-12 text-slate-700 animate-pulse" />
                    <div>
                      <span className="text-xs font-bold text-slate-400 block">System Logs Clean</span>
                      <span className="text-[10px] text-slate-500 max-w-[240px] block mt-1 leading-relaxed">
                        There are no current actions or level completions logged in your local cognitive session.
                      </span>
                    </div>
                  </div>
                ) : (
                  notificationsHistory.map((item) => {
                    // Decide background, border and glow based on type
                    let borderClass = 'border-white/5 bg-white/[0.02]';
                    let glowClass = '';
                    let dotColor = 'bg-cyan-400';
                    let typeLabel = 'INFO';

                    if (item.type === 'success' || item.type === 'lesson') {
                      borderClass = 'border-emerald-500/10 bg-emerald-500/[0.02]';
                      glowClass = 'shadow-[inset_0_0_12px_rgba(16,185,129,0.04)]';
                      dotColor = 'bg-emerald-400';
                      typeLabel = 'SUCCESS';
                    } else if (item.type === 'error') {
                      borderClass = 'border-red-500/10 bg-red-500/[0.02]';
                      glowClass = 'shadow-[inset_0_0_12px_rgba(239,68,68,0.04)]';
                      dotColor = 'bg-red-400';
                      typeLabel = 'ERROR';
                    } else if (item.type === 'warning') {
                      borderClass = 'border-amber-500/10 bg-amber-500/[0.02]';
                      glowClass = 'shadow-[inset_0_0_12px_rgba(245,158,11,0.04)]';
                      dotColor = 'bg-amber-400';
                      typeLabel = 'WARNING';
                    } else if (item.type === 'achievement' || item.type === 'level') {
                      borderClass = 'border-purple-500/10 bg-purple-500/[0.02]';
                      glowClass = 'shadow-[inset_0_0_12px_rgba(168,85,247,0.04)]';
                      dotColor = 'bg-purple-400';
                      typeLabel = 'ACHIEVEMENT';
                    }

                    return (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all ${borderClass} ${glowClass} relative flex items-start gap-3`}
                      >
                        <div className="mt-1 flex-shrink-0">
                          <span className={`flex w-2 h-2 rounded-full ${dotColor}`} />
                        </div>
                        <div className="flex-grow space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">{typeLabel}</span>
                            <span className="text-[9px] font-mono text-slate-500">{item.date}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-200 block">{item.title}</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{item.description}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setNotificationsHistory(prev => prev.filter(n => n.id !== item.id));
                            soundManager.playClick();
                          }}
                          className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer footer */}
              <div className="p-4 bg-[#080d1a] border-t border-white/[0.08] text-center">
                <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                  KRONEX Premium Notification Core
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating AI Gemini Chat & Voice Assistant Dock */}
      <FloatingAssistantDock 
        onCommandTrigger={(view, tab) => handleNavigate(view as any, tab)} 
      />

      {/* Camera Vision & Biometrics Studio Modal */}
      <CameraToolsModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onFaceVerified={(verifiedName) => {
          const updatedUser = {
            name: verifiedName,
            email: currentUser?.email || 'shashvat@kronex.ai',
            avatar: 'S',
            role: 'Sovereign Architect (Face ID Verified)'
          };
          setCurrentUser(updatedUser);
          localStorage.setItem('kronex_user', JSON.stringify(updatedUser));
        }}
      />

      {/* Passkey & WebAuthn Security Vault Modal */}
      <PasskeyManagerModal
        isOpen={isPasskeyOpen}
        onClose={() => setIsPasskeyOpen(false)}
        onAuthSuccess={(verifiedUser) => {
          setCurrentUser(verifiedUser);
          localStorage.setItem('kronex_user', JSON.stringify(verifiedUser));
        }}
      />

    </div>
  );
}
