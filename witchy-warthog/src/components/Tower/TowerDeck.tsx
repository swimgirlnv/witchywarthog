import React from 'react';
import TowerCard from './TowerCard';
import FaceDownCard from '../FaceDownCard';
import { Tower } from '../../contexts/GameStateContext';

interface TowerDeckProps {
  towers: Tower[];
  onSelectTower: (id: string) => void;
}

const TowerDeck: React.FC<TowerDeckProps> = ({ towers, onSelectTower }) => {
  const visibleTowers = towers.slice(0, 1);

  return (
    <div className="tower-deck">
      {/* <FaceDownCard imageUrl="https://i.imgur.com/CpSDZCN.png" /> */}
      {visibleTowers.map((tower) => (
        <TowerCard key={tower.id} tower={tower} onSelect={() => onSelectTower(tower.id)} />
      ))}
    </div>
  );
};

export default TowerDeck;
