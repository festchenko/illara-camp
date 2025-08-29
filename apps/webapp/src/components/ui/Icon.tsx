import React from 'react';
import {
  PlayIcon,
  PauseIcon,
  BackIcon,
  LockIcon,
  TrophyIcon,
  HeartIcon,
  StarIcon,
  LightningIcon,
  RocketIcon,
  ShopIcon,
  WalletIcon,
} from '../../assets/svg/ui';
import { SwordSVG } from '../../assets/svg/sword';
import { IllCoinSVG } from '../../assets/svg/coin';

export type IconName = 
  | 'play' | 'pause' | 'back' | 'lock' | 'trophy' | 'heart' | 'star' 
  | 'lightning' | 'rocket' | 'shop' | 'wallet' | 'sword' | 'coin';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  'aria-label'?: string;
}

const iconComponents = {
  play: PlayIcon,
  pause: PauseIcon,
  back: BackIcon,
  lock: LockIcon,
  trophy: TrophyIcon,
  heart: HeartIcon,
  star: StarIcon,
  lightning: LightningIcon,
  rocket: RocketIcon,
  shop: ShopIcon,
  wallet: WalletIcon,
};

export function Icon({ name, size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  // Handle special SVG components
  if (name === 'sword') {
    return (
      <div 
        className={className}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: SwordSVG({ size }) }}
        aria-label={ariaLabel}
      />
    );
  }

  if (name === 'coin') {
    return (
      <div 
        className={className}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: IllCoinSVG({ size }) }}
        aria-label={ariaLabel}
      />
    );
  }

  // Handle React icon components
  const IconComponent = iconComponents[name];
  if (IconComponent) {
    return (
      <IconComponent 
        size={size} 
        className={className} 
        aria-label={ariaLabel}
      />
    );
  }

  // Fallback
  return (
    <div 
      className={className}
      style={{ width: size, height: size, backgroundColor: 'currentColor', borderRadius: '50%' }}
      aria-label={ariaLabel}
    />
  );
}
