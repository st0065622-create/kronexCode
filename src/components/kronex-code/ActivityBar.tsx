import React from 'react';
import { 
  Folder, Search, GitBranch, Boxes, Send, Database, 
  Activity, Settings, Sparkles, Terminal
} from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { ActivityTab } from './types';
import { soundManager } from '../../utils/sound';

export default function ActivityBar() {
  const { activeActivityTab, setActiveActivityTab, isSidebarOpen } = useKronexStore();

  const navItems: { id: ActivityTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'explorer', label: 'File Explorer', icon: Folder },
    { id: 'search', label: 'Global Search', icon: Search },
    { id: 'git', label: 'Source Control (Git)', icon: GitBranch },
    { id: 'extensions', label: 'Extensions Marketplace', icon: Boxes },
    { id: 'rest', label: 'REST API Client', icon: Send },
    { id: 'database', label: 'Database Explorer', icon: Database },
    { id: 'performance', label: 'Performance & Telemetry', icon: Activity },
    { id: 'copilot', label: 'AI Copilot Assistant', icon: Sparkles },
    { id: 'settings', label: 'IDE Settings', icon: Settings },
  ];

  return (
    <div className="w-[50px] bg-[#050812] border-r border-white/10 flex flex-col items-center justify-between py-2 shrink-0 select-none z-20">
      {/* Top Group */}
      <div className="flex flex-col space-y-1.5 items-center w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeActivityTab === item.id && isSidebarOpen;

          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                setActiveActivityTab(item.id);
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                isActive 
                  ? 'bg-cyan-400/15 text-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.3)]' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
              title={item.label}
            >
              {/* Active Indicator Bar on left */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#00D4FF] rounded-r-full shadow-[0_0_8px_#00D4FF]" />
              )}
              
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#00D4FF]' : ''}`} />

              {/* Tooltip Hover Label */}
              <div className="absolute left-14 px-2.5 py-1 rounded-lg bg-[#090e1f] border border-white/15 text-[11px] font-sans font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Profile Indicator */}
      <div className="flex flex-col items-center space-y-2">
        <div 
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] p-[1px] cursor-pointer"
          title="Sovereign Architect Profile"
        >
          <div className="w-full h-full rounded-full bg-[#050812] flex items-center justify-center text-[10px] font-bold text-white">
            S
          </div>
        </div>
      </div>
    </div>
  );
}
