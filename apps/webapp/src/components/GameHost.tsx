import React, { useEffect, useRef } from 'react';
import { Game } from '@illara-camp/shared';
import { useTelegram } from '../contexts/TelegramContext';

interface GameHostProps {
  game: Game;
  onExit: () => void;
}

export const GameHost: React.FC<GameHostProps> = ({ game, onExit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { backButton, mainButton } = useTelegram();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set up Telegram buttons
    backButton.show(() => {
      game.unmount();
      onExit();
    });

    mainButton.hide();

    // Mount the game
    game.mount(container, (score: number) => {
      // Game ended, handle result
      console.log(`Game ended with score: ${score}`);
      game.unmount();
      onExit();
    });

    // Cleanup on unmount
    return () => {
      game.unmount();
      backButton.hide();
      mainButton.hide();
    };
  }, [game, onExit, backButton, mainButton]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 p-4 bg-black/20">
        <h1 className="text-xl font-bold text-center">{game.title}</h1>
        <p className="text-sm text-center text-gray-300">
          Recommended session: {game.recommendedSessionSec}s | Difficulty: {game.difficulty}/3
        </p>
      </div>
      
      <div 
        ref={containerRef} 
        className="flex-1 w-full bg-black"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};
