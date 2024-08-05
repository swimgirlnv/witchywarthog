import React from 'react';
import { Spell } from '../contexts/GameStateContext';

interface SpellCardProps {
  spell: Spell;
  onSelect: () => void;
}

const SpellCard: React.FC<SpellCardProps> = ({ spell, onSelect }) => {
  return (
    <div className="spell-card" onClick={onSelect}>
      <img src={spell.image} alt={spell.name} className="spell-image" />
      <div className="spell-details">
        <h3>{spell.name}</h3>
        <p>{spell.description}</p>
        <p hidden={spell.cost == '0'}>Cost: {spell.cost} Mana</p>
      </div>
    </div>
  );
};

export default SpellCard;
