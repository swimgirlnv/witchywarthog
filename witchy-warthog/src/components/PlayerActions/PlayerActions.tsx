import React, { useState } from 'react';
import { useGameLogic } from '../../gameLogic';
import { useGameState } from '../../contexts/GameStateContext';
import ResourceCard from '../Resource/ResourceCard';
import WizardCard from '../Wizard/WizardCard';
import SpellCard from '../Spell/SpellCard';
import TowerCard from '../Tower/TowerCard';
import FamiliarCard from '../Familiar/FamiliarCard';
import './PlayerActions.css';
import FamiliarActions from '../Familiar/FamiliarAction';
import ErrorModal from '../ErrorModal/ErrorModal';

const REAGENTS = ['mandrake', 'nightshade', 'foxglove', 'toadstool', 'horn'] as const;
const REAGENT_LABELS: Record<string, string> = {
  mandrake: 'Mandrake', nightshade: 'Nightshade', foxglove: 'Foxglove',
  toadstool: 'Toadstool', horn: 'Horn',
};

const PlayerActions: React.FC = () => {
  const { takeTurn, errorMessage, closeErrorModal } = useGameLogic();
  const { gameState, endTurn } = useGameState();
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const [actionType, setActionType] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState(false);

  // Gather
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Convert
  const [resourceToConvert, setResourceToConvert] = useState<string | null>(null);
  const [quantityToConvert, setQuantityToConvert] = useState<number>(1);

  // Recruit wizard
  const [currentWizardId, setCurrentWizardId] = useState<string | null>(null);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [biddingActive, setBiddingActive] = useState<boolean>(false);

  // Research / tower
  const [selectedSpellId, setSelectedSpellId] = useState<string | null>(null);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [selectedFamiliarId, setSelectedFamiliarId] = useState<string | null>(null);

  const [localError, setLocalError] = useState<string | null>(null);

  const reset = () => {
    setActionType(null); setActionDone(false);
    setSelectedCardId(null); setResourceToConvert(null); setQuantityToConvert(1);
    setCurrentWizardId(null); setCurrentBid(0); setBiddingActive(false);
    setSelectedSpellId(null); setSelectedTowerId(null); setSelectedFamiliarId(null);
  };

  const handleSelectAction = (action: string) => { reset(); setActionType(action); };

  const completeAction = () => setActionDone(true);

  // --- Gather ---
  const handleGather = (cardId: string) => {
    takeTurn(currentPlayer.id, 'gatherResources', { cardId });
    completeAction();
  };

  // --- Convert ---
  const trackValue = resourceToConvert ? (gameState.resources as unknown as Record<string, number>)[resourceToConvert] ?? 1 : 0;
  const manaPreview = quantityToConvert * trackValue;

  const handleConvert = () => {
    if (!resourceToConvert || quantityToConvert < 1) { setLocalError('Select a reagent and quantity.'); return; }
    const have = (currentPlayer.resources as unknown as Record<string, number>)[resourceToConvert] ?? 0;
    if (quantityToConvert > have) { setLocalError(`You only have ${have} ${REAGENT_LABELS[resourceToConvert]}.`); return; }
    takeTurn(currentPlayer.id, 'convertResourcesToMana', { resource: resourceToConvert, quantity: quantityToConvert });
    completeAction();
  };

  // --- Recruit wizard ---
  const handleSelectWizard = (wizardId: string) => {
    setCurrentWizardId(wizardId); setCurrentBid(0); setBiddingActive(true);
  };
  const handleBid = () => {
    const newBid = currentBid + 1;
    if (currentPlayer.resources.mana < newBid) { setLocalError('Not enough mana to bid.'); return; }
    setCurrentBid(newBid);
  };
  const handleConfirmRecruit = () => {
    if (!currentWizardId) { setLocalError('Select a wizard first.'); return; }
    if (currentBid === 0) { setLocalError('You must bid at least 1 mana.'); return; }
    takeTurn(currentPlayer.id, 'recruitWizard', { wizardId: currentWizardId, bidAmount: currentBid });
    completeAction();
  };

  // --- Research spell ---
  const handleResearchSpell = () => {
    if (!selectedSpellId) { setLocalError('Select a spell first.'); return; }
    const spell = gameState.spellsOnOffer.find(s => s.id === selectedSpellId);
    if (spell && currentPlayer.resources.mana < spell.manaCost) {
      setLocalError(`Need ${spell.manaCost} mana. You have ${currentPlayer.resources.mana}.`); return;
    }
    takeTurn(currentPlayer.id, 'researchSpell', { spellId: selectedSpellId });
    completeAction();
  };

  // --- Create tower ---
  const handleCreateTower = () => {
    if (!selectedTowerId) { setLocalError('Select a tower first.'); return; }
    takeTurn(currentPlayer.id, 'createTower', { towerId: selectedTowerId });
    completeAction();
  };

  // --- Summon familiar ---
  const handleFamiliarActionComplete = () => completeAction();

  const carryLimit = 10 + currentPlayer.towers.length;
  const reagentTotal = REAGENTS.reduce((s, r) => s + currentPlayer.resources[r], 0);

  if (actionDone) {
    return (
      <div className="player-actions action-done">
        <p className="action-done-msg">Action complete!</p>
        <button className="end-turn-btn" onClick={() => { reset(); endTurn(); }}>End Turn</button>
      </div>
    );
  }

  return (
    <div className="player-actions">
      <div className="carry-limit">
        Reagents: {reagentTotal} / {carryLimit}
      </div>

      {!actionType && (
        <>
          <h3>Choose an Action</h3>
          <div className="action-buttons">
            <button onClick={() => handleSelectAction('gatherResources')}>Gather</button>
            <button onClick={() => handleSelectAction('convertResourcesToMana')}>Convert</button>
            <button onClick={() => handleSelectAction('recruitWizard')}>Recruit Wizard</button>
            <button onClick={() => handleSelectAction('researchSpell')}>Research Spell</button>
            <button onClick={() => handleSelectAction('createTower')}>Build Tower</button>
            <button onClick={() => handleSelectAction('summonFamiliar')}>Summon Familiar</button>
          </div>
        </>
      )}

      {actionType === 'gatherResources' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <h3>Gather Reagents</h3>
          </div>
          <p className="action-hint">Click a card to gather all its reagents automatically.</p>
          <div className="resource-cards">
            {currentPlayer.resourceCards.map(card => (
              <div key={card.id} className="gather-card-wrapper" onClick={() => handleGather(card.id)}>
                <ResourceCard
                  card={card}
                  selected={selectedCardId === card.id}
                  onSelect={() => {}}
                  selectedResources={[]}
                  onResourceSelect={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {actionType === 'convertResourcesToMana' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <h3>Convert Reagents to Mana</h3>
          </div>
          <p className="action-hint">
            Each reagent converts at its current track value. Track value drops after converting.
          </p>
          <div className="convert-grid">
            {REAGENTS.map(r => {
              const have = currentPlayer.resources[r];
              const tv = (gameState.resources as unknown as Record<string, number>)[r] ?? 1;
              return (
                <button
                  key={r}
                  className={`convert-btn ${resourceToConvert === r ? 'selected' : ''} ${have === 0 ? 'disabled' : ''}`}
                  onClick={() => { if (have > 0) { setResourceToConvert(r); setQuantityToConvert(1); } }}
                  disabled={have === 0}
                >
                  <span className="convert-btn-name">{REAGENT_LABELS[r]}</span>
                  <span className="convert-btn-have">Have: {have}</span>
                  <span className="convert-btn-rate">Rate: {tv} mana ea.</span>
                </button>
              );
            })}
          </div>
          {resourceToConvert && (
            <div className="convert-qty-row">
              <label>Quantity:</label>
              <input
                type="number"
                value={quantityToConvert}
                min={1}
                max={(currentPlayer.resources as unknown as Record<string, number>)[resourceToConvert] ?? 1}
                onChange={e => setQuantityToConvert(Math.max(1, Number(e.target.value)))}
              />
              <span className="mana-preview">= {manaPreview} mana</span>
              <button onClick={handleConvert}>Convert</button>
            </div>
          )}
        </div>
      )}

      {actionType === 'recruitWizard' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <h3>Recruit a Wizard</h3>
          </div>
          <p className="action-hint">Select a wizard, bid mana, then confirm. (You have {currentPlayer.resources.mana} mana)</p>
          <div className="wizards-on-offer">
            {gameState.wizardsOnOffer.map(wizard => (
              <WizardCard
                key={wizard.id}
                wizard={wizard}
                onSelect={() => handleSelectWizard(wizard.id)}
                selected={currentWizardId === wizard.id}
              />
            ))}
          </div>
          {biddingActive && (
            <div className="bidding-panel">
              <p>Bidding for: <b>{gameState.wizardsOnOffer.find(w => w.id === currentWizardId)?.name}</b></p>
              <p>Current bid: <b>{currentBid} mana</b></p>
              <div className="bid-controls">
                <button onClick={handleBid}>Raise bid to {currentBid + 1}</button>
                <button onClick={handleConfirmRecruit} disabled={currentBid === 0}>Confirm ({currentBid} mana)</button>
              </div>
            </div>
          )}
        </div>
      )}

      {actionType === 'researchSpell' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <h3>Research a Spell</h3>
          </div>
          <p className="action-hint">Pay the mana cost to add the spell to your hand. (You have {currentPlayer.resources.mana} mana)</p>
          <div className="spells-on-offer">
            {gameState.spellsOnOffer.map(spell => (
              <SpellCard
                key={spell.id}
                spell={spell}
                onSelect={() => setSelectedSpellId(spell.id)}
                selected={selectedSpellId === spell.id}
              />
            ))}
          </div>
          {selectedSpellId && (
            <button className="confirm-btn" onClick={handleResearchSpell}>Research Selected Spell</button>
          )}
        </div>
      )}

      {actionType === 'createTower' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <h3>Build a Tower</h3>
          </div>
          <p className="action-hint">Pay gold to build. Towers increase your reagent carry limit. (You have {currentPlayer.resources.gold} gold)</p>
          <div className="towers-on-offer">
            {gameState.towersOnOffer.map(tower => (
              <TowerCard
                key={tower.id}
                tower={tower}
                onSelect={() => setSelectedTowerId(tower.id)}
                selected={selectedTowerId === tower.id}
              />
            ))}
          </div>
          {selectedTowerId && (
            <button className="confirm-btn" onClick={handleCreateTower}>Build Selected Tower</button>
          )}
        </div>
      )}

      {actionType === 'summonFamiliar' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <h3>Summon a Familiar</h3>
          </div>
          <p className="action-hint">Pay the mana cost to summon. Each familiar grants a special action. (You have {currentPlayer.resources.mana} mana)</p>
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
          {selectedFamiliarId && (
            <FamiliarActions familiarId={selectedFamiliarId} onComplete={handleFamiliarActionComplete} />
          )}
        </div>
      )}

      {errorMessage && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}
      {localError && <ErrorModal message={localError} onClose={() => setLocalError(null)} />}
    </div>
  );
};

export default PlayerActions;
