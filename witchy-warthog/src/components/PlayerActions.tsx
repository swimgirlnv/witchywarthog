// src/components/PlayerActions.tsx
import React from 'react';
import { useGameLogic } from '../gameLogic';

const PlayerActions: React.FC = () => {
  const { takeTurn } = useGameLogic();

  return (
    <div>
      <button onClick={() => takeTurn('player1', 'action1')}>Action 1</button>
      {/* Other actions */}
    </div>
  );
};

export default PlayerActions;
