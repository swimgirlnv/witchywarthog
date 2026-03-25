import React from 'react';
import { Familiar } from '../../contexts/GameStateContext';
import './Familiar.css';

const MANA_ICON = 'https://i.imgur.com/z9Gxixc.png';
const REAGENT_ICONS: Record<string, string> = {
  mandrake:   'https://i.imgur.com/OBRVBHq.png',
  nightshade: 'https://i.imgur.com/IE7UC04.png',
  foxglove:   'https://i.imgur.com/Wm2Qha4.png',
  toadstool:  'https://i.imgur.com/eQyoGQP.png',
  horn:       'https://i.imgur.com/1zn1W9K.png',
};

interface FamiliarCardProps {
  familiar: Familiar;
  onSelect: () => void;
  selected: boolean;
}

const FamiliarCard: React.FC<FamiliarCardProps> = ({ familiar, onSelect, selected }) => {
  const gather = Object.entries(familiar.gather).filter(([, qty]) => qty > 0);
  const reagentCost = Object.entries(familiar.reagentCost).filter(([, qty]) => qty > 0);

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
          <b className="back-name">{familiar.name}</b>
          {/* <p className="back-desc">{familiar.description}</p> */}
          {gather.length > 0 && (
            <div className="cast-cost">
              <span className="cast-cost-label">Gathers</span>
              {gather.map(([reagent, qty]) => (
                <span key={reagent} className="cast-reagent">
                  <img src={REAGENT_ICONS[reagent]} alt={reagent} />
                  ×{qty}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamiliarCard;
