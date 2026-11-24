import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Play, Sparkles, Bot, Cpu, Zap, Activity,
  ShieldCheck, Lock, Server, Check, Heart, Layers, Terminal
} from 'lucide-react';
import { motion } from 'motion/react';
import MagneticButton from './MagneticButton';
import TiltCard from './TiltCard';

// Holographic AI Core Sphere with Neon "K" & Floating Glass Nodes
export function HolographicSphere() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / 35;
      const y = (e.clientY - window.innerHeight / 2) / 35;
      setRotation({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingNodes = [
    { title: 'AI Agents', val: 'Autonomous 2.5', icon: Bot, pos: 'top-2 -left-6 lg:-left-12', color: 'from-[#00D4FF] to-blue-600' },
    { title: 'Models', val: '100+ Integrated', icon: Cpu, pos: 'top-10 -right-6 lg:-right-10', color: 'from-[#7C3AED] to-purple-600' },
    { title: 'Automation', val: 'Real-time Loops', icon: Zap, pos: 'bottom-12 -left-8 lg:-left-14', color: 'from-[#00FFA3] to-emerald-600' },
    { title: 'Performance', val: '99.99% SLA', icon: Activity, pos: 'bottom-4 -right-4 lg:-right-8', color: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div 
      className="relative w-full max-w-[480px] lg:max-w-[560px] h-[450px] lg:h-[520px] mx-auto flex items-center justify-center select-none transition-all duration-500 ease-out"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: `perspective(1000px) rotateY(${rotation.x}deg) rotateX(${-rotation.y}deg) scale(${hovered ? 1.03 : 1})`,
      }}
    >
      {/* Cyber Energy Rings Beneath Sphere */}
      <div className="absolute bottom-4 w-72 lg:w-96 h-20 rounded-[100%] bg-gradient-to-r from-[#7C3AED]/30 via-[#00D4FF]/40 to-[#00FFA3]/30 blur-2xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-8 w-60 lg:w-80 h-10 border border-[#00D4FF]/30 rounded-[100%] animate-spin-slow pointer-events-none" />
      <div className="absolute bottom-10 w-44 lg:w-60 h-6 border border-dotted border-[#7C3AED]/40 rounded-[100%] animate-spin-reverse pointer-events-none" />

      {/* Volumetric Glowing Sphere Outer Aura */}
      <div className="absolute w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-tr from-[#7C3AED]/40 via-[#00D4FF]/30 to-[#00FFA3]/20 rounded-full filter blur-[50px] animate-pulse" />
      
      {/* Rotating Neon Ring 1 */}
      <div className="absolute w-72 h-72 lg:w-88 lg:h-88 border-2 border-dashed border-[#00D4FF]/35 rounded-full animate-spin-slow" />
      
      {/* Rotating Neon Ring 2 */}
      <div className="absolute w-60 h-60 lg:w-72 lg:h-72 border border-dotted border-[#00FFA3]/40 rounded-full animate-spin-reverse" />

      {/* Core Glowing Sphere */}
      <div className="relative w-56 h-56 lg:w-72 lg:h-72 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#00D4FF] to-[#00FFA3] p-[2px] shadow-[0_0_80px_rgba(0,212,255,0.45)] animate-float">
        <div className="w-full h-full rounded-full bg-[#050814]/90 backdrop-blur-3xl flex flex-col items-center justify-center relative overflow-hidden border border-white/20">
          
          {/* Glass Lens Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/60 pointer-events-none rounded-full" />
          
          {/* Internal Mesh Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00D4FF_1px,transparent_1px)] [background-size:12px_12px]" />
          
          {/* Central Sovereign Core Icon & Label */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00FFA3] animate-pulse" />
              <span className="text-xs font-mono tracking-[3px] text-[#00D4FF] font-extrabold uppercase">
                SOVEREIGN CORE
              </span>
            </div>
          </div>

          {/* Scan Line Effect */}
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#00FFA3] to-transparent top-0 animate-scan-line" />
        </div>
      </div>

      {/* Floating Glass Cards connected with glowing line indicators */}
      {floatingNodes.map((node, i) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
            className={`absolute ${node.pos} z-20`}
          >
            <div className="p-3 lg:p-3.5 rounded-2xl bg-[#0A0F1E]/80 border border-white/15 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 hover:border-[#00D4FF]/60 transition-all duration-300 group cursor-pointer">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${node.color} p-[1px] shrink-0`}>
                <div className="w-full h-full rounded-[11px] bg-slate-950/90 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="text-left whitespace-nowrap pr-1">
                <span className="block text-xs font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                  {node.title}
                </span>
                <span className="block text-[10px] font-mono text-zinc-400">
                  {node.val}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

interface HeroProps {
  onExploreCourses: () => void;
  onLaunchPlatform: () => void;
  onLaunchVibeStudio?: () => void;
}

export default function Hero({ onExploreCourses, onLaunchPlatform }: HeroProps) {
  const [stats, setStats] = useState({ models: 0, devs: 0, uptime: 99.90, requests: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Counter count-up effect
  useEffect(() => {
    const duration = 2000;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        models: Math.min(Math.floor(100 * progress), 100),
        devs: Math.min(Math.floor(50 * progress), 50),
        uptime: parseFloat((99.90 + (0.09 * progress)).toFixed(2)),
        requests: Math.min(Math.floor(1 * progress), 1)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Neural network background particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 800);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 800;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 2 + 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => new Particle());

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const featureChecklist = [
    '100+ AI Models',
    'Enterprise Security',
    'AI Agents',
    'Workflow Automation',
    'Sub-millisecond Latency',
    'Global Cloud Infrastructure'
  ];

  return (
    <section 
      id="hero" 
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 md:pt-36 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden bg-[#050510] text-white"
    >
      {/* Background Neural Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,212,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-grow flex flex-col justify-center">
        
        {/* DESKTOP 2-COLUMN HERO LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4">
          
          {/* LEFT SIDE: BADGE, HEADLINE, DESCRIPTION, CTAS & SIGNATURE */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* BADGE: "Next-Gen AI Platform" */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center"
            >
              <div 
                onClick={onLaunchPlatform}
                className="px-4 py-2 rounded-full bg-white/[0.04] border border-cyan-400/30 backdrop-blur-xl shadow-[0_0_20px_rgba(0,212,255,0.15)] flex items-center gap-2.5 cursor-pointer hover:border-cyan-400/60 transition-all duration-300 group"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF]"></span>
                </span>
                <span className="text-[11px] font-mono font-bold text-[#00D4FF] tracking-wider uppercase">
                  Next-Gen AI Platform
                </span>
                <span className="text-xs text-zinc-300 font-medium hidden sm:inline">
                  • KRONEX 2.5
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#00D4FF] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* HUGE HEADLINE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-white"
            >
              The Future of AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] via-cyan-300 to-[#7C3AED] drop-shadow-[0_0_35px_rgba(0,212,255,0.4)]">
                Starts Here.
              </span>
            </motion.h1>

            {/* SHORT DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-300 font-sans font-normal leading-relaxed max-w-xl"
            >
              Build intelligent AI agents, automate complex workflows, integrate leading AI models, and scale your applications from one ultra-modern enterprise workspace.
            </motion.p>

            {/* FEATURE CHECKLIST CHIPS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl pt-1"
            >
              {featureChecklist.map((item) => (
                <div 
                  key={item}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-md"
                >
                  <div className="w-4 h-4 rounded-full bg-[#00FFA3]/20 border border-[#00FFA3]/40 flex items-center justify-center shrink-0 text-[#00FFA3]">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-200 tracking-wide font-sans truncate">{item}</span>
                </div>
              ))}
            </motion.div>

            {/* PRIMARY & SECONDARY CTA ROW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              <MagneticButton
                onClick={onLaunchPlatform}
                soundType="deploy"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#00D4FF] text-white font-display font-bold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_45px_rgba(0,212,255,0.6)] transition-all duration-300 border border-white/20"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </MagneticButton>

              <MagneticButton
                onClick={onExploreCourses}
                soundType="click"
                className="px-7 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 font-display font-bold text-xs uppercase tracking-widest backdrop-blur-xl transition-all duration-300 hover:border-[#00D4FF]/50"
              >
                <Play className="w-3.5 h-3.5 text-[#00D4FF] fill-[#00D4FF] animate-pulse" />
                <span>Watch Demo</span>
              </MagneticButton>
            </motion.div>

            {/* PROMINENT CREATOR CARD & SIGNATURE CREDIT */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-2 flex items-center gap-3"
            >
              <div className="p-2 pr-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-cyan-900/30 to-slate-900/60 border border-cyan-400/30 backdrop-blur-xl flex items-center gap-3 shadow-[0_0_25px_rgba(0,212,255,0.2)] hover:border-cyan-400/60 transition-all group">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7C3AED] blur-xs animate-pulse" />
                  <img 
                    src="/src/assets/images/shashvat_profile_1785747313447.jpg" 
                    alt="THE SHASHVAT" 
                    className="relative w-11 h-11 rounded-full object-cover border-2 border-cyan-300 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[7px] text-white font-bold">✓</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono text-cyan-300 font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <span>CREATOR & LEAD ARCHITECT</span>
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400 animate-bounce" />
                  </span>
                  <span className="text-sm font-display font-black text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                    THE SHASHVAT
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* RIGHT SIDE: HOLOGRAPHIC SPHERE & FLOATING CONNECTED CARDS */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HolographicSphere />
          </div>

        </div>

        {/* TRUSTED BY LOGOS BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-white/10 text-center space-y-4"
        >
          <span className="text-[10px] font-mono uppercase tracking-[3px] font-bold text-zinc-400">
            TRUSTED BY INDUSTRY LEADERS WORLDWIDE
          </span>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
            {['OpenAI', 'Google', 'Microsoft', 'NVIDIA', 'AWS', 'Meta', 'Docker'].map((brand) => (
              <div 
                key={brand}
                className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <span className="font-display font-black text-xs sm:text-sm text-zinc-300 hover:text-white tracking-widest uppercase">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* LIVE STATS COUNTERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto w-full"
        >
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <span className="text-2xl sm:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00D4FF]">
              {stats.models}+
            </span>
            <span className="block text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider mt-1">
              AI Models
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <span className="text-2xl sm:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7C3AED]">
              {stats.devs}K+
            </span>
            <span className="block text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider mt-1">
              Active Developers
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <span className="text-2xl sm:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FFA3]">
              {stats.uptime}%
            </span>
            <span className="block text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider mt-1">
              Guaranteed Uptime
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <span className="text-2xl sm:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00D4FF]">
              {stats.requests}M+
            </span>
            <span className="block text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider mt-1">
              Daily AI Requests
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
