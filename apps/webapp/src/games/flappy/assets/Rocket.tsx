import React from 'react';
import { colors } from '../../../design/tokens';
import { SpriteProps, wrapSVG } from '../../shared/Sprite';

export const ROCKET_HITBOX = { w: 36, h: 36 };
export const DEFAULT_SIZE = 48;

export function Rocket({ size = DEFAULT_SIZE }: SpriteProps): JSX.Element {
  const center = 24;
  const rocketWidth = 20;
  const rocketHeight = 32;
  
  return wrapSVG(
    <>
      {/* Main rocket body */}
      <ellipse
        cx={center}
        cy={center}
        rx={rocketWidth / 2}
        ry={rocketHeight / 2}
        fill={colors.primary}
        stroke={colors.ink900}
        strokeWidth="1"
      />
      
      {/* Window */}
      <circle
        cx={center}
        cy={center - 4}
        r="4"
        fill={colors.cloud100}
        stroke={colors.ink900}
        strokeWidth="0.5"
      />
      
      {/* Fins */}
      <polygon
        points={`${center - rocketWidth/2 - 2},${center + rocketHeight/2 - 4} ${center - rocketWidth/2 - 6},${center + rocketHeight/2 + 4} ${center - rocketWidth/2},${center + rocketHeight/2}`}
        fill={colors.accent}
        stroke={colors.ink900}
        strokeWidth="0.5"
      />
      <polygon
        points={`${center + rocketWidth/2 + 2},${center + rocketHeight/2 - 4} ${center + rocketWidth/2 + 6},${center + rocketHeight/2 + 4} ${center + rocketWidth/2},${center + rocketHeight/2}`}
        fill={colors.accent}
        stroke={colors.ink900}
        strokeWidth="0.5"
      />
      
      {/* Flame */}
      <polygon
        points={`${center - 3},${center + rocketHeight/2} ${center},${center + rocketHeight/2 + 8} ${center + 3},${center + rocketHeight/2}`}
        fill={colors.secondary}
        stroke={colors.ink900}
        strokeWidth="0.5"
      />
    </>,
    { size }
  );
}
