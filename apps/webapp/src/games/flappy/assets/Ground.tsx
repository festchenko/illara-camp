import React from 'react';
import { colors } from '../../../design/tokens';

export const DEFAULT_WIDTH = 256;
export const DEFAULT_HEIGHT = 64;

interface GroundTileProps {
  width?: number;
  height?: number;
}

export function GroundTile({ width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }: GroundTileProps): JSX.Element {
  const zigzagPoints = [];
  const segmentWidth = 32;
  const segments = Math.floor(width / segmentWidth);
  
  // Generate zigzag path
  for (let i = 0; i <= segments; i++) {
    const x = i * segmentWidth;
    const y = i % 2 === 0 ? height - 8 : height - 16;
    zigzagPoints.push(`${x},${y}`);
  }
  
  const zigzagPath = `M 0,${height} L ${zigzagPoints.join(' ')} L ${width},${height} Z`;
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ground-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.accent} />
          <stop offset="100%" stopColor={colors.space2} />
        </linearGradient>
      </defs>
      
      {/* Base ground */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill={colors.space2}
        stroke={colors.ink900}
        strokeWidth="1"
      />
      
      {/* Zigzag top edge */}
      <path
        d={zigzagPath}
        fill="url(#ground-gradient)"
        stroke={colors.ink900}
        strokeWidth="1"
      />
      
      {/* Ground texture lines */}
      {Array.from({ length: Math.floor(height / 12) }, (_, i) => (
        <line
          key={i}
          x1="0"
          y1={i * 12 + 6}
          x2={width}
          y2={i * 12 + 6}
          stroke={colors.ink700}
          strokeWidth="1"
          opacity="0.3"
        />
      ))}
    </svg>
  );
}
