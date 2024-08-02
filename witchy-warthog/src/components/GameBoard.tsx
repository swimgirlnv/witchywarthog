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
      </div>
      <div className="player-resources">
        {gameState.players.map(player => (
          <div key={player.id} className="player-area">
            <h2>{player.name}</h2>
            <div className="player-resources">
              <ResourceTrack resource="Mandrake Root" amount={player.resources.mandrake} iconUrl="https://i.imgur.com/OBRVBHq.png" />
              <ResourceTrack resource="Nightshade" amount={player.resources.nightshade} iconUrl="https://i.imgur.com/IE7UC04.png" />
              <ResourceTrack resource="Foxglove" amount={player.resources.foxglove} iconUrl="https://i.imgur.com/Wm2Qha4.png" />
              <ResourceTrack resource="Toadstool" amount={player.resources.toadstool} iconUrl="https://i.imgur.com/eQyoGQP.png" />
              <ResourceTrack resource="Horn" amount={player.resources.horn} iconUrl="https://i.imgur.com/1zn1W9K.png" />
              <ResourceTrack resource="Gold" amount={player.resources.gold} iconUrl="https://i.imgur.com/plvPmY5.png" />
              <ResourceTrack resource="Mana" amount={player.resources.mana} iconUrl="https://i.imgur.com/z9Gxixc.png" />
            </div>
            <div className="player-cards">
              <CardArea title="Towers" cards={player.towers} />
              <CardArea title="Wizards" cards={player.wizards} />
              <CardArea title="Familiars" cards={player.familiars} />
              <CardArea title="Spells (Uncast)" cards={player.spells.filter(spell => !spell.isCast)} />
              <CardArea title="Spells (Cast)" cards={player.spells.filter(spell => spell.isCast)} />
            </div>
          </div>
        ))}
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
