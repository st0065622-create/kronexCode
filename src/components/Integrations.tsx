import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';
import IntegrationConfigModal from './IntegrationConfigModal';
import { 
  Sparkles, Cpu, Database, Cloud, Terminal, ShieldCheck, Zap, 
  GitPullRequest, CreditCard, Slack, Workflow, Github, MessageSquare, 
  Check, Loader2, ArrowRight, Activity, Layers, Play, Settings, Flame, Triangle,
  HardDrive, FileText, Bot, Compass, BrainCircuit
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: string;
  desc: string;
  icon: React.ComponentType<any>;
  color: string;
  glowColor: string;
  latency: string;
}

export default function Integrations() {
  // State for tracking connection statuses
  const [connections, setConnections] = useState<Record<string, 'connected' | 'available' | 'connecting'>>({
    openai: 'connected',
    gemini: 'connected',
    claude: 'connected',
    grok: 'available',
    deepseek: 'available',
    huggingface: 'available',
    mistral: 'available',
    perplexity: 'available',
    replicate: 'available',
    n8n: 'connected',
    github: 'connected',
    googledrive: 'available',
    slack: 'available',
    notion: 'available',
  });

  // State for active sync/event logging simulation
  const [syncCount, setSyncCount] = useState<number>(1840);
  const [activeSyncingId, setActiveSyncingId] = useState<string | null>(null);

  // Config modal state
  const [configIntegration, setConfigIntegration] = useState<Integration | null>(null);

  // Success Toast notification
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleConnectToggle = (id: string, name: string) => {
    soundManager.playClick();
    const currentStatus = connections[id];

    if (currentStatus === 'connected') {
      // Disconnect
      setConnections(prev => ({ ...prev, [id]: 'available' }));
      triggerToast(`Disconnected from ${name}`, 'info');
    } else if (currentStatus === 'available') {
      // Start connecting
      setConnections(prev => ({ ...prev, [id]: 'connecting' }));
      setActiveSyncingId(id);
      
      setTimeout(() => {
        setConnections(prev => ({ ...prev, [id]: 'connected' }));
        setActiveSyncingId(null);
        setSyncCount(prev => prev + 1);
        triggerToast(`Successfully integrated ${name} ✓`, 'success');
      }, 1200);
    }
  };

  const integrations: Integration[] = [
    { 
      id: 'openai',
      name: 'OpenAI', 
      category: 'LLM Provider', 
      desc: 'GPT-4o & GPT-o1 embedding pipelines and real-time chat completions.', 
      icon: Sparkles, 
      color: 'text-[#00FFA3]', 
      glowColor: 'rgba(0, 255, 163, 0.25)',
      latency: '142ms'
    },
    { 
      id: 'gemini',
      name: 'Google Gemini', 
      category: 'Multimodal Engine', 
      desc: '2M context windows, audio-visual reasoning, and structured output routing.', 
      icon: Cpu, 
      color: 'text-[#00D4FF]', 
      glowColor: 'rgba(0, 212, 255, 0.25)',
      latency: '32ms'
    },
    { 
      id: 'claude',
      name: 'Claude', 
      category: 'Enterprise Cognition', 
      desc: 'Artifact generation, agentive reasoning, and secure sandbox execution.', 
      icon: ShieldCheck, 
      color: 'text-amber-400', 
      glowColor: 'rgba(251, 191, 36, 0.25)',
      latency: '185ms'
    },
    { 
      id: 'grok',
      name: 'Grok', 
      category: 'Real-time Search LLM', 
      desc: 'Live web search context grounding and high-speed token generation.', 
      icon: Compass, 
      color: 'text-zinc-200', 
      glowColor: 'rgba(255, 255, 255, 0.2)',
      latency: '88ms'
    },
    { 
      id: 'deepseek',
      name: 'DeepSeek', 
      category: 'Reasoning Specialist', 
      desc: 'DeepSeek-V3 and R1 reasoning models with math & code optimization.', 
      icon: BrainCircuit, 
      color: 'text-blue-400', 
      glowColor: 'rgba(96, 165, 250, 0.25)',
      latency: '45ms'
    },
    { 
      id: 'huggingface',
      name: 'Hugging Face', 
      category: 'Open Source Hub', 
      desc: 'Access 100,000+ open weights models and custom inference endpoints.', 
      icon: Bot, 
      color: 'text-amber-300', 
      glowColor: 'rgba(252, 211, 77, 0.25)',
      latency: '62ms'
    },
    { 
      id: 'mistral',
      name: 'Mistral AI', 
      category: 'Sovereign Models', 
      desc: 'Mistral Large & Codestral low-latency lightweight embedding nodes.', 
      icon: Flame, 
      color: 'text-orange-400', 
      glowColor: 'rgba(251, 146, 60, 0.25)',
      latency: '28ms'
    },
    { 
      id: 'perplexity',
      name: 'Perplexity', 
      category: 'Search Engine AI', 
      desc: 'Deep research queries, real-time citation synthesis, and web scraping.', 
      icon: Activity, 
      color: 'text-cyan-300', 
      glowColor: 'rgba(103, 232, 249, 0.25)',
      latency: '110ms'
    },
    { 
      id: 'replicate',
      name: 'Replicate', 
      category: 'Cloud GPU Pipeline', 
      desc: 'Run FLUX image generation, Whisper audio, and open-source models in cloud.', 
      icon: Cloud, 
      color: 'text-purple-400', 
      glowColor: 'rgba(192, 132, 252, 0.25)',
      latency: '210ms'
    },
    { 
      id: 'n8n',
      name: 'n8n Automation', 
      category: 'Workflow Trigger', 
      desc: 'Fair-code workflow automation for multi-step agent triggers & webhooks.', 
      icon: Workflow, 
      color: 'text-[#7C3AED]', 
      glowColor: 'rgba(124, 58, 237, 0.25)',
      latency: '18ms'
    },
    { 
      id: 'github',
      name: 'GitHub', 
      category: 'Version Control', 
      desc: 'Automated semantic commit registries and continuous integration hooks.', 
      icon: Github, 
      color: 'text-purple-300', 
      glowColor: 'rgba(216, 180, 254, 0.25)',
      latency: '14ms'
    },
    { 
      id: 'googledrive',
      name: 'Google Drive', 
      category: 'Cloud File Sync', 
      desc: 'Direct ingestion of Docs, Sheets, PDFs, and team drive assets into RAG.', 
      icon: HardDrive, 
      color: 'text-emerald-400', 
      glowColor: 'rgba(52, 211, 153, 0.25)',
      latency: '24ms'
    },
    { 
      id: 'slack',
      name: 'Slack', 
      category: 'Team Communication', 
      desc: 'Instant messaging channels, bot dispatching, and notification pings.', 
      icon: Slack, 
      color: 'text-pink-400', 
      glowColor: 'rgba(244, 114, 182, 0.25)',
      latency: '48ms'
    },
    { 
      id: 'notion',
      name: 'Notion', 
      category: 'Knowledge Base', 
      desc: 'Automatic sync of Notion database pages, wikis, and documentation into AI.', 
      icon: FileText, 
      color: 'text-zinc-100', 
      glowColor: 'rgba(255, 255, 255, 0.2)',
      latency: '36ms'
    }
  ];

  return (
    <section id="integrations" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent border-t border-white/[0.08]">
      {/* Decorative Aurora Glow behind section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] rounded-full bg-[#7C3AED]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/35 text-xs font-mono font-bold uppercase tracking-wider text-[#22D3EE] mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#22D3EE]" />
            <span>AI INTEGRATIONS LAYER</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white mb-4"
          >
            Sovereign Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-[#22D3EE] to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">AI Integrations</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#94A3B8] text-base leading-relaxed"
          >
            Hot-swap your active LLM, datastore, secure cloud containers, or ledger tunnels. 
            Connect in sub-milliseconds with native SDK proxies.
          </motion.p>
        </div>

        {/* ====================================================
           FEATURED PRIMARY INTEGRATION: n8n (At the top)
           ==================================================== */}
        <div className="mb-12">
          <span className="block text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase mb-4">
            FEATURED INTEGRATION
          </span>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ 
              y: -4,
              borderColor: 'rgba(124, 92, 255, 0.4)',
              boxShadow: '0 25px 60px -15px rgba(124, 92, 255, 0.2)'
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="relative p-6 sm:p-8 rounded-[20px] bg-[#08080C]/85 border border-[#7C3AED]/20 backdrop-blur-2xl transition-all duration-500 group overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            {/* Ambient Background Glow matching brand */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#7C3AED]/10 rounded-full blur-[80px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-cyan-400/5 rounded-full blur-[60px] pointer-events-none opacity-35" />

            {/* Left side info */}
            <div className="flex-grow space-y-5 relative z-10 text-center lg:text-left w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* n8n glowing logo container */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C3AED]/20 to-[#22D3EE]/20 border border-[#7C3AED]/45 flex items-center justify-center shadow-lg relative group-hover:scale-105 transition-all duration-300">
                  <Workflow className="w-7 h-7 text-[#22D3EE] group-hover:rotate-12 transition-transform duration-500" />
                </div>
                
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2.5">
                    <h3 className="font-display font-black text-2xl text-white tracking-wide">
                      n8n
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/35 text-[#22D3EE]">
                      v1.0 Ready
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider block mt-1">
                    Workflow Automation & Orchestrator
                  </span>
                </div>
              </div>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans font-medium">
                Automate workflows visually with n8n and connect KRONEX AI to hundreds of apps.
              </p>

              {/* Status and telemetry bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                {connections.n8n === 'connected' ? (
                  <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Connected ✓
                    </span>
                  </div>
                ) : connections.n8n === 'connecting' ? (
                  <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl">
                    <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      Establishing link...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-zinc-500/10 border border-zinc-500/20 px-3.5 py-1.5 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-zinc-500" />
                    <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Available (Disconnected)
                    </span>
                  </div>
                )}

                <div className="text-[10px] font-mono font-bold text-zinc-500 bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PIPELINE CAPACITY: 200/sec</span>
                </div>

                <div className="text-[10px] font-mono font-bold text-zinc-500 bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>SYNCED EVENTS: {syncCount}</span>
                </div>
              </div>
            </div>

            {/* Right side Actions (Connect/Configure button) */}
            <div className="relative z-10 shrink-0 w-full lg:w-auto flex flex-col sm:flex-row items-center justify-center gap-4">
              {connections.n8n === 'connected' ? (
                <>
                  <button
                    onClick={() => handleConnectToggle('n8n', 'n8n')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-xs font-mono font-bold text-zinc-400 hover:text-red-400 transition-all duration-300 cursor-pointer"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setSyncCount(prev => prev + 12);
                      triggerToast('Sovereign pipeline configurations synced successfully!', 'success');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white font-display font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <Settings className="w-4 h-4 animate-spin-slow" />
                    <span>Sync Pipeline</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnectToggle('n8n', 'n8n')}
                  disabled={connections.n8n === 'connecting'}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white font-display font-black text-xs uppercase tracking-widest hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {connections.n8n === 'connecting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Linking n8n...</span>
                    </>
                  ) : (
                    <>
                      <span>Connect n8n</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* ====================================================
           ECOSYSTEM GRID (Other 12 integrations below n8n)
           ==================================================== */}
        <div className="mb-4">
          <span className="block text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase mb-6">
            ECOSYSTEM SERVICE PIPELINES ({integrations.length} AVAILABLE)
          </span>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {integrations.map((item, index) => {
            const Icon = item.icon;
            const status = connections[item.id];
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                whileHover={{ 
                  y: -6, 
                  scale: 1.02,
                  borderColor: 'rgba(34, 211, 238, 0.45)',
                  boxShadow: `0 15px 40px -10px ${item.glowColor}`
                }}
                onMouseEnter={() => soundManager.playHover()}
                className="p-5 rounded-[20px] bg-[#08080C]/85 border border-white/[0.08] backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between relative overflow-hidden min-h-[220px]"
              >
                {/* Internal card particle spark effect */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-3 relative z-10">
                  {/* Top line with Icon and status indicator */}
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center group-hover:border-cyan-400/30 transition-colors`}>
                      <Icon className={`w-5.5 h-5.5 ${item.color} transition-transform duration-300 group-hover:scale-110`} />
                    </div>

                    {status === 'connected' ? (
                      <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                        <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          Connected
                        </span>
                      </div>
                    ) : status === 'connecting' ? (
                      <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                        <Loader2 className="w-2.5 h-2.5 text-amber-400 animate-spin" />
                        <span className="text-[8px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                          Linking
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 bg-zinc-500/5 border border-white/5 px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                        <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                          Available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name & Category */}
                  <div>
                    <h3 className="font-display font-black text-sm text-white tracking-wide group-hover:text-[#22D3EE] transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <span className="text-[8px] font-mono font-bold text-[#22D3EE] bg-white/5 px-1.5 py-0.1 rounded">
                        {item.latency}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-zinc-400 font-sans leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom line: Connect & Configure Buttons */}
                <div className="mt-4 pt-3 border-t border-white/[0.05] relative z-10 flex items-center space-x-2">
                  {status === 'connected' ? (
                    <button
                      onClick={() => handleConnectToggle(item.id, item.name)}
                      className="flex-1 py-2 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-[10px] font-mono font-bold text-zinc-400 hover:text-red-400 transition-all cursor-pointer text-center"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectToggle(item.id, item.name)}
                      disabled={status === 'connecting'}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] font-display font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
                    >
                      {status === 'connecting' ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-white" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <span>One-Click Connect</span>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => { soundManager.playClick(); setConfigIntegration(item); }}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    title="Configure API Vault & Ping"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Integration Vault Configuration Modal */}
      <IntegrationConfigModal
        isOpen={!!configIntegration}
        onClose={() => setConfigIntegration(null)}
        integration={configIntegration}
        onSaveKey={(id) => {
          setConnections((prev) => ({ ...prev, [id]: 'connected' }));
          triggerToast(`Saved encrypted API token for ${configIntegration?.name}`, 'success');
        }}
        onDisconnect={(id) => {
          setConnections((prev) => ({ ...prev, [id]: 'available' }));
          triggerToast(`Disconnected ${configIntegration?.name}`, 'info');
        }}
      />

      {/* Floating interactive toast notifications */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-55 flex items-center space-x-3 p-4 rounded-xl bg-[#09090D]/95 border border-[#7C3AED]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md"
          >
            <div className={`p-1.5 rounded-lg ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
              <Check className="w-4 h-4" />
            </div>
            <div className="font-sans">
              <span className="block text-xs font-bold text-white leading-none">
                {toast.message}
              </span>
              <span className="block text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                SYSTEM STATUS: ACTIVE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
