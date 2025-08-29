import React from 'react';
import { colors } from '../../../design/tokens';
import { SpriteProps, wrapSVG } from '../../shared/Sprite';

export const DEFAULT_SIZE = 8;

export function Chip({ size = DEFAULT_SIZE }: SpriteProps): JSX.Element {
  const center = 24;
  const chipSize = 6;
  
  return wrapSVG(
    <>
      {/* Triangle shard */}
      <polygon
        points={`${center - chipSize},${center - chipSize} ${center + chipSize},${center - chipSize} ${center},${center + chipSize}`}
        fill={colors.accent}
        stroke={colors.ink900}
        strokeWidth="0.5"
      />
      
      {/* Small square chip */}
      <rect
        x={center - chipSize/2}
        y={center - chipSize/2}
        width={chipSize}
        height={chipSize}
        fill={colors.accent}
        stroke={colors.ink900}
        strokeWidth="0.5"
        rx="1"
      />
    </>,
    { size }
  );
}
