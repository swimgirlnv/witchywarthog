import React from 'react';
import TowerCard from './TowerCard';
import { Tower } from '../contexts/GameStateContext';

interface TowerDeckProps {
  towers: Tower[];
  onSelectTower: (id: string) => void;
}

const faceDownCard: Tower = {
  id: 'tower0',
  name: '',
  description: '',
  power: '',
  cost: '0',
  image: 'https://i.imgur.com/CpSDZCN.png'
};

const TowerDeck: React.FC<TowerDeckProps> = ({ towers, onSelectTower }) => {
  // Ensure there are at least 2 towers to display after the face-down card
  const visibleTowers = towers.slice(0, 2);

  return (
    <div className="tower-deck">
      <TowerCard key={faceDownCard.id} tower={faceDownCard} onSelect={() => null} />
      {visibleTowers.map((tower) => (
        <TowerCard key={tower.id} tower={tower} onSelect={() => onSelectTower(tower.id)} />
      ))}
    </div>
  );
};

export default TowerDeck;
