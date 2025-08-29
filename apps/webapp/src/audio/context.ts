// Audio Context Singleton with mobile support
let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMutedState = false;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    // Create AudioContext with fallback for older browsers
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();
    
    // Create master gain node
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.6; // Default volume
    masterGain.connect(audioContext.destination);
  }
  return audioContext;
}

export async function resumeAudio(): Promise<void> {
  const ctx = getAudioContext();
  
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
      console.log('Audio context resumed successfully');
    } catch (error) {
      console.warn('Failed to resume audio context:', error);
    }
  }
}

export function getMasterGain(): GainNode {
  if (!masterGain) {
    getAudioContext(); // This will create masterGain
  }
  return masterGain!;
}

export function setMasterVolume(volume: number): void {
  const gain = getMasterGain();
  gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), getAudioContext().currentTime);
}

export function setMuted(muted: boolean): void {
  isMutedState = muted;
  const gain = getMasterGain();
  const targetVolume = muted ? 0 : 0.6; // Restore to default when unmuting
  gain.gain.setValueAtTime(targetVolume, getAudioContext().currentTime);
}

export function isMuted(): boolean {
  return isMutedState;
}

export function getAudioContextState(): string {
  return audioContext?.state || 'suspended';
}
