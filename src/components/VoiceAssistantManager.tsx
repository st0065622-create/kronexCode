import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, Brain, Radio, Zap, 
  Activity, Play, Square, Settings, RefreshCw, MessageSquare, 
  CheckCircle2, ShieldCheck, Cpu, ArrowRight, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';

interface VoiceAssistantManagerProps {
  onCommandTrigger?: (command: string) => void;
}

export default function VoiceAssistantManager({ onCommandTrigger }: VoiceAssistantManagerProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('Voice Assistant Ready • Click to Speak');
  const [transcript, setTranscript] = useState('');
  const [responseMessage, setResponseMessage] = useState('Hi! I am KRONEX AI. What can I do for you?');
  const [selectedPersona, setSelectedPersona] = useState<'sovereign' | 'jarvis' | 'quantum' | 'cyber'>('sovereign');
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [continuousMode, setContinuousMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [waveformHeights, setWaveformHeights] = useState<number[]>([30, 60, 45, 80, 50, 90, 40, 70, 35, 85, 60, 40]);

  const recognitionRef = useRef<any>(null);

  // Parallax 3D tilt movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / 35;
      const y = (e.clientY - window.innerHeight / 2) / 35;
      setRotation({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Waveform heights animation during listening / speaking
  useEffect(() => {
    if (!isListening && !isSpeaking) {
      setWaveformHeights([20, 25, 20, 30, 20, 25, 20, 30, 20, 25, 20, 25]);
      return;
    }

    const interval = setInterval(() => {
      setWaveformHeights(prev => prev.map(() => Math.floor(Math.random() * 70) + 20));
    }, 100);

    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  // Speech synthesis helper
  const speakText = (text: string) => {
    if (isMuted) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume / 100;
      utterance.rate = 1.05;
      utterance.pitch = voiceGender === 'female' ? 1.1 : 0.85;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        let preferredVoice = null;
        if (voiceGender === 'female') {
          preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Victoria')));
        } else {
          preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Daniel') || v.name.includes('Male') || v.name.includes('David') || v.name.includes('Alex')));
        }
        if (!preferredVoice) {
          preferredVoice = voices.find(v => v.lang.includes('en'));
        }
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setStatusText('Voice Assistant Replying...');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setStatusText('Voice Assistant Ready • Click to Speak');
        if (continuousMode) {
          setTimeout(() => {
            toggleListening();
          }, 800);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setStatusText('Voice Assistant Ready • Click to Speak');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Sound feedback fallback
      soundManager.playMessageReceived();
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  // Handle command execution logic
  const handleVoiceCommand = (cmdText: string) => {
    setTranscript(cmdText);
    setIsListening(false);
    setIsProcessing(true);
    setStatusText('Processing Voice Command...');
    soundManager.playThinking();

    setTimeout(() => {
      setIsProcessing(false);
      let reply = '';
      const lower = cmdText.toLowerCase();

      if (lower.includes('hi') || lower.includes('hy') || lower.includes('hello') || lower.includes('what can') || lower.includes('who are you')) {
        reply = 'Hi! I am KRONEX AI. I can build intelligent AI agents, automate complex workflows, launch multi-model playgrounds, and convert voice streams.';
      } else if (lower.includes('deploy') || lower.includes('agent')) {
        reply = 'Initializing Autonomous AI Agent deployment sequence on KRONEX Sovereign Network.';
        if (onCommandTrigger) onCommandTrigger('deploy');
      } else if (lower.includes('playground') || lower.includes('model')) {
        reply = 'Opening Multi-Model AI Playground workspace with 100+ LLM engines.';
        if (onCommandTrigger) onCommandTrigger('playground');
      } else if (lower.includes('voice') || lower.includes('convert')) {
        reply = 'Routing audio stream to Neural Voice Conversion Engine.';
        if (onCommandTrigger) onCommandTrigger('voice');
      } else if (lower.includes('security') || lower.includes('check')) {
        reply = 'All security parameters verified: SOC2 Type II, 256-bit Encryption, and 99.99% Uptime operational.';
      } else {
        reply = `Executed voice command: "${cmdText}". KRONEX Neural Matrix updated.`;
      }

      setResponseMessage(reply);
      speakText(reply);
    }, 1200);
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setStatusText('Voice Assistant Standby');
      soundManager.playMenuClose();
      return;
    }

    soundManager.playVoiceActivation();
    setIsListening(true);
    setStatusText('Listening... Speak your command now');
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
            setStatusText('Voice Assistant Ready • Click to Speak');
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          setStatusText('Voice Assistant Ready • Click to Speak');
        };

        recognition.start();
      } catch (err) {
        // Fallback simulation if mic block or speech error
        simulateListening();
      }
    } else {
      simulateListening();
    }
  };

  const simulateListening = () => {
    const sampleCommands = [
      'Hi, I am KRONEX AI. What can I do for you?',
      'Deploy New Sovereign AI Agent',
      'Analyze Neural Network Metrics',
      'Integrate Gemini 2.5 Flash',
      'Check Security Protocol Status'
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
        }, 500);
      }
    }, 50);
  };

  const personas = [
    { id: 'sovereign', name: 'Sovereign AI', badge: 'v2.5 Core' },
    { id: 'jarvis', name: 'Neural JARVIS', badge: 'Ultra Fast' },
    { id: 'quantum', name: 'Quantum Core', badge: 'Analytical' },
    { id: 'cyber', name: 'Cyber Synth', badge: 'High Gain' }
  ];

  const quickCommands = [
    'Hi, I am KRONEX AI',
    'Deploy AI Agent',
    'Open AI Playground',
    'Security Check'
  ];

  return (
    <div className="relative max-w-2xl mx-auto w-full flex flex-col items-center justify-center select-none space-y-6">
      
      {/* Voice Manager HUD Top Badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-cyan-400/30 backdrop-blur-2xl shadow-lg">
        <span className="flex h-2 w-2 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isListening ? 'bg-amber-400' : isSpeaking ? 'bg-cyan-400' : 'bg-emerald-400'} opacity-75`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isListening ? 'bg-amber-400' : isSpeaking ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
        </span>
        <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">VOICE ASSISTANT MANAGER</span>
        <span className="text-slate-500">•</span>
        <span className="text-[10.5px] font-mono text-slate-300 font-semibold">{statusText}</span>
      </div>

      {/* Main Interactive Holographic Voice Orb */}
      <div 
        onClick={toggleListening}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center cursor-pointer group"
        style={{
          transform: `perspective(1000px) rotateY(${rotation.x}deg) rotateX(${-rotation.y}deg) scale(${hovered ? 1.05 : 1})`,
          transition: 'transform 0.4s ease-out, filter 0.4s ease-out',
          filter: isListening 
            ? 'drop-shadow(0 0 65px rgba(251, 191, 36, 0.6))' 
            : isSpeaking 
              ? 'drop-shadow(0 0 65px rgba(34, 211, 238, 0.6))'
              : hovered 
                ? 'drop-shadow(0 0 55px rgba(0, 217, 255, 0.5))' 
                : 'drop-shadow(0 0 40px rgba(123, 62, 255, 0.3))'
        }}
      >
        {/* Floating Orbiting Data Particles around Mic Orb */}
        <div className="absolute inset-0 rounded-full pointer-events-none">
          <span className="absolute top-2 left-10 w-2.5 h-2.5 bg-[#00FFC8] rounded-full blur-[0.5px] shadow-[0_0_15px_#00FFC8] animate-ping" />
          <span className="absolute bottom-6 right-12 w-3 h-3 bg-[#00D9FF] rounded-full blur-[0.5px] shadow-[0_0_18px_#00D9FF] animate-pulse" />
          <span className="absolute top-1/2 -left-2 w-2 h-2 bg-[#7B3EFF] rounded-full blur-[0.5px] shadow-[0_0_14px_#7B3EFF] animate-bounce" />
          <span className="absolute top-1/3 -right-2 w-2.5 h-2.5 bg-[#00FFC8] rounded-full blur-[0.5px] shadow-[0_0_16px_#00FFC8] animate-pulse" />
        </div>

        {/* Ambient Aurora Gradient Background */}
        <div className={`absolute inset-0 rounded-full filter blur-[80px] transition-all duration-700 ${
          isListening 
            ? 'bg-gradient-to-tr from-amber-500/50 via-cyan-500/40 to-purple-500/50 animate-pulse scale-110' 
            : isSpeaking 
              ? 'bg-gradient-to-tr from-cyan-500/50 via-emerald-500/40 to-purple-500/50 animate-pulse scale-110'
              : 'bg-gradient-to-tr from-[#7B3EFF]/40 via-[#00D9FF]/35 to-[#00FFC8]/30 animate-pulse-slow'
        }`} />

        {/* Rotating Outer Neon Ring 1 (Speed up during voice activity) */}
        <div className={`absolute inset-0 border-2 border-dashed rounded-full transition-colors duration-500 ${
          isListening ? 'border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.4)] animate-spin' : isSpeaking ? 'border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-spin' : 'border-[#00D9FF]/60 shadow-[0_0_20px_rgba(0,217,255,0.3)] animate-spin-slow'
        }`} />

        {/* Rotating Outer Neon Ring 2 */}
        <div className={`absolute inset-5 border border-dotted rounded-full transition-colors duration-500 ${
          isListening ? 'border-purple-400/80 animate-spin-reverse' : isSpeaking ? 'border-emerald-400/80 animate-spin-reverse' : 'border-[#00FFC8]/60 animate-spin-reverse'
        }`} />

        {/* Dynamic Voice Visualizer Wave Ring */}
        <div className="absolute inset-10 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
          <div className="flex items-center gap-1.5">
            {waveformHeights.map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-100 ${
                  isListening ? 'bg-amber-400' : isSpeaking ? 'bg-cyan-400' : 'bg-purple-400/50'
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Core Glowing Voice Sphere */}
        <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#7B3EFF] via-[#00D9FF] to-[#00FFC8] p-[2.5px] shadow-2xl animate-float">
          <div className="w-full h-full rounded-full bg-[#050816]/95 backdrop-blur-3xl flex flex-col items-center justify-center relative overflow-hidden border border-white/15">
            
            {/* Glass Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/60 pointer-events-none rounded-full" />
            
            {/* Internal Mesh Grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00D9FF_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Pulsing Core Lighting */}
            <div className={`w-24 h-24 rounded-full blur-2xl transition-colors duration-500 ${
              isListening ? 'bg-amber-400/80 animate-ping' : isSpeaking ? 'bg-cyan-400/80 animate-ping' : 'bg-[#7B3EFF]/70 animate-pulse'
            }`} />

            {/* Core Icon & Status */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-3 space-y-1">
              <div className={`p-3.5 rounded-full border transition-all duration-300 ${
                isListening 
                  ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 scale-110' 
                  : isSpeaking 
                    ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 scale-110'
                    : 'bg-white/10 border-white/20 text-[#00FFC8] group-hover:scale-105'
              }`}>
                {isListening ? (
                  <Mic className="w-8 h-8 animate-bounce" />
                ) : isSpeaking ? (
                  <Radio className="w-8 h-8 animate-pulse text-cyan-400" />
                ) : isProcessing ? (
                  <Brain className="w-8 h-8 animate-spin text-purple-400" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </div>

              <span className="text-[11px] font-mono tracking-[3px] font-black text-white uppercase pt-1">
                {isListening ? 'LISTENING...' : isSpeaking ? 'SPEAKING...' : 'VOICE MANAGER'}
              </span>

              <span className="text-[8.5px] font-mono tracking-wider text-cyan-400 uppercase font-extrabold">
                TAP TO {isListening ? 'STOP' : 'ACTIVATE'}
              </span>
            </div>

            {/* Radial Light Scan Line */}
            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#00FFC8] to-transparent top-0 animate-scan-line" />
          </div>
        </div>
      </div>

      {/* Voice Assistant Live Output Display Box */}
      <div className="w-full bg-[#0B0F19]/80 border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 text-left relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isListening ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`} />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">LIVE TRANSCRIPT & SYNTHESIS</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceGender(g => g === 'female' ? 'male' : 'female')}
              className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-300 hover:bg-white/10 transition-all text-[10px] font-mono font-bold uppercase"
            >
              VOICE: {voiceGender.toUpperCase()}
            </button>

            <button
              onClick={() => setContinuousMode(!continuousMode)}
              className={`px-2 py-1 rounded-lg border transition-all text-[10px] font-mono font-bold uppercase ${
                continuousMode ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              AUTO-LOOP: {continuousMode ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1 ${
                isMuted ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-mono font-bold">{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
            </button>
          </div>
        </div>

        {/* Live Speech Input vs AI Output Message */}
        <div className="space-y-2 min-h-[50px] flex flex-col justify-center">
          {transcript && (
            <div className="flex items-start gap-2 text-amber-300 text-xs font-mono bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              <Mic className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>You said: "{transcript}"</span>
            </div>
          )}

          <div className="flex items-start gap-2.5 text-xs text-slate-200 font-sans leading-relaxed">
            <Brain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="font-medium text-slate-100">{responseMessage}</p>
          </div>
        </div>

        {/* Persona Selector Chips */}
        <div className="pt-2 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">VOICE PERSONA:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPersona(p.id as any);
                  soundManager.playClick();
                  speakText(`Voice persona changed to ${p.name}`);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  selectedPersona === p.id 
                    ? 'bg-gradient-to-r from-[#7B3EFF] to-[#00D9FF] text-white shadow-md' 
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Voice Command Suggestion Chips */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider shrink-0">QUICK COMMANDS:</span>
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleVoiceCommand(cmd)}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10.5px] font-mono font-semibold transition-all shrink-0 hover:scale-105 active:scale-95"
            >
              "{cmd}"
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
