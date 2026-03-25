import React, { useMemo, useState } from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import './Familiar.css';
import DungeonModal from '../Dungeon/DungeonModal';

interface FamiliarActionsProps {
  familiarId: string;
  paymentMethod: 'mana' | 'reagents';
  onComplete: (message: string) => void;
  onError: (message: string) => void;
}

const FamiliarActions: React.FC<FamiliarActionsProps> = ({ familiarId, paymentMethod, onComplete, onError }) => {
  const { gameState, takeTurn, drawDungeonCard, endDungeonExpedition, refreshSpellOffer } = useGameState();
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const [mode, setMode] = useState<'menu' | 'cast' | 'research'>('menu');
  const [selectedSpellIds, setSelectedSpellIds] = useState<string[]>([]);
  const [selectedResearchSpellId, setSelectedResearchSpellId] = useState<string | null>(null);
  const [dungeonExpeditionActive, setDungeonExpeditionActive] = useState(false);
  const [dungeonCardsDrawn, setDungeonCardsDrawn] = useState(currentPlayer.dungeonDrawnThisExpedition);

  const familiar = useMemo(
    () => gameState.familiarsOnOffer.find(card => card.id === familiarId),
    [gameState.familiarsOnOffer, familiarId],
  );

  const uncastSpells = currentPlayer.spells.filter(spell => !spell.isCast);

  const handleResolve = async (action: string, payload: Record<string, unknown> = {}) => {
    const result = await takeTurn(currentPlayer.id, 'summonFamiliar', { familiarId, action, paymentMethod, ...payload });
    if (!result.ok) {
      onError(result.message);
      return;
    }

    if (action === 'enterDungeon') {
      setDungeonExpeditionActive(true);
      setDungeonCardsDrawn([]);
      return;
    }

    onComplete(result.message);
  };

  const handleRefreshResearch = async () => {
    await refreshSpellOffer();
    setSelectedResearchSpellId(null);
    setMode('research');
  };

  const handleDrawDungeonCard = async () => {
    const drawnCard = await drawDungeonCard(currentPlayer.id);
    if (drawnCard) {
      setDungeonCardsDrawn(previous => [...previous, drawnCard]);
      return;
    }

    setDungeonExpeditionActive(false);
    onComplete('The familiar was defeated in the dungeon and fled empty-handed.');
  };

  const handleEndDungeonExpedition = async () => {
    await endDungeonExpedition(currentPlayer.id);
    setDungeonExpeditionActive(false);
    setDungeonCardsDrawn([]);
    onComplete('The familiar escaped the dungeon with its treasure.');
  };

  const toggleSpell = (spellId: string) => {
    setSelectedSpellIds(previous =>
      previous.includes(spellId) ? previous.filter(id => id !== spellId) : [...previous, spellId],
    );
  };

  if (!familiar) {
    return null;
  }

  return (
    <div className="familiar-actions-container">
      {mode === 'menu' && (
        <div className="familiar-action-buttons">
          <h3>Choose Familiar Action</h3>
          <button className="familiar-action-button" onClick={() => handleResolve('scoreSchool')}>
            Score School
          </button>
          <button className="familiar-action-button" onClick={() => setMode('cast')}>
            Gather and Cast
          </button>
          <button className="familiar-action-button" onClick={handleRefreshResearch}>
            New Research
          </button>
          <button className="familiar-action-button" onClick={() => handleResolve('enterDungeon')}>
            Enter the Dungeon
          </button>
        </div>
      )}

      {mode === 'cast' && (
        <div className="familiar-subpanel">
          <p>
            {familiar.name} gathers reagents, then you may cast any number of spells.
          </p>
          {uncastSpells.length === 0 && <p>No uncast spells are available. You can still use the gather effect.</p>}
          <div className="familiar-spell-list">
            {uncastSpells.map(spell => (
              <label key={spell.id} className="familiar-spell-option">
                <input
                  type="checkbox"
                  checked={selectedSpellIds.includes(spell.id)}
                  onChange={() => toggleSpell(spell.id)}
                />
                <span>{spell.name}</span>
              </label>
            ))}
          </div>
          <div className="familiar-subpanel-actions">
            <button onClick={() => setMode('menu')}>Back</button>
            <button onClick={() => handleResolve('gatherResourcesAndCastSpells', { spellIds: selectedSpellIds })}>
              Confirm Familiar
            </button>
          </div>
        </div>
      )}

      {mode === 'research' && (
        <div className="familiar-subpanel">
          <p>Pick one of the refreshed spells to gain without paying research mana.</p>
          <div className="familiar-spell-list">
            {gameState.spellsOnOffer.map(spell => (
              <label key={spell.id} className="familiar-spell-option">
                <input
                  type="radio"
                  name={`research-${familiarId}`}
                  checked={selectedResearchSpellId === spell.id}
                  onChange={() => setSelectedResearchSpellId(spell.id)}
                />
                <span>{spell.name}</span>
              </label>
            ))}
          </div>
          <div className="familiar-subpanel-actions">
            <button onClick={() => setMode('menu')}>Back</button>
            <button
              onClick={() => handleResolve('newResearch', { spellId: selectedResearchSpellId })}
              disabled={!selectedResearchSpellId}
            >
              Confirm Familiar
            </button>
          </div>
        </div>
      )}

      {dungeonExpeditionActive && (
        <DungeonModal
          dungeonCardsDrawn={dungeonCardsDrawn}
          onDrawCard={handleDrawDungeonCard}
          onEndExpedition={handleEndDungeonExpedition}
        />
      )}
    </div>
  );
};

export default FamiliarActions;
