import React, { useEffect } from 'react';
import { colors, radii, shadows } from '../design/tokens';
import { applyThemeVars, getThemeVars } from '../design/theme';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Planet } from '../components/ui/Planet';
import { BadgeCoin } from '../components/ui/BadgeCoin';
import { Starfield, NebulaGradient } from '../assets/svg/backgrounds';

export function Styleguide() {
  useEffect(() => {
    // Apply theme on mount
    const themeVars = getThemeVars();
    applyThemeVars(themeVars);
  }, []);

  const iconNames = [
    'play', 'pause', 'back', 'lock', 'trophy', 'heart', 'star',
    'lightning', 'rocket', 'shop', 'wallet', 'sword', 'coin'
  ] as const;

  return (
    <div className="min-h-screen bg-bg text-text p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Illara Camp Design System</h1>
          <p className="text-hint">Kid-friendly design tokens and components</p>
        </header>

        {/* Color Swatches */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(colors).map(([name, color]) => (
              <div key={name} className="text-center">
                <div 
                  className="w-full h-20 rounded-lg mb-2 border border-card"
                  style={{ backgroundColor: color }}
                />
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-hint">{color}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" icon="play">With Icon</Button>
              <Button variant="secondary" icon="wallet" iconPosition="right">Icon Right</Button>
              <Button variant="ghost" icon="star" disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <h3 className="font-semibold mb-2">Solid Card</h3>
              <p className="text-sm text-hint">Default card with solid background</p>
            </Card>
            <Card background="starfield">
              <h3 className="font-semibold mb-2 text-white">Starfield Card</h3>
              <p className="text-sm text-white/80">Card with starfield background</p>
            </Card>
            <Card background="nebula" nebulaScheme="galaxy">
              <h3 className="font-semibold mb-2 text-white">Nebula Card</h3>
              <p className="text-sm text-white/80">Card with nebula background</p>
            </Card>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Icons</h2>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
            {iconNames.map(name => (
              <div key={name} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-card rounded-lg">
                  <Icon name={name} size={24} />
                </div>
                <p className="text-xs font-medium">{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Planets */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Planets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Planet variant={1} label="Planet 1" />
            </div>
            <div className="text-center">
              <Planet variant={2} label="Planet 2" locked />
            </div>
            <div className="text-center">
              <Planet variant={3} label="Planet 3" costIll={50} />
            </div>
            <div className="text-center">
              <Planet variant={4} label="Planet 4" costIll={100} locked />
            </div>
          </div>
        </section>

        {/* Badge Coins */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Badge Coins</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <BadgeCoin amount={5} size="sm" />
            <BadgeCoin amount={25} size="md" />
            <BadgeCoin amount={100} size="lg" />
            <BadgeCoin amount={500} size="md" onClick={() => alert('Clicked!')} />
          </div>
        </section>

        {/* Backgrounds */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Backgrounds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 rounded-xl overflow-hidden">
              <Starfield width={400} height={200} density={0.005} />
            </div>
            <div className="h-48 rounded-xl overflow-hidden">
              <NebulaGradient width={400} height={200} scheme="galaxy" />
            </div>
          </div>
        </section>

        {/* Design Tokens */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Design Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Border Radius</h3>
              <div className="space-y-2">
                {Object.entries(radii).map(([name, value]) => (
                  <div key={name} className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 bg-primary rounded"
                      style={{ borderRadius: `${value}px` }}
                    />
                    <span className="text-sm">{name}: {value}px</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Shadows</h3>
              <div className="space-y-4">
                {Object.entries(shadows).map(([name, value]) => (
                  <div key={name} className="p-4 bg-card rounded-lg" style={{ boxShadow: value }}>
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
