import { useState } from 'react';
import { spellDeck } from './cardLists/spells';
import { useGameState } from './contexts/GameStateContext';

export const useGameLogic = () => {
  const { gameState, setGameState, drawDungeonCard, endDungeonExpedition } = useGameState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const closeErrorModal = () => setErrorMessage(null);

  const gatherResources = (playerId: string, cardId: string, selectedResources: string[]) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const resourceCard = player.resourceCards.find(card => card.id === cardId);
    if (!resourceCard) return;

    selectedResources.forEach(resource => {
      player.resources[resource] += resourceCard.gather[resource];
    });

    Object.keys(resourceCard.increase).forEach(resource => {
      if (resourceCard.increase[resource] > 0) {
        gameState.resources[resource] += resourceCard.increase[resource];
      }
    });

    player.spells.forEach(spell => {
      if (!spell.isCast) {
        const canCast = Object.keys(spell.cost).every(resource => player.resources[resource] >= spell.cost[resource]);
        if (canCast) {
          Object.keys(spell.cost).forEach(resource => {
            player.resources[resource] -= spell.cost[resource];
          });
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

    const playerResourceAmount = player.resources[resource];
    if (quantity > playerResourceAmount) {
      setErrorMessage(`You can only convert up to ${playerResourceAmount} units of ${resource}.`);
      return;
    }

    const boardResourceAmount = gameState.resources[resource];
    if (quantity > boardResourceAmount) {
      setErrorMessage(`You can only convert up to ${boardResourceAmount} units of ${resource}.`);
      return;
    }

    const resourceValue = boardResourceAmount;
    const manaGained = quantity * resourceValue;
    player.resources[resource] -= quantity;
    player.resources.mana += manaGained;

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
      setErrorMessage(`You do not have enough mana to bid ${bidAmount}.`);
      return;
    }

    player.resources.mana -= bidAmount;
    player.wizards.push(wizard);

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

    if (player.resources.mana < spell.manaCost) {
      setErrorMessage(`You do not have enough mana to research ${spell.name}.`);
      return;
    }

    player.resources.mana -= spell.manaCost;
    player.spells.push({ ...spell, isCast: false });

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
      setErrorMessage(`You do not have the necessary resources to cast ${spell.name}.`);
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
    });
  };

  const createTower = (playerId: string, towerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    const tower = gameState.towersOnOffer.find(t => t.id === towerId);
    if (!tower) return;

    const towerCost = tower.cost;
    if (player.resources.gold < towerCost) {
      setErrorMessage(`You do not have enough gold to create ${tower.name}.`);
      return;
    }

    player.resources.gold -= towerCost;
    player.towers.push(tower);

    gameState.towersOnOffer = gameState.towersOnOffer.filter(t => t.id !== towerId);
    if (gameState.towerDeck.length > 0) {
      const newTower = gameState.towerDeck.pop();
      if (newTower) {
        gameState.towersOnOffer.push(newTower);
      }
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      towersOnOffer: [...gameState.towersOnOffer],
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
      if (newFamiliar) {
        gameState.familiarsOnOffer.push(newFamiliar);
      }
    }

    switch (action) {
      case 'collectGold':
        const goldEarned = ['wizards', 'towers', 'spells', 'familiars']
          .map(type => player[type].filter(card => card.power.id === familiar.power.id).length)
          .reduce((sum, count) => sum + count, 0);
        player.resources.gold += goldEarned;
        break;
      case 'gatherResourcesAndCastSpells':
        player.resources[familiar.power.id] += 4;
        player.spells.forEach(spell => {
          if (!spell.isCast) {
            const canCast = Object.keys(spell.cost).every(resource => player.resources[resource] >= spell.cost[resource]);
            if (canCast) {
              Object.keys(spell.cost).forEach(resource => {
                player.resources[resource] -= spell.cost[resource];
              });
              spell.isCast = true;
            }
          }
        });
        break;
      case 'newResearch':
        gameState.spellsOnOffer = spellDeck.splice(0, 4);
        const newSpell = gameState.spellsOnOffer.pop();
        if (newSpell) {
          player.spells.push({ ...newSpell, isCast: false });
          gameState.spellsOnOffer.push(...spellDeck.splice(0, 1));
        }
        break;
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
