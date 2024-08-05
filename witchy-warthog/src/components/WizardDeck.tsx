import React from 'react';
import WizardCard from './WizardCard';
import { Wizard } from '../contexts/GameStateContext';

interface WizardDeckProps {
  wizards: Wizard[];
  onSelectWizard: (id: string) => void;
}

const faceDownCard: Wizard = {
  id: 'wizard0',
  name: '',
  description: '',
  power: '',
  image: 'https://i.imgur.com/178eULE.png'
};

const WizardDeck: React.FC<WizardDeckProps> = ({ wizards, onSelectWizard }) => {
  // Ensure there are at least 2 wizards to display after the face-down card
  const visibleWizards = wizards.slice(0, 2);

  return (
    <div className="wizard-deck">
      <WizardCard key={faceDownCard.id} wizard={faceDownCard} onSelect={() => null} />
      {visibleWizards.map((wizard) => (
        <WizardCard key={wizard.id} wizard={wizard} onSelect={() => onSelectWizard(wizard.id)} />
      ))}
    </div>
  );
};

export default WizardDeck;
