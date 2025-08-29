import React from 'react';
import { motion } from 'framer-motion';
import { Starfield, NebulaGradient } from '../../assets/svg/backgrounds';

interface CardProps {
  background?: 'starfield' | 'nebula' | 'solid';
  nebulaScheme?: 'galaxy' | 'sunset' | 'ocean';
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const paddingStyles = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
};

export function Card({
  background = 'solid',
  nebulaScheme = 'galaxy',
  padding = 'md',
  onClick,
  children,
  className = ''
}: CardProps) {
  const isInteractive = !!onClick;
  
  const handleClick = () => {
    if (!isInteractive) return;
    
    // Trigger haptic feedback if available
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    
    onClick();
  };

  const cardContent = (
    <div className={`${paddingStyles[padding]} relative z-10`}>
      {children}
    </div>
  );

  const backgroundElement = background === 'starfield' ? (
    <div className="absolute inset-0 -z-10">
      <Starfield width={400} height={300} density={0.003} />
    </div>
  ) : background === 'nebula' ? (
    <div className="absolute inset-0 -z-10">
      <NebulaGradient width={400} height={300} scheme={nebulaScheme} />
    </div>
  ) : null;

  const baseClasses = `
    relative overflow-hidden rounded-xl shadow-card
    ${background === 'solid' ? 'bg-card' : 'bg-transparent'}
    ${isInteractive ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (isInteractive) {
    return (
      <motion.div
        className={baseClasses}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {backgroundElement}
        {cardContent}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {backgroundElement}
      {cardContent}
    </div>
  );
}
