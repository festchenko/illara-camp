import React from 'react';
import { colors } from '../../../design/tokens';

export const DEFAULT_WIDTH = 360;
export const DEFAULT_HEIGHT = 640;

interface SkyGradientProps {
  width?: number;
  height?: number;
}

// Simple seeded random for consistent star positions
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

export function SkyGradient({ width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }: SkyGradientProps): JSX.Element {
  const random = seededRandom(12345);
  const starCount = 15;
  
  const stars = Array.from({ length: starCount }, (_, i) => {
    const x = random() * width;
    const y = random() * height * 0.7; // Stars only in top 70%
    const size = random() * 2 + 0.5;
    const opacity = random() * 0.8 + 0.2;
    
    return (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={size}
        fill={colors.cloud100}
        opacity={opacity}
      />
    );
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="sky-gradient" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor={colors.space1} />
          <stop offset="50%" stopColor={colors.space2} />
          <stop offset="100%" stopColor={colors.space3} />
        </radialGradient>
      </defs>
      
      {/* Sky gradient */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#sky-gradient)"
      />
      
      {/* Stars */}
      {stars}
    </svg>
  );
}
