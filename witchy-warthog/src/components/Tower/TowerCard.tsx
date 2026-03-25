import React from 'react';
import { Tower } from '../../contexts/GameStateContext';
import './Tower.css';

const GOLD_ICON = 'https://i.imgur.com/plvPmY5.png';
const REAGENT_ICONS: Record<string, string> = {
  mandrake:   'https://i.imgur.com/OBRVBHq.png',
  nightshade: 'https://i.imgur.com/IE7UC04.png',
  foxglove:   'https://i.imgur.com/Wm2Qha4.png',
  toadstool:  'https://i.imgur.com/eQyoGQP.png',
  horn:       'https://i.imgur.com/1zn1W9K.png',
};

interface TowerCardProps {
  tower: Tower;
  onSelect: () => void;
  selected: boolean;
}

const TowerCard: React.FC<TowerCardProps> = ({ tower, onSelect, selected }) => {
  const reagentCost = Object.entries(tower.reagentCost).filter(([, qty]) => qty > 0);

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
          {reagentCost.length > 0 && (
            <>
              <span className="cost-or">or</span>
              <div className="card-cost">
                {reagentCost.map(([reagent, qty]) => (
                  <span key={reagent} className="reagent-cost-item">
                    <img src={REAGENT_ICONS[reagent]} alt={reagent} className="cost-icon" />
                    <span>{qty}</span>
                  </span>
                ))}
              </div>
            </>
          )}
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
