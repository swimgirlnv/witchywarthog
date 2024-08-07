import React from 'react';
import { Wizard } from '../../contexts/GameStateContext';
import './Wizard.css';

interface WizardCardProps {
  wizard: Wizard;
  onSelect: () => void;
  isSelected: boolean;
}

const WizardCard: React.FC<WizardCardProps> = ({ wizard, onSelect }) => {

  return (
    <div className="wizard-card" onClick={onSelect}>
      <img src={wizard.power.image} alt={wizard.power.name} className="power-icon" />
      <img src={wizard.image} alt={wizard.name} className='wizard-image' />
      <div className="tooltip">{wizard.power.name}</div>
      <div className="wizard-details">
        <b>{wizard.name}</b>
        <p>{wizard.description}</p>
      </div>
    </div>
  );
};

export default WizardCard;
