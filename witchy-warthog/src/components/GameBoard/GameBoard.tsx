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
import './GameBoard.css';
import HelperSidekick from '../HelperSidekick/HelperSidekick';
import AchievementsDeck from '../Achievements/AchievementsDeck';

interface AnyCard { power: { id: string; name: string; description: string; image: string }; }

const calculateVP = (
  player: { resources: any; towers: Tower[]; wizards: Wizard[]; familiars: Familiar[]; spells: Spell[]; dungeonTreasures?: { value?: number }[] },
  allPlayers: typeof player[]
) => {
  let vp = 0;

  vp += player.resources.gold;

  player.wizards.forEach(wizard => {
    player.towers.forEach(tower => {
      vp += wizard.power.name === tower.power.name ? 10 : 5;
    });
  });

  const allCards: AnyCard[] = [...player.wizards, ...player.towers, ...player.familiars, ...player.spells];

  player.spells.filter(s => s.isCast).forEach(spell => {
    const hasMatchingWizard = player.wizards.some(wizard => wizard.power.name === spell.power.name);
    const hasMatchingTower = player.towers.some(tower => tower.power.name === spell.power.name);
    if (hasMatchingWizard && hasMatchingTower) {
      vp += 3;
    }

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

  vp += player.dungeonTreasures?.reduce((sum, card) => sum + (card.value ?? 0), 0) ?? 0;

  return vp;
};

const GameBoard: React.FC = () => {
  const { gameState, activeRoomCode, viewerPlayerId } = useGameState();
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const inactivePlayers = gameState.players.filter(player => player.id !== currentPlayer.id);

  if (gameState.gameEnded) {
    const scores = gameState.players.map(p => ({ player: p, vp: calculateVP(p, gameState.players) }))
      .sort((a, b) => b.vp - a.vp);
    return (
      <div className="game-over-overlay">
        <div className="game-over-box">
          <h1>Game Over!</h1>
          <p>A market deck has been exhausted.</p>
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
        <span className="turn-label">Turn {gameState.turnNumber}{activeRoomCode ? ` • Room ${activeRoomCode}` : ''}</span>
        <span className="turn-player">{currentPlayer.name}'s Turn</span>
        <div className="turn-vp-scores">
          {gameState.players.map(p => (
            <span key={p.id} className={`vp-chip ${p.id === currentPlayer.id ? 'active' : ''}`}>
              {p.name}: {calculateVP(p, gameState.players)} VP
            </span>
          ))}
        </div>
      </div>

      {/* Card market */}
      <div className="card-areas">

        {/* Left board: towers and helper sidekick*/}
        <div className="left-board">
          <div className="tower-offer">
            {/* <FaceDownCard imageUrl="https://i.imgur.com/CpSDZCN.png" /> */}
            <h3>Towers on Offer</h3>
            <TowerDeck towers={gameState.towersOnOffer} onSelectTower={() => {}} />
          </div>
          <div className="helper-sidekick">
            {/* <FaceDownCard imageUrl="https://i.imgur.com/178eULE.png" /> */}
            <HelperSidekick />
          </div>
        </div>

        {/* Middle board: wizards and familiars */}
        <div className="mid-board">
          <div className="wizard-offer">
            {/* <FaceDownCard imageUrl="https://i.imgur.com/178eULE.png" /> */}
            <h3>Wizards on Offer</h3>
            <WizardDeck wizards={gameState.wizardsOnOffer} onSelectWizard={() => {}} />
          </div>
          <div className="familiar-offer">
            {/* <FaceDownCard imageUrl="https://i.imgur.com/VxxrBB8.png" /> */}
            <h3>Familiars on Offer</h3>
            <FamiliarDeck familiars={gameState.familiarsOnOffer} onSelectFamiliar={() => {}} />
          </div>
        </div>
        
        {/* Mid Right board: spells */}
        <div className="mid-right-board">
          <div className="spell-offer">
            {/* <FaceDownCard imageUrl="https://i.imgur.com/cqW5vls.png" /> */}
            <h3>Spells on Offer</h3>
            <SpellDeck spells={gameState.spellsOnOffer} onSelectSpell={() => {}} />
          </div>
        </div>

        <div className="market-track-column">
          <h3>Market Values</h3>
          <div className="resource-tracks board-resource-tracks">
            <ResourceTrack resource="Mandrake" amount={gameState.resources.mandrake} iconUrl="https://i.imgur.com/OBRVBHq.png" />
            <ResourceTrack resource="Nightshade" amount={gameState.resources.nightshade} iconUrl="https://i.imgur.com/IE7UC04.png" />
            <ResourceTrack resource="Foxglove" amount={gameState.resources.foxglove} iconUrl="https://i.imgur.com/Wm2Qha4.png" />
            <ResourceTrack resource="Toadstool" amount={gameState.resources.toadstool} iconUrl="https://i.imgur.com/eQyoGQP.png" />
            <ResourceTrack resource="Horn" amount={gameState.resources.horn} iconUrl="https://i.imgur.com/1zn1W9K.png" />
          </div>
        </div>

        {/* Far right board: achievements */}
        <div className="right-board">
          <div className="achievements">
            <h3>Achievements</h3>
            <AchievementsDeck achievements={gameState.achievementsOnOffer} />
          </div>
        </div>
      </div>

      {/* Player areas — active player expanded, others compact */}
      <div className="all-player-areas">
        {inactivePlayers.length > 0 && (
          <div className="player-roster">
            {inactivePlayers.map(player => {
              const vp = calculateVP(player, gameState.players);
              const isViewer = player.id === viewerPlayerId;
              const reagentCount =
                player.resources.mandrake +
                player.resources.nightshade +
                player.resources.foxglove +
                player.resources.toadstool +
                player.resources.horn;

              return (
                <div key={player.id} className={`player-chip ${isViewer ? 'viewer-player' : ''}`}>
                  <div className="player-chip-header">
                    <strong>{player.name}</strong>
                    {isViewer && <span className="player-chip-badge">You</span>}
                  </div>
                  <div className="player-chip-stats">
                    <span>{vp} VP</span>
                    <span>{player.resources.mana} Mana</span>
                    <span>{player.resources.gold} Gold</span>
                    <span>{reagentCount} Reagents</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="player-area active-player">
          <div className="player-header">
            <div className="player-heading">
              <h2>{currentPlayer.name} <span className="your-turn-badge">Active Turn</span></h2>
            </div>
            <div className="player-header-resources">
              <div className="player-resource-group reagent-group">
                <ResourceTrack resource="Mandrake" amount={currentPlayer.resources.mandrake} iconUrl="https://i.imgur.com/OBRVBHq.png" />
                <ResourceTrack resource="Nightshade" amount={currentPlayer.resources.nightshade} iconUrl="https://i.imgur.com/IE7UC04.png" />
                <ResourceTrack resource="Foxglove" amount={currentPlayer.resources.foxglove} iconUrl="https://i.imgur.com/Wm2Qha4.png" />
                <ResourceTrack resource="Toadstool" amount={currentPlayer.resources.toadstool} iconUrl="https://i.imgur.com/eQyoGQP.png" />
                <ResourceTrack resource="Horn" amount={currentPlayer.resources.horn} iconUrl="https://i.imgur.com/1zn1W9K.png" />
              </div>
              <div className="reagent-total">
                <span className="reagent-total-label">Reagents</span>
                <strong>
                  {currentPlayer.resources.mandrake +
                    currentPlayer.resources.nightshade +
                    currentPlayer.resources.foxglove +
                    currentPlayer.resources.toadstool +
                    currentPlayer.resources.horn}
                </strong>
              </div>
              <div className="player-resource-group reserve-group">
                <ResourceTrack resource="Gold" amount={currentPlayer.resources.gold} iconUrl="https://i.imgur.com/plvPmY5.png" />
                <ResourceTrack resource="Mana" amount={currentPlayer.resources.mana} iconUrl="https://i.imgur.com/z9Gxixc.png" />
              </div>
            </div>
            <span className="player-vp">{calculateVP(currentPlayer, gameState.players)} VP</span>
          </div>
          <div className="player-focus-layout">
            <PlayerActions />
            <div className="player-cards">
              <CardArea title="Towers" cards={currentPlayer.towers} />
              <CardArea title="Wizards" cards={currentPlayer.wizards} />
              <CardArea title="Familiars" cards={currentPlayer.familiars} />
              <CardArea title="Spells (Uncast)" cards={currentPlayer.spells.filter(s => !s.isCast)} />
              <CardArea title="Spells (Cast)" cards={currentPlayer.spells.filter(s => s.isCast)} />
              <CardArea
                title="Dungeon Treasure"
                cards={currentPlayer.dungeonTreasures.map(treasure => ({
                  id: treasure.id,
                  name: `${treasure.value ?? 0} Gold`,
                  description: treasure.description,
                  image: treasure.image,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
