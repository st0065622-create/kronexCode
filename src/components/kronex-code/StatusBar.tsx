import React from 'react';
import { GitBranch, Check, Sparkles, Terminal, Bell, Radio } from 'lucide-react';
import { useKronexStore } from './useKronexStore';

export default function StatusBar() {
  const { files, activeFileId, gitBranch, isBottomPanelOpen, toggleBottomPanel } = useKronexStore();

  const activeFile = files.find(f => f.id === activeFileId);

  return (
    <div className="h-6 bg-[#04060d] border-t border-white/10 px-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 select-none shrink-0 z-20">
      
      {/* Left items */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleBottomPanel}
          className="flex items-center space-x-1.5 hover:text-white cursor-pointer text-[#00D4FF]"
          title="Toggle Terminal Panel"
        >
          <GitBranch className="w-3 h-3 text-[#00D4FF]" />
          <span className="font-bold">{gitBranch}*</span>
        </button>

        <span className="hidden sm:inline text-zinc-600">|</span>

        <span className="hidden sm:inline text-emerald-400 font-bold flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>WASM Engine Ready</span>
        </span>
      </div>

      {/* Right items */}
      <div className="flex items-center space-x-3 text-[10px]">
        <span>Ln 12, Col 24</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span className="uppercase text-cyan-400 font-bold">{activeFile?.language || 'typescript'}</span>
        
        <span className="hidden md:flex items-center space-x-1 text-purple-400 font-bold">
          <Sparkles className="w-3 h-3" />
          <span>Copilot: On</span>
        </span>
      </div>

    </div>
  );
}
