import React, { useState } from 'react';
import { useMusic } from '../music/useMusic';
import { MusicPresetName } from '../music/patterns';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function MusicPreview() {
  const { play, stop, setVolume, setTempo, enableDucking, currentPreset, playing, volume, tempo } = useMusic();
  const [duckingEnabled, setDuckingEnabled] = useState(false);

  const presets: MusicPresetName[] = ['happy', 'cosmic', 'chill'];

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleTempoChange = (newTempo: number) => {
    setTempo(newTempo);
  };

  const handleDuckingToggle = (enabled: boolean) => {
    setDuckingEnabled(enabled);
    enableDucking(enabled);
  };

  const getPresetDescription = (name: MusicPresetName): string => {
    const descriptions: Record<MusicPresetName, string> = {
      happy: 'Upbeat arpeggio C-E-G-B with bass I-V-vi-IV progression',
      cosmic: 'Airy pad with octave jumps, Am-F-C-G chord progression',
      chill: 'Slow pad with syncopated bass, Am-Em-F-C progression',
    };
    return descriptions[name];
  };

  const getPresetIcon = (name: MusicPresetName): string => {
    const icons: Record<MusicPresetName, string> = {
      happy: '😊',
      cosmic: '🌌',
      chill: '😌',
    };
    return icons[name];
  };

  return (
    <div className="min-h-screen bg-bg text-text p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Background Music Preview</h1>
          <p className="text-hint">Test procedural music loops and controls</p>
        </header>

        {/* Music Status */}
        <Card className="bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Music Status</h2>
              <p className="text-sm text-hint">
                {playing ? (
                  <>
                    Playing: <span className="text-success font-medium capitalize">{currentPreset}</span>
                  </>
                ) : (
                  <span className="text-warning">Stopped</span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={playing ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => playing ? stop() : play('happy')}
              >
                {playing ? '⏹️ Stop' : '▶️ Start'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Music Presets */}
        <Card className="bg-card">
          <h2 className="text-lg font-semibold mb-4">Music Presets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presets.map((preset) => (
              <div
                key={preset}
                className={`
                  p-4 rounded-lg border-2 transition-all cursor-pointer
                  ${currentPreset === preset && playing
                    ? 'border-primary bg-primary/10'
                    : 'border-card hover:border-primary/50'
                  }
                `}
                onClick={() => play(preset)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{getPresetIcon(preset)}</div>
                  <h3 className="font-semibold text-lg mb-1 capitalize">{preset}</h3>
                  <p className="text-xs text-hint">{getPresetDescription(preset)}</p>
                  {currentPreset === preset && playing && (
                    <div className="mt-2 text-primary text-sm font-medium">♪ Playing</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Volume Control */}
        <Card className="bg-card">
          <h2 className="text-lg font-semibold mb-4">Volume Control</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium w-16">Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-card rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume * 100}%, var(--color-card) ${volume * 100}%, var(--color-card) 100%)`
                }}
              />
              <span className="text-sm font-mono w-12">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </Card>

        {/* Tempo Control */}
        <Card className="bg-card">
          <h2 className="text-lg font-semibold mb-4">Tempo Control</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium w-16">BPM:</span>
              <input
                type="range"
                min="60"
                max="180"
                step="1"
                value={tempo}
                onChange={(e) => handleTempoChange(parseInt(e.target.value))}
                className="flex-1 h-2 bg-card rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--color-secondary) 0%, var(--color-secondary) ${((tempo - 60) / 120) * 100}%, var(--color-card) ${((tempo - 60) / 120) * 100}%, var(--color-card) 100%)`
                }}
              />
              <span className="text-sm font-mono w-12">{tempo} BPM</span>
            </div>
          </div>
        </Card>

        {/* Ducking Control */}
        <Card className="bg-card">
          <h2 className="text-lg font-semibold mb-4">Ducking Control</h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={duckingEnabled}
                onChange={(e) => handleDuckingToggle(e.target.checked)}
                className="w-4 h-4 text-primary bg-card border-card rounded focus:ring-primary"
              />
              <span className="text-sm">Enable Ducking</span>
            </label>
            <span className="text-xs text-hint">
              (Lowers music -6dB when SFX play)
            </span>
          </div>
        </Card>

        {/* Quick Test Section */}
        <Card className="bg-card">
          <h2 className="text-lg font-semibold mb-4">Quick Test Sequences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                play('happy');
                setTimeout(() => play('cosmic'), 4000);
                setTimeout(() => play('chill'), 8000);
              }}
            >
              🎵 Preset Cycle (4s each)
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                play('happy');
                setTimeout(() => stop(), 2000);
              }}
            >
              ⏱️ Short Test (2s)
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setTempo(120);
                play('happy');
              }}
            >
              🚀 Fast Tempo (120 BPM)
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setTempo(80);
                play('chill');
              }}
            >
              🐌 Slow Tempo (80 BPM)
            </Button>
          </div>
        </Card>

        {/* Technical Info */}
        <Card className="bg-card">
          <h2 className="text-lg font-semibold mb-4">Technical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-1 text-hint">
                <li>• Procedural 12-16s music loops</li>
                <li>• Tempo-synced transport (BPM)</li>
                <li>• Quantized start/stop (bars)</li>
                <li>• Smooth fade-in/out (0.6s)</li>
                <li>• Ducking system (-6dB on SFX)</li>
                <li>• 3 presets: happy, cosmic, chill</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage</h3>
              <ul className="space-y-1 text-hint">
                <li>• <code>play('happy')</code> - Start preset</li>
                <li>• <code>stop()</code> - Stop music</li>
                <li>• <code>setVolume(0.5)</code> - Set volume</li>
                <li>• <code>setTempo(120)</code> - Set BPM</li>
                <li>• <code>enableDucking(true)</code> - Enable ducking</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
