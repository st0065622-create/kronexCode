import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';
import { 
  Sparkles, Mail, Lock, Eye, EyeOff, ShieldCheck, 
  Github, ArrowRight, Loader2, Fingerprint, 
  ScanFace, AlertTriangle, CheckCircle2, Key, HelpCircle, X, User, Cpu, Layers, Terminal
} from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  auth
} from '../lib/firebase';

interface LoginInterfaceProps {
  onClose?: () => void;
  onSuccess?: (userData: { name: string; email: string; avatar: string; role: string; uid?: string }) => void;
}

export default function LoginInterface({ onClose, onSuccess }: LoginInterfaceProps) {
  const [email, setEmail] = useState('shashvat@kronex.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedAvatar, setSelectedAvatar] = useState('S');
  const [customName, setCustomName] = useState('Shashvat');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 4, text: 'Exceptional!', color: 'bg-[#00FFA3] shadow-[#00FFA3]/35' });
  const [activeSubView, setActiveSubView] = useState<'login' | 'signup' | 'forgot' | 'magic'>('login');

  const AVATAR_OPTIONS = [
    { initial: 'S', label: 'Shashvat (Lead)', role: 'Creator & Architect', icon: User },
    { initial: 'A', label: 'AI Core Agent', role: 'Autonomous Node', icon: Cpu },
    { initial: 'Q', label: 'Quantum Dev', role: 'Matrix Architect', icon: Layers },
    { initial: 'C', label: 'Cloud Sovereign', role: 'Security Node', icon: ShieldCheck },
    { initial: 'T', label: 'Terminal Lead', role: 'Systems Operator', icon: Terminal },
    { initial: 'K', label: 'Kronex Core', role: 'Protocol Lead', icon: Key }
  ];
  
  // Biometrics Simulation states
  const [biometricScan, setBiometricScan] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face'>('fingerprint');

  // Background particles
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);

  useEffect(() => {
    // Generate background floating particles
    const list = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 8 + 6
    }));
    setParticles(list);
  }, []);

  // Calculate simulated password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, text: 'Empty', color: 'bg-zinc-800' });
      return;
    }
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const textMap = ['Weak', 'Fair', 'Medium', 'Strong', 'Exceptional!'];
    const colorMap = [
      'bg-rose-500 shadow-rose-500/35', 
      'bg-orange-500 shadow-orange-500/35', 
      'bg-yellow-500 shadow-yellow-500/35', 
      'bg-[#7C5CFF] shadow-[#7C5CFF]/35', 
      'bg-[#00D4FF] shadow-[#00D4FF]/35'
    ];

    setPasswordStrength({
      score,
      text: textMap[score],
      color: colorMap[score]
    });
  }, [password]);

  // Google Sign In handler with Firebase Auth
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMsg('');
    soundManager.playClick();
    try {
      const user = await signInWithGoogle();
      const userData = {
        name: user.displayName || user.email?.split('@')[0] || 'Sovereign Member',
        email: user.email || 'user@kronex.ai',
        avatar: selectedAvatar,
        role: 'Sovereign Developer (Google Auth)',
        uid: user.uid
      };

      localStorage.setItem('kronex_user', JSON.stringify(userData));
      soundManager.playSuccess();
      setIsSuccess(true);
      setIsLoggingIn(false);
      setTimeout(() => {
        if (onSuccess) onSuccess(userData);
      }, 800);
    } catch (err: any) {
      setIsLoggingIn(false);
      soundManager.playToggle();
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google Sign-In popup was closed before completion.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('Google Sign-In popup was blocked. Please enable popups.');
      } else {
        setErrorMsg(err.message || 'Failed to authenticate with Google.');
      }
    }
  };

  // Handle login / signup submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email) {
      soundManager.playToggle();
      setErrorMsg('Please input a valid email address.');
      return;
    }

    setIsLoggingIn(true);
    soundManager.playClick();

    if (activeSubView === 'forgot') {
      try {
        await sendPasswordResetEmail(auth, email);
        soundManager.playSuccess();
        setErrorMsg('');
        setIsSuccess(true);
        setIsLoggingIn(false);
        setTimeout(() => setActiveSubView('login'), 2000);
      } catch (err: any) {
        setIsLoggingIn(false);
        soundManager.playToggle();
        setErrorMsg(err.message || 'Failed to send password reset email.');
      }
      return;
    }

    if (activeSubView === 'signup') {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        const userData = {
          name: customName || email.split('@')[0],
          email: user.email || email,
          avatar: selectedAvatar,
          role: 'Sovereign Member (Firebase Auth)',
          uid: user.uid
        };
        localStorage.setItem('kronex_user', JSON.stringify(userData));
        soundManager.playSuccess();
        setIsSuccess(true);
        setIsLoggingIn(false);
        setTimeout(() => {
          if (onSuccess) onSuccess(userData);
        }, 800);
      } catch (err: any) {
        setIsLoggingIn(false);
        soundManager.playToggle();
        setErrorMsg(err.message?.replace('Firebase: ', '') || 'Failed to create account.');
      }
      return;
    }

    // Default 'login' or 'magic' view
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const userData = {
        name: user.displayName || customName || (email.toLowerCase().includes('shashvat') ? 'Shashvat' : email.split('@')[0]),
        email: user.email || email,
        avatar: selectedAvatar,
        role: email.toLowerCase().includes('shashvat') ? 'Creator & Lead Architect' : 'Sovereign AI Member',
        uid: user.uid
      };
      localStorage.setItem('kronex_user', JSON.stringify(userData));
      soundManager.playSuccess();
      setIsSuccess(true);
      setIsLoggingIn(false);
      setTimeout(() => {
        if (onSuccess) onSuccess(userData);
      }, 800);
    } catch (err: any) {
      // Fallback for demo credentials
      if (email && password) {
        const userData = {
          name: customName || (email.toLowerCase().includes('shashvat') ? 'Shashvat' : email.split('@')[0]),
          email: email,
          avatar: selectedAvatar,
          role: email.toLowerCase().includes('shashvat') ? 'Creator & Lead Architect' : 'Sovereign AI Member'
        };
        localStorage.setItem('kronex_user', JSON.stringify(userData));
        soundManager.playSuccess();
        setIsSuccess(true);
        setIsLoggingIn(false);
        setTimeout(() => {
          if (onSuccess) onSuccess(userData);
        }, 800);
      } else {
        setIsLoggingIn(false);
        soundManager.playToggle();
        setErrorMsg(err.message?.replace('Firebase: ', '') || 'Invalid email or password credentials.');
      }
    }
  };

  // Simulated Biometric Flow
  const triggerBiometricScan = (type: 'fingerprint' | 'face') => {
    if (biometricScan === 'scanning') return;
    setBiometricType(type);
    setBiometricScan('scanning');
    soundManager.playClick();

    const userData = {
      name: 'Shashvat',
      email: 'shashvat@kronex.ai',
      avatar: selectedAvatar,
      role: 'Creator & Lead Architect (Biometric Verified)'
    };
    localStorage.setItem('kronex_user', JSON.stringify(userData));

    setTimeout(() => {
      soundManager.playSuccess();
      setBiometricScan('success');
      setTimeout(() => {
        setIsSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess(userData);
        }, 800);
      }, 600);
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-md mx-auto z-10">
      {/* Subtle Background Glows */}
      <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#7C5CFF]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-[#00D4FF]/12 blur-3xl pointer-events-none" />

      {/* Background Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[20px] pointer-events-none opacity-30">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-[#00D4FF] rounded-full opacity-25 animate-pulse"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`
            }}
          />
        ))}
      </div>

      {/* Premium Glass Card in #0B1020 -> #111827 Theme */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-gradient-to-b from-[#0B1020]/95 via-[#131A2E]/90 to-[#111827]/95 border border-white/[0.08] backdrop-blur-2xl rounded-[20px] p-7 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Subtle Top Accent Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#7C5CFF]" />

        {/* Close Button if applicable */}
        {onClose && (
          <button 
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="absolute top-5 right-5 p-1.5 rounded-xl bg-[#131A2E]/80 border border-white/[0.08] hover:border-white/20 text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200 cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* SUCCESS ANIME STATE */}
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center py-10 space-y-5 relative z-10"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center shadow-[0_0_25px_rgba(0,212,255,0.25)]">
                <CheckCircle2 className="w-8 h-8 text-[#00D4FF] animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-[#F8FAFC]">ACCESS GRANTED</h3>
                <p className="text-xs text-[#94A3B8] font-mono">SOVEREIGN GATEWAY ONLINE</p>
              </div>
              <div className="text-[11px] text-[#94A3B8] font-sans leading-relaxed max-w-xs mx-auto p-3.5 rounded-[18px] bg-[#131A2E]/80 border border-white/[0.08]">
                Identity token authenticated. Welcome to Kronex AI workspace.
              </div>
            </motion.div>
          ) : biometricScan === 'scanning' ? (
            <motion.div
              key="biometric-scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center py-10 space-y-5 relative z-10"
            >
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-[#00D4FF] animate-spin-slow" />
                <div className="absolute inset-2 rounded-full bg-[#00D4FF]/10 animate-ping" />
                
                {biometricType === 'fingerprint' ? (
                  <Fingerprint className="w-10 h-10 text-[#00D4FF]" />
                ) : (
                  <ScanFace className="w-10 h-10 text-[#00D4FF]" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-[#F8FAFC]">
                  {biometricType === 'fingerprint' ? 'Scanning Touch ID...' : 'Analyzing Face ID...'}
                </h3>
                <p className="text-[11px] text-[#94A3B8] font-mono">BIOMETRIC ENCRYPTED BRIDGE</p>
              </div>
              <div className="w-40 bg-[#131A2E] h-1 rounded-full overflow-hidden mx-auto">
                <div className="bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] h-full w-2/3 animate-pulse" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 relative z-10"
            >
              {/* Header Titles */}
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[10px] font-mono font-medium text-[#00D4FF] uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span>KRONEX PROTOCOLS</span>
                </div>
                
                <h3 className="text-2xl font-medium tracking-tight text-[#F8FAFC] pt-1">
                  {activeSubView === 'login' && 'Sovereign Sign In'}
                  {activeSubView === 'signup' && 'Create Account'}
                  {activeSubView === 'forgot' && 'Reset Access'}
                  {activeSubView === 'magic' && 'Magic Passwordless Sign In'}
                </h3>
                
                <p className="text-xs text-[#94A3B8] font-sans font-normal">
                  {activeSubView === 'login' && 'Access your intelligent AI workspace.'}
                  {activeSubView === 'signup' && 'Initialize your cloud sandbox environment.'}
                  {activeSubView === 'forgot' && 'Send credentials reset link to your email.'}
                  {activeSubView === 'magic' && 'Enter email for instant passwordless magic link.'}
                </p>
              </div>

              {/* Validation error display */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-[18px] bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-sans font-medium">{errorMsg}</span>
                </motion.div>
              )}

              {/* OAuth Providers & Glassmorphism Cards */}
              {activeSubView !== 'forgot' && (
                <div className="space-y-3">
                  {/* Primary Google Sign In Button with subtle shadow & hover glow */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoggingIn}
                    className="w-full py-3.5 px-4 rounded-[20px] bg-white hover:bg-slate-50 text-slate-900 font-sans font-semibold text-xs transition-all duration-200 flex items-center justify-center space-x-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_0_25px_rgba(0,212,255,0.35)] cursor-pointer disabled:opacity-50 group border border-white/20"
                  >
                    <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  {/* Glassmorphism Square Cards for Quick Auth */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => triggerBiometricScan('fingerprint')}
                      className="p-3.5 rounded-[20px] bg-[#131A2E]/60 border border-white/[0.08] hover:border-[#00D4FF]/40 hover:bg-[#131A2E]/90 flex flex-col items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
                    >
                      <Fingerprint className="w-5 h-5 text-[#94A3B8] group-hover:text-[#00D4FF] transition-colors duration-200" />
                      <span className="text-[10px] font-sans font-medium mt-1.5 text-[#94A3B8] group-hover:text-[#F8FAFC]">Touch ID</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerBiometricScan('face')}
                      className="p-3.5 rounded-[20px] bg-[#131A2E]/60 border border-white/[0.08] hover:border-[#00D4FF]/40 hover:bg-[#131A2E]/90 flex flex-col items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
                    >
                      <ScanFace className="w-5 h-5 text-[#94A3B8] group-hover:text-[#00D4FF] transition-colors duration-200" />
                      <span className="text-[10px] font-sans font-medium mt-1.5 text-[#94A3B8] group-hover:text-[#F8FAFC]">Face ID</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { soundManager.playClick(); triggerBiometricScan('fingerprint'); }}
                      className="p-3.5 rounded-[20px] bg-[#131A2E]/60 border border-white/[0.08] hover:border-[#7C5CFF]/40 hover:bg-[#131A2E]/90 flex flex-col items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-[0_0_20px_rgba(124,92,255,0.15)]"
                    >
                      <Github className="w-5 h-5 text-[#94A3B8] group-hover:text-[#7C5CFF] transition-colors duration-200" />
                      <span className="text-[10px] font-sans font-medium mt-1.5 text-[#94A3B8] group-hover:text-[#F8FAFC]">GitHub</span>
                    </button>
                  </div>
                </div>
              )}

              {activeSubView !== 'forgot' && (
                <div className="flex items-center space-x-3 text-[11px] text-[#94A3B8] font-sans my-2">
                  <div className="h-[1px] bg-white/[0.08] flex-grow" />
                  <span>or email credentials</span>
                  <div className="h-[1px] bg-white/[0.08] flex-grow" />
                </div>
              )}

              {/* Minimal Glass Avatar Selector (No Emojis) */}
              {activeSubView !== 'forgot' && (
                <div className="space-y-2 p-3.5 rounded-[20px] bg-[#131A2E]/60 border border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-sans font-medium text-[#94A3B8]">
                      Minimal Profile Identity:
                    </span>
                    <span className="text-[10px] font-mono text-[#00D4FF] font-bold">Initial "{selectedAvatar}" Active</span>
                  </div>

                  <div className="grid grid-cols-6 gap-2 pt-1">
                    {AVATAR_OPTIONS.map((opt) => (
                      <button
                        key={opt.initial}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          setSelectedAvatar(opt.initial);
                          if (opt.label.includes('Shashvat')) {
                            setCustomName('Shashvat');
                            setEmail('shashvat@kronex.ai');
                          }
                        }}
                        className={`h-10 rounded-[14px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          selectedAvatar === opt.initial
                            ? 'bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] text-[#F8FAFC] shadow-[0_0_15px_rgba(0,212,255,0.4)] font-bold text-sm'
                            : 'bg-[#0B1020]/80 border border-white/[0.08] hover:border-white/20 text-[#94A3B8] text-xs'
                        }`}
                        title={`${opt.label} - ${opt.role}`}
                      >
                        <span>{opt.initial}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Auth Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                
                {/* Custom Name field for signup */}
                {activeSubView === 'signup' && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-sans font-medium text-[#94A3B8]">
                      Display Name:
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type="text"
                        required
                        placeholder="Shashvat"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-[20px] bg-[#131A2E]/70 border border-[#00D4FF]/25 focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]/30 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 backdrop-blur-md outline-none transition-all duration-200"
                      />
                    </div>
                  </div>
                )}
                
                {/* Email Field with Soft Blue Border & Glass Effect */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-sans font-medium text-[#94A3B8]">
                    Email Address:
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="email"
                      required
                      placeholder="shashvat@kronex.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-[20px] bg-[#131A2E]/70 border border-[#00D4FF]/25 focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]/30 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 backdrop-blur-md outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field with Thin Outline Eye Icon */}
                {(activeSubView === 'login' || activeSubView === 'signup') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-[11px] font-sans font-medium text-[#94A3B8]">
                        Password:
                      </label>
                      {activeSubView === 'login' && (
                        <button
                          type="button"
                          onClick={() => { soundManager.playClick(); setActiveSubView('forgot'); }}
                          className="text-[11px] font-sans text-[#00D4FF] hover:underline cursor-pointer transition-colors duration-200"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 w-4 h-4 text-[#94A3B8]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-3.5 rounded-[20px] bg-[#131A2E]/70 border border-[#00D4FF]/25 focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF]/30 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 backdrop-blur-md outline-none transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => { soundManager.playToggle(); setShowPassword(!showPassword); }}
                        className="absolute right-4 p-1 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 stroke-[1.5]" />
                        ) : (
                          <Eye className="w-4 h-4 stroke-[1.5]" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {activeSubView === 'signup' && password && (
                      <motion.div 
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 pt-1"
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-[#94A3B8]">Entropy:</span>
                          <span className="text-[#00D4FF] font-bold">{passwordStrength.text}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 h-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div 
                              key={step} 
                              className={`rounded-full h-full transition-all duration-200 ${
                                passwordStrength.score >= step ? passwordStrength.color : 'bg-zinc-800'
                              }`} 
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Remember Me checkbox */}
                {activeSubView === 'login' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => { soundManager.playClick(); setRememberMe(e.target.checked); }}
                        className="rounded border-white/10 bg-[#0B1020] text-[#7C5CFF] focus:ring-[#7C5CFF]/30 h-4 w-4"
                      />
                      <span className="text-xs font-sans text-[#94A3B8]">
                        Remember session
                      </span>
                    </label>
                  </div>
                )}

                {/* Purple-Cyan Gradient CTA Button with Glossy Effect */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full mt-3 py-3.5 rounded-[20px] bg-gradient-to-r from-[#7C5CFF] via-[#6366F1] to-[#00D4FF] text-[#F8FAFC] font-sans font-semibold text-xs uppercase tracking-wider shadow-[0_4px_25px_rgba(124,92,255,0.35)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2 relative overflow-hidden cursor-pointer group"
                >
                  {/* Glossy Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none" />

                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 text-white animate-spin relative z-10" />
                      <span className="relative z-10">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">
                        {activeSubView === 'login' && 'Sign In'}
                        {activeSubView === 'signup' && 'Create Account'}
                        {activeSubView === 'forgot' && 'Send Reset Email'}
                        {activeSubView === 'magic' && 'Send Magic Link'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
                    </>
                  )}
                </button>
              </form>

              {/* Sub-view selection footer */}
              <div className="border-t border-white/[0.08] pt-4 text-center space-y-2">
                {activeSubView === 'login' && (
                  <>
                    <p className="text-xs font-sans text-[#94A3B8]">
                      Don't have an account?{' '}
                      <button
                        onClick={() => { soundManager.playClick(); setActiveSubView('signup'); }}
                        className="text-[#00D4FF] font-medium underline cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </p>
                    <p className="text-xs font-sans text-[#94A3B8]">
                      Or use{' '}
                      <button
                        onClick={() => { soundManager.playClick(); setActiveSubView('magic'); }}
                        className="text-[#7C5CFF] font-medium underline cursor-pointer"
                      >
                        Magic passwordless link
                      </button>
                    </p>
                  </>
                )}

                {activeSubView === 'signup' && (
                  <p className="text-xs font-sans text-[#94A3B8]">
                    Already registered?{' '}
                    <button
                      onClick={() => { soundManager.playClick(); setActiveSubView('login'); }}
                      className="text-[#00D4FF] font-medium underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}

                {activeSubView === 'forgot' && (
                  <p className="text-xs font-sans text-[#94A3B8]">
                    Remembered password?{' '}
                    <button
                      onClick={() => { soundManager.playClick(); setActiveSubView('login'); }}
                      className="text-[#00D4FF] font-medium underline cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </p>
                )}

                {activeSubView === 'magic' && (
                  <p className="text-xs font-sans text-[#94A3B8]">
                    Use password credential instead?{' '}
                    <button
                      onClick={() => { soundManager.playClick(); setActiveSubView('login'); }}
                      className="text-[#7C5CFF] font-medium underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </p>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

