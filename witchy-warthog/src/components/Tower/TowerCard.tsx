import React from 'react';
import { Tower } from '../../contexts/GameStateContext';
import './Tower.css';

const GOLD_ICON = 'https://i.imgur.com/plvPmY5.png';

interface TowerCardProps {
  tower: Tower;
  onSelect: () => void;
  selected: boolean;
}

const TowerCard: React.FC<TowerCardProps> = ({ tower, onSelect, selected }) => {
  return (
    <div className={`tower-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      {/* School badge — always visible, outside the flip */}
      <div className="school-badge">
        <img src={tower.power.image} alt={tower.power.name} />
        <span className="school-badge-tooltip">{tower.power.name}</span>
      </div>

      <div className="card-inner">
        <div className="card-face card-front">
          <img src={tower.image} alt={tower.name} className="tower-image" />
          <div className="card-cost">
            <img src={GOLD_ICON} alt="gold" className="cost-icon" />
            <span>{tower.cost}</span>
          </div>
        </div>
        <div className="card-face card-back">
          <b className="back-name">{tower.name}</b>
          <p className="back-desc">{tower.description}</p>
        </div>
      </div>
    </div>
  );
};

export default TowerCard;
