import React from 'react';
import WizardCard from './WizardCard';
import { Wizard } from '../../contexts/GameStateContext';
import FaceDownCard from '../FaceDownCard';

interface WizardDeckProps {
  wizards: Wizard[];
  onSelectWizard: (id: string) => void;
}

const WizardDeck: React.FC<WizardDeckProps> = ({ wizards, onSelectWizard }) => {
  // Ensure there are at least 2 wizards to display after the face-down card
  const visibleWizards = wizards.slice(0, 2);

  return (
    <div className="wizard-deck">
      {/* <FaceDownCard imageUrl='https://i.imgur.com/178eULE.png' /> */}
      {visibleWizards.map((wizard) => (
        <WizardCard key={wizard.id} wizard={wizard} onSelect={() => onSelectWizard(wizard.id)} isSelected={false} />
      ))}
    </div>
  );
};

export default WizardDeck;
