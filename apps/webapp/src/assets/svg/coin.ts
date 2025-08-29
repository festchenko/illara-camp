import { colors } from '../../design/tokens';

interface IllCoinProps {
  size?: number;
  label?: string;
}

export function IllCoinSVG({ size = 64, label = 'ILL' }: IllCoinProps): string {
  const center = size / 2;
  const radius = size * 0.4;
  
  // Generate sparkle positions
  const sparkles = [
    { x: center - radius * 0.3, y: center - radius * 0.3, size: 2 },
    { x: center + radius * 0.2, y: center - radius * 0.4, size: 1.5 },
    { x: center - radius * 0.1, y: center + radius * 0.3, size: 1.8 },
    { x: center + radius * 0.4, y: center + radius * 0.1, size: 1.2 },
  ];

  const sparkleElements = sparkles.map(sparkle => 
    `<circle cx="${sparkle.x}" cy="${sparkle.y}" r="${sparkle.size}" 
             fill="${colors.secondary}" opacity="0.8"/>`
  ).join('');

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <radialGradient id="coin-gradient">
          <stop offset="0%" stop-color="${colors.secondary}"/>
          <stop offset="70%" stop-color="${colors.warning}"/>
          <stop offset="100%" stop-color="${colors.accent}"/>
        </radialGradient>
        <filter id="emboss">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
          <feOffset dx="1" dy="1" result="offset"/>
          <feFlood flood-color="${colors.ink700}" flood-opacity="0.3"/>
          <feComposite in2="offset" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Coin background -->
      <circle cx="${center}" cy="${center}" r="${radius}" 
              fill="url(#coin-gradient)" stroke="${colors.warning}" stroke-width="2"/>
      
      <!-- Inner circle for embossed effect -->
      <circle cx="${center}" cy="${center}" r="${radius - 4}" 
              fill="none" stroke="${colors.cloud50}" stroke-width="1" opacity="0.3"/>
      
      <!-- Sparkles -->
      ${sparkleElements}
      
      <!-- Embossed label -->
      <text x="${center}" y="${center + 4}" 
            text-anchor="middle" 
            font-family="Arial, sans-serif" 
            font-size="${size * 0.2}" 
            font-weight="bold" 
            fill="${colors.ink900}" 
            filter="url(#emboss)">
        ${label}
      </text>
    </svg>
  `;
}
