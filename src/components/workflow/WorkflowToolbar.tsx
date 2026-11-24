import React, { useState } from 'react';
import { 
  Play, Sparkles, Key, History, Layout, Download, Upload, 
  Terminal, Undo2, Redo2, ZoomIn, ZoomOut, Maximize, Plus,
  Users, Save, Check, RefreshCw
} from 'lucide-react';

interface WorkflowToolbarProps {
  workflowName: string;
  onUpdateWorkflowName: (name: string) => void;
  onRunWorkflow: () => void;
  isRunning: boolean;
  onTogglePalette: () => void;
  isPaletteOpen: boolean;
  onOpenTemplates: () => void;
  onOpenApiManager: () => void;
  onOpenVersionHistory: () => void;
  onToggleDebugConsole: () => void;
  isDebugConsoleOpen: boolean;
  onExportWorkflow: () => void;
  onImportWorkflow: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

export default function WorkflowToolbar({
  workflowName,
  onUpdateWorkflowName,
  onRunWorkflow,
  isRunning,
  onTogglePalette,
  isPaletteOpen,
  onOpenTemplates,
  onOpenApiManager,
  onOpenVersionHistory,
  onToggleDebugConsole,
  isDebugConsoleOpen,
  onExportWorkflow,
  onImportWorkflow,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onFitView
}: WorkflowToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <header className="h-16 px-4 bg-[#0B1020]/90 border-b border-white/[0.08] backdrop-blur-2xl flex items-center justify-between z-30 shrink-0 shadow-lg">
      {/* Left: Brand & Workflow Name */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onTogglePalette}
          className={`p-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 font-bold text-xs ${
            isPaletteOpen 
              ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40' 
              : 'bg-white/5 hover:bg-white/10 text-[#F8FAFC] border border-white/10'
          }`}
        >
          <Plus className="w-4 h-4 text-[#00D4FF]" />
          <span className="hidden sm:inline">Add Node</span>
        </button>

        <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

        <div className="flex items-center space-x-2">
          {isEditingName ? (
            <input
              type="text"
              value={workflowName}
              onChange={(e) => onUpdateWorkflowName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              autoFocus
              className="px-2.5 py-1 rounded-lg bg-[#131A2E] border border-[#00D4FF] text-sm font-bold text-[#F8FAFC] focus:outline-none font-sans"
            />
          ) : (
            <h2 
              onClick={() => setIsEditingName(true)}
              className="text-sm sm:text-base font-extrabold text-[#F8FAFC] hover:text-[#00D4FF] transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <span>{workflowName}</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                v1.0
              </span>
            </h2>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-1 text-[10px] text-[#94A3B8] font-mono">
          <Save className="w-3 h-3 text-emerald-400" />
          <span>Auto-saved</span>
        </div>
      </div>

      {/* Center: Canvas Controls (Undo/Redo & Zoom) */}
      <div className="hidden md:flex items-center space-x-1 bg-[#131A2E]/70 p-1 rounded-2xl border border-white/[0.08]">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-white/10 mx-1" />

        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onFitView}
          title="Fit Canvas View"
          className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions & Tools */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenTemplates}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F8FAFC] text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
          title="Enterprise Workflow Templates"
        >
          <Layout className="w-4 h-4 text-[#7C5CFF]" />
          <span className="hidden xl:inline">Templates</span>
        </button>

        <button
          onClick={onOpenApiManager}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F8FAFC] text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
          title="Encrypted API Vault"
        >
          <Key className="w-4 h-4 text-[#00D4FF]" />
          <span className="hidden xl:inline">Secrets</span>
        </button>

        <button
          onClick={onOpenVersionHistory}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F8FAFC] text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5"
          title="Version History"
        >
          <History className="w-4 h-4 text-amber-400" />
          <span className="hidden xl:inline">History</span>
        </button>

        <button
          onClick={onToggleDebugConsole}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
            isDebugConsoleOpen
              ? 'bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/50'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-[#F8FAFC]'
          }`}
          title="Toggle Execution Console"
        >
          <Terminal className="w-4 h-4 text-[#00D4FF]" />
          <span className="hidden sm:inline">Console</span>
        </button>

        {/* Export / Import */}
        <button
          onClick={onExportWorkflow}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F8FAFC] transition-colors cursor-pointer"
          title="Export JSON"
        >
          <Download className="w-4 h-4 text-[#94A3B8]" />
        </button>

        <label className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F8FAFC] transition-colors cursor-pointer">
          <Upload className="w-4 h-4 text-[#94A3B8]" />
          <input type="file" accept=".json" onChange={onImportWorkflow} className="hidden" />
        </label>

        {/* Primary Run Button */}
        <button
          onClick={onRunWorkflow}
          disabled={isRunning}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#00FFA3] text-[#0B1020] font-extrabold text-xs shadow-lg hover:shadow-[0_0_25px_rgba(0,212,255,0.6)] transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50 shrink-0"
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 animate-spin text-[#0B1020]" />
          ) : (
            <Play className="w-4 h-4 fill-current text-[#0B1020]" />
          )}
          <span>{isRunning ? 'Running...' : 'Execute Workflow'}</span>
        </button>
      </div>
    </header>
  );
}
