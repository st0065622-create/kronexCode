import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, ShieldCheck, Key, CreditCard, Settings, LogOut, 
  Command, Sparkles, Check, ChevronRight, Layers, Bot, Cpu 
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string; avatar: string; role: string } | null;
  onNavigate: (view: 'landing' | 'dashboard', tab?: string) => void;
  onOpenShortcuts: () => void;
  onOpenPasskey: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({
  isOpen,
  onClose,
  user,
  onNavigate,
  onOpenShortcuts,
  onOpenPasskey,
  onLogout
}: ProfileDropdownProps) {
  const [activeWorkspace, setActiveWorkspace] = useState('Kronex Sovereign');

  if (!isOpen) return null;

  const workspaces = [
    { id: 'Kronex Sovereign', role: 'Owner & Architect', icon: Cpu },
    { id: 'Quantum Intelligence Lab', role: 'Collaborator', icon: Sparkles },
    { id: 'Enterprise Cloud Core', role: 'Admin', icon: Layers },
  ];

  const handleAction = (callback: () => void) => {
    soundManager.playClick();
    callback();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none flex justify-end p-4 md:p-6 pt-20">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
      />

      {/* Floating Profile Dropdown Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm bg-[#090E1F]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-[0_25px_70px_rgba(0,0,0,0.8)] pointer-events-auto flex flex-col relative overflow-hidden text-white font-sans space-y-4"
      >
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3]" />

        {/* User Card Header */}
        <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
          {/* Avatar with Rotating Gradient Ring */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3] p-[1.5px] overflow-hidden">
              <img 
                src="/src/assets/images/shashvat_profile_1785747313447.jpg" 
                alt="THE SHASHVAT" 
                className="w-full h-full rounded-[14px] object-cover"
              />
            </div>
            {/* Online Status Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#090E1F] shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-black text-white truncate tracking-wide">THE SHASHVAT</h3>
            <p className="text-[11px] text-zinc-400 truncate">{user?.email || 'shashvat@kronex.ai'}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-400/30 text-[#00D4FF] font-mono text-[9px] font-extrabold uppercase tracking-wider">
              Creator & Lead Architect
            </span>
          </div>
        </div>

        {/* AI Assistant Live Telemetry Status */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-[#00D4FF] animate-pulse" />
            <span className="text-[11px] font-mono text-zinc-300">AI Neural Link Active</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400">99.9% Online</span>
        </div>

        {/* Workspace Switcher */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block px-1">
            Active Workspace
          </span>

          <div className="space-y-1">
            {workspaces.map((ws) => {
              const Icon = ws.icon;
              const isSelected = activeWorkspace === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveWorkspace(ws.id);
                  }}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-white/10 border-[#00D4FF]/40 text-white shadow-sm' 
                      : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#00D4FF]' : 'text-zinc-500'}`} />
                    <div className="text-left truncate">
                      <span className="font-bold block truncate">{ws.id}</span>
                      <span className="text-[9px] text-zinc-500 block font-mono">{ws.role}</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[#00D4FF] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Menu Actions */}
        <div className="space-y-1 pt-1 border-t border-white/[0.08]">
          
          <button
            onClick={() => handleAction(() => onNavigate('dashboard', 'profile-dashboard'))}
            className="w-full p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center space-x-2.5">
              <User className="w-4 h-4 text-[#00D4FF]" />
              <span>Profile Dashboard</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={() => handleAction(onOpenPasskey)}
            className="w-full p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center space-x-2.5">
              <Key className="w-4 h-4 text-purple-400" />
              <span>Passkeys & WebAuthn Vault</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={() => handleAction(onOpenShortcuts)}
            className="w-full p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center space-x-2.5">
              <Command className="w-4 h-4 text-amber-400" />
              <span>Keyboard Shortcuts</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-zinc-400">Ctrl+K</span>
          </button>

          <button
            onClick={() => handleAction(() => onNavigate('landing'))}
            className="w-full p-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center space-x-2.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Billing & Subscription</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">SOVEREIGN PRO</span>
          </button>

        </div>

        {/* Logout Action */}
        <div className="pt-2 border-t border-white/[0.08]">
          <button
            onClick={() => handleAction(onLogout)}
            className="w-full p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect & Exit Session</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
