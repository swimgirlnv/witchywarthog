import React, { useState } from 'react';
import './HelperSidekick.css';

const RULES_SECTIONS = [
  {
    heading: 'Goal',
    items: [
      'Earn the most Victory Points (VP) when the Wizard deck and market are exhausted.',
    ],
  },
  {
    heading: 'On Your Turn — Choose One Action',
    items: [
      '🌿 Gather — Use a resource card to collect reagents. Your carry limit is 10 + 1 per Tower you own.',
      '⚗️ Convert — Sell reagents for mana at their current market rate. Each conversion lowers that reagent\'s value by 1 (min 1).',
      '🧙 Recruit a Wizard — Bid at least 1 mana. The highest bidder claims the wizard. Wizards are worth 2 VP each.',
      '📜 Research a Spell — Pay the mana cost to add a spell to your hand. Cast it automatically when you can afford its reagent cost.',
      '🏰 Build a Tower — Pay gold to build. Each Tower raises your carry limit by 1 and is worth 2 VP.',
      '🐾 Summon a Familiar — Pay the mana cost. Familiars grant a one-time special action and are worth 1 VP.',
    ],
  },
  {
    heading: 'Market Values',
    items: [
      'Reagents have a market track value from 1–10 mana each.',
      'Converting a reagent lowers its track value by 1.',
      'Gathering a reagent raises its track value by 1.',
    ],
  },
  {
    heading: 'Scoring (VP)',
    items: [
      '1 VP per Gold coin',
      '2 VP per Tower',
      '2 VP per Wizard',
      '1 VP per Familiar',
      '3 VP per Cast Spell (base) + the spell\'s bonus effect',
    ],
  },
  {
    heading: 'Spell Bonus Examples',
    items: [
      '+1 VP per card of a matching school',
      '+1 VP per 10 Mana remaining',
      '+1 VP per 5 Gold remaining',
      '+2 VP per Wizard or Familiar you own',
      '+3 VP if you have the most Towers or Wizards',
    ],
  },
  {
    heading: 'Game End',
    items: [
      'The game ends when the Wizard market and deck are both empty.',
      'Final scores are tallied — most VP wins! 🏆',
    ],
  },
];

export const HelperSidekick: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="helper-image-button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Open game rules"
        title="How to play"
      >
        <img
          src="/witchy-warthog-face-right.png"
          alt="Witchy Warthog helper"
          className="helper-image"
        />
      </button>

      {isModalOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Game rules dialog"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="scroll-modal" onClick={(e) => e.stopPropagation()}>
            {/* Top scroll rod */}
            <div className="scroll-rod scroll-rod-top" />
            {/* Bottom scroll rod */}
            <div className="scroll-rod scroll-rod-bottom" />

            <button
              className="close-button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close rules dialog"
            >
              ✕
            </button>

            <div className="scroll-header">
              <span className="scroll-ornament">✦</span>
              <h2 className="scroll-title">Witchy Warthog</h2>
              <p className="scroll-subtitle">Abridged Rules</p>
              <span className="scroll-ornament">✦</span>
            </div>

            <div className="scroll-divider" />

            <div className="scroll-body">
              {RULES_SECTIONS.map((section) => (
                <div key={section.heading} className="rules-section">
                  <h3 className="rules-section-heading">{section.heading}</h3>
                  <ul className="rules-list">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="scroll-divider" />
            <p className="scroll-footer">May your reagents be plentiful 🌙</p>
          </div>
        </div>
      )}
    </>
  );
};

export default HelperSidekick;
