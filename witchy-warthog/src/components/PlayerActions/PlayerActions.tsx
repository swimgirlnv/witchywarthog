import React, { useState } from 'react';
import { useGameLogic } from '../../gameLogic';
import { useGameState } from '../../contexts/GameStateContext';
import ResourceCard from '../Resource/ResourceCard';
import WizardCard from '../Wizard/WizardCard';
import SpellCard from '../Spell/SpellCard';
import './PlayerActions.css';

const PlayerActions: React.FC = () => {
  const { takeTurn } = useGameLogic();
  const { gameState } = useGameState();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [actionType, setActionType] = useState<string | null>(null);
  const [resourceToConvert, setResourceToConvert] = useState<string | null>(null);
  const [quantityToConvert, setQuantityToConvert] = useState<number>(0);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [currentWizard, setCurrentWizard] = useState<string | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [biddingActive, setBiddingActive] = useState<boolean>(false);
  const [selectedSpellId, setSelectedSpellId] = useState<string | null>(null);

  const handleResourceSelection = (resource: string) => {
    setSelectedResources(prev =>
      prev.includes(resource) ? prev.filter(r => r !== resource) : prev.length < 3 ? [...prev, resource] : prev
    );
  };

  const handleGatherResources = () => {
    if (selectedCardId && selectedResources.length === 3) {
      takeTurn('player1', 'gatherResources', { cardId: selectedCardId, selectedResources });
      setSelectedCardId(null);
      setSelectedResources([]);
      setActionType(null);
    } else {
      alert('Please select a card and exactly 3 resources.');
    }
  };

  const handleConvertResources = () => {
    if (resourceToConvert && quantityToConvert > 0) {
      takeTurn('player1', 'convertResourcesToMana', { resource: resourceToConvert, quantity: quantityToConvert });
      setResourceToConvert(null);
      setQuantityToConvert(0);
      setActionType(null);
    } else {
      alert('Please select a resource and a valid quantity to convert.');
    }
  };

  const handleRecruitWizard = (wizardId: string) => {
    setCurrentWizard(wizardId);
    setBiddingActive(true);
    setCurrentPlayerIndex(0);
    setCurrentBid(0);
  };

  const handleBid = (playerId: string, bidAmount: number) => {
    if (gameState.players[currentPlayerIndex].resources.mana < bidAmount) {
      alert('You do not have enough mana to place this bid.');
      return;
    }
    setCurrentBid(bidAmount);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % gameState.players.length);
  };

  const handlePass = () => {
    if (currentPlayerIndex === 0) {
      takeTurn('player1', 'recruitWizard', { wizardId: currentWizard, bidAmount: currentBid });
      setBiddingActive(false);
      setActionType(null);
    } else {
      setCurrentPlayerIndex((currentPlayerIndex + 1) % gameState.players.length);
    }
  };

  const handleResearchSpell = () => {
    if (selectedSpellId) {
      takeTurn('player1', 'researchSpell', { spellId: selectedSpellId });
      setSelectedSpellId(null);
      setActionType(null);
    } else {
      alert('Please select a spell to research.');
    }
  };

  const handleActionSelection = (action: string) => {
    setActionType(action);
    setSelectedCardId(null);
    setSelectedResources([]);
    setResourceToConvert(null);
    setQuantityToConvert(0);
    setSelectedSpellId(null);
  };

  return (
    <div className="player-actions">
      <h2>Choose an Action</h2>
      <div className="action-buttons">
        <button onClick={() => handleActionSelection('gatherResources')}>Gather Resources</button>
        <button onClick={() => handleActionSelection('convertResourcesToMana')}>Convert Resources to Mana</button>
        <button onClick={() => handleActionSelection('recruitWizard')}>Recruit Wizard</button>
        <button onClick={() => handleActionSelection('researchSpell')}>Research Spell</button>
      </div>

      {actionType === 'gatherResources' && (
        <>
          <h2>Choose a Resource Card</h2>
          <div className="resource-cards">
            {gameState.players[0].resourceCards.map(card => (
              <ResourceCard
                key={card.id}
                card={card}
                selected={selectedCardId === card.id}
                onSelect={() => setSelectedCardId(card.id)}
                selectedResources={selectedCardId === card.id ? selectedResources : []}
                onResourceSelect={handleResourceSelection}
              />
            ))}
          </div>
          <button onClick={handleGatherResources}>Gather Resources</button>
        </>
      )}

      {actionType === 'convertResourcesToMana' && (
        <>
          <h2>Convert Resources to Mana</h2>
          <div className="convert-resources">
            {['mandrake', 'nightshade', 'foxglove', 'toadstool', 'horn'].map(resource => (
              <button key={resource} onClick={() => setResourceToConvert(resource)}>
                {resource.charAt(0).toUpperCase() + resource.slice(1)}
              </button>
            ))}
          </div>
          {resourceToConvert && (
            <>
              <h3>Enter Quantity to Convert</h3>
              <input
                type="number"
                value={quantityToConvert}
                onChange={(e) => setQuantityToConvert(Number(e.target.value))}
                min="1"
              />
              <button onClick={handleConvertResources}>Convert</button>
            </>
          )}
        </>
      )}

      {actionType === 'recruitWizard' && (
        <>
          <h2>Recruit a Wizard</h2>
          <div className="wizards-on-offer">
            {gameState.wizardsOnOffer.map(wizard => (
              <WizardCard
                key={wizard.id}
                wizard={wizard}
                onSelect={() => handleRecruitWizard(wizard.id)}
              />
            ))}
          </div>
          {biddingActive && (
            <>
              <h3>Current Bid: {currentBid} Mana</h3>
              <h3>Current Player: {gameState.players[currentPlayerIndex].name}</h3>
              <button onClick={() => handleBid(gameState.players[currentPlayerIndex].id, currentBid + 1)}>Bid {currentBid + 1}</button>
              <button onClick={handlePass}>Pass</button>
            </>
          )}
        </>
      )}

      {actionType === 'researchSpell' && (
        <>
          <h2>Research a Spell</h2>
          <div className="spells-on-offer">
            {gameState.spellsOnOffer.map(spell => (
              <SpellCard
                key={spell.id}
                spell={spell}
                onSelect={() => setSelectedSpellId(spell.id)}
              />
            ))}
          </div>
          <button onClick={handleResearchSpell}>Research Spell</button>
        </>
      )}

      {/* Other actions */}
    </div>
  );
};

export default PlayerActions;
