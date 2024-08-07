import React from 'react';
import { DungeonCard } from '../../contexts/GameStateContext';
import './Dungeon.css';

interface DungeonModalProps {
  dungeonCardsDrawn: DungeonCard[];
  onDrawCard: () => void;
  onEndExpedition: () => void;
}

const DungeonModal: React.FC<DungeonModalProps> = ({ dungeonCardsDrawn, onDrawCard, onEndExpedition }) => {
  return (
    <div className="dungeon-container">
      <div className="dungeon-modal">
        <div className="dungeon-content">
          <h3>Dungeon Expedition</h3>
          <button onClick={onDrawCard}>Draw Dungeon Card</button>
          <button onClick={onEndExpedition}>End Expedition</button>
          <div className="dungeon-cards">
            {dungeonCardsDrawn.map(card => (
              <div key={card.id} className={`dungeon-card ${card.type}`}>
                <img src={card.image} alt={card.description} />
                <p>{card.description}</p>
                {card.type === 'treasure' && <p>Value: {card.value}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DungeonModal;
