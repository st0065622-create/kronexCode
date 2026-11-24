import React from 'react';
import { motion } from 'motion/react';
import { Command, X, Keyboard, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K', desc: 'Open Command Palette & AI Launcher', category: 'Navigation' },
    { key: 'Ctrl + T', desc: 'Open Theme Studio & Visual Engine', category: 'Styling' },
    { key: 'Ctrl + B', desc: 'Open Camera Vision & Biometrics Studio', category: 'Security' },
    { key: 'Ctrl + P', desc: 'Open Passkeys & WebAuthn Vault', category: 'Security' },
    { key: 'Ctrl + Shift + L', desc: 'Toggle Light / Dark Mode Preset', category: 'Theme' },
    { key: 'Esc', desc: 'Close Modal or Active Popup Window', category: 'General' },
  ];

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-[#080D1A] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-white font-sans space-y-5"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D4FF]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">System Keyboard Shortcuts</h3>
              <p className="text-xs text-zinc-400">High-efficiency hotkeys for KRONEX AI OS</p>
            </div>
          </div>

          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc, index) => (
            <div 
              key={index} 
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 flex items-center justify-between transition-colors"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white">{sc.desc}</span>
                <span className="text-[10px] font-mono text-zinc-500 block">{sc.category}</span>
              </div>

              <kbd className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono font-bold text-[#00D4FF] shadow-inner">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] text-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Press Esc anytime to return
          </span>
        </div>
      </motion.div>
    </div>
  );
}
