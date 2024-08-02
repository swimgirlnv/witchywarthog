// src/gameLogic.ts
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from './firebaseConfig';
import { useGameState } from './contexts/GameStateContext';

export const useGameLogic = () => {
  const { gameState, setGameState } = useGameState();

  const startGame = async () => {
    // Initialize game state in Firestore
    await setDoc(doc(db, "games", "gameId"), { gameState });
  };

  const listenForChanges = () => {
    onSnapshot(doc(db, "games", "gameId"), (doc) => {
      setGameState(doc.data()?.gameState);
    });
  };

  return {
    startGame,
    listenForChanges,
    // other game actions
  };
};
