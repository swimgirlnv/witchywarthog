// src/components/PlayerActions.tsx
import React from 'react';
import { useGameLogic } from '../gameLogic';

const PlayerActions: React.FC = () => {
  const { takeTurn } = useGameLogic();

  return (
    <div>
      <button onClick={() => takeTurn('player1', 'gainResources')}>Gain Resources</button>
      <button onClick={() => takeTurn('player1', 'castSpell')}>Cast Spell</button>
      {/* Other actions */}
    </div>
  );
};

export default PlayerActions;
