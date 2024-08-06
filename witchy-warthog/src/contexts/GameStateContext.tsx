import React, { createContext, useState, useContext, ReactNode } from 'react';
import { towerDeck, towersOnOffer } from '../cardLists/towers';
import { wizardDeck, wizardsOnOffer } from '../cardLists/wizards';
import { familiarDeck, familiarsOnOffer } from '../cardLists/familiars';
import { spellDeck, spellsOnOffer } from '../cardLists/spells';

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
  cost: string;
  isCast: boolean;
  image: string;
}

export interface Wizard {
  id: string;
  name: string;
  description: string;
  power: string;
  image: string;
}

export interface Familiar {
  id: string;
  name: string;
  description: string;
  power: string;
  cost: string;
  image: string;
}

export interface Tower {
  id: string;
  name: string;
  description: string;
  power: string;
  cost: string;
  image: string;
}

interface ResourceOptions {
  [key: string]: number;
  mandrake: number;
  nightshade: number;
  foxglove: number;
  toadstool: number;
  horn: number;
}

interface ResourceCard {
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
      resourceCards: [
        { id: 'card1', gather: { mandrake: 1, nightshade: 1, foxglove: 1, toadstool: 0, horn: 0 }, increase: { mandrake: 1, nightshade: 1, foxglove: 0, toadstool: 0, horn: 0 } },
        { id: 'card2', gather: { mandrake: 0, nightshade: 1, foxglove: 1, toadstool: 1, horn: 0 }, increase: { mandrake: 0, nightshade: 0, foxglove: 1, toadstool: 1, horn: 0 } },
        { id: 'card3', gather: { mandrake: 1, nightshade: 0, foxglove: 0, toadstool: 1, horn: 1 }, increase: { mandrake: 1, nightshade: 0, foxglove: 0, toadstool: 0, horn: 1 } },
      ],
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
}>({
  gameState: defaultState,
  setGameState: () => {},
});

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(defaultState);

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};
