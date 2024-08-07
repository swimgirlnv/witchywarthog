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
      resources: { mandrake: 10, nightshade: 10, foxglove: 10, toadstool: 10, horn: 10, gold: 10, mana: 10 },
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
};

const GameStateContext = createContext<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  takeTurn: (playerId: string, action: string, payload: any) => void;
  drawDungeonCard: (playerId: string) => DungeonCard | null;
  endDungeonExpedition: (playerId: string) => void;
}>({
  gameState: defaultState,
  setGameState: () => {},
  takeTurn: () => {},
  drawDungeonCard: () => null,
  endDungeonExpedition: () => {},
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
            player.resources[payload.selectedResources[0]] += 1;
            player.resources[payload.selectedResources[1]] += 1;
            player.resources[payload.selectedResources[2]] += 1;
          }
          break;
        case 'convertResourcesToMana':
          player.resources[payload.resource] -= payload.quantity;
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
            switch (payload.action) {
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
                const newSpells = spellDeck.splice(0, 4);
                player.spells.push(...newSpells.map(s => ({ ...s, isCast: false })));
                gameState.spellsOnOffer.push(...spellDeck.splice(0, 4));
                break;
              case 'enterDungeon':
                player.dungeonHits = 0;
                player.dungeonTreasures = [];
                break;
              default:
                break;
            }
            player.familiars.push(familiar);
            newPlayers = newPlayers.map(p => {
              if (p.id === playerId) return player;
              return p;
            });
            gameState.familiarsOnOffer = gameState.familiarsOnOffer.filter(f => f.id !== familiar.id);
            if (gameState.familiarDeck.length > 0) {
              const newFamiliar = gameState.familiarDeck.pop();
              if (newFamiliar) {
                gameState.familiarsOnOffer.push(newFamiliar);
              }
            }
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

  return (
    <GameStateContext.Provider value={{ gameState, setGameState, takeTurn, drawDungeonCard, endDungeonExpedition }}>
      {children}
    </GameStateContext.Provider>
  );
};
