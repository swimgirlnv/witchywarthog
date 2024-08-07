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
  return (
    <div className="card-area">
      <h2>{title}</h2>
      <div className="cards">
        {cards.map(card => (
          <div key={card.id} className="card">
            <img src={card.image} alt={card.name} className="card-image" />
            <b>{card.name}</b>
            <p>{card.description}</p>
            <p style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <img className="card-power-image" src={card.power.image} />{card.power.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardArea;
