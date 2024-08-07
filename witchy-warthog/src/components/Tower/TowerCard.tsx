import React from 'react';
import { Tower } from '../../contexts/GameStateContext';
import './Tower.css';

interface TowerCardProps {
  tower: Tower;
  onSelect: () => void;
  isSelected: boolean;
}

const TowerCard: React.FC<TowerCardProps> = ({ tower, onSelect }) => {

  return (
    <div className="tower-card" onClick={onSelect}>
      <img src={tower.power.image} alt={tower.power.name} className="power-icon" />
      <img src={tower.image} alt={tower.name} className='tower-image' />
      <div className="tooltip">{tower.power.name}</div>
      <div className="tower-details">
        <b>{tower.name}</b>
        <p>{tower.description}</p>
        <p hidden={tower.cost == 0}>Cost: {tower.cost} Gold Coins</p>
      </div>
    </div>
  );
};

export default TowerCard;
