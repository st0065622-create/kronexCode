import React, { useState, useEffect } from 'react';
import { 
  Cpu, Layers, Zap, ShieldCheck, ArrowRight, Play, Terminal, 
  Settings, CheckCircle2, Sliders, Globe, Activity, Heart, Send, Check, Bot, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SceneController from './SceneController';
import TiltCard from './TiltCard';

export default function LandingFeatures() {
  const [activeProduct, setActiveProduct] = useState<'orchestration' | 'vibe' | 'sandbox'>('orchestration');
  const [promptText, setPromptText] = useState('Optimize database connection pooling');
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);
  const [sandboxProgress, setSandboxProgress] = useState(0);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);

  // Auto-generate some credentials
  const startSandboxSimulation = () => {
    if (isSandboxRunning) return;
    setIsSandboxRunning(true);
    setSandboxProgress(10);
    setSandboxLogs(['[SYS] Initializing luxury sandbox container...', '[INFO] Deploying Kronex-node-v2.1 on port 3000...']);

    const steps = [
      { progress: 35, log: '[SECTOR] Allocating 8,192 Cognitive Blocks...' },
      { progress: 70, log: '[COMPILE] Transpiling main.ts with absolute type checks...' },
      { progress: 100, log: '[SUCCESS] Node successfully bound! SLA Uptime verified: 99.99%' }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setSandboxProgress(step.progress);
        setSandboxLogs(prev => [...prev, step.log]);
        if (step.progress === 100) {
          setIsSandboxRunning(false);
        }
      }, (index + 1) * 800);
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const products = {
    orchestration: {
      title: 'KRONEX Core Orchestration',
      tagline: 'Enterprise-grade agent workflows with sub-millisecond latency.',
      features: [
        'Deterministic model routing blocks',
        'State persistence across multi-turn sessions',
        'Automatic hyperparameter clamping mechanisms',
      ],
      metric: '4.2x Faster than Standard Pipelines',
      cta: 'View Core Specs',
    },
    vibe: {
      title: 'Vibe Studio AI',
      tagline: 'Write complex prompts and multi-modal schemas without boilerplate.',
      features: [
        'Natural-language compilation directly to CJS',
        'Live semantic auditing and array alignment checks',
        'Built-in token optimization rules',
      ],
      metric: '85% Less Boilerplate Code',
      cta: 'Explore Vibe Studio',
    },
    sandbox: {
      title: 'Autonomy Sandbox Runtime',
      tagline: 'Trace, benchmark and test user-submitted cognitive nodes.',
      features: [
        'Secure containerized virtual execution',
        'SOC2 compliance checking in real-time',
        'Comprehensive telemetry payload analysis',
      ],
      metric: '0ms Unsecured Execution Vector',
      cta: 'Request Sandbox Key',
    }
  };

  const bentoCards = [
    {
      title: 'AI Agent Studio',
      desc: 'Build, deploy, and orchestrate autonomous cognitive AI agents with long-term memory, vector stores, and custom tools.',
      icon: Bot,
      color: 'text-[#00D4FF]',
      badge: 'AUTONOMOUS 2.5'
    },
    {
      title: 'Workflow Automation',
      desc: 'Connect complex multi-step triggers, API webhooks, and deterministic logic loops with sub-millisecond execution speeds.',
      icon: Zap,
      color: 'text-[#7C3AED]',
      badge: 'ZERO-LATENCY'
    },
    {
      title: 'Multi-Model Access',
      desc: 'Seamlessly query and switch between Gemini 2.5, GPT-4o, Claude 3.5 Sonnet, and DeepSeek with unified token management.',
      icon: Cpu,
      color: 'text-[#00FFA3]',
      badge: '100+ MODELS'
    },
    {
      title: 'Real-Time Analytics',
      desc: 'Monitor token cost consumption, request volume distributions, response latency percentiles, and live SLA metrics.',
      icon: Activity,
      color: 'text-amber-400',
      badge: 'TELEMETRY'
    },
    {
      title: 'Secure & Scalable',
      desc: 'SOC2 Type II certified infrastructure with zero data retention policies, granular role-based access control, and end-to-end encryption.',
      icon: ShieldCheck,
      color: 'text-purple-400',
      badge: 'ENTERPRISE'
    }
  ];

  return (
    <div className="bg-transparent">
      
      {/* SECTION 1: AI FEATURES BENTO GRID */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A855F7] text-xs font-mono font-bold uppercase tracking-wider"
          >
            <Zap className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>FEATURES DIRECTORY</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none"
          >
            Engineering Without Limits
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base text-slate-400 font-sans font-medium"
          >
            Powering technical teams with highly-polished mechanics, zero-lag microservices, and absolute code clarity.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {bentoCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <TiltCard key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group p-8 bg-[#0B0F19]/40 border border-white/[0.08] backdrop-blur-2xl rounded-[28px] shadow-2xl hover:shadow-[0_20px_50px_rgba(34,211,238,0.15)] hover:border-cyan-400/40 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[310px] cursor-pointer"
                >
                  {/* Border Glow Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-indigo-500/5 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="space-y-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-105 transition-all duration-300 border border-white/5">
                        <Icon className={`w-5.5 h-5.5 ${card.color}`} />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-lg tracking-wider">
                        {card.badge}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-black text-xl text-white group-hover:text-cyan-400 transition-colors duration-300 leading-tight">
                      {card.title}
                    </h3>
                    
                    <p className="text-xs text-zinc-400 font-sans font-medium leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 relative z-10 mt-6">
                    <span>DEPLOY NODE</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </motion.div>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: PRODUCTS INTERACTIVE SHOWCASE */}
      <section id="products" className="bg-white/5 border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Products selector details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#22D3EE] text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>KRONEX PRODUCT MATRIX</span>
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  High-Performance Solutions
                </h2>
                <p className="text-sm text-slate-400 font-sans font-medium">
                  Select and preview the architectural structures of our flagship products configured for global edge infrastructure.
                </p>
              </div>

              {/* Selection Pills */}
              <div className="space-y-3">
                {(Object.keys(products) as Array<keyof typeof products>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveProduct(key)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      activeProduct === key
                        ? 'bg-white/10 border-[#7C3AED]/50 shadow-md text-white'
                        : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="block font-display font-black text-xs uppercase tracking-wider">
                        {products[key].title}
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-0.5 font-sans leading-none">
                        {products[key].tagline}
                      </span>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform ${activeProduct === key ? 'text-[#7C3AED] translate-x-1' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Product Graphic Card */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[24px] p-8 shadow-xl backdrop-blur-md relative overflow-hidden min-h-[380px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-[#7C3AED]/5 to-[#22D3EE]/5 rounded-bl-full blur-xl pointer-events-none" />
              
              <div className="space-y-6">
                <span className="text-[10px] font-mono font-black text-[#A855F7] bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                  {products[activeProduct].metric}
                </span>

                <h3 className="font-display font-black text-2xl text-white">
                  {products[activeProduct].title}
                </h3>

                <p className="text-xs text-slate-400 font-sans font-medium leading-relaxed max-w-xl">
                  {products[activeProduct].tagline}
                </p>

                <ul className="space-y-3">
                  {products[activeProduct].features.map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-xs font-mono font-bold text-white/90">
                      <CheckCircle2 className="w-4 h-4 text-[#7C3AED] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono font-black text-slate-400">EDGE REPLICATED NODE</span>
                <button 
                  onClick={() => window.scrollTo({ top: document.getElementById('pricing')?.offsetTop || 0, behavior: 'smooth' })}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white hover:opacity-90 font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  {products[activeProduct].cta}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE DEMO (3D AI CORE SPACE INTEGRATION) */}
      <section id="product-demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left copy column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 border border-rose-500/20">
              <Globe className="w-3.5 h-3.5 animate-spin-slow text-[#22D3EE]" />
              <span>INTERACTIVE R3F DEMO</span>
            </span>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Observe Cognitive Vectors In Real-Time
            </h2>

            <p className="text-sm text-slate-400 font-sans font-medium leading-relaxed">
              Interact directly with our Three.js Fiber Core. Toggle the 3D AI Orb nucleus, slide the rotational speed factors, and engage the Cinematic sweep camera parameters below.
            </p>

            <div className="space-y-3.5 pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-[#7C3AED]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                </div>
                <div>
                  <span className="block text-xs font-mono font-bold text-white/90">Low overhead rendering</span>
                  <span className="block text-[11px] text-slate-400">Consistently targets 60.0 FPS with low CPU footprints.</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded bg-[#22D3EE]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                </div>
                <div>
                  <span className="block text-xs font-mono font-bold text-white/90">Flexible visual assets</span>
                  <span className="block text-[11px] text-slate-400">Fully reactive to client-side window resizes and control parameter sets.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 3D canvas viewport container */}
          <div className="lg:col-span-7">
            <SceneController />
          </div>

        </div>
      </section>

      {/* SECTION 4: LIVE AI SANDBOX TESTING */}
      <section id="sandbox" className="bg-white/5 border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#7C3AED]/10 text-[#A855F7] text-xs font-mono font-bold uppercase tracking-wider border border-[#7C3AED]/20">
              <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>LIVE AI PROMPT COMPILER</span>
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Test Prompt Orchestration
            </h2>
            <p className="text-sm text-slate-400 font-sans font-medium">
              Submit custom prompt vectors. Instantly watch our simulated orchestrator bind safe sandbox nodes in real-time.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-[24px] p-6 shadow-xl backdrop-blur-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                <span>PROMPT SHELL INPUT</span>
                <span>MODEL: KRONEX-ORACLE-v2</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter custom compiler instructions..."
                  className="flex-grow px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C3AED]/50"
                />
                <button
                  onClick={startSandboxSimulation}
                  disabled={isSandboxRunning}
                  className={`px-6 py-3 rounded-xl font-display font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-90 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer ${isSandboxRunning ? 'opacity-55' : ''}`}
                >
                  <Terminal className="w-4 h-4 text-white" />
                  <span>{isSandboxRunning ? 'Compiling...' : 'Run Sandbox'}</span>
                </button>
              </div>

              {/* Progress Bar simulation */}
              {isSandboxRunning && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>SECTOR COMPILE STATUS</span>
                    <span>{sandboxProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE]" 
                      style={{ width: `${sandboxProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Simulated logs output screen */}
              {sandboxLogs.length > 0 && (
                <div className="bg-slate-950 rounded-xl p-4 text-white/95 font-mono text-[11px] leading-relaxed space-y-1.5 max-h-44 overflow-y-auto border border-slate-900">
                  {sandboxLogs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-slate-500">{(index+1).toString().padStart(2, '0')}</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: GLOBAL STATISTICS COUNTER */}
      <section id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '100K+', label: 'Active Users', subtitle: 'Globally Registered' },
            { value: '99.99%', label: 'SLA Uptime', subtitle: 'Enterprise Grade' },
            { value: '50M+', label: 'Inference Requests', subtitle: 'Daily Capacity' },
            { value: '150+', label: 'Countries Supported', subtitle: 'Localized Nodes' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-1"
            >
              <span className="block text-4xl sm:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] tracking-tight">
                {stat.value}
              </span>
              <span className="block text-sm font-sans font-bold text-white">
                {stat.label}
              </span>
              <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {stat.subtitle}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: NEWSLETTER & HIGH-CONTRAST mega CTA */}
      <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="bg-[#121829] border border-white/5 rounded-[32px] p-8 sm:p-12 text-white relative overflow-hidden text-center space-y-8 shadow-2xl">
          
          {/* Subtle glowing gradients behind black block */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/20 rounded-bl-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22D3EE]/10 rounded-tr-full blur-[60px] pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <span className="inline-block px-3 py-1.5 rounded-full bg-[#7C3AED]/20 text-[#22D3EE] text-[10px] font-mono font-bold uppercase tracking-widest border border-purple-500/30">
              JOIN THE FUTURE OF AUTONOMY
            </span>
            
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-none text-white max-w-3xl mx-auto">
              Secure Sandbox Access Instantly
            </h2>

            <p className="text-sm text-slate-400 max-w-lg mx-auto font-sans leading-relaxed">
              Receive live cognitive audits, persistent credential tokens, and early development release notes. Auto-provisions free tier nodes immediately.
            </p>
          </div>

          {/* Non-cluttered newsletter capture form */}
          <div className="max-w-md mx-auto relative z-10">
            <form onSubmit={handleNewsletterSubmit} className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl">
              <input 
                type="email" 
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter enterprise email..." 
                className="w-full bg-transparent px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none" 
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-90 text-white font-display font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0"
              >
                {isNewsletterSubscribed ? (
                  <span className="flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Done!</span>
                  </span>
                ) : 'Start Free'}
              </button>
            </form>
            <span className="block text-[10px] font-mono text-slate-500 mt-3">
              Zero credit card required. Instantly provisions test sandbox.
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}
