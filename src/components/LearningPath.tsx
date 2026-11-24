import React, { useState, useEffect } from 'react';
import { 
  Award, Shield, Zap, Target, Star, Calendar, Users, 
  Lock, CheckCircle2, ChevronRight, Trophy, Sparkles, 
  Flame, Key, BookOpen, Clock, Play, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress } from '../types';

// Predefined gamified levels
const LEVEL_TITLES = [
  "Beginner", "Explorer", "Creator", "Builder", "Developer", 
  "AI Engineer", "AI Architect", "AI Master", "AI Expert", "AI Legend"
];

const DAILY_MISSIONS = [
  { id: 'dm1', title: 'Compile any Prompt Sandbox', xp: 50, reward: '10 API Credits', completed: false },
  { id: 'dm2', title: 'Complete your first Lesson Module', xp: 120, reward: 'Premium Badge Token', completed: true },
  { id: 'dm3', title: 'Interact with the Vibe Studio AI', xp: 80, reward: 'Vibe Accelerator', completed: false }
];

const WEEKLY_CHALLENGES = [
  { id: 'wc1', title: 'Construct a multi-agent work squad mission', xp: 300, progress: 0, target: 1, completed: false },
  { id: 'wc2', title: 'Keep a 5-day learning streak active', xp: 500, progress: 3, target: 5, completed: false }
];

const BADGES = [
  { id: 'b1', name: 'SLA Pioneer', desc: 'Synthesized your first active prompt block', icon: Shield, color: 'text-purple-400', requiredLvl: 1 },
  { id: 'b2', name: 'Sandbox Knight', desc: 'Interact 10 times in sandbox modules', icon: Zap, color: 'text-cyan-400', requiredLvl: 2 },
  { id: 'b3', name: 'Master Architect', desc: 'Unlock LLM orchestration nodes', icon: Trophy, color: 'text-emerald-400', requiredLvl: 4 },
  { id: 'b4', name: 'AI Overlord', desc: 'Unlock Level 7 or complete AI Master spec', icon: Star, color: 'text-orange-400', requiredLvl: 7 }
];

const SKILL_TREE = [
  { id: 'st_prompt', name: 'Prompt Engineering Core', category: 'Foundation', xpCost: 100, desc: 'Master zero-shot, few-shot, and system role injections.', unlocked: true },
  { id: 'st_rag', name: 'RAG Architecture Matrix', category: 'Data Flow', xpCost: 250, desc: 'Integrate custom vector embeddings and text retrievals.', unlocked: false },
  { id: 'st_agents', name: 'Agent Squad Orchestration', category: 'Autonomous', xpCost: 400, desc: 'Construct self-correcting prompt state chains.', unlocked: false },
  { id: 'st_finetune', name: 'Fine-Tuning Lattices', category: 'Advanced', xpCost: 600, desc: 'Adjust parameter weights on specialized deep domains.', unlocked: false },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "shashvat (You)", xp: 2450, badge: "AI Architect", isSelf: true },
  { rank: 2, name: "Sarah Connor", xp: 2100, badge: "AI Engineer", isSelf: false },
  { rank: 3, name: "Neo Matrix", xp: 1950, badge: "Developer", isSelf: false },
  { rank: 4, name: "Hal 9000", xp: 1800, badge: "Builder", isSelf: false },
  { rank: 5, name: "Ava Turing", xp: 1550, badge: "Explorer", isSelf: false }
];

interface LearningPathProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

