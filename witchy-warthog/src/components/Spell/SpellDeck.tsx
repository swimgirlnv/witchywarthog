import React from 'react';
import SpellCard from './SpellCard';
import { Spell } from '../../contexts/GameStateContext';
import FaceDownCard from '../FaceDownCard';

interface SpellDeckProps {
  spells: Spell[];
  onSelectSpell: (id: string) => void;
}

const SpellDeck: React.FC<SpellDeckProps> = ({ spells, onSelectSpell }) => {
  // Ensure there are at least 4 spells to display after the face-down card
  const visibleSpells = spells.slice(0, 4);

  return (
    <div className="spell-deck">
      {/* <FaceDownCard imageUrl='https://i.imgur.com/cqW5vls.png' /> */}
      {visibleSpells.map((spell) => (
        <SpellCard key={spell.id} spell={spell} onSelect={() => onSelectSpell(spell.id)} selected={false} />
      ))}
    </div>
  );
};

export default SpellDeck;
