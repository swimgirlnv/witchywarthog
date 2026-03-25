import React from 'react';
import { Familiar } from '../../contexts/GameStateContext';
import './Familiar.css';

const MANA_ICON = 'https://i.imgur.com/z9Gxixc.png';

interface FamiliarCardProps {
  familiar: Familiar;
  onSelect: () => void;
  selected: boolean;
}

const FamiliarCard: React.FC<FamiliarCardProps> = ({ familiar, onSelect, selected }) => {
  return (
    <div className={`familiar-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      {/* School badge — always visible, outside the flip */}
      <div className="school-badge">
        <img src={familiar.power.image} alt={familiar.power.name} />
        <span className="school-badge-tooltip">{familiar.power.name}</span>
      </div>

      <div className="card-inner">
        <div className="card-face card-front">
          <img src={familiar.image} alt={familiar.name} className="familiar-image" />
          <div className="card-cost">
            <img src={MANA_ICON} alt="mana" className="cost-icon" />
            <span>{familiar.cost}</span>
          </div>
        </div>
        <div className="card-face card-back">
          <b className="back-name">{familiar.name}</b>
          <p className="back-desc">{familiar.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FamiliarCard;
