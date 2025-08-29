// Musical patterns for background music presets

import { Transport } from './transport';
import { monoSynth, padSynth, bassSynth, note, CHORDS } from './instruments';

export type MusicPresetName = 'happy' | 'cosmic' | 'chill';
export type PatternFn = (ctx: AudioContext, t: Transport, out: GainNode) => { stop(): void };

// Happy pattern: upbeat arpeggio with bass
export function createHappyPattern(ctx: AudioContext, t: Transport, out: GainNode): { stop(): void } {
  let running = true;
  
  // Create synths
  const arpSynth = monoSynth(ctx, { type: 'triangle', attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.15 });
  const bassSynthInst = bassSynth(ctx, { type: 'square', lpf: 400, q: 6 });
  
  // Arpeggio pattern: C-E-G-B (8th notes)
  const arpNotes = [note('C5'), note('E5'), note('G5'), note('B5')];
  const bassNotes = [note('C3'), note('G3'), note('A3'), note('F3')]; // I-V-vi-IV progression
  
  const scheduleArp = (startBeat: number) => {
    if (!running) return;
    
    // Schedule arpeggio for 8 bars (32 beats)
    for (let bar = 0; bar < 8; bar++) {
      for (let beat = 0; beat < 4; beat++) {
        const noteIndex = (bar * 4 + beat) % arpNotes.length;
        const bassIndex = bar % bassNotes.length;
        
        // Arpeggio note (8th note = 0.5 beats)
        const arpTime = startBeat + bar * 4 + beat * 0.5;
        t.schedule(() => {
          if (running) {
            arpSynth.trigger(arpNotes[noteIndex], 0.4, t.getTime(), 0.25);
          }
        }, arpTime - t.getBeat());
        
        // Bass note (on downbeat)
        if (beat === 0) {
          const bassTime = startBeat + bar * 4;
          t.schedule(() => {
            if (running) {
              bassSynthInst.trigger(bassNotes[bassIndex], 1.5, t.getTime(), 0.3);
            }
          }, bassTime - t.getBeat());
        }
      }
    }
    
    // Reschedule for next 8 bars
    if (running) {
      t.schedule(() => scheduleArp(startBeat + 32), 32);
    }
  };
  
  // Start the pattern
  scheduleArp(t.getBeat());
  
  return {
    stop: () => {
      running = false;
    }
  };
}

// Cosmic pattern: airy pad with octave jumps
export function createCosmicPattern(ctx: AudioContext, t: Transport, out: GainNode): { stop(): void } {
  let running = true;
  
  // Create synths
  const padSynthInst = padSynth(ctx, { type: 'sine', attack: 0.5, decay: 0.8, sustain: 0.6, release: 1.0 });
  const arpSynth = monoSynth(ctx, { type: 'triangle', attack: 0.02, decay: 0.2, sustain: 0.4, release: 0.3 });
  
  // Pad chord progression: Am - F - C - G
  const padChords = [
    [note('A3'), note('C4'), note('E4')], // Am
    [note('F3'), note('A3'), note('C4')], // F
    [note('C3'), note('E3'), note('G3')], // C
    [note('G3'), note('B3'), note('D4')], // G
  ];
  
  // Arpeggio with octave jumps
  const arpNotes = [note('C5'), note('C6'), note('E5'), note('E6'), note('G5'), note('G6')];
  
  const schedulePad = (startBeat: number) => {
    if (!running) return;
    
    // Schedule pad for 8 bars
    for (let bar = 0; bar < 8; bar++) {
      const chordIndex = bar % padChords.length;
      const chord = padChords[chordIndex];
      
      // Pad chord (whole note = 4 beats)
      const padTime = startBeat + bar * 4;
      t.schedule(() => {
        if (running) {
          chord.forEach((freq, i) => {
            padSynthInst.trigger(freq, 3.5, t.getTime(), 0.15);
          });
        }
      }, padTime - t.getBeat());
      
      // Arpeggio with octave jumps every 2 bars
      if (bar % 2 === 0) {
        for (let beat = 0; beat < 4; beat++) {
          const noteIndex = (bar * 2 + beat) % arpNotes.length;
          const arpTime = startBeat + bar * 4 + beat * 0.5;
          t.schedule(() => {
            if (running) {
              arpSynth.trigger(arpNotes[noteIndex], 0.4, t.getTime(), 0.2);
            }
          }, arpTime - t.getBeat());
        }
      }
    }
    
    // Reschedule for next 8 bars
    if (running) {
      t.schedule(() => schedulePad(startBeat + 32), 32);
    }
  };
  
  // Start the pattern
  schedulePad(t.getBeat());
  
  return {
    stop: () => {
      running = false;
    }
  };
}

