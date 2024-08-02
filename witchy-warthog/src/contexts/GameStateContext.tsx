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

interface Player {
  id: string;
  name: string;
  resources: Resources;
  spells: Spell[];
  wizards: Wizard[];
  familiars: Familiar[];
}

interface GameState {
  players: Player[];
  resources: Resources;
  spells: Spell[];
  wizards: Wizard[];
  familiars: Familiar[];
  towers: Tower[];
}

const defaultState: GameState = {
  players: [],
  resources: { mandrake: 0, nightshade: 0, foxglove: 0, toadstool: 0, horn: 0, gold: 0, mana: 0 },
  spells: [],
  wizards: [],
  familiars: [],
  towers: [],
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
