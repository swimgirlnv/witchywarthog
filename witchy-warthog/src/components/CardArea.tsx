import React from 'react';

interface Card {
  id: string;
  name: string;
  description: string;
}

interface CardAreaProps {
  title: string;
  cards: Card[];
}

const CardArea: React.FC<CardAreaProps> = ({ title, cards }) => {
  return (
    <div className="card-area">
      <h2>{title}</h2>
      <div className="cards">
        {cards.map(card => (
          <div key={card.id} className="card">
            <b>{card.name}</b>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardArea;
