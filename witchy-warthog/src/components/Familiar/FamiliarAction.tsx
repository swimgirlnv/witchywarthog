import React, { useState } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import FamiliarCard from '../Familiar/FamiliarCard';
import './Familiar.css';

const FamiliarActions: React.FC = () => {
  const { gameState, takeTurn } = useGameState();
  const [selectedFamiliarId, setSelectedFamiliarId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleSummonFamiliar = (action: string) => {
    if (selectedFamiliarId) {
      takeTurn('player1', 'summonFamiliar', { familiarId: selectedFamiliarId, action });
      setSelectedFamiliarId(null);
      setSelectedAction(null);
    } else {
      alert('Please select a familiar.');
    }
  };

  const selectedFamiliar = gameState.familiarsOnOffer.find(f => f.id === selectedFamiliarId);

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
      {selectedFamiliar && (
        <div className="familiar-action-buttons">
          <h3>Choose an Action</h3>
          <button onClick={() => handleSummonFamiliar('collectGold')}>Collect Gold</button>
          <button onClick={() => handleSummonFamiliar('gatherResourcesAndCastSpells')}>Gather Resources and Cast Spells</button>
          <button onClick={() => handleSummonFamiliar('newResearch')}>New Research</button>
          <button onClick={() => handleSummonFamiliar('enterDungeon')}>Enter the Dungeon</button>
        </div>
      )}
    </div>
  );
};

export default FamiliarActions;
