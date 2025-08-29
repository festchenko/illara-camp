import { getAudioContext, getMasterGain, isMuted, resumeAudio } from './context';
import { osc, noise, lpf, delay, reverbMock, applyADSR, frequencySweep } from './synth';
import { ENV_CLICK, ENV_SHORT, ENV_LONG, ENV_SNAPPY, NOTES } from './presets';

export type SfxName = 'tap' | 'point' | 'fail' | 'win' | 'unlock' | 'hit' | 'jump' | 'stack' | 'flip' | 'match';

// Per-SFX volume storage
const sfxVolumes = new Map<SfxName, number>();

// SFX registry
const sfxRegistry = new Map<SfxName, (ctx: AudioContext, master: GainNode, opts?: any) => void>();

// Initialize SFX registry
function initSfxRegistry() {
  // Tap - short sine blip
  sfxRegistry.set('tap', (ctx, master, opts = {}) => {
    const gain = ctx.createGain();
    const oscillator = osc(ctx, 'sine', 440);
    
    oscillator.connect(gain);
    gain.connect(master);
    
    applyADSR(ctx, gain, ENV_CLICK, ctx.currentTime, 0.08);
    frequencySweep(oscillator, 440, 660, 0.08, ctx.currentTime);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  });

  // Point - two-step triangle
  sfxRegistry.set('point', (ctx, master, opts = {}) => {
    const gain = ctx.createGain();
    const oscillator = osc(ctx, 'triangle', 660);
    const delayEffect = delay(ctx, 0.1, 0.3, 0.1);
    
    oscillator.connect(delayEffect.input);
    delayEffect.output.connect(gain);
    gain.connect(master);
    
    applyADSR(ctx, gain, ENV_SHORT, ctx.currentTime, 0.15);
    frequencySweep(oscillator, 660, 990, 0.15, ctx.currentTime);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  });

  // Fail - sawtooth glide down + noise
  sfxRegistry.set('fail', (ctx, master, opts = {}) => {
    const gain = ctx.createGain();
    const oscillator = osc(ctx, 'sawtooth', 440);
    const noiseSource = noise(ctx, 'white');
    const filter = lpf(ctx, 800);
    
    oscillator.connect(filter);
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    
    applyADSR(ctx, gain, ENV_LONG, ctx.currentTime, 0.3);
    frequencySweep(oscillator, 440, 110, 0.3, ctx.currentTime);
    
    oscillator.start(ctx.currentTime);
    noiseSource.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
    noiseSource.stop(ctx.currentTime + 0.4);
  });

  // Win - major triad arpeggio
  sfxRegistry.set('win', (ctx, master, opts = {}) => {
    const reverb = reverbMock(ctx, 0.5, 0.2);
    const notes = [NOTES.C5, NOTES.E5, NOTES.G5];
    
    notes.forEach((freq, index) => {
      const gain = ctx.createGain();
      const oscillator = osc(ctx, 'sine', freq);
      
      oscillator.connect(gain);
      gain.connect(reverb.input);
      reverb.output.connect(master);
      
      const startTime = ctx.currentTime + index * 0.12;
      applyADSR(ctx, gain, ENV_SHORT, startTime, 0.1);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    });
  });

  // Unlock - square bend up + sparkle
  sfxRegistry.set('unlock', (ctx, master, opts = {}) => {
    const gain = ctx.createGain();
    const oscillator1 = osc(ctx, 'square', 330);
    const oscillator2 = osc(ctx, 'triangle', 1320);
    const delayEffect = delay(ctx, 0.15, 0.4, 0.15);
    
    oscillator1.connect(delayEffect.input);
    oscillator2.connect(delayEffect.input);
    delayEffect.output.connect(gain);
    gain.connect(master);
    
    applyADSR(ctx, gain, ENV_SNAPPY, ctx.currentTime, 0.2);
    frequencySweep(oscillator1, 330, 660, 0.2, ctx.currentTime);
    
    oscillator1.start(ctx.currentTime);
    oscillator2.start(ctx.currentTime);
    oscillator1.stop(ctx.currentTime + 0.25);
    oscillator2.stop(ctx.currentTime + 0.25);
  });

  // Hit - noise burst with LPF sweep
  sfxRegistry.set('hit', (ctx, master, opts = {}) => {
    const gain = ctx.createGain();
    const noiseSource = noise(ctx, 'white');
    const filter = lpf(ctx, 400);
    
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    
    applyADSR(ctx, gain, ENV_CLICK, ctx.currentTime, 0.08);
    frequencySweep(filter.frequency as any, 400, 2000, 0.08, ctx.currentTime);
    
    noiseSource.start(ctx.currentTime);
    noiseSource.stop(ctx.currentTime + 0.1);
  });

  // Jump - sine quick up
  sfxRegistry.set('jump', (ctx, master, opts = {}) => {
    const gain = ctx.createGain();
    const oscillator = osc(ctx, 'sine', 440);
    
    oscillator.connect(gain);
    gain.connect(master);
    
    applyADSR(ctx, gain, ENV_SHORT, ctx.currentTime, 0.12);
    frequencySweep(oscillator, 440, 700, 0.12, ctx.currentTime);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  });

  // Stack - saw + click
  sfxRegistry.set('stack', (ctx, master, opts = {}) => {
    const gain = ctx.createGain();
    const oscillator1 = osc(ctx, 'sawtooth', 240);
    const oscillator2 = osc(ctx, 'sine', 2000);
    
    oscillator1.connect(gain);
    oscillator2.connect(gain);
    gain.connect(master);
    
    applyADSR(ctx, gain, ENV_CLICK, ctx.currentTime, 0.09);
    
    oscillator1.start(ctx.currentTime);
    oscillator2.start(ctx.currentTime);
    oscillator1.stop(ctx.currentTime + 0.1);
    oscillator2.stop(ctx.currentTime + 0.1);
  });

  // Flip - soft triangle downward bend
  sfxRegistry.set('flip', (ctx, master, opts = {}) => {
    const gain = ctx.createGain();
    const oscillator = osc(ctx, 'triangle', 500);
    
    oscillator.connect(gain);
    gain.connect(master);
    
    applyADSR(ctx, gain, ENV_SHORT, ctx.currentTime, 0.07);
    frequencySweep(oscillator, 500, 450, 0.07, ctx.currentTime);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  });

  // Match - two-note success
  sfxRegistry.set('match', (ctx, master, opts = {}) => {
    const delayEffect = delay(ctx, 0.1, 0.2, 0.1);
    const notes = [660, 880];
    
    notes.forEach((freq, index) => {
      const gain = ctx.createGain();
      const oscillator = osc(ctx, 'sine', freq);
      
      oscillator.connect(gain);
      gain.connect(delayEffect.input);
      delayEffect.output.connect(master);
      
      const startTime = ctx.currentTime + index * 0.1;
      applyADSR(ctx, gain, ENV_SHORT, startTime, 0.08);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.12);
    });
  });
}

