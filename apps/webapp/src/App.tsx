import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TelegramProvider, useTelegram } from './contexts/TelegramContext';
import { api } from './services/api';
import { applyThemeVars, getThemeVars } from './design/theme';
import { UniverseScreen } from './screens/UniverseScreen';
import { StoreScreen } from './screens/StoreScreen';
import { WalletScreen } from './screens/WalletScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { GameScreen } from './screens/GameScreen';
import { Styleguide } from './pages/Styleguide';
import { AssetsPreview } from './pages/AssetsPreview';
import { AudioPreview } from './pages/AudioPreview';
import { AudioEnableBanner } from './audio/useSFX';

const AppContent: React.FC = () => {
  const { user } = useTelegram();

  useEffect(() => {
    // Apply theme on mount
    const themeVars = getThemeVars();
    applyThemeVars(themeVars);
  }, []);

  useEffect(() => {
    if (user) {
        console.log('API URL:', import.meta.env.VITE_API_URL);
  console.log('User:', user);
  console.log('App version: 1.0.1 - Database fixed!');
      
      // Authenticate with backend
      console.log('Sending auth with photo_url:', user.photo_url);
      api.authTelegram(
        user.id.toString(),
        `${user.first_name} ${user.last_name || ''}`.trim(),
        user.photo_url
      ).then(() => {
        console.log('Auth successful');
      }).catch(error => {
        console.error('Auth failed:', error);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-white mb-2">Illara Camp</h1>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/universe" element={<UniverseScreen />} />
        <Route path="/store" element={<StoreScreen />} />
        <Route path="/wallet" element={<WalletScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/play/:gameId" element={<GameScreen />} />
        <Route path="/styleguide" element={<Styleguide />} />
        <Route path="/assets" element={<AssetsPreview />} />
        <Route path="/audio" element={<AudioPreview />} />
        <Route path="/" element={<Navigate to="/universe" replace />} />
        <Route path="*" element={<Navigate to="/universe" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <TelegramProvider>
        <AppContent />
        <AudioEnableBanner />
      </TelegramProvider>
    </Router>
  );
}

export default App;
