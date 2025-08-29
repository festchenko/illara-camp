// Illara Camp Design Tokens
// Kid-friendly, high-contrast color system

export const colors = {
  // Core brand (Illara v0 — tweak later)
  primary:  '#2EC4B6', // teal
  secondary:'#FFD166', // sunny yellow
  accent:   '#EF476F', // raspberry
  info:     '#118AB2', // sky blue
  success:  '#06D6A0', // green
  warning:  '#FFB703', // amber
  danger:   '#E63946', // red

  // Neutrals
  ink900:   '#0B1020',
  ink700:   '#1B2238',
  ink500:   '#2A3352',
  cloud100: '#F7FAFC',
  cloud50:  '#FFFFFF',

  // Space vibes
  space1:   '#0D1B2A',
  space2:   '#1B4965',
  space3:   '#5FA8D3',
  galaxy:   '#6C5CE7',
};

export const radii = { 
  sm: 8, 
  md: 14, 
  lg: 20, 
  xl: 28, 
  '2xl': 36 
};

export const shadows = {
  soft: '0 2px 8px rgba(0,0,0,.08)',
  card: '0 8px 24px rgba(0,0,0,.12)',
  pop:  '0 12px 36px rgba(0,0,0,.18)',
};

// Utility function to ensure contrast ratio
export function ensureContrast(fg: string, bg: string): string {
  // Simple contrast check - in production you'd use a proper color contrast library
  const getLuminance = (hex: string) => {
    const rgb = hex.match(/[A-Za-z0-9]{2}/g)?.map(v => parseInt(v, 16) / 255) || [0, 0, 0];
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  
  const fgLum = getLuminance(fg);
  const bgLum = getLuminance(bg);
  const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  
  // If contrast is too low, return a high-contrast fallback
  if (ratio < 4.5) {
    return bgLum > 0.5 ? colors.ink900 : colors.cloud50;
  }
  
  return fg;
}
