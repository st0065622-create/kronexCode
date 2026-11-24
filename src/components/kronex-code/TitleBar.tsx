import React from 'react';
import { 
  Cpu, Play, Command, Maximize2, Minimize2, Split, 
  Sparkles, RefreshCw, Layers, Shield, FolderOpen, Save, Bug, Expand, Shrink 
} from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { soundManager } from '../../utils/sound';

export default function TitleBar() {
  const { 
    files, 
    activeFileId, 
    isZenMode, 
    toggleZenMode, 
    isFullscreen,
    toggleFullscreen,
    setCommandPaletteOpen, 
    isSplitView, 
    toggleSplitView,
    saveActiveFile,
    resetToDefaults,
    setActiveBottomTab
  } = useKronexStore();

  const activeFile = files.find(f => f.id === activeFileId);

  // Compute breadcrumbs path
  const getBreadcrumbs = () => {
    if (!activeFile) return ['Workspace'];
    return activeFile.path.split('/');
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="h-10 bg-[#060a14] border-b border-white/10 flex items-center justify-between px-3 text-xs text-zinc-300 font-sans select-none shrink-0 z-20">
      
      {/* Left: Logo & Window controls */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="flex items-center space-x-1.5 pr-2 border-r border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-500 cursor-pointer" title="Close Workspace" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 cursor-pointer" title="Minimize" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer" title="Maximize" />
        </div>

        {/* Kronex Code Brand */}
        <div className="flex flex-col justify-center shrink-0">
          <span className="text-[8px] font-mono font-bold tracking-[1.5px] uppercase text-[#00D4FF] flex items-center gap-1 leading-none mb-0.5">
            <Sparkles className="w-2 h-2 text-[#00D4FF] inline-block" /> MADE BY SHASHVAT
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] flex items-center justify-center text-black font-bold">
              <Cpu className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-display font-extrabold text-white text-xs tracking-wider">
              KRONEX <span className="text-[#00D4FF]">CODE</span>
            </span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-400/10 border border-cyan-400/30 text-[#00D4FF] font-mono text-[9px] font-bold">
              IDE v2.5
            </span>
          </div>
        </div>

        {/* Breadcrumb path */}
        <div className="hidden md:flex items-center space-x-1.5 text-[11px] font-mono text-zinc-400 min-w-0 overflow-hidden truncate pl-2 border-l border-white/10">
          <FolderOpen className="w-3 h-3 text-zinc-500 shrink-0" />
          {breadcrumbs.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-zinc-600">/</span>}
              <span className={index === breadcrumbs.length - 1 ? 'text-cyan-400 font-bold truncate' : 'text-zinc-400 truncate'}>
                {part}
              </span>
            </React.Fragment>
          ))}
          {activeFile?.isUnsaved && (
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" title="Unsaved changes" />
          )}
        </div>
      </div>

      {/* Center: Command Palette Trigger Search */}
      <button
        onClick={() => { soundManager.playClick(); setCommandPaletteOpen(true); }}
        className="hidden lg:flex items-center space-x-2 px-4 py-1 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-xs font-mono w-72 justify-between"
      >
        <div className="flex items-center space-x-2 truncate">
          <Command className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate">Type command or search files...</span>
        </div>
        <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] text-zinc-500 font-mono">Ctrl+P</kbd>
      </button>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center space-x-1.5 shrink-0">
        
        {/* Run / Preview Sandbox */}
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveBottomTab('preview');
          }}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] flex items-center space-x-1.5 cursor-pointer transition-all"
          title="Execute & Open Live Preview"
        >
          <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
          <span className="hidden sm:inline">Run Code</span>
        </button>

        {/* Save Active File */}
        <button
          onClick={() => {
            soundManager.playClick();
            saveActiveFile();
          }}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Save Active File (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5 text-amber-400" />
        </button>

        {/* Split View Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            toggleSplitView();
          }}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isSplitView ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
          }`}
          title="Toggle Split Editor"
        >
          <Split className="w-3.5 h-3.5" />
        </button>

        {/* Native Fullscreen Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            toggleFullscreen();
          }}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isFullscreen ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
          }`}
          title="Toggle Fullscreen API"
        >
          {isFullscreen ? <Shrink className="w-3.5 h-3.5" /> : <Expand className="w-3.5 h-3.5" />}
        </button>

        {/* Zen Mode Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            toggleZenMode();
          }}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isZenMode ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
          }`}
          title="Toggle Zen Mode"
        >
          {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Reset Project */}
        <button
          onClick={() => {
            soundManager.playClick();
            if (confirm('Reset workspace files to default initial state?')) {
              resetToDefaults();
            }
          }}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
          title="Reset Workspace"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
