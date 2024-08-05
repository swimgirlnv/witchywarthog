import React from 'react';
import SpellCard from './SpellCard';
import { Spell } from '../contexts/GameStateContext';

interface SpellDeckProps {
  spells: Spell[];
  onSelectSpell: (id: string) => void;
}

const faceDownCard: Spell = {
  id: 'spell0',
  name: '',
  description: '',
  cost: '0',
  isCast: false,
  image: 'https://i.imgur.com/cqW5vls.png'
};

const SpellDeck: React.FC<SpellDeckProps> = ({ spells, onSelectSpell }) => {
  // Ensure there are at least 4 spells to display after the face-down card
  const visibleSpells = spells.slice(0, 4);

  return (
    <div className="spell-deck">
      <SpellCard key={faceDownCard.id} spell={faceDownCard} onSelect={() => null} />
      {visibleSpells.map((spell) => (
        <SpellCard key={spell.id} spell={spell} onSelect={() => onSelectSpell(spell.id)} />
      ))}
    </div>
  );
};

export default SpellDeck;
