// Musical patterns for background music presets

import { Transport } from './transport';
import { monoSynth, padSynth, bassSynth, note, CHORDS } from './instruments';

export type MusicPresetName = 'happy' | 'cosmic' | 'chill';
export type PatternFn = (ctx: AudioContext, t: Transport, out: GainNode) => { stop(): void };

// 8-bit game pattern: dynamic and energetic
export function createHappyPattern(ctx: AudioContext, t: Transport, out: GainNode): { stop(): void } {
  let running = true;
  
  // Create 8-bit style synths
  const leadSynth = monoSynth(ctx, { type: 'square', attack: 0.001, decay: 0.1, sustain: 0.3, release: 0.15 });
  const bassSynthInst = bassSynth(ctx, { type: 'square', lpf: 400, q: 4 });
  const noiseSynth = monoSynth(ctx, { type: 'sawtooth', attack: 0.001, decay: 0.05, sustain: 0.0, release: 0.1 });
  
  // Dynamic 8-bit melody with jumps and runs
  const melodyNotes = [
    // Bar 1: Upward run
    note('C5'), note('D5'), note('E5'), note('G5'),
    // Bar 2: Downward run  
    note('G5'), note('E5'), note('D5'), note('C5'),
    // Bar 3: Jump pattern
    note('C5'), note('G5'), note('C6'), note('G5'),
    // Bar 4: Descending
    note('F5'), note('E5'), note('D5'), note('C5'),
  ];
  
  // 8-bit chord progression: C - Am - F - G
  const chordNotes = [
    [note('C3'), note('E3'), note('G3')], // C major
    [note('A3'), note('C4'), note('E4')], // A minor
    [note('F3'), note('A3'), note('C4')], // F major
    [note('G3'), note('B3'), note('D4')], // G major
  ];
  
  // Punchy bass line
  const bassNotes = [note('C3'), note('A3'), note('F3'), note('G3')];
  
  // Drum pattern (using noise)
  const drumPattern = [1, 0, 1, 0, 1, 0, 1, 0]; // Kick on every beat
  
  const schedule8Bit = (startBeat: number) => {
    if (!running) return;
    
    // Schedule for 8 bars
    for (let bar = 0; bar < 8; bar++) {
      const chordIndex = bar % chordNotes.length;
      const chord = chordNotes[chordIndex];
      const bassNote = bassNotes[bar % bassNotes.length];
      
      // Bass note (on downbeat) - punchy 8-bit style
      const bassTime = startBeat + bar * 4;
      t.schedule(() => {
        if (running) {
          bassSynthInst.trigger(bassNote, 1.0, t.getTime(), 0.4);
        }
      }, bassTime - t.getBeat());
      
      // Dynamic melody line (eighth notes for energy)
      for (let beat = 0; beat < 4; beat++) {
        const noteIndex = (bar * 4 + beat) % melodyNotes.length;
        const melodyTime = startBeat + bar * 4 + beat;
        
        // Main melody note
        t.schedule(() => {
          if (running) {
            leadSynth.trigger(melodyNotes[noteIndex], 0.4, t.getTime(), 0.35);
          }
        }, melodyTime - t.getBeat());
        
        // Offbeat accent (every other beat)
        if (beat % 2 === 1) {
          const accentTime = startBeat + bar * 4 + beat - 0.25;
          t.schedule(() => {
            if (running) {
              leadSynth.trigger(melodyNotes[noteIndex] * 1.5, 0.15, t.getTime(), 0.2);
            }
          }, accentTime - t.getBeat());
        }
      }
      
      // Drum kicks (every beat for energy)
      for (let beat = 0; beat < 4; beat++) {
        if (drumPattern[beat]) {
          const drumTime = startBeat + bar * 4 + beat;
          t.schedule(() => {
            if (running) {
              noiseSynth.trigger(100, 0.1, t.getTime(), 0.3);
            }
          }, drumTime - t.getBeat());
        }
      }
      
      // Chord stabs (every 2 bars for variety)
      if (bar % 2 === 0) {
        const chordTime = startBeat + bar * 4 + 2;
        t.schedule(() => {
          if (running) {
            chord.forEach((freq: number) => {
              leadSynth.trigger(freq, 0.3, t.getTime(), 0.15);
            });
          }
        }, chordTime - t.getBeat());
      }
    }
    
    // Reschedule for next 8 bars
    if (running) {
      t.schedule(() => schedule8Bit(startBeat + 32), 32);
    }
  };
  
  // Start the pattern
  schedule8Bit(t.getBeat());
  
  const stopFn = () => {
    console.log('Stopping happy pattern');
    running = false;
  };
  
  console.log('Happy pattern created, stop function:', typeof stopFn);
  
  return {
    stop: stopFn
  };
}

