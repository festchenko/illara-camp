import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTelegram } from '../contexts/TelegramContext';
import { api } from '../services/api';
import { Wallet, StoreItem } from '@illara-camp/shared';

const storeItems: StoreItem[] = [
  {
    id: 'sword',
    name: 'Magic Sword',
    price: 200,
    type: 'sword',
    description: 'A powerful sword that grants special abilities'
  },
  {
    id: 'coupon5',
    name: '5% Discount Coupon',
    price: 400,
    type: 'coupon5',
    description: 'Get 5% off your next purchase'
  },
  {
    id: 'coupon10',
    name: '10% Discount Coupon',
    price: 700,
    type: 'coupon10',
    description: 'Get 10% off your next purchase'
  }
];

export const StoreScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, haptics } = useTelegram();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showCoupon, setShowCoupon] = useState<{ code: string; type: string } | null>(null);

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

  const handlePurchase = async (item: StoreItem) => {
    haptics.impactOccurred('medium');
    
    if (!wallet || wallet.balance < item.price) {
      alert('Insufficient ILL balance!');
      return;
    }

    setPurchasing(item.id);

    try {
      // Spend ILL
      await api.spendWallet(item.price, item.name);
      
      // Redeem reward
      const reward = await api.redeemReward(item.type);
      
      // Update wallet
      await loadWallet();
      
      // Show coupon code
      setShowCoupon({ code: reward.code, type: item.type });
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-xl">Loading store...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-primary-900 to-secondary-900">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-black/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Store</h1>
            <p className="text-white/80">Buy items with ILL</p>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-lg">
              {wallet?.balance || 0} ILL
            </div>
            <div className="text-white/60 text-sm">Balance</div>
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

      {/* Store items */}
      <div className="flex-1 p-4 space-y-4">
        {storeItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                <p className="text-white/80 text-sm mb-2">{item.description}</p>
                <div className="text-primary-400 font-bold">{item.price} ILL</div>
              </div>
              <button
                onClick={() => handlePurchase(item)}
                disabled={!wallet || wallet.balance < item.price || purchasing === item.id}
                className={`
                  px-4 py-2 rounded-lg font-bold transition-colors duration-200
                  ${wallet && wallet.balance >= item.price
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {purchasing === item.id ? 'Purchasing...' : 'Buy'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coupon Modal */}
      {showCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card max-w-sm w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Purchase Successful!
            </h3>
            <div className="text-center mb-4">
              <p className="text-white/80 mb-2">Your coupon code:</p>
              <div className="bg-primary-500 text-white font-mono p-3 rounded-lg break-all">
                {showCoupon.code}
              </div>
            </div>
            <button
              onClick={() => setShowCoupon(null)}
              className="btn-primary w-full"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
