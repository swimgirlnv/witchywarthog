import React from 'react';
import { Familiar } from '../../contexts/GameStateContext';

interface FamiliarCardProps {
  familiar: Familiar;
  onSelect: () => void;
}

const FamiliarCard: React.FC<FamiliarCardProps> = ({ familiar, onSelect }) => {

  return (
    <div className="familiar-card" onClick={onSelect}>
      <img src={familiar.image} alt={familiar.name} className='familiar-image'/>
      <div className="familiar-details">
        <b>{familiar.name}</b>
        <p>{familiar.description}</p>
        <p>{familiar.power}</p>
        <p hidden={familiar.cost == '0'}>Cost: {familiar.cost} Mana</p>
      </div>
    </div>
  );
};

export default FamiliarCard;
