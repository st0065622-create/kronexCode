import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, Brain, Radio, Zap, 
  X, MessageSquare, Settings, Play, Square, RefreshCw, ChevronUp, ChevronDown, Heart, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';

interface FloatingVoiceAssistantProps {
  onCommandTrigger?: (command: string, tab?: string) => void;
  isDocked?: boolean;
}

export default function FloatingVoiceAssistant({ onCommandTrigger, isDocked }: FloatingVoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [heartListening, setHeartListening] = useState(false);
  const [heartRateBpm, setHeartRateBpm] = useState(72);
  const [statusText, setStatusText] = useState('Voice Assistant Ready • Speak Command');
  const [transcript, setTranscript] = useState('');
  const [responseMessage, setResponseMessage] = useState('Hi! I am KRONEX AI. How can I assist you today?');
  const [continuousMode, setContinuousMode] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [isMuted, setIsMuted] = useState(false);
  const [waveformHeights, setWaveformHeights] = useState<number[]>([30, 60, 45, 80, 50, 90, 40, 70, 35, 85, 60, 40]);

  const recognitionRef = useRef<any>(null);

  // Cardiac heartbeat simulator for Heart Listening Mode
  useEffect(() => {
    if (!heartListening) return;
    const interval = setInterval(() => {
      setHeartRateBpm(70 + Math.floor(Math.sin(Date.now() / 800) * 8 + Math.random() * 4));
      soundManager.playHeartPulse();
    }, 850);
    return () => clearInterval(interval);
  }, [heartListening]);

  // Animated sound waves
  useEffect(() => {
    if (!isListening && !isSpeaking) {
      setWaveformHeights([20, 25, 20, 30, 20, 25, 20, 30, 20, 25, 20, 25]);
      return;
    }

    const interval = setInterval(() => {
      setWaveformHeights(prev => prev.map(() => Math.floor(Math.random() * 70) + 20));
    }, 90);

    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  // Speech synthesis engine with voice selection & interruption
  const speakText = (text: string) => {
    if (isMuted) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = voiceGender === 'female' ? 1.1 : 0.85;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        let selectedVoice = null;
        if (voiceGender === 'female') {
          selectedVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Natural') || v.name.includes('Victoria')));
        } else {
          selectedVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Daniel') || v.name.includes('Male') || v.name.includes('David') || v.name.includes('Alex')));
        }
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.includes('en'));
        }
        if (selectedVoice) utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setStatusText('KRONEX AI Replying...');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setStatusText('Voice Assistant Ready');
        if (continuousMode) {
          setTimeout(() => {
            startListening();
          }, 800);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setStatusText('Voice Assistant Ready');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      soundManager.playMessageReceived();
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Process command
  const handleVoiceCommand = (cmdText: string) => {
    setTranscript(cmdText);
    setIsListening(false);
    setIsProcessing(true);
    setStatusText('Processing Neural Query...');
    soundManager.playThinking();

    setTimeout(() => {
      setIsProcessing(false);
      let reply = '';
      const lower = cmdText.toLowerCase();

      if (lower.includes('hi') || lower.includes('hy') || lower.includes('hello') || lower.includes('kronex') || lower.includes('who are you')) {
        reply = 'Hi! I am KRONEX AI. I can build intelligent agents, launch multi-model sandboxes, and automate workflows.';
      } else if (lower.includes('deploy') || lower.includes('agent')) {
        reply = 'Deploying Sovereign AI Agent on KRONEX Network.';
        if (onCommandTrigger) onCommandTrigger('dashboard', 'tutorials');
      } else if (lower.includes('agent') || lower.includes('bot') || lower.includes('orchestrat')) {
        reply = 'Opening KRONEX Sovereign AI Agent Platform.';
        if (onCommandTrigger) onCommandTrigger('dashboard', 'ai-agents');
      } else if (lower.includes('playground') || lower.includes('model')) {
        reply = 'Opening AI Playground workspace with 100+ AI models.';
        if (onCommandTrigger) onCommandTrigger('dashboard', 'playground');
      } else if (lower.includes('course') || lower.includes('learn')) {
        reply = 'Opening Masterclass Learning Path & Interactive Courses.';
        if (onCommandTrigger) onCommandTrigger('dashboard', 'courses');
      } else if (lower.includes('sandbox') || lower.includes('code')) {
        reply = 'Opening Interactive AI Prompting Sandbox.';
        if (onCommandTrigger) onCommandTrigger('dashboard', 'tutorials');
      } else if (lower.includes('pricing') || lower.includes('plan')) {
        reply = 'KRONEX AI offers Developer Free tier, Pro at $29/mo, and Enterprise custom tiers.';
        const pricingEl = document.getElementById('pricing');
        if (pricingEl) pricingEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        reply = `Executed: "${cmdText}". KRONEX Neural Matrix updated.`;
      }

      setResponseMessage(reply);
      speakText(reply);
    }, 1000);
  };

  // Start listening function
  const startListening = () => {
    stopSpeaking();
    soundManager.playVoiceActivation();
    setIsListening(true);
    setStatusText('Listening... Speak now');
    setTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const currentTranscript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setTranscript(currentTranscript);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcript.trim()) {
            handleVoiceCommand(transcript);
          } else {
            setStatusText('Voice Assistant Ready');
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          setStatusText('Voice Assistant Ready');
        };

        recognition.start();
      } catch (err) {
        simulateListening();
      }
    } else {
      simulateListening();
    }
  };

  const simulateListening = () => {
    const sampleCommands = [
      'Hi, I am KRONEX AI',
      'Deploy Sovereign AI Agent',
      'Open AI Playground',
      'Show Available Courses'
    ];
    const randomCmd = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];

    let charIdx = 0;
    const typeInterval = setInterval(() => {
      if (charIdx <= randomCmd.length) {
        setTranscript(randomCmd.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          handleVoiceCommand(randomCmd);
        }, 400);
      }
    }, 50);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setStatusText('Voice Assistant Ready');
      soundManager.playMenuClose();
    } else if (isSpeaking) {
      stopSpeaking();
      startListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={isDocked ? "relative flex flex-col items-end" : "fixed bottom-6 right-6 z-50 flex flex-col items-end"}>
      
      {/* Expanded Voice Widget Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="mb-4 w-80 sm:w-96 bg-[#0B0F19]/95 border border-[#00D9FF]/40 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 filter blur-[60px] pointer-events-none transition-all duration-500 ${
              isListening ? 'bg-amber-500/20' : isSpeaking ? 'bg-cyan-500/20' : 'bg-purple-500/15'
            }`} />

            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isListening ? 'bg-amber-400' : isSpeaking ? 'bg-cyan-400' : 'bg-emerald-400'} opacity-75`} />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isListening ? 'bg-amber-400' : isSpeaking ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">KRONEX VOICE COGNITION</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 rounded-lg border text-xs ${isMuted ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'}`}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    soundManager.playClick();
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Waveform Visualizer */}
            <div className="py-4 flex items-center justify-center gap-1.5 relative z-10 h-16">
              {waveformHeights.map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isListening ? 'bg-amber-400' : isSpeaking ? 'bg-cyan-400' : 'bg-purple-400/40'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            {/* Live Message Box */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 space-y-2 relative z-10 text-left">
              {transcript && (
                <div className="text-[11px] font-mono text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                  You: "{transcript}"
                </div>
              )}
              <div className="flex items-start gap-2 text-xs text-slate-100 font-sans">
                <Brain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{responseMessage}</p>
              </div>
            </div>

            {/* Settings Bar */}
            <div className="pt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 relative z-10">
              <button
                onClick={() => setVoiceGender(g => g === 'female' ? 'male' : 'female')}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 transition-all uppercase font-bold"
              >
                VOICE: {voiceGender.toUpperCase()}
              </button>

              <button
                onClick={() => {
                  const nextState = !heartListening;
                  setHeartListening(nextState);
                  if (nextState) {
                    soundManager.playHeartPulse();
                    setStatusText('Heart Listening Mode Active • Bio-Syncing BPM');
                  } else {
                    setStatusText('Voice Assistant Ready');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg border transition-all uppercase font-bold flex items-center gap-1 ${
                  heartListening ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-3 h-3 ${heartListening ? 'fill-rose-500 text-rose-400 animate-pulse' : ''}`} />
                <span>HEART LISTEN: {heartListening ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setContinuousMode(!continuousMode)}
                className={`px-2.5 py-1 rounded-lg border transition-all uppercase font-bold ${
                  continuousMode ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                AUTO-LOOP: {continuousMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Heart Listening Biometric Display Banner */}
            {heartListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs relative z-10 overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-ping absolute" />
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-500 relative z-10" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-rose-300 font-bold uppercase leading-none">Cardiac Rhythm Sync</span>
                    <span className="text-[9px] text-slate-300 font-mono">Listening to Heartbeat & Cadence</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-mono font-black text-sm text-rose-400 leading-none">{heartRateBpm} <span className="text-[9px] font-normal text-rose-300">BPM</span></span>
                  <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase">Optimal Focus</span>
                </div>
              </motion.div>
            )}

            {/* Action Mic Controls */}
            <div className="pt-4 flex items-center gap-2 relative z-10">
              <button
                onClick={toggleListening}
                className={`flex-1 py-3 rounded-2xl font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isListening 
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/40 animate-pulse' 
                    : isSpeaking 
                      ? 'bg-cyan-400 text-slate-950 shadow-cyan-400/40' 
                      : 'bg-gradient-to-r from-[#7B3EFF] to-[#00D9FF] text-white shadow-cyan-500/30 hover:scale-102'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isListening ? 'STOP LISTENING' : isSpeaking ? 'INTERRUPT & SPEAK' : 'TAP TO SPEAK'}</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glowing Mic Trigger Button (56px Glass Blur) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
            toggleListening();
          } else {
            toggleListening();
          }
        }}
        className={`relative w-[56px] h-[56px] rounded-2xl border shadow-xl flex items-center justify-center transition-all duration-200 cursor-pointer group backdrop-blur-xl ${
          isListening
            ? 'bg-amber-500/90 border-amber-300 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.6)]'
            : isSpeaking
              ? 'bg-[#00D4FF]/90 border-cyan-200 text-slate-950 shadow-[0_0_25px_rgba(0,212,255,0.6)]'
              : 'bg-[#131A2E]/80 border-white/15 hover:border-[#00D4FF]/60 text-[#F8FAFC] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#7C5CFF]/20 to-[#00D4FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-center">
          {isListening ? (
            <Mic className="w-5 h-5 text-amber-950 animate-bounce" />
          ) : isSpeaking ? (
            <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
          ) : (
            <Mic className="w-5 h-5 text-[#00D4FF] group-hover:scale-110 transition-transform duration-200" />
          )}
        </div>
      </motion.button>

    </div>
  );
}
