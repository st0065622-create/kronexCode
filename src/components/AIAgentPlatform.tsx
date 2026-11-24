import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Plus, Search, Sparkles, Sliders, Database, Cpu, HardDrive, Zap, 
  Terminal, Play, Square, MessageSquare, Mic, FileText, Brain, Clock, 
  RefreshCw, CheckCircle2, Copy, Share2, Trash2, Edit3, Shield, Key, 
  Volume2, VolumeX, Radio, Globe, Calculator, Image as ImageIcon, Code, 
  Layers, ChevronRight, X, Download, ArrowUpRight, Upload, AlertCircle, 
  Settings, Server, Activity, ArrowRight, Lock, Check, Users, User, 
  Gauge, SlidersHorizontal, Heart, BarChart3, Filter, PlayCircle, Eye, 
  EyeOff, FileJson, FolderPlus, Wrench, ShieldAlert, Wifi, Power, Layers3,
  ListTodo, Repeat, Sparkle, ArrowLeftRight, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AIAgent, KnowledgeFile, AgentMemoryItem, AgentTask, AgentAutomation, 
  AgentIntegration, AgentWorkflowRule, MultiAgentTeam 
} from '../types';
import { DEFAULT_AGENTS, DEFAULT_INTEGRATIONS, DEFAULT_WORKFLOWS, DEFAULT_TEAMS } from '../data';
import { soundManager } from '../utils/sound';

interface AIAgentPlatformProps {
  onNavigateTab?: (tab: string) => void;
}

