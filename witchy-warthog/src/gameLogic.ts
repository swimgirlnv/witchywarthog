import { useGameState } from './contexts/GameStateContext';

export const useGameLogic = () => {
  const { gameState, setGameState } = useGameState();

  const gatherResources = (playerId: string, cardId: string, selectedResources: string[]) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const resourceCard = player.resourceCards.find(card => card.id === cardId);
    if (!resourceCard) return;

    // Gather selected resources
    selectedResources.forEach(resource => {
      player.resources[resource] += resourceCard.gather[resource];
    });

    // Increase value of all resources in the "Increase Value" portion
    Object.keys(resourceCard.increase).forEach(resource => {
      if (resourceCard.increase[resource] > 0) {
        gameState.resources[resource] += resourceCard.increase[resource];
      }
    });

    // Optional: Try to cast a spell if resources allow
    player.spells.forEach(spell => {
      if (!spell.isCast) {
        const canCast = Object.keys(spell.cost).every(resource => player.resources[resource] >= spell.cost[resource]);
        if (canCast) {
          Object.keys(spell.cost).forEach(resource => {
            player.resources[resource] -= spell.cost[resource];
          });
          // Mark the spell as cast
          spell.isCast = true;
        }
      }
    });

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      resources: { ...gameState.resources }, // Ensure the state updates for board tracker
    });
  };

  const convertResourcesToMana = (playerId: string, resource: string, quantity: number) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const playerResourceAmount = player.resources[resource];
    if (quantity > playerResourceAmount) {
      alert(`You can only convert up to ${playerResourceAmount} units of ${resource}.`);
      return;
    }

    const boardResourceAmount = gameState.resources[resource];
    if (quantity > boardResourceAmount) {
      alert(`You can only convert up to ${boardResourceAmount} units of ${resource}.`);
      return;
    }

    const resourceValue = boardResourceAmount; // Value is the current amount on the board tracker
    const manaGained = quantity * resourceValue;
    player.resources[resource] -= quantity;
    player.resources.mana += manaGained;

    // Reduce the board tracker value
    gameState.resources[resource] = Math.max(1, boardResourceAmount - quantity);

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      resources: { ...gameState.resources },
    });
  };

  const recruitWizard = (playerId: string, wizardId: string, bidAmount: number) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const wizard = gameState.wizardsOnOffer.find(w => w.id === wizardId);
    if (!wizard) return;

    if (player.resources.mana < bidAmount) {
      alert(`You do not have enough mana to bid ${bidAmount}.`);
      return;
    }

    player.resources.mana -= bidAmount;
    player.wizards.push(wizard);

    // Remove wizard from the offer and replenish from the deck
    gameState.wizardsOnOffer = gameState.wizardsOnOffer.filter(w => w.id !== wizardId);
    if (gameState.wizardDeck.length > 0) {
      const newWizard = gameState.wizardDeck.pop();
      if (newWizard) {
        gameState.wizardsOnOffer.push(newWizard);
      }
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      wizardsOnOffer: [...gameState.wizardsOnOffer],
    });
  };

  const researchSpell = (playerId: string, spellId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const spell = gameState.spellsOnOffer.find(s => s.id === spellId);
    if (!spell) return;

    if (player.resources.mana < spell.cost) {
      alert(`You do not have enough mana to research ${spell.name}.`);
      return;
    }

    player.resources.mana -= spell.cost;
    player.spells.push({ ...spell, isCast: false });

    // Remove spell from the offer and replenish from the deck
    gameState.spellsOnOffer = gameState.spellsOnOffer.filter(s => s.id !== spellId);
    if (gameState.spellDeck.length > 0) {
      const newSpell = gameState.spellDeck.pop();
      if (newSpell) {
        gameState.spellsOnOffer.push(newSpell);
      }
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      spellsOnOffer: [...gameState.spellsOnOffer],
    });

    // Optional: Try to cast the researched spell if resources allow
    castSpell(playerId, spellId);
  };

  const castSpell = (playerId: string, spellId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const spell = player.spells.find(s => s.id === spellId);
    if (!spell || spell.isCast) return;

    const canCast = Object.keys(spell.cost).every(resource => player.resources[resource] >= spell.cost[resource]);
    if (canCast) {
      Object.keys(spell.cost).forEach(resource => {
        player.resources[resource] -= spell.cost[resource];
      });
      spell.isCast = true;
    } else {
      alert(`You do not have the necessary resources to cast ${spell.name}.`);
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
    });
  };


  const createTower = (playerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const newTower = { id: `tower${gameState.towers.length + 1}`, name: 'New Tower', description: 'A strong tower' };
    gameState.towers.push(newTower);

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
    });
  };

  const summonFamiliar = (playerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const newFamiliar = { id: `familiar${player.familiars.length + 1}`, name: 'New Familiar', description: 'A loyal familiar', ability: 'Increases resource gathering' };
    player.familiars.push(newFamiliar);

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
    });
  };

  

  const takeTurn = (playerId: string, action: string, payload?: any) => {
    switch (action) {
      case 'gatherResources':
        gatherResources(playerId, payload.cardId, payload.selectedResources);
        break;
      case 'convertResourcesToMana':
        convertResourcesToMana(playerId, payload.resource, payload.quantity);
        break;
      case 'recruitWizard':
        recruitWizard(playerId, payload.wizardId, payload.bidAmount);
        break;
      case 'researchSpell':
        researchSpell(playerId);
        break;
      case 'createTower':
        createTower(playerId);
        break;
      case 'summonFamiliar':
        summonFamiliar(playerId);
        break;
      default:
        break;
    }
  };

  return { takeTurn };
};
