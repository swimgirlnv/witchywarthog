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
  towerDeck: [
    { id: 'tower1', name: 'Crimson Bastion', description: 'A crimson fortress', power: '', cost: '1', image: 'https://i.imgur.com/jwUmGqI.png' },
    { id: 'tower2', name: 'Azure Keep', description: 'Lair of blue', power: '', cost: '1', image: 'https://i.imgur.com/2TPro9X.png' },
    { id: 'tower3', name: 'Golden Spire', description: '', power: '', cost: '1', image: 'https://i.imgur.com/716fASE.png' },
    { id: 'tower4', name: 'Emerald Citadel', description: '', power: '', cost: '1', image: 'https://i.imgur.com/fVHcF7U.png' },
    { id: 'tower5', name: 'Violet Stronghold', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' }, //beginning of placeholders
    { id: 'tower6', name: 'Amber Tower', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower7', name: 'Ivory Fortress', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower8', name: 'Obsidian Keep', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower9', name: 'Cerulean Spire', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower10', name: 'Ruby Citadel', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower11', name: 'Topaz Stronghold', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower12', name: 'Peridot Tower', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower13', name: 'Amethyst Fortress', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower14', name: 'Bone Keep', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower15', name: 'Crystal Spire', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower16', name: 'Diamond Citadel', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower17', name: 'Ebony Stronghold', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower18', name: 'Frost Tower', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower19', name: 'Garnet Fortress', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower20', name: 'Horn Keep', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower21', name: 'Iron Spire', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower22', name: 'Jade Citadel', description: '', power: '', cost: '1', image: 'https://i.imgur.com/1zn1W9K.png' },
    // Add more towers as needed
  ],
  towersOnOffer: [
    { id: 'tower1', name: 'Crimson Bastion', description: 'A crimson fortress', power: '', cost: '1', image: 'https://i.imgur.com/jwUmGqI.png' },
    { id: 'tower2', name: 'Azure Keep', description: 'Lair of blue', power: '', cost: '1', image: 'https://i.imgur.com/2TPro9X.png' },
  ],
  wizardDeck: [
    { id: 'wizard1', name: 'Witchy Warthog', description: 'A powerful wizard', power: '', image: 'https://i.imgur.com/0zaAlS0.png' },
    { id: 'wizard2', name: 'Salmon Sorcerer', description: 'A wise wizard', power: '', image: 'https://i.imgur.com/Vj8FHHb.png' },
    { id: 'wizard3', name: 'Bear Battlemage', description: 'A fiery wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard4', name: 'Dragon Druid', description: 'A gentle wizard', power: '', image: 'https://i.imgur.com/w1wEqgi.png' },
    { id: 'wizard5', name: 'Giraffe Geomancer', description: 'An earthy wizard', power: '', image: 'https://i.imgur.com/PrIQBeq.png' }, //beginning of placeholders
    { id: 'wizard6', name: 'Elephant Enchanter', description: 'A magical wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard7', name: 'Kangaroo Kinetist', description: 'A kinetic wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard8', name: 'Lion Luminator', description: 'A radiant wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard9', name: 'Monkey Mesmerist', description: 'A mesmerizing wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard10', name: 'Narwhal Necromancer', description: 'A spooky wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard11', name: 'Owl Oracle', description: 'A wise wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard12', name: 'Penguin Pyrotechnician', description: 'An explosive wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard13', name: 'Quokka Quantumist', description: 'A quantum wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard14', name: 'Raccoon Runemaster', description: 'A runic wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard15', name: 'Sloth Sorcerer', description: 'A slow wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard16', name: 'Tiger Telekinetic', description: 'A telekinetic wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard17', name: 'Unicorn Usurper', description: 'A usurping wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard18', name: 'Vulture Vexer', description: 'A vexing wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard19', name: 'Walrus Warlock', description: 'A warlike wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard20', name: 'Xerus Xenomancer', description: 'An alien wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard21', name: 'Yak Yeller', description: 'A loud wizard', power: '', image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard22', name: 'Zebra Zapper', description: 'A zapping wizard', power: '', image: 'https://i.imgur.com/8jQbB9X.png' }, // this one is done
    // Add more wizards as needed
  ],
  wizardsOnOffer: [
    { id: 'wizard1', name: 'Witchy Warthog', description: 'A powerful wizard', power: '', image: 'https://i.imgur.com/0zaAlS0.png' },
    { id: 'wizard2', name: 'Salmon Sorcerer', description: 'A wise wizard', power: '', image: 'https://i.imgur.com/Vj8FHHb.png' },
  ],
  familiarDeck: [],
  familiarsOnOffer: [],
  spellDeck: [],
  spellsOnOffer: [],
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
