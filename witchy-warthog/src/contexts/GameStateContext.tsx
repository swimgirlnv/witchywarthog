import React, { createContext, useState, useContext, ReactNode } from 'react';
import { towerDeck, towersOnOffer } from '../cardLists/towers';
import { wizardDeck, wizardsOnOffer } from '../cardLists/wizards';
import { familiarDeck, familiarsOnOffer } from '../cardLists/familiars';
import { spellDeck, spellsOnOffer } from '../cardLists/spells';
import { resourceDeck } from '../cardLists/resources';
import { dungeonDeckData, shuffledDungeonDeck } from '../cardLists/dungeon';

interface Resources {
  mandrake: number;
  nightshade: number;
  foxglove: number;
  toadstool: number;
  horn: number;
  gold: number;
  mana: number;
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  power: Power;
  manaCost: number;
  cost: ResourceOptions;
  isCast: boolean;
  image: string;
}

export interface Wizard {
  id: string;
  name: string;
  description: string;
  power: Power;
  image: string;
}

export interface Familiar {
  id: string;
  name: string;
  description: string;
  power: Power;
  cost: number;
  image: string;
}

export interface Tower {
  id: string;
  name: string;
  description: string;
  power: Power;
  cost: number;
  image: string;
}

export interface ResourceOptions {
  [key: string]: number;
  mandrake: number;
  nightshade: number;
  foxglove: number;
  toadstool: number;
  horn: number;
}

