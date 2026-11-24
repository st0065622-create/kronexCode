// Premium Dynamic UI Sound Synthesizer Utility
// Uses the Web Audio API to synthesize high-quality, futuristic UI sound effects on-the-fly.

class SoundManager {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5;
  private muted: boolean = false;

  constructor() {
    // Load state from localStorage
    try {
      const storedMute = localStorage.getItem('kronex_sound_muted');
      if (storedMute) {
        this.muted = storedMute === 'true';
      }
      const storedVolume = localStorage.getItem('kronex_sound_volume');
      if (storedVolume) {
        this.volume = parseFloat(storedVolume);
      }
    } catch (e) {
      console.warn('LocalStorage not available for SoundManager', e);
    }
  }

  private initCtx() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('kronex_sound_volume', this.volume.toString());
    } catch (e) {}
  }

  getVolume(): number {
    return this.volume;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem('kronex_sound_muted', this.muted.toString());
    } catch (e) {}
  }

  isMuted(): boolean {
    return this.muted;
  }

  getMuteState(): boolean {
    return this.muted;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem('kronex_sound_muted', this.muted.toString());
    } catch (e) {}
    return this.muted;
  }

  private playTone(freqs: number[], duration: number, type: OscillatorType = 'sine', sweep: boolean = false, targetFreq?: number) {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0, ctx.currentTime);
      mainGain.gain.linearRampToValueAtTime(this.volume * 0.15, ctx.currentTime + 0.01);
      mainGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      const oscs = freqs.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        if (sweep && targetFreq) {
          osc.frequency.exponentialRampToValueAtTime(targetFreq, ctx.currentTime + duration);
        }
        
        osc.connect(mainGain);
        return osc;
      });

      mainGain.connect(ctx.destination);

      oscs.forEach(osc => osc.start());
      oscs.forEach(osc => osc.stop(ctx.currentTime + duration + 0.05));
    } catch (e) {
      console.warn('Web Audio playback failed', e);
    }
  }

  playClick() {
    // Elegant, short high-frequency click
    this.playTone([800], 0.06, 'sine', true, 400);
  }

  playToggle() {
    // Frequency sweep upwards
    this.playTone([250], 0.15, 'sine', true, 450);
  }

  playMenuOpen() {
    // Upward soft dual chime
    this.playTone([350, 520], 0.12, 'sine');
  }

  playMenuClose() {
    // Downward soft dual chime
    this.playTone([520, 350], 0.12, 'sine');
  }

  playVoiceActivation() {
    // High-tech activation chime
    const ctx = this.initCtx();
    if (!ctx) return;
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone([freq], 0.1, 'sine');
      }, i * 45);
    });
  }

  playMessageSent() {
    // Crisp upward swoosh tick
    this.playTone([600], 0.08, 'sine', true, 1100);
  }

  playMessageReceived() {
    // Warm dual pop chime
    this.playTone([523.25, 783.99], 0.14, 'triangle');
  }

  playThinking() {
    // Rhythmic ambient soft pulse
    this.playTone([220], 0.08, 'sine');
  }

  playNotification() {
    // Beautiful ambient dual tone chimes
    const now = this.muted ? 0 : this.volume;
    if (now === 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const playChime = (freq: number, delay: number, dur: number) => {
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(this.volume * 0.1, ctx.currentTime + delay + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);

        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + dur + 0.1);
      };

      playChime(523.25, 0, 0.25); // C5
      playChime(659.25, 0.08, 0.35); // E5
    } catch (e) {}
  }

  playSuccess() {
    // Upward micro-arpeggio (Major triad)
    const ctx = this.initCtx();
    if (!ctx) return;
    const base = 523.25; // C5
    const notes = [base, base * 1.25, base * 1.5, base * 2]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone([freq], 0.12, 'sine');
      }, idx * 60);
    });
  }

  playDeploy() {
    // Deep epic tech-sweep
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      const duration = 0.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(this.volume * 0.25, ctx.currentTime + 0.1);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      // Low rumble osc
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(80, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(250, ctx.currentTime + duration);

      // High sparkling sweep
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(600, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + duration);

      osc1.connect(g);
      osc2.connect(g);
      g.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + duration + 0.1);
      osc2.stop(ctx.currentTime + duration + 0.1);
    } catch (e) {}
  }

  playTyping() {
    // Very quiet, dry tick sound
    this.playTone([1200], 0.02, 'sine', true, 900);
  }

  playHover() {
    // Faint, smooth subtle brush sound
    this.playTone([400], 0.08, 'sine');
  }

  playError() {
    // Dual discordant low tones for error feedback
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      this.playTone([150, 155], 0.35, 'triangle');
    } catch (e) {}
  }

  playWarning() {
    // Double pulsing caution warning tones
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      this.playTone([320], 0.1, 'sine');
      setTimeout(() => {
        this.playTone([320], 0.1, 'sine');
      }, 130);
    } catch (e) {}
  }

  playHeartPulse() {
    // Cardiac thud lub-dub sound
    const ctx = this.initCtx();
    if (!ctx) return;
    try {
      this.playTone([65, 90], 0.12, 'sine');
      setTimeout(() => {
        this.playTone([55, 80], 0.15, 'sine');
      }, 120);
    } catch (e) {}
  }
}

export const soundManager = new SoundManager();
export default soundManager;
