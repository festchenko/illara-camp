import React from 'react';
import { colors } from '../../design/tokens';

interface IconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
}

// Play Icon
export function PlayIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

// Pause Icon
export function PauseIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

// Back Icon
export function BackIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

// Lock Icon
export function LockIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <circle cx="12" cy="16" r="1" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// Trophy Icon
export function TrophyIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 1.1.9 2 2 2s2-.9 2-2v-2.34" />
      <path d="M12 14.66V9c0-1.1-.9-2-2-2H8" />
      <path d="M12 14.66V9c0-1.1.9-2 2-2h2" />
    </svg>
  );
}

// Heart Icon
export function HeartIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// Star Icon
export function StarIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

// Lightning Icon
export function LightningIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
    </svg>
  );
}

// Rocket Icon
export function RocketIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

// Shop Icon
export function ShopIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}

// Wallet Icon
export function WalletIcon({ size = 24, className = '', 'aria-label': ariaLabel }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
         className={className} aria-label={ariaLabel}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 7v12a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0-2 2v4h4v-4a2 2 0 0 0-2-2z" />
    </svg>
  );
}
