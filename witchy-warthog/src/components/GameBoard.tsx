// src/components/GameBoard.tsx
import React from 'react';
import { useGameState } from '../contexts/GameStateContext';

const GameBoard: React.FC = () => {
  const { gameState } = useGameState();

  return (
    <div>
      {/* Render game state */}
    </div>
  );
};

export default GameBoard;
