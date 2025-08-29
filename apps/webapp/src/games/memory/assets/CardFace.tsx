import React from 'react';
import { colors } from '../../../design/tokens';
import { SpriteProps, wrapSVG } from '../../shared/Sprite';

export type CardIconName = 'tent' | 'ball' | 'guitar' | 'star' | 'rocket' | 'tree' | 'compass' | 'swim';
export const DEFAULT_SIZE = 56;

interface CardIconProps {
  name: CardIconName;
  size?: number;
}

export function CardIcon({ name, size = DEFAULT_SIZE }: CardIconProps): JSX.Element {
  const center = 12;
  const iconSize = 8;
  
  const icons = {
    tent: (
      <>
        {/* Tent base */}
        <polygon
          points={`${center - iconSize},${center + 2} ${center + iconSize},${center + 2} ${center},${center - iconSize + 2}`}
          fill={colors.primary}
          stroke={colors.ink900}
          strokeWidth="1"
        />
        {/* Tent pole */}
        <line
          x1={center}
          y1={center - iconSize + 2}
          x2={center}
          y2={center + 2}
          stroke={colors.ink900}
          strokeWidth="1"
        />
      </>
    ),
    ball: (
      <>
        {/* Ball */}
        <circle
          cx={center}
          cy={center}
          r={iconSize - 1}
          fill={colors.secondary}
          stroke={colors.ink900}
          strokeWidth="1"
        />
        {/* Ball pattern */}
        <path
          d={`M ${center - iconSize + 2},${center} Q ${center},${center - iconSize + 2} ${center + iconSize - 2},${center}`}
          fill="none"
          stroke={colors.ink900}
          strokeWidth="0.5"
        />
      </>
    ),
    guitar: (
      <>
        {/* Guitar body */}
        <ellipse
          cx={center}
          cy={center + 2}
          rx={iconSize - 1}
          ry={iconSize - 3}
          fill={colors.accent}
          stroke={colors.ink900}
          strokeWidth="1"
        />
        {/* Guitar neck */}
        <rect
          x={center - 1}
          y={center - iconSize + 2}
          width="2"
          height={iconSize - 2}
          fill={colors.ink900}
        />
        {/* Strings */}
        {Array.from({ length: 3 }, (_, i) => (
          <line
            key={i}
            x1={center - iconSize + 3 + i * 2}
            y1={center - iconSize + 4}
            x2={center - iconSize + 3 + i * 2}
            y2={center + 2}
            stroke={colors.cloud100}
            strokeWidth="0.5"
          />
        ))}
      </>
    ),
    star: (
      <>
        {/* Star */}
        <polygon
          points={`${center},${center - iconSize} ${center + 2},${center - 2} ${center + iconSize},${center - 2} ${center + 3},${center} ${center + iconSize},${center + 2} ${center + 2},${center + 2} ${center},${center + iconSize} ${center - 2},${center + 2} ${center - iconSize},${center + 2} ${center - 3},${center} ${center - iconSize},${center - 2} ${center - 2},${center - 2}`}
          fill={colors.secondary}
          stroke={colors.ink900}
          strokeWidth="1"
        />
      </>
    ),
    rocket: (
      <>
        {/* Rocket body */}
        <rect
          x={center - iconSize/2}
          y={center - iconSize + 2}
          width={iconSize}
          height={iconSize}
          fill={colors.primary}
          stroke={colors.ink900}
          strokeWidth="1"
          rx="2"
        />
        {/* Rocket tip */}
        <polygon
          points={`${center},${center - iconSize + 2} ${center - 2},${center - iconSize - 2} ${center + 2},${center - iconSize - 2}`}
          fill={colors.accent}
          stroke={colors.ink900}
          strokeWidth="1"
        />
        {/* Window */}
        <circle
          cx={center}
          cy={center}
          r="2"
          fill={colors.cloud100}
          stroke={colors.ink900}
          strokeWidth="0.5"
        />
      </>
    ),
    tree: (
      <>
        {/* Tree trunk */}
        <rect
          x={center - 1}
          y={center + 2}
          width="2"
          height={iconSize - 4}
          fill={colors.ink900}
        />
        {/* Tree leaves */}
        <circle
          cx={center}
          cy={center - 2}
          r={iconSize - 2}
          fill={colors.success}
          stroke={colors.ink900}
          strokeWidth="1"
        />
      </>
    ),
    compass: (
      <>
        {/* Compass circle */}
        <circle
          cx={center}
          cy={center}
          r={iconSize - 1}
          fill={colors.cloud100}
          stroke={colors.ink900}
          strokeWidth="1"
        />
        {/* Compass needle */}
        <line
          x1={center}
          y1={center - iconSize + 2}
          x2={center}
          y2={center + iconSize - 2}
          stroke={colors.accent}
          strokeWidth="1.5"
        />
        <line
          x1={center - iconSize + 2}
          y1={center}
          x2={center + iconSize - 2}
          y2={center}
          stroke={colors.primary}
          strokeWidth="1.5"
        />
        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="1"
          fill={colors.ink900}
        />
      </>
    ),
    swim: (
      <>
        {/* Water waves */}
        <path
          d={`M ${center - iconSize},${center} Q ${center - iconSize/2},${center - 2} ${center},${center} Q ${center + iconSize/2},${center + 2} ${center + iconSize},${center}`}
          fill="none"
          stroke={colors.info}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d={`M ${center - iconSize},${center + 3} Q ${center - iconSize/2},${center + 1} ${center},${center + 3} Q ${center + iconSize/2},${center + 5} ${center + iconSize},${center + 3}`}
          fill="none"
          stroke={colors.info}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    )
  };

  return wrapSVG(
    icons[name],
    { size }
  );
}
