import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTelegram } from '../contexts/TelegramContext';
import { api } from '../services/api';
import { Wallet, Transaction } from '@illara-camp/shared';

export const WalletScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useTelegram();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    try {
      const walletData = await api.getWallet();
      setWallet(walletData);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return '💰';
      case 'spend':
        return '💸';
      default:
        return '📊';
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-xl">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-black/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Wallet</h1>
            <p className="text-white/80">Your ILL balance & transactions</p>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-2xl">
              {wallet?.balance || 0}
            </div>
            <div className="text-white/60 text-sm">ILL Balance</div>
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

      {/* Balance card */}
      <div className="flex-shrink-0 px-4 mb-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card text-center"
        >
          <div className="text-4xl mb-2">💰</div>
          <div className="text-3xl font-bold text-white mb-1">
            {wallet?.balance || 0} ILL
          </div>
          <div className="text-white/60 text-sm">
            Available balance
          </div>
        </motion.div>
      </div>

      {/* Transactions */}
      <div className="flex-1 px-4">
        <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
        
        <div className="space-y-2">
          {wallet?.lastTx && wallet.lastTx.length > 0 ? (
            wallet.lastTx.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {tx.type === 'earn' ? 'Earned' : 'Spent'} ILL
                      </div>
                      <div className="text-white/60 text-sm">
                        {formatDate(tx.ts)}
                      </div>
                      {tx.meta && (
                        <div className="text-white/40 text-xs">
                          {(() => {
                            try {
                              const meta = JSON.parse(tx.meta);
                              return meta.reason || meta.item;
                            } catch {
                              return tx.meta;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${getTransactionColor(tx.amount)}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} ILL
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card text-center"
            >
              <div className="text-4xl mb-2">📊</div>
              <div className="text-white font-medium mb-1">No transactions yet</div>
              <div className="text-white/60 text-sm">
                Play games to earn ILL!
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
