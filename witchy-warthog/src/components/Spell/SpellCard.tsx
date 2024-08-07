import React from 'react';
import { Spell } from '../../contexts/GameStateContext';
import './Spell.css';

interface SpellCardProps {
  spell: Spell;
  onSelect: () => void;
  selected: boolean;
}

const resourceIcons: { [key: string]: string } = {
  mandrake: 'https://i.imgur.com/OBRVBHq.png',
  nightshade: 'https://i.imgur.com/IE7UC04.png',
  foxglove: 'https://i.imgur.com/Wm2Qha4.png',
  toadstool: 'https://i.imgur.com/eQyoGQP.png',
  horn: 'https://i.imgur.com/1zn1W9K.png',
};

const SpellCard: React.FC<SpellCardProps> = ({ spell, onSelect, selected }) => {
  return (
    <div className={`spell-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <img src={spell.power.image} alt={spell.name} className="spell-image" />
      <div className="tooltip">{spell.power.name}</div>
      <div className="spell-details">
        <b>{spell.name}</b>
        <p>{spell.description}</p>
        <div className="spell-mana-cost">Cost: {spell.manaCost} Mana</div>
        <div className="spell-cost">
          {Object.keys(spell.cost).map(resource => (
            spell.cost[resource] > 0 && (
              <div key={resource} className="resource-cost">
                <img src={resourceIcons[resource]} alt={resource} className="resource-icon" />
                <span>{spell.cost[resource]}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpellCard;
