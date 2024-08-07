import React from 'react';
import { Familiar } from '../../contexts/GameStateContext';
import './Familiar.css';

interface FamiliarCardProps {
  familiar: Familiar;
  onSelect: () => void;
}

const FamiliarCard: React.FC<FamiliarCardProps> = ({ familiar, onSelect }) => {

  return (
    <div className="familiar-card" onClick={onSelect}>
      <img src={familiar.power.image} alt={familiar.power.name} className="power-icon" />
      <img src={familiar.image} alt={familiar.name} className='familiar-image' />
      <div className="tooltip">{familiar.power.name}</div>
      <div className="familiar-details">
        <b>{familiar.name}</b>
        <p>{familiar.description}</p>
        <p hidden={familiar.cost == '0'}>Cost: {familiar.cost}</p>
      </div>
    </div>
  );
};

export default FamiliarCard;
