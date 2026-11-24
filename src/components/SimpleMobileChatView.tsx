import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, BrainCircuit, Bot, RotateCcw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';

interface SimpleMobileChatViewProps {
  onBack?: () => void;
}

export default function SimpleMobileChatView({ onBack }: SimpleMobileChatViewProps) {
  const [promptText, setPromptText] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = () => {
    if (!promptText.trim()) return;
    setIsSubmitting(true);
    soundManager.playMessageSent();
    setTimeout(() => {
      setIsSubmitting(false);
      setShowNotification(true);
      soundManager.playSuccess();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050B18] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Dark Blue Futuristic Glowing Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#0055FF]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#7B3EFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-70 h-70 bg-[#00D4FF]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Back Button if embedded in dashboard */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-20 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-slate-300 hover:text-white flex items-center space-x-2 transition-all cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Return to Dashboard</span>
        </button>
      )}

      {/* Mobile Screen Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#0A1228]/90 border border-cyan-500/30 rounded-[36px] shadow-[0_0_50px_rgba(0,100,255,0.25)] backdrop-blur-2xl flex flex-col justify-between min-h-[640px] p-6 sm:p-8 relative overflow-hidden my-auto"
      >
        {/* Subtle Neon Top Edge Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent rounded-full shadow-[0_0_15px_#00D4FF]" />

        {/* TOP HEADER: Logo & Made by Shashvat */}
        <div className="flex flex-col items-center text-center space-y-1.5 pt-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0055FF] to-[#00D4FF] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)]">
              <BrainCircuit className="w-5.5 h-5.5 text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-display font-black text-2xl tracking-tight text-white leading-none">
                KRONEX <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#3B82F6]">AI</span>
              </h1>
              <p className="text-[10px] font-mono font-bold tracking-[2.5px] text-[#00D4FF] uppercase mt-0.5">
                Made by Shashvat
              </p>
            </div>
          </div>
        </div>

        {/* CENTER CONTENT AREA */}
        <div className="flex-1 flex flex-col justify-center my-8 space-y-6">
          
          {/* Big Centered Prompt Input Box */}
          <div className="relative w-full group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00D4FF] via-[#0055FF] to-[#7B3EFF] rounded-3xl opacity-30 group-hover:opacity-60 transition duration-500 blur-md pointer-events-none" />
            
            <div className="relative bg-[#060D1E] border border-cyan-500/40 rounded-3xl p-4 shadow-2xl flex flex-col justify-between min-h-[160px]">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your prompt here..."
                className="w-full bg-transparent text-sm font-sans text-white placeholder-slate-400 outline-none resize-none h-24 p-1 leading-relaxed"
              />

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono text-cyan-400/80">
                  {promptText.length > 0 ? `${promptText.length} chars` : 'Ready for input'}
                </span>

                {/* Blue Send Button */}
                <button
                  onClick={handleSend}
                  disabled={isSubmitting || !promptText.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0055FF] to-[#00D4FF] hover:from-[#0044DD] hover:to-[#00BCEE] active:scale-95 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_20px_rgba(0,180,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>

          {/* CLEAR NOTIFICATION BANNER WITH GREEN CHECKMARK */}
          <AnimatePresence>
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                className="w-full bg-[#081C1B]/90 border border-emerald-500/50 rounded-2xl p-4 shadow-[0_0_25px_rgba(16,185,129,0.25)] backdrop-blur-xl flex items-center justify-between space-x-3 text-emerald-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-400" />
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="font-sans font-bold text-xs sm:text-sm text-emerald-200">
                    Your AI Agent has completed the task!
                  </span>
                </div>

                <button
                  onClick={() => setShowNotification(false)}
                  className="text-emerald-500 hover:text-emerald-300 text-xs font-mono p-1 rounded-lg hover:bg-emerald-500/10 cursor-pointer transition-all"
                  title="Dismiss notification"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* FOOTER BAR */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/10">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>KRONEX Core v10.0</span>
          </span>
          
          {!showNotification && (
            <button
              onClick={() => setShowNotification(true)}
              className="text-cyan-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show Notification</span>
            </button>
          )}

          <span className="text-slate-400">Dark Blue Futuristic</span>
        </div>

      </motion.div>

    </div>
  );
}
