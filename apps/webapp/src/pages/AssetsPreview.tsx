import React from 'react';
import { CardIcon, CardIconName } from '../games/memory/assets/CardFace';
import { CardBack, CardFront } from '../games/memory/assets/Card';
import { Rocket, PipeBody, PipeCap, GroundTile, SkyGradient } from '../games/flappy/assets';
import { Block, DropShadow, Chip, HorizonGradient } from '../games/stack/assets';

export function AssetsPreview() {
  const cardIcons: CardIconName[] = ['tent', 'ball', 'guitar', 'star', 'rocket', 'tree', 'compass', 'swim'];

  return (
    <div className="min-h-screen bg-bg text-text p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Game Assets Preview</h1>
          <p className="text-hint">All SVG/TSX assets for Illara Camp games</p>
        </header>

        {/* Flappy Assets */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-primary">Flappy Rocket Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-2">Rocket</h3>
              <div className="flex justify-center">
                <Rocket size={64} />
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-2">Pipe Body</h3>
              <div className="flex justify-center">
                <PipeBody height={120} width={48} />
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-2">Pipe Cap</h3>
              <div className="flex justify-center">
                <PipeCap width={56} height={20} />
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-2">Ground Tile</h3>
              <div className="flex justify-center">
                <GroundTile width={160} height={40} />
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-4 col-span-full">
              <h3 className="font-semibold mb-2">Sky Background</h3>
              <div className="flex justify-center">
                <SkyGradient width={320} height={200} />
              </div>
            </div>
          </div>
        </section>

        {/* Stack Assets */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-secondary">Stack/Tower Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-2">Block</h3>
              <div className="flex justify-center">
                <Block w={120} h={16} />
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-2">Drop Shadow</h3>
              <div className="flex justify-center">
                <DropShadow w={120} />
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-2">Particle Chip</h3>
              <div className="flex justify-center">
                <Chip size={16} />
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-4 col-span-full">
              <h3 className="font-semibold mb-2">Horizon Background</h3>
              <div className="flex justify-center">
                <HorizonGradient width={320} height={200} />
              </div>
            </div>
          </div>
        </section>

        {/* Memory Assets */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-accent">Memory Match Assets</h2>
          
          {/* Card Icons */}
          <div className="bg-card rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4">Card Icons</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {cardIcons.map(icon => (
                <div key={icon} className="text-center">
                  <div className="flex justify-center mb-2">
                    <CardIcon name={icon} size={32} />
                  </div>
                  <p className="text-xs font-medium">{icon}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Card Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6">
              <h3 className="font-semibold mb-4">Card Back</h3>
              <div className="flex justify-center">
                <CardBack />
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6">
              <h3 className="font-semibold mb-4">Card Front Examples</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <CardFront icon="star" />
                  </div>
                  <p className="text-xs">Star</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <CardFront icon="rocket" />
                  </div>
                  <p className="text-xs">Rocket</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <CardFront icon="tree" />
                  </div>
                  <p className="text-xs">Tree</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <CardFront icon="compass" />
                  </div>
                  <p className="text-xs">Compass</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asset Info */}
        <section className="bg-card rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Asset Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Flappy Rocket</h3>
              <ul className="text-sm space-y-1">
                <li>• Rocket: 48px default, hitbox 36x36</li>
                <li>• Pipes: 72px width, 300px height</li>
                <li>• Ground: 256px width, zigzag pattern</li>
                <li>• Background: 360x640, starfield</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Stack/Tower</h3>
              <ul className="text-sm space-y-1">
                <li>• Block: 200x24px, gradient fill</li>
                <li>• Shadow: blurred ellipse</li>
                <li>• Particles: 8px chips for effects</li>
                <li>• Background: horizon gradient</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Memory Match</h3>
              <ul className="text-sm space-y-1">
                <li>• Cards: 72x92px, rounded corners</li>
                <li>• 8 icons: tent, ball, guitar, star, rocket, tree, compass, swim</li>
                <li>• Back: nebula gradient with stars</li>
                <li>• Front: white with centered icon</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Technical</h3>
              <ul className="text-sm space-y-1">
                <li>• All SVG with viewBox</li>
                <li>• Kid-friendly colors from tokens</li>
                <li>• No external dependencies</li>
                <li>• Touch-friendly sizes (≥44px)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
