import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, Activity, Cpu, Shield, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing KRONEX Neural Matrix...');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    soundManager.playDeploy();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText('Cognitive Core Synchronized.');
          setIsDone(true);
          soundManager.playSuccess();
          setTimeout(() => {
            onFinish();
          }, 800);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 12) + 8;
        if (next > 30 && prev <= 30) {
          setStatusText('Loading Hardware Acceleration & Compilers...');
        } else if (next > 60 && prev <= 60) {
          setStatusText('Mounting Sovereign AI Intelligence Engines...');
        } else if (next > 85 && prev <= 85) {
          setStatusText('Finalizing High-Frequency Audio & Canvas Nodes...');
        }

        return Math.min(100, next);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#070b18] text-white select-none overflow-hidden"
    >
      {/* Background Volumetric Glows */}
      <div className="absolute w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#22D3EE]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 holographic-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full space-y-8">
        
        {/* Animated 3D Floating KRONEX Core Orb */}
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Outer Orbit Ring 1 */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#22D3EE]/40 animate-spin-slow" />
          
          {/* Outer Orbit Ring 2 */}
          <div className="absolute -inset-2 rounded-full border border-[#7C3AED]/30 animate-spin-reverse" />

          {/* Pulsing Core */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#22D3EE] p-0.5 shadow-[0_0_30px_rgba(124,58,237,0.5)] animate-bounce">
            <div className="w-full h-full bg-[#0B1020] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#22D3EE] animate-pulse" />
            </div>
          </div>

          {/* Floating light particles */}
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
          <span className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
        </div>

        {/* Brand Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-[10px] font-mono font-bold text-[#22D3EE] tracking-widest uppercase">
              V2.5 SOVEREIGN
            </span>
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-gradient-hero">
            KRONEX AI STUDIO
          </h1>
          <p className="text-xs text-slate-400 font-sans tracking-wide">
            Next-Generation Cognitive Architecture Platform
          </p>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#22D3EE] animate-spin" />
              {statusText}
            </span>
            <span className="text-[#22D3EE] font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-900 border border-white/10 overflow-hidden p-0.5 relative shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#22D3EE]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Footer info badge */}
        <div className="pt-4 flex items-center justify-center gap-4 text-[10.5px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            60 FPS GPU
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-purple-400" />
            SYNAPSE SECURE
          </span>
        </div>

      </div>
    </motion.div>
  );
}
