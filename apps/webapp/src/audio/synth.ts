import { getAudioContext } from './context';

// Oscillator helper
export function osc(
  ctx: AudioContext,
  type: 'sine' | 'square' | 'sawtooth' | 'triangle',
  freq: number
): OscillatorNode {
  const oscillator = ctx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
  return oscillator;
}

// Noise generator
export function noise(ctx: AudioContext, type: 'white' | 'pink' | 'brown'): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * 0.1; // 100ms buffer
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    let value: number;
    
    switch (type) {
      case 'white':
        value = Math.random() * 2 - 1;
        break;
      case 'pink':
        // Simple pink noise approximation
        value = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.5);
        break;
      case 'brown':
        // Brown noise (random walk)
        value = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
        break;
      default:
        value = Math.random() * 2 - 1;
    }
    
    output[i] = value;
  }
  
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

// Low-pass filter
export function lpf(ctx: AudioContext, cutoff: number, q: number = 1): BiquadFilterNode {
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(cutoff, ctx.currentTime);
  filter.Q.setValueAtTime(q, ctx.currentTime);
  return filter;
}

// High-pass filter
export function hpf(ctx: AudioContext, cutoff: number, q: number = 1): BiquadFilterNode {
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(cutoff, ctx.currentTime);
  filter.Q.setValueAtTime(q, ctx.currentTime);
  return filter;
}

// Delay effect
export function delay(
  ctx: AudioContext,
  time: number,
  feedback: number,
  mix: number
): { input: GainNode; output: GainNode } {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const delayNode = ctx.createDelay(time);
  const feedbackGain = ctx.createGain();
  const mixGain = ctx.createGain();
  
  // Set up delay chain
  input.connect(delayNode);
  delayNode.connect(feedbackGain);
  feedbackGain.connect(delayNode);
  delayNode.connect(mixGain);
  input.connect(output);
  mixGain.connect(output);
  
  // Set values
  feedbackGain.gain.setValueAtTime(feedback, ctx.currentTime);
  mixGain.gain.setValueAtTime(mix, ctx.currentTime);
  
  return { input, output };
}

// Simple reverb mock using multitap delays
export function reverbMock(
  ctx: AudioContext,
  decaySec: number,
  mix: number
): { input: GainNode; output: GainNode } {
  const input = ctx.createGain();
  const output = ctx.createGain();
  
  // Create multiple delay taps for reverb effect
  const delays = [
    { time: 0.03, feedback: 0.3 },
    { time: 0.05, feedback: 0.2 },
    { time: 0.07, feedback: 0.15 },
    { time: 0.11, feedback: 0.1 },
  ];
  
  delays.forEach(({ time, feedback }) => {
    const delayNode = ctx.createDelay(time);
    const feedbackGain = ctx.createGain();
    const decayGain = ctx.createGain();
    
    input.connect(delayNode);
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(decayGain);
    decayGain.connect(output);
    
    feedbackGain.gain.setValueAtTime(feedback, ctx.currentTime);
    decayGain.gain.setValueAtTime(mix * (1 - time / decaySec), ctx.currentTime);
  });
  
  // Direct signal
  input.connect(output);
  
  return { input, output };
}

// ADSR envelope application
export function applyADSR(
  ctx: AudioContext,
  gain: GainNode,
  env: { attack: number; decay: number; sustain: number; release: number },
  now: number,
  duration?: number
): void {
  const startTime = now;
  const attackEnd = startTime + env.attack;
  const decayEnd = attackEnd + env.decay;
  const releaseStart = duration ? startTime + duration : decayEnd + 0.1;
  const releaseEnd = releaseStart + env.release;
  
  // Attack
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(1, attackEnd);
  
  // Decay
  gain.gain.linearRampToValueAtTime(env.sustain, decayEnd);
  
  // Sustain (if duration provided)
  if (duration) {
    gain.gain.setValueAtTime(env.sustain, releaseStart);
  }
  
  // Release
  gain.gain.linearRampToValueAtTime(0, releaseEnd);
}

// Pitch bend parameter
export function pitchbendParam(
  param: AudioParam,
  now: number,
  curve: { t: number; v: number }[]
): void {
  curve.forEach(({ t, v }) => {
    param.setValueAtTime(v, now + t);
  });
}

// Frequency sweep
export function frequencySweep(
  oscillator: OscillatorNode,
  startFreq: number,
  endFreq: number,
  duration: number,
  now: number
): void {
  oscillator.frequency.setValueAtTime(startFreq, now);
  oscillator.frequency.linearRampToValueAtTime(endFreq, now + duration);
}
