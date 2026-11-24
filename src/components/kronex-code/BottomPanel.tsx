import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, AlertTriangle, Bug, Eye, 
  Sparkles, X, ChevronUp, ChevronDown, Play, Trash2, Send, RefreshCw 
} from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { BottomTab } from './types';
import { soundManager } from '../../utils/sound';

export default function BottomPanel() {
  const { 
    activeBottomTab, 
    setActiveBottomTab, 
    isBottomPanelOpen, 
    toggleBottomPanel,
    bottomPanelHeight,
    files,
    activeFileId 
  } = useKronexStore();

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "⚡ KRONEX CODE INTEGRATED WEBSHELL v2.5.0",
    "Type 'help' for available commands or 'ai <question>' to ask AI.",
    "shashvat@kronex-ide:~$"
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [aiAssistantLogs, setAiAssistantLogs] = useState<string[]>([
    "🤖 Kronex AI Copilot ready. Select a file or ask questions about code structure."
  ]);
  const [aiInput, setAiInput] = useState('');

  const activeFile = files.find(f => f.id === activeFileId);

  const tabs: { id: BottomTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'terminal', label: 'Terminal Shell', icon: TerminalIcon },
    { id: 'preview', label: 'Live Preview', icon: Eye },
    { id: 'ai-assistant', label: 'AI Copilot Assistant', icon: Sparkles },
    { id: 'problems', label: 'Problems (0)', icon: AlertTriangle },
    { id: 'output', label: 'Build Output', icon: Bug },
  ];

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim();
    setTerminalInput('');

    const newLogs = [...terminalLogs, `shashvat@kronex-ide:~$ ${cmd}`];

    // Command executor logic
    if (cmd === 'clear') {
      setTerminalLogs(["shashvat@kronex-ide:~$"]);
      return;
    } else if (cmd === 'help') {
      newLogs.push(
        "Available commands:",
        "  ls              - List workspace files",
        "  cat <file>      - Output file content",
        "  npm test        - Run test suite",
        "  git status      - Show git status",
        "  clear           - Clear terminal screen",
        "  ai <prompt>     - Ask Kronex AI Assistant"
      );
    } else if (cmd === 'ls') {
      const fileNames = files.map(f => f.isFolder ? `📁 ${f.name}/` : `📄 ${f.name}`).join('   ');
      newLogs.push(fileNames);
    } else if (cmd.startsWith('cat ')) {
      const fileName = cmd.replace('cat ', '').trim();
      const target = files.find(f => f.name.toLowerCase() === fileName.toLowerCase());
      if (target) {
        newLogs.push(target.content);
      } else {
        newLogs.push(`cat: ${fileName}: No such file or directory`);
      }
    } else if (cmd === 'npm test' || cmd === 'node run') {
      newLogs.push(
        "🚀 Executing test suite...",
        "✔ App.tsx render check PASSED (12ms)",
        "✔ API telemetry route check PASSED (8ms)",
        "Snapshots: 2 passed, 2 total"
      );
    } else if (cmd === 'git status') {
      newLogs.push("On branch main. Workspace files synchronized with local storage.");
    } else if (cmd.startsWith('ai ')) {
      const prompt = cmd.replace('ai ', '');
      newLogs.push(`🤖 KRONEX AI RESPONSE: Analyzing '${prompt}'...`);
      newLogs.push(`Analysis complete: Code structure in active file is optimal. No runtime bottlenecks detected.`);
    } else {
      newLogs.push(`bash: ${cmd}: command not found. Type 'help' for options.`);
    }

    newLogs.push("shashvat@kronex-ide:~$");
    setTerminalLogs(newLogs);
    soundManager.playClick();
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const prompt = aiInput.trim();
    setAiInput('');

    soundManager.playSuccess();
    setAiAssistantLogs(prev => [
      ...prev,
      `User: ${prompt}`,
      `🤖 KRONEX AI: Based on active file '${activeFile?.name || 'Workspace'}':`,
      `1. Refactored function parameters into clean TypeScript interfaces.`,
      `2. Optimized state update lifecycle preventing unnecessary re-renders.`
    ]);
  };

  // Generate live preview code
  const getPreviewHtml = () => {
    const htmlFile = files.find(f => f.name.endsWith('.html'));
    const cssFile = files.find(f => f.name.endsWith('.css'));
    const jsFile = files.find(f => f.name === 'App.tsx' || f.name.endsWith('.js'));

    if (htmlFile) return htmlFile.content;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #080d1a; color: white; font-family: sans-serif; display: flex; align-items: center; justify-center; height: 100vh; margin: 0; }
    ${cssFile ? cssFile.content : ''}
  </style>
</head>
<body>
  <div class="text-center p-8 bg-white/5 border border-white/10 rounded-3xl max-w-lg mx-auto shadow-2xl space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto font-bold text-xl">⚡</div>
    <h2 class="text-2xl font-black text-white">Kronex Live Sandbox</h2>
    <p class="text-sm text-zinc-400">Rendering live component state from <strong>${activeFile?.name || 'App.tsx'}</strong></p>
    <div class="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-mono">
      STATUS: COMPILER RUNNING AT 60 FPS
    </div>
  </div>
</body>
</html>`;
  };

  if (!isBottomPanelOpen) return null;

  return (
    <div 
      style={{ height: `${bottomPanelHeight}px` }}
      className="bg-[#050812] border-t border-white/10 flex flex-col shrink-0 text-xs font-sans text-white select-none relative overflow-hidden"
    >
      
      {/* Panel Tab Header */}
      <div className="h-8 bg-[#060a14] border-b border-white/10 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeBottomTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveBottomTab(tab.id);
                }}
                className={`px-3 py-1 rounded-t-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#050812] text-[#00D4FF] border-t-2 border-t-[#00D4FF]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00D4FF]' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={toggleBottomPanel}
          className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Minimize Panel"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Body Content */}
      <div className="flex-1 overflow-hidden p-3 relative">
        
        {/* Tab 1: Terminal */}
        {activeBottomTab === 'terminal' && (
          <div className="h-full flex flex-col font-mono text-xs">
            <div className="flex-1 overflow-y-auto space-y-1 text-zinc-300">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">{log}</div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex items-center space-x-2 pt-2 border-t border-white/10 shrink-0">
              <span className="text-[#00D4FF] font-bold shrink-0">shashvat@kronex-ide:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="type command (e.g. ls, cat App.tsx, help)..."
                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Tab 2: Live Preview */}
        {activeBottomTab === 'preview' && (
          <div className="h-full w-full rounded-xl overflow-hidden border border-white/10 bg-black">
            <iframe
              title="Live Sandbox Preview"
              srcDoc={getPreviewHtml()}
              className="w-full h-full border-none"
            />
          </div>
        )}

        {/* Tab 3: AI Copilot Assistant */}
        {activeBottomTab === 'ai-assistant' && (
          <div className="h-full flex flex-col space-y-2 font-sans">
            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
              {aiAssistantLogs.map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-zinc-300">
                  {log}
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSubmit} className="flex items-center space-x-2 shrink-0">
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="Ask AI Copilot to refactor, explain, or fix bugs in active file..."
                className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-white font-bold text-xs cursor-pointer flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Problems */}
        {activeBottomTab === 'problems' && (
          <div className="h-full flex items-center justify-center text-center text-zinc-500 font-mono">
            <div className="space-y-1">
              <p className="text-emerald-400 font-bold text-sm">No syntax or linter problems detected in workspace! ✨</p>
              <p className="text-xs text-zinc-400">All TypeScript and ESLint rules passing.</p>
            </div>
          </div>
        )}

        {/* Tab 5: Output */}
        {activeBottomTab === 'output' && (
          <div className="h-full font-mono text-xs text-zinc-400 space-y-1 overflow-y-auto">
            <div>[KRONEX BUILD] Vite dev server active at http://localhost:3000</div>
            <div>[KRONEX BUILD] HMR engine listening on port 3000</div>
            <div>[KRONEX BUILD] 100% modules transformed.</div>
          </div>
        )}

      </div>
    </div>
  );
}
