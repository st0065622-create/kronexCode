import React, { useState } from 'react';
import { ACHIEVEMENTS } from '../data';
import { UserProgress } from '../types';
import { 
  Award, Zap, Calendar, Sparkles, BrainCircuit, Lock, 
  CheckCircle, ShieldCheck, Printer, Check, Star 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProgressTrackerProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

export default function ProgressTracker({ progress, onUpdateProgress }: ProgressTrackerProps) {
  const [userName, setUserName] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Constants
  const xpRequiredForNextLevel = 300;
  const currentLevelXp = progress.xp % xpRequiredForNextLevel;
  const xpPercentage = Math.min((currentLevelXp / xpRequiredForNextLevel) * 100, 100);

  // Roadmap Checkpoints
  const roadmapPoints = [
    { title: 'Core Prompt Engineering', desc: 'System templates, role personas, output restrictions.', requiredLessons: 1 },
    { title: 'Deterministic Math & Loops', desc: 'Condition checking, code sanitization, clamp helpers.', requiredLessons: 2 },
    { title: 'Few-Shot Classification & Tokens', desc: 'Exemplars, zero-shot comparative, tone tuning.', requiredLessons: 3 },
    { title: 'Dynamic Interfacing with APIs', desc: 'Template literal builders, prompt injections, output parser.', requiredLessons: 4 },
  ];

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setIsGenerated(true);
  };

  const hasUnlockedCertificate = progress.completedLessons.length >= 2;

  // Render achievement tracker lists
  const renderedAchievements = ACHIEVEMENTS.map(ach => {
    let current = ach.current;
    
    // Dynamically calculate current based on actual user progress state
    if (ach.id === 'ach-first-step') {
      current = progress.completedLessons.length >= 1 ? 1 : 0;
    } else if (ach.id === 'ach-prompt-wizard') {
      const promptLessons = progress.completedLessons.filter(id => id.startsWith('prompting'));
      current = Math.min(promptLessons.length, 2);
    } else if (ach.id === 'ach-forum-post') {
      current = progress.xp >= 150 ? 1 : 0; // Simulated forum action based on XP gained
    }

    const target = ach.target;
    const computedPercentage = Math.min((current / target) * 100, 100);
    const isUnlocked = computedPercentage >= 100;

    return {
      ...ach,
      current,
      progress: computedPercentage,
      isUnlocked
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="progress-tracker-panel" className="max-w-6xl mx-auto px-4 py-10 text-white">
      
      {/* Upper overview stats row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-10">
        
        {/* Dynamic XP Circular Ring block */}
        <div className="md:col-span-5 bg-white/[0.03] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center text-center">
          <h2 className="font-display font-bold text-xs uppercase tracking-wider text-white/40 mb-6">
            Educational Rank Status
          </h2>
          
          <div className="relative w-40 h-40 flex items-center justify-center mb-6">
            {/* SVG Ring Background */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-white/5"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-brand-secondary transition-all duration-1000"
                strokeWidth="10"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * xpPercentage) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="text-center z-10">
              <span className="block text-4xl font-black font-display text-white bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Lv. {progress.level}
              </span>
              <span className="block text-[10px] uppercase font-bold text-brand-secondary font-mono mt-1">
                {currentLevelXp} / 300 XP
              </span>
            </div>
          </div>

          <p className="text-xs font-sans text-white/60 max-w-[240px]">
            Earn {xpRequiredForNextLevel - currentLevelXp} more XP by passing lessons, commenting, or enrolling paths to level up.
          </p>
        </div>

        {/* Level Stats Cards */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Daily Streak Card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-white/40 uppercase">Daily Continuity</span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <Zap className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div>
              <span className="block text-3xl font-display font-black text-white">3 Days</span>
              <span className="block text-xs text-white/60 mt-1">Keep coding daily to double your XP multipliers!</span>
            </div>
          </div>

          {/* Certificate unlock card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-white/40 uppercase">Certifications</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="block text-lg font-display font-black text-white">
                {hasUnlockedCertificate ? 'Certificate Unlocked!' : 'LOCKED (1/2 lessons)'}
              </span>
              <button
                onClick={() => hasUnlockedCertificate && setShowCertificateModal(true)}
                disabled={!hasUnlockedCertificate}
                className={`mt-2 px-4 py-2 rounded-xl text-xs font-bold font-display cursor-pointer transition-all border ${
                  hasUnlockedCertificate 
                    ? 'shining-btn text-white border-white/10 hover:scale-[1.02]' 
                    : 'bg-white/5 text-white/35 border-white/5 cursor-not-allowed'
                }`}
              >
                {hasUnlockedCertificate ? 'Generate & Preview Cert' : 'Complete 2 lessons to unlock'}
              </button>
            </div>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: Roadmap milestones */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-display font-black text-lg text-white mb-6">Your Interactive AI Learning Roadmap</h3>
            
            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
              {roadmapPoints.map((point, idx) => {
                const isPassed = progress.completedLessons.length >= point.requiredLessons;
                return (
                  <div key={idx} className="flex items-start space-x-4 relative">
                    <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 shrink-0 z-10 transition-all ${
                      isPassed 
                        ? 'bg-brand-primary border-brand-primary text-white shadow-[0_0_15px_rgba(123,47,247,0.4)]' 
                        : 'bg-slate-950 border-white/10 text-white/40'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-mono font-bold">{idx + 1}</span>}
                    </div>
                    <div>
                      <h4 className={`font-display font-bold text-xs ${isPassed ? 'text-white' : 'text-white/45'}`}>
                        {point.title}
                      </h4>
                      <p className="text-xs text-white/60 font-sans mt-0.5 leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Achievements list */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-display font-black text-lg text-white mb-6">Earned Badges & Achievements</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderedAchievements.map((ach) => (
                <div 
                  key={ach.id}
                  className={`border rounded-2xl p-4 transition-all flex flex-col justify-between ${
                    ach.isUnlocked 
                      ? 'bg-brand-primary/10 border-brand-primary/30 shadow-[0_4px_20px_rgba(123,47,247,0.1)]' 
                      : 'bg-white/5 border-white/5 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-display font-bold text-xs text-white">{ach.title}</span>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${ach.isUnlocked ? 'text-amber-400 animate-pulse' : 'text-white/30'}`}>
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <p className="text-[10px] text-white/60 font-sans leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-[9px] font-bold font-mono text-white/40 mb-1">
                      <span>Progress</span>
                      <span>{ach.current} / {ach.target}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CERTIFICATE LIGHTBOX MODAL */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b1120] rounded-3xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl relative overflow-hidden text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowCertificateModal(false);
                  setIsGenerated(false);
                  setUserName('');
                }}
                className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 font-bold cursor-pointer"
              >
                ✕
              </button>

              {!isGenerated ? (
                /* STEP 1: ENTER NAME FORM */
                <form onSubmit={handleGenerateCertificate} className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-xl text-white">Claim Your Certification</h3>
                    <p className="text-xs text-white/60 font-sans max-w-sm mx-auto">
                      Congratulations! You have completed the required milestones in the Kronex AI interactive coding sandbox. Please input your official name below.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-white/45 uppercase tracking-wider font-mono">Recipient Full Name</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g., Jane Doe"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-white/30 outline-none focus:border-brand-primary text-center font-sans font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl font-display font-bold text-xs text-white shining-btn hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-white/10"
                  >
                    Generate Credentials
                  </button>
                </form>
              ) : (
                /* STEP 2: PRINTABLE/RENDERED LUXURY CERTIFICATE */
                <div className="space-y-6">
                  
                  {/* Certificate frame block */}
                  <div className="p-8 border-8 border-double border-amber-500/30 rounded-2xl relative bg-white/[0.02] shadow-inner text-center font-sans space-y-6">
                    
                    {/* Gold Seal top indicator */}
                    <div className="flex justify-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FFB800] to-[#FFD700] flex items-center justify-center shadow-lg relative border border-white/25">
                        <ShieldCheck className="w-8 h-8 text-slate-950" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="block text-[10px] tracking-widest font-bold text-brand-secondary font-mono uppercase">CERTIFICATE OF COMPLETION</span>
                      <h2 className="font-display font-black text-2xl text-white tracking-tight">Kronex AI Specialist</h2>
                    </div>

                    <p className="text-xs italic text-white/60">
                      This official learning credential validates that the following explorer has successfully solved advanced engineering challenges in prompt logic, algorithmic clamps, and deterministic AI parsing models:
                    </p>

                    <h3 className="font-display font-black text-2xl text-amber-400 border-b-2 border-amber-500/20 pb-2 inline-block px-10">
                      {userName}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-left pt-4 max-w-sm mx-auto">
                      <div>
                        <span className="block text-[8px] font-mono font-bold text-white/40 uppercase">VALIDATION NUMBER</span>
                        <span className="block text-xs font-bold text-white font-mono uppercase">KX-AI-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-mono font-bold text-white/40 uppercase">AUTHORIZED CO-SIGNER</span>
                        <span className="block text-xs font-bold text-white font-display">Kronex Academy Board</span>
                      </div>
                    </div>

                  </div>

                  {/* Print trigger actions */}
                  <div className="flex gap-4">
                    <button
                      onClick={handlePrint}
                      className="flex-1 py-3 rounded-2xl font-display font-bold text-xs border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-brand-secondary" />
                      <span>Print Certificate</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowCertificateModal(false);
                        setIsGenerated(false);
                        setUserName('');
                      }}
                      className="flex-1 py-3 rounded-2xl font-display font-bold text-xs shining-btn text-white transition-all text-center cursor-pointer border border-white/10"
                    >
                      <span>Close and return</span>
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