export default function LearningPath({ progress, onUpdateProgress }: LearningPathProps) {
  const [level, setLevel] = useState(progress.level || 1);
  const [xp, setXp] = useState(progress.xp || 0);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>(['st_prompt']);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [dailyMissions, setDailyMissions] = useState(DAILY_MISSIONS);
  const [weeklyChallenges, setWeeklyChallenges] = useState(WEEKLY_CHALLENGES);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  // Sound/Vibe Level Up overlay state
  const [showLevelUpOverlay, setShowLevelUpOverlay] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);

  const xpNeededForNextLevel = level * 300;
  const xpProgressPercentage = Math.min((xp / xpNeededForNextLevel) * 100, 100);

  const notify = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 3500);
  };

  const handleGainXp = (amount: number) => {
    let newXp = xp + amount;
    let currentLvl = level;
    let leveledUp = false;

    while (newXp >= currentLvl * 300 && currentLvl < 10) {
      newXp -= currentLvl * 300;
      currentLvl += 1;
      leveledUp = true;
    }

    setXp(newXp);
    setLevel(currentLvl);

    onUpdateProgress({
      xp: newXp,
      level: currentLvl
    });

    if (leveledUp) {
      setPreviousLevel(level);
      setShowLevelUpOverlay(true);
      notify(`🎉 LEVEL UP! You reached Level ${currentLvl}: ${LEVEL_TITLES[currentLvl - 1]}!`);
    } else {
      notify(`+${amount} XP Gained towards level optimization!`);
    }
  };

  const handleCompleteMission = (id: string, xpAmount: number) => {
    setDailyMissions(prev => prev.map(m => m.id === id ? { ...m, completed: true } : m));
    handleGainXp(xpAmount);
  };

  const handleUnlockSkill = (id: string, xpCost: number) => {
    if (unlockedSkills.includes(id)) return;
    
    // Check if user has enough XP in their current total level calculation
    const totalXp = xp + (level > 1 ? Array.from({ length: level - 1 }, (_, i) => (i + 1) * 300).reduce((a, b) => a + b, 0) : 0);
    
    if (totalXp < xpCost) {
      notify(`⚠ Insufficient cumulative XP. This node requires ${xpCost} cumulative XP!`);
      return;
    }

    setUnlockedSkills(prev => [...prev, id]);
    notify(`🔓 Unlocked ${SKILL_TREE.find(s => s.id === id)?.name} skill node!`);
  };

  const handleClaimReward = (rewardName: string) => {
    if (claimedRewards.includes(rewardName)) return;
    setClaimedRewards(prev => [...prev, rewardName]);
    notify(`🎁 Claimed Reward: ${rewardName}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#12121A]/95 border border-brand-primary/20 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-brand-secondary animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white font-mono">{activeNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Splash Overlay Modal */}
      <AnimatePresence>
        {showLevelUpOverlay && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#12121A] border-2 border-brand-primary/30 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(124,92,255,0.15),transparent_60%)] pointer-events-none" />
              
              <Trophy className="w-16 h-16 text-brand-secondary mx-auto mb-4 animate-bounce" />
              <span className="text-[10px] font-mono text-brand-secondary block uppercase font-bold tracking-widest mb-1">COGNITIVE LATENCY SUCCESS</span>
              <h2 className="text-3xl font-display font-black text-white mb-2">LEVEL UP!</h2>
              <div className="flex items-center justify-center space-x-4 my-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-xs">
                  <span className="block text-white/40 uppercase font-mono text-[9px]">FROM</span>
                  <span className="text-white font-bold font-mono">Level {previousLevel}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-brand-secondary" />
                <div className="p-3 bg-brand-primary/20 border border-brand-primary/30 rounded-2xl text-xs">
                  <span className="block text-brand-secondary uppercase font-mono text-[9px]">TO</span>
                  <span className="text-white font-bold font-mono text-lg">Level {level}</span>
                </div>
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6">
                You have synchronized your AI models to become a certified <span className="font-bold text-white">{LEVEL_TITLES[level - 1]}</span>! Unlock the next skill node on your tree.
              </p>

              <button 
                onClick={() => setShowLevelUpOverlay(false)}
                className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/85 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Continue Adventure
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-secondary text-[10px] font-mono font-bold uppercase tracking-wider mb-4 animate-pulse">
          <Award className="w-4 h-4 text-brand-secondary" />
          <span>Gamified Growth Engine Active</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight leading-tight">
          Levels & Learning Journey
        </h2>
        <p className="text-xs md:text-sm text-[#A1A1AA] max-w-xl mx-auto mt-3">
          Progress from a curious Beginner to a prestigious AI Legend. Complete daily missions, weekly coding sprints, and unlock technical components.
        </p>
      </div>

      {/* Top XP Progression Widget Card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(124,92,255,0.04),transparent_60%)] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Level Badge Circle */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent p-1 shadow-[0_8px_30px_rgba(124,92,255,0.3)] mb-4 flex items-center justify-center relative group">
              <div className="absolute inset-1.5 bg-slate-950 rounded-full flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono text-[#A1A1AA] uppercase leading-none">LEVEL</span>
                <span className="text-3xl font-display font-black text-white leading-none mt-1">{level}</span>
              </div>
            </div>
            <h3 className="text-md font-display font-black text-white uppercase tracking-wide">
              {LEVEL_TITLES[level - 1]}
            </h3>
            <span className="text-[9px] font-mono text-brand-secondary uppercase font-bold mt-1">
              RANK {level} / 10
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-end text-xs font-mono">
              <div>
                <span className="block text-[#A1A1AA] text-[10px] uppercase font-bold">CURRENT SYNC PROGRESS:</span>
                <span className="text-white font-black text-lg">{xp} / {xpNeededForNextLevel} XP</span>
              </div>
              <span className="text-brand-secondary font-bold text-md">{xpProgressPercentage.toFixed(0)}%</span>
            </div>
            
            {/* The XP Filling Progress Bar */}
            <div className="w-full bg-white/5 h-4.5 rounded-full border border-white/10 overflow-hidden relative p-0.5">
              <motion.div 
                className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-white/40 pt-1">
              <span>{LEVEL_TITLES[level - 1]} (Lvl {level})</span>
              <span>Next Lvl: {level < 10 ? LEVEL_TITLES[level] : 'AI LEGEND REACHED'} (Lvl {level + 1})</span>
            </div>
          </div>

          {/* Active Learning Streak */}
          <div className="lg:col-span-3 bg-white/3 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-[9px] font-mono text-white/40 uppercase font-bold">LEARNING STREAK:</span>
              <span className="block text-lg font-display font-black text-white flex items-center gap-1">
                {progress.streak || 3} Days Active
              </span>
              <p className="text-[10px] text-[#A1A1AA]">Keep learning tomorrow to claim +100 bonus XP!</p>
            </div>
            <Flame className="w-10 h-10 text-orange-500 animate-pulse fill-current shrink-0" />
          </div>

        </div>
      </div>

      {/* Main split dashboard: Daily Missions, Badges, Skill Tree & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Daily Missions & Weekly Challenges */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Daily Missions */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-4.5 h-4.5 text-brand-secondary animate-pulse" />
              <h3 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">DAILY MISSIONS</h3>
            </div>
            
            <div className="space-y-3">
              {dailyMissions.map((mission) => (
                <div 
                  key={mission.id} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    mission.completed 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-white/50' 
                      : 'bg-white/3 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`block text-xs font-bold leading-tight ${mission.completed ? 'line-through text-white/30' : 'text-white'}`}>
                      {mission.title}
                    </span>
                    <span className="text-[10px] font-mono text-brand-secondary font-bold shrink-0">+{mission.xp} XP</span>
                  </div>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[9px] font-mono text-[#A1A1AA]">Reward: {mission.reward}</span>
                    {mission.completed ? (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleCompleteMission(mission.id, mission.xp)}
                        className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded bg-brand-primary text-white hover:bg-brand-primary/80 cursor-pointer"
                      >
                        Launch Task
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Challenges */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-4.5 h-4.5 text-brand-secondary animate-pulse" />
              <h3 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">WEEKLY CHALLENGES</h3>
            </div>

            <div className="space-y-4">
              {weeklyChallenges.map((challenge) => {
                const completedPct = (challenge.progress / challenge.target) * 100;
                return (
                  <div key={challenge.id} className="space-y-2 bg-white/3 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white block leading-snug">{challenge.title}</span>
                      <span className="text-[10px] font-mono text-brand-secondary font-bold">+{challenge.xp} XP</span>
                    </div>
                    
                    {/* Linear challenge progress indicator */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-primary h-full" style={{ width: `${completedPct}%` }} />
                    </div>
                    
                    <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
                      <span>Progress: {challenge.progress} / {challenge.target}</span>
                      <button 
                        onClick={() => {
                          if (challenge.progress < challenge.target) {
                            const newProgress = challenge.progress + 1;
                            setWeeklyChallenges(prev => prev.map(c => c.id === challenge.id ? { ...c, progress: newProgress } : c));
                            if (newProgress === challenge.target) {
                              handleGainXp(challenge.xp);
                            } else {
                              notify(`Incremented challenge progress: ${challenge.title}!`);
                            }
                          }
                        }}
                        className="text-brand-secondary hover:underline cursor-pointer"
                      >
                        + Progress
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redeem Rewards Station */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Gift className="w-4.5 h-4.5 text-brand-secondary animate-pulse" />
              <h3 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">REWARDS STATION</h3>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'KRNX-TKN: $20 API Credit', cost: 300 },
                { name: 'Custom Discord Role Access', cost: 150 },
                { name: 'Redeem Course Certificate SLA', cost: 500 }
              ].map((reward) => {
                const totalXp = xp + (level > 1 ? Array.from({ length: level - 1 }, (_, i) => (i + 1) * 300).reduce((a, b) => a + b, 0) : 0);
                const isClaimed = claimedRewards.includes(reward.name);
                const canAfford = totalXp >= reward.cost;
                return (
                  <div key={reward.name} className="flex justify-between items-center p-2.5 rounded-xl bg-white/3 border border-white/5 text-[11px]">
                    <div>
                      <span className="block font-bold text-white">{reward.name}</span>
                      <span className="text-[9px] text-white/40">Cost: {reward.cost} cumulative XP</span>
                    </div>
                    <button
                      onClick={() => handleClaimReward(reward.name)}
                      disabled={isClaimed || !canAfford}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                        isClaimed 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : canAfford 
                            ? 'bg-brand-secondary text-slate-950 hover:scale-[1.02]' 
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      {isClaimed ? 'Claimed' : 'Redeem'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* CENTER/RIGHT COLUMN: Skill Tree & Achievements & Leaderboard */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Skill Tree Matrix */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <span className="text-[9px] font-mono font-extrabold text-white/40 block uppercase tracking-widest mb-4">
              INTELLECTUAL SKILL TREE INDEX:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SKILL_TREE.map((skill) => {
                const isUnlocked = unlockedSkills.includes(skill.id);
                // Calculate cumulative XP
                const totalXp = xp + (level > 1 ? Array.from({ length: level - 1 }, (_, i) => (i + 1) * 300).reduce((a, b) => a + b, 0) : 0);
                const canAfford = totalXp >= skill.xpCost;
                
                return (
                  <div 
                    key={skill.id} 
                    className={`p-5 rounded-2xl border transition-all ${
                      isUnlocked 
                        ? 'bg-brand-primary/5 border-brand-primary/30 text-white' 
                        : 'bg-white/3 border-white/10 text-white/60 hover:border-white/15'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-mono font-bold uppercase text-brand-secondary px-2 py-0.5 rounded bg-brand-secondary/10 border border-brand-secondary/20 block w-max mb-2">
                          {skill.category}
                        </span>
                        <h4 className="text-xs font-display font-black text-white">{skill.name}</h4>
                      </div>
                      <div className="shrink-0">
                        {isUnlocked ? (
                          <CheckCircle2 className="w-5 h-5 text-brand-secondary" />
                        ) : (
                          <Lock className="w-4 h-4 text-white/30" />
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#A1A1AA] mt-2 leading-relaxed">
                      {skill.desc}
                    </p>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px] font-mono">
                      <span className="text-white/40">Requires: {skill.xpCost} cumulative XP</span>
                      {!isUnlocked && (
                        <button
                          onClick={() => handleUnlockSkill(skill.id, skill.xpCost)}
                          className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                            canAfford 
                              ? 'bg-brand-secondary text-slate-950 hover:scale-[1.02]' 
                              : 'bg-white/5 text-white/30 cursor-not-allowed'
                          }`}
                        >
                          Unlock Node
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges and Achievements Grid */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <span className="text-[9px] font-mono font-extrabold text-white/40 block uppercase tracking-widest mb-4">
              VERIFIABLE CRYPTO-BADGES DECK:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {BADGES.map((badge) => {
                const Icon = badge.icon;
                const isUnlocked = level >= badge.requiredLvl;
                return (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                      isUnlocked 
                        ? 'bg-slate-950/40 border-brand-primary/20 shadow-xl' 
                        : 'bg-white/2 border-white/5 opacity-50'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center border mb-3 ${
                      isUnlocked ? 'bg-brand-primary/10 border-brand-primary/20 ' + badge.color : 'bg-white/5 border-white/5 text-white/35'
                    }`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white block uppercase tracking-wide truncate max-w-[130px]">{badge.name}</h4>
                      <p className="text-[10px] text-[#A1A1AA] mt-1 leading-snug max-w-[110px] mx-auto truncate block">{badge.desc}</p>
                    </div>
                    <span className="text-[9px] font-mono text-brand-secondary uppercase mt-3 block font-bold">
                      {isUnlocked ? 'UNLOCKED' : `LVL ${badge.requiredLvl} REQ`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Leaderboard Matrix */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-4.5 h-4.5 text-brand-secondary animate-pulse" />
              <h3 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">KRONEX INTELLIGENCE LEADERBOARD</h3>
            </div>

            <div className="space-y-2">
              {MOCK_LEADERBOARD.map((user) => {
                // Update shashvat's XP and Rank dynamically
                const displayXp = user.isSelf ? xp + (level > 1 ? Array.from({ length: level - 1 }, (_, i) => (i + 1) * 300).reduce((a, b) => a + b, 0) : 0) : user.xp;
                const displayBadge = user.isSelf ? LEVEL_TITLES[level - 1] : user.badge;
                
                return (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-3.5 rounded-xl border ${
                      user.isSelf 
                        ? 'bg-brand-primary/10 border-brand-primary/30 text-white font-bold' 
                        : 'bg-white/3 border-white/5 text-white/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <span className={`text-xs font-mono font-bold ${user.isSelf ? 'text-brand-secondary' : 'text-white/40'}`}>
                        #{user.rank}
                      </span>
                      <div>
                        <span className="block text-xs font-bold text-white">{user.name}</span>
                        <span className="text-[9px] font-mono text-white/40 uppercase">{displayBadge}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-brand-secondary">
                      {displayXp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
