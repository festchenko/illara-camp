import React from 'react';
import { colors } from '../../../design/tokens';

export const DEFAULT_WIDTH = 360;
export const DEFAULT_HEIGHT = 640;

interface HorizonGradientProps {
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

export function HorizonGradient({ width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }: HorizonGradientProps): JSX.Element {
  const random = seededRandom(45678);
  const starCount = 12;
  
  const stars = Array.from({ length: starCount }, (_, i) => {
    const x = random() * width;
    const y = random() * height * 0.6; // Stars only in top 60%
    const size = random() * 1.5 + 0.5;
    const opacity = random() * 0.6 + 0.1;
    
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
        <linearGradient id="horizon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.space1} />
          <stop offset="40%" stopColor={colors.space2} />
          <stop offset="80%" stopColor={colors.galaxy} />
          <stop offset="100%" stopColor={colors.space3} />
        </linearGradient>
      </defs>
      
      {/* Horizon gradient */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#horizon-gradient)"
      />
      
      {/* Stars */}
      {stars}
    </svg>
  );
}
