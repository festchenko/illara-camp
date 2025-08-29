import React from 'react';
import { motion } from 'framer-motion';
import { Icon, IconName } from './Icon';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary active:bg-primary',
  secondary: 'bg-secondary text-ink900 hover:bg-secondary active:bg-secondary',
  ghost: 'bg-transparent text-text hover:bg-card active:bg-card border border-card'
};

const sizeStyles = {
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-3 text-base rounded-xl',
  lg: 'px-6 py-4 text-lg rounded-2xl'
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
  'aria-label': ariaLabel
}: ButtonProps) {
  const handleClick = () => {
    if (disabled || loading) return;
    
    // Trigger haptic feedback if available
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    
    onClick?.();
  };

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-colors duration-200 shadow-pop
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Left icon */}
      {icon && iconPosition === 'left' && !loading && (
        <Icon 
          name={icon} 
          size={size === 'lg' ? 20 : size === 'md' ? 18 : 16}
          aria-label=""
        />
      )}
      
      {/* Loading spinner */}
      {loading && (
        <div className="animate-spin rounded-full border-2 border-current border-t-transparent" 
             style={{ width: size === 'lg' ? 20 : size === 'md' ? 18 : 16, height: size === 'lg' ? 20 : size === 'md' ? 18 : 16 }} />
      )}
      
      {/* Content */}
      <span>{children}</span>
      
      {/* Right icon */}
      {icon && iconPosition === 'right' && !loading && (
        <Icon 
          name={icon} 
          size={size === 'lg' ? 20 : size === 'md' ? 18 : 16}
          aria-label=""
        />
      )}
    </motion.button>
  );
}
