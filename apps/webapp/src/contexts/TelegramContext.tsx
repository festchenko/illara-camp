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
    console.log('=== Telegram WebApp Initialization ===');
    console.log('window.Telegram:', window.Telegram);
    console.log('window.Telegram?.WebApp:', window.Telegram?.WebApp);
    
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      console.log('Telegram WebApp found:', tg);
      console.log('initDataUnsafe:', tg.initDataUnsafe);
      console.log('initData:', tg.initData);
      console.log('version:', tg.version);
      console.log('platform:', tg.platform);
      
      // Set up theme
      setTheme(tg.colorScheme as 'light' | 'dark');
      tg.onEvent('themeChanged', () => {
        setTheme(tg.colorScheme as 'light' | 'dark');
      });

      // Get user info
      if (tg.initDataUnsafe?.user) {
        console.log('Setting real user from initDataUnsafe:', tg.initDataUnsafe.user);
        setUser(tg.initDataUnsafe.user);
      } else if (tg.initDataUnsafe?.start_param) {
        // Try to get user from start parameter
        console.log('Trying to get user from start_param:', tg.initDataUnsafe.start_param);
        try {
          const startParam = JSON.parse(tg.initDataUnsafe.start_param);
          if (startParam.user) {
            console.log('Found user in start_param:', startParam.user);
            setUser(startParam.user);
          } else {
            throw new Error('No user in start_param');
          }
        } catch (error) {
          console.log('Error parsing start_param:', error);
          // Continue to next method
        }
      } else if (tg.initData) {
        // Try to parse initData manually
        console.log('initData available, trying to parse...');
        console.log('Raw initData:', tg.initData);
        try {
          const urlParams = new URLSearchParams(tg.initData);
          console.log('URL params:', Object.fromEntries(urlParams.entries()));
          
          const userStr = urlParams.get('user');
          if (userStr) {
            const user = JSON.parse(decodeURIComponent(userStr));
            console.log('Parsed user from initData:', user);
            setUser(user);
          } else {
            console.log('No user in initData, checking for other user data...');
            // Try alternative ways to get user data
            const queryId = urlParams.get('query_id');
            const authDate = urlParams.get('auth_date');
            console.log('query_id:', queryId, 'auth_date:', authDate);
            
            // If we have some Telegram data but no user, it might be a bot without user info
            if (queryId || authDate) {
              console.log('Telegram data found but no user - this might be normal for some bots');
              setUser({
                id: 123456789,
                first_name: 'Telegram',
                last_name: 'User',
                username: 'telegram_user'
              });
            } else {
              setUser({
                id: 123456789,
                first_name: 'Test',
                last_name: 'User',
                username: 'testuser'
              });
            }
          }
        } catch (error) {
          console.log('Error parsing initData:', error);
          setUser({
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser'
          });
        }
      } else {
        console.log('No user data available');
        // Fallback for testing outside Telegram
        setUser({
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser'
        });
      }

      // Expand the app
      tg.expand();
      tg.ready();
    } else {
      // Fallback for testing outside Telegram
      console.log('Telegram WebApp not available, using test user');
      
      // Check if we're in Telegram by looking at the URL
      const urlParams = new URLSearchParams(window.location.search);
      const startParam = urlParams.get('start');
      const userParam = urlParams.get('user');
      const tgIdParam = urlParams.get('tg_id');
      
      if (userParam) {
        console.log('Found user parameter:', userParam);
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          if (userData.id && userData.first_name) {
            console.log('Using user from user parameter:', userData);
            setUser(userData);
            return;
          }
        } catch (error) {
          console.log('Error parsing user parameter:', error);
        }
      }
      
      if (startParam) {
        console.log('Found start parameter:', startParam);
        try {
          const userData = JSON.parse(decodeURIComponent(startParam));
          if (userData.id && userData.first_name) {
            console.log('Using user from start parameter:', userData);
            setUser(userData);
            return;
          }
        } catch (error) {
          console.log('Error parsing start parameter:', error);
        }
      }
      
      if (tgIdParam) {
        console.log('Found tg_id parameter:', tgIdParam);
        // Create a basic user object from tg_id
        setUser({
          id: parseInt(tgIdParam),
          first_name: 'Telegram',
          last_name: 'User',
          username: `user_${tgIdParam}`
        });
        return;
      }
      
      // Check if we're testing with URL parameters
      const testUrlParams = new URLSearchParams(window.location.search);
      const testUser = testUrlParams.get('test_user');
      
      if (testUser === 'true') {
        console.log('Using test user for development');
        setUser({
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser'
        });
      } else {
        console.log('No Telegram WebApp and no test mode, using fallback user');
        setUser({
          id: 999999999,
          first_name: 'Telegram',
          last_name: 'User',
          username: 'telegram_user'
        });
      }
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


