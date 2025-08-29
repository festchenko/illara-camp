import React from 'react';
import { colors } from '../../../design/tokens';
import { CardIcon, CardIconName } from './CardFace';

export const CARD_SIZE = { w: 72, h: 92 };

interface CardBackProps {
  w?: number;
  h?: number;
}

interface CardFrontProps {
  w?: number;
  h?: number;
  icon: CardIconName;
}

export function CardBack({ w = CARD_SIZE.w, h = CARD_SIZE.h }: CardBackProps): JSX.Element {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="card-back-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.space2} />
          <stop offset="100%" stopColor={colors.galaxy} />
        </linearGradient>
      </defs>
      
      {/* Card background */}
      <rect
        x="2"
        y="2"
        width={w - 4}
        height={h - 4}
        fill="url(#card-back-gradient)"
        stroke={colors.ink900}
        strokeWidth="2"
        rx="8"
      />
      
      {/* Tiny stars */}
      {Array.from({ length: 6 }, (_, i) => {
        const x = 12 + (i % 3) * 24;
        const y = 16 + Math.floor(i / 3) * 20;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1"
            fill={colors.cloud100}
            opacity="0.6"
          />
        );
      })}
      
      {/* Card pattern */}
      <circle
        cx={w / 2}
        cy={h / 2}
        r="12"
        fill="none"
        stroke={colors.cloud100}
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}

export function CardFront({ w = CARD_SIZE.w, h = CARD_SIZE.h, icon }: CardFrontProps): JSX.Element {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="card-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={colors.ink900} floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Card background */}
      <rect
        x="2"
        y="2"
        width={w - 4}
        height={h - 4}
        fill={colors.cloud100}
        stroke={colors.ink900}
        strokeWidth="2"
        rx="8"
        filter="url(#card-shadow)"
      />
      
      {/* Icon in center */}
      <g transform={`translate(${w/2 - 12}, ${h/2 - 12})`}>
        <CardIcon name={icon} size={24} />
      </g>
    </svg>
  );
}
