import { colors, radii, shadows, ensureContrast } from './tokens';

// Telegram WebApp theme interface
interface WebAppTheme {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

// Theme variables interface
interface ThemeVars {
  '--color-bg': string;
  '--color-text': string;
  '--color-hint': string;
  '--color-link': string;
  '--color-button': string;
  '--color-button-text': string;
  '--color-card': string;
  '--color-primary': string;
  '--color-secondary': string;
  '--color-accent': string;
  '--color-success': string;
  '--color-warning': string;
  '--color-danger': string;
  '--shadow-card': string;
  '--shadow-pop': string;
  '--radius-md': string;
  '--radius-lg': string;
  '--radius-xl': string;
  '--radius-2xl': string;
}

export function getThemeVars(tgThemeParams?: WebAppTheme): ThemeVars {
  const isDark = !tgThemeParams?.bg_color || 
    tgThemeParams.bg_color.toLowerCase() === '#000000' ||
    tgThemeParams.bg_color.toLowerCase() === '#1a1a1a';

  // Base colors from Telegram or fallbacks
  const bgColor = tgThemeParams?.bg_color || (isDark ? colors.ink900 : colors.cloud50);
  const textColor = tgThemeParams?.text_color || (isDark ? colors.cloud100 : colors.ink900);
  const hintColor = tgThemeParams?.hint_color || (isDark ? colors.ink500 : colors.ink700);
  const linkColor = tgThemeParams?.link_color || colors.primary;
  const buttonColor = tgThemeParams?.button_color || colors.primary;
  const buttonTextColor = tgThemeParams?.button_text_color || ensureContrast(colors.cloud50, buttonColor);
  const cardColor = tgThemeParams?.secondary_bg_color || (isDark ? colors.ink700 : colors.cloud100);

  return {
    '--color-bg': bgColor,
    '--color-text': ensureContrast(textColor, bgColor),
    '--color-hint': ensureContrast(hintColor, bgColor),
    '--color-link': linkColor,
    '--color-button': buttonColor,
    '--color-button-text': buttonTextColor,
    '--color-card': cardColor,
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-danger': colors.danger,
    '--shadow-card': shadows.card,
    '--shadow-pop': shadows.pop,
    '--radius-md': `${radii.md}px`,
    '--radius-lg': `${radii.lg}px`,
    '--radius-xl': `${radii.xl}px`,
    '--radius-2xl': `${radii['2xl']}px`,
  };
}

export function applyThemeVars(vars: ThemeVars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

// Hook for React components
export function useTheme() {
  const getCurrentTheme = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.themeParams) {
      return getThemeVars(window.Telegram.WebApp.themeParams);
    }
    return getThemeVars();
  };

  return { getThemeVars: getCurrentTheme };
}
