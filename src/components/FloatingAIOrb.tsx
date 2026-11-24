import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BrainCircuit, Cpu } from 'lucide-react';

interface FloatingAIOrbProps {
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
  label?: string;
}

export default function FloatingAIOrb({ size = 'md', isThinking = false, label }: FloatingAIOrbProps) {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36'
  };

  const iconSizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className={`relative flex items-center justify-center ${sizeMap[size]}`}>
        {/* Ambient Volumetric Glow */}
        <div 
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${
            isThinking 
              ? 'bg-gradient-to-r from-amber-500/40 via-cyan-500/40 to-purple-500/40 animate-pulse scale-125' 
              : 'bg-gradient-to-r from-[#7C3AED]/30 to-[#22D3EE]/30 animate-pulse-slow'
          }`} 
        />

        {/* Orbit Ring 1 */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: isThinking ? 4 : 16, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-2 rounded-full border border-dashed border-cyan-400/30"
        />

        {/* Orbit Ring 2 */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: isThinking ? 6 : 22, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-4 rounded-full border border-purple-500/20"
        />

        {/* Inner Glowing Core */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            scale: isThinking ? [1, 1.08, 1] : [1, 1.03, 1]
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: isThinking ? 0.8 : 3, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="w-full h-full rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#22D3EE] p-0.5 shadow-[0_0_40px_rgba(124,58,237,0.4)] relative z-10 flex items-center justify-center overflow-hidden"
        >
          <div className="w-full h-full bg-[#0B1020]/90 backdrop-blur-md rounded-[14px] flex items-center justify-center relative">
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-scan-line pointer-events-none" />

            {isThinking ? (
              <BrainCircuit className={`${iconSizeMap[size]} text-amber-400 animate-spin`} />
            ) : (
              <Sparkles className={`${iconSizeMap[size]} text-[#22D3EE] animate-pulse`} />
            )}
          </div>
        </motion.div>

        {/* Orbiting particles */}
        <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22D3EE] animate-ping" />
        <span className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#7C3AED] animate-pulse" />
      </div>

      {label && (
        <span className="mt-3 text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
          <Cpu className="w-3 h-3 text-[#22D3EE]" />
          {label}
        </span>
      )}
    </div>
  );
}
