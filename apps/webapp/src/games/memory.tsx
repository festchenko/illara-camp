import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '@illara-camp/shared';
import { playSfx } from '../audio/engine';
import { CardIcon, CardIconName } from './memory/assets/CardFace';

interface Card {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onResult: (score: number) => void;
}

const MemoryGameComponent: React.FC<MemoryGameProps> = ({ onResult }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [canFlip, setCanFlip] = useState(true);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    const gameCards = [...values, ...values].map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setCanFlip(true);
  };

  const handleCardClick = useCallback((cardId: number) => {
    if (!canFlip || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    // Check for match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setCanFlip(false);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found
        setCards(prev => prev.map(c => 
          c.id === firstId || c.id === secondId 
            ? { ...c, isMatched: true }
            : c
        ));
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
        setCanFlip(true);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  }, [cards, flippedCards, canFlip]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === 8) {
      setTimeout(() => {
        onResult(matchedPairs);
      }, 1000);
    }
  }, [matchedPairs, onResult]);

  const getCardIcon = (value: number): CardIconName => {
    const icons: CardIconName[] = ['tent', 'ball', 'guitar', 'star', 'rocket', 'tree', 'compass', 'swim'];
    return icons[value - 1] || 'star';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Memory Match</h2>
        <p className="text-white/80">Pairs Found: {matchedPairs}/8</p>
      </div>
      
      <div className="grid grid-cols-4 gap-2 max-w-sm">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              w-16 h-16 rounded-lg cursor-pointer transition-all duration-300 transform
              ${card.isFlipped || card.isMatched 
                ? 'rotate-y-180 bg-white' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105'
              }
              ${card.isMatched ? 'opacity-50' : ''}
            `}
            style={{
              transformStyle: 'preserve-3d',
              transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              {(card.isFlipped || card.isMatched) && (
                <div 
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: getCardColor(card.value) }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {matchedPairs === 8 && (
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-green-400">Congratulations!</h3>
          <p className="text-white/80">You found all pairs!</p>
        </div>
      )}
    </div>
  );
};

export const memoryGame: Game = {
  id: 'memory',
  title: 'Memory Match',
  engine: 'vanilla',
  recommendedSessionSec: 60,
  difficulty: 1,
  
  mount(container: HTMLElement, onResult: (score: number) => void) {
    const gameElement = document.createElement('div');
    gameElement.className = 'w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 to-blue-900';
    container.appendChild(gameElement);
    
    // Game state
    let cards: Array<{id: number, value: number, isFlipped: boolean, isMatched: boolean}> = [];
    let flippedCards: number[] = [];
    let matchedPairs = 0;
    let canFlip = true;
    
    const getCardColor = (value: number) => {
      const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
        '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
      ];
      return colors[value - 1] || '#666';
    };
    
    const initializeGame = () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8];
      cards = [...values, ...values].map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
      
      // Shuffle
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      
      flippedCards = [];
      matchedPairs = 0;
      canFlip = true;
      renderGame();
    };
    
    const renderGame = () => {
      gameElement.innerHTML = `
        <div class="mb-4 text-center">
          <h2 class="text-2xl font-bold text-white mb-2">Memory Match</h2>
          <p class="text-white/80">Pairs Found: ${matchedPairs}/8</p>
        </div>
        <div class="grid grid-cols-4 gap-2 max-w-sm">
          ${cards.map(card => `
            <div 
              class="w-16 h-16 rounded-lg cursor-pointer transition-all duration-300 transform ${
                card.isFlipped || card.isMatched 
                  ? 'bg-white' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105'
              } ${card.isMatched ? 'opacity-50' : ''}"
              data-card-id="${card.id}"
              style="transform: ${card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'}"
            >
              <div class="w-full h-full flex items-center justify-center">
                ${(card.isFlipped || card.isMatched) ? 
                  `<div class="w-8 h-8 rounded-full" style="background-color: ${getCardColor(card.value)}"></div>` 
                  : ''
                }
              </div>
            </div>
          `).join('')}
        </div>
        ${matchedPairs === 8 ? `
          <div class="mt-4 text-center">
            <h3 class="text-xl font-bold text-green-400">Congratulations!</h3>
            <p class="text-white/80">You found all pairs!</p>
          </div>
        ` : ''}
      `;
      
      // Add click handlers
      gameElement.querySelectorAll('[data-card-id]').forEach(element => {
        element.addEventListener('click', (e) => {
          const cardId = parseInt((e.currentTarget as HTMLElement).dataset.cardId!);
          handleCardClick(cardId);
        });
      });
    };
    
    const handleCardClick = (cardId: number) => {
      if (!canFlip || flippedCards.length >= 2) return;
      
      const card = cards.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return;

      const newFlippedCards = [...flippedCards, cardId];
      flippedCards = newFlippedCards;

      // Flip the card
      card.isFlipped = true;
      renderGame();

      // Check for match if two cards are flipped
      if (newFlippedCards.length === 2) {
        canFlip = false;
        
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard && secondCard && firstCard.value === secondCard.value) {
          // Match found
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          matchedPairs++;
          flippedCards = [];
          canFlip = true;
          renderGame();
          
          if (matchedPairs === 8) {
            setTimeout(() => onResult(matchedPairs), 1000);
          }
        } else {
          // No match, flip back after delay
          setTimeout(() => {
            firstCard!.isFlipped = false;
            secondCard!.isFlipped = false;
            flippedCards = [];
            canFlip = true;
            renderGame();
          }, 1000);
        }
      }
    };
    
    initializeGame();
    
    // Store cleanup function
    (container as any).memoryGame = {
      destroy: () => {
        container.removeChild(gameElement);
      }
    };
  },
  
  unmount() {
    const game = (container as any).memoryGame;
    if (game) {
      game.destroy();
    }
  }
};
