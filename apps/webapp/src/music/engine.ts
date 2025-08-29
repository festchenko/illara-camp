// Music engine with preset management and ducking

import { getAudioContext, resumeAudio } from '../audio/context';
import { createTransport, nextBarTime } from './transport';
import { PATTERNS, MusicPresetName } from './patterns';

export type MusicState = {
  ctx: AudioContext;
  musicGain: GainNode;
  current?: { name: MusicPresetName; stop: () => void };
  bpm: number;
  transport: ReturnType<typeof createTransport>;
  ducking: {
    enabled: boolean;
    amountDb: number;
    holdMs: number;
    releaseMs: number;
    timeout?: number;
  };
};

let musicEngine: MusicState | null = null;

export function getMusicEngine(): MusicState {
  if (!musicEngine) {
    const ctx = getAudioContext();
    
    // Create music gain node
    const musicGain = ctx.createGain();
    musicGain.gain.value = 0.35; // Default music volume
    musicGain.connect(ctx.destination);
    
    // Create transport
    const transport = createTransport(ctx, 96);
    
    musicEngine = {
      ctx,
      musicGain,
      bpm: 96,
      transport,
      ducking: {
        enabled: false,
        amountDb: -6,
        holdMs: 240,
        releaseMs: 260,
      },
    };
  }
  
  return musicEngine;
}

export async function startPreset(name: MusicPresetName): Promise<void> {
  const engine = getMusicEngine();
  
  // Ensure audio context is resumed
  await resumeAudio();
  
  // Stop current preset if running
  if (engine.current) {
    // Fade out current preset
    const currentGain = engine.musicGain.gain.value;
    engine.musicGain.gain.setValueAtTime(currentGain, engine.ctx.currentTime);
    engine.musicGain.gain.linearRampToValueAtTime(0, engine.ctx.currentTime + 0.6);
    
    // Stop after fade
    setTimeout(() => {
      engine.current?.stop();
      engine.current = undefined;
    }, 600);
  }
  
  // Start new preset at next bar boundary
  const startTime = nextBarTime(engine.transport, 1);
  engine.transport.start(startTime);
  
  // Create pattern
  const pattern = PATTERNS[name];
  if (!pattern) {
    console.error(`Pattern not found for preset: ${name}`);
    return;
  }
  
  const stopFn = pattern(engine.ctx, engine.transport, engine.musicGain);
  
  // Verify stopFn is a function
  if (typeof stopFn !== 'function') {
    console.error('Pattern did not return a valid stop function');
    return;
  }
  
  // Fade in new preset
  engine.musicGain.gain.setValueAtTime(0, startTime);
  engine.musicGain.gain.linearRampToValueAtTime(0.35, startTime + 0.6);
  
  engine.current = { name, stop: stopFn };
}

export function stopMusic(immediate: boolean = false): void {
  const engine = getMusicEngine();
  
  if (!engine.current) return;
  
  if (immediate) {
    // Quick stop
    engine.musicGain.gain.setValueAtTime(0, engine.ctx.currentTime);
    if (typeof engine.current.stop === 'function') {
      engine.current.stop();
    }
    engine.current = undefined;
    engine.transport.stop();
  } else {
    // Fade out
    const currentGain = engine.musicGain.gain.value;
    engine.musicGain.gain.setValueAtTime(currentGain, engine.ctx.currentTime);
    engine.musicGain.gain.linearRampToValueAtTime(0, engine.ctx.currentTime + 0.6);
    
    setTimeout(() => {
      if (engine.current && typeof engine.current.stop === 'function') {
        engine.current.stop();
      }
      engine.current = undefined;
      engine.transport.stop();
    }, 600);
  }
}

export function setMusicVolume(volume: number): void {
  const engine = getMusicEngine();
  const clampedVolume = Math.max(0, Math.min(1, volume));
  engine.musicGain.gain.setValueAtTime(clampedVolume, engine.ctx.currentTime);
}

export function setBpm(bpm: number): void {
  const engine = getMusicEngine();
  engine.bpm = Math.max(60, Math.min(180, bpm));
  engine.transport.bpm = engine.bpm;
}

export function setDucking(enabled: boolean): void {
  const engine = getMusicEngine();
  engine.ducking.enabled = enabled;
}

export function notifyDuck(): void {
  const engine = getMusicEngine();
  
  if (!engine.ducking.enabled) return;
  
  // Clear existing duck timeout
  if (engine.ducking.timeout) {
    clearTimeout(engine.ducking.timeout);
  }
  
  // Convert dB to linear gain
  const duckAmount = Math.pow(10, engine.ducking.amountDb / 20);
  const currentGain = engine.musicGain.gain.value;
  
  // Apply duck
  engine.musicGain.gain.setValueAtTime(currentGain, engine.ctx.currentTime);
  engine.musicGain.gain.linearRampToValueAtTime(currentGain * duckAmount, engine.ctx.currentTime + 0.01);
  
  // Hold duck
  engine.ducking.timeout = setTimeout(() => {
    // Release duck
    const targetGain = 0.35; // Default music volume
    engine.musicGain.gain.setValueAtTime(engine.musicGain.gain.value, engine.ctx.currentTime);
    engine.musicGain.gain.linearRampToValueAtTime(targetGain, engine.ctx.currentTime + engine.ducking.releaseMs / 1000);
    engine.ducking.timeout = undefined;
  }, engine.ducking.holdMs);
}

// Helper functions
export function getCurrentPreset(): MusicPresetName | null {
  const engine = getMusicEngine();
  return engine.current?.name || null;
}

export function isMusicPlaying(): boolean {
  const engine = getMusicEngine();
  return engine.current !== undefined;
}

export function getMusicVolume(): number {
  const engine = getMusicEngine();
  return engine.musicGain.gain.value;
}

export function getBpm(): number {
  const engine = getMusicEngine();
  return engine.bpm;
}