export interface Power {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface ResourceCard {
  id: string;
  gather: ResourceOptions;
  increase: ResourceOptions;
}

interface Player {
  id: string;
  name: string;
  resources: Resources;
  spells: Spell[];
  wizards: Wizard[];
  familiars: Familiar[];
  towers: Tower[];
  resourceCards: ResourceCard[];
  dungeonHits: number;
  dungeonTreasures: DungeonCard[];
}

export interface DungeonCard {
  id: string;
  type: 'monster' | 'treasure';
  description: string;
  image: string;
  value?: number;
}

interface GameState {
  players: Player[];
  resources: Resources;
  towerDeck: Tower[];
  towersOnOffer: Tower[];
  wizardDeck: Wizard[];
  wizardsOnOffer: Wizard[];
  familiarDeck: Familiar[];
  familiarsOnOffer: Familiar[];
  spellDeck: Spell[];
  spellsOnOffer: Spell[];
  dungeonDeck: DungeonCard[];
  currentPlayerIndex: number;
  turnNumber: number;
  gameEnded: boolean;
}

const generateRandomResources = (): ResourceOptions => {
  const resources: ResourceOptions = {
    mandrake: 0,
    nightshade: 0,
    foxglove: 0,
    toadstool: 0,
    horn: 0,
  };
  const resourceKeys = Object.keys(resources) as (keyof ResourceOptions)[];
  for (let i = 0; i < 3; i++) {
    const resource = resourceKeys[Math.floor(Math.random() * resourceKeys.length)];
    resources[resource] += Math.floor(Math.random() * 3) + 1;
  }
  return resources;
};

const defaultState: GameState = {
  players: [
    {
      id: 'player1',
      name: 'Player 1',
      resources: { mandrake: 0, nightshade: 0, foxglove: 0, toadstool: 0, horn: 0, gold: 0, mana: 20 },
      spells: [],
      wizards: [],
      familiars: [],
      towers: [],
      resourceCards: resourceDeck.slice(0, 3),
      dungeonHits: 0,
      dungeonTreasures: [],
    },
  ],
  resources: { mandrake: 1, nightshade: 1, foxglove: 1, toadstool: 1, horn: 1, gold: 0, mana: 0 },
  towerDeck: towerDeck,
  towersOnOffer: towersOnOffer,
  wizardDeck: wizardDeck,
  wizardsOnOffer: wizardsOnOffer,
  familiarDeck: familiarDeck,
  familiarsOnOffer: familiarsOnOffer,
  spellDeck: spellDeck,
  spellsOnOffer: spellsOnOffer,
  dungeonDeck: shuffledDungeonDeck as DungeonCard[],
  currentPlayerIndex: 0,
  turnNumber: 1,
  gameEnded: false,
};

const GameStateContext = createContext<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  takeTurn: (playerId: string, action: string, payload: any) => void;
  drawDungeonCard: (playerId: string) => DungeonCard | null;
  endDungeonExpedition: (playerId: string) => void;
  endTurn: () => void;
}>({
  gameState: defaultState,
  setGameState: () => {},
  takeTurn: () => {},
  drawDungeonCard: () => null,
  endDungeonExpedition: () => {},
  endTurn: () => {},
});

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(defaultState);

  const takeTurn = (playerId: string, action: string, payload: any) => {
    setGameState(prevState => {
      const player = prevState.players.find(p => p.id === playerId);
      if (!player) return prevState;

      let newPlayers = [...prevState.players];

      switch (action) {
        case 'gatherResources':
          if (player.resourceCards.some(card => card.id === payload.cardId)) {
            const reagentKeys = ['mandrake', 'nightshade', 'foxglove', 'toadstool', 'horn'] as const;
            const carryLimit = 10 + player.towers.length;
            const currentTotal = reagentKeys.reduce((sum, r) => sum + player.resources[r], 0);
            let added = 0;
            for (const r of (payload.selectedResources as string[])) {
              const key = r as keyof Resources;
              if (reagentKeys.includes(key as typeof reagentKeys[number]) && currentTotal + added < carryLimit) {
                player.resources[key] += 1;
                added += 1;
              }
            }
          }
          break;
        case 'convertResourcesToMana':
          (player.resources as unknown as Record<string, number>)[payload.resource] -= payload.quantity;
          player.resources.mana += payload.quantity;
          break;
        case 'recruitWizard':
          const wizard = prevState.wizardsOnOffer.find(w => w.id === payload.wizardId);
          if (wizard) {
            player.wizards.push(wizard);
            newPlayers = newPlayers.map(p => {
              if (p.id === playerId) return player;
              return p;
            });
          }
          break;
        case 'researchSpell':
          const spell = prevState.spellsOnOffer.find(s => s.id === payload.spellId);
          if (spell) {
            player.spells.push(spell);
            newPlayers = newPlayers.map(p => {
              if (p.id === playerId) return player;
              return p;
            });
          }
          break;
        case 'createTower':
          const tower = prevState.towersOnOffer.find(t => t.id === payload.towerId);
          if (tower && player.resources.gold >= tower.cost) {
            player.towers.push(tower);
            player.resources.gold -= tower.cost;
            newPlayers = newPlayers.map(p => {
              if (p.id === playerId) return player;
              return p;
            });
          }
          break;
        case 'summonFamiliar':
          const familiar = prevState.familiarsOnOffer.find(f => f.id === payload.familiarId);
          if (familiar && player.resources.mana >= familiar.cost) {
            player.resources.mana -= familiar.cost;
            const res = player.resources as unknown as Record<string, number>;
            switch (payload.action) {
              case 'collectGold':
                const allCards = [...player.wizards, ...player.towers, ...player.spells, ...player.familiars];
                const goldEarned = allCards.filter(card => card.power.id === familiar.power.id).length;
                player.resources.gold += goldEarned;
                break;
              case 'gatherResourcesAndCastSpells':
                res[familiar.power.id] = (res[familiar.power.id] || 0) + 4;
                player.spells.forEach(spell => {
                  if (!spell.isCast) {
                    const canCast = Object.keys(spell.cost).every(r => res[r] >= spell.cost[r as keyof ResourceOptions]);
                    if (canCast) {
                      Object.keys(spell.cost).forEach(r => { res[r] -= spell.cost[r as keyof ResourceOptions]; });
                      spell.isCast = true;
                    }
                  }
                });
                break;
              case 'newResearch':
                const availableSpells = [...prevState.spellDeck];
                const drawn = availableSpells.splice(0, 1);
                if (drawn[0]) player.spells.push({ ...drawn[0], isCast: false });
                break;
              case 'enterDungeon':
                player.dungeonHits = 0;
                player.dungeonTreasures = [];
                break;
              default:
                break;
            }
            player.familiars.push(familiar);
            newPlayers = newPlayers.map(p => (p.id === playerId ? player : p));
            const newFamiliarsOnOffer = prevState.familiarsOnOffer.filter(f => f.id !== familiar.id);
            const newFamiliarDeck = [...prevState.familiarDeck];
            if (newFamiliarDeck.length > 0) {
              const next = newFamiliarDeck.pop();
              if (next) newFamiliarsOnOffer.push(next);
            }
            return { ...prevState, players: newPlayers, familiarsOnOffer: newFamiliarsOnOffer, familiarDeck: newFamiliarDeck };
          }
          break;
        default:
          break;
      }

      return {
        ...prevState,
        players: newPlayers,
      };
    });
  };

  const drawDungeonCard = (playerId: string): DungeonCard | null => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return null;

    if (gameState.dungeonDeck.length === 0) {
      alert('The dungeon is empty.');
      return null;
    }

    const drawnCard = gameState.dungeonDeck.pop();
    if (!drawnCard) return null;

    if (drawnCard.type === 'monster') {
      player.dungeonHits += 1;
      if (player.dungeonHits >= 2) {
        alert('You have taken a second hit and are defeated. All drawn cards are shuffled back into the dungeon deck.');
        player.dungeonHits = 0;
        player.dungeonTreasures = [];
        gameState.dungeonDeck.push(drawnCard);
        gameState.dungeonDeck = [...gameState.dungeonDeck, ...player.dungeonTreasures];
        setGameState({
          ...gameState,
          players: gameState.players.map(p => (p.id === playerId ? player : p)),
        });
        return null;
      }
    } else {
      player.dungeonTreasures.push(drawnCard);
    }

    setGameState({
      ...gameState,
      players: gameState.players.map(p => (p.id === playerId ? player : p)),
      dungeonDeck: [...gameState.dungeonDeck],
    });

    return drawnCard;
  };

  const endDungeonExpedition = (playerId: string) => {
    setGameState(prevState => {
      const player = prevState.players.find(p => p.id === playerId);
      if (!player) return prevState;

      const totalGold = player.dungeonTreasures.reduce((sum, card) => sum + (card.value || 0), 0);
      player.resources.gold += totalGold;

      player.dungeonHits = 0;
      player.dungeonTreasures = [];

      return {
        ...prevState,
        players: prevState.players.map(p => (p.id === playerId ? player : p)),
      };
    });
  };

  const endTurn = () => {
    setGameState(prevState => {
      const nextPlayerIndex = (prevState.currentPlayerIndex + 1) % prevState.players.length;
      const newTurnNumber = nextPlayerIndex === 0 ? prevState.turnNumber + 1 : prevState.turnNumber;
      const gameEnded = prevState.wizardDeck.length === 0 && prevState.wizardsOnOffer.length === 0;
      return { ...prevState, currentPlayerIndex: nextPlayerIndex, turnNumber: newTurnNumber, gameEnded };
    });
  };

  return (
    <GameStateContext.Provider value={{ gameState, setGameState, takeTurn, drawDungeonCard, endDungeonExpedition, endTurn }}>
      {children}
    </GameStateContext.Provider>
  );
};
