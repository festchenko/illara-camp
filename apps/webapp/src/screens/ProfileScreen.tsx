import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTelegram } from '../contexts/TelegramContext';
import { api } from '../services/api';
import { TelegramUser } from '@illara-camp/shared';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const [ownedSword, setOwnedSword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      // In a real app, you'd fetch user's owned items
      // For now, we'll just simulate it
      setOwnedSword(Math.random() > 0.5); // Random for demo
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-primary-900 to-secondary-900">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-black/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-white/80">Your account & achievements</p>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="flex-shrink-0 p-4">
        <button
          onClick={() => navigate('/universe')}
          className="btn-secondary w-full"
        >
          ← Back to Universe
        </button>
      </div>

      {/* User info */}
      <div className="flex-1 p-4 space-y-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-3xl">
            {user?.photo_url ? (
              <img 
                src={user.photo_url} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              '👤'
            )}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {user?.first_name} {user?.last_name}
          </h2>
          {user?.username && (
            <p className="text-white/60 text-sm">@{user.username}</p>
          )}
          <div className="mt-4 text-white/80 text-sm">
            Telegram ID: {user?.id}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-white mb-3">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">3</div>
              <div className="text-white/60 text-sm">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-400">150</div>
              <div className="text-white/60 text-sm">Total Score</div>
            </div>
          </div>
        </motion.div>

        {/* Inventory */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-white mb-3">Inventory</h3>
          <div className="space-y-2">
            {ownedSword ? (
              <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="text-2xl">⚔️</div>
                <div>
                  <div className="text-white font-medium">Magic Sword</div>
                  <div className="text-white/60 text-sm">Owned</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-500/20 rounded-lg border border-gray-500/30">
                <div className="text-2xl opacity-50">⚔️</div>
                <div>
                  <div className="text-white/50 font-medium">Magic Sword</div>
                  <div className="text-white/40 text-sm">Not owned</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 p-3 bg-gray-500/20 rounded-lg border border-gray-500/30">
              <div className="text-2xl opacity-50">🎫</div>
              <div>
                <div className="text-white/50 font-medium">Coupons</div>
                <div className="text-white/40 text-sm">None owned</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-white mb-3">Achievements</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="text-white font-medium">First Steps</div>
                <div className="text-white/60 text-sm">Played your first game</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-500/20 rounded-lg border border-gray-500/30">
              <div className="text-2xl opacity-50">🌟</div>
              <div>
                <div className="text-white/50 font-medium">High Scorer</div>
                <div className="text-white/40 text-sm">Score 100+ in any game</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
