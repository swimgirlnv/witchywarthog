import React from 'react';
import { Wizard } from '../../contexts/GameStateContext';
import './Wizard.css';

const MANA_ICON = 'https://i.imgur.com/z9Gxixc.png';

interface WizardCardProps {
  wizard: Wizard;
  onSelect: () => void;
  selected: boolean;
}

const WizardCard: React.FC<WizardCardProps> = ({ wizard, onSelect, selected }) => {
  return (
    <div className={`wizard-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      {/* School badge — always visible, outside the flip */}
      <div className="school-badge">
        <img src={wizard.power.image} alt={wizard.power.name} />
        <span className="school-badge-tooltip">{wizard.power.name}</span>
      </div>

      <div className="card-inner">
        <div className="card-face card-front">
          <img src={wizard.image} alt={wizard.name} className="wizard-image" />
          <div className="card-cost">
            <img src={MANA_ICON} alt="mana" className="cost-icon" />
            <span>Bid</span>
          </div>
        </div>
        <div className="card-face card-back">
          <b className="back-name">{wizard.name}</b>
          <p className="back-desc">{wizard.description}</p>
        </div>
      </div>
    </div>
  );
};

export default WizardCard;
