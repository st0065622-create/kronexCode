import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Image as ImageIcon, Code2, Mic, Volume2, Eye, 
  FileText, Share2, Maximize2, Minimize2, Save, Trash2, 
  Plus, Search, Menu, ChevronRight, Download, Copy, Check, 
  Upload, X, Settings, User, PenSquare, ArrowRight, CheckCircle2,
  BookOpen, BrainCircuit, History, Sliders, Play, VolumeX, Shield, Edit,
  Video, Music, Table, Bot, Workflow, Network, Cpu, Layers, HelpCircle,
  Terminal, Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundParticles } from './ProfileDashboard';
import { soundManager } from '../utils/sound';

// Predefined models requested
const MODELS = [
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Google)', badge: 'Reasoning', icon: Sparkles },
  { id: 'gpt-5-5-preview', name: 'GPT-5.5 Preview (OpenAI)', badge: 'Ultra Intelligent', icon: BrainCircuit },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet (Anthropic)', badge: 'Creative Sovereign', icon: BookOpen },
  { id: 'deepseek-v3', name: 'DeepSeek V3 (DeepSeek)', badge: 'Efficiency Master', icon: Code2 },
  { id: 'grok-2-0', name: 'Grok 2.0 (xAI)', badge: 'Realtime Grounding', icon: Play },
];

const PRESET_ACCELERATORS = [
  "Write an elegant secure custom React hook for Firestore sync.",
  "Design a high-converting landing page layout for an AI SaaS.",
  "Analyze the impact of zero-overhead server compilation on latency.",
  "Create a system cognitive persona directive with strict boundaries."
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  date: string;
  model: string;
}

