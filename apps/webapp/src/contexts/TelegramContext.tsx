import React, { createContext, useContext, useEffect, useState } from 'react';
import { TelegramUser } from '@illara-camp/shared';

interface TelegramContextType {
  user: TelegramUser | null;
  theme: 'light' | 'dark';
  haptics: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
  };
  mainButton: {
    show: (text: string, callback: () => void) => void;
    hide: () => void;
  };
  backButton: {
    show: (callback: () => void) => void;
    hide: () => void;
  };
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: React.ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Set up theme
      setTheme(tg.colorScheme as 'light' | 'dark');
      tg.onEvent('themeChanged', () => {
        setTheme(tg.colorScheme as 'light' | 'dark');
      });

      // Get user info
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }

      // Expand the app
      tg.expand();
      tg.ready();
    }
  }, []);

  const haptics = {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
      }
    }
  };

  const mainButton = {
    show: (text: string, callback: () => void) => {
      if (window.Telegram?.WebApp?.MainButton) {
        const btn = window.Telegram.WebApp.MainButton;
        btn.text = text;
        btn.onClick(callback);
        btn.show();
      }
    },
    hide: () => {
      if (window.Telegram?.WebApp?.MainButton) {
        window.Telegram.WebApp.MainButton.hide();
      }
    }
  };

  const backButton = {
    show: (callback: () => void) => {
      if (window.Telegram?.WebApp?.BackButton) {
        const btn = window.Telegram.WebApp.BackButton;
        btn.onClick(callback);
        btn.show();
      }
    },
    hide: () => {
      if (window.Telegram?.WebApp?.BackButton) {
        window.Telegram.WebApp.BackButton.hide();
      }
    }
  };

  const value: TelegramContextType = {
    user,
    theme,
    haptics,
    mainButton,
    backButton
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};


