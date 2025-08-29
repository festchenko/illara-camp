import React from 'react';

export type SpriteProps = { 
  size?: number; 
  className?: string; 
};

export function wrapSVG(svg: React.ReactNode, props?: SpriteProps): JSX.Element {
  const { size = 48, className = '' } = props || {};
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-hidden="true"
      className={className}
    >
      {svg}
    </svg>
  );
}
