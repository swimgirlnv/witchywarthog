import React from 'react';
import { useGameState } from '../../contexts/GameStateContext';
import ResourceTrack from '../Resource/ResourceTrack';
import CardArea from '../CardArea';
import WizardDeck from '../Wizard/WizardDeck';
import TowerDeck from '../Tower/TowerDeck';
import FamiliarDeck from '../Familiar/FamiliarDeck';
import SpellDeck from '../Spell/SpellDeck';
import FaceDownCard from '../FaceDownCard';
import PlayerActions from '../PlayerActions/PlayerActions';

const GameBoard: React.FC = () => {
  const { gameState } = useGameState();

  const handleSelectWizard = (wizardId: string) => {
    // Handle wizard selection logic here if needed
    console.log(`Wizard selected: ${wizardId}`);
  };

  const handleSelectTower = (towerId: string) => {
    // Handle tower selection logic here if needed
    console.log(`Tower selected: ${towerId}`);
  };

  const handleSelectFamiliar = (familiarId: string) => {
    // Handle familiar selection logic here if needed
    console.log(`Familiar selected: ${familiarId}`);
  };

  const handleSelectSpell = (spellId: string) => {
    // Handle spell selection logic here if needed
    console.log(`Spell selected: ${spellId}`);
  };

  return (
    <div className="game-board">
      <div className="resource-tracks">
        <ResourceTrack resource="Mandrake Root" amount={gameState.resources.mandrake} iconUrl="https://i.imgur.com/OBRVBHq.png" />
        <ResourceTrack resource="Nightshade" amount={gameState.resources.nightshade} iconUrl="https://i.imgur.com/IE7UC04.png" />
        <ResourceTrack resource="Foxglove" amount={gameState.resources.foxglove} iconUrl="https://i.imgur.com/Wm2Qha4.png" />
        <ResourceTrack resource="Toadstool" amount={gameState.resources.toadstool} iconUrl="https://i.imgur.com/eQyoGQP.png" />
        <ResourceTrack resource="Horn" amount={gameState.resources.horn} iconUrl="https://i.imgur.com/1zn1W9K.png" />
      </div>
      <div className="card-areas">
        <div className='top-board'>
          <div className="tower-offer">
            <div className=''>
              <FaceDownCard imageUrl='https://i.imgur.com/CpSDZCN.png' />
              <h2>Towers on Offer</h2>
            </div>
            <TowerDeck towers={gameState.towersOnOffer} onSelectTower={handleSelectTower} />
          </div>
          <div className="wizard-offer">
            <div className=''>
              <FaceDownCard imageUrl='https://i.imgur.com/178eULE.png' />
              <h2>Wizards on Offer</h2>
            </div>
            <WizardDeck wizards={gameState.wizardsOnOffer} onSelectWizard={handleSelectWizard} />
          </div>
        </div>
        <div className='bottom-board'>
          <div className="familiar-offer">
            <div className=''>
              <FaceDownCard imageUrl='https://i.imgur.com/VxxrBB8.png' />
              <h2>Familiars on Offer</h2>
            </div>
            <FamiliarDeck familiars={gameState.familiarsOnOffer} onSelectFamiliar={handleSelectFamiliar}/>
          </div>
          <div className="spell-offer">
            <div className=''>
              <FaceDownCard imageUrl='https://i.imgur.com/cqW5vls.png' />
              <h2>Spells on Offer</h2>
            </div>
            <SpellDeck spells={gameState.spellsOnOffer} onSelectSpell={handleSelectSpell}/>
          </div>
        </div>
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
            <PlayerActions />
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
    </div>
  );
};

export default GameBoard;
