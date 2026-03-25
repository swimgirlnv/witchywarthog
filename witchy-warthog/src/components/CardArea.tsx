import React from 'react';
import { Power } from '../contexts/GameStateContext';

interface Card {
  id: string;
  name: string;
  description: string;
  image: string;
  power: Power;
}

interface CardAreaProps {
  title: string;
  cards: Card[];
}

const CardArea: React.FC<CardAreaProps> = ({ title, cards }) => {
  const previewCards = cards.slice(0, 6);
  const captionCards = cards.slice(0, 3);
  const remainingCaptionCount = cards.length - captionCards.length;

  return (
    <div className="card-area">
      <div className="card-area-header">
        <h2>{title}</h2>
        <span className="card-count">{cards.length}</span>
      </div>
      {cards.length > 0 ? (
        <>
          <div className={`card-stack ${cards.length > 4 ? 'dense' : ''}`}>
            {previewCards.map((card, index) => (
              <div
                key={card.id}
                className="card-stack-item"
                style={{ '--stack-index': index } as React.CSSProperties}
                title={`${card.name} • ${card.power.name}${card.description ? ` • ${card.description}` : ''}`}
              >
                <img src={card.image} alt={card.name} className="card-image" />
                <img className="card-power-image" src={card.power.image} alt={card.power.name} />
              </div>
            ))}
            {cards.length > previewCards.length && (
              <div className="card-stack-more">+{cards.length - previewCards.length}</div>
            )}
          </div>
          <p className="card-area-caption">
            {captionCards.map(card => card.name).join(', ')}
            {remainingCaptionCount > 0 ? ` +${remainingCaptionCount} more` : ''}
          </p>
        </>
      ) : (
        <div className="card-stack empty">
          <span>No cards yet</span>
        </div>
      )}
    </div>
  );
};

export default CardArea;
