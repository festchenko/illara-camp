// Audio presets and constants

export type Env = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

// ADSR envelope presets (in seconds)
export const ENV_CLICK: Env = { attack: 0.002, decay: 0.03, sustain: 0.0, release: 0.05 };
export const ENV_SHORT: Env = { attack: 0.003, decay: 0.06, sustain: 0.1, release: 0.08 };
export const ENV_LONG: Env = { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.3 };
export const ENV_SNAPPY: Env = { attack: 0.001, decay: 0.02, sustain: 0.0, release: 0.04 };

// Musical note frequencies (C major scale)
export const NOTES = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.00,
  A3: 220.00,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.00,
  B5: 987.77,
  C6: 1046.50,
};

// Helper function to get note frequency
export function note(freq: number): number {
  return freq;
}

// Common frequency values
export const FREQ = {
  LOW: 110,
  MID: 440,
  HIGH: 880,
  VERY_HIGH: 1760,
};
