import React from 'react';
import { colors } from '../../../design/tokens';

export const DEFAULT_WIDTH = 72;
export const DEFAULT_HEIGHT = 300;
export const CAP_WIDTH = 88;
export const CAP_HEIGHT = 28;

interface PipeBodyProps {
  height?: number;
  width?: number;
}

interface PipeCapProps {
  width?: number;
  height?: number;
}

export function PipeBody({ height = DEFAULT_HEIGHT, width = DEFAULT_WIDTH }: PipeBodyProps): JSX.Element {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="pipe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.ink500} />
          <stop offset="50%" stopColor={colors.ink700} />
          <stop offset="100%" stopColor={colors.ink500} />
        </linearGradient>
      </defs>
      
      {/* Main pipe body */}
      <rect
        x="2"
        y="0"
        width={width - 4}
        height={height}
        fill="url(#pipe-gradient)"
        stroke={colors.ink900}
        strokeWidth="2"
        rx="4"
      />
      
      {/* Stripes */}
      {Array.from({ length: Math.floor(height / 40) }, (_, i) => (
        <rect
          key={i}
          x="8"
          y={i * 40 + 20}
          width={width - 16}
          height="4"
          fill={colors.ink700}
          rx="2"
        />
      ))}
    </svg>
  );
}

export function PipeCap({ width = CAP_WIDTH, height = CAP_HEIGHT }: PipeCapProps): JSX.Element {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="cap-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.ink700} />
          <stop offset="50%" stopColor={colors.ink900} />
          <stop offset="100%" stopColor={colors.ink700} />
        </linearGradient>
      </defs>
      
      {/* Cap body */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#cap-gradient)"
        stroke={colors.ink900}
        strokeWidth="2"
        rx="8"
      />
      
      {/* Cap highlight */}
      <rect
        x="4"
        y="2"
        width={width - 8}
        height={height - 4}
        fill="none"
        stroke={colors.ink500}
        strokeWidth="1"
        rx="6"
      />
    </svg>
  );
}
