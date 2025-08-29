import React, { useCallback, useEffect, useState } from 'react';
import { playSfx, setGlobalSfxVolume, SfxName } from './engine';
import { resumeAudio, isMuted, setMuted, getAudioContextState } from './context';

export function useSFX() {
  const [audioState, setAudioState] = useState<string>('suspended');
  const [muted, setMutedState] = useState<boolean>(false);

  // Update audio state
  useEffect(() => {
    const updateState = () => {
      setAudioState(getAudioContextState());
      setMutedState(isMuted());
    };

    updateState();
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, []);

  const play = useCallback((name: SfxName, opts?: { volume?: number }) => {
    playSfx(name, opts);
  }, []);

  const enable = useCallback(async () => {
    await resumeAudio();
    setAudioState(getAudioContextState());
  }, []);

  const mute = useCallback((m: boolean) => {
    setMuted(m);
    setMutedState(m);
  }, []);

  const setVolume = useCallback((v: number) => {
    setGlobalSfxVolume(v);
  }, []);

  return {
    play,
    enable,
    mute,
    setVolume,
    muted,
    audioState,
  };
}

// Audio enable banner component
export function AudioEnableBanner() {
  const { audioState, enable } = useSFX();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner if audio is suspended and user hasn't dismissed it
    if (audioState === 'suspended' && !localStorage.getItem('audio-banner-dismissed')) {
      setShowBanner(true);
    }
  }, [audioState]);

  const handleEnable = async () => {
    await enable();
    setShowBanner(false);
    localStorage.setItem('audio-banner-dismissed', 'true');
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('audio-banner-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-card border border-card rounded-xl p-4 shadow-pop">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🔊</span>
          </div>
          <div>
            <p className="text-sm font-medium text-text">Enable Sound</p>
            <p className="text-xs text-hint">Tap to enable audio effects</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEnable}
            className="px-3 py-1 bg-primary text-white text-sm rounded-lg font-medium"
          >
            Enable
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-1 bg-transparent text-hint text-sm rounded-lg"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
