import React, { useState } from 'react';
import { useSFX } from '../audio/useSFX.tsx';
import { SfxName } from '../audio/engine';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function AudioPreview() {
  const { play, enable, mute, setVolume, muted, audioState } = useSFX();
  const [masterVolume, setMasterVolume] = useState(0.6);

  const sfxList: SfxName[] = [
    'tap', 'point', 'fail', 'win', 'unlock', 'hit', 'jump', 'stack', 'flip', 'match'
  ];

  const handleVolumeChange = (volume: number) => {
    setMasterVolume(volume);
    setVolume(volume);
  };

  const handleEnableAudio = async () => {
    await enable();
  };

  const handleMuteToggle = () => {
    mute(!muted);
  };

  const getSfxDescription = (name: SfxName): string => {
    const descriptions: Record<SfxName, string> = {
      tap: 'Short sine blip (440→660Hz)',
      point: 'Triangle with delay (660→990Hz)',
      fail: 'Sawtooth glide down + noise',
      win: 'Major triad arpeggio with reverb',
      unlock: 'Square bend up + sparkle',
      hit: 'Noise burst with LPF sweep',
      jump: 'Sine quick up (440→700Hz)',
      stack: 'Saw + click (240Hz + 2kHz)',
      flip: 'Soft triangle down (500→450Hz)',
      match: 'Two-note success (660Hz + 880Hz)',
    };
    return descriptions[name];
  };

  const getSfxIcon = (name: SfxName): string => {
    const icons: Record<SfxName, string> = {
      tap: '👆',
      point: '⭐',
      fail: '💥',
      win: '🎉',
      unlock: '🔓',
      hit: '💢',
      jump: '🦘',
      stack: '📦',
      flip: '🔄',
      match: '✅',
    };
    return icons[name];
  };

  return (
    <div className="min-h-screen bg-bg text-text p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Audio SFX Preview</h1>
          <p className="text-hint">Test all sound effects and audio controls</p>
        </header>

        {/* Audio Status */}
        <Card className="bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Audio Status</h2>
              <p className="text-sm text-hint">
                Context: <span className={`font-mono ${audioState === 'running' ? 'text-success' : 'text-warning'}`}>
                  {audioState}
                </span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={muted ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleMuteToggle}
              >
                {muted ? '🔇 Unmute' : '🔊 Mute'}
              </Button>
              {audioState === 'suspended' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEnableAudio}
                >
                  🔊 Enable Audio
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Master Volume Control */}
        <Card className="bg-card">
          <h2 className="text-lg font-semibold mb-4">Master Volume</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium w-16">Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-card rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${masterVolume * 100}%, var(--color-card) ${masterVolume * 100}%, var(--color-card) 100%)`
                }}
              />
              <span className="text-sm font-mono w-12">{Math.round(masterVolume * 100)}%</span>
            </div>
          </div>
        </Card>

        {/* SFX Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sfxList.map((sfxName) => (
            <Card
              key={sfxName}
              className="bg-card hover:bg-card/80 transition-colors cursor-pointer"
              onClick={() => play(sfxName)}
            >
              <div className="text-center p-4">
                <div className="text-3xl mb-2">{getSfxIcon(sfxName)}</div>
                <h3 className="font-semibold text-lg mb-1 capitalize">{sfxName}</h3>
                <p className="text-xs text-hint">{getSfxDescription(sfxName)}</p>
                <div className="mt-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      play(sfxName);
                    }}
                  >
                    Play
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Test Section */}
        <Card className="bg-card">
          <h2 className="text-lg font-semibold mb-4">Quick Test Sequences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              onClick={() => {
                play('tap');
                setTimeout(() => play('point'), 200);
                setTimeout(() => play('win'), 400);
              }}
            >
              🎮 Game Success Sequence
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                play('tap');
                setTimeout(() => play('fail'), 200);
              }}
            >
              💥 Game Fail Sequence
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                play('unlock');
                setTimeout(() => play('win'), 300);
              }}
            >
              🎁 Unlock + Win
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                play('flip');
                setTimeout(() => play('match'), 200);
              }}
            >
              🃏 Memory Match
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
                <li>• WebAudio API with no external files</li>
                <li>• Mobile-friendly (resume on first tap)</li>
                <li>• ADSR envelopes for natural sounds</li>
                <li>• Delay and reverb effects</li>
                <li>• Haptic feedback integration</li>
                <li>• Per-SFX volume control</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage</h3>
              <ul className="space-y-1 text-hint">
                <li>• Buttons: <code>play('tap')</code></li>
                <li>• Success: <code>play('win')</code></li>
                <li>• Error: <code>play('fail')</code></li>
                <li>• Unlock: <code>play('unlock')</code></li>
                <li>• Game events: <code>play('point')</code></li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
