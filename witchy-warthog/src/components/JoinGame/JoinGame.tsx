import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinGame.css'; // Add your styles here
import { useGameState } from '../../contexts/GameStateContext';

const JoinGame: React.FC = () => {
  const [gameCode, setGameCode] = useState('');
  const { gameState, setGameState } = useGameState();
  const navigate = useNavigate();

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to join a game using the gameCode
    console.log(`Joining game with code: ${gameCode}`);
    navigate('/game');
  };

  return (
    <div className="join-game">
      <div className="join-game-container">
        <h1>Join a Game</h1>
        <form onSubmit={handleJoinGame}>
          <input
            type="text"
            placeholder="Game Code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            required
          />
          <button type="submit">Join Game</button>
        </form>
      </div>
    </div>
  );
};

export default JoinGame;
