// src/gameLogic.ts
import { useGameState } from './contexts/GameStateContext';

export const useGameLogic = () => {
  const { gameState, setGameState } = useGameState();

  const takeTurn = (playerId: string, action: string) => {
    // Implement the logic for a player taking a turn
    // Example: Update resources, cast a spell, etc.

    // Find the player
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    // Example action: gain resources
    if (action === 'gainResources') {
      player.resources.gold += 10;
      player.resources.crystals += 5;
      player.resources.essence += 2;
    }

    // Update the game state
    setGameState({
      ...gameState,
      players: gameState.players.map(p =>
        p.id === playerId ? player : p
      ),
    });
  };

  return { takeTurn };
};
