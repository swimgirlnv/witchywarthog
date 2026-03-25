import { useState } from 'react';
import { useGameState } from './contexts/GameStateContext';

// Helper to treat Resources as a plain number map for dynamic key access
const res = (r: object) => r as Record<string, number>;

export const useGameLogic = () => {
  const { gameState, setGameState, drawDungeonCard, endDungeonExpedition } = useGameState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const closeErrorModal = () => setErrorMessage(null);

  const gatherResources = (playerId: string, cardId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const resourceCard = player.resourceCards.find(card => card.id === cardId);
    if (!resourceCard) return;

    const reagentKeys = ['mandrake', 'nightshade', 'foxglove', 'toadstool', 'horn'] as const;
    const carryLimit = 10 + player.towers.length;
    const currentTotal = reagentKeys.reduce((sum, r) => sum + player.resources[r], 0);
    let spaceLeft = carryLimit - currentTotal;

    reagentKeys.forEach(resource => {
      const amount = resourceCard.gather[resource];
      if (amount > 0 && spaceLeft > 0) {
        const toAdd = Math.min(amount, spaceLeft);
        player.resources[resource] += toAdd;
        spaceLeft -= toAdd;
      }
    });

    // Increase board track values (capped at 10)
    Object.keys(resourceCard.increase).forEach(resource => {
      if (resourceCard.increase[resource] > 0) {
        res(gameState.resources)[resource] = Math.min(10, res(gameState.resources)[resource] + resourceCard.increase[resource]);
      }
    });

    // Auto-cast spells if now affordable
    player.spells.forEach(spell => {
      if (!spell.isCast) {
        const canCast = Object.keys(spell.cost).every(r => res(player.resources)[r] >= spell.cost[r]);
        if (canCast) {
          Object.keys(spell.cost).forEach(r => { res(player.resources)[r] -= spell.cost[r]; });
          spell.isCast = true;
        }
      }
    });

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      resources: { ...gameState.resources },
    });
  };

  const convertResourcesToMana = (playerId: string, resource: string, quantity: number) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const playerAmount = res(player.resources)[resource] ?? 0;
    if (quantity <= 0 || quantity > playerAmount) {
      setErrorMessage(`You only have ${playerAmount} ${resource} to convert.`);
      return;
    }

    const trackValue = res(gameState.resources)[resource] ?? 1;
    const manaGained = quantity * trackValue;
    res(player.resources)[resource] -= quantity;
    player.resources.mana += manaGained;
    res(gameState.resources)[resource] = Math.max(1, trackValue - quantity);

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
      setErrorMessage(`You do not have enough mana to bid ${bidAmount}.`);
      return;
    }

    player.resources.mana -= bidAmount;
    player.wizards.push(wizard);

    gameState.wizardsOnOffer = gameState.wizardsOnOffer.filter(w => w.id !== wizardId);
    if (gameState.wizardDeck.length > 0) {
      const newWizard = gameState.wizardDeck.pop();
      if (newWizard) gameState.wizardsOnOffer.push(newWizard);
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      wizardsOnOffer: [...gameState.wizardsOnOffer],
      wizardDeck: [...gameState.wizardDeck],
    });
  };

  const researchSpell = (playerId: string, spellId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const spell = gameState.spellsOnOffer.find(s => s.id === spellId);
    if (!spell) return;

    if (player.resources.mana < spell.manaCost) {
      setErrorMessage(`You do not have enough mana to research ${spell.name}.`);
      return;
    }

    player.resources.mana -= spell.manaCost;
    player.spells.push({ ...spell, isCast: false });

    gameState.spellsOnOffer = gameState.spellsOnOffer.filter(s => s.id !== spellId);
    if (gameState.spellDeck.length > 0) {
      const newSpell = gameState.spellDeck.pop();
      if (newSpell) gameState.spellsOnOffer.push(newSpell);
    }

    // Immediately try to cast with current resources
    const researched = player.spells[player.spells.length - 1];
    const canCast = Object.keys(researched.cost).every(r => res(player.resources)[r] >= researched.cost[r]);
    if (canCast) {
      Object.keys(researched.cost).forEach(r => { res(player.resources)[r] -= researched.cost[r]; });
      researched.isCast = true;
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      spellsOnOffer: [...gameState.spellsOnOffer],
      spellDeck: [...gameState.spellDeck],
    });
  };

  const createTower = (playerId: string, towerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const tower = gameState.towersOnOffer.find(t => t.id === towerId);
    if (!tower) return;

    if (player.resources.gold < tower.cost) {
      setErrorMessage(`You do not have enough gold to build ${tower.name}. Need ${tower.cost}, have ${player.resources.gold}.`);
      return;
    }

    player.resources.gold -= tower.cost;
    player.towers.push(tower);

    gameState.towersOnOffer = gameState.towersOnOffer.filter(t => t.id !== towerId);
    if (gameState.towerDeck.length > 0) {
      const newTower = gameState.towerDeck.pop();
      if (newTower) gameState.towersOnOffer.push(newTower);
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      towersOnOffer: [...gameState.towersOnOffer],
      towerDeck: [...gameState.towerDeck],
    });
  };

  const summonFamiliar = (playerId: string, familiarId: string, action: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const familiar = gameState.familiarsOnOffer.find(f => f.id === familiarId);
    if (!familiar) return;

    if (player.resources.mana < familiar.cost) {
      setErrorMessage(`You do not have enough mana to summon ${familiar.name}.`);
      return;
    }

    player.resources.mana -= familiar.cost;
    player.familiars.push(familiar);

    gameState.familiarsOnOffer = gameState.familiarsOnOffer.filter(f => f.id !== familiarId);
    if (gameState.familiarDeck.length > 0) {
      const newFamiliar = gameState.familiarDeck.pop();
      if (newFamiliar) gameState.familiarsOnOffer.push(newFamiliar);
    }

    switch (action) {
      case 'collectGold': {
        const allCards = [...player.wizards, ...player.towers, ...player.spells, ...player.familiars];
        const goldEarned = allCards.filter(card => card.power.id === familiar.power.id).length;
        player.resources.gold += goldEarned;
        break;
      }
      case 'gatherResourcesAndCastSpells': {
        // Familiar's school gives 4 of the matching reagent (if it is a reagent)
        const reagentKeys = ['mandrake', 'nightshade', 'foxglove', 'toadstool', 'horn'];
        if (reagentKeys.includes(familiar.power.id)) {
          res(player.resources)[familiar.power.id] = (res(player.resources)[familiar.power.id] || 0) + 4;
        }
        player.spells.forEach(spell => {
          if (!spell.isCast) {
            const canCast = Object.keys(spell.cost).every(r => res(player.resources)[r] >= spell.cost[r]);
            if (canCast) {
              Object.keys(spell.cost).forEach(r => { res(player.resources)[r] -= spell.cost[r]; });
              spell.isCast = true;
            }
          }
        });
        break;
      }
      case 'newResearch': {
        if (gameState.spellDeck.length > 0) {
          const newSpell = gameState.spellDeck.pop();
          if (newSpell) player.spells.push({ ...newSpell, isCast: false });
        }
        break;
      }
      case 'enterDungeon':
        player.dungeonHits = 0;
        player.dungeonTreasures = [];
        break;
      default:
        break;
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      familiarsOnOffer: [...gameState.familiarsOnOffer],
      familiarDeck: [...gameState.familiarDeck],
    });
  };

  const takeTurn = (playerId: string, action: string, payload?: any) => {
    switch (action) {
      case 'gatherResources':
        gatherResources(playerId, payload.cardId);
        break;
      case 'convertResourcesToMana':
        convertResourcesToMana(playerId, payload.resource, payload.quantity);
        break;
      case 'recruitWizard':
        recruitWizard(playerId, payload.wizardId, payload.bidAmount);
        break;
      case 'researchSpell':
        researchSpell(playerId, payload.spellId);
        break;
      case 'createTower':
        createTower(playerId, payload.towerId);
        break;
      case 'summonFamiliar':
        summonFamiliar(playerId, payload.familiarId, payload.action);
        break;
      default:
        break;
    }
  };

  return { takeTurn, drawDungeonCard, endDungeonExpedition, errorMessage, closeErrorModal };
};
