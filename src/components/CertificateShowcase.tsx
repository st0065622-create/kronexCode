import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, CheckCircle2, ShieldCheck, QrCode, Globe, 
  Linkedin, Download, ExternalLink, Sparkles, Cpu, 
  Layers, Search, Check, FileText, ChevronRight, Share2,
  Lock, RefreshCw, Calendar, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pre-defined template certificates the user can select
const CERTIFICATES_DATA = [
  {
    id: "KRNX-AI-883F",
    title: "KRONEX Certified AI Architect",
    recipient: "Alex Rivers",
    date: "July 2026",
    grade: "Distinction (98%)",
    skills: ["Multi-Agent Orchestration", "Deep Reasoning Models", "Vibe Coding Compiler AST", "Neural Handshakes"],
    hash: "sha256:8b2a11f592c77d91e6005c317a",
    color: "from-purple-600 via-indigo-600 to-cyan-500",
    bgAccent: "rgba(108, 99, 255, 0.08)",
    badgeColor: "text-purple-600 bg-purple-50 border-purple-200"
  },
  {
    id: "KRNX-OPS-114A",
    title: "Deep Learning Operations Lead",
    recipient: "Sarah Jenkins",
    date: "June 2026",
    grade: "Outstanding (96%)",
    skills: ["GPU Multi-Node Clustering", "Docker Ingress Routers", "Cognitive Load Leveling", "SLA Verification"],
    hash: "sha256:a2f981e44bc77d1219b109c991",
    color: "from-cyan-500 via-blue-600 to-indigo-600",
    bgAccent: "rgba(6, 182, 212, 0.08)",
    badgeColor: "text-cyan-600 bg-cyan-50 border-cyan-200"
  },
  {
    id: "KRNX-AST-7749",
    title: "Vibe Coding Specialist",
    recipient: "Marcus Chen",
    date: "May 2026",
    grade: "Perfect (100%)",
    skills: ["Real-time Code Streaming", "Interactive UI Injection", "AST Code Hot-Swaps", "Holographic Grids"],
    hash: "sha256:d8c114f0ea511c9118e9c20a11",
    color: "from-fuchsia-600 via-purple-600 to-pink-500",
    bgAccent: "rgba(217, 70, 239, 0.08)",
    badgeColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200"
  }
];

