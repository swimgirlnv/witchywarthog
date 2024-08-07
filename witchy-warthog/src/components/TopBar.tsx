import React from 'react';
import { useGameState } from '../contexts/GameStateContext';

const TopBar: React.FC = () => {
  const { gameState } = useGameState();

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login clicked");
  };

  return (
    <div className="top-bar">
      <div className="game-title">Witchy Warthog</div>
      <div className="game-status">
        {gameState ? (
          <div className="resource-status">
            <span>Mandrake Root: {gameState.resources.mandrake}</span>
            <span>Nightshade: {gameState.resources.nightshade}</span>
            <span>Foxglove: {gameState.resources.foxglove}</span>
            <span>Toadstool: {gameState.resources.toadstool}</span>
            <span>Horn: {gameState.resources.horn}</span>
            <span>Gold: {gameState.resources.gold}</span>
            <span>Mana: {gameState.resources.mana}</span>
          </div>
        ) : null}
      </div>
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default TopBar;
