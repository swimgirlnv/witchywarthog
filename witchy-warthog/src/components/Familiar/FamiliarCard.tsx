import React from 'react';
import { Familiar } from '../../contexts/GameStateContext';
import './Familiar.css';

interface FamiliarCardProps {
  familiar: Familiar;
  onSelect: () => void;
  selected: boolean;
}

const FamiliarCard: React.FC<FamiliarCardProps> = ({ familiar, onSelect, selected }) => {
  return (
    <div className={`familiar-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <img src={familiar.image} alt={familiar.name} className="familiar-image" />
      <div className="familiar-details">
        <b>{familiar.name}</b>
        <p>{familiar.description}</p>
        <p>Mana Cost: {familiar.cost}</p>
        <img src={familiar.power.image} alt={familiar.power.name} className="power-icon" />
        <div className="tooltip">{familiar.power.name}</div>
      </div>
    </div>
  );
};

export default FamiliarCard;
