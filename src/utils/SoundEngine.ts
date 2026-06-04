import { useGameStore } from "../store/gameStore";

class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private isInitialized = false;

  public init() {
    if (this.isInitialized) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Helper to get current SFX volume multiplier
  private get sfxMultiplier() {
    const state = useGameStore.getState();
    return state.isMuted ? 0 : state.sfxVolume * 1.5; // boosted base SFX slightly
  }

  // Helper to create basic oscillators
  private playOscillator(type: OscillatorType, frequency: number, duration: number, vol: number = 0.1, slideFreq?: number) {
    if (!this.ctx) return;
    const mult = this.sfxMultiplier;
    if (mult === 0) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideFreq, this.ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(vol * mult, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // 1. Hover: subtle very short high tick
  public playHover() {
    this.playOscillator("sine", 1200, 0.05, 0.03);
  }

  // 2. Click: deeper sci-fi blip
  public playClick() {
    this.playOscillator("square", 400, 0.1, 0.05, 100);
  }

  // 3. Typewriter: dry mechanical click
  public playType() {
    this.playOscillator("triangle", 600, 0.03, 0.04);
  }

  // 4. Glitch: White noise burst
  public playGlitch() {
    if (!this.ctx) return;
    const mult = this.sfxMultiplier;
    if (mult === 0) return;
    this.resume();
    
    const bufferSize = this.ctx.sampleRate * 0.2; // 0.2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter to make it sound like electric static
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2 * mult, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseSource.start();
  }

  // 5. Success: Happy chord arpeggio
  public playSuccess() {
    this.playOscillator("sine", 523.25, 0.3, 0.1); // C5
    setTimeout(() => this.playOscillator("sine", 659.25, 0.3, 0.1), 100); // E5
    setTimeout(() => this.playOscillator("sine", 783.99, 0.4, 0.1), 200); // G5
  }

  // 6. Error: Low harsh buzz
  public playError() {
    this.playOscillator("sawtooth", 150, 0.4, 0.1, 100);
  }

  // 7. Heartbeat: Synthesized low frequency double-thump
  public playHeartbeat() {
    if (!this.ctx) return;
    const mult = this.sfxMultiplier;
    if (mult === 0) return;
    this.resume();

    const t = this.ctx.currentTime;
    
    // Helper for a single thump
    const thump = (startTime: number, freqStart: number, freqEnd: number, duration: number, peakVol: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freqStart, startTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, startTime + duration);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakVol * mult, startTime + duration * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Double thump (lub-dub)
    thump(t, 60, 30, 0.2, 1.2);
    thump(t + 0.25, 55, 25, 0.3, 0.9);
  }

  public playBGM(url: string) {
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio(url);
      this.bgmAudio.loop = true;
    } else if (this.bgmAudio.getAttribute('src') !== url) {
      this.bgmAudio.src = url;
    }
    this.updateBGMVolume();
    this.bgmAudio.play().catch(e => console.warn("BGM autoplay blocked:", e));
  }

  public updateBGMVolume() {
    if (this.bgmAudio) {
      const state = useGameStore.getState();
      // default volume was 0.4. We map slider 0-1 to a max of 0.3 for a gentler BGM
      this.bgmAudio.volume = state.isMuted ? 0 : state.bgmVolume * 0.3;
    }
  }

  public stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      // Optional: don't reset time so we can resume, or we can reset depending on design.
      // this.bgmAudio.currentTime = 0; 
    }
  }

  public setMuted(muted: boolean) {
    useGameStore.getState().setIsMuted(muted);
    this.updateBGMVolume();
  }
}

export const SoundEngine = new WebAudioEngine();