// Chill pattern: slow pad with syncopated bass
export function createChillPattern(ctx: AudioContext, t: Transport, out: GainNode): { stop(): void } {
  let running = true;
  
  // Create synths
  const padSynthInst = padSynth(ctx, { type: 'sine', attack: 0.8, decay: 1.2, sustain: 0.7, release: 1.5 });
  const bassSynthInst = bassSynth(ctx, { type: 'sawtooth', lpf: 300, q: 4, attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.4 });
  const arpSynth = monoSynth(ctx, { type: 'triangle', attack: 0.1, decay: 0.4, sustain: 0.5, release: 0.6 });
  
  // Chill chord progression: Am - Em - F - C
  const padChords = [
    [note('A3'), note('C4'), note('E4')], // Am
    [note('E3'), note('G3'), note('B3')], // Em
    [note('F3'), note('A3'), note('C4')], // F
    [note('C3'), note('E3'), note('G3')], // C
  ];
  
  // Sparse arpeggio notes
  const arpNotes = [note('C5'), note('E5'), note('G5')];
  
  const scheduleChill = (startBeat: number) => {
    if (!running) return;
    
    // Schedule for 8 bars
    for (let bar = 0; bar < 8; bar++) {
      const chordIndex = bar % padChords.length;
      const chord = padChords[chordIndex];
      
      // Pad chord (whole note)
      const padTime = startBeat + bar * 4;
      t.schedule(() => {
        if (running) {
          chord.forEach((freq, i) => {
            padSynthInst.trigger(freq, 3.5, t.getTime(), 0.12);
          });
        }
      }, padTime - t.getBeat());
      
      // Syncopated bass (on offbeats)
      const bassTime = startBeat + bar * 4 + 0.5; // Offbeat
      t.schedule(() => {
        if (running) {
          bassSynthInst.trigger(chord[0] * 0.5, 1.5, t.getTime(), 0.25); // Root note octave down
        }
      }, bassTime - t.getBeat());
      
      // Sparse arpeggio (quarter + eighth notes)
      if (bar % 2 === 0) {
        // Quarter note on beat 1
        const arpTime1 = startBeat + bar * 4;
        t.schedule(() => {
          if (running) {
            arpSynth.trigger(arpNotes[0], 0.8, t.getTime(), 0.18);
          }
        }, arpTime1 - t.getBeat());
        
        // Eighth note on beat 3.5
        const arpTime2 = startBeat + bar * 4 + 2.5;
        t.schedule(() => {
          if (running) {
            arpSynth.trigger(arpNotes[1], 0.4, t.getTime(), 0.15);
          }
        }, arpTime2 - t.getBeat());
      }
    }
    
    // Reschedule for next 8 bars
    if (running) {
      t.schedule(() => scheduleChill(startBeat + 32), 32);
    }
  };
  
  // Start the pattern
  scheduleChill(t.getBeat());
  
  return {
    stop: () => {
      running = false;
    }
  };
}

// Pattern registry
export const PATTERNS: Record<MusicPresetName, PatternFn> = {
  happy: createHappyPattern,
  cosmic: createCosmicPattern,
  chill: createChillPattern,
};
