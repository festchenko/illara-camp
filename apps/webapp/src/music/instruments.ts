// Musical instruments and note helpers

// Note frequencies for C major/A minor scale
export const NOTES = {
  // C major scale
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50,
} as const;

export type NoteName = keyof typeof NOTES;

export function note(name: NoteName): number {
  return NOTES[name];
}

// Helper for chord progressions
export const CHORDS = {
  C: [note('C4'), note('E4'), note('G4')], // I
  Dm: [note('D4'), note('F4'), note('A4')], // ii
  Em: [note('E4'), note('G4'), note('B4')], // iii
  F: [note('F4'), note('A4'), note('C5')], // IV
  G: [note('G4'), note('B4'), note('D5')], // V
  Am: [note('A4'), note('C5'), note('E5')], // vi
  Bdim: [note('B4'), note('D5'), note('F5')], // vii°
} as const;

// Monophonic synth for arpeggios and leads
export function monoSynth(
  ctx: AudioContext,
  options: {
    type?: OscillatorType;
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    lpf?: number;
  } = {}
) {
  const {
    type = 'triangle',
    attack = 0.005,
    decay = 0.08,
    sustain = 0.2,
    release = 0.2,
    lpf = 8000,
  } = options;

  const trigger = (freq: number, durSec: number, at: number, gain: number = 0.3): void => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Set up filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(lpf, at);
    filter.Q.setValueAtTime(1, at);

    // Set up oscillator
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, at);

    // Set up gain envelope
    gainNode.gain.setValueAtTime(0, at);
    gainNode.gain.linearRampToValueAtTime(gain, at + attack);
    gainNode.gain.linearRampToValueAtTime(gain * sustain, at + attack + decay);
    gainNode.gain.setValueAtTime(gain * sustain, at + durSec - release);
    gainNode.gain.linearRampToValueAtTime(0, at + durSec);

    // Connect
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start/stop
    oscillator.start(at);
    oscillator.stop(at + durSec);
  };

  return { trigger };
}

// Pad synth with detuned oscillators
export function padSynth(
  ctx: AudioContext,
  options: {
    type?: OscillatorType;
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
    detune?: number;
  } = {}
) {
  const {
    type = 'sine',
    attack = 0.1,
    decay = 0.3,
    sustain = 0.4,
    release = 0.5,
    detune = 4, // cents
  } = options;

  const trigger = (freq: number, durSec: number, at: number, gain: number = 0.2): void => {
    // Create two oscillators with detuning
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Set up oscillators
    osc1.type = type;
    osc2.type = type;
    osc1.frequency.setValueAtTime(freq, at);
    osc2.frequency.setValueAtTime(freq * Math.pow(2, detune / 1200), at); // Convert cents to frequency ratio

    // Set up gain envelope (slower for pads)
    gainNode.gain.setValueAtTime(0, at);
    gainNode.gain.linearRampToValueAtTime(gain, at + attack);
    gainNode.gain.linearRampToValueAtTime(gain * sustain, at + attack + decay);
    gainNode.gain.setValueAtTime(gain * sustain, at + durSec - release);
    gainNode.gain.linearRampToValueAtTime(0, at + durSec);

    // Connect
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start/stop
    osc1.start(at);
    osc2.start(at);
    osc1.stop(at + durSec);
    osc2.stop(at + durSec);
  };

  return { trigger };
}

// Bass synth with LPF
export function bassSynth(
  ctx: AudioContext,
  options: {
    type?: 'square' | 'sawtooth';
    lpf?: number;
    q?: number;
    attack?: number;
    decay?: number;
    sustain?: number;
    release?: number;
  } = {}
) {
  const {
    type = 'square',
    lpf = 480,
    q = 8,
    attack = 0.01,
    decay = 0.1,
    sustain = 0.3,
    release = 0.2,
  } = options;

  const trigger = (freq: number, durSec: number, at: number, gain: number = 0.4): void => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Set up filter for bass
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(lpf, at);
    filter.Q.setValueAtTime(q, at);

    // Set up oscillator
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, at);

    // Set up gain envelope
    gainNode.gain.setValueAtTime(0, at);
    gainNode.gain.linearRampToValueAtTime(gain, at + attack);
    gainNode.gain.linearRampToValueAtTime(gain * sustain, at + attack + decay);
    gainNode.gain.setValueAtTime(gain * sustain, at + durSec - release);
    gainNode.gain.linearRampToValueAtTime(0, at + durSec);

    // Connect
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start/stop
    oscillator.start(at);
    oscillator.stop(at + durSec);
  };

  return { trigger };
}
