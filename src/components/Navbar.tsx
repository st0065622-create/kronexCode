import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Menu, X, ArrowRight, BrainCircuit, User, Sun, Moon, Bell, 
  Volume2, Bot, MessageSquare, Code2, Workflow, Camera, Key, ScanFace, 
  Sliders, Palette, Shield, Command, Zap, Layers, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';
import ThemeStudioModal from './ThemeStudioModal';
import NotificationDropdown, { NotificationItem } from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { THEME_PRESETS, getSavedThemeSettings } from '../utils/themeEngine';

interface NavbarProps {
  currentView: 'landing' | 'dashboard';
  currentTab: string;
  onNavigate: (view: 'landing' | 'dashboard', tab?: string) => void;
  onLaunchVibeStudio?: () => void;
  onLoginClick?: () => void;
  onCameraClick?: () => void;
  onPasskeyClick?: () => void;
  user?: { name: string; email: string; avatar: string; role: string } | null;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onToggleNotifications?: () => void;
  notifications?: NotificationItem[];
  unreadNotificationsCount?: number;
  onDismissNotification?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  onClearAllNotifications?: () => void;
  onLogout?: () => void;
}

export default function Navbar({ 
  currentView, 
  currentTab, 
  onNavigate, 
  onLoginClick,
  onCameraClick,
  onPasskeyClick,
  user,
  theme = 'dark',
  notifications = [],
  unreadNotificationsCount = 0,
  onDismissNotification,
  onMarkAllNotificationsRead,
  onClearAllNotifications,
  onLogout
}: NavbarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal / Dropdown states
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Active theme info for icon rendering
  const [activePresetId, setActivePresetId] = useState(() => getSavedThemeSettings().presetId);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Shortcuts hotkey listener (Ctrl+T for Theme Studio)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        soundManager.playClick();
        setIsThemeStudioOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const landingLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'Products', href: '#products' },
    { label: 'Pricing', href: '#pricing', hideOnTablet: true },
    { label: 'Docs', href: '#docs' },
    { label: 'Contact', href: '#contact' },
  ];

  const dashboardTabs = [
    { id: 'workflow-builder', label: 'Workflows', icon: Workflow },
    { id: 'ai-agents', label: 'Agents', icon: Bot },
    { id: 'simple-chat', label: 'Mobile Chat', icon: MessageSquare },
    { id: 'playground', label: 'Playground', icon: Sparkles },
    { id: 'voice-conversion', label: 'Voice', icon: Volume2 },
    { id: 'codex', label: 'Codex', icon: Code2 },
    { id: 'profile-dashboard', label: 'Profile', icon: User },
    { id: 'tutorials', label: 'Sandbox', icon: BrainCircuit },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (currentView === 'dashboard') {
      onNavigate('landing');
    }
    
    if (href === '#hero') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const isLanding = currentView === 'landing';
  const currentPreset = THEME_PRESETS[activePresetId] || THEME_PRESETS.dark;

  return (
    <>
      <header 
        id="navbar-header"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 99999,
          paddingTop: 'env(safe-area-inset-top)',
          background: isScrolled 
            ? 'rgba(8, 12, 24, 0.92)' 
            : 'rgba(10, 15, 30, 0.82)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55)',
          transition: 'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
        }}
        className="w-full h-[72px] md:h-[80px] flex items-center justify-center select-none"
      >
        {/* Ambient Top Glow Border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent" />

        {/* Scroll Progress Line */}
        <div 
          id="scroll-progress-indicator"
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#7C3AED] via-[#00D4FF] to-[#00FFA3] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Main Header Inner Container */}
        <div 
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            width: '100%',
            height: '100%',
            whiteSpace: 'nowrap',
            flexWrap: 'nowrap',
            minWidth: 0,
            boxSizing: 'border-box'
          }}
          className="px-4 md:px-8"
        >
          {/* LEFT SIDE: BRAND LOGO */}
          <div 
            id="brand-logo"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3.5 shrink-0 cursor-pointer group pointer-events-auto"
          >
            <div className="w-[44px] h-[44px] md:w-[52px] md:h-[52px] rounded-[18px] bg-slate-950/90 border border-white/15 flex items-center justify-center shadow-[0_0_25px_rgba(0,212,255,0.2)] relative group-hover:border-[#00D4FF] transition-all duration-300 overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/40 via-[#6366F1]/30 to-[#00D4FF]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <BrainCircuit className="w-6 h-6 md:w-7 md:h-7 text-[#00D4FF] relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]" />
            </div>

            <div className="flex flex-col whitespace-nowrap overflow-hidden min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[2px] uppercase text-[#00D4FF] flex items-center gap-1 leading-tight mb-0.5">
                <Sparkles className="w-2.5 h-2.5 text-[#00D4FF] inline-block animate-pulse" /> MADE BY SHASHVAT
              </span>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-[22px] sm:text-[26px] md:text-[30px] tracking-[0.5px] whitespace-nowrap leading-none block text-white">
                  KRONEX<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-cyan-300 to-[#7C3AED] drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[#00D4FF] text-[9px] font-mono font-bold tracking-widest uppercase shrink-0">
                  OS 2.5
                </span>
              </div>
              <span className="hidden md:block text-[7.5px] uppercase tracking-[3px] font-bold font-mono text-zinc-400/80 mt-1">
                PREMIUM COGNITIVE SUITE
              </span>
            </div>
          </div>

          {/* CENTER: DESKTOP NAVIGATION */}
          <nav 
            id="desktop-navigation" 
            className="hidden md:flex items-center gap-[14px] lg:gap-[28px] flex-nowrap shrink-0 whitespace-nowrap overflow-hidden"
          >
            {isLanding ? (
              landingLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`h-[44px] px-3 lg:px-[16px] rounded-[14px] flex items-center justify-center font-sans font-semibold text-xs lg:text-[14px] tracking-wide text-zinc-300 hover:text-[#00D4FF] hover:bg-white/[0.08] transition-all duration-250 cursor-pointer whitespace-nowrap shrink-0 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] ${
                    link.hideOnTablet ? 'hidden lg:flex' : ''
                  }`}
                >
                  {link.label}
                </a>
              ))
            ) : (
              dashboardTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onNavigate('dashboard', tab.id)}
                    className={`h-[44px] px-3 lg:px-[15px] rounded-[14px] flex items-center gap-2 font-sans font-semibold text-xs lg:text-[13px] tracking-wide transition-all duration-250 cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive 
                        ? 'text-[#00D4FF] bg-cyan-400/10 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,212,255,0.2)]' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#00D4FF]" />
                    <span>{tab.label}</span>
                  </button>
                );
              })
            )}
          </nav>

          {/* RIGHT SIDE: ACTIONS & THEME CONTROLLER */}
          <div 
            id="right-actions-container" 
            className="flex items-center gap-2 md:gap-[12px] shrink-0 flex-nowrap"
          >
            {/* Camera Vision & Biometrics Button */}
            {onCameraClick && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { soundManager.playClick(); onCameraClick(); }}
                className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#00D4FF]/50 hover:bg-white/10 text-zinc-300 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer relative shrink-0 shadow-sm group"
                title="Camera Vision & Biometrics Studio"
                aria-label="Camera Vision Tools"
              >
                <Camera className="w-[18px] h-[18px] text-[#00D4FF] group-hover:scale-110 transition-transform duration-300" />
              </motion.button>
            )}

            {/* Passkey & WebAuthn Vault Button */}
            {onPasskeyClick && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { soundManager.playClick(); onPasskeyClick(); }}
                className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#7C5CFF]/50 hover:bg-white/10 text-zinc-300 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer relative shrink-0 shadow-sm group"
                title="Passkey & WebAuthn Security Vault"
                aria-label="Passkey Security"
              >
                <Key className="w-[18px] h-[18px] text-[#7C5CFF] group-hover:scale-110 transition-transform duration-300" />
              </motion.button>
            )}

            {/* Liquid Glass Notification Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundManager.playClick();
                setIsNotificationOpen(prev => !prev);
              }}
              className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#00D4FF]/50 hover:bg-white/10 text-zinc-300 hover:text-white transition-all duration-300 flex items-center justify-center cursor-pointer relative shrink-0 shadow-sm group"
              title="Activity & AI Telemetry"
              aria-label="Toggle Notifications"
            >
              <Bell className="w-[18px] h-[18px] text-[#00D4FF] group-hover:rotate-12 transition-transform duration-300" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white font-mono text-[9px] font-black flex items-center justify-center px-1 animate-pulse border border-slate-900 shadow-[0_0_12px_rgba(244,63,94,0.8)]">
                  {unreadNotificationsCount}
                </span>
              )}
            </motion.button>

            {/* PREFERRED AI THEME CONTROLLER (Replaces basic Sun/Moon button) */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                soundManager.playClick();
                setIsThemeStudioOpen(true);
              }}
              className="w-11 h-11 rounded-full bg-white/[0.05] border border-transparent hover:border-[#00D4FF] transition-all duration-300 flex items-center justify-center cursor-pointer relative shrink-0 shadow-[0_0_20px_rgba(124,92,255,0.25)] group overflow-hidden"
              title="Theme Studio (Ctrl+T)"
              aria-label="Theme Studio"
            >
              {/* Animated Gradient Border Overlay */}
              <div className="absolute inset-0 rounded-full p-[1.5px] bg-gradient-to-tr from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3] animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="w-full h-full rounded-full bg-[#080D1A] flex items-center justify-center" />
              </div>

              {/* Theme Icon Inside */}
              <div className="relative z-10 flex items-center justify-center text-sm">
                <span className="text-base group-hover:scale-110 transition-transform duration-300">
                  {currentPreset.icon}
                </span>
              </div>

              {/* Ambient Glow Pulse */}
              <div className="absolute inset-0 rounded-full bg-[#00D4FF]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            {/* Profile Button with Gradient Ring & Online Dot */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundManager.playClick();
                if (user) {
                  setIsProfileOpen(prev => !prev);
                } else if (onLoginClick) {
                  onLoginClick();
                } else {
                  onNavigate('dashboard', 'profile-dashboard');
                }
              }}
              className="h-11 px-2.5 rounded-[16px] bg-[#131A2E]/90 border border-white/10 hover:border-[#00D4FF] hover:bg-[#131A2E] transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-[0_0_15px_rgba(0,212,255,0.2)] group overflow-hidden relative"
              title={user ? `${user.name} - Profile` : 'THE SHASHVAT Profile'}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] p-[1.5px] flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                <img 
                  src="/src/assets/images/shashvat_profile_1785747313447.jpg" 
                  alt="THE SHASHVAT" 
                  className="w-full h-full rounded-[10px] object-cover"
                />
              </div>
              <span className="hidden md:inline text-xs font-bold text-white tracking-wide pr-1">
                THE SHASHVAT
              </span>

              {/* Online pulse indicator */}
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#080D1A] shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            </motion.button>

            {/* Get Started / Action CTA */}
            {isLanding ? (
              <button 
                onClick={() => onNavigate('dashboard', 'tutorials')}
                style={{
                  height: '46px',
                  padding: '0 24px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #00D4FF 100%)',
                }}
                className="hidden sm:flex items-center gap-2 font-display font-bold text-xs md:text-sm uppercase tracking-wider text-white shadow-[0_4px_25px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_30px_rgba(0,212,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border border-white/20 relative overflow-hidden whitespace-nowrap shrink-0 group"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 text-white relative z-10 shrink-0" />
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('landing')}
                style={{
                  height: '46px',
                  padding: '0 20px',
                  borderRadius: '16px',
                }}
                className="hidden sm:flex items-center gap-2 font-display font-semibold text-xs md:text-sm uppercase tracking-wider border border-white/15 bg-white/[0.04] text-zinc-200 hover:bg-white/10 hover:text-white hover:border-cyan-400/40 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Back to Home</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(prev => {
                  const next = !prev;
                  if (next) soundManager.playMenuOpen();
                  else soundManager.playMenuClose();
                  return next;
                });
              }}
              className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/10 transition-colors text-white flex items-center justify-center md:hidden shrink-0 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(8, 12, 24, 0.96)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4 max-w-md mx-auto">
                {/* Mobile Theme Studio Trigger */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsThemeStudioOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-[14px] bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-400/30 text-white font-bold text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                    <span>Open Theme Studio</span>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400">10 Presets</span>
                </button>

                {isLanding ? (
                  landingLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="block px-4 py-3 rounded-[14px] text-base font-semibold text-zinc-200 hover:text-[#00D4FF] hover:bg-white/[0.06] transition-all"
                    >
                      {link.label}
                    </a>
                  ))
                ) : (
                  dashboardTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = currentTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          onNavigate('dashboard', tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-base font-semibold transition-all ${
                          isActive 
                            ? 'bg-cyan-400/10 text-[#00D4FF] border border-cyan-400/30' 
                            : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-[#00D4FF]" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })
                )}

                <div className="pt-4 border-t border-white/10 space-y-3">
                  {isLanding ? (
                    <button
                      onClick={() => {
                        onNavigate('dashboard', 'tutorials');
                        setIsMobileMenuOpen(false);
                      }}
                      style={{
                        height: '46px',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #00D4FF 100%)',
                      }}
                      className="w-full rounded-[14px] text-white text-center font-display font-bold text-sm tracking-wider uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onNavigate('landing');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full h-[46px] rounded-[14px] border border-white/10 text-white text-center font-display font-bold text-sm tracking-wider uppercase hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Back to Home
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Theme Studio Modal */}
      <ThemeStudioModal
        isOpen={isThemeStudioOpen}
        onClose={() => setIsThemeStudioOpen(false)}
        onThemeChanged={(presetId) => setActivePresetId(presetId)}
      />

      {/* Liquid Notification Dropdown */}
      <NotificationDropdown
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onDismiss={(id) => onDismissNotification && onDismissNotification(id)}
        onMarkAllRead={() => onMarkAllNotificationsRead && onMarkAllNotificationsRead()}
        onClearAll={() => onClearAllNotifications && onClearAllNotifications()}
      />

      {/* Quick Profile Dropdown */}
      <ProfileDropdown
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user || null}
        onNavigate={onNavigate}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenPasskey={() => onPasskeyClick && onPasskeyClick()}
        onLogout={() => onLogout && onLogout()}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
}
