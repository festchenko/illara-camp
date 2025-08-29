import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTelegram } from '../contexts/TelegramContext';
import { GameHost } from '../components/GameHost';
import { api } from '../services/api';
import { flappyGame } from '../games/flappy';
import { stackGame } from '../games/stack';
import { memoryGame } from '../games/memory';
import { Game } from '@illara-camp/shared';

const games: Record<string, Game> = {
  flappy: flappyGame,
  stack: stackGame,
  memory: memoryGame,
};

export const GameScreen: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user, haptics } = useTelegram();
  const [game, setGame] = useState<Game | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedILL, setEarnedILL] = useState(0);

  useEffect(() => {
    if (gameId && games[gameId]) {
      setGame(games[gameId]);
    } else {
      navigate('/universe');
    }
  }, [gameId, navigate]);

  const handleGameResult = async (score: number) => {
    if (!user || !gameId) return;

    haptics.impactOccurred('heavy');

    // Calculate earned ILL
    const earned = Math.max(5, Math.round(score / 100));
    setEarnedILL(earned);

    try {
      // Save score
      await api.saveScore(gameId, score);
      
      // Earn ILL
      await api.earnWallet(earned, `Game: ${game?.title}`);
      
      // Show result
      setShowResult(true);
      
      // Auto-navigate back after delay
      setTimeout(() => {
        navigate('/universe');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to save result:', error);
      // Still navigate back even if save fails
      setTimeout(() => {
        navigate('/universe');
      }, 2000);
    }
  };

  const handleExit = () => {
    navigate('/universe');
  };

  if (!game) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <GameHost game={game} onExit={handleExit} onResult={handleGameResult} />
      
      {/* Result overlay */}
      {showResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="card text-center max-w-sm mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Game Complete!</h2>
            <p className="text-white/80 mb-4">
              You earned <span className="text-primary-400 font-bold">{earnedILL} ILL</span>!
            </p>
            <div className="text-white/60 text-sm">
              Returning to universe...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
