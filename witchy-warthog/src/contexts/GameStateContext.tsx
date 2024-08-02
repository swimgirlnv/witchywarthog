import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Resources {
  mandrake: number;
  nightshade: number;
  foxglove: number;
  toadstool: number;
  horn: number;
  gold: number;
  mana: number;
}

interface Spell {
  id: string;
  name: string;
  description: string;
  cost: Resources;
  isCast: boolean;
}

interface Wizard {
  id: string;
  name: string;
  description: string;
  power: number;
}

interface Familiar {
  id: string;
  name: string;
  description: string;
  ability: string;
}

interface Tower {
  id: string;
  name: string;
  description: string;
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
  spells: Spell[];
  wizards: Wizard[];
  familiars: Familiar[];
  towers: Tower[];
  wizardDeck: Wizard[];
  wizardsOnOffer: Wizard[];
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
  spells: [],
  wizards: [],
  familiars: [],
  towers: [],
  wizardDeck: [
    { id: 'wizard1', name: 'Witchy Warthog', description: 'A powerful wizard', power: 5 },
    { id: 'wizard2', name: 'Salmon Sorcerer', description: 'A wise wizard', power: 3 },
    { id: 'wizard3', name: 'Bear Battlemage', description: 'A fiery wizard', power: 4 },
    { id: 'wizard4', name: 'Dragon Druid', description: 'A gentle wizard', power: 2 },
    { id: 'wizard5', name: 'Giraffe Geomancer', description: 'An earthy wizard', power: 3 },
    { id: 'wizard6', name: 'Elephant Enchanter', description: 'A magical wizard', power: 4 },
    { id: 'wizard7', name: 'Kangaroo Kinetist', description: 'A kinetic wizard', power: 3 },
    { id: 'wizard8', name: 'Lion Luminator', description: 'A radiant wizard', power: 5 },
    { id: 'wizard9', name: 'Monkey Mesmerist', description: 'A mesmerizing wizard', power: 4 },
    { id: 'wizard10', name: 'Narwhal Necromancer', description: 'A spooky wizard', power: 3 },
    { id: 'wizard11', name: 'Owl Oracle', description: 'A wise wizard', power: 5 },
    { id: 'wizard12', name: 'Penguin Pyrotechnician', description: 'An explosive wizard', power: 4 },
    { id: 'wizard13', name: 'Quokka Quantumist', description: 'A quantum wizard', power: 3 },
    { id: 'wizard14', name: 'Raccoon Runemaster', description: 'A runic wizard', power: 4 },
    { id: 'wizard15', name: 'Sloth Sorcerer', description: 'A slow wizard', power: 2 },
    { id: 'wizard16', name: 'Tiger Telekinetic', description: 'A telekinetic wizard', power: 3 },
    { id: 'wizard17', name: 'Unicorn Usurper', description: 'A usurping wizard', power: 4 },
    { id: 'wizard18', name: 'Vulture Vexer', description: 'A vexing wizard', power: 3 },
    { id: 'wizard19', name: 'Walrus Warlock', description: 'A warlike wizard', power: 4 },
    { id: 'wizard20', name: 'Xerus Xenomancer', description: 'An alien wizard', power: 3 },
    { id: 'wizard21', name: 'Yak Yeller', description: 'A loud wizard', power: 4 },
    { id: 'wizard22', name: 'Zebra Zapper', description: 'A zapping wizard', power: 3 },
    // Add more wizards as needed
  ],
  wizardsOnOffer: [
    { id: 'wizard1', name: 'Witchy Warthog', description: 'A powerful wizard', power: 5 },
    { id: 'wizard2', name: 'Salmon Sorcerer', description: 'A wise wizard', power: 3 },
  ],
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
