import React, { useMemo, useState } from 'react';
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
  mandrake: 'Mandrake',
  nightshade: 'Nightshade',
  foxglove: 'Foxglove',
  toadstool: 'Toadstool',
  horn: 'Horn',
};

const formatReagentCost = (cost: Record<string, number>) =>
  REAGENTS.filter(reagent => cost[reagent] > 0)
    .map(reagent => `${cost[reagent]} ${REAGENT_LABELS[reagent]}`)
    .join(', ');

const PlayerActions: React.FC = () => {
  const { gameState, takeTurn, endTurn, isMyTurn } = useGameState();
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const [actionType, setActionType] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState(false);
  const [selectedGatherCardId, setSelectedGatherCardId] = useState<string | null>(null);
  const [selectedWizardId, setSelectedWizardId] = useState<string | null>(null);
  const [selectedSpellId, setSelectedSpellId] = useState<string | null>(null);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [selectedFamiliarId, setSelectedFamiliarId] = useState<string | null>(null);
  const [resourceToConvert, setResourceToConvert] = useState<string | null>(null);
  const [quantityToConvert, setQuantityToConvert] = useState(1);
  const [currentBid, setCurrentBid] = useState(1);
  const [towerPayment, setTowerPayment] = useState<'gold' | 'reagents'>('gold');
  const [familiarPayment, setFamiliarPayment] = useState<'mana' | 'reagents'>('mana');
  const [castResearchedSpell, setCastResearchedSpell] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const carryLimit = 10 + currentPlayer.towers.length;
  const reagentTotal = REAGENTS.reduce((sum, reagent) => sum + currentPlayer.resources[reagent], 0);

  const selectedSpell = useMemo(
    () => gameState.spellsOnOffer.find(spell => spell.id === selectedSpellId),
    [gameState.spellsOnOffer, selectedSpellId],
  );
  const selectedGatherCard = useMemo(
    () => currentPlayer.resourceCards.find(card => card.id === selectedGatherCardId),
    [currentPlayer.resourceCards, selectedGatherCardId],
  );
  const selectedTower = useMemo(
    () => gameState.towersOnOffer.find(tower => tower.id === selectedTowerId),
    [gameState.towersOnOffer, selectedTowerId],
  );
  const selectedFamiliar = useMemo(
    () => gameState.familiarsOnOffer.find(f => f.id === selectedFamiliarId),
    [gameState.familiarsOnOffer, selectedFamiliarId],
  );

  const reset = () => {
    setActionType(null);
    setActionDone(false);
    setSelectedGatherCardId(null);
    setSelectedWizardId(null);
    setSelectedSpellId(null);
    setSelectedTowerId(null);
    setSelectedFamiliarId(null);
    setResourceToConvert(null);
    setQuantityToConvert(1);
    setCurrentBid(1);
    setTowerPayment('gold');
    setFamiliarPayment('mana');
    setCastResearchedSpell(false);
    setStatusMessage(null);
  };

  const beginAction = (action: string) => {
    reset();
    setActionType(action);
  };

  const resolveAction = async (action: string, payload: Record<string, unknown>) => {
    const result = await takeTurn(currentPlayer.id, action, payload);
    if (!result.ok) {
      setLocalError(result.message);
      return;
    }
    setStatusMessage(result.message);
    setActionDone(true);
  };

  const handleEndTurn = async () => {
    reset();
    await endTurn();
  };

  const handleGather = async () => {
    if (!selectedGatherCardId) {
      setLocalError('Select a reagent card first.');
      return;
    }
    await resolveAction('gatherResources', { cardId: selectedGatherCardId });
  };

  const handleConvert = async () => {
    if (!resourceToConvert) {
      setLocalError('Select a reagent to convert.');
      return;
    }
    await resolveAction('convertResourcesToMana', { resource: resourceToConvert, quantity: quantityToConvert });
  };

  const handleRecruitWizard = async () => {
    if (!selectedWizardId) {
      setLocalError('Select a wizard to recruit.');
      return;
    }
    await resolveAction('recruitWizard', { wizardId: selectedWizardId, bidAmount: currentBid });
  };

  const handleResearchSpell = async () => {
    if (!selectedSpellId) {
      setLocalError('Select a spell to research.');
      return;
    }
    await resolveAction('researchSpell', { spellId: selectedSpellId, castNow: castResearchedSpell });
  };

  const handleCreateTower = async () => {
    if (!selectedTowerId) {
      setLocalError('Select a tower to create.');
      return;
    }
    await resolveAction('createTower', { towerId: selectedTowerId, paymentMethod: towerPayment });
  };

  const convertTrackValue =
    resourceToConvert ? (gameState.resources[resourceToConvert as keyof typeof gameState.resources] ?? 0) : 0;
  const manaPreview = quantityToConvert * convertTrackValue;

  if (actionDone) {
    return (
      <div className="player-actions action-done">
        <div className="action-done-seal">✦</div>
        <p className="action-done-msg">{statusMessage ?? 'Your deed is done.'}</p>
        <button className="end-turn-btn" onClick={handleEndTurn}>
          End Your Turn →
        </button>
      </div>
    );
  }

  if (!isMyTurn) {
    return (
      <div className="player-actions">
        <div className="turn-status-card">
          <span className="status-pill">Reagents {reagentTotal} / {carryLimit}</span>
          <span className="status-pill">Mana {currentPlayer.resources.mana}</span>
          <span className="status-pill">Gold {currentPlayer.resources.gold}</span>
        </div>
        <div className="selection-summary">
          <h4>Awaiting Your Turn</h4>
          <p>
            The arcane board shifts as {currentPlayer.name} weaves their fate. Your realm updates in real time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="player-actions">
      {/* <div className="turn-status-card">
        <span className="status-pill">Reagents {reagentTotal} / {carryLimit}</span>
        <span className="status-pill">Mana {currentPlayer.resources.mana}</span>
        <span className="status-pill">Gold {currentPlayer.resources.gold}</span>
      </div> */}

      {!actionType && (
        <>
          <h3 className="action-menu-title">✦ What will you do? ✦</h3>
          <div className="action-menu">
            <button className="action-menu-btn" onClick={() => beginAction('gatherResources')}>
              <span className="action-menu-icon">🌿</span>
              <span className="action-menu-body">
                <span className="action-menu-label">Gather Reagents</span>
                <span className="action-menu-hint">Harvest wild ingredients from your reagent cards</span>
              </span>
            </button>
            <button className="action-menu-btn" onClick={() => beginAction('convertResourcesToMana')}>
              <span className="action-menu-icon">✨</span>
              <span className="action-menu-body">
                <span className="action-menu-label">Convert to Mana</span>
                <span className="action-menu-hint">Transmute stockpiled reagents into arcane power</span>
              </span>
            </button>
            <button className="action-menu-btn" onClick={() => beginAction('recruitWizard')}>
              <span className="action-menu-icon">🧙</span>
              <span className="action-menu-body">
                <span className="action-menu-label">Recruit a Wizard</span>
                <span className="action-menu-hint">Bid mana to bring a new mage to your cause</span>
              </span>
            </button>
            <button className="action-menu-btn" onClick={() => beginAction('researchSpell')}>
              <span className="action-menu-icon">📜</span>
              <span className="action-menu-body">
                <span className="action-menu-label">Research a Spell</span>
                <span className="action-menu-hint">Spend 5 mana to decipher forbidden arcane knowledge</span>
              </span>
            </button>
            <button className="action-menu-btn" onClick={() => beginAction('createTower')}>
              <span className="action-menu-icon">🏰</span>
              <span className="action-menu-body">
                <span className="action-menu-label">Create a Tower</span>
                <span className="action-menu-hint">Raise a stronghold and expand your carry limit</span>
              </span>
            </button>
            <button className="action-menu-btn" onClick={() => beginAction('summonFamiliar')}>
              <span className="action-menu-icon">🦎</span>
              <span className="action-menu-body">
                <span className="action-menu-label">Summon a Familiar</span>
                <span className="action-menu-hint">Bind a creature and unleash its special power</span>
              </span>
            </button>
          </div>
        </>
      )}

      {actionType === 'gatherResources' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <div>
              <h3>🌿 Gather Reagents</h3>
              <p className="action-hint">
                Choose one reagent card. You gain the shown reagents and raise the matching market tracks.
              </p>
            </div>
          </div>
          <div className="action-layout two-column">
            <div className="resource-cards">
              {currentPlayer.resourceCards.map(card => (
                <div
                  key={card.id}
                  className={`gather-card-wrapper ${selectedGatherCardId === card.id ? 'selected' : ''}`}
                  onClick={() => setSelectedGatherCardId(card.id)}
                >
                  <ResourceCard
                    card={card}
                    selected={selectedGatherCardId === card.id}
                    onSelect={() => setSelectedGatherCardId(card.id)}
                    selectedResources={[]}
                    onResourceSelect={() => {}}
                  />
                </div>
              ))}
            </div>
            <div className="selection-summary action-sidebar">
              <h4>Harvest Preview</h4>
              {selectedGatherCard ? (
                <>
                  <p><strong>You gain:</strong> {formatReagentCost(selectedGatherCard.gather)}</p>
                  <p><strong>Market rises:</strong> {formatReagentCost(selectedGatherCard.increase)}</p>
                  <p><strong>Storage space:</strong> {Math.max(0, carryLimit - reagentTotal)} open</p>
                  <button className="confirm-btn" onClick={handleGather}>Fill the Satchel</button>
                </>
              ) : (
                <p>Select a reagent card to preview your harvest.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {actionType === 'convertResourcesToMana' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <div>
              <h3>✨ Convert to Mana</h3>
              <p className="action-hint">
                Pick one reagent type, choose a quantity, and watch your mana swell before you commit.
              </p>
            </div>
          </div>
          <div className="action-layout two-column">
            <div className="convert-grid">
              {REAGENTS.map(reagent => {
                const have = currentPlayer.resources[reagent];
                const rate = gameState.resources[reagent];
                return (
                  <button
                    key={reagent}
                    className={`convert-btn ${resourceToConvert === reagent ? 'selected' : ''}`}
                    onClick={() => {
                      setResourceToConvert(reagent);
                      setQuantityToConvert(1);
                    }}
                    disabled={have === 0}
                  >
                    <span className="convert-btn-name">{REAGENT_LABELS[reagent]}</span>
                    <span className="convert-btn-have">Held: {have}</span>
                    <span className="convert-btn-rate">Worth: {rate} mana</span>
                  </button>
                );
              })}
            </div>
            <div className="selection-summary action-sidebar">
              <h4>Transmutation</h4>
              {resourceToConvert ? (
                <>
                  <p><strong>Reagent:</strong> {REAGENT_LABELS[resourceToConvert]}</p>
                  <p><strong>Current worth:</strong> {convertTrackValue} mana each</p>
                  <div className="convert-qty-row">
                    <label htmlFor="convert-qty">Quantity</label>
                    <input
                      id="convert-qty"
                      type="number"
                      min={1}
                      max={currentPlayer.resources[resourceToConvert as keyof typeof currentPlayer.resources] ?? 1}
                      value={quantityToConvert}
                      onChange={event => setQuantityToConvert(Math.max(1, Number(event.target.value) || 1))}
                    />
                  </div>
                  <p className="mana-preview">+{manaPreview} mana</p>
                  <p><strong>Market drops to:</strong> {Math.max(1, convertTrackValue - quantityToConvert)}</p>
                  <button className="confirm-btn" onClick={handleConvert}>Transmute into Mana</button>
                </>
              ) : (
                <p>Select a reagent above to begin transmutation.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {actionType === 'recruitWizard' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <div>
              <h3>🧙 Recruit a Wizard</h3>
              <p className="action-hint">
                Choose a wizard and name your bid. Any amount of mana is valid — bid generously to secure their loyalty.
              </p>
            </div>
          </div>
          <div className="wizards-on-offer">
            {gameState.wizardsOnOffer.map(wizard => (
              <WizardCard
                key={wizard.id}
                wizard={wizard}
                onSelect={() => setSelectedWizardId(wizard.id)}
                selected={selectedWizardId === wizard.id}
              />
            ))}
          </div>
          {selectedWizardId && (
            <div className="selection-summary">
              <h4>Name Your Bid</h4>
              <div className="inline-controls">
                <label htmlFor="wizard-bid">Mana bid</label>
                <input
                  id="wizard-bid"
                  type="number"
                  min={1}
                  max={currentPlayer.resources.mana}
                  value={currentBid}
                  onChange={event => setCurrentBid(Math.max(1, Number(event.target.value) || 1))}
                />
                <span className="status-note">Remaining mana: {Math.max(0, currentPlayer.resources.mana - currentBid)}</span>
                <button className="confirm-btn" onClick={handleRecruitWizard}>Seal the Pact</button>
              </div>
            </div>
          )}
        </div>
      )}

      {actionType === 'researchSpell' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <div>
              <h3>📜 Research a Spell</h3>
              <p className="action-hint">
                Costs 5 mana to decipher. If you can meet the cast cost, you may unleash it immediately.
              </p>
            </div>
          </div>
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
          {selectedSpell && (
            <div className="selection-summary">
              <h4>Arcane Summary</h4>
              <p><strong>Cast cost:</strong> {formatReagentCost(selectedSpell.cost) || 'none'}</p>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={castResearchedSpell}
                  onChange={event => setCastResearchedSpell(event.target.checked)}
                />
                <span>Cast this spell immediately if I can afford it</span>
              </label>
              <button className="confirm-btn" onClick={handleResearchSpell}>Decipher the Runes (5 Mana)</button>
            </div>
          )}
        </div>
      )}

      {actionType === 'createTower' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <div>
              <h3>🏰 Create a Tower</h3>
              <p className="action-hint">Select a tower and choose your method of payment — gold or reagents.</p>
            </div>
          </div>
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
          {selectedTower && (
            <div className="selection-summary">
              <h4>Lay the Foundation</h4>
              <div className="payment-toggle">
                <button
                  className={towerPayment === 'gold' ? 'selected' : ''}
                  onClick={() => setTowerPayment('gold')}
                >
                  Pay {selectedTower.cost} Gold
                </button>
                <button
                  className={towerPayment === 'reagents' ? 'selected' : ''}
                  onClick={() => setTowerPayment('reagents')}
                >
                  Pay {formatReagentCost(selectedTower.reagentCost)}
                </button>
              </div>
              <button className="confirm-btn" onClick={handleCreateTower}>Raise the Tower</button>
            </div>
          )}
        </div>
      )}

      {actionType === 'summonFamiliar' && (
        <div className="action-panel">
          <div className="action-panel-header">
            <button className="back-btn" onClick={reset}>← Back</button>
            <div>
              <h3>🦎 Summon a Familiar</h3>
              <p className="action-hint">
                Bind a creature to your service, then choose the power it will unleash this turn.
              </p>
            </div>
          </div>
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
            <>
              {selectedFamiliar && (
                <div className="selection-summary">
                  <h4>Binding Pact</h4>
                  <div className="payment-toggle">
                    <button
                      className={familiarPayment === 'mana' ? 'selected' : ''}
                      onClick={() => setFamiliarPayment('mana')}
                    >
                      Pay {selectedFamiliar.cost} Mana
                    </button>
                    <button
                      className={familiarPayment === 'reagents' ? 'selected' : ''}
                      onClick={() => setFamiliarPayment('reagents')}
                    >
                      Pay {formatReagentCost(selectedFamiliar.reagentCost)}
                    </button>
                  </div>
                </div>
              )}
              <FamiliarActions
                familiarId={selectedFamiliarId}
                paymentMethod={familiarPayment}
                onComplete={message => {
                  setStatusMessage(message);
                  setActionDone(true);
                }}
                onError={message => setLocalError(message)}
              />
            </>
          )}
        </div>
      )}

      {localError && <ErrorModal message={localError} onClose={() => setLocalError(null)} />}
    </div>
  );
};

export default PlayerActions;