export default function AIAgentPlatform({ onNavigateTab }: AIAgentPlatformProps) {
  // Page Loading Skeleton State
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Main State Persistence
  const [agents, setAgents] = useState<AIAgent[]>(() => {
    try {
      const saved = localStorage.getItem('kronex_ai_agents');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure legacy items have valid structure
        return parsed.map((a: any) => ({
          category: 'General',
          capabilities: {
            memory: true, webSearch: true, vision: true, voice: true,
            fileAnalysis: true, imageGen: true, codeExecution: true,
            automation: true, apiCalls: true
          },
          voiceSettings: {
            wakeWord: 'Hey Kronex', voiceName: 'Neural Cyber Voice',
            pushToTalk: false, speechRate: 1.0, speechPitch: 1.0
          },
          ...a
        }));
      }
    } catch (e) {}
    return DEFAULT_AGENTS;
  });

  const [integrations, setIntegrations] = useState<AgentIntegration[]>(() => {
    try {
      const saved = localStorage.getItem('kronex_ai_integrations');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_INTEGRATIONS;
  });

  const [workflows, setWorkflows] = useState<AgentWorkflowRule[]>(() => {
    try {
      const saved = localStorage.getItem('kronex_ai_workflows');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_WORKFLOWS;
  });

  const [teams, setTeams] = useState<MultiAgentTeam[]>(() => {
    try {
      const saved = localStorage.getItem('kronex_ai_teams');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_TEAMS;
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('kronex_ai_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('kronex_ai_integrations', JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem('kronex_ai_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('kronex_ai_teams', JSON.stringify(teams));
  }, [teams]);

  // Main Navigation Tabs
  const [mainTab, setMainTab] = useState<'dashboard' | 'directory' | 'integrations' | 'automations' | 'teams'>('dashboard');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('All');

  // Active Workspace Agent
  const [activeWorkspaceAgent, setActiveWorkspaceAgent] = useState<AIAgent | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<'playground' | 'voice' | 'capabilities' | 'memory' | 'automations' | 'teams' | 'integrations' | 'profile'>('playground');

  // Builder Modal State
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Agent Form State
  const [formData, setFormData] = useState<Partial<AIAgent>>({
    name: '',
    avatar: '🤖',
    coverBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description: '',
    category: 'Coding',
    systemPrompt: 'You are an autonomous KRONEX AI Agent designed to execute multi-step cognitive workflows.',
    personality: 'Professional',
    model: 'Gemini',
    temperature: 0.3,
    memoryEnabled: true,
    capabilities: {
      memory: true,
      webSearch: true,
      vision: true,
      voice: true,
      fileAnalysis: true,
      imageGen: true,
      codeExecution: true,
      automation: true,
      apiCalls: true
    },
    voiceSettings: {
      wakeWord: 'Hey Kronex',
      voiceName: 'Neural Cyber Voice',
      pushToTalk: false,
      speechRate: 1.0,
      speechPitch: 1.0
    },
    tools: ['web_search', 'code_interpreter', 'calculator'],
    apiKey: '',
    knowledgeFiles: [],
    memoryItems: [],
    tasks: [],
    automations: []
  });

  const openCreateModal = () => {
    setEditingAgent(null);
    setFormData({
      name: '',
      avatar: '🤖',
      coverBanner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      description: '',
      category: 'Coding',
      systemPrompt: 'You are an autonomous KRONEX AI Agent designed to execute multi-step cognitive workflows.',
      personality: 'Professional',
      model: 'Gemini',
      temperature: 0.3,
      memoryEnabled: true,
      capabilities: {
        memory: true, webSearch: true, vision: true, voice: true,
        fileAnalysis: true, imageGen: true, codeExecution: true,
        automation: true, apiCalls: true
      },
      voiceSettings: {
        wakeWord: 'Hey Kronex', voiceName: 'Neural Cyber Voice',
        pushToTalk: false, speechRate: 1.0, speechPitch: 1.0
      },
      tools: ['web_search', 'code_interpreter', 'calculator'],
      apiKey: '',
      knowledgeFiles: [],
      memoryItems: [],
      tasks: [],
      automations: []
    });
    setIsBuilderModalOpen(true);
    soundManager.playMenuOpen();
  };

  const openEditModal = (agent: AIAgent) => {
    setEditingAgent(agent);
    setFormData(agent);
    setIsBuilderModalOpen(true);
    soundManager.playMenuOpen();
  };

  const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Please provide an Agent Name');
      return;
    }

    if (editingAgent) {
      setAgents(prev => prev.map(a => a.id === editingAgent.id ? { ...a, ...formData } as AIAgent : a));
      if (activeWorkspaceAgent?.id === editingAgent.id) {
        setActiveWorkspaceAgent(prev => prev ? { ...prev, ...formData } as AIAgent : null);
      }
      showToast(`Agent "${formData.name}" updated successfully!`);
    } else {
      const newAgent: AIAgent = {
        id: `agent-${Date.now()}`,
        name: formData.name || 'New Agent',
        avatar: formData.avatar || '🤖',
        coverBanner: formData.coverBanner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        description: formData.description || 'Custom autonomous AI Agent.',
        category: (formData.category as any) || 'General',
        systemPrompt: formData.systemPrompt || 'You are an autonomous AI assistant.',
        personality: (formData.personality as any) || 'Professional',
        model: (formData.model as any) || 'Gemini',
        temperature: formData.temperature ?? 0.3,
        memoryEnabled: formData.memoryEnabled ?? true,
        capabilities: formData.capabilities || {
          memory: true, webSearch: true, vision: true, voice: true,
          fileAnalysis: true, imageGen: true, codeExecution: true,
          automation: true, apiCalls: true
        },
        voiceSettings: formData.voiceSettings || {
          wakeWord: 'Hey Kronex', voiceName: 'Neural Cyber Voice',
          pushToTalk: false, speechRate: 1.0, speechPitch: 1.0
        },
        knowledgeFiles: formData.knowledgeFiles || [],
        tools: formData.tools || ['web_search'],
        apiKey: formData.apiKey || '',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        memoryItems: formData.memoryItems || [],
        tasks: formData.tasks || [],
        automations: formData.automations || []
      };
      setAgents(prev => [newAgent, ...prev]);
      showToast(`Agent "${newAgent.name}" deployed successfully!`);
    }

    setIsBuilderModalOpen(false);
    soundManager.playSuccess();
  };

  const handleDuplicateAgent = (agent: AIAgent) => {
    const clone: AIAgent = {
      ...agent,
      id: `agent-${Date.now()}`,
      name: `${agent.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAgents(prev => [clone, ...prev]);
    showToast(`Duplicated "${agent.name}"`);
    soundManager.playClick();
  };

  const handleDeleteAgent = (agentId: string, name: string) => {
    if (confirm(`Delete agent "${name}"? This action cannot be undone.`)) {
      setAgents(prev => prev.filter(a => a.id !== agentId));
      if (activeWorkspaceAgent?.id === agentId) {
        setActiveWorkspaceAgent(null);
      }
      showToast(`Agent "${name}" deleted.`);
      soundManager.playMenuClose();
    }
  };

  // Import / Export Agent JSON Config
  const handleExportConfig = (agent: AIAgent) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(agent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${agent.name.toLowerCase().replace(/\s+/g, '_')}_config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported configuration for ${agent.name}`);
  };

  const handleImportConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const imported = JSON.parse(evt.target?.result as string);
          if (imported.name && imported.systemPrompt) {
            const newAgent: AIAgent = {
              ...imported,
              id: `agent-${Date.now()}`,
              name: `${imported.name} (Imported)`,
              createdAt: new Date().toISOString().split('T')[0]
            };
            setAgents(prev => [newAgent, ...prev]);
            showToast(`Successfully imported agent "${newAgent.name}"!`);
          } else {
            showToast('Invalid agent JSON format.');
          }
        } catch (err) {
          showToast('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Filtered Agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.systemPrompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    const matchesModel = selectedModelFilter === 'All' || agent.model === selectedModelFilter;
    return matchesSearch && matchesCategory && matchesModel;
  });

  // Calculate System Stats
  const activeAgentsCount = agents.filter(a => a.status === 'active').length;
  const totalTasksCompleted = agents.reduce((acc, a) => acc + (a.tasks?.filter(t => t.status === 'completed').length || 0), 24);

  if (isInitialLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-white/5 rounded-3xl border border-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-white/5 rounded-3xl border border-white/10" />
            <div className="h-64 bg-white/5 rounded-3xl border border-white/10" />
            <div className="h-64 bg-white/5 rounded-3xl border border-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white relative min-h-screen">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 bg-[#0B1220]/95 border border-[#00D4FF]/50 text-white px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,212,255,0.3)] backdrop-blur-2xl flex items-center space-x-3"
          >
            <Sparkles className="w-5 h-5 text-[#00D4FF] animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-100">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVE WORKSPACE AGENT VIEW */}
      {activeWorkspaceAgent ? (
        <AgentWorkspace
          agent={activeWorkspaceAgent}
          onCloseWorkspace={() => setActiveWorkspaceAgent(null)}
          onUpdateAgent={(updated) => {
            setActiveWorkspaceAgent(updated);
            setAgents(prev => prev.map(a => a.id === updated.id ? updated : a));
          }}
          workspaceTab={workspaceTab}
          setWorkspaceTab={setWorkspaceTab}
          onEditAgent={() => openEditModal(activeWorkspaceAgent)}
          showToast={showToast}
          integrations={integrations}
          setIntegrations={setIntegrations}
          workflows={workflows}
          setWorkflows={setWorkflows}
          teams={teams}
          setTeams={setTeams}
          allAgents={agents}
          onExportConfig={() => handleExportConfig(activeWorkspaceAgent)}
        />
      ) : (
        /* MAIN AGENT PLATFORM HUB */
        <div className="space-y-8">
          
          {/* Header Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0B1220] via-[#0D182E] to-[#050816] border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#7B3EFF]/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00D4FF]/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[#00D4FF] text-xs font-mono font-bold uppercase tracking-wider">
                  <Bot className="w-4 h-4 text-[#00D4FF]" />
                  <span>KRONEX ENTERPRISE AGENT BUILDER v3.5</span>
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  Autonomous AI Agent System
                </h1>
                <p className="text-sm sm:text-base text-[#C9D4E8] font-sans leading-relaxed">
                  Build, test, and orchestrate multi-model cognitive agents with live web search, sandboxed code execution, vector memory, multi-agent collaboration, and n8n webhooks.
                </p>
              </div>

              {/* Header Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleImportConfig}
                  className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 font-mono text-xs font-bold text-slate-200 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#00D4FF]" />
                  <span>Import JSON</span>
                </button>

                <button
                  onClick={openCreateModal}
                  className="px-6 py-3.5 rounded-2xl font-display font-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#7B3EFF] via-[#00D9FF] to-[#00FFC8] text-slate-950 hover:opacity-95 shadow-lg shadow-cyan-500/25 transition-all flex items-center space-x-2 cursor-pointer hover:scale-102 active:scale-98"
                >
                  <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>Create Agent</span>
                </button>
              </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 overflow-x-auto font-mono text-xs">
              {[
                { id: 'dashboard', label: '📊 System Dashboard', icon: Gauge },
                { id: 'directory', label: '🤖 Agents Directory', icon: Bot },
                { id: 'integrations', label: '🔌 API Integrations', icon: Key },
                { id: 'automations', label: '⚡ Workflows & n8n', icon: Zap },
                { id: 'teams', label: '👥 Multi-Agent Teams', icon: Users }
              ].map(tab => {
                const isActive = mainTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setMainTab(tab.id as any);
                      soundManager.playClick();
                    }}
                    className={`px-4 py-2.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap font-bold flex items-center space-x-2 ${
                      isActive
                        ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF] shadow-lg shadow-cyan-500/10'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 1: SYSTEM DASHBOARD */}
          {mainTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#0B1220]/80 border border-white/10 rounded-2xl p-5 space-y-2 backdrop-blur-2xl">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
                    <span>TOTAL AGENTS</span>
                    <Bot className="w-4 h-4 text-[#00D4FF]" />
                  </div>
                  <div className="text-3xl font-display font-black text-white">{agents.length}</div>
                  <span className="text-[10px] font-mono text-emerald-400">100% Operational</span>
                </div>

                <div className="bg-[#0B1220]/80 border border-white/10 rounded-2xl p-5 space-y-2 backdrop-blur-2xl">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
                    <span>RUNNING AGENTS</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-display font-black text-emerald-400">{activeAgentsCount}</div>
                  <span className="text-[10px] font-mono text-slate-400">Active Loops</span>
                </div>

                <div className="bg-[#0B1220]/80 border border-white/10 rounded-2xl p-5 space-y-2 backdrop-blur-2xl">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
                    <span>TASKS COMPLETED</span>
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-display font-black text-purple-400">{totalTasksCompleted}</div>
                  <span className="text-[10px] font-mono text-purple-300">Automated Crons</span>
                </div>

                <div className="bg-[#0B1220]/80 border border-white/10 rounded-2xl p-5 space-y-2 backdrop-blur-2xl">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
                    <span>CONNECTED APIS</span>
                    <Wifi className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-display font-black text-amber-400">
                    {integrations.filter(i => i.connected).length} / {integrations.length}
                  </div>
                  <span className="text-[10px] font-mono text-amber-300">Vault Provisioned</span>
                </div>
              </div>

              {/* System Resource Gauges */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* CPU & Memory Gauge */}
                <div className="bg-[#0B1220]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#00D4FF]" />
                      <span>Cluster Hardware Utilization</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400">REALTIME 60FPS</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">CPU Load (16 Cores)</span>
                        <span className="text-[#00D4FF] font-bold">18.4%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-[18.4%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">RAM Allocation</span>
                        <span className="text-purple-400 font-bold">4.2 GB / 32 GB</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-[24%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Vector Memory DB (Firestore)</span>
                        <span className="text-emerald-400 font-bold">1,840 Vectors</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full w-[40%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="lg:col-span-2 bg-[#0B1220]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <span>Realtime Agent Activity Stream</span>
                    </h3>
                    <button className="text-[10px] font-mono text-slate-400 hover:text-white">Refresh Log</button>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {[
                      { time: '10:32 AM', agent: 'KRONEX Sovereign Core', action: 'Executed Live Search Grounding for AI Studio API updates', status: 'success' },
                      { time: '10:15 AM', agent: 'Jarvis Full-Stack Engineer', action: 'Refactored React components and generated 12 unit tests', status: 'success' },
                      { time: '09:40 AM', agent: 'DeepSeek Quantum Analyst', action: 'Optimized PostgreSQL SQL query vector index in Cloud SQL', status: 'success' },
                      { time: '08:00 AM', agent: 'Socrates AI Mentor', action: 'Scheduled Socratic prompt engineering tutorial session', status: 'running' }
                    ].map((log, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <div>
                            <span className="text-white font-bold block">{log.agent}</span>
                            <span className="text-slate-400 text-[11px]">{log.action}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SECTION 2: AGENTS DIRECTORY */}
          {(mainTab === 'directory' || mainTab === 'dashboard') && (
            <div className="space-y-6">
              
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0B1220]/80 border border-white/10 p-4 rounded-2xl backdrop-blur-2xl">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search agents by name, category, prompt..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00D4FF]/50"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 font-mono text-[11px]">
                  <span className="text-slate-400 text-[10px] font-bold uppercase hidden lg:inline">Category:</span>
                  {['All', 'Coding', 'Research', 'Voice Tutor', 'Automation', 'Data', 'General'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF] font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className="bg-[#0B1220]/80 border border-white/10 hover:border-[#00D4FF]/50 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
                  >
                    <div className="space-y-4 relative z-10">
                      
                      {/* Avatar, Title & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                            {agent.avatar}
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-base text-white group-hover:text-[#00D4FF] transition-colors leading-snug">
                              {agent.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-[#00D4FF] text-[10px] font-mono font-bold uppercase">
                                {agent.model}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {agent.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                          agent.status === 'active' 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                          <span className="capitalize">{agent.status}</span>
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#C9D4E8] font-sans leading-relaxed line-clamp-3">
                        {agent.description}
                      </p>

                      {/* Tools Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {agent.tools.map(tool => (
                          <span key={tool} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[10px] font-mono text-slate-300 flex items-center space-x-1">
                            {tool === 'web_search' && <Globe className="w-3 h-3 text-cyan-400" />}
                            {tool === 'code_interpreter' && <Code className="w-3 h-3 text-purple-400" />}
                            {tool === 'calculator' && <Calculator className="w-3 h-3 text-emerald-400" />}
                            {tool === 'image_gen' && <ImageIcon className="w-3 h-3 text-amber-400" />}
                            {tool === 'browser' && <Server className="w-3 h-3 text-indigo-400" />}
                            {tool === 'sql_database' && <Database className="w-3 h-3 text-rose-400" />}
                            <span className="capitalize">{tool.replace('_', ' ')}</span>
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between gap-2 relative z-10">
                      <button
                        onClick={() => {
                          setActiveWorkspaceAgent(agent);
                          soundManager.playClick();
                        }}
                        className="flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-[#00D4FF]/20 hover:border-[#00D4FF]/40 border border-white/10 text-white transition-all flex items-center justify-center space-x-2 cursor-pointer group/btn"
                      >
                        <span>Launch Agent</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#00D4FF] group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openEditModal(agent)}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                          title="Edit Config"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleExportConfig(agent)}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                          title="Export Configuration"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                        </button>

                        <button
                          onClick={() => handleDeleteAgent(agent.id, agent.name)}
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
                          title="Delete Agent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </div>

            </div>
          )}

          {/* SECTION 4: INTEGRATIONS VAULT */}
          {mainTab === 'integrations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-2xl text-white">API Integrations & Key Vault</h2>
                  <p className="text-xs text-slate-400 font-mono">Connect model providers, image generators, database backends, and webhooks.</p>
                </div>
                <button
                  onClick={() => showToast('All API connection statuses verified.')}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span>Test All Vault Keys</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map(int => (
                  <div key={int.id} className="bg-[#0B1220]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                          <Key className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm text-white">{int.name}</h3>
                          <span className="text-[10px] font-mono text-slate-400">{int.provider}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIntegrations(prev => prev.map(i => i.id === int.id ? { ...i, connected: !i.connected, status: !i.connected ? 'connected' : 'disconnected' } : i));
                          showToast(`${int.name} ${!int.connected ? 'Connected' : 'Disconnected'}`);
                        }}
                        className={`px-3 py-1 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                          int.connected 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        {int.connected ? 'CONNECTED' : 'DISCONNECT'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-sans">{int.description}</p>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase">API Key Token</label>
                      <input
                        type="password"
                        value={int.apiKey || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setIntegrations(prev => prev.map(i => i.id === int.id ? { ...i, apiKey: val } : i));
                        }}
                        placeholder="Paste API Key secret..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#00D4FF]"
                      />
                    </div>

                    {/* Ping Latency & Call Stats */}
                    <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                      <div>
                        <span>Ping Latency: </span>
                        <strong className="text-emerald-400">{int.latencyMs || 120} ms</strong>
                      </div>
                      <div>
                        <span>Total Calls: </span>
                        <strong className="text-cyan-400">{int.totalCalls || 0}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: AUTOMATIONS & WORKFLOWS */}
          {mainTab === 'automations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-2xl text-white">Automation Workflows & n8n Scheduler</h2>
                  <p className="text-xs text-slate-400 font-mono">Trigger-Condition-Action automation rules for autonomous agent execution.</p>
                </div>
                <button
                  onClick={() => {
                    const name = prompt('Workflow Name:');
                    if (!name) return;
                    const newWf: AgentWorkflowRule = {
                      id: `wf-${Date.now()}`,
                      name,
                      trigger: 'Webhook Event',
                      condition: 'Always true',
                      action: 'Execute Agent Task',
                      schedule: 'Realtime',
                      status: 'active',
                      logs: [{ timestamp: 'Just now', status: 'success', message: 'Workflow created successfully.' }]
                    };
                    setWorkflows(prev => [newWf, ...prev]);
                    showToast(`Created workflow "${name}"`);
                  }}
                  className="px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase bg-gradient-to-r from-[#7B3EFF] to-[#00D9FF] text-slate-950 shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Workflow</span>
                </button>
              </div>

              <div className="space-y-4">
                {workflows.map(wf => (
                  <div key={wf.id} className="bg-[#0B1220]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-6 h-6 text-[#00D4FF]" />
                        <div>
                          <h3 className="font-display font-bold text-base text-white">{wf.name}</h3>
                          <span className="text-xs font-mono text-slate-400">Schedule: {wf.schedule}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w));
                          showToast(`Workflow ${wf.status === 'active' ? 'Paused' : 'Activated'}`);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                          wf.status === 'active'
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        {wf.status.toUpperCase()}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                        <span className="text-[#00D4FF] font-bold block mb-1">TRIGGER</span>
                        <span className="text-white">{wf.trigger}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                        <span className="text-purple-400 font-bold block mb-1">CONDITION</span>
                        <span className="text-white">{wf.condition}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                        <span className="text-emerald-400 font-bold block mb-1">ACTION</span>
                        <span className="text-white">{wf.action}</span>
                      </div>
                    </div>

                    {/* Execution Logs */}
                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-2">Recent Execution Logs</span>
                      <div className="space-y-1">
                        {wf.logs.map((log, lIdx) => (
                          <div key={lIdx} className="bg-slate-950 p-2 rounded-xl text-[11px] font-mono flex items-center justify-between text-slate-300">
                            <span>{log.message}</span>
                            <span className="text-[9px] text-slate-500">{log.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: MULTI-AGENT TEAMS */}
          {mainTab === 'teams' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-2xl text-white">Multi-Agent Collaboration Teams</h2>
                  <p className="text-xs text-slate-400 font-mono">Assemble pods of specialized agents for consensus problem solving.</p>
                </div>
                <button
                  onClick={() => {
                    const name = prompt('Team Name:');
                    if (!name) return;
                    const newTeam: MultiAgentTeam = {
                      id: `team-${Date.now()}`,
                      name,
                      description: 'Custom multi-agent engineering pod.',
                      agentIds: agents.slice(0, 2).map(a => a.id),
                      roles: {},
                      sharedMemory: [],
                      status: 'idle'
                    };
                    setTeams(prev => [newTeam, ...prev]);
                    showToast(`Team "${name}" assembled.`);
                  }}
                  className="px-4 py-2.5 rounded-xl font-display font-bold text-xs uppercase bg-gradient-to-r from-[#7B3EFF] to-[#00D9FF] text-slate-950 shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Assemble New Team</span>
                </button>
              </div>

              <div className="space-y-6">
                {teams.map(team => (
                  <div key={team.id} className="bg-[#0B1220]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users className="w-6 h-6 text-[#00D4FF]" />
                        <div>
                          <h3 className="font-display font-bold text-lg text-white">{team.name}</h3>
                          <p className="text-xs text-slate-400">{team.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          showToast(`Team "${team.name}" started multi-agent debate session!`);
                        }}
                        className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] hover:bg-[#00D4FF]/30 transition-all cursor-pointer flex items-center space-x-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Session</span>
                      </button>
                    </div>

                    {/* Member Agents Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {team.agentIds.map(aId => {
                        const matched = agents.find(a => a.id === aId);
                        if (!matched) return null;
                        return (
                          <div key={aId} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{matched.avatar}</span>
                              <span className="font-bold text-xs text-white">{matched.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-cyan-400 block">{team.roles[aId] || 'Specialist Agent'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* CREATE / EDIT AGENT MODAL */}
      <AnimatePresence>
        {isBuilderModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0B1220] border border-[#00D4FF]/30 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden my-8"
            >
              <button
                onClick={() => setIsBuilderModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xl">
                  {formData.avatar || '🤖'}
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-white">
                    {editingAgent ? 'Edit Autonomous Agent' : 'Deploy New AI Agent'}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Configure parameters, system prompts, capabilities, and voice settings.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveAgent} className="space-y-5 text-xs font-sans">
                
                {/* Name & Avatar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3 space-y-1">
                    <label className="block font-mono font-bold text-[#00D4FF] text-[11px] uppercase">Agent Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sovereign Architecture Architect"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono font-bold text-[#00D4FF] text-[11px] uppercase">Avatar</label>
                    <input
                      type="text"
                      value={formData.avatar || '🤖'}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white text-center focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>
                </div>

                {/* Description & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-mono font-bold text-[#00D4FF] text-[11px] uppercase">Description</label>
                    <input
                      type="text"
                      placeholder="Brief overview of agent capabilities"
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono font-bold text-[#00D4FF] text-[11px] uppercase">Category</label>
                    <select
                      value={formData.category || 'Coding'}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono font-bold outline-none cursor-pointer focus:border-[#00D4FF]"
                    >
                      <option value="Coding" className="bg-[#0B1220]">Coding</option>
                      <option value="Research" className="bg-[#0B1220]">Research</option>
                      <option value="Voice Tutor" className="bg-[#0B1220]">Voice Tutor</option>
                      <option value="Automation" className="bg-[#0B1220]">Automation</option>
                      <option value="Creative" className="bg-[#0B1220]">Creative</option>
                      <option value="Data" className="bg-[#0B1220]">Data</option>
                      <option value="General" className="bg-[#0B1220]">General</option>
                    </select>
                  </div>
                </div>

                {/* System Prompt */}
                <div className="space-y-1">
                  <label className="block font-mono font-bold text-[#00D4FF] text-[11px] uppercase">System Prompt Instructions</label>
                  <textarea
                    rows={4}
                    value={formData.systemPrompt || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#00D4FF] leading-relaxed"
                  />
                </div>

                {/* Model & Personality */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono font-bold text-[#00D4FF] text-[11px] uppercase">LLM Model</label>
                    <select
                      value={formData.model || 'Gemini'}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value as any }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono font-bold outline-none cursor-pointer focus:border-[#00D4FF]"
                    >
                      <option value="Gemini" className="bg-[#0B1220]">Google Gemini 2.5 Flash</option>
                      <option value="Claude" className="bg-[#0B1220]">Anthropic Claude 3.5 Sonnet</option>
                      <option value="DeepSeek" className="bg-[#0B1220]">DeepSeek R1 Reasoner</option>
                      <option value="OpenAI" className="bg-[#0B1220]">OpenAI GPT-4o / o3-mini</option>
                      <option value="Grok" className="bg-[#0B1220]">xAI Grok 3</option>
                      <option value="Mistral" className="bg-[#0B1220]">Mistral Large</option>
                      <option value="Perplexity" className="bg-[#0B1220]">Perplexity Sonar Deep</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono font-bold text-[#00D4FF] text-[11px] uppercase">Personality Persona</label>
                    <select
                      value={formData.personality || 'Professional'}
                      onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value as any }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono outline-none cursor-pointer focus:border-[#00D4FF]"
                    >
                      <option value="Professional" className="bg-[#0B1220]">Professional</option>
                      <option value="Developer" className="bg-[#0B1220]">Developer</option>
                      <option value="Sovereign" className="bg-[#0B1220]">Sovereign</option>
                      <option value="Teacher" className="bg-[#0B1220]">Teacher</option>
                      <option value="Friendly" className="bg-[#0B1220]">Friendly</option>
                      <option value="Assistant" className="bg-[#0B1220]">Assistant</option>
                    </select>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsBuilderModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-mono text-xs uppercase"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#7B3EFF] via-[#00D9FF] to-[#00FFC8] text-slate-950 hover:opacity-90 shadow-lg"
                  >
                    {editingAgent ? 'Save Changes' : 'Deploy Agent'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

/* =========================================================================
   AGENT WORKSPACE SUB-COMPONENT
   ========================================================================= */

interface AgentWorkspaceProps {
  agent: AIAgent;
  onCloseWorkspace: () => void;
  onUpdateAgent: (updated: AIAgent) => void;
  workspaceTab: 'playground' | 'voice' | 'capabilities' | 'memory' | 'automations' | 'teams' | 'integrations' | 'profile';
  setWorkspaceTab: (tab: any) => void;
  onEditAgent: () => void;
  showToast: (msg: string) => void;
  integrations: AgentIntegration[];
  setIntegrations: React.Dispatch<React.SetStateAction<AgentIntegration[]>>;
  workflows: AgentWorkflowRule[];
  setWorkflows: React.Dispatch<React.SetStateAction<AgentWorkflowRule[]>>;
  teams: MultiAgentTeam[];
  setTeams: React.Dispatch<React.SetStateAction<MultiAgentTeam[]>>;
  allAgents: AIAgent[];
  onExportConfig: () => void;
}

function AgentWorkspace({
  agent,
  onCloseWorkspace,
  onUpdateAgent,
  workspaceTab,
  setWorkspaceTab,
  onEditAgent,
  showToast,
  integrations,
  setIntegrations,
  workflows,
  setWorkflows,
  teams,
  setTeams,
  allAgents,
  onExportConfig
}: AgentWorkspaceProps) {
  
  // Playground Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; text: string; toolExecution?: string; timestamp: string }>>([
    {
      id: 'm-0',
      role: 'assistant',
      text: `Greetings! I am ${agent.name} (${agent.model} Engine). My neural capabilities and memory store are online. How can I assist you?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const userMsg = {
      id: `m-${Date.now()}`,
      role: 'user' as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    soundManager.playMessageSent();

    let toolStep = '';
    if (userText.toLowerCase().includes('search') || userText.toLowerCase().includes('news')) {
      toolStep = `[Live Web Search: Grounding queries via ${agent.model} API...]`;
    } else if (userText.toLowerCase().includes('code') || userText.toLowerCase().includes('function')) {
      toolStep = `[Code Execution: Running sandboxed Python/TypeScript environment...]`;
    }

    setTimeout(() => {
      let replyText = `I have processed "${userText}" using ${agent.model} model architecture with temperature ${agent.temperature}. System prompt persona (${agent.personality}) maintained. All active capabilities and knowledge bases integrated into context.`;

      if (userText.toLowerCase().includes('code')) {
        replyText = "```typescript\n// Generated by " + agent.name + "\nexport async function executeNeuralTask(input: string) {\n  console.log(\"KRONEX Agent System:\", input);\n  return { success: true, timestamp: Date.now() };\n}\n```\nHere is the verified code implementation satisfying your request.";
      }

      const assistantMsg = {
        id: `m-${Date.now() + 1}`,
        role: 'assistant' as const,
        text: replyText,
        toolExecution: toolStep,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      setIsGenerating(false);
      soundManager.playMessageReceived();
    }, 1100);
  };

  // Voice State
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Add Memory
  const [newMemKey, setNewMemKey] = useState('');
  const [newMemVal, setNewMemVal] = useState('');
  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemKey.trim() || !newMemVal.trim()) return;

    const newItem: AgentMemoryItem = {
      id: `mem-${Date.now()}`,
      key: newMemKey.trim(),
      value: newMemVal.trim(),
      category: 'User Preference',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onUpdateAgent({ ...agent, memoryItems: [...(agent.memoryItems || []), newItem] });
    setNewMemKey('');
    setNewMemVal('');
    showToast('Memory item added!');
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Top Header */}
      <div className="bg-[#0B1220]/90 border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onCloseWorkspace}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
            title="Back to Agent Hub"
          >
            <ChevronRight className="w-5 h-5 rotate-180 text-[#00D4FF]" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-black text-lg text-white">{agent.name}</h2>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-[#00D4FF] text-[10px] font-mono font-bold uppercase">
                  {agent.model}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans line-clamp-1">{agent.description}</p>
            </div>
          </div>
        </div>

        {/* Header Control Buttons */}
        <div className="flex items-center space-x-2 justify-end">
          <button
            onClick={onEditAgent}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Edit Config</span>
          </button>

          <button
            onClick={onExportConfig}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export JSON</span>
          </button>
        </div>

      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto font-mono text-xs">
        {[
          { id: 'playground', label: '🎮 Playground & Chat', icon: MessageSquare },
          { id: 'voice', label: '🎙️ Voice AI Studio', icon: Mic },
          { id: 'capabilities', label: '⚡ Capabilities & Tools', icon: Wrench },
          { id: 'memory', label: '🧠 Memory & Documents', icon: Brain },
          { id: 'automations', label: '🔄 Automations & n8n', icon: Zap },
          { id: 'teams', label: '👥 Multi-Agent Mode', icon: Users },
          { id: 'integrations', label: '🔌 Integrations', icon: Key },
          { id: 'profile', label: '👤 Profile & Banner', icon: User }
        ].map(tab => {
          const isActive = workspaceTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setWorkspaceTab(tab.id as any);
                soundManager.playClick();
              }}
              className={`px-4 py-2.5 rounded-2xl border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 font-bold ${
                isActive 
                  ? 'bg-gradient-to-r from-[#7B3EFF]/20 to-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF] shadow-lg shadow-cyan-500/10' 
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* WORKSPACE TAB CONTENT CONTAINER */}
      <div className="bg-[#0B1220]/80 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl min-h-[480px]">
        
        {/* 1. PLAYGROUND & CHAT STREAM */}
        {workspaceTab === 'playground' && (
          <div className="flex flex-col h-[520px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {msg.role === 'user' ? 'You' : agent.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">{msg.timestamp}</span>
                  </div>

                  {msg.toolExecution && (
                    <div className="text-[10px] font-mono text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/20 px-3 py-1 rounded-xl mb-1.5 animate-pulse">
                      {msg.toolExecution}
                    </div>
                  )}

                  <div className={`p-4 rounded-2xl max-w-2xl leading-relaxed font-sans ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#7B3EFF] to-[#00D9FF] text-white rounded-tr-none shadow-md'
                      : 'bg-white/5 border border-white/10 text-slate-100 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center space-x-2 text-xs font-mono text-[#00D4FF] bg-cyan-500/10 p-3 rounded-2xl border border-cyan-400/20 max-w-max animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  <span>{agent.name} is reasoning & processing tools...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSendMessage} className="pt-4 border-t border-white/10 flex items-center space-x-3">
              <input
                type="text"
                placeholder={`Test prompt or command for ${agent.name}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4FF]"
              />
              <button
                type="submit"
                disabled={isGenerating || !inputMessage.trim()}
                className="px-6 py-3 rounded-2xl font-display font-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#7B3EFF] via-[#00D9FF] to-[#00FFC8] text-slate-950 disabled:opacity-40 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* 2. VOICE AI STUDIO */}
        {workspaceTab === 'voice' && (
          <div className="space-y-6 text-center py-6">
            <div className="max-w-md mx-auto space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[#00D4FF] text-[10px] font-mono font-bold uppercase">
                PUSH-TO-TALK & WAKE WORD ENGINE
              </span>
              <h3 className="font-display font-black text-2xl text-white">Voice AI Conversation Studio</h3>
              <p className="text-xs text-slate-400 font-sans">
                Wake Word: <strong className="text-emerald-400 font-mono">"{agent.voiceSettings?.wakeWord || 'Hey Kronex'}"</strong>
              </p>
            </div>

            <div className="flex justify-center py-6">
              <button
                onClick={() => {
                  setIsVoiceListening(!isVoiceListening);
                  soundManager.playVoiceActivation();
                  showToast(isVoiceListening ? 'Voice stopped.' : 'Listening to microphone...');
                }}
                className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer ${
                  isVoiceListening 
                    ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_50px_rgba(244,63,94,0.6)]' 
                    : 'bg-gradient-to-tr from-[#7B3EFF] via-[#00D9FF] to-[#00FFC8] text-slate-950 shadow-[0_0_50px_rgba(0,217,255,0.6)]'
                }`}
              >
                <Mic className="w-12 h-12" />
              </button>
            </div>

            <p className="text-xs font-mono text-cyan-400 font-bold uppercase">
              {isVoiceListening ? 'RECORDING... SPEAK NOW' : 'TAP TO START VOICE AI SESSION'}
            </p>
          </div>
        )}

        {/* 3. CAPABILITIES */}
        {workspaceTab === 'capabilities' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg text-white">Configured Agent Capabilities</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'memory', label: 'Vector Memory Store', icon: Brain },
                { key: 'webSearch', label: 'Live Web Search', icon: Globe },
                { key: 'vision', label: 'Multi-Modal Vision', icon: Eye },
                { key: 'voice', label: 'Duplex Voice Engine', icon: Mic },
                { key: 'fileAnalysis', label: 'File & Document Analysis', icon: FileText },
                { key: 'imageGen', label: 'Image Generation Engine', icon: ImageIcon },
                { key: 'codeExecution', label: 'Sandboxed Code Execution', icon: Code },
                { key: 'automation', label: 'n8n & Webhooks', icon: Zap },
                { key: 'apiCalls', label: 'External REST API Calls', icon: ArrowLeftRight }
              ].map(cap => {
                const isEnabled = (agent.capabilities as any)?.[cap.key] ?? true;
                const Icon = cap.icon;
                return (
                  <button
                    key={cap.key}
                    onClick={() => {
                      const updatedCaps = { ...(agent.capabilities || {}), [cap.key]: !isEnabled };
                      onUpdateAgent({ ...agent, capabilities: updatedCaps as any });
                      showToast(`Toggled ${cap.label}`);
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isEnabled
                        ? 'bg-[#00D4FF]/10 border-[#00D4FF]/50 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isEnabled ? 'text-[#00D4FF]' : 'text-slate-500'}`} />
                      <span className="font-mono text-xs font-bold">{cap.label}</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. MEMORY & DOCUMENTS */}
        {workspaceTab === 'memory' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Long-Term Memory Key-Value Store</h3>
              <p className="text-xs text-slate-400 font-mono">Custom parameters stored across conversation sessions.</p>
            </div>

            <form onSubmit={handleAddMemory} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Key (e.g. system_architecture)"
                value={newMemKey}
                onChange={(e) => setNewMemKey(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4FF]"
              />
              <input
                type="text"
                placeholder="Value (e.g. Microservices on Cloud Run)"
                value={newMemVal}
                onChange={(e) => setNewMemVal(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4FF]"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl font-mono font-bold text-xs bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition-all cursor-pointer"
              >
                + Add Memory Item
              </button>
            </form>

            <div className="space-y-2">
              {(agent.memoryItems || []).map(item => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[#00D4FF] font-bold">{item.key}: </span>
                    <span className="text-white">{item.value}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AUTOMATIONS */}
        {workspaceTab === 'automations' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg text-white">Agent Webhook & Trigger Endpoints</h3>
            <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 text-xs font-mono text-emerald-400 flex items-center justify-between">
              <span>https://api.kronex.ai/v1/agents/{agent.id}/webhook</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://api.kronex.ai/v1/agents/${agent.id}/webhook`);
                  showToast('Webhook copied!');
                }}
                className="text-slate-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 6. MULTI-AGENT TEAMS */}
        {workspaceTab === 'teams' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg text-white">Team Collaboration Pods</h3>
            <p className="text-xs text-slate-400 font-mono">Agents currently paired with {agent.name} for team execution.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allAgents.filter(a => a.id !== agent.id).map(other => (
                <div key={other.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{other.avatar}</span>
                    <div>
                      <h4 className="font-bold text-xs text-white">{other.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{other.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Paired ${agent.name} with ${other.name}!`)}
                    className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold"
                  >
                    Pair Agent
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. INTEGRATIONS */}
        {workspaceTab === 'integrations' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg text-white">Integrations & API Keys</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {integrations.map(int => (
                <div key={int.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-white">{int.name}</span>
                    <span className="text-[10px] text-emerald-400">ACTIVE</span>
                  </div>
                  <input
                    type="password"
                    defaultValue={int.apiKey || '••••••••••••••••'}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. PROFILE & COVER BANNER */}
        {workspaceTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg text-white">Agent Identity & Visual Banner</h3>
            <div className="relative rounded-2xl h-40 overflow-hidden border border-white/10">
              <img
                src={agent.coverBanner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/20 flex items-center justify-center text-2xl">
                  {agent.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{agent.name}</h4>
                  <span className="text-xs font-mono text-cyan-400">{agent.category} • {agent.model}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
