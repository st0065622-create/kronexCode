import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Check, X, ShieldAlert, Bot, Sparkles, Zap, Trash2, 
  CheckCheck, Volume2, VolumeX, Filter, Clock
} from 'lucide-react';
import { soundManager } from '../utils/sound';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'achievement' | 'agent' | 'security';
  read: boolean;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  onDismiss,
  onMarkAllRead,
  onClearAll
}: NotificationDropdownProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'agent' | 'security' | 'system'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(item => {
    if (activeFilter === 'agent') return item.type === 'agent' || item.type === 'achievement';
    if (activeFilter === 'security') return item.type === 'security' || item.type === 'warning' || item.type === 'error';
    if (activeFilter === 'system') return item.type === 'info' || item.type === 'success';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) soundManager.playClick();
    onDismiss(id);
  };

  const handleMarkRead = () => {
    if (soundEnabled) soundManager.playSuccess();
    onMarkAllRead();
  };

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none flex justify-end p-4 md:p-6 pt-20">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
      />

      {/* Floating Dropdown Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#090E1F]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] pointer-events-auto flex flex-col max-h-[80vh] relative overflow-hidden text-white font-sans"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7C3AED] via-[#00D4FF] to-[#00FFA3]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF]">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-wide">AI Activity Feed</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[9px] font-bold">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">Live system events & security telemetry</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                soundManager.playClick();
                setSoundEnabled(!soundEnabled);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Notification Sounds' : 'Enable Notification Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.08] shrink-0 text-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'agent', label: 'Agents' },
              { id: 'security', label: 'Security' },
              { id: 'system', label: 'System' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { soundManager.playClick(); setActiveFilter(tab.id as any); }}
                className={`px-3 py-1 rounded-xl font-mono text-[11px] transition-all cursor-pointer ${
                  activeFilter === tab.id 
                    ? 'bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] font-bold' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkRead}
              className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center space-x-1 shrink-0 cursor-pointer"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Read All</span>
            </button>
          )}
        </div>

        {/* Notifications Scroll List */}
        <div className="py-3 overflow-y-auto flex-1 space-y-2.5 pr-1 custom-scrollbar">
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-zinc-500">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-xs font-mono text-zinc-400">All notifications caught up!</p>
              </motion.div>
            ) : (
              filteredNotifications.map((item) => {
                let badgeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                let Icon = Bot;

                if (item.type === 'error' || item.type === 'security' || item.priority === 'HIGH') {
                  badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                  Icon = ShieldAlert;
                } else if (item.type === 'warning') {
                  badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  Icon = Zap;
                } else if (item.type === 'achievement') {
                  badgeBg = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                  Icon = Sparkles;
                }

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                      !item.read 
                        ? 'bg-white/[0.06] border-white/20 shadow-md' 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                    }`}
                  >
                    {!item.read && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00D4FF] animate-ping" />
                    )}

                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${badgeBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{item.title}</span>
                          <span className="text-[9px] font-mono text-zinc-400 flex items-center space-x-1 shrink-0 ml-2">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{item.date}</span>
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-snug mt-0.5 line-clamp-2 font-sans">
                          {item.description}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleDismiss(item.id, e)}
                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Dismiss notification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between shrink-0 text-xs text-zinc-400">
            <button
              onClick={() => { soundManager.playClick(); onClearAll(); }}
              className="text-[11px] font-mono text-zinc-500 hover:text-rose-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Activity Log</span>
            </button>

            <span className="text-[10px] font-mono text-zinc-400">
              {notifications.length} Total Logs
            </span>
          </div>
        )}

      </motion.div>
    </div>
  );
}
