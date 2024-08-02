// src/contexts/GameStateContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface GameState {
  players: Player[];
  resources: Resources;
  spells: Spell[];
  wizards: Wizard[];
  // other game elements
}

interface Player { /* player properties */ }
interface Resources { /* resources properties */ }
interface Spell { /* spell properties */ }
interface Wizard { /* wizard properties */ }

const defaultState: GameState = {
  players: [],
  resources: {},
  spells: [],
  wizards: [],
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
