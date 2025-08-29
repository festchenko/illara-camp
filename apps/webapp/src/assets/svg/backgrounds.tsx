import React from 'react';
import { colors } from '../../design/tokens';

interface StarfieldProps {
  width: number;
  height: number;
  density?: number;
}

interface NebulaGradientProps {
  width: number;
  height: number;
  scheme?: 'galaxy' | 'sunset' | 'ocean';
}

// Simple seeded random number generator
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

export function Starfield({ width, height, density = 0.002 }: StarfieldProps): JSX.Element {
  const random = seededRandom(12345);
  const starCount = Math.floor(width * height * density);
  
  const stars = Array.from({ length: starCount }, (_, i) => {
    const x = random() * width;
    const y = random() * height;
    const size = random() * 2 + 0.5;
    const opacity = random() * 0.8 + 0.2;
    
    return (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={size}
        fill={colors.cloud50}
        opacity={opacity}
      />
    );
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <radialGradient id="starfield-bg">
          <stop offset="0%" stopColor={colors.space1} />
          <stop offset="50%" stopColor={colors.space2} />
          <stop offset="100%" stopColor={colors.space3} />
        </radialGradient>
      </defs>
      
      <rect width={width} height={height} fill="url(#starfield-bg)" />
      {stars}
    </svg>
  );
}

export function NebulaGradient({ width, height, scheme = 'galaxy' }: NebulaGradientProps): JSX.Element {
  const gradients = {
    galaxy: {
      id: 'nebula-galaxy',
      colors: [colors.galaxy, colors.space3, colors.accent, colors.primary]
    },
    sunset: {
      id: 'nebula-sunset', 
      colors: [colors.accent, colors.warning, colors.secondary, colors.danger]
    },
    ocean: {
      id: 'nebula-ocean',
      colors: [colors.primary, colors.info, colors.success, colors.space3]
    }
  };

  const grad = gradients[scheme];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <radialGradient id={grad.id}>
          <stop offset="0%" stopColor={grad.colors[0]} stopOpacity="0.8" />
          <stop offset="30%" stopColor={grad.colors[1]} stopOpacity="0.6" />
          <stop offset="60%" stopColor={grad.colors[2]} stopOpacity="0.4" />
          <stop offset="100%" stopColor={grad.colors[3]} stopOpacity="0.2" />
        </radialGradient>
        
        <radialGradient id={`${grad.id}-2`}>
          <stop offset="0%" stopColor={grad.colors[2]} stopOpacity="0.6" />
          <stop offset="50%" stopColor={grad.colors[1]} stopOpacity="0.3" />
          <stop offset="100%" stopColor={grad.colors[0]} stopOpacity="0.1" />
        </radialGradient>
      </defs>
      
      {/* Base gradient */}
      <rect width={width} height={height} fill="url(#nebula-galaxy)" />
      
      {/* Overlay nebula clouds */}
      <ellipse
        cx={width * 0.3}
        cy={height * 0.4}
        rx={width * 0.4}
        ry={height * 0.3}
        fill="url(#nebula-galaxy-2)"
      />
      
      <ellipse
        cx={width * 0.7}
        cy={height * 0.6}
        rx={width * 0.3}
        ry={height * 0.4}
        fill="url(#nebula-galaxy-2)"
      />
    </svg>
  );
}
