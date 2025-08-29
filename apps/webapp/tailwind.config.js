/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors using CSS variables
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
        hint: 'var(--color-hint)',
        link: 'var(--color-link)',
        button: 'var(--color-button)',
        'button-text': 'var(--color-button-text)',
        card: 'var(--color-card)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        
        // Legacy color support
        ink900: '#0B1020',
        ink700: '#1B2238',
        ink500: '#2A3352',
        cloud100: '#F7FAFC',
        cloud50: '#FFFFFF',
        space1: '#0D1B2A',
        space2: '#1B4965',
        space3: '#5FA8D3',
        galaxy: '#6C5CE7',
      },
      borderRadius: {
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      }
    },
  },
  plugins: [],
}
