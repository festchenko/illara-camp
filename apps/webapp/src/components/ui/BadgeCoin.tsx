import React from 'react';
import { Icon } from './Icon';

interface BadgeCoinProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const sizeConfig = {
  sm: {
    coinSize: 16,
    textSize: 'text-xs',
    padding: 'px-2 py-1',
    gap: 'gap-1'
  },
  md: {
    coinSize: 20,
    textSize: 'text-sm',
    padding: 'px-3 py-1.5',
    gap: 'gap-1.5'
  },
  lg: {
    coinSize: 24,
    textSize: 'text-base',
    padding: 'px-4 py-2',
    gap: 'gap-2'
  }
};

export function BadgeCoin({ 
  amount, 
  size = 'md', 
  onClick, 
  className = '' 
}: BadgeCoinProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={`
        inline-flex items-center ${config.gap} ${config.padding}
        bg-secondary text-ink900 font-semibold rounded-full
        shadow-soft border border-warning/20
        ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Purchase for ${amount} ILL` : `${amount} ILL`}
    >
      <Icon 
        name="coin" 
        size={config.coinSize} 
        className="flex-shrink-0"
        aria-label="ILL coin"
      />
      <span className={`${config.textSize} font-bold`}>
        {amount}
      </span>
    </div>
  );
}
