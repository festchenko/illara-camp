import { colors } from '../../design/tokens';

interface SwordProps {
  size?: number;
}

export function SwordSVG({ size = 64 }: SwordProps): string {
  const center = size / 2;
  const bladeWidth = size * 0.08;
  const bladeLength = size * 0.6;
  const guardWidth = size * 0.25;
  const handleLength = size * 0.2;
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="blade-gradient">
          <stop offset="0%" stop-color="${colors.primary}"/>
          <stop offset="100%" stop-color="${colors.info}"/>
        </linearGradient>
        <linearGradient id="handle-gradient">
          <stop offset="0%" stop-color="${colors.accent}"/>
          <stop offset="100%" stop-color="${colors.danger}"/>
        </linearGradient>
      </defs>
      
      <!-- Blade -->
      <rect x="${center - bladeWidth/2}" y="${size * 0.1}" 
            width="${bladeWidth}" height="${bladeLength}" 
            fill="url(#blade-gradient)" 
            rx="${bladeWidth/2}"/>
      
      <!-- Blade tip -->
      <polygon points="${center - bladeWidth/2},${size * 0.1 + bladeLength} ${center + bladeWidth/2},${size * 0.1 + bladeLength} ${center},${size * 0.9}" 
               fill="url(#blade-gradient)"/>
      
      <!-- Guard -->
      <rect x="${center - guardWidth/2}" y="${size * 0.1 + bladeLength - 2}" 
            width="${guardWidth}" height="4" 
            fill="${colors.secondary}" 
            rx="2"/>
      
      <!-- Handle -->
      <rect x="${center - bladeWidth/2}" y="${size * 0.1 + bladeLength + 2}" 
            width="${bladeWidth}" height="${handleLength}" 
            fill="url(#handle-gradient)" 
            rx="${bladeWidth/2}"/>
      
      <!-- Handle pommel -->
      <circle cx="${center}" cy="${size * 0.1 + bladeLength + 2 + handleLength + 6}" 
              r="6" fill="${colors.accent}"/>
    </svg>
  `;
}
