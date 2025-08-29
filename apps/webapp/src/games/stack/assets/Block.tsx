import React from 'react';
import { colors } from '../../../design/tokens';

export const DEFAULT_WIDTH = 200;
export const DEFAULT_HEIGHT = 24;

interface BlockProps {
  w?: number;
  h?: number;
}

export function Block({ w = DEFAULT_WIDTH, h = DEFAULT_HEIGHT }: BlockProps): JSX.Element {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="block-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.primary} />
        </linearGradient>
        <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor={colors.ink900} floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Main block */}
      <rect
        x="2"
        y="2"
        width={w - 4}
        height={h - 4}
        fill="url(#block-gradient)"
        stroke={colors.ink900}
        strokeWidth="2"
        rx="4"
        filter="url(#inner-shadow)"
      />
      
      {/* Highlight edge */}
      <rect
        x="4"
        y="4"
        width={w - 8}
        height="2"
        fill={colors.cloud100}
        opacity="0.3"
        rx="1"
      />
    </svg>
  );
}
