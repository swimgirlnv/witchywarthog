import React from 'react';
import { useGameState, Spell, Wizard, Familiar, Tower } from '../../contexts/GameStateContext';
import ResourceTrack from '../Resource/ResourceTrack';
import CardArea from '../CardArea';
import WizardDeck from '../Wizard/WizardDeck';
import TowerDeck from '../Tower/TowerDeck';
import FamiliarDeck from '../Familiar/FamiliarDeck';
import SpellDeck from '../Spell/SpellDeck';
import FaceDownCard from '../FaceDownCard';
import PlayerActions from '../PlayerActions/PlayerActions';

interface AnyCard { power: { id: string; name: string; description: string; image: string }; }

const calculateVP = (
  player: { resources: any; towers: Tower[]; wizards: Wizard[]; familiars: Familiar[]; spells: Spell[] },
  allPlayers: typeof player[]
) => {
  let vp = 0;

  // Base: gold = 1 VP each, towers/wizards = 2 VP each, familiars = 1 VP, cast spells = 3 VP base
  vp += player.resources.gold;
  vp += player.towers.length * 2;
  vp += player.wizards.length * 2;
  vp += player.familiars.length;

  const allCards: AnyCard[] = [...player.wizards, ...player.towers, ...player.familiars, ...player.spells];

  player.spells.filter(s => s.isCast).forEach(spell => {
    vp += 3; // base cast bonus
    const d = spell.description;
    if (d.includes('Tower Cards = +1 VP')) {
      vp += player.towers.length;
    } else if (d.includes('Necromancer') || d.includes('Necromancy')) {
      vp += allCards.filter(c => c.power.name === 'Necromancy').length * 3;
    } else if (d.includes('/10 Mana') || d.includes('/ 10 Mana')) {
      vp += Math.floor(player.resources.mana / 10);
    } else if (d.includes('/5 Gold') || d.includes('/ 5 Gold')) {
      vp += Math.floor(player.resources.gold / 5);
    } else if (d.includes('most Towers')) {
      const max = Math.max(...allPlayers.map(p => p.towers.length));
      if (player.towers.length === max) vp += 3;
    } else if (d.includes('most Wizards')) {
      const max = Math.max(...allPlayers.map(p => p.wizards.length));
      if (player.wizards.length === max) vp += 3;
    } else if (d.includes('/ Familiar')) {
      vp += player.familiars.length * 2;
    } else if (d.includes('/ Wizard')) {
      vp += player.wizards.length * 2;
    } else {
      const schoolMap: Record<string, string> = {
        Conjuring: 'Conjuring', Alchemy: 'Alchemy', Sorcery: 'Sorcery',
        Enchantment: 'Enchantment', Druidry: 'Druidry', Thaumaturgy: 'Thaumaturgy',
      };
      for (const [label, school] of Object.entries(schoolMap)) {
        if (d.includes(label)) {
          vp += allCards.filter(c => c.power.name === school).length;
          break;
        }
      }
    }
  });

  return vp;
};

