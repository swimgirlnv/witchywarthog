import React from 'react';
import { Tower } from '../../contexts/GameStateContext';

interface TowerCardProps {
  tower: Tower;
  onSelect: () => void;
}

const TowerCard: React.FC<TowerCardProps> = ({ tower, onSelect }) => {

  return (
    <div className="tower-card" onClick={onSelect}>
      <img src={tower.image} alt={tower.name} className='tower-image'/>
      <div className="tower-details">
        <b>{tower.name}</b>
        <p>{tower.description}</p>
        <p>{tower.power}</p>
        <p hidden={tower.cost == '0'}>Cost: {tower.cost} Gold Coins</p>
      </div>
    </div>
  );
};

export default TowerCard;
