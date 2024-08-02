import React from 'react';
import { useGameState } from '../contexts/GameStateContext';
import ResourceTrack from './ResourceTrack';
import CardArea from './CardArea';

const GameBoard: React.FC = () => {
  const { gameState } = useGameState();

  return (
    <div className="game-board">
      <div className="resource-tracks">
        <ResourceTrack resource="Mandrake Root" amount={gameState.resources.mandrake} iconUrl="https://i.imgur.com/OBRVBHq.png" />
        <ResourceTrack resource="Nightshade" amount={gameState.resources.nightshade} iconUrl="https://i.imgur.com/IE7UC04.png" />
        <ResourceTrack resource="Foxglove" amount={gameState.resources.foxglove} iconUrl="https://i.imgur.com/Wm2Qha4.png" />
        <ResourceTrack resource="Toadstool" amount={gameState.resources.toadstool} iconUrl="https://i.imgur.com/eQyoGQP.png" />
        <ResourceTrack resource="Horn" amount={gameState.resources.horn} iconUrl="https://i.imgur.com/1zn1W9K.png" />
        <ResourceTrack resource="Gold" amount={gameState.resources.gold} iconUrl="https://i.imgur.com/plvPmY5.png" />
        <ResourceTrack resource="Mana" amount={gameState.resources.mana} iconUrl="https://i.imgur.com/z9Gxixc.png" />
      </div>
      <div className="card-areas">
        <CardArea title="Build Tower" cards={gameState.towers} />
        <CardArea title="Recruit Wizard" cards={gameState.wizards} />
        <CardArea title="Summon Familiar" cards={gameState.familiars} />
        <CardArea title="Research Spells" cards={gameState.spells} />
      </div>
    </div>
  );
};

export default GameBoard;
