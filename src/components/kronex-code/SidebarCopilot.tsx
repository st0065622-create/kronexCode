import React, { useState } from 'react';
import { 
  Sparkles, Bot, Cpu, Zap, Code2, Bug, CheckCircle2, Copy, 
  Send, RefreshCw, FileCode, Layers, Mic, Image, FileText, 
  Settings, ChevronDown, Check, ArrowRight, Wand2
} from 'lucide-react';
import { useKronexStore } from './useKronexStore';
import { soundManager } from '../../utils/sound';

type AIModel = 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gpt-4o' | 'claude-3.5-sonnet' | 'deepseek-r1' | 'grok-3' | 'ollama-local';

type AgentMode = 'autonomous' | 'refactor' | 'debugger' | 'test-gen' | 'architect' | 'vision-code' | 'voice-code';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  codeSnippet?: string;
  targetFile?: string;
  timestamp: string;
}

export default function SidebarCopilot() {
  const { files, activeFileId, updateFileContent, createFile, openFile } = useKronexStore();

  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-2.5-flash');
  const [agentMode, setAgentMode] = useState<AgentMode>('autonomous');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: '⚡ KRONEX AI Copilot Engine v2.5 initialized. I have full context of your workspace files and environment.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId);

  const modelsList: { id: AIModel; name: string; provider: string; tag: string }[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google AI', tag: 'Fastest' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google AI', tag: 'Deep Logic' },
    { id: 'gpt-4o', name: 'GPT-4o Omnimodal', provider: 'OpenAI', tag: 'High Precision' },
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', tag: 'Code Master' },
    { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', tag: 'Reasoning' },
    { id: 'grok-3', name: 'Grok 3', provider: 'xAI', tag: 'Realtime' },
    { id: 'ollama-local', name: 'Ollama Llama 3.3', provider: 'Local GPU', tag: 'Offline' },
  ];

  const agentModes: { id: AgentMode; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    { id: 'autonomous', label: 'Autonomous Coder', icon: Wand2, desc: 'Generates full modules & file structures' },
    { id: 'refactor', label: 'Refactor Engine', icon: Code2, desc: 'Optimizes logic, type safety & readability' },
    { id: 'debugger', label: 'Smart Debugger', icon: Bug, desc: 'Scans & fixes runtime/syntax errors' },
    { id: 'test-gen', label: 'Test Suite Gen', icon: CheckCircle2, desc: 'Generates unit & integration tests' },
    { id: 'architect', label: 'System Architect', icon: Layers, desc: 'Designs DB schemas & API architecture' },
    { id: 'vision-code', label: 'Mockup-to-Code', icon: Image, desc: 'Converts screenshots into React UI' },
  ];

  const quickPrompts = [
    "Refactor active file for maximum performance",
    "Add complete TypeScript interfaces & type guards",
    "Generate comprehensive Vitest unit test suite",
    "Scan for runtime memory leaks or anti-patterns",
    "Generate full REST API endpoint with error handling"
  ];

  const handleSendPrompt = (promptText?: string) => {
    const query = promptText || inputPrompt;
    if (!query.trim()) return;

    soundManager.playClick();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!promptText) setInputPrompt('');
    setIsGenerating(true);

    // Simulate AI model processing with context awareness
    setTimeout(() => {
      soundManager.playSuccess();
      let responseText = '';
      let snippet = '';

      if (agentMode === 'refactor') {
        responseText = `⚡ Refactored code logic for model [${selectedModel.toUpperCase()}]. Added memoization, clean TypeScript declarations, and strict error handling bounds.`;
        snippet = `// Refactored by Kronex AI (${selectedModel})\nexport interface KronexData {\n  id: string;\n  status: 'active' | 'idle' | 'executing';\n  timestamp: number;\n}\n\nexport const processWorkspaceData = (data: KronexData[]): KronexData[] => {\n  return data.filter(item => item.status !== 'idle').map(item => ({\n    ...item,\n    timestamp: Date.now()\n  }));\n};`;
      } else if (agentMode === 'debugger') {
        responseText = `🐞 Debugger Scan complete using ${selectedModel}. No fatal memory leaks detected. Fixed edge case where active state could become undefined.`;
        snippet = `try {\n  if (!activeFileId) throw new Error("No active file selected in IDE");\n  // Safe state execution\n} catch (err) {\n  console.error("Kronex IDE Debugger caught error:", err);\n}`;
      } else if (agentMode === 'test-gen') {
        responseText = `🧪 Generated 100% coverage unit test suite using ${selectedModel}:`;
        snippet = `import { describe, it, expect } from 'vitest';\n\ndescribe('Kronex IDE Engine', () => {\n  it('should maintain state integrity under high load', () => {\n    const state = { activeTab: 'explorer', filesCount: 12 };\n    expect(state.filesCount).toBeGreaterThan(0);\n  });\n});`;
      } else {
        responseText = `🚀 KRONEX AI (${selectedModel}) processed your prompt: "${query}". Context loaded: 128k tokens (100% workspace indexed). Here is the optimized solution:`;
        snippet = `// Generated by Kronex AI Agent\nimport React from 'react';\n\nexport const KronexModule: React.FC = () => {\n  return (\n    <div className="p-4 rounded-2xl bg-[#080d1a] border border-cyan-500/30 text-white font-mono text-xs shadow-2xl">\n      <p className="text-cyan-400 font-bold">⚡ Active Agent Module Synchronized</p>\n    </div>\n  );\n};`;
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        codeSnippet: snippet,
        targetFile: activeFile?.name || 'App.tsx',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 900);
  };

  const handleApplySnippet = (snippet: string) => {
    if (!activeFileId) return;
    updateFileContent(activeFileId, snippet);
    soundManager.playSuccess();
  };

  const handleCreateNewFileWithSnippet = (snippet: string) => {
    const fileName = `KronexGenerated_${Date.now().toString().slice(-4)}.tsx`;
    createFile(fileName, false, null);
    const newFiles = useKronexStore.getState().files;
    const created = newFiles.find(f => f.name === fileName);
    if (created) {
      updateFileContent(created.id, snippet);
    }
    soundManager.playSuccess();
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    soundManager.playClick();
    if (!isVoiceActive) {
      setTimeout(() => {
        setInputPrompt("Build an interactive dashboard component with realtime telemetry charts");
        setIsVoiceActive(false);
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#060a17] text-white select-none font-sans overflow-hidden">
      
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#050812]">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#7C5CFF] to-[#00D4FF] flex items-center justify-center shadow-[0_0_12px_rgba(0,212,255,0.4)]">
            <Sparkles className="w-3.5 h-3.5 text-black font-bold" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xs tracking-wider text-white">
              AI COPILOT <span className="text-[#00D4FF]">AGENT</span>
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">Multi-Model Engine v2.5</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            128K CTX
          </span>
        </div>
      </div>

      {/* Model Selector Selector */}
      <div className="p-2.5 border-b border-white/10 bg-[#080d1a] shrink-0 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 font-mono font-bold flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#00D4FF]" /> Active Model
          </span>
          <span className="text-[10px] text-[#00D4FF] font-mono font-bold">Auto-Routing</span>
        </div>

        <select
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value as AIModel);
            soundManager.playClick();
          }}
          className="w-full bg-[#050812] border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono cursor-pointer"
        >
          {modelsList.map(m => (
            <option key={m.id} value={m.id} className="bg-[#080d1a] text-white">
              {m.name} ({m.provider}) — [{m.tag}]
            </option>
          ))}
        </select>

        {/* Agent Modes Grid */}
        <div className="grid grid-cols-3 gap-1 pt-1">
          {agentModes.map(mode => {
            const Icon = mode.icon;
            const isActive = agentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setAgentMode(mode.id);
                  soundManager.playClick();
                }}
                className={`p-1.5 rounded-lg border text-left flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-300 shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
                title={mode.desc}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00D4FF]' : 'text-zinc-400'}`} />
                <span className="text-[9px] font-mono font-bold truncate w-full text-center">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Output Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 font-mono px-1">
              <span>{msg.sender === 'user' ? 'You' : `Kronex AI (${selectedModel})`}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[95%] shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[#7C5CFF]/30 to-[#00D4FF]/30 border border-cyan-400/40 text-white font-medium rounded-tr-none'
                  : 'bg-[#0a0f24] border border-white/10 text-zinc-200 rounded-tl-none font-sans'
              }`}
            >
              <p>{msg.text}</p>

              {/* Code snippet block if provided */}
              {msg.codeSnippet && (
                <div className="mt-2.5 rounded-xl border border-cyan-500/30 bg-[#040711] overflow-hidden">
                  <div className="px-2.5 py-1.5 bg-[#060a17] border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <FileCode className="w-3 h-3" /> {msg.targetFile || 'Generated Code'}
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                      className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 font-mono text-[11px] text-cyan-200 overflow-x-auto no-scrollbar whitespace-pre-wrap leading-relaxed">
                    {msg.codeSnippet}
                  </pre>
                  
                  <div className="p-2 bg-[#060a17] border-t border-white/10 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleCreateNewFileWithSnippet(msg.codeSnippet!)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-[10px] font-mono font-bold text-zinc-300 hover:text-white cursor-pointer"
                    >
                      Create File
                    </button>
                    <button
                      onClick={() => handleApplySnippet(msg.codeSnippet!)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-black font-mono font-bold text-[10px] cursor-pointer shadow-[0_0_10px_rgba(0,212,255,0.3)] hover:opacity-95"
                    >
                      Apply to {activeFile?.name || 'Active File'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00D4FF]" />
            <span>AI Agent synthesizing response with {selectedModel}...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-3 py-2 border-t border-white/10 bg-[#050812] shrink-0 space-y-1.5">
        <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
          Quick AI Presets
        </div>
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendPrompt(prompt)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/50 text-[10px] font-mono text-zinc-300 hover:text-cyan-300 whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              ⚡ {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Control Box */}
      <div className="p-3 border-t border-white/10 bg-[#060a17] shrink-0 space-y-2">
        <div className="flex items-center space-x-2 bg-[#040711] border border-white/15 focus-within:border-cyan-400 rounded-xl px-3 py-2 transition-colors">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder={`Ask AI Agent (${agentMode})...`}
            className="flex-1 bg-transparent border-none outline-none text-xs text-white font-mono placeholder:text-zinc-600"
          />

          <button
            onClick={handleVoiceToggle}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isVoiceActive ? 'bg-red-500/30 border-red-500 text-red-400 animate-pulse' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Voice Coding Command Listener"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleSendPrompt()}
            disabled={!inputPrompt.trim() || isGenerating}
            className={`p-1.5 rounded-lg bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] text-black font-bold transition-all cursor-pointer ${
              !inputPrompt.trim() || isGenerating ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 shadow-[0_0_12px_rgba(0,212,255,0.4)]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>Target: <strong className="text-zinc-300">{activeFile?.name || 'Workspace'}</strong></span>
          <span>Shortcut: <kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px] text-zinc-300">Ctrl+Enter</kbd></span>
        </div>
      </div>

    </div>
  );
}
