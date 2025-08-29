import { colors } from '../../design/tokens';

interface PlanetConfig {
  seed: number;
  size: number;
  ring?: boolean;
  gradient?: 'teal' | 'galaxy' | 'sun';
}

// Simple seeded random number generator
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

export function genPlanet({ seed, size, ring = false, gradient = 'teal' }: PlanetConfig): string {
  const random = seededRandom(seed);
  const center = size / 2;
  
  // Define gradients
  const gradients = {
    teal: {
      id: `planet-teal-${seed}`,
      colors: [colors.primary, colors.info, colors.success]
    },
    galaxy: {
      id: `planet-galaxy-${seed}`,
      colors: [colors.galaxy, colors.space3, colors.accent]
    },
    sun: {
      id: `planet-sun-${seed}`,
      colors: [colors.secondary, colors.warning, colors.accent]
    }
  };

  const grad = gradients[gradient];
  
  // Generate crater positions
  const craters = [];
  for (let i = 0; i < 3; i++) {
    const angle = random() * Math.PI * 2;
    const distance = random() * (size * 0.3);
    const craterSize = random() * 8 + 4;
    const x = center + Math.cos(angle) * distance;
    const y = center + Math.sin(angle) * distance;
    craters.push({ x, y, size: craterSize });
  }

  // Generate ring if requested
  const ringElements = ring ? `
    <ellipse cx="${center}" cy="${center}" rx="${size * 0.6}" ry="${size * 0.15}" 
             fill="none" stroke="${colors.space2}" stroke-width="3" opacity="0.6"/>
    <ellipse cx="${center}" cy="${center}" rx="${size * 0.55}" ry="${size * 0.12}" 
             fill="none" stroke="${colors.space3}" stroke-width="2" opacity="0.8"/>
  ` : '';

  // Generate crater elements
  const craterElements = craters.map(crater => 
    `<circle cx="${crater.x}" cy="${crater.y}" r="${crater.size}" 
             fill="${colors.ink700}" opacity="0.3"/>`
  ).join('');

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <radialGradient id="${grad.id}">
          <stop offset="0%" stop-color="${grad.colors[0]}"/>
          <stop offset="50%" stop-color="${grad.colors[1]}"/>
          <stop offset="100%" stop-color="${grad.colors[2]}"/>
        </radialGradient>
      </defs>
      
      <!-- Main planet body -->
      <circle cx="${center}" cy="${center}" r="${size * 0.4}" fill="url(#${grad.id})"/>
      
      <!-- Ring -->
      ${ringElements}
      
      <!-- Craters -->
      ${craterElements}
    </svg>
  `;
}

// Preset planets
export function planetOne(): string {
  return genPlanet({ seed: 12345, size: 120, ring: false, gradient: 'teal' });
}

export function planetTwo(): string {
  return genPlanet({ seed: 67890, size: 120, ring: true, gradient: 'galaxy' });
}

export function planetThree(): string {
  return genPlanet({ seed: 11111, size: 120, ring: false, gradient: 'sun' });
}

export function planetFour(): string {
  return genPlanet({ seed: 22222, size: 120, ring: true, gradient: 'teal' });
}