const GameBoard: React.FC = () => {
  const { gameState, endTurn } = useGameState();
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  if (gameState.gameEnded) {
    const scores = gameState.players.map(p => ({ player: p, vp: calculateVP(p, gameState.players) }))
      .sort((a, b) => b.vp - a.vp);
    return (
      <div className="game-over-overlay">
        <div className="game-over-box">
          <h1>Game Over!</h1>
          <p>The wizard market has been exhausted.</p>
          <div className="final-scores">
            {scores.map(({ player, vp }, i) => (
              <div key={player.id} className={`score-row ${i === 0 ? 'winner' : ''}`}>
                <span className="score-rank">{i === 0 ? '🏆' : `#${i + 1}`}</span>
                <span className="score-name">{player.name}</span>
                <div className="score-breakdown">
                  <span>{player.resources.gold} gold</span>
                  <span>{player.towers.length} towers</span>
                  <span>{player.wizards.length} wizards</span>
                  <span>{player.familiars.length} familiars</span>
                  <span>{player.spells.filter(s => s.isCast).length} cast spells</span>
                </div>
                <span className="score-total">{vp} VP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-board">
      {/* Turn banner */}
      <div className="turn-banner">
        <span className="turn-label">Turn {gameState.turnNumber}</span>
        <span className="turn-player">{currentPlayer.name}'s Turn</span>
        <div className="turn-vp-scores">
          {gameState.players.map(p => (
            <span key={p.id} className={`vp-chip ${p.id === currentPlayer.id ? 'active' : ''}`}>
              {p.name}: {calculateVP(p, gameState.players)} VP
            </span>
          ))}
        </div>
        <button className="end-turn-banner-btn" onClick={endTurn}>End Turn</button>
      </div>

      {/* Market resource track */}
      <div className="resource-tracks">
        <span className="track-label">Market Values (mana per reagent):</span>
        <ResourceTrack resource="Mandrake" amount={gameState.resources.mandrake} iconUrl="https://i.imgur.com/OBRVBHq.png" />
        <ResourceTrack resource="Nightshade" amount={gameState.resources.nightshade} iconUrl="https://i.imgur.com/IE7UC04.png" />
        <ResourceTrack resource="Foxglove" amount={gameState.resources.foxglove} iconUrl="https://i.imgur.com/Wm2Qha4.png" />
        <ResourceTrack resource="Toadstool" amount={gameState.resources.toadstool} iconUrl="https://i.imgur.com/eQyoGQP.png" />
        <ResourceTrack resource="Horn" amount={gameState.resources.horn} iconUrl="https://i.imgur.com/1zn1W9K.png" />
      </div>

      {/* Card market */}
      <div className="card-areas">
        <div className="top-board">
          <div className="tower-offer">
            <FaceDownCard imageUrl="https://i.imgur.com/CpSDZCN.png" />
            <h3>Towers on Offer</h3>
            <TowerDeck towers={gameState.towersOnOffer} onSelectTower={() => {}} />
          </div>
          <div className="wizard-offer">
            <FaceDownCard imageUrl="https://i.imgur.com/178eULE.png" />
            <h3>Wizards on Offer</h3>
            <WizardDeck wizards={gameState.wizardsOnOffer} onSelectWizard={() => {}} />
          </div>
        </div>
        <div className="bottom-board">
          <div className="familiar-offer">
            <FaceDownCard imageUrl="https://i.imgur.com/VxxrBB8.png" />
            <h3>Familiars on Offer</h3>
            <FamiliarDeck familiars={gameState.familiarsOnOffer} onSelectFamiliar={() => {}} />
          </div>
          <div className="spell-offer">
            <FaceDownCard imageUrl="https://i.imgur.com/cqW5vls.png" />
            <h3>Spells on Offer</h3>
            <SpellDeck spells={gameState.spellsOnOffer} onSelectSpell={() => {}} />
          </div>
        </div>
      </div>

      {/* Player areas — only active player shown expanded */}
      <div className="all-player-areas">
        {gameState.players.map((player, idx) => {
          const isActive = idx === gameState.currentPlayerIndex;
          const vp = calculateVP(player, gameState.players);
          return (
            <div key={player.id} className={`player-area ${isActive ? 'active-player' : 'inactive-player'}`}>
              <div className="player-header">
                <h2>{player.name} {isActive && <span className="your-turn-badge">Your Turn</span>}</h2>
                <span className="player-vp">{vp} VP</span>
              </div>
              <div className="player-resources">
                <ResourceTrack resource="Mandrake" amount={player.resources.mandrake} iconUrl="https://i.imgur.com/OBRVBHq.png" />
                <ResourceTrack resource="Nightshade" amount={player.resources.nightshade} iconUrl="https://i.imgur.com/IE7UC04.png" />
                <ResourceTrack resource="Foxglove" amount={player.resources.foxglove} iconUrl="https://i.imgur.com/Wm2Qha4.png" />
                <ResourceTrack resource="Toadstool" amount={player.resources.toadstool} iconUrl="https://i.imgur.com/eQyoGQP.png" />
                <ResourceTrack resource="Horn" amount={player.resources.horn} iconUrl="https://i.imgur.com/1zn1W9K.png" />
                <ResourceTrack resource="Gold" amount={player.resources.gold} iconUrl="https://i.imgur.com/plvPmY5.png" />
                <ResourceTrack resource="Mana" amount={player.resources.mana} iconUrl="https://i.imgur.com/z9Gxixc.png" />
              </div>
              {isActive && <PlayerActions />}
              <div className="player-cards">
                <CardArea title="Towers" cards={player.towers} />
                <CardArea title="Wizards" cards={player.wizards} />
                <CardArea title="Familiars" cards={player.familiars} />
                <CardArea title="Spells (Uncast)" cards={player.spells.filter(s => !s.isCast)} />
                <CardArea title="Spells (Cast)" cards={player.spells.filter(s => s.isCast)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
