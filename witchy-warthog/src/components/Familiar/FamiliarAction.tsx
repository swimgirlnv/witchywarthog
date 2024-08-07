import React, { useState, useEffect } from 'react';
import { useGameState, DungeonCard } from '../../contexts/GameStateContext';
import './Familiar.css';
import DungeonModal from '../Dungeon/DungeonModal';

interface FamiliarActionsProps {
  familiarId: string;
  onComplete: () => void;
}

const FamiliarActions: React.FC<FamiliarActionsProps> = ({ familiarId, onComplete }) => {
  const { gameState, takeTurn, drawDungeonCard, endDungeonExpedition } = useGameState();
  const [dungeonExpeditionActive, setDungeonExpeditionActive] = useState<boolean>(false);
  const [dungeonCardsDrawn, setDungeonCardsDrawn] = useState<DungeonCard[]>([]);

  useEffect(() => {
    // This ensures the dungeon expedition modal opens when dungeonExpeditionActive is true
    if (dungeonExpeditionActive) {
      console.log("Dungeon expedition active!");
    }
  }, [dungeonExpeditionActive]);

  const handleSummonFamiliar = (action: string) => {
    takeTurn('player1', 'summonFamiliar', { familiarId, action });

    if (action === 'enterDungeon') {
      setDungeonExpeditionActive(true);
    } else {
      onComplete();
    }
  };

  const handleDrawDungeonCard = () => {
    const drawnCard = drawDungeonCard('player1');
    if (drawnCard) {
      setDungeonCardsDrawn([...dungeonCardsDrawn, drawnCard]);
    }
  };

  const handleEndDungeonExpedition = () => {
    endDungeonExpedition('player1');
    setDungeonExpeditionActive(false);
    setDungeonCardsDrawn([]);
    onComplete();
  };

  const selectedFamiliar = gameState.familiarsOnOffer.find(f => f.id === familiarId);

  return (
    <div className="familiar-actions-container">
      {selectedFamiliar && (
        <>
          <div className="familiar-action-buttons">
            <h3>Choose an Action</h3>
            <button onClick={() => handleSummonFamiliar('collectGold')}>Collect Gold</button>
            <button onClick={() => handleSummonFamiliar('gatherResourcesAndCastSpells')}>Gather Resources and Cast Spells</button>
            <button onClick={() => handleSummonFamiliar('newResearch')}>New Research</button>
            <button onClick={() => handleSummonFamiliar('enterDungeon')}>Enter the Dungeon</button>
          </div>
          {dungeonExpeditionActive && (
            <DungeonModal
              dungeonCardsDrawn={dungeonCardsDrawn}
              onDrawCard={handleDrawDungeonCard}
              onEndExpedition={handleEndDungeonExpedition}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FamiliarActions;