// Cosmic pattern: space adventure
export function createCosmicPattern(ctx: AudioContext, t: Transport, out: GainNode): { stop(): void } {
  let running = true;
  
  // Create space synths
  const leadSynth = monoSynth(ctx, { type: 'square', attack: 0.02, decay: 0.3, sustain: 0.5, release: 0.6 });
  const bassSynthInst = bassSynth(ctx, { type: 'sawtooth', lpf: 300, q: 6 });
  const spaceSynth = monoSynth(ctx, { type: 'triangle', attack: 0.1, decay: 0.8, sustain: 0.4, release: 1.0 });
  
  // Space chord progression: Am - F - C - G
  const spaceChords = [
    [note('A3'), note('C4'), note('E4')], // Am
    [note('F3'), note('A3'), note('C4')], // F
    [note('C3'), note('E3'), note('G3')], // C
    [note('G3'), note('B3'), note('D4')], // G
  ];
  
  // Space melody with jumps
  const melodyNotes = [note('C5'), note('E5'), note('G5'), note('C6'), note('G5'), note('E5'), note('C5'), note('A4')];
  
  // Bass line
  const bassNotes = [note('A3'), note('F3'), note('C3'), note('G3')];
  
  const scheduleCosmic = (startBeat: number) => {
    if (!running) return;
    
    // Schedule for 8 bars
    for (let bar = 0; bar < 8; bar++) {
      const chordIndex = bar % spaceChords.length;
      const chord = spaceChords[chordIndex];
      const bassNote = bassNotes[bar % bassNotes.length];
      
      // Bass note (on downbeat)
      const bassTime = startBeat + bar * 4;
      t.schedule(() => {
        if (running) {
          bassSynthInst.trigger(bassNote, 1.5, t.getTime(), 0.3);
        }
      }, bassTime - t.getBeat());
      
      // Space melody (quarter notes)
      for (let beat = 0; beat < 4; beat++) {
        const noteIndex = (bar * 4 + beat) % melodyNotes.length;
        const melodyTime = startBeat + bar * 4 + beat;
        t.schedule(() => {
          if (running) {
            leadSynth.trigger(melodyNotes[noteIndex], 0.6, t.getTime(), 0.3);
          }
        }, melodyTime - t.getBeat());
      }
      
      // Space effects (every 2 bars)
      if (bar % 2 === 0) {
        const spaceTime = startBeat + bar * 4 + 2;
        t.schedule(() => {
          if (running) {
            spaceSynth.trigger(note('C6'), 1.0, t.getTime(), 0.2);
          }
        }, spaceTime - t.getBeat());
      }
    }
    
    // Reschedule for next 8 bars
    if (running) {
      t.schedule(() => scheduleCosmic(startBeat + 32), 32);
    }
  };
  
  // Start the pattern
  scheduleCosmic(t.getBeat());
  
  return {
    stop: () => {
      console.log('Stopping cosmic pattern');
      running = false;
    }
  };
}

// Chill pattern: relaxing and peaceful
export function createChillPattern(ctx: AudioContext, t: Transport, out: GainNode): { stop(): void } {
  let running = true;
  
  // Create synths with warm, relaxing tones
  const padSynthInst = padSynth(ctx, { type: 'sine', attack: 1.0, decay: 1.5, sustain: 0.8, release: 2.0 });
  const bassSynthInst = bassSynth(ctx, { type: 'sawtooth', lpf: 250, q: 6, attack: 0.1, decay: 0.5, sustain: 0.6, release: 0.8 });
  const leadSynth = monoSynth(ctx, { type: 'triangle', attack: 0.2, decay: 0.6, sustain: 0.7, release: 1.0 });
  
  // Peaceful chord progression: Am - F - C - G
  const padChords = [
    [note('A3'), note('C4'), note('E4')], // Am
    [note('F3'), note('A3'), note('C4')], // F
    [note('C3'), note('E3'), note('G3')], // C
    [note('G3'), note('B3'), note('D4')], // G
  ];
  
  // Gentle melody notes
  const melodyNotes = [note('C5'), note('E5'), note('G5'), note('A5')];
  
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
            padSynthInst.trigger(freq, 3.5, t.getTime(), 0.08);
          });
        }
      }, padTime - t.getBeat());
      
      // Gentle bass (on downbeat)
      const bassTime = startBeat + bar * 4;
      t.schedule(() => {
        if (running) {
          bassSynthInst.trigger(chord[0] * 0.5, 2.0, t.getTime(), 0.2);
        }
      }, bassTime - t.getBeat());
      
      // Peaceful melody (half notes)
      if (bar % 2 === 0) {
        for (let beat = 0; beat < 4; beat += 2) {
          const noteIndex = (bar / 2 + beat / 2) % melodyNotes.length;
          const melodyTime = startBeat + bar * 4 + beat;
          t.schedule(() => {
            if (running) {
              leadSynth.trigger(melodyNotes[noteIndex], 1.8, t.getTime(), 0.15);
            }
          }, melodyTime - t.getBeat());
        }
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
      console.log('Stopping chill pattern');
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
