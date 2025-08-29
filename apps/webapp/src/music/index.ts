// Main music system exports
export * from './transport';
export * from './instruments';
export * from './patterns';
export * from './engine';
export * from './useMusic.tsx';

// Re-export commonly used functions
export { startPreset, stopMusic, setMusicVolume, setBpm, setDucking, notifyDuck } from './engine';
export { useMusic, MusicToggle } from './useMusic.tsx';
export type { MusicPresetName } from './patterns';