// Initialize registry on first import
initSfxRegistry();

export function playSfx(name: SfxName, opts: { volume?: number } = {}): void {
  try {
    if (isMuted()) return;
    
    const ctx = getAudioContext();
    const master = getMasterGain();
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      resumeAudio();
      return; // Skip this play, will work on next user interaction
    }
    
    const sfxFunction = sfxRegistry.get(name);
    if (!sfxFunction) {
      console.warn(`SFX '${name}' not found`);
      return;
    }
    
    // Apply per-SFX volume
    const sfxVolume = sfxVolumes.get(name) ?? 1.0;
    const finalVolume = opts.volume ?? sfxVolume;
    
    if (finalVolume > 0) {
      sfxFunction(ctx, master, { ...opts, volume: finalVolume });
    }
    
    // Trigger haptic feedback for certain sounds
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      const hapticMap: Record<SfxName, 'light' | 'medium' | 'heavy'> = {
        point: 'light',
        win: 'medium',
        fail: 'heavy',
        unlock: 'medium',
        match: 'light',
        tap: 'light',
        hit: 'medium',
        jump: 'light',
        stack: 'light',
        flip: 'light',
      };
      
      const hapticType = hapticMap[name];
      if (hapticType) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(hapticType);
      }
    }
    
  } catch (error) {
    console.warn('Failed to play SFX:', name, error);
  }
}

export function setSfxVolume(name: SfxName, volume: number): void {
  sfxVolumes.set(name, Math.max(0, Math.min(1, volume)));
}

export function setGlobalSfxVolume(volume: number): void {
  const { setMasterVolume } = require('./context');
  setMasterVolume(volume);
}

export function getSfxVolume(name: SfxName): number {
  return sfxVolumes.get(name) ?? 1.0;
}
