import React, { useState } from 'react';
import { Check, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPricingFAQProps {
  onLaunchPlatform: () => void;
}

export default function LandingPricingFAQ({ onLaunchPlatform }: LandingPricingFAQProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const plans = [
    {
      name: 'Sandbox Developer',
      price: '$0',
      period: 'Forever Free',
      desc: 'Perfect for engineering teams wanting to evaluate KRONEX sandbox capabilities.',
      features: [
        'Access to standard Sandbox lessons',
        'Simulated console compiler feedback',
        'Pre-seeded curriculum outlines',
        'Standard community support channels'
      ],
      cta: 'Explore Sandbox',
      popular: false
    },
    {
      name: 'Enterprise Core',
      price: '$49',
      period: 'Per Month / Billed Annually',
      desc: 'The complete cognitive platform for professional teams scaling autonomous workloads.',
      features: [
        'Access to all Sandbox lessons & templates',
        'Official KRONEX Specialist Credentials',
        'Complete curriculum blueprints',
        'Priority SLA support channels',
        'Deterministic hyperparameter controls',
        'High-dimensional coordinate distance checks'
      ],
      cta: 'Provision Enterprise Core',
      popular: true
    },
    {
      name: 'Custom Sovereign',
      price: 'Custom',
      period: 'Bespoke SLA Agreements',
      desc: 'Dedicated clusters, completely containerized for high-privacy staff.',
      features: [
        'All Enterprise Core features',
        '1-on-1 private architect consults',
        'Sovereign self-hosted deployment blocks',
        'Custom corporate team seat provisioning',
        'Zero telemetry logging configurations'
      ],
      cta: 'Request Custom Demo',
      popular: false
    }
  ];

  const faqs = [
    {
      q: 'Do I need paid API credentials to test the KRONEX Sandbox?',
      a: 'No! The sandbox is fully virtualized. You can write, test, and evaluate custom models, prompts, and pipeline scripts without incurring external API costs.'
    },
    {
      q: 'How does the certificate generation pipeline work?',
      a: 'Upon successfully passing our interactive sandbox modules, the platform automatically generates cryptographic specialty credentials linked to a verified validation code.'
    },
    {
      q: 'Is there a self-hosted option for sovereign workloads?',
      a: 'Yes! The Custom Sovereign plan allows complete containment in your private cloud, including self-hosted model replicas and no external telemetry dependencies.'
    },
    {
      q: 'What is the standard SLA uptime guarantee?',
      a: 'Our Enterprise Core plan offers a strict 99.99% uptime SLA guarantee, backed by global geographically-distributed failover clusters.'
    }
  ];

  return (
    <div className="bg-transparent">
      
      {/* 1. PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#22D3EE] text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>PRICING MATRIX</span>
          </span>
          <h2 className="font-display font-black text-3.5xl sm:text-4.5xl text-white tracking-tight leading-none">
            Predictable Plans, Infinite Speed.
          </h2>
          <p className="text-sm text-slate-400 font-sans font-medium">
            Invest in your infrastructure with transparent plans built for technical excellence and scalability.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`p-8 bg-white/5 border rounded-[24px] shadow-sm backdrop-blur-md flex flex-col justify-between min-h-[500px] relative transition-all duration-300 ${
                plan.popular 
                  ? 'border-[#7C3AED]/40 ring-1 ring-[#7C3AED]/30 shadow-purple-500/5' 
                  : 'border-white/10 hover:border-[#7C3AED]/30 hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] text-white text-[9px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  MOST POPULAR SYSTEM
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-black text-xl text-white">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 font-sans font-medium">
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    / {plan.period}
                  </span>
                </div>

                <ul className="space-y-3.5 pt-4 border-t border-white/10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-2 text-xs text-white/95 font-sans font-medium">
                      <Check className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={onLaunchPlatform}
                  className={`w-full py-3.5 rounded-2xl font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:opacity-90 text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-white/10 border border-white/10 hover:bg-white/20 text-white hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center mb-16 space-y-3">
          <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-rose-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>KNOWLEDGE INFRASTRUCTURE</span>
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Frequently Solved Inquiries
          </h2>
          <p className="text-sm text-slate-400 font-sans font-medium">
            Find immediate clarity on billing SLA, sandboxed virtual models, and sovereign compliance below.
          </p>
        </div>

        {/* Minimal Accordion FAQ cards */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="font-display font-black text-sm tracking-wide">
                    {faq.q}
                  </span>
                  <span className={`w-5 h-5 rounded-full bg-white/5 flex items-center justify-center font-mono text-xs font-black transition-transform duration-300 ${isOpen ? 'rotate-180 bg-purple-500/10 text-[#7C3AED]' : 'text-slate-400'}`}>
                    ↓
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs text-slate-400 font-sans font-medium leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
