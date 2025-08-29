import React, { useEffect, useRef, useState } from 'react';
import { Game } from '@illara-camp/shared';
import { useTelegram } from '../contexts/TelegramContext';

interface GameHostProps {
  game: Game;
  onExit: () => void;
  onResult?: (score: number) => void;
}

export const GameHost: React.FC<GameHostProps> = ({ game, onExit, onResult }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { backButton, mainButton } = useTelegram();
  const [currentDifficulty, setCurrentDifficulty] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set up Telegram buttons
    backButton.show(() => {
      if (onResult) {
        // Get current score from the game if possible
        const currentScore = (container as any).currentScore || 0;
        if (currentScore > 0) {
          onResult(currentScore);
        }
      }
      game.unmount(container);
      onExit();
    });

    mainButton.hide();

    // Mount the game
    console.log('Container before mount:', container.clientWidth, 'x', container.clientHeight);
    game.mount(container, (score: number) => {
      // Game ended, handle result
      console.log(`Game ended with score: ${score}`);
      // Don't call onResult here - let the player decide when to finish
    });

    // Handle window resize
    const handleResize = () => {
      console.log('Window resized, container dimensions:', container.clientWidth, 'x', container.clientHeight);
    };

    // Update difficulty from container
    const updateDifficulty = () => {
      const difficulty = (container as any)?.currentDifficulty || 1;
      setCurrentDifficulty(difficulty);
    };

    // Check difficulty every second
    const difficultyInterval = setInterval(updateDifficulty, 1000);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Cleanup on unmount
    return () => {
      game.unmount(container);
      backButton.hide();
      mainButton.hide();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearInterval(difficultyInterval);
    };
  }, [game, onExit, backButton, mainButton]);

  return (
    <div className="w-full h-full flex flex-col" style={{ height: '100vh' }}>
      <div className="flex-shrink-0 p-4 bg-black/20" style={{ zIndex: 1000, position: 'relative' }}>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              console.log('Exit button clicked');
              if (onResult) {
                // Get current score from the game if possible
                const currentScore = (containerRef.current as any)?.currentScore || 0;
                console.log('Current score from container:', currentScore);
                if (currentScore > 0) {
                  console.log('Calling onResult with score:', currentScore);
                  onResult(currentScore);
                }
              }
              game.unmount(containerRef.current!);
              onExit();
            }}
            className="btn-secondary text-sm px-3 py-1 hover:bg-secondary-600 active:bg-secondary-700"
            style={{ 
              zIndex: 1001, 
              position: 'relative',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: '2px solid #7c3aed',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            ← Exit
          </button>
          <h1 className="text-xl font-bold">{game.title}</h1>
          <div className="w-16"></div> {/* Spacer */}
        </div>
        <p className="text-sm text-center text-gray-300">
          Recommended session: {game.recommendedSessionSec}s | Difficulty: {currentDifficulty}/3
        </p>
      </div>
      
      <div 
        ref={containerRef} 
        className="flex-1 w-full bg-black"
        style={{ 
          height: 'calc(100vh - 120px)', // Full viewport height minus header
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};
