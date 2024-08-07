import React, { useState } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import FamiliarCard from '../Familiar/FamiliarCard';
import './Familiar.css';

const FamiliarActions: React.FC = () => {
  const { gameState, takeTurn } = useGameState();
  const [selectedFamiliarId, setSelectedFamiliarId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleSummonFamiliar = () => {
    if (selectedFamiliarId && selectedAction) {
      takeTurn('player1', 'summonFamiliar', { familiarId: selectedFamiliarId, action: selectedAction });
      setSelectedFamiliarId(null);
      setSelectedAction(null);
    } else {
      alert('Please select a familiar and an action.');
    }
  };

  return (
    <div className="familiar-actions">
      <h2>Summon a Familiar</h2>
      <div className="familiar-cards">
        {gameState.familiarsOnOffer.map(familiar => (
          <FamiliarCard
            key={familiar.id}
            familiar={familiar}
            onSelect={() => setSelectedFamiliarId(familiar.id)}
            selected={selectedFamiliarId === familiar.id}
          />
        ))}
      </div>
      <div className="familiar-actions-buttons">
        <button onClick={() => setSelectedAction('collectGold')}>Collect Gold</button>
        <button onClick={() => setSelectedAction('gatherResourcesAndCastSpells')}>Gather Resources and Cast Spells</button>
        <button onClick={() => setSelectedAction('newResearch')}>New Research</button>
        <button onClick={() => setSelectedAction('enterDungeon')}>Enter the Dungeon</button>
      </div>
      <button onClick={handleSummonFamiliar}>Summon Familiar</button>
    </div>
  );
};

export default FamiliarActions;
