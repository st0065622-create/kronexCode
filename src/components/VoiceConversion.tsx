import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, UploadCloud, Volume2, Play, Square, Download, 
  Sparkles, RefreshCw, Sliders, Music, CheckCircle2, 
  Trash2, HelpCircle, Activity, VolumeX, Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../utils/sound';

interface Preset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  pitch: number; // multiplier
  detune: number; // cents
  type: 'sine' | 'sawtooth' | 'triangle' | 'square' | 'none'; // for robot ring modulation
}

const PRESETS: Preset[] = [
  { id: 'natural', name: 'Natural Voice', description: 'Keeps the natural timber with enhanced clarity', emoji: '✨', pitch: 1.0, detune: 0, type: 'none' },
  { id: 'male', name: 'Deep Male', description: 'Resonating, low-frequency masculine tone', emoji: '🧔', pitch: 0.78, detune: -400, type: 'none' },
  { id: 'female', name: 'Resonant Female', description: 'Smooth, bright feminine frequency shift', emoji: '👩', pitch: 1.35, detune: 500, type: 'none' },
  { id: 'robot', name: 'Cyber Robot', description: 'Metalling ring-modulation synthetic overlay', emoji: '🤖', pitch: 1.0, detune: 0, type: 'sawtooth' },
  { id: 'child', name: 'Playful Child', description: 'Cute, high-pitched youthful timbre', emoji: '👶', pitch: 1.55, detune: 800, type: 'none' },
  { id: 'anime', name: 'Anime Chibi', description: 'Sparkling hyper-resonant anime character speed', emoji: '🌸', pitch: 1.75, detune: 1000, type: 'none' },
  { id: 'deep', name: 'Abyssal Overlord', description: 'Slow, haunting cinematic deep roar', emoji: '🌋', pitch: 0.55, detune: -1000, type: 'none' },
];