export default function CertificateShowcase() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeCert = CERTIFICATES_DATA[selectedIdx];
  
  // Toast notifications
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const notify = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification(null);
    }, 3000);
  };

  // Interactive Verification states
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [verificationResult, setVerificationResult] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [scannedCert, setScannedCert] = useState<typeof CERTIFICATES_DATA[0] | null>(null);

  // 3D Tilt parameters for Mouse movement
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const certRef = useRef<HTMLDivElement>(null);

  // Canvas backdrop for particles
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles and slow motion variables
    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      angle: number;
      vibrancy: number;
    }

    const particles: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3.5 + 1.5,
      color: Math.random() > 0.5 ? 'rgba(108, 99, 255, 0.15)' : 'rgba(0, 212, 255, 0.12)',
      speed: Math.random() * 0.4 + 0.1,
      angle: Math.random() * Math.PI * 2,
      vibrancy: Math.random() * 0.02
    }));

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle light beams/glowing layers in background
      const grad = ctx.createRadialGradient(width * 0.3, height * 0.4, 10, width * 0.3, height * 0.4, width * 0.5);
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.03)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.01)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Drawing particles
      particles.forEach(p => {
        p.angle += p.vibrancy;
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.3)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Handle Mouse Move for 3D tilt of Certificate Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = certRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within element
    const y = e.clientY - rect.top;  // y coordinate within element

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const tiltX = -(y - yc) / 14; // max angle in degrees
    const tiltY = (x - xc) / 14;

    setTilt({ x: tiltX, y: tiltY });

    // Calculate percent position for shine sweep
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    setShinePos({ x: shineX, y: shineY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Simulate verification scan
  const startVerification = (id: string) => {
    const cleaned = id.trim().toUpperCase();
    setVerificationResult('scanning');
    
    setTimeout(() => {
      const found = CERTIFICATES_DATA.find(c => c.id === cleaned) || null;
      if (found) {
        setScannedCert(found);
        setVerificationResult('success');
      } else {
        setVerificationResult('failed');
      }
    }, 2200);
  };

  return (
    <section id="certificates" className="relative py-24 px-6 md:px-12 bg-[#050816] overflow-hidden border-t border-white/5">
      {/* Toast Notifications */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#12121A]/90 border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-brand-secondary animate-pulse" />
            </div>
            <div className="text-xs">
              <span className="block font-black text-white">KRONEX Registry Alert</span>
              <span className="block text-[#A1A1AA] font-medium">{activeNotification}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic 3D Floating Particle Canvas Backdrop */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Decorative Aurora Gradients */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-[550px] h-[550px] bg-brand-secondary/5 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block with luxurious aesthetic typography */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#22D3EE] text-xs font-mono font-bold uppercase tracking-wider mb-4 animate-pulse">
            <Award className="w-4 h-4 text-[#22D3EE]" />
            <span>Verifiable Blockchain Credentials</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Earn an Industry-Recognized Certificate
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-sans mt-4 leading-relaxed max-w-2xl mx-auto">
            Complete any KRONEX AI course and unlock a premium, verifiable digital certificate that proves your AI skills worldwide. Backed by immutable cryptographic hashes.
          </p>
        </div>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Large Floating 3D Premium Certificate display */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            
            {/* Live Interactive Selectors */}
            <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10 shadow-sm max-w-md w-full relative z-20 animate-fade-in">
              {CERTIFICATES_DATA.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedIdx === idx 
                      ? 'bg-[#7C3AED] text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c.id.split('-')[1]} SPEC
                </button>
              ))}
            </div>

            {/* Glowing Orbiting Ring Background Decor */}
            <div className="absolute w-[440px] h-[340px] border border-white/5 rounded-full rotate-12 scale-90 pointer-events-none opacity-60" />
            <div className="absolute w-[340px] h-[240px] border border-dashed border-white/10 rounded-full -rotate-12 scale-90 pointer-events-none opacity-40" />

            {/* 3D Tilt Certificate Card */}
            <div 
              ref={certRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.1s ease-out',
                boxShadow: '0 30px 60px -15px rgba(124, 92, 255, 0.25)'
              }}
              className="relative w-full max-w-lg aspect-[1.414/1] bg-slate-950/80 backdrop-blur-md border-[8px] border-double border-white/15 rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden cursor-pointer selection:bg-none"
            >
              {/* Shine Sweep Overlay */}
              <div 
                style={{
                  background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 60%)`,
                }}
                className="absolute inset-0 pointer-events-none z-20"
              />

              {/* Holographic Border/Glow effect */}
              <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
              
              {/* Watermark logo */}
              <div className="absolute -right-16 -bottom-16 w-60 h-60 bg-white/3 border border-white/5 rounded-full flex items-center justify-center opacity-70">
                <div className="w-44 h-44 rounded-full border border-white/5 flex items-center justify-center">
                  <Cpu className="w-20 h-20 text-white/5" />
                </div>
              </div>

              {/* Top Banner Row */}
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center">
                    <Cpu className="w-5.5 h-5.5 text-white" />
                  </div>
                  <div>
                    <span className="block font-display font-black text-white text-xs tracking-wider uppercase">KRONEX CORE</span>
                    <span className="block text-[8px] font-mono text-white/50">CERTIFICATE AUTHENTICATOR</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">VERIFICATION ID</span>
                  <span className="text-xs font-mono font-bold text-brand-secondary">{activeCert.id}</span>
                </div>
              </div>

              {/* Certificate Recipient & Title */}
              <div className="my-6 relative z-10 space-y-3.5">
                <span className="text-[10px] font-mono font-bold text-white/40 block uppercase tracking-widest text-center">
                  This premium digital credential is presented to
                </span>
                
                <h3 className="text-2xl md:text-3xl font-display font-black text-white text-center tracking-tight border-b border-white/10 pb-3">
                  {activeCert.recipient}
                </h3>

                <p className="text-[11px] text-white/60 text-center max-w-sm mx-auto">
                  for successfully mastering all specialized modules and demonstrating world-class SLA capabilities in the curriculum of:
                </p>

                <h4 className={`text-sm md:text-base font-bold text-center bg-gradient-to-r ${activeCert.color} bg-clip-text text-transparent font-display`}>
                  {activeCert.title}
                </h4>
              </div>

              {/* Bottom Metadata row */}
              <div className="flex justify-between items-end border-t border-white/10 pt-4 relative z-10">
                {/* QR Verification mockup */}
                <div className="flex items-center space-x-3">
                  <div 
                    onClick={() => {
                      setVerificationId(activeCert.id);
                      setIsVerifyModalOpen(true);
                      startVerification(activeCert.id);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-brand-secondary hover:bg-white/10 transition-all cursor-pointer"
                    title="Click to Verify QR Authenticator"
                  >
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-[9px] font-mono text-white/40 leading-tight">
                    <span className="block text-white/70 font-bold">SCAN QR</span>
                    <span className="block">ONE-CLICK SECURED</span>
                  </div>
                </div>

                {/* Secure Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-brand-secondary animate-pulse" />
                  </div>
                  <span className="text-[8px] font-mono text-white/40 mt-1 uppercase">SECURITY SECURED</span>
                </div>

                {/* Digital Sign hash */}
                <div className="text-right text-[8px] font-mono text-white/40 max-w-[120px] leading-tight">
                  <span className="block text-white/70 font-bold uppercase">BLOCKCHAIN HASH</span>
                  <span className="block truncate font-mono">{activeCert.hash}</span>
                  <span className="block mt-0.5 text-brand-secondary font-bold uppercase">{activeCert.grade}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions overlay */}
            <div className="flex space-x-4 mt-6">
              <button 
                onClick={() => {
                  setVerificationId(activeCert.id);
                  setIsVerifyModalOpen(true);
                  startVerification(activeCert.id);
                }}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white/80 hover:text-white transition-all flex items-center space-x-1.5 shadow-2xl cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-white/50" />
                <span>Quick Verify</span>
              </button>

              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '#';
                  link.onclick = (e) => {
                    e.preventDefault();
                    notify(`Downloading PDF certificate: ${activeCert.id}`);
                  };
                  link.click();
                }}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white/80 hover:text-white transition-all flex items-center space-x-1.5 shadow-2xl cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-white/50" />
                <span>Save PDF</span>
              </button>

              <button 
                onClick={() => notify("Copied certificate link to share on LinkedIn!")}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white/80 hover:text-white transition-all flex items-center space-x-1.5 shadow-2xl cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>Share LinkedIn</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Feature lists, benefits, dynamic verification CTAs */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">
                Empower Your Career with KRONEX Verification
              </h3>
              <p className="text-sm text-[#A1A1AA] font-sans leading-relaxed">
                Unlock career pathways in tech-forward industries. Our automated digital records system interfaces with leading global registries to ensure your hard work stays verifiable 24/7/365.
              </p>
            </div>

            {/* Feature Cards Grid (2x3 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Industry Recognized",
                  desc: "Partnered with leading global AI, Cloud, and engineering groups.",
                  icon: Cpu,
                  color: "border-purple-500/20 bg-purple-500/10 text-purple-400"
                },
                {
                  title: "Globally Verifiable",
                  desc: "Unique ID verification system via open cryptographic portals.",
                  icon: Globe,
                  color: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                },
                {
                  title: "ATS Optimized",
                  desc: "Includes clear metadata tags easily parsed by applicant trackers.",
                  icon: Layers,
                  color: "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                },
                {
                  title: "Blockchain Secured",
                  desc: "Immutable block hash verification guarantees authentic credentials.",
                  icon: ShieldCheck,
                  color: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                },
                {
                  title: "Secure QR Code",
                  desc: "Instantly check active student validity via physical QR codes.",
                  icon: QrCode,
                  color: "border-orange-500/20 bg-orange-500/10 text-orange-400"
                },
                {
                  title: "Lifetime Access",
                  desc: "Credentials hosted permanently with dynamic metadata updates.",
                  icon: FileText,
                  color: "border-pink-500/20 bg-pink-500/10 text-pink-400"
                }
               ].map((card, i) => (
                <div 
                  key={i} 
                  className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-[#7C3AED]/30 hover:-translate-y-1 hover:shadow-lg transition-all group backdrop-blur-md"
                >
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white font-display uppercase tracking-wide group-hover:text-[#7C3AED] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-[11.5px] text-slate-400 font-sans mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Call to Actions (Interactive buttons) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => {
                  const element = document.getElementById('courses');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex-1 py-4 px-6 rounded-xl font-display font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-1.5 group cursor-pointer shadow-sm active:scale-95"
              >
                <span>Get Certified Now</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
              </button>

              <button 
                onClick={() => {
                  setVerificationId(activeCert.id);
                  setIsVerifyModalOpen(true);
                  startVerification(activeCert.id);
                }}
                className="flex-1 py-4 px-6 rounded-xl font-display font-bold text-xs uppercase tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 shadow-sm"
              >
                <Eye className="w-4 h-4 text-slate-400" />
                <span>View Sample</span>
              </button>

              <button 
                onClick={() => {
                  setVerificationId('');
                  setVerificationResult('idle');
                  setIsVerifyModalOpen(true);
                }}
                className="flex-1 py-4 px-6 rounded-xl font-display font-bold text-xs uppercase tracking-widest border border-brand-secondary/20 bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary/20 transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-brand-secondary animate-pulse" />
                <span>Verify ID</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Holographic Verification Simulator Modal Overlay */}
      <AnimatePresence>
        {isVerifyModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#12121A]/95 border border-white/10 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
            >
              {/* Absolute Watermark Background */}
              <div className="absolute -left-12 -top-12 w-48 h-48 bg-white/3 rounded-full border border-white/5 pointer-events-none opacity-40 flex items-center justify-center">
                <Lock className="w-20 h-20 text-white/5" />
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setIsVerifyModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-90" />
              </button>

              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-brand-secondary animate-pulse" />
                </div>
                <h3 className="text-xl font-display font-black text-white tracking-tight">
                  KRONEX AI Registry Portal
                </h3>
                <p className="text-xs text-[#A1A1AA] font-sans max-w-sm mx-auto">
                  Type a verifiable Certificate ID below to trigger cryptographic validation sequences across node clusters.
                </p>
              </div>

              {/* Verification input field */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input 
                    type="text"
                    placeholder="Enter ID (e.g. KRNX-AI-883F)"
                    value={verificationId}
                    onChange={(e) => setVerificationId(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono font-bold text-white outline-none focus:border-brand-primary placeholder-white/30"
                  />
                  <button 
                    onClick={() => startVerification(verificationId)}
                    className="px-5 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/85 text-xs font-mono font-bold text-white transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Query Registry</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-[10px] font-mono text-white/40 uppercase font-bold self-center">Try:</span>
                  {CERTIFICATES_DATA.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setVerificationId(c.id);
                        startVerification(c.id);
                      }}
                      className="px-2.5 py-1 text-[10px] font-mono bg-white/5 hover:bg-white/10 hover:text-brand-secondary border border-white/10 hover:border-white/20 text-white/80 rounded-lg transition-all cursor-pointer"
                    >
                      {c.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Holographic Output logs */}
              <div className="mt-6 border border-white/10 rounded-2xl bg-black/90 p-4 min-h-[140px] flex flex-col justify-between relative overflow-hidden">
                {/* Scanner Overlay Line */}
                {verificationResult === 'scanning' && (
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[bounce_1.5s_infinite] top-0 pointer-events-none" />
                )}

                <div className="space-y-2.5">
                  <span className="text-[9px] font-mono font-bold text-white/40 block uppercase tracking-widest border-b border-white/5 pb-1.5">
                    PARSER TERMINAL INTERFACE:
                  </span>
                  
                  {verificationResult === 'idle' && (
                    <p className="text-[11px] font-mono text-white/40 italic">
                      Waiting for active registry token payload...
                    </p>
                  )}

                  {verificationResult === 'scanning' && (
                    <div className="space-y-1 font-mono text-[10.5px] text-cyan-400 leading-relaxed">
                      <p className="animate-pulse">▶ Resolving DNS for registry.kronex.ai...</p>
                      <p className="delay-100">▶ Cryptographic cluster handshake successful.</p>
                      <p className="delay-200">▶ Parsing immutable signature payload for "{verificationId}"</p>
                    </div>
                  )}

                  {verificationResult === 'success' && scannedCert && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>AUTHENTICATION VERIFIED SUCCESS (SLA SECURED)</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-1 text-[10px] font-mono text-[#A1A1AA]">
                        <div>
                          <span className="block text-white/30">RECIPIENT:</span>
                          <span className="text-white font-bold">{scannedCert.recipient}</span>
                        </div>
                        <div>
                          <span className="block text-white/30">CREDENTIAL TITLE:</span>
                          <span className="text-white font-bold">{scannedCert.title}</span>
                        </div>
                        <div>
                          <span className="block text-white/30">DATE RECORDED:</span>
                          <span className="text-white font-bold">{scannedCert.date}</span>
                        </div>
                        <div>
                          <span className="block text-white/30">BLOCK HASH:</span>
                          <span className="text-white font-bold truncate block">{scannedCert.hash}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {verificationResult === 'failed' && (
                    <div className="space-y-1.5 text-red-400 font-mono text-[11px]">
                      <p className="font-bold flex items-center space-x-1">
                        <span>⚠ REGISTRY LOOKUP ERROR</span>
                      </p>
                      <p className="text-white/40 text-[10px]">
                        The key index was not matched in KRONEX-BLOC-LEDGER. Check syntax or type a valid identifier.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer status indicator */}
                <div className="flex justify-between items-center text-[8.5px] font-mono text-white/30 pt-3 border-t border-white/5 mt-3">
                  <span>SSL STATUS: RSA-4096 VALID</span>
                  <span>LATENCY: 14MS</span>
                </div>
              </div>

              {/* Close CTAs */}
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 text-xs font-bold text-white/80 hover:text-white transition-all cursor-pointer"
                >
                  Close Portal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
