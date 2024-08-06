import React from 'react';
import { Wizard } from '../../contexts/GameStateContext';

interface WizardCardProps {
  wizard: Wizard;
  onSelect: () => void;
}

const WizardCard: React.FC<WizardCardProps> = ({ wizard, onSelect }) => {

  return (
    <div className="wizard-card" onClick={onSelect}>
      <img src={wizard.image} alt={wizard.name} className='wizard-image'/>
      <div className="wizard-details">
        <b>{wizard.name}</b>
        <p>{wizard.description}</p>
        <p>{wizard.power}</p>
      </div>
    </div>
  );
};

export default WizardCard;
