import React from 'react';
import { Wizard } from '../contexts/GameStateContext';

interface WizardCardProps {
  wizard: Wizard;
  onSelect: () => void;
}

const WizardCard: React.FC<WizardCardProps> = ({ wizard, onSelect }) => {
    const wizardImages: { [key: string]: string } = {
        wizard0: "https://i.imgur.com/178eULE.png",
        wizard1: "https://i.imgur.com/0zaAlS0.png",
        wizard2: "https://i.imgur.com/Vj8FHHb.png",
        wizard3: "https://i.imgur.com/w1wEqgi.png",
        wizard4: "https://i.imgur.com/PrIQBeq.png",
      };

  return (
    <div className="wizard-card" onClick={onSelect}>
      <img src={wizard.image} alt={wizard.name} className='wizard-image'/>
      <div className="wizard-details">
        <h3>{wizard.name}</h3>
        <p>{wizard.description}</p>
        <p>{wizard.power}</p>
      </div>
    </div>
  );
};

export default WizardCard;
