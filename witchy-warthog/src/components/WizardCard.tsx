import React from 'react';

interface WizardCardProps {
  wizard: {
    id: string;
    name: string;
    description: string;
    power: number;
  };
  onSelect: () => void;
}

const WizardCard: React.FC<WizardCardProps> = ({ wizard, onSelect }) => {
    const wizardImages: { [key: string]: string } = {
        wizard1: "https://i.imgur.com/0zaAlS0.png",
        wizard2: "https://i.imgur.com/Vj8FHHb.png",
        wizard3: "https://i.imgur.com/w1wEqgi.png",
        wizard4: "https://i.imgur.com/PrIQBeq.png",
      };

  return (
    <div className="wizard-card" onClick={onSelect}>
      <img src={wizardImages[wizard.id]} alt={wizard.name} className='wizard-image'/>
      <div className="wizard-details">
        <h3>{wizard.name}</h3>
        <p>{wizard.description}</p>
        <p>Power: {wizard.power}</p>
      </div>
    </div>
  );
};

export default WizardCard;
