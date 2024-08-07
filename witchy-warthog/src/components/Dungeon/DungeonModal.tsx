import React, { useState } from 'react';
import { DungeonCard, useGameState } from '../../contexts/GameStateContext';
import Modal from 'react-modal';
import './Dungeon.css';

const DungeonModal: React.FC<{ isOpen: boolean; onRequestClose: () => void }> = ({ isOpen, onRequestClose }) => {
  const { gameState, setGameState } = useGameState();
  const [dungeonCards, setDungeonCards] = useState<DungeonCard[]>([]);
  const [hits, setHits] = useState<number>(0);
  const [treasure, setTreasure] = useState<DungeonCard[]>([]);

  const handleDrawCard = () => {
    const card = gameState.dungeonDeck.pop();
    if (card) {
      setDungeonCards([...dungeonCards, card]);
      if (card.type === 'monster') {
        setHits(hits + 1);
        if (hits + 1 >= 2) {
          alert('You have been defeated in the dungeon!');
          setDungeonCards([]);
          setHits(0);
          setTreasure([]);
          onRequestClose();
        }
      } else {
        setTreasure([...treasure, card]);
      }
    }
  };

  const handleEndExpedition = () => {
    setGameState(prevState => {
      const player = prevState.players.find(p => p.id === 'player1');
      if (!player) return prevState;

      player.resources.gold += treasure.filter(card => card.type === 'treasure').length;

      return {
        ...prevState,
        players: prevState.players.map(p => (p.id === 'player1' ? player : p)),
        dungeonDeck: [...prevState.dungeonDeck, ...dungeonCards.filter(card => card.type === 'monster')],
      };
    });
    setDungeonCards([]);
    setHits(0);
    setTreasure([]);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Dungeon Expedition">
      <h2>Dungeon Expedition</h2>
      <div className="dungeon-cards">
        {dungeonCards.map((card, index) => (
          <div key={index} className="dungeon-card">
            <img src={card.image} alt={card.description} />
            <p>{card.description}</p>
          </div>
        ))}
      </div>
      <button onClick={handleDrawCard}>Draw Card</button>
      <button onClick={handleEndExpedition}>End Expedition</button>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default DungeonModal;
