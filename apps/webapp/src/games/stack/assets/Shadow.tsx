import React from 'react';
import { colors } from '../../../design/tokens';
import { SpriteProps } from '../../shared/Sprite';

export const DEFAULT_WIDTH = 200;

interface DropShadowProps {
  w?: number;
}

export function DropShadow({ w = DEFAULT_WIDTH }: DropShadowProps): JSX.Element {
  return (
    <svg width={w} height="16" viewBox={`0 0 ${w} 16`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      
      {/* Blurred shadow */}
      <ellipse
        cx={w / 2}
        cy="8"
        rx={w / 2 - 4}
        ry="4"
        fill={colors.ink900}
        opacity="0.4"
        filter="url(#shadow-blur)"
      />
    </svg>
  );
}
