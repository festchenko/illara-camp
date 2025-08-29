import React, { useCallback, useEffect, useState } from 'react';
import { startPreset, stopMusic, setMusicVolume, setBpm, setDucking, getCurrentPreset, isMusicPlaying, getMusicVolume, getBpm } from './engine';
import { MusicPresetName } from './patterns';

export function useMusic() {
  const [currentPreset, setCurrentPreset] = useState<MusicPresetName | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.35);
  const [tempo, setTempoState] = useState(96);

  // Update state periodically
  useEffect(() => {
    const updateState = () => {
      setCurrentPreset(getCurrentPreset());
      setPlaying(isMusicPlaying());
      setVolumeState(getMusicVolume());
      setTempoState(getBpm());
    };

    updateState();
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, []);

  const play = useCallback((name: MusicPresetName) => {
    startPreset(name);
  }, []);

  const stop = useCallback((immediate: boolean = false) => {
    stopMusic(immediate);
  }, []);

  const setVolume = useCallback((v: number) => {
    setMusicVolume(v);
  }, []);

  const setTempo = useCallback((bpm: number) => {
    setBpm(bpm);
  }, []);

  const enableDucking = useCallback((on: boolean) => {
    setDucking(on);
  }, []);

  return {
    play,
    stop,
    setVolume,
    setTempo,
    enableDucking,
    currentPreset,
    playing,
    volume,
    tempo,
  };
}

// Music toggle button component
export function MusicToggle() {
  const { play, stop, playing, currentPreset } = useMusic();

  const handleToggle = () => {
    if (playing) {
      stop(true); // Immediate stop
    } else {
      play('happy'); // Default to happy preset
    }
  };

  return (
    <button
      onClick={handleToggle}
          className={`
      fixed top-4 right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center
      transition-all duration-200 shadow-pop
      ${playing 
        ? 'bg-primary text-white hover:bg-primary' 
        : 'bg-card text-hint hover:bg-card border border-card'
      }
    `}
      title={playing ? 'Stop Music' : 'Start Music'}
    >
      <span className="text-lg">
        {playing ? '♪' : '♫'}
      </span>
    </button>
  );
}
