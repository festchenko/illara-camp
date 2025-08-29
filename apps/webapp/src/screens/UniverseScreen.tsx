import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTelegram } from '../contexts/TelegramContext';
import { api } from '../services/api';
import { Wallet } from '@illara-camp/shared';

interface Planet {
  id: string;
  name: string;
  gameId: string;
  requiredILL: number;
  unlocked: boolean;
  color: string;
  emoji: string;
}

export const UniverseScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, haptics } = useTelegram();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  const planets: Planet[] = [
    {
      id: 'planet1',
      name: 'Terra Nova',
      gameId: 'flappy',
      requiredILL: 0,
      unlocked: true,
      color: 'from-green-400 to-green-600',
      emoji: '🚀'
    },
    {
      id: 'planet2',
      name: 'Crystal Peak',
      gameId: 'stack',
      requiredILL: 100,
      unlocked: false,
      color: 'from-blue-400 to-blue-600',
      emoji: '🏗️'
    },
    {
      id: 'planet3',
      name: 'Memory Nexus',
      gameId: 'memory',
      requiredILL: 250,
      unlocked: false,
      color: 'from-purple-400 to-purple-600',
      emoji: '🧠'
    },
    {
      id: 'planet4',
      name: 'Future World',
      gameId: 'flappy', // Placeholder for future game
      requiredILL: 500,
      unlocked: false,
      color: 'from-yellow-400 to-orange-600',
      emoji: '🌟'
    }
  ];

  useEffect(() => {
    if (user) {
      api.setTgId(user.id.toString());
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    try {
      console.log('Loading wallet for user:', user?.id);
      const walletData = await api.getWallet();
      console.log('Wallet loaded:', walletData);
      setWallet(walletData);
      
      // Update planet unlock status
      planets.forEach(planet => {
        planet.unlocked = walletData.balance >= planet.requiredILL;
      });
    } catch (error) {
      console.error('Failed to load wallet:', error);
      // Set default wallet to prevent infinite loading
      setWallet({
        balance: 0,
        lastTx: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanetClick = (planet: Planet) => {
    haptics.impactOccurred('light');
    
    if (!planet.unlocked) {
      // Show locked message
      alert(`You need ${planet.requiredILL} ILL to unlock ${planet.name}`);
      return;
    }
    
    navigate(`/play/${planet.gameId}`);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-xl">Loading universe...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-black/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Illara Camp</h1>
            <p className="text-white/80">Welcome, {user?.first_name || 'Explorer'}!</p>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-lg">
              {wallet?.balance || 0} ILL
            </div>
            <div className="text-white/60 text-sm">Balance</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-shrink-0 p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/store')}
            className="btn-primary flex-1"
          >
            Store
          </button>
          <button
            onClick={() => navigate('/wallet')}
            className="btn-secondary flex-1"
          >
            Wallet
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="btn-primary flex-1"
          >
            Profile
          </button>
        </div>
      </div>

      {/* Planets */}
      <div className="flex-1 p-4">
        <h2 className="text-xl font-bold text-white mb-4">Explore Planets</h2>
        
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {planets.map((planet, index) => (
            <motion.div
              key={planet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handlePlanetClick(planet)}
              className={`
                planet-card flex-shrink-0 w-48 h-48 flex flex-col items-center justify-center
                ${planet.unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
              `}
            >
              <div className={`text-6xl mb-2 ${planet.unlocked ? '' : 'grayscale'}`}>
                {planet.emoji}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{planet.name}</h3>
              <p className="text-white/80 text-sm text-center">
                {planet.unlocked ? 'Ready to play!' : `${planet.requiredILL} ILL required`}
              </p>
              {!planet.unlocked && (
                <div className="mt-2 text-xs text-white/60">
                  Current: {wallet?.balance || 0} ILL
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
