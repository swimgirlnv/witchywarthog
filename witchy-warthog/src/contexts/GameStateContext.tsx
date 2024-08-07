import React, { createContext, useState, useContext, ReactNode } from 'react';
import { towerDeck, towersOnOffer } from '../cardLists/towers';
import { wizardDeck, wizardsOnOffer } from '../cardLists/wizards';
import { familiarDeck, familiarsOnOffer } from '../cardLists/familiars';
import { spellDeck, spellsOnOffer } from '../cardLists/spells';
import { resourceDeck } from '../cardLists/resources';

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
  cost: string;
  image: string;
}

export interface Tower {
  id: string;
  name: string;
  description: string;
  power: Power;
  cost: string;
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
      resources: { mandrake: 0, nightshade: 0, foxglove: 0, toadstool: 0, horn: 0, gold: 0, mana: 0 },
      spells: [],
      wizards: [],
      familiars: [],
      towers: [],
      resourceCards: resourceDeck.slice(0, 3),
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
};

const GameStateContext = createContext<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  takeTurn: (playerId: string, action: string, payload: any) => void; // Add takeTurn here
}>({
  gameState: defaultState,
  setGameState: () => {},
  takeTurn: () => {}, // Add default noop implementation
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
          if (tower && player.resources.gold >= parseInt(tower.cost)) {
            player.towers.push(tower);
            player.resources.gold -= parseInt(tower.cost);
            newPlayers = newPlayers.map(p => {
              if (p.id === playerId) return player;
              return p;
            });
          }
          break;
        default:
          break;
      }

      return {
        ...prevState,
        players: newPlayers,
        towersOnOffer: prevState.towerDeck.length > 0 ? [prevState.towerDeck[0]] : [],
        towerDeck: prevState.towerDeck.slice(1),
      };
    });
  };

  return (
    <GameStateContext.Provider value={{ gameState, setGameState, takeTurn }}>
      {children}
    </GameStateContext.Provider>
  );
};
