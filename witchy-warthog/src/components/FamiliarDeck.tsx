import React from 'react';
import FamiliarCard from './FamiliarCard';
import { Familiar } from '../contexts/GameStateContext';

interface FamiliarDeckProps {
  familiars: Familiar[];
  onSelectFamiliar: (id: string) => void;
}

const faceDownCard: Familiar = {
  id: 'familiar0',
  name: '',
  description: '',
  power: '',
  cost: '0',
  image: 'https://i.imgur.com/DBC79as.png'
};

const FamiliarDeck: React.FC<FamiliarDeckProps> = ({ familiars, onSelectFamiliar }) => {
  // Ensure there are at least 2 familiars to display after the face-down card
  const visibleFamiliars = familiars.slice(0, 2);

  return (
    <div className="familiar-deck">
      <FamiliarCard key={faceDownCard.id} familiar={faceDownCard} onSelect={() => null} />
      {visibleFamiliars.map((familiar) => (
        <FamiliarCard key={familiar.id} familiar={familiar} onSelect={() => onSelectFamiliar(familiar.id)} />
      ))}
    </div>
  );
};

export default FamiliarDeck;
