import React from 'react';
import FamiliarCard from './FamiliarCard';
import { Familiar } from '../contexts/GameStateContext';
import FaceDownCard from './FaceDownCard';

interface FamiliarDeckProps {
  familiars: Familiar[];
  onSelectFamiliar: (id: string) => void;
}

const FamiliarDeck: React.FC<FamiliarDeckProps> = ({ familiars, onSelectFamiliar }) => {
  // Ensure there are at least 2 familiars to display after the face-down card
  const visibleFamiliars = familiars.slice(0, 2);

  return (
    <div className="familiar-deck">
      <FaceDownCard imageUrl='https://i.imgur.com/DBC79as.png' />
      {visibleFamiliars.map((familiar) => (
        <FamiliarCard key={familiar.id} familiar={familiar} onSelect={() => onSelectFamiliar(familiar.id)} />
      ))}
    </div>
  );
};

export default FamiliarDeck;