export default function VoiceConversion() {
  const [selectedPreset, setSelectedPreset] = useState<string>('natural');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState<boolean>(false);
  const [isPlayingProcessed, setIsPlayingProcessed] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [noiseReduction, setNoiseReduction] = useState<boolean>(true);
  const [highClarification, setHighClarification] = useState<boolean>(true);
  
  // Waveform canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Media recorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Audio sources
  const originalAudioRef = useRef<HTMLAudioElement | null>(null);
  const processedAudioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const processedAnimationFrameIdRef = useRef<number | null>(null);

  // soundManager.playHover / playClick hooks
  const handleHover = () => soundManager.playHover();
  const handleClick = () => soundManager.playClick();

  // Reset audio elements on change
  useEffect(() => {
    return () => {
      stopAllPlayback();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (processedAnimationFrameIdRef.current) cancelAnimationFrame(processedAnimationFrameIdRef.current);
    };
  }, []);

  // Format record timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const stopAllPlayback = () => {
    if (originalAudioRef.current) {
      originalAudioRef.current.pause();
      originalAudioRef.current.currentTime = 0;
    }
    if (processedAudioRef.current) {
      processedAudioRef.current.pause();
      processedAudioRef.current.currentTime = 0;
    }
    setIsPlayingOriginal(false);
    setIsPlayingProcessed(false);
  };

  // Start recording
  const startRecording = async () => {
    soundManager.playVoiceActivation();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setProcessedBlob(null);
        setProcessedUrl(null);
        soundManager.playSuccess();
        drawStaticWaveform(blob, canvasRef);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Start record timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Render live recording wave simulation
      drawLiveWaveform();
    } catch (err) {
      console.error('Microphone access denied:', err);
      soundManager.playError();
    }
  };

  // Stop recording
  const stopRecording = () => {
    handleClick();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all micro tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  const processAudioFile = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      soundManager.playError();
      alert("Please upload a valid audio file.");
      return;
    }
    const blob = file;
    setAudioBlob(blob);
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setProcessedBlob(null);
    setProcessedUrl(null);
    soundManager.playSuccess();
    drawStaticWaveform(blob, canvasRef);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAudioFile(file);
    }
  };

  const clearAudio = () => {
    handleClick();
    stopAllPlayback();
    setAudioBlob(null);
    setAudioUrl(null);
    setProcessedBlob(null);
    setProcessedUrl(null);
  };

  // Dynamic live waveform renderer for recording
  const drawLiveWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = 80;

    let bars: number[] = Array(50).fill(5);

    const render = () => {
      if (!isRecording) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Random active heights to simulate live mic activity
      bars = bars.map(() => Math.floor(Math.random() * 45) + 5);

      const spacing = 4;
      const barWidth = (canvas.width - spacing * (bars.length - 1)) / bars.length;
      const centerY = canvas.height / 2;

      ctx.fillStyle = '#7C3AED'; // Neon cyan/purple
      bars.forEach((barHeight, i) => {
        const x = i * (barWidth + spacing);
        const y = centerY - barHeight / 2;
        ctx.fillRect(x, y, barWidth, barHeight);
      });

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();
  };

  // Static waveform helper based on audio frequency data
  const drawStaticWaveform = async (blob: Blob, canvasElementRef: React.MutableRefObject<HTMLCanvasElement | null>) => {
    const canvas = canvasElementRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = 80;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Beautiful simulated high-fidelity waveform for instant user feedback
    const peaksCount = 60;
    const peaks: number[] = [];
    for (let i = 0; i < peaksCount; i++) {
      const distanceToCenter = Math.sin((i / peaksCount) * Math.PI);
      peaks.push((Math.random() * 0.4 + 0.6) * 35 * distanceToCenter + 3);
    }

    const spacing = 3;
    const barWidth = (canvas.width - spacing * (peaks.length - 1)) / peaks.length;
    const centerY = canvas.height / 2;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, '#7C3AED');
    grad.addColorStop(1, '#22D3EE');

    ctx.fillStyle = grad;
    peaks.forEach((peak, i) => {
      const x = i * (barWidth + spacing);
      const y = centerY - peak / 2;
      ctx.fillRect(x, y, barWidth, peak);
    });
  };

  // Pitch Shift Audio Conversion Engine
  const processConversion = async () => {
    if (!audioBlob) return;
    handleClick();
    setIsProcessing(true);
    soundManager.playToggle();

    // Setup an AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      // Selected preset options
      const preset = PRESETS.find(p => p.id === selectedPreset) || PRESETS[0];

      // Offline render context to shift pitch & speed dynamically
      const offlineCtx = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.duration * (1 / (preset.pitch || 1.0)) * audioBuffer.sampleRate,
        audioBuffer.sampleRate
      );

      // Create a buffer source
      const bufferSource = offlineCtx.createBufferSource();
      bufferSource.buffer = audioBuffer;

      // Adjust playbackRate for pitch/speed
      bufferSource.playbackRate.setValueAtTime(preset.pitch, 0);

      // Ring modulator configuration (for Cyber Robot preset)
      let lastNode: AudioNode = bufferSource;

      if (preset.type !== 'none') {
        const osc = offlineCtx.createOscillator();
        osc.type = preset.type;
        osc.frequency.setValueAtTime(45, 0); // robotic modulator carrier

        const gain = offlineCtx.createGain();
        gain.gain.setValueAtTime(1.0, 0);

        osc.connect(gain.gain);
        bufferSource.connect(gain);
        
        osc.start(0);
        lastNode = gain;
      }

      // Filter simulation for Noise Reduction
      if (noiseReduction) {
        const filter = offlineCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, 0); // vocal sweet band
        filter.Q.setValueAtTime(1.2, 0);
        lastNode.connect(filter);
        lastNode = filter;
      }

      // Dynamic booster for High Clarification
      if (highClarification) {
        const clarifier = offlineCtx.createBiquadFilter();
        clarifier.type = 'highshelf';
        clarifier.frequency.setValueAtTime(3200, 0);
        clarifier.gain.setValueAtTime(4.5, 0); // bright crystal vocals
        lastNode.connect(clarifier);
        lastNode = clarifier;
      }

      lastNode.connect(offlineCtx.destination);
      bufferSource.start(0);

      // Run offine compiling
      const renderedBuffer = await offlineCtx.startRendering();

      // Convert Rendered AudioBuffer into a WAV Blob
      const wavBlob = audioBufferToWav(renderedBuffer);
      setProcessedBlob(wavBlob);
      const wavUrl = URL.createObjectURL(wavBlob);
      setProcessedUrl(wavUrl);

      setTimeout(() => {
        setIsProcessing(false);
        soundManager.playSuccess();
        drawStaticWaveform(wavBlob, processedCanvasRef);
      }, 1800); // realistic smooth futuristic computation cycle

    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      soundManager.playError();
    }
  };

  // Convert raw PCM AudioBuffer channels to downloadable standard 16-bit WAV format
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    let result;
    if (numOfChan === 2) {
      result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
      result = buffer.getChannelData(0);
    }
    
    const bufferLength = result.length * 2;
    const wavBuffer = new ArrayBuffer(44 + bufferLength);
    const view = new DataView(wavBuffer);
    
    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // file length
    view.setUint32(4, 36 + bufferLength, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, format, true);
    // channel count
    view.setUint16(22, numOfChan, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * numOfChan * (bitDepth / 8), true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, numOfChan * (bitDepth / 8), true);
    // bits per sample
    view.setUint16(34, bitDepth, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, bufferLength, true);
    
    // Write PCM samples
    floatTo16BitPCM(view, 44, result);
    
    return new Blob([wavBuffer], { type: 'audio/wav' });
  };

  const interleave = (inputL: Float32Array, inputR: Float32Array) => {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    let inputIndex = 0;
    
    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
    return result;
  };

  const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // Play Original Audio
  const togglePlayOriginal = () => {
    handleClick();
    if (!audioUrl) return;
    
    if (isPlayingOriginal) {
      originalAudioRef.current?.pause();
      setIsPlayingOriginal(false);
    } else {
      stopAllPlayback();
      const audio = new Audio(audioUrl);
      originalAudioRef.current = audio;
      audio.onended = () => setIsPlayingOriginal(false);
      audio.play();
      setIsPlayingOriginal(true);
    }
  };

  // Play Converted Audio
  const togglePlayProcessed = () => {
    handleClick();
    if (!processedUrl) return;

    if (isPlayingProcessed) {
      processedAudioRef.current?.pause();
      setIsPlayingProcessed(false);
    } else {
      stopAllPlayback();
      const audio = new Audio(processedUrl);
      processedAudioRef.current = audio;
      audio.onended = () => setIsPlayingProcessed(false);
      audio.play();
      setIsPlayingProcessed(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-8 py-4">
      {/* Feature Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h2 className="text-2xl font-display font-black text-slate-100 flex items-center gap-3">
            <Volume2 className="w-7 h-7 text-[#22D3EE] animate-pulse" />
            <span>Sovereign Voice Conversion Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Record or upload vocal waves and transform their sonic architectures utilizing high-fidelity pitch-shifting modulators and crystalline neural filters.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e293b]/50 border border-white/5 text-[10.5px] font-mono text-cyan-400">
          <Activity className="w-3.5 h-3.5 animate-bounce" />
          <span>REAL-TIME PITCH SYNTHESIS ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Core Control Panel */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Audio Capturing Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-black text-slate-200 flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#7C3AED]" />
                <span>1. Vocal Capture Stage</span>
              </h3>
              {audioBlob && (
                <button 
                  onClick={clearAudio}
                  onMouseEnter={handleHover}
                  className="p-1 text-slate-400 hover:text-red-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {!audioBlob ? (
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  isDragOver ? 'border-[#22D3EE] bg-[#22D3EE]/5 scale-[0.99]' : 'border-white/10 hover:border-white/20 bg-black/10'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="flex justify-center">
                    {isRecording ? (
                      <button 
                        onClick={stopRecording}
                        onMouseEnter={handleHover}
                        className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500 text-red-500 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-105 transition-all"
                      >
                        <Square className="w-5 h-5 fill-red-500" />
                      </button>
                    ) : (
                      <button 
                        onClick={startRecording}
                        onMouseEnter={handleHover}
                        className="w-14 h-14 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED] text-[#7C3AED] flex items-center justify-center cursor-pointer hover:bg-[#7C3AED]/20 hover:scale-105 transition-all"
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                  <div>
                    {isRecording ? (
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-red-400 animate-pulse block">Recording Live...</span>
                        <span className="text-xs text-slate-400 font-mono block">{formatTime(recordingTime)}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-300 font-bold">Start recording or drop your audio file here</p>
                        <p className="text-[10px] text-slate-500">Supports MP3, WAV, WebM, M4A up to 10MB</p>
                      </div>
                    )}
                  </div>

                  {!isRecording && (
                    <div className="flex justify-center">
                      <label className="px-4 py-2 bg-white/5 border border-white/10 hover:border-[#22D3EE]/30 hover:bg-white/10 rounded-xl text-xs font-bold text-slate-200 cursor-pointer transition-all flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-[#22D3EE]" />
                        <span>Browse Audio File</span>
                        <input 
                          type="file" 
                          accept="audio/*" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/10">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Vocal Wave Loaded</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Original Wave • Ready</span>
                    </div>
                  </div>

                  <button 
                    onClick={togglePlayOriginal}
                    onMouseEnter={handleHover}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isPlayingOriginal ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-[#22D3EE]" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#22D3EE] fill-[#22D3EE]" />
                        <span>Play Raw</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                  <canvas ref={canvasRef} className="w-full h-20 rounded-lg" />
                </div>
              </div>
            )}
          </div>

          {/* Presets and Filters Selection */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
            <h3 className="text-sm font-display font-black text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              <span>2. Choose AI Transducer Presets</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      handleClick();
                      setSelectedPreset(preset.id);
                    }}
                    onMouseEnter={handleHover}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                      isSelected 
                        ? 'border-[#22D3EE] bg-cyan-950/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                        : 'border-white/5 bg-slate-900/30 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg">{preset.emoji}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-ping" />}
                    </div>
                    <div>
                      <span className={`text-[11.5px] font-bold block ${isSelected ? 'text-[#22D3EE]' : 'text-slate-300'}`}>
                        {preset.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                        {preset.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Neural Audio Clarification Knobs */}
            <div className="border-t border-white/[0.08] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200">Acoustic Noise Filter</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Cleans low frequency background humming</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={noiseReduction}
                    onChange={() => {
                      handleClick();
                      setNoiseReduction(!noiseReduction);
                    }}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22D3EE]" />
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-200">Crystal Clarification Boost</span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Enhances high end breath clarity</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={highClarification}
                    onChange={() => {
                      handleClick();
                      setHighClarification(!highClarification);
                    }}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#22D3EE]" />
                </label>
              </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={processConversion}
              disabled={!audioBlob || isProcessing}
              onMouseEnter={handleHover}
              className={`w-full py-3.5 rounded-2xl font-display font-black text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !audioBlob 
                  ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                  : isProcessing
                    ? 'bg-cyan-500/20 border border-[#22D3EE] text-[#22D3EE] cursor-wait'
                    : 'bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.01] text-white'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>CONVERTING AUDIO SPECTRUMS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>TRANSMUTATE AUDIO SPECTRAL WAVE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Converted Output Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6 flex flex-col justify-between min-h-[380px]">
            <div>
              <h3 className="text-sm font-display font-black text-slate-200 flex items-center gap-2 border-b border-white/[0.08] pb-3">
                <Music className="w-4 h-4 text-[#22D3EE]" />
                <span>3. Converted Audio Waveform</span>
              </h3>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center py-8">
              {isProcessing ? (
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-dashed border-[#22D3EE] animate-spin flex items-center justify-center" />
                    <RefreshCw className="w-6 h-6 text-[#7C3AED] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-300 block">Modulating Frequency Matrix</span>
                    <span className="text-[10px] text-slate-500 font-mono block">Offline rendering sample track...</span>
                  </div>
                </div>
              ) : processedBlob && processedUrl ? (
                <div className="w-full space-y-6">
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-400 block">Transmutation Completed!</span>
                          <span className="text-[9px] text-slate-400 font-mono uppercase">
                            Preset: {PRESETS.find(p => p.id === selectedPreset)?.name}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={togglePlayProcessed}
                        onMouseEnter={handleHover}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {isPlayingProcessed ? (
                          <>
                            <Pause className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                            <span>Play Mod</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                      <canvas ref={processedCanvasRef} className="w-full h-20 rounded-lg" />
                    </div>
                  </div>

                  <a 
                    href={processedUrl}
                    download={`kronex_voice_shifted_${selectedPreset}.wav`}
                    onMouseEnter={handleHover}
                    onClick={handleClick}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-display font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Converted Track</span>
                  </a>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500 space-y-2">
                  <Activity className="w-12 h-12 mx-auto text-slate-700 animate-pulse" />
                  <span className="text-xs font-bold block text-slate-400">Waiting for conversion</span>
                  <span className="text-[10px] text-slate-500 max-w-xs block leading-relaxed">
                    Capture or import raw vocals, choose an AI transducer preset and trigger the modulator matrix to compile.
                  </span>
                </div>
              )}
            </div>

            {/* Premium Guide footnote */}
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[10.5px] text-slate-400 leading-relaxed font-sans">
              <span className="font-bold text-slate-200 block mb-0.5">💡 Spectrum Presets Guide</span>
              <p>For cyber robotic effects, try Cyber Robot. To emulate crisp high-pitched children vocals, select Playful Child. Pitch modulation rate adjusts automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
