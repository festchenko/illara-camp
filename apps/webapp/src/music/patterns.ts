// Musical patterns for background music presets

import { Transport } from './transport';
import { monoSynth, padSynth, bassSynth, note, CHORDS } from './instruments';

export type MusicPresetName = 'happy' | 'cosmic' | 'chill';
export type PatternFn = (ctx: AudioContext, t: Transport, out: GainNode) => { stop(): void };

// Happy pattern: cheerful and uplifting melody
export function createHappyPattern(ctx: AudioContext, t: Transport, out: GainNode): { stop(): void } {
  let running = true;
  
  // Create synths with warmer tones
  const leadSynth = monoSynth(ctx, { type: 'sine', attack: 0.02, decay: 0.15, sustain: 0.4, release: 0.2 });
  const padSynthInst = padSynth(ctx, { type: 'triangle', attack: 0.3, decay: 0.5, sustain: 0.6, release: 0.8 });
  const bassSynthInst = bassSynth(ctx, { type: 'sawtooth', lpf: 350, q: 8 });
  
  // Beautiful C major melody progression
  const melodyNotes = [
    note('C5'), note('E5'), note('G5'), note('C6'), // C major arpeggio
    note('D5'), note('F5'), note('A5'), note('C6'), // D minor
    note('E5'), note('G5'), note('B5'), note('C6'), // E minor
    note('F5'), note('A5'), note('C6'), note('C6'), // F major
  ];
  
  // Harmonious chord progression: C - Am - F - G
  const padChords = [
    [note('C3'), note('E3'), note('G3')], // C major
    [note('A3'), note('C4'), note('E4')], // A minor
    [note('F3'), note('A3'), note('C4')], // F major
    [note('G3'), note('B3'), note('D4')], // G major
  ];
  
  // Bass line with movement
  const bassNotes = [note('C3'), note('A3'), note('F3'), note('G3')];
  
  const scheduleHappy = (startBeat: number) => {
    if (!running) return;
    
    // Schedule for 8 bars
    for (let bar = 0; bar < 8; bar++) {
      const chordIndex = bar % padChords.length;
      const chord = padChords[chordIndex];
      const bassNote = bassNotes[bar % bassNotes.length];
      
      // Pad chord (whole note)
      const padTime = startBeat + bar * 4;
      t.schedule(() => {
        if (running) {
          chord.forEach((freq, i) => {
            padSynthInst.trigger(freq, 3.5, t.getTime(), 0.08);
          });
        }
      }, padTime - t.getBeat());
      
      // Bass note (on downbeat)
      const bassTime = startBeat + bar * 4;
      t.schedule(() => {
        if (running) {
          bassSynthInst.trigger(bassNote, 1.8, t.getTime(), 0.25);
        }
      }, bassTime - t.getBeat());
      
      // Melody line (quarter notes with some eighth notes)
      for (let beat = 0; beat < 4; beat++) {
        const noteIndex = (bar * 4 + beat) % melodyNotes.length;
        const melodyTime = startBeat + bar * 4 + beat;
        
        // Main melody note
        t.schedule(() => {
          if (running) {
            leadSynth.trigger(melodyNotes[noteIndex], 0.8, t.getTime(), 0.3);
          }
        }, melodyTime - t.getBeat());
        
        // Grace note on offbeat (every other beat)
        if (beat % 2 === 1) {
          const graceTime = startBeat + bar * 4 + beat - 0.25;
          t.schedule(() => {
            if (running) {
              leadSynth.trigger(melodyNotes[noteIndex] * 1.25, 0.2, t.getTime(), 0.15);
            }
          }, graceTime - t.getBeat());
        }
      }
    }
    
    // Reschedule for next 8 bars
    if (running) {
      t.schedule(() => scheduleHappy(startBeat + 32), 32);
    }
  };
  
  // Start the pattern
  scheduleHappy(t.getBeat());
  
  const stopFn = () => {
    console.log('Stopping happy pattern');
    running = false;
  };
  
  console.log('Happy pattern created, stop function:', typeof stopFn);
  
  return {
    stop: stopFn
  };
}

// Cosmic pattern: dreamy and ethereal
export function createCosmicPattern(ctx: AudioContext, t: Transport, out: GainNode): { stop(): void } {
  let running = true;
  
  // Create synths with ethereal qualities
  const padSynthInst = padSynth(ctx, { type: 'sine', attack: 0.8, decay: 1.2, sustain: 0.7, release: 1.5 });
  const leadSynth = monoSynth(ctx, { type: 'triangle', attack: 0.1, decay: 0.4, sustain: 0.6, release: 0.8 });
  const bellSynth = monoSynth(ctx, { type: 'sine', attack: 0.05, decay: 0.3, sustain: 0.2, release: 1.2 });
  
  // Dreamy chord progression: Am - Em - F - C
  const padChords = [
    [note('A3'), note('C4'), note('E4')], // Am
    [note('E3'), note('G3'), note('B3')], // Em
    [note('F3'), note('A3'), note('C4')], // F
    [note('C3'), note('E3'), note('G3')], // C
  ];
  
  // Ethereal melody with gentle movement
  const melodyNotes = [note('C5'), note('E5'), note('G5'), note('A5'), note('C6'), note('A5'), note('G5'), note('E5')];
  
  const scheduleCosmic = (startBeat: number) => {
    if (!running) return;
    
    // Schedule for 8 bars
    for (let bar = 0; bar < 8; bar++) {
      const chordIndex = bar % padChords.length;
      const chord = padChords[chordIndex];
      
      // Pad chord (whole note = 4 beats)
      const padTime = startBeat + bar * 4;
      t.schedule(() => {
        if (running) {
          chord.forEach((freq, i) => {
            padSynthInst.trigger(freq, 3.5, t.getTime(), 0.1);
          });
        }
      }, padTime - t.getBeat());
      
      // Ethereal melody (half notes)
      for (let beat = 0; beat < 4; beat += 2) {
        const noteIndex = (bar * 2 + beat / 2) % melodyNotes.length;
        const melodyTime = startBeat + bar * 4 + beat;
        t.schedule(() => {
          if (running) {
            leadSynth.trigger(melodyNotes[noteIndex], 1.5, t.getTime(), 0.25);
          }
        }, melodyTime - t.getBeat());
      }
      
      // Bell sounds on beat 1 of every other bar
      if (bar % 2 === 0) {
        const bellTime = startBeat + bar * 4;
        t.schedule(() => {
          if (running) {
            bellSynth.trigger(note('C6'), 2.0, t.getTime(), 0.15);
          }
        }, bellTime - t.getBeat());
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
