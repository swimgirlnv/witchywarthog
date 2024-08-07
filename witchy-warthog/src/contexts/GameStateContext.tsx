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

export interface ResourceCard {
  id: string;
  gather: ResourceOptions;
  increase: ResourceOptions;
}

export interface Power {
  id: string;
  name: string;
  description: string;
  image: string;
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

const powers: Power[] = [
  { id: 'conjuring', name: 'Conjuring', description: 'Summoning creatures and objects', image: 'https://i.imgur.com/a4RpdV0.png' },
  { id: 'sorcery', name: 'Sorcery', description: 'Casting powerful spells', image: 'https://i.imgur.com/wIuKR49.png' },
  { id: 'alchemy', name: 'Alchemy', description: 'Transmuting substances', image: 'https://i.imgur.com/oKHPi2G.png' },
  { id: 'enchantment', name: 'Enchantment', description: 'Imbuing objects with magic', image: 'https://i.imgur.com/0TCztl1.png' },
  { id: 'druidry', name: 'Druidry', description: 'Harnessing nature\'s power', image: 'https://i.imgur.com/L1kniUc.png' },
  { id: 'thaumaturgy', name: 'Thaumaturgy', description: 'Performing miracles and wonders', image: 'https://i.imgur.com/eotB4wd.png' },
  { id: 'necromancy', name: 'Necromancy', description: 'Communicating with the dead', image: 'https://i.imgur.com/n4UFpM6.png' },
];

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

const getRandomPower = (): Power => {
  return powers[Math.floor(Math.random() * powers.length)];
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
  towerDeck: towerDeck.map(tower => ({ ...tower, power: getRandomPower() })),
  towersOnOffer: towersOnOffer.map(tower => ({ ...tower, power: getRandomPower() })),
  wizardDeck: wizardDeck.map(wizard => ({ ...wizard, power: getRandomPower() })),
  wizardsOnOffer: wizardsOnOffer.map(wizard => ({ ...wizard, power: getRandomPower() })),
  familiarDeck: familiarDeck.map(familiar => ({ ...familiar, power: getRandomPower() })),
  familiarsOnOffer: familiarsOnOffer.map(familiar => ({ ...familiar, power: getRandomPower() })),
  spellDeck: spellDeck.map(spell => ({ ...spell, power: getRandomPower(), cost: generateRandomResources() })),
  spellsOnOffer: spellsOnOffer.map(spell => ({ ...spell, power: getRandomPower(), cost: generateRandomResources() })),
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
