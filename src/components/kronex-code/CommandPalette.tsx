import React, { useState } from 'react';
import { 
  Command, Search, FileCode, Play, Save, Split, 
  Settings, RefreshCw, Sparkles, Terminal, Shield, Boxes, Send 
} from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { soundManager } from '../../utils/sound';

export default function CommandPalette() {
  const { 
    isCommandPaletteOpen, 
    setCommandPaletteOpen, 
    files, 
    openFile, 
    saveActiveFile, 
    toggleSplitView, 
    toggleZenMode, 
    setActiveActivityTab, 
    setActiveBottomTab,
    resetToDefaults 
  } = useKronexStore();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const commands = [
    { id: 'cmd-save', title: 'File: Save Active File', icon: Save, action: () => saveActiveFile() },
    { id: 'cmd-run', title: 'View: Run Live Preview Sandbox', icon: Play, action: () => setActiveBottomTab('preview') },
    { id: 'cmd-split', title: 'View: Toggle Split Editor View', icon: Split, action: () => toggleSplitView() },
    { id: 'cmd-zen', title: 'View: Toggle Zen Mode', icon: Sparkles, action: () => toggleZenMode() },
    { id: 'cmd-term', title: 'View: Open Terminal Shell', icon: Terminal, action: () => setActiveBottomTab('terminal') },
    { id: 'cmd-git', title: 'Git: Open Source Control', icon: Shield, action: () => setActiveActivityTab('git') },
    { id: 'cmd-rest', title: 'Tool: Open REST API Client', icon: Send, action: () => setActiveActivityTab('rest') },
    { id: 'cmd-ext', title: 'Tool: Open Extensions Marketplace', icon: Boxes, action: () => setActiveActivityTab('extensions') },
    { id: 'cmd-settings', title: 'Preferences: Open IDE Settings', icon: Settings, action: () => setActiveActivityTab('settings') },
    { id: 'cmd-reset', title: 'Workspace: Reset Files to Defaults', icon: RefreshCw, action: () => resetToDefaults() },
  ];

  // Also include files as search results
  const fileResults = files.filter(f => !f.isFolder && f.name.toLowerCase().includes(query.toLowerCase()));

  const filteredCommands = commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  const handleExecute = (action: () => void) => {
    soundManager.playSuccess();
    action();
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4 font-sans select-none">
      <div 
        className="bg-[#090e1f] border border-cyan-400/30 rounded-3xl w-full max-w-xl shadow-[0_0_50px_rgba(0,212,255,0.25)] overflow-hidden space-y-2 p-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
          <Command className="w-5 h-5 text-[#00D4FF]" />
          <input
            type="text"
            placeholder="Type a command or file name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-white text-sm font-mono placeholder:text-zinc-500"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-zinc-500 hover:text-white px-2 text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto space-y-1 pt-1">
          {/* File Results */}
          {fileResults.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase px-2 font-bold">Files</span>
              {fileResults.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleExecute(() => openFile(f.id))}
                  className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/20 text-left flex items-center justify-between text-xs font-mono text-white transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>{f.path}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 group-hover:text-cyan-300">Open File</span>
                </button>
              ))}
            </div>
          )}

          {/* Command Results */}
          <div className="space-y-1 pt-2">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase px-2 font-bold">Commands</span>
            {filteredCommands.map(cmd => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleExecute(cmd.action)}
                  className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-purple-500/20 text-left flex items-center space-x-3 text-xs font-mono text-white transition-all cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-purple-400" />
                  <span>{cmd.title}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
