import React from 'react';
import { planetOne, planetTwo, planetThree, planetFour } from '../../assets/svg/planets';
import { Icon } from './Icon';
import { BadgeCoin } from './BadgeCoin';

interface PlanetProps {
  variant: 1 | 2 | 3 | 4;
  size?: number;
  locked?: boolean;
  label?: string;
  costIll?: number;
  onClick?: () => void;
  className?: string;
}

const planetPresets = {
  1: planetOne,
  2: planetTwo,
  3: planetThree,
  4: planetFour,
};

export function Planet({ 
  variant, 
  size = 120, 
  locked = false, 
  label, 
  costIll, 
  onClick,
  className = ''
}: PlanetProps) {
  const planetSVG = planetPresets[variant]();

  return (
    <div 
      className={`relative inline-block ${className}`}
      onClick={locked ? undefined : onClick}
      style={{ cursor: locked ? 'not-allowed' : onClick ? 'pointer' : 'default' }}
    >
      {/* Planet SVG */}
      <div 
        className={`relative ${locked ? 'opacity-50' : ''}`}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: planetSVG }}
      />
      
      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 rounded-full p-2">
            <Icon name="lock" size={24} className="text-white" aria-label="Locked" />
          </div>
        </div>
      )}
      
      {/* Label */}
      {label && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className="text-sm font-medium text-center text-text whitespace-nowrap">
            {label}
          </span>
        </div>
      )}
      
      {/* Cost badge */}
      {costIll && (
        <div className="absolute -top-2 -right-2">
          <BadgeCoin amount={costIll} size="sm" />
        </div>
      )}
    </div>
  );
}