export default function AIPlayground() {
  const [activeTab, setActiveTab] = useState<'chat' | 'prompt' | 'image' | 'video' | 'voice-music' | 'code' | 'documents' | 'spreadsheet' | 'agent-builder' | 'history' | 'settings'>('chat');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-pro');
  const [temperature, setTemperature] = useState(0.7);
  const [searchQuery, setSearchQuery] = useState('');

  // Video Generator State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoStyle, setVideoStyle] = useState('Cinematic Hyperlapse');
  const [videoFPS, setVideoFPS] = useState('120 FPS');
  const [videoDuration, setVideoDuration] = useState('8 Seconds');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Sound & Music Suite State
  const [musicPrompt, setMusicPrompt] = useState('Hyper-detailed Ambient Cyber-Beats');
  const [musicBPM, setMusicBPM] = useState(120);
  const [musicStyle, setMusicStyle] = useState('Synthwave');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [generatedMusicTitle, setGeneratedMusicTitle] = useState<string | null>(null);

  // Presentation Sub-System State
  const [presentationTopic, setPresentationTopic] = useState('Next-Gen AI Orchestrator Layer');
  const [presentationStyle, setPresentationStyle] = useState('Dark Minimalist');
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<Array<{ title: string; points: string[]; note?: string }>>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Spreadsheet Sub-System State
  const [spreadsheetPrompt, setSpreadsheetPrompt] = useState('SaaS Cost and Revenue Projections 2026');
  const [isGeneratingSpreadsheet, setIsGeneratingSpreadsheet] = useState(false);
  const [spreadsheetHeaders, setSpreadsheetHeaders] = useState<string[]>([]);
  const [spreadsheetRows, setSpreadsheetRows] = useState<Array<Array<string | number>>>([]);

  // Agent Builder State
  const [agentName, setAgentName] = useState('Alpha Core Sentinel');
  const [agentObjective, setAgentObjective] = useState('Monitor core logs and coordinate failover clusters');
  const [agentModel, setAgentModel] = useState('gemini-2.5-pro');
  const [agentMemoryType, setAgentMemoryType] = useState('Vector Semantic DB');
  const [agentTools, setAgentTools] = useState<string[]>(['web_search', 'code_runner']);
  const [isBuildingAgent, setIsBuildingAgent] = useState(false);
  const [builtAgents, setBuiltAgents] = useState<Array<{ name: string; objective: string; tools: string[]; isRunning: boolean; model: string }>>([
    { name: 'Beta Code Auditor', objective: 'Audit syntax trees and security permissions', tools: ['code_runner'], isRunning: true, model: 'claude-3-5-sonnet' },
    { name: 'Gamma Market Researcher', objective: 'Scrape external sentiment clusters', tools: ['web_search'], isRunning: false, model: 'gemini-2.5-pro' }
  ]);
  const [activeAgentLogs, setActiveAgentLogs] = useState<string[]>([]);
  const [isRunningAgentDemo, setIsRunningAgentDemo] = useState(false);
  
  // Chat sessions state with default items (Save/Rename/Delete capabilities)
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('kronex_ai_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'session-1',
        title: 'Cognitive Orchestration Schema',
        date: 'Just now',
        model: 'gemini-2.5-pro',
        messages: [
          { id: 'm1', role: 'assistant', content: 'Greetings Explorer. I am initialized and ready to compile computation. How shall we design today?', timestamp: '10:00 AM' }
        ]
      },
      {
        id: 'session-2',
        title: 'Cyberpunk Vector Database Router',
        date: 'Yesterday',
        model: 'claude-3-5-sonnet',
        messages: [
          { id: 'm2', role: 'user', content: 'Explain low-latency vector routing.', timestamp: 'Yesterday' },
          { id: 'm3', role: 'assistant', content: 'Vector routing redirects query embeddings to optimized sub-clusters instantly.', timestamp: 'Yesterday' }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  // Prompt Editor State
  const [systemPrompt, setSystemPrompt] = useState('You are KRONEX AI Core, a high-fidelity intelligence assistant with sovereign permissions.');
  const [userPrompt, setUserPrompt] = useState('');
  const [promptOutput, setPromptOutput] = useState('');
  
  // Image Gen State
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('Cinematic 3D render');
  const [imageRatio, setImageRatio] = useState('16:9 Cinema');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Code Gen State
  const [codePrompt, setCodePrompt] = useState('Create a custom useDebounce hook in React 18');
  const [codeLang, setCodeLang] = useState('TypeScript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  
  // Writing Assistant State
  const [writingInput, setWritingInput] = useState('');
  const [writingTone, setWritingTone] = useState('Professional');
  const [writingOutput, setWritingOutput] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  
  // File upload state (Documents Tab)
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string, size: string, type: string, parsedText?: string }>>([]);
  const [isParsingFile, setIsParsingFile] = useState(false);
  
  // Voice input / synthesis states
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Aura-Male-Deep');
  
  // Notification system
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || null;

  useEffect(() => {
    localStorage.setItem('kronex_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: `Intelligence Query ${sessions.length + 1}`,
      date: 'Just now',
      model: selectedModel,
      messages: [
        { id: `msg-${Date.now()}`, role: 'assistant', content: `Initialized secure session using model ${selectedModel}. Ready for instruction.`, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
      ]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setActiveTab('chat');
    showToast("Created a new AI workspace session.");
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id && remaining.length > 0) {
      setActiveSessionId(remaining[0].id);
    }
    showToast("Deleted workspace session.");
  };

  const startRenameSession = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(id);
    setEditingTitle(title);
  };

  const saveRenameSession = (id: string) => {
    if (!editingTitle.trim()) return;
    setSessions(sessions.map(s => s.id === id ? { ...s, title: editingTitle } : s));
    setEditingSessionId(null);
    showToast("Workspace renamed.");
  };

  // Typewriter effect simulator
  const simulateTypewriter = (text: string, callback: (v: string) => void, onComplete?: () => void) => {
    let current = '';
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        current += text[index];
        callback(current);
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 10);
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim() || !activeSession) return;
    soundManager.playMessageSent();
    const userMsgText = chatInput;
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    // Append user message
    const updatedMessages = [...activeSession.messages, userMsg];
    setSessions(sessions.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages, model: selectedModel } : s));
    setChatInput('');
    setIsGenerating(true);
    soundManager.playThinking();

    // AI simulation
    setTimeout(() => {
      const responses = [
        `Understood. Compiling instruction metrics using **${selectedModel}**.\n\n### ⚡ Execution Telemetry\n- **Security Hash**: KRNX-SLA-9204\n- **Processor Latency**: 12.4ms\n- **Context Alignment Score**: 99.4%\n\n### 📝 Resolved Code / Schema Blueprint\n\`\`\`typescript\ninterface SecureCredential {\n  uid: string;\n  token: string;\n  level: "founder" | "operator";\n}\n\nexport function verifyCredential(auth: SecureCredential): boolean {\n  return auth.level === "founder" && auth.uid.startsWith("krnx_");\n}\n\`\`\`\n\nIs there anything else you want to sync to the core mainnet?`,
        `I have synchronized the prompt parameters. Let me run a diagnostic on this system model:\n\n1. **Redundancy Sweep**: 0 dead nodes found.\n2. **Network Integrity**: Secure under KRONEX SLA regulations.\n3. **Sovereign Mesh**: Operating with zero processing delays.\n\nEverything looks extremely healthy. Let's proceed.`,
        `Your strategic instruction is acknowledged. Here is the analyzed breakdown of your parameters:\n- Key values extracted successfully.\n- Schema validation checks passed with 100% compliance.\n- Model context has been cached for rapid subsequent access.`
      ];
      const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMsgId = `msg-ai-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        model: selectedModel
      };

      setSessions(prevSessions => prevSessions.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...updatedMessages, assistantMsg] };
        }
        return s;
      }));

      simulateTypewriter(selectedResponse, (text) => {
        setSessions(prevSessions => prevSessions.map(s => {
          if (s.id === activeSessionId) {
            const msgs = [...s.messages];
            const last = msgs[msgs.length - 1];
            if (last && last.id === assistantMsgId) {
              last.content = text;
            }
            return { ...s, messages: msgs };
          }
          return s;
        }));
      }, () => {
        setIsGenerating(false);
        soundManager.playMessageReceived();
      });
    }, 1000);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadText = (text: string, title: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    showToast("Downloaded content block successfully.");
  };

  const handleShareText = () => {
    showToast("Sharing gateway initialized. Link copied to clipboard.");
  };

  // Prompt Editor Handler
  const handlePromptCompile = () => {
    if (!userPrompt.trim()) return;
    setIsGenerating(true);
    setPromptOutput('');
    setTimeout(() => {
      const output = `[SYSTEM CORE COMPILATION]\nSystem Directive: "${systemPrompt}"\nUser Input: "${userPrompt}"\n\n>>> Generating highly refined optimization paths. Parameters successfully bound to active memory registers. Verification pass: COMPILER SECURE.`;
      simulateTypewriter(output, setPromptOutput, () => setIsGenerating(false));
    }, 800);
  };

  // Image Generation Handler
  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    setTimeout(() => {
      const mockImages = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80"
      ];
      setGeneratedImage(mockImages[Math.floor(Math.random() * mockImages.length)]);
      setIsGeneratingImage(false);
      showToast("Sovereign Art synthesis complete.");
    }, 2000);
  };

  // Code Assistant Handler
  const handleGenerateCode = () => {
    if (!codePrompt.trim()) return;
    setIsGeneratingCode(true);
    setGeneratedCode('');
    setTimeout(() => {
      const sample = `// Synthesized via KRONEX AI Core (${selectedModel})
// Target: ${codeLang}

${codeLang === 'TypeScript' ? `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}` : `def use_debounce(value, delay=300):
    # Simulated Python debounce timer block
    import time
    time.sleep(delay / 1000.0)
    return value`}
`;
      simulateTypewriter(sample, setGeneratedCode, () => setIsGeneratingCode(false));
    }, 1200);
  };

  // Writing Assistant Handler
  const handleWritingAssistant = (action: 'summarize' | 'expand' | 'bullets' | 'professional') => {
    if (!writingInput.trim()) return;
    setIsWriting(true);
    setWritingOutput('');
    setTimeout(() => {
      let output = '';
      if (action === 'summarize') {
        output = `### 📝 Highly Refined Summary\n\n- Main Subject: ${writingInput.substring(0, 50)}...\n- Dynamic Analysis: Core thesis outlines structured development acceleration and secure mainnet routing.`;
      } else if (action === 'expand') {
        output = `### 🚀 Detailed Sovereign Thesis\n\n"${writingInput}"\n\nThis core paradigm represents the fundamental cornerstone of modern artificial cognitive suites. By incorporating ultra-low processing overhead, engineers can scale intelligence metrics seamlessly without risking server fatigue.`;
      } else if (action === 'bullets') {
        output = `### 🔑 Crucial Extracted Principles\n\n- ⚡ **Maximum Processing Velocity**: Reduces server load.\n- 🛡️ **Zero-Vulnerability State Locking**: Guarantees transaction integrity.\n- 🔮 **Flexible Model Adaptability**: Supports dynamic embedding.`;
      } else {
        output = `### 👔 Executive Professional Refinement\n\n"We are excited to present our strategic architecture aligned with KRONEX AI guidelines. The implementation leverages optimized cognitive routing structures to assure standard security metrics and outstanding operation SLAs."`;
      }
      simulateTypewriter(output, setWritingOutput, () => setIsWriting(false));
    }, 1000);
  };

  // Drag and drop Document handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processDocument(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processDocument(files[0]);
    }
  };

  const processDocument = (file: File) => {
    setIsParsingFile(true);
    setTimeout(() => {
      const newFile = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'text/plain',
        parsedText: `[PARSED DATA SOURCE: ${file.name}]\nFile Size: ${(file.size / 1024).toFixed(1)} KB\nKeywords Scanned: SaaS, AI, Agentic Swarms, Security, SLA\nIntegrity: Verified 100% Cryptographically Secure.`
      };
      setUploadedFiles([newFile, ...uploadedFiles]);
      setIsParsingFile(false);
      showToast("Parsed document credentials successfully.");
    }, 1500);
  };

  // Text to Speech
  const triggerTextToSpeech = (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    showToast(`Synthesizing voice: ${selectedVoice}`);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 4000);
  };

  // Microphone toggle simulation
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setChatInput("Automated AI agent compilation is verified.");
      showToast("Voice transcription parsed successfully.");
    } else {
      setIsRecording(true);
      showToast("Directing audio stream...");
    }
  };

  // 1. Video Synthesizer Handler
  const handleGenerateVideo = () => {
    if (!videoPrompt.trim()) return;
    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setTimeout(() => {
      setGeneratedVideoUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
      setIsGeneratingVideo(false);
      setIsPlayingVideo(true);
      showToast("High fidelity video generation complete. Loaded in player.");
    }, 2500);
  };

  // 2. Sound & Music Composer Handler
  const handleGenerateMusic = () => {
    if (!musicPrompt.trim()) return;
    setIsGeneratingMusic(true);
    setGeneratedMusicTitle(null);
    setTimeout(() => {
      setGeneratedMusicTitle(`${musicStyle} - Cosmic Pulse (${musicBPM} BPM)`);
      setIsGeneratingMusic(false);
      setIsPlayingMusic(true);
      showToast("Dynamic soundtrack synthesized successfully.");
    }, 2000);
  };

  // 3. Slide Presentation Generator Handler
  const handleGeneratePresentation = () => {
    if (!presentationTopic.trim()) return;
    setIsGeneratingPresentation(true);
    setGeneratedSlides([]);
    setTimeout(() => {
      const mockSlides = [
        {
          title: `01. Introduction: ${presentationTopic}`,
          points: [
            "Leveraging high-dimensional space mappings for sovereign cognitive execution.",
            "Reducing server-side orchestration cost through zero-latency compiler optimization.",
            "Establishing resilient client-auth handshakes that withstand network disruptions."
          ],
          note: "Introduce the core architecture diagram and discuss scaling variables."
        },
        {
          title: "02. Deep Architectural Layer",
          points: [
            "Isolated micro-node clusters running independent transaction scopes.",
            "Dynamic telemetry balancing that adjusts server threads in real-time.",
            "Immutable ledger backups triggered dynamically upon SLA boundary checks."
          ],
          note: "Highlight the 120 FPS graphics interface rendering performance indicators."
        },
        {
          title: "03. Strategic Implementation Steps",
          points: [
            "Step A: Register active client session IDs with the mainnet router.",
            "Step B: Provision local database caches for offline operational sync.",
            "Step C: Authorize automated agent swarms to continuously monitor logs."
          ],
          note: "Summarize deployment cost metrics and transition to Q&A."
        }
      ];
      setGeneratedSlides(mockSlides);
      setCurrentSlideIndex(0);
      setIsGeneratingPresentation(false);
      showToast("Dynamic presentation slideshow compiled successfully.");
    }, 2000);
  };

  // 4. Spreadsheet Creator Handler
  const handleGenerateSpreadsheet = () => {
    if (!spreadsheetPrompt.trim()) return;
    setIsGeneratingSpreadsheet(true);
    setSpreadsheetHeaders([]);
    setSpreadsheetRows([]);
    setTimeout(() => {
      const headers = ["Quarter Period", "Engine Token Load", "API Gateway Costs", "SLA Ingress (GB)", "Est. Revenue"];
      const rows = [
        ["Q1 2026", 145200, "$1,452.00", 240, "$15,200.00"],
        ["Q2 2026", 189400, "$1,894.00", 310, "$22,400.00"],
        ["Q3 2026", 245000, "$2,450.00", 400, "$31,000.00"],
        ["Q4 2026", 320000, "$3,200.00", 520, "$44,500.00"]
      ];
      setSpreadsheetHeaders(headers);
      setSpreadsheetRows(rows);
      setIsGeneratingSpreadsheet(false);
      showToast("Financial data spreadsheet synthesized perfectly.");
    }, 1800);
  };

  // 5. Agent Builder Creator Handler
  const handleBuildAgent = () => {
    if (!agentName.trim()) return;
    setIsBuildingAgent(true);
    setTimeout(() => {
      const newAgent = {
        name: agentName,
        objective: agentObjective,
        tools: [...agentTools],
        isRunning: true,
        model: agentModel
      };
      setBuiltAgents([newAgent, ...builtAgents]);
      setIsBuildingAgent(false);
      setAgentName('');
      setAgentObjective('');
      showToast(`Provisioned active agent sentinel: ${newAgent.name}`);
    }, 1500);
  };

  // 6. Run Agent Swarm Demo
  const handleRunAgentSwarmDemo = () => {
    if (isRunningAgentDemo) return;
    setIsRunningAgentDemo(true);
    setActiveAgentLogs(["Initializing agent orchestration loop..."]);
    
    let step = 0;
    const logs = [
      "[Sentinel]: Launching comprehensive telemetry audit on active nodes...",
      "[Auditor]: Scanning syntax compilers... Zero vulnerability thresholds breached.",
      "[Sentinel]: Verified security levels. Ingesting memory semantics database...",
      "[Researcher]: Web search completed. Scraping competitor SaaS parameters...",
      "[Auditor]: Compilation passed. Packaging logs. Syncing node structure to active mainnet.",
      "[Sentinel]: All processes validated perfectly. Entering continuous-monitoring sleep state."
    ];

    const timer = setInterval(() => {
      if (step < logs.length) {
        setActiveAgentLogs(prev => [...prev, logs[step]]);
        step++;
      } else {
        clearInterval(timer);
        setIsRunningAgentDemo(false);
        showToast("Agent swarm operation complete.");
      }
    }, 1200);
  };

  const activeModelInfo = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  return (
    <div className={`relative w-full transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#050505] pt-4 p-4' : 'max-w-7xl mx-auto px-4 md:px-8 pb-10'}`}>
      
      {/* 1. TOP HEADER BRAND AND CONTROLS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-[#111111]/80 backdrop-blur-md p-4 rounded-3xl border border-white/[0.08] shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#22D3EE] flex items-center justify-center text-white shadow-md shadow-purple-500/10">
            <BrainCircuit className="w-5.5 h-5.5 text-white animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#22D3EE] text-[9px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#22D3EE]" />
              <span>Sovereign Active Node</span>
            </div>
            <h1 className="text-xl font-display font-black text-white tracking-tight flex items-center gap-1.5">
              KRONEX <span className="text-[#22D3EE]">AI Studio</span>
            </h1>
          </div>
        </div>

        {/* Dynamic Model Selector and Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar requested in top-bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search AI Studio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-2xl bg-[#050505]/60 border border-white/[0.08] text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] w-48 transition-all shadow-inner"
            />
          </div>

          {/* Model Selector requested in top-bar */}
          <div className="flex items-center space-x-1.5 bg-[#050505]/60 border border-white/[0.08] rounded-2xl px-3 py-2.5 shadow-sm">
            <Sliders className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-300 outline-none cursor-pointer"
            >
              {MODELS.map(m => (
                <option key={m.id} value={m.id} className="text-white bg-[#09090B]">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fullscreen & Save Controls */}
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 rounded-2xl border border-white/[0.08] bg-[#050505]/60 hover:bg-[#18181B] text-zinc-300 transition-all shadow-sm cursor-pointer"
            title="Toggle fullscreen workspace"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE MULTI-COLUMNS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Sidebar with New Chat, tabs etc */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          
          {/* New Chat Primary Call Action */}
          <button 
            onClick={handleNewChat}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-95 text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/10 cursor-pointer active:scale-98 transform transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>New Chat Session</span>
          </button>

          {/* Sidebar Tabs */}
          <div className="bg-[#111111]/80 border border-white/[0.08] rounded-3xl p-4.5 space-y-1.5 shadow-md">
            <span className="text-[9px] font-mono font-extrabold text-zinc-500 block uppercase tracking-widest px-2.5 mb-2.5">
              AI STUDIO SERVICES
            </span>
            {[
              { id: 'chat', label: 'AI Chat Room', icon: BrainCircuit, color: 'text-indigo-400 bg-indigo-500/10' },
              { id: 'prompt', label: 'Prompt Blueprint', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10' },
              { id: 'image', label: 'Art Synthesizer', icon: ImageIcon, color: 'text-cyan-400 bg-cyan-500/10' },
              { id: 'video', label: 'Video Generator', icon: Video, color: 'text-blue-400 bg-blue-500/10' },
              { id: 'voice-music', label: 'Sound & Voice Suite', icon: Music, color: 'text-pink-400 bg-pink-500/10' },
              { id: 'code', label: 'Code Assistant', icon: Code2, color: 'text-emerald-400 bg-emerald-500/10' },
              { id: 'documents', label: 'Docs & Presentations', icon: FileText, color: 'text-rose-400 bg-rose-500/10' },
              { id: 'spreadsheet', label: 'Spreadsheet Creator', icon: Table, color: 'text-teal-400 bg-teal-500/10' },
              { id: 'agent-builder', label: 'AI Agent Architect', icon: Bot, color: 'text-violet-400 bg-violet-500/10' },
              { id: 'history', label: 'Cognitive History', icon: History, color: 'text-zinc-400 bg-zinc-500/10' },
              { id: 'settings', label: 'Engine Config', icon: Settings, color: 'text-zinc-400 bg-zinc-500/10' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                     isActive 
                       ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-500/15 translate-x-1' 
                       : 'text-zinc-400 hover:text-white hover:bg-[#18181B]/50'
                   }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color.split(' ')[0]}`} />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              );
            })}
          </div>

          {/* Active Chats Sidebar history widget */}
          <div className="bg-[#111111]/80 border border-white/[0.08] rounded-3xl p-4.5 shadow-md">
            <span className="text-[9px] font-mono font-extrabold text-zinc-500 block uppercase tracking-widest px-2 mb-2">
              ACTIVE WORKSPACES
            </span>
            {sessions.length === 0 ? (
              <span className="text-[10px] italic text-zinc-500 block p-2">No active sessions.</span>
            ) : (
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                {sessions.map((s) => {
                  const isCurrent = s.id === activeSessionId;
                  const isRenaming = editingSessionId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => { setActiveSessionId(s.id); setActiveTab('chat'); }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        isCurrent 
                          ? 'bg-[#7C3AED]/10 border-[#7C3AED]/25 text-[#22D3EE]' 
                          : 'bg-transparent border-transparent hover:bg-[#18181B]/50 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate flex-grow">
                        <BrainCircuit className="w-3.5 h-3.5 shrink-0" />
                        {isRenaming ? (
                          <input 
                            type="text" 
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => saveRenameSession(s.id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveRenameSession(s.id)}
                            className="bg-[#050505] border border-white/[0.08] rounded px-1 text-white text-xs w-full focus:outline-none"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate">{s.title}</span>
                        )}
                      </div>
                      
                      {/* Save, Rename, Delete Buttons */}
                      <div className="flex items-center space-x-1 ml-1.5 shrink-0 opacity-80 hover:opacity-100">
                        {!isRenaming && (
                          <button 
                            onClick={(e) => startRenameSession(s.id, s.title, e)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
                            title="Rename Session"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => handleDeleteSession(s.id, e)}
                          className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"
                          title="Delete Session"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active workspace area */}
        <div className="col-span-1 lg:col-span-9 space-y-6">
          
          {/* Main workspace container */}
          <div className="bg-[#09090B]/90 border border-white/[0.08] rounded-3xl p-6 shadow-md relative min-h-[500px] flex flex-col justify-between overflow-hidden">
            
            {/* Ambient subtle light glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.02),transparent_50%)] pointer-events-none" />

            <AnimatePresence mode="wait">
              
              {/* TAB 1: DEDICATED CHAT ROOM */}
              {activeTab === 'chat' && activeSession && (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 flex flex-col h-[460px] justify-between"
                >
                  {/* Chat Bubbles Scroll container */}
                  <div className="flex-grow overflow-y-auto space-y-4 pr-1.5 bg-[#050505]/70 border border-white/[0.08] rounded-2xl p-4 shadow-inner max-h-[350px]">
                    {activeSession.messages.map((msg, i) => (
                      <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed border relative group transition-all ${
                          msg.role === 'user'
                            ? 'bg-[#7C3AED] text-white font-medium border-white/10 shadow-sm'
                            : 'bg-[#111111] border-white/[0.08] text-white shadow-sm'
                        }`}>
                          <div className="flex items-center justify-between gap-6 mb-1 text-[9px] font-mono font-bold uppercase tracking-wider opacity-60">
                            <span>{msg.role === 'user' ? 'DEVELOPER CLIENT' : `${msg.model || 'SYSTEM CORE'}`}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <div className="whitespace-pre-wrap select-text selection:bg-purple-900">
                            {msg.content}
                          </div>

                          {/* Individual Message Actions: Copy & Download */}
                          <div className={`absolute bottom-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#18181B]/90 backdrop-blur rounded-lg p-1 border border-white/[0.08] shadow ${msg.role === 'user' ? 'text-white' : 'text-zinc-300'}`}>
                            <button 
                              onClick={() => handleCopyText(msg.content, msg.id)}
                              className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                              title="Copy response text"
                            >
                              {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                            </button>
                            <button 
                              onClick={() => handleDownloadText(msg.content, `${activeSession.title}_message`)}
                              className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                              title="Download text file"
                            >
                              <Download className="w-3.5 h-3.5 text-zinc-400" />
                            </button>
                            {msg.role === 'assistant' && (
                              <button 
                                onClick={() => triggerTextToSpeech(msg.content)}
                                className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                                title="Speech Synthesize"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-4 text-xs text-zinc-400 animate-pulse flex items-center space-x-2 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-ping" />
                          <span>KRONEX compiling telemetry answers...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form area */}
                  <div className="flex gap-2 items-center">
                    {/* Voice input button toggle */}
                    <button 
                      onClick={toggleRecording}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isRecording 
                          ? 'bg-red-500 border-red-600 text-white animate-pulse' 
                          : 'bg-[#111111] border-white/[0.08] text-zinc-400 hover:bg-[#18181B] hover:text-white'
                      }`}
                      title="Toggle direct transcription mic"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <input 
                      type="text" 
                      placeholder={`Query KRONEX (${activeModelInfo.name}) ...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                      disabled={isGenerating}
                      className="flex-grow bg-[#050505] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-xs text-white outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] shadow-inner"
                    />

                    <button 
                      onClick={handleChatSubmit}
                      disabled={isGenerating || !chatInput.trim()}
                      className="px-6 py-3.5 rounded-2xl bg-[#7C3AED] hover:opacity-95 disabled:opacity-50 text-white font-display font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-purple-500/10 cursor-pointer active:scale-98"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Send</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: PROMPT BLUEPRINT EDITOR */}
              {activeTab === 'prompt' && (
                <motion.div 
                  key="prompt"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5 flex-grow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">SYSTEM COGNITIVE DIRECTIVE</label>
                        <textarea 
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          maxLength={300}
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-2xl p-3 text-xs text-white outline-none focus:border-[#7C3AED] h-20 resize-none shadow-inner"
                        />
                        <span className="text-[9px] font-mono text-zinc-500 text-right block mt-1">{systemPrompt.length}/300 chars</span>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">PRESET ACCELERATORS</label>
                        <div className="grid grid-cols-1 gap-1.5 h-20 overflow-y-auto pr-1">
                          {PRESET_ACCELERATORS.map((p, i) => (
                            <button
                              key={i}
                              onClick={() => setUserPrompt(p)}
                              className="p-2 text-left rounded-xl bg-[#111111] hover:bg-[#18181B] border border-white/[0.05] text-[10.5px] text-zinc-300 hover:text-[#22D3EE] truncate transition-all cursor-pointer font-medium"
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">PROMPT BLUEPRINT INPUT</label>
                      <div className="relative">
                        <textarea 
                          value={userPrompt}
                          onChange={(e) => setUserPrompt(e.target.value)}
                          placeholder="Type your strategic prompting logic here..."
                          className="w-full bg-[#050505] border border-white/[0.08] rounded-2xl p-4 text-xs text-white outline-none focus:border-[#7C3AED] h-24 resize-none pr-16 shadow-inner"
                        />
                        <button
                          onClick={handlePromptCompile}
                          disabled={isGenerating || !userPrompt.trim()}
                          className="absolute bottom-3.5 right-3.5 p-3 rounded-xl bg-[#7C3AED] text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-purple-500/10 animate-pulse"
                        >
                          {isGenerating ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block" /> : <Play className="w-4 h-4 text-white fill-current" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">STREAMING COMPILED BLUEPRINT OUTPUT</span>
                      {promptOutput && (
                        <button 
                          onClick={() => handleCopyText(promptOutput, 'prompt-output')}
                          className="text-[10px] font-mono text-[#7C3AED] hover:underline flex items-center space-x-1"
                        >
                          {copiedId === 'prompt-output' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === 'prompt-output' ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                    <div className="bg-[#050510] rounded-2xl p-4 min-h-[140px] font-mono text-[11px] text-[#A1A8C3] whitespace-pre-wrap select-text leading-relaxed border border-purple-500/10 shadow-inner">
                      {promptOutput ? promptOutput : "Ready for prompt compilation injection..."}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: ART SYNTHESIZER */}
              {activeTab === 'image' && (
                <motion.div 
                  key="image"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">IMAGE RENDERING PROMPT</label>
                      <textarea 
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="e.g. Ultra photorealistic neon-clad server computing nodes, cinematic fog, Unreal Engine 5 render..."
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-2xl p-3 text-xs text-white outline-none focus:border-[#7C3AED] h-24 resize-none shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">ART STYLE SELECTOR</label>
                        <select 
                          value={imageStyle} 
                          onChange={(e) => setImageStyle(e.target.value)}
                          className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none"
                        >
                          <option>Cinematic 3D render</option>
                          <option>Cyberpunk Synthwave</option>
                          <option>High-end Minimal Vector</option>
                          <option>Anime Concept Art</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">ASPECT RATIO</label>
                        <select 
                          value={imageRatio} 
                          onChange={(e) => setImageRatio(e.target.value)}
                          className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none"
                        >
                          <option>16:9 Cinema</option>
                          <option>1:1 Square</option>
                          <option>4:3 Desktop</option>
                          <option>9:16 Mobile</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage || !imagePrompt.trim()}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#7C3AED] hover:opacity-95 disabled:opacity-50 text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-purple-500/10"
                    >
                      {isGeneratingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating Art Telemetry...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 text-white" />
                          <span>Synthesize Art Blueprint</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/[0.08] rounded-3xl p-4 min-h-[260px] bg-[#050505]/70 relative overflow-hidden">
                    {isGeneratingImage ? (
                      <div className="text-center space-y-3">
                        <span className="block text-xs font-bold text-[#7C3AED] animate-pulse uppercase">COMPUTING DIGITAL PIXELS...</span>
                        <div className="w-48 bg-zinc-800 h-1.5 rounded-full overflow-hidden mx-auto">
                          <div className="bg-[#7C3AED] h-full animate-[loading_2s_infinite] w-1/2" />
                        </div>
                      </div>
                    ) : generatedImage ? (
                      <div className="relative group w-full h-full flex flex-col justify-between items-center">
                        <img 
                          src={generatedImage} 
                          alt="Generated AI" 
                          className="w-full max-h-[200px] rounded-2xl object-cover border border-white/[0.08] shadow"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex items-center space-x-2 mt-3 w-full justify-between px-2">
                          <span className="text-[10px] font-mono text-zinc-500">{imageStyle} • {imageRatio}</span>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleDownloadText(generatedImage, 'generated_art')}
                              className="p-1.5 bg-[#111111] rounded border border-white/[0.08] text-zinc-300 hover:bg-[#18181B] text-[10px] font-semibold flex items-center space-x-1 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Download</span>
                            </button>
                            <button 
                              onClick={handleShareText}
                              className="p-1.5 bg-[#111111] rounded border border-white/[0.08] text-zinc-300 hover:bg-[#18181B] text-[10px] font-semibold flex items-center space-x-1 cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-zinc-500 space-y-2">
                        <ImageIcon className="w-10 h-10 mx-auto text-zinc-700" />
                        <span className="block text-xs font-bold text-zinc-400">Art Canvas Ready</span>
                        <span className="block text-[10.5px] max-w-xs mx-auto leading-relaxed text-zinc-500">Configure your visual descriptions on the left and synthesize beautiful digital artifacts instantly.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: CODE ASSISTANT */}
              {activeTab === 'code' && (
                <motion.div 
                  key="code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 flex-grow flex flex-col justify-between"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">CODE ASSISTANT PROMPT</label>
                      <input 
                        type="text"
                        value={codePrompt}
                        onChange={(e) => setCodePrompt(e.target.value)}
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#7C3AED] shadow-inner font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">TARGET LANGUAGE</label>
                      <select 
                        value={codeLang}
                        onChange={(e) => setCodeLang(e.target.value)}
                        className="w-full bg-[#111111] border border-white/[0.08] rounded-2xl px-3 py-3 text-xs text-zinc-300 outline-none font-bold"
                      >
                        <option>TypeScript</option>
                        <option>Python</option>
                        <option>Rust</option>
                        <option>Go</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerateCode}
                    disabled={isGeneratingCode || !codePrompt.trim()}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#7C3AED] hover:opacity-95 disabled:opacity-50 text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-purple-500/10"
                  >
                    {isGeneratingCode ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block" /> : <Code2 className="w-4 h-4 text-white" />}
                    <span>{isGeneratingCode ? "Compiling source structure..." : "Synthesize Code Model"}</span>
                  </button>

                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">SYNTAX HIGHLIGHTED CODE</span>
                      {generatedCode && (
                        <button 
                          onClick={() => handleCopyText(generatedCode, 'code-output')}
                          className="text-[10px] font-mono text-[#7C3AED] hover:underline flex items-center space-x-1"
                        >
                          {copiedId === 'code-output' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === 'code-output' ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                    {/* Code sandbox viewport */}
                    <div className="bg-[#050512] rounded-2xl p-4.5 min-h-[200px] font-mono text-[11px] text-[#22D3EE] border border-purple-500/10 overflow-x-auto select-text leading-relaxed shadow-inner">
                      {generatedCode ? (
                        <pre>{generatedCode}</pre>
                      ) : (
                        <span className="text-zinc-500 italic">Waiting for developer parameter compilation...</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4.5: VIDEO GENERATOR */}
              {activeTab === 'video' && (
                <motion.div 
                  key="video"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-grow"
                >
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">Cinematic Video Prompt</label>
                      <textarea 
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        placeholder="e.g. Hyper-detailed aerial drone shot of futuristic neon Tokyo, cyberpunk skyline reflecting rain, high dynamic range..."
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-2xl p-3 text-xs text-white outline-none focus:border-[#7C3AED] h-28 resize-none shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">Artistic Style</label>
                        <select 
                          value={videoStyle} 
                          onChange={(e) => setVideoStyle(e.target.value)}
                          className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none"
                        >
                          <option>Cinematic Hyperlapse</option>
                          <option>3D Dreamscape Anime</option>
                          <option>80s Retro Synthwave</option>
                          <option>Photorealistic Drone</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">Resolution / FPS</label>
                        <select 
                          value={videoFPS} 
                          onChange={(e) => setVideoFPS(e.target.value)}
                          className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none"
                        >
                          <option>120 FPS Ultra-Slow</option>
                          <option>60 FPS Cinematic</option>
                          <option>30 FPS Documentary</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">Duration</label>
                      <div className="flex gap-2">
                        {['4 Seconds', '8 Seconds', '16 Seconds'].map((dur) => (
                          <button
                            key={dur}
                            onClick={() => setVideoDuration(dur)}
                            className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                              videoDuration === dur 
                                ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-[#22D3EE]' 
                                : 'bg-[#111111] border-white/[0.08] text-zinc-400 hover:bg-[#18181B] hover:text-white'
                            }`}
                          >
                            {dur}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerateVideo}
                      disabled={isGeneratingVideo || !videoPrompt.trim()}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-95 disabled:opacity-50 text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-purple-500/10"
                    >
                      {isGeneratingVideo ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Synthesizing Video Frames...</span>
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 text-white" />
                          <span>Generate Cinematic Video</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="lg:col-span-7 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.08] rounded-3xl p-4 min-h-[320px] bg-[#050505]/70 relative overflow-hidden">
                    {isGeneratingVideo ? (
                      <div className="text-center space-y-4">
                        <span className="block text-xs font-bold text-[#7C3AED] animate-pulse uppercase tracking-widest">COMPUTING PHOTONS & AI DEPTH...</span>
                        <div className="w-48 bg-zinc-800 h-1.5 rounded-full overflow-hidden mx-auto">
                          <div className="bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] h-full animate-[loading_2.5s_infinite] w-1/3" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 block">Estimated delay: ~2.5s</span>
                      </div>
                    ) : generatedVideoUrl ? (
                      <div className="relative group w-full h-full flex flex-col justify-between items-center space-y-4">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/[0.08] shadow-lg bg-black">
                          {/* Simulated video playback frame */}
                          <img 
                            src={generatedVideoUrl} 
                            alt="Generated AI Video" 
                            className="w-full h-full object-cover brightness-95 filter transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <button 
                              onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                            >
                              <Play className="w-6 h-6 text-[#7C3AED] fill-current" />
                            </button>
                          </div>
                          {isPlayingVideo && (
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white bg-black/40 px-2.5 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                PLAYING SIMULATED {videoFPS} HYPERLAPSE
                              </span>
                              <span>0:08</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 mt-2 w-full justify-between px-2">
                          <span className="text-[10px] font-mono text-zinc-500">{videoStyle} • {videoFPS} • {videoDuration}</span>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => showToast("Downloading compiled mp4 asset package...")}
                              className="p-2 bg-[#111111] rounded-xl border border-white/[0.08] text-zinc-300 hover:bg-[#18181B] text-[10px] font-semibold flex items-center space-x-1 shadow-sm cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Download</span>
                            </button>
                            <button 
                              onClick={handleShareText}
                              className="p-2 bg-[#111111] rounded-xl border border-white/[0.08] text-zinc-300 hover:bg-[#18181B] text-[10px] font-semibold flex items-center space-x-1 shadow-sm cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Share Blueprint</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-zinc-500 space-y-3.5">
                        <Video className="w-12 h-12 mx-auto text-zinc-700" />
                        <span className="block text-xs font-bold text-zinc-400">Video Canvas Standby</span>
                        <span className="block text-[10.5px] max-w-xs mx-auto leading-relaxed text-zinc-500">Formulate your cinematic directions. The KRONEX high-dimensional spatial framework compiles zero-overhead synthetic video segments instantly.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 4.6: SOUND & VOICE COMPOSER */}
              {activeTab === 'voice-music' && (
                <motion.div 
                  key="voice-music"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-grow"
                >
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">Soundtrack Synth Prompt</label>
                      <textarea 
                        value={musicPrompt}
                        onChange={(e) => setMusicPrompt(e.target.value)}
                        placeholder="e.g. Cyberpunk ambient techno, heavy sub-bass beats, futuristic space synth harmonics, 120 BPM..."
                        className="w-full bg-[#050505] border border-white/[0.08] rounded-2xl p-3 text-xs text-white outline-none focus:border-[#7C3AED] h-28 resize-none shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">Beat Style Preset</label>
                        <select 
                          value={musicStyle} 
                          onChange={(e) => setMusicStyle(e.target.value)}
                          className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none"
                        >
                          <option>Synthwave</option>
                          <option>Ambient Chill-Step</option>
                          <option>Lo-Fi Neo-classical</option>
                          <option>Industrial Cinematic Techno</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase mb-1.5">BPM ({musicBPM})</label>
                        <div className="p-1">
                          <input 
                            type="range" 
                            min="60" 
                            max="180" 
                            value={musicBPM}
                            onChange={(e) => setMusicBPM(parseInt(e.target.value))}
                            className="w-full accent-[#7C3AED]"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerateMusic}
                      disabled={isGeneratingMusic || !musicPrompt.trim()}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-95 disabled:opacity-50 text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-purple-500/10"
                    >
                      {isGeneratingMusic ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Synthesizing Soundwaves...</span>
                        </>
                      ) : (
                        <>
                          <Music className="w-4 h-4 text-white" />
                          <span>Synthesize Beat Track</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="lg:col-span-7 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-6 min-h-[320px] bg-[#070B19] text-white relative overflow-hidden">
                    <BackgroundParticles />
                    {isGeneratingMusic ? (
                      <div className="text-center space-y-4 relative z-10">
                        <span className="block text-xs font-mono text-[#22D3EE] animate-pulse font-bold tracking-widest">COMPILING FREQUENCIES & AUDIO CODES...</span>
                        <div className="flex justify-center items-end gap-1.5 h-12">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                            <div 
                              key={bar} 
                              className="w-2.5 bg-gradient-to-t from-[#7C3AED] to-[#22D3EE] rounded-full animate-pulse" 
                              style={{ 
                                height: `${Math.random() * 100}%`,
                                animationDuration: `${Math.random() * 0.5 + 0.3}s` 
                              }} 
                            />
                          ))}
                        </div>
                      </div>
                    ) : generatedMusicTitle ? (
                      <div className="relative z-10 w-full text-center space-y-6">
                        <div className="space-y-2">
                          <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20">
                            SOUNDTRACK BUILT ✓
                          </span>
                          <h4 className="text-md font-display font-black text-white">{generatedMusicTitle}</h4>
                          <p className="text-xs text-slate-400 font-mono">Dynamic Audio Synthesis Complete</p>
                        </div>

                        {/* Interactive audio frequency bars */}
                        <div className="flex justify-center items-end gap-1 h-14 max-w-sm mx-auto bg-black/40 p-4.5 rounded-2xl border border-white/5 shadow-inner">
                          {isPlayingMusic ? (
                            [20, 50, 80, 40, 90, 70, 30, 60, 45, 85, 30, 95, 55, 75, 40, 70].map((h, i) => (
                              <motion.div 
                                key={i}
                                animate={{ height: [10, h, 10] }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: i * 0.04,
                                  ease: "easeInOut"
                                }}
                                className="w-1.5 rounded-full bg-gradient-to-t from-[#7C3AED] to-[#22D3EE]"
                              />
                            ))
                          ) : (
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((h, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            ))
                          )}
                        </div>

                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                            className="px-6 py-2.5 bg-white text-[#070B19] rounded-xl font-display font-black text-xs uppercase tracking-wider cursor-pointer shadow-md hover:scale-102 active:scale-98 transition-all"
                          >
                            {isPlayingMusic ? "Mute Stream" : "Play Soundtrack"}
                          </button>
                          <button 
                            onClick={() => showToast("Exporting audio master files...")}
                            className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs cursor-pointer transition-all flex items-center gap-1.5"
                          >
                            <Download className="w-4 h-4 text-white" />
                            <span>Download WAV</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 space-y-3.5 relative z-10">
                        <Music className="w-12 h-12 mx-auto text-slate-500 animate-pulse" />
                        <span className="block text-xs font-bold text-white">Sovereign Sound Canvas Standby</span>
                        <span className="block text-[10.5px] max-w-xs mx-auto leading-relaxed text-slate-400 font-sans">Synthesize customized synth chords, soundtracks, and beats dynamically calibrated to your exact specified speed & mood.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 5: DOCS & AI PRESENTATIONS */}
              {activeTab === 'documents' && (
                <motion.div 
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-grow"
                >
                  {/* Left Column: Document Upload & Slide Generator Panel */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-4 bg-[#111111] border border-white/[0.08] rounded-3xl space-y-3 shadow-sm">
                      <span className="text-[9px] font-mono font-extrabold text-[#22D3EE] uppercase tracking-wider block">MODULE 1: SLIDE SHOW DECK</span>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase">Presentation Topic</label>
                          <input 
                            type="text" 
                            value={presentationTopic}
                            onChange={(e) => setPresentationTopic(e.target.value)}
                            className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#7C3AED] font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase">Theme Aesthetic</label>
                            <select 
                              value={presentationStyle}
                              onChange={(e) => setPresentationStyle(e.target.value)}
                              className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-[11px] text-zinc-300 outline-none font-bold"
                            >
                              <option>Dark Minimalist</option>
                              <option>Apple Neo-classic</option>
                              <option>Sovereign Electric</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={handleGeneratePresentation}
                              disabled={isGeneratingPresentation || !presentationTopic.trim()}
                              className="w-full py-1.5 px-3 bg-[#7C3AED] text-white hover:opacity-95 text-[11px] font-display font-black uppercase tracking-wider rounded-xl cursor-pointer"
                            >
                              {isGeneratingPresentation ? "Building..." : "Build Deck"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#111111] border border-white/[0.08] rounded-3xl space-y-3 shadow-sm">
                      <span className="text-[9px] font-mono font-extrabold text-[#22D3EE] uppercase tracking-wider block">MODULE 2: DOCUMENT ANALYZER</span>
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                          isDragging ? 'border-[#7C3AED] bg-[#7C3AED]/10' : 'border-white/[0.08] hover:border-white/[0.15] bg-[#050505]'
                        }`}
                      >
                        <input 
                          type="file" 
                          id="file-upload-input-playground" 
                          className="hidden" 
                          accept=".pdf,.docx,.txt,.jpg,.png"
                          onChange={handleFileSelect}
                        />
                        <Upload className="w-6 h-6 mx-auto text-zinc-500 mb-1" />
                        <button 
                          onClick={() => document.getElementById('file-upload-input-playground')?.click()}
                          className="px-3 py-1.5 bg-[#111111] border border-white/[0.08] rounded-lg text-[10px] font-bold text-zinc-300 hover:bg-[#18181B] cursor-pointer"
                        >
                          Upload File
                        </button>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-1.5 max-h-[80px] overflow-y-auto">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] bg-[#050505] p-2 rounded-lg border border-white/[0.08]">
                              <span className="truncate max-w-[120px] font-semibold text-white">{file.name}</span>
                              <button 
                                onClick={() => {
                                  setUserPrompt(file.parsedText || '');
                                  setActiveTab('prompt');
                                  showToast("Synced document data to prompts.");
                                }}
                                className="text-[#22D3EE] font-bold hover:underline"
                              >
                                Sync
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Slide Presentation Viewer Canvas */}
                  <div className="lg:col-span-7 flex flex-col justify-between border border-white/[0.08] bg-[#111111] rounded-3xl p-6 min-h-[340px] text-white relative overflow-hidden">
                    {isGeneratingPresentation ? (
                      <div className="text-center space-y-4 my-auto">
                        <span className="block text-xs font-mono text-[#22D3EE] animate-pulse font-bold tracking-widest">RENDERING DYNAMIC PRESENTATION METRIC DECK...</span>
                        <div className="w-48 bg-white/10 h-1 rounded-full overflow-hidden mx-auto">
                          <div className="bg-[#22D3EE] h-full animate-[loading_2s_infinite] w-1/2" />
                        </div>
                      </div>
                    ) : generatedSlides.length > 0 ? (
                      <div className="flex flex-col justify-between h-full space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">{presentationStyle} THEME VIEW</span>
                          <span className="px-2.5 py-0.5 rounded bg-white/10 border border-white/20 text-[9.5px] font-mono">SLIDE {currentSlideIndex + 1} OF {generatedSlides.length}</span>
                        </div>

                        <div className="space-y-4 py-4 flex-grow flex flex-col justify-center">
                          <h3 className="text-md md:text-lg font-display font-black text-[#22D3EE] leading-tight uppercase">
                            {generatedSlides[currentSlideIndex].title}
                          </h3>
                          <ul className="space-y-2.5 pl-4 list-disc text-zinc-300 text-xs leading-relaxed font-sans">
                            {generatedSlides[currentSlideIndex].points.map((pt, index) => (
                              <li key={index} className="font-medium">{pt}</li>
                            ))}
                          </ul>
                          {generatedSlides[currentSlideIndex].note && (
                            <div className="mt-4 p-3 rounded-xl bg-[#050505] border border-white/[0.08] text-[10.5px] text-zinc-400 italic">
                              💡 Host Notes: {generatedSlides[currentSlideIndex].note}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-white/10">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                              disabled={currentSlideIndex === 0}
                              className="px-3 py-1.5 bg-[#18181B] border border-white/[0.08] rounded-xl text-[11px] font-bold text-white hover:bg-white/[0.12] disabled:opacity-50 transition-all cursor-pointer"
                            >
                              Previous Slide
                            </button>
                            <button 
                              onClick={() => setCurrentSlideIndex(prev => Math.min(generatedSlides.length - 1, prev + 1))}
                              disabled={currentSlideIndex === generatedSlides.length - 1}
                              className="px-3 py-1.5 bg-[#18181B] border border-white/[0.08] rounded-xl text-[11px] font-bold text-white hover:bg-white/[0.12] disabled:opacity-50 transition-all cursor-pointer"
                            >
                              Next Slide
                            </button>
                          </div>
                          <button 
                            onClick={() => showToast("Exporting Slide-Deck to dynamic Apple PPTX / PDF...")}
                            className="px-3 py-1.5 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white rounded-xl text-[11px] font-display font-black uppercase tracking-wider shadow-md cursor-pointer"
                          >
                            Export Slides
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-zinc-500 space-y-3.5 my-auto">
                        <FileText className="w-12 h-12 mx-auto text-zinc-700 animate-pulse" />
                        <span className="block text-xs font-bold text-white">Dynamic Slideshow Sandbox Ready</span>
                        <span className="block text-[10.5px] max-w-sm mx-auto leading-relaxed text-zinc-500 font-sans">Enter a strategic topic in the Left Side-panel to compile a beautiful, zero-latency slide presentation deck instantly.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 5.5: SPREADSHEET CREATOR */}
              {activeTab === 'spreadsheet' && (
                <motion.div 
                  key="spreadsheet"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 flex-grow flex flex-col justify-between"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      value={spreadsheetPrompt}
                      onChange={(e) => setSpreadsheetPrompt(e.target.value)}
                      placeholder="e.g. SaaS Cost and Revenue Projections 2026..."
                      className="flex-grow bg-[#050505] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-xs text-white outline-none focus:border-[#7C3AED] font-semibold"
                    />
                    <button 
                      onClick={handleGenerateSpreadsheet}
                      disabled={isGeneratingSpreadsheet || !spreadsheetPrompt.trim()}
                      className="px-6 py-3.5 rounded-2xl bg-[#7C3AED] hover:opacity-95 disabled:opacity-50 text-white font-display font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-purple-500/10 shrink-0 cursor-pointer"
                    >
                      {isGeneratingSpreadsheet ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating Table...</span>
                        </>
                      ) : (
                        <>
                          <Table className="w-4 h-4 text-white" />
                          <span>Synthesize Sheet</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-[#111111] shadow-inner min-h-[220px] flex flex-col justify-between">
                    {isGeneratingSpreadsheet ? (
                      <div className="text-center space-y-3.5 my-auto">
                        <span className="block text-xs font-mono text-[#7C3AED] animate-pulse font-bold">COMPUTING SPREADSHEET LOGIC CELLS...</span>
                        <div className="w-48 bg-[#050505] h-1.5 rounded-full overflow-hidden mx-auto">
                          <div className="bg-[#7C3AED] h-full animate-[loading_2s_infinite] w-1/2" />
                        </div>
                      </div>
                    ) : spreadsheetHeaders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#050505] border-b border-white/[0.08]">
                              {spreadsheetHeaders.map((hdr, i) => (
                                <th key={i} className="p-3.5 font-bold text-white font-mono uppercase tracking-wider text-[10px]">{hdr}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {spreadsheetRows.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-white/[0.08] hover:bg-[#18181B] transition-colors">
                                {row.map((val, cIdx) => (
                                  <td key={cIdx} className="p-3.5 text-zinc-300 font-semibold font-mono text-[11px]">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center text-zinc-500 space-y-2.5 my-auto">
                        <Table className="w-10 h-10 mx-auto text-zinc-700 animate-pulse" />
                        <span className="block text-xs font-bold text-zinc-400">Financial Spreadsheet Standby</span>
                        <span className="block text-[10.5px] max-w-xs mx-auto leading-relaxed text-zinc-500 font-sans">Configure financial projections, lists, or matrix parameters and execute compiled spreadsheet layouts with a single click.</span>
                      </div>
                    )}

                    {spreadsheetHeaders.length > 0 && (
                      <div className="p-4 bg-[#050505] border-t border-white/[0.08] flex justify-between items-center text-xs">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">EXCEL-ENGINE COMPILED ✓</span>
                        <button 
                          onClick={() => {
                            showToast("Exporting computed Excel CSV telemetry sheets...");
                          }}
                          className="px-4.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Download className="w-4 h-4 text-white" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 5.6: AGENT BUILDER ARCHITECT */}
              {activeTab === 'agent-builder' && (
                <motion.div 
                  key="agent-builder"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-grow"
                >
                  {/* Left panel: configure agent parameters */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-5 bg-[#111111] border border-white/[0.08] rounded-3xl space-y-4 shadow-sm">
                      <span className="text-[9px] font-mono font-extrabold text-[#22D3EE] uppercase tracking-wider block">PROVISION NEW ACTIVE COGNITIVE AGENT</span>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase">Agent Name</label>
                          <input 
                            type="text" 
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#7C3AED] font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase">Objective Goal</label>
                          <input 
                            type="text" 
                            value={agentObjective}
                            onChange={(e) => setAgentObjective(e.target.value)}
                            className="w-full bg-[#050505] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#7C3AED] font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase">Brain Model</label>
                            <select 
                              value={agentModel}
                              onChange={(e) => setAgentModel(e.target.value)}
                              className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-zinc-300 outline-none font-bold"
                            >
                              <option>gemini-2.5-pro</option>
                              <option>claude-3-5-sonnet</option>
                              <option>gpt-5-5-preview</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase">Memory DB Type</label>
                            <select 
                              value={agentMemoryType}
                              onChange={(e) => setAgentMemoryType(e.target.value)}
                              className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-2 py-1.5 text-xs text-zinc-300 outline-none font-bold"
                            >
                              <option>Vector Semantic DB</option>
                              <option>Short-term Redis Cache</option>
                              <option>Infinite Context Mirror</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-bold text-zinc-500 block uppercase">Enabled Skill Tools</label>
                          <div className="flex flex-wrap gap-2 pt-0.5">
                            {['web_search', 'code_runner', 'file_reader', 'database_connector'].map((tool) => {
                              const hasTool = agentTools.includes(tool);
                              return (
                                <button
                                  key={tool}
                                  onClick={() => {
                                    if (hasTool) {
                                      setAgentTools(agentTools.filter(t => t !== tool));
                                    } else {
                                      setAgentTools([...agentTools, tool]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                    hasTool 
                                      ? 'bg-[#7C3AED]/10 border-[#7C3AED]/30 text-[#22D3EE]' 
                                      : 'bg-[#111111] border-white/[0.08] text-zinc-500 hover:bg-[#18181B] hover:text-zinc-300'
                                  }`}
                                >
                                  {tool.replace('_', ' ')}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={handleBuildAgent}
                        disabled={isBuildingAgent || !agentName.trim()}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-95 disabled:opacity-50 text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-purple-500/10"
                      >
                        {isBuildingAgent ? "Provisioning..." : "Provision Core Agent Node"}
                      </button>
                    </div>

                    <div className="p-4 bg-[#111111] border border-white/[0.08] rounded-2xl flex items-start space-x-2 text-[10px] font-mono text-zinc-500">
                      <Network className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                      <p>KRONEX Multi-Agent mesh networks communicate via unified encrypted socket handshakes allowing zero-latency parallel problem auditing.</p>
                    </div>
                  </div>

                  {/* Right panel: Active nodes & Swarm simulation console */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="p-4.5 bg-[#111111] border border-white/[0.08] rounded-3xl space-y-3 shadow-sm">
                      <span className="text-[9px] font-mono font-extrabold text-[#22D3EE] uppercase tracking-wider block">ACTIVE SOVEREIGN SENTINEL SWARM</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {builtAgents.map((agent, i) => (
                          <div key={i} className="p-3 bg-[#050505] border border-white/[0.08] rounded-2xl flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-white uppercase tracking-tight">{agent.name}</span>
                                <span className={`w-2 h-2 rounded-full ${agent.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                              </div>
                              <span className="text-[9px] font-mono text-zinc-500 block uppercase">Objective:</span>
                              <p className="text-[10.5px] text-zinc-400 leading-normal">{agent.objective}</p>
                            </div>
                            <div className="pt-2 border-t border-white/[0.08] mt-2 flex justify-between items-center text-[9px] font-mono text-zinc-500">
                              <span>MODEL: {agent.model}</span>
                              <span className="text-[#22D3EE] font-bold uppercase">{agent.tools.join(' • ')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shell simulation logger */}
                    <div className="p-4 bg-[#050505] border border-white/[0.08] rounded-3xl space-y-3.5 shadow-inner text-white">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[9.5px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                          SWARM ORCHESTRATION CONSOLE // SLA SECURITY BOUNDS
                        </span>
                        <button 
                          onClick={handleRunAgentSwarmDemo}
                          disabled={isRunningAgentDemo}
                          className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-mono hover:bg-emerald-500/20 disabled:opacity-50 transition-all cursor-pointer"
                        >
                          {isRunningAgentDemo ? "Orchestrating..." : "Execute Swarm Demo"}
                        </button>
                      </div>

                      <div className="font-mono text-[10px] space-y-1 max-h-[140px] overflow-y-auto pr-1">
                        {activeAgentLogs.length === 0 ? (
                          <p className="text-slate-500 italic">No logs parsed. Click 'Execute Swarm Demo' to monitor active nodes...</p>
                        ) : (
                          activeAgentLogs.map((log, index) => (
                            <p 
                              key={index} 
                              className={
                                log.includes('[Sentinel]') 
                                  ? 'text-indigo-400' 
                                  : log.includes('[Auditor]') 
                                  ? 'text-emerald-400' 
                                  : log.includes('[Researcher]') 
                                  ? 'text-cyan-400' 
                                  : 'text-slate-400'
                              }
                            >
                              {log}
                            </p>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 7: FULL HISTORY & ANALYTICS */}
              {activeTab === 'history' && (
                <motion.div 
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase block tracking-wider">AI Studio History & Analytics</h3>
                    <p className="text-xs text-slate-500 mt-1">Review the historical compilation telemetry and cognitive performance logs.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Active Tokens", value: "142.5K", status: "+12.4% vs last week" },
                      { label: "Compiler Passes", value: "2,410", status: "100% integrity score" },
                      { label: "Average Delay", value: "12.4ms", status: "Optimum response speed" },
                      { label: "SLA Compliant", value: "99.99%", status: "Zero core disruptions" }
                    ].map((card, i) => (
                      <div key={i} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl shadow-inner text-center">
                        <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider">{card.label}</span>
                        <span className="text-xl font-display font-black text-slate-800 block mt-2">{card.value}</span>
                        <span className="text-[9px] font-mono text-emerald-600 block mt-1.5 font-bold">{card.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4.5 bg-[#050510] border border-purple-500/10 rounded-2xl space-y-2 font-mono text-[10.5px] text-slate-400">
                    <span className="block text-[#7C3AED] font-bold border-b border-white/5 pb-1.5 uppercase">SYSTEM METRIC TELEMETRY LOGS</span>
                    <div className="space-y-1">
                      <p className="text-emerald-400">[12:00:23] - SSL Dynamic integrity handshake validated.</p>
                      <p className="text-blue-400">[11:45:10] - Cached model weights loaded cleanly (gemini-2.5-pro).</p>
                      <p className="text-purple-400">[10:14:02] - Autonomous sandbox registration successful across 12 zones.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 8: ENGINE CONFIG & SECURE SETTINGS */}
              {activeTab === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-700 uppercase block tracking-wider">AI Temperature Configuration</h3>
                      <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5 shadow-inner">
                        <div className="flex justify-between font-mono text-xs font-semibold">
                          <span className="text-slate-500">Active temperature:</span>
                          <span className="text-[#7C3AED]">{temperature}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="1.0" 
                          step="0.05" 
                          value={temperature}
                          onChange={(e) => setTemperature(parseFloat(e.target.value))}
                          className="w-full accent-[#7C3AED] bg-slate-200 h-1.5 rounded-lg cursor-pointer"
                        />
                        <p className="text-[10.5px] text-slate-500 leading-normal">Higher settings provide more unique creative deviations, while lower settings produce deterministic, logical answers.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-700 uppercase block tracking-wider">Aura voice Synthesizer voice</h3>
                      <div className="p-4.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-inner">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 block uppercase">Synthetic Speaker Model</label>
                          <select 
                            value={selectedVoice} 
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-700 outline-none"
                          >
                            <option>Aura-Male-Deep</option>
                            <option>Aura-Female-Soft</option>
                            <option>Nova-Sovereign-Neutral</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => triggerTextToSpeech("Welcome to the KRONEX audio generation module.")}
                            className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            Test speaker output
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-500/5 border border-[#7C3AED]/10 rounded-2xl flex items-start space-x-2 text-[10.5px] font-mono text-slate-500">
                    <Shield className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                    <p>All intelligence metrics and secure sandbox connections are encrypted on the client and parsed securely via regional API routes.</p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dynamic Toast feedback Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white border border-white/10 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-mono font-bold"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
