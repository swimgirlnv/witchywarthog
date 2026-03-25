import React from 'react';
import { Spell } from '../../contexts/GameStateContext';
import './Spell.css';

const MANA_ICON = 'https://i.imgur.com/z9Gxixc.png';

const REAGENT_ICONS: Record<string, string> = {
  mandrake:   'https://i.imgur.com/OBRVBHq.png',
  nightshade: 'https://i.imgur.com/IE7UC04.png',
  foxglove:   'https://i.imgur.com/Wm2Qha4.png',
  toadstool:  'https://i.imgur.com/eQyoGQP.png',
  horn:       'https://i.imgur.com/1zn1W9K.png',
};

interface SpellCardProps {
  spell: Spell;
  onSelect: () => void;
  selected: boolean;
}

const SpellCard: React.FC<SpellCardProps> = ({ spell, onSelect, selected }) => {
  const castReagents = Object.entries(spell.cost).filter(([, qty]) => qty > 0);

  return (
    <div className={`spell-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      {/* School badge — always visible, outside the flip */}
      <div className="school-badge">
        <img src={spell.power.image} alt={spell.power.name} />
        <span className="school-badge-tooltip">{spell.power.name}</span>
      </div>

      <div className="card-inner">
        {/* Front: large school icon as art + spell name + mana cost to research */}
        <div className="card-face card-front">
          <img src={spell.power.image} alt={spell.power.name} className="spell-school-img" />
          <b className="spell-name-front">{spell.name}</b>
          <div className="card-cost">
            <img src={MANA_ICON} alt="mana" className="cost-icon" />
            <span>{spell.manaCost}</span>
          </div>
        </div>

        {/* Back: name, VP rule, casting reagent cost */}
        <div className="card-face card-back">
          <b className="back-name">{spell.name}</b>
          <p className="back-desc">{spell.description}</p>
          {castReagents.length > 0 && (
            <div className="cast-cost">
              <span className="cast-cost-label">Cast cost</span>
              {castReagents.map(([reagent, qty]) => (
                <span key={reagent} className="cast-reagent">
                  <img src={REAGENT_ICONS[reagent]} alt={reagent} />
                  ×{qty}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpellCard;
