import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  text: string;
  rating: number;
  tags: string[];
  gradient: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sofia Martinez",
    role: "Junior AI Engineer",
    company: "NeuralFlow Labs",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    text: "The prompt engineering masterclass completely altered my workflow. I went from writing basic greeting lines to structuring reliable system prompts for real-time customer support apps. KRONEX AI is worth 100x its cost!",
    rating: 5,
    tags: ["Prompt Engineering", "System Prompts"],
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    id: 2,
    name: "Liam Peterson",
    role: "Full Stack Freelancer",
    company: "DevCraft Sovereign",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    text: "Learning how to clamp hyperparameters and manipulate matrices with practical Numpy helper loops let me claim high-ticket freelance gigs within weeks of completing the path. Generous grid lines and luxury typography spacing are top tier.",
    rating: 5,
    tags: ["Numpy Pipelines", "Linear UI"],
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: 3,
    name: "Ananya Iyer",
    role: "Lead Product Designer",
    company: "Aura Interfaces",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    text: "I loved the luxury UI UX branding chapter. It taught me the geometry guidelines necessary to create clean Apple-inspired layouts. Highly responsive support in the community forums is wonderful.",
    rating: 5,
    tags: ["Luxury UI/UX", "Apple Geometry"],
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 4,
    name: "Dr. Rajesh Kumar",
    role: "Core Systems Architect",
    company: "Cognitive Scale",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    text: "The architectural depth of KRONEX AI is unmatched. From sandbox security models to real-time prompt compilers, it provides developers with the structural foundations required to build modern AI-orchestrated full stack applications.",
    rating: 5,
    tags: ["AI Orchestration", "Security Models"],
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    id: 5,
    name: "Elena Rostova",
    role: "Cognitive Specialist",
    company: "Mindflow Synthesis",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    text: "Integrating live feedback controllers and stateful memory into LLM wrappers used to take us days. KRONEX AI's interactive modules and template databases saved us countless hours of over-engineering.",
    rating: 5,
    tags: ["Feedback Loops", "Stateful Memory"],
    gradient: "from-amber-500 to-orange-500"
  },
  {
    id: 6,
    name: "Sarah Jenkins",
    role: "Founder & CEO",
    company: "Promptify.ai",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    text: "Our entire engineering team went through KRONEX's credentials course. The verifiable blockchain certificates are an incredible touch—giving our clients instant proof of our cutting-edge AI capabilities.",
    rating: 5,
    tags: ["Blockchain Credentials", "Team Training"],
    gradient: "from-violet-500 to-fuchsia-500"
  }
];

export default function PremiumTestimonialsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto cycle active index for glowing effects
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Handle manual navigation in tablet/mobile mode
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  // Double the testimonials list to create infinite seamless loop scroll
  const doubledTestimonials = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section 
      id="success-stories" 
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#0B1020] overflow-hidden border-y border-white/5"
    >
      {/* Self-contained styling for high-performance seamless marquee loop at 60fps */}
      <style>{`
        @keyframes premium-marquee-horizontal {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.3333%, 0, 0);
          }
        }
        .animate-premium-marquee-horizontal {
          animation: premium-marquee-horizontal 30s linear infinite;
        }
        .marquee-paused {
          animation-play-state: paused !important;
        }
        .premium-glass-card-dark {
          background: rgba(15, 23, 42, 0.45) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.5) !important;
        }
        .active-neon-glow {
          border-color: rgba(124, 92, 255, 0.6) !important;
          box-shadow: 
            0 0 25px rgba(124, 92, 255, 0.25), 
            0 0 50px rgba(0, 212, 255, 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>

      {/* Soft Purple & Cyan Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Floating Particles in Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute w-2 h-2 rounded-full bg-purple-500/50 top-12 left-10% neon-particle-1" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/50 top-1/3 right-15% neon-particle-2" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-indigo-500/40 bottom-16 left-1/4 neon-particle-1" style={{ animationDelay: '3s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-pink-500/40 top-1/2 left-2/3 neon-particle-2" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#A855F7] text-[10px] font-mono font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] animate-pulse" />
            <span>ALUMNI TRUST VERDICT</span>
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-none"
          >
            Endorsed by Technical Leaders
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed"
          >
            Discover how modern freelancers, consultants, and junior engineers elevate their professional delivery value using KRONEX AI sandbox environments.
          </motion.p>
        </div>

        {/* Desktop & Tablet Marquee Slider Slider Container */}
        <div 
          className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing pb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Fading Side Masks */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#0B1020] to-transparent z-20 pointer-events-none hidden md:block" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#0B1020] to-transparent z-20 pointer-events-none hidden md:block" />

          {/* Scrolling Track */}
          <div 
            ref={containerRef}
            className={`flex gap-6 py-6 w-max animate-premium-marquee-horizontal ${isPaused ? 'marquee-paused' : ''}`}
          >
            {doubledTestimonials.map((testimonial, idx) => {
              const isCurrentlyActive = (idx % TESTIMONIALS.length) === activeIndex;

              return (
                <div
                  key={`${testimonial.id}-${idx}`}
                  className={`w-[320px] sm:w-[400px] flex-shrink-0 premium-glass-card-dark rounded-[28px] p-8 relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform hover:scale-105 ${
                    isCurrentlyActive ? 'active-neon-glow -translate-y-2' : 'hover:-translate-y-1'
                  }`}
                  style={{
                    animation: !isPaused ? 'float 6s ease-in-out infinite' : 'none',
                    animationDelay: `${(idx % TESTIMONIALS.length) * 0.5}s`
                  }}
                >
                  {/* Floating Quote Icon */}
                  <div className="absolute top-6 right-8 text-purple-500/10 group-hover:text-purple-500/20 transition-colors pointer-events-none">
                    <Quote className="w-10 h-10 transform rotate-180" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>

                  {/* Testimonial Core Text */}
                  <p className="text-xs sm:text-sm font-sans text-white leading-relaxed mb-8 relative z-10">
                    "{testimonial.text}"
                  </p>

                  {/* Profile & Metadata Footer */}
                  <div className="flex items-center space-x-4 pt-6 border-t border-white/5">
                    {/* Gradient Ring Avatar */}
                    <div className={`p-[2px] bg-gradient-to-tr ${testimonial.gradient} rounded-full`}>
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-slate-900 border border-slate-950" 
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                        {testimonial.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs font-mono text-slate-400 truncate mt-0.5">
                        {testimonial.role} at <span className="text-[#22D3EE]">{testimonial.company}</span>
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {testimonial.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-mono text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Ambient Glow behind active cards */}
                  {isCurrentlyActive && (
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/20 via-cyan-500/10 to-transparent rounded-[28px] blur-xl opacity-70 -z-10" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Swipe Indicators & Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 max-w-xs mx-auto md:hidden">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex space-x-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-6 bg-[#7C3AED]' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
