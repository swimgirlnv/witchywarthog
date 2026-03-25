export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
}

// A pool of 20 possible achievements. The game will pick a subset for each session.
export const achievementsPool: Achievement[] = [
  { id: 'achv-school-mastery', title: 'School Mastery', description: 'Own 7+ cards (wizards, towers, spells) of a single school.', points: 10 },
  { id: 'achv-wizard-collector', title: 'Wizard Collector', description: 'Acquire 6 Wizards.', points: 10 },
  { id: 'achv-tower-collector', title: 'Tower Collector', description: 'Construct 6 Towers.', points: 10 },
  { id: 'achv-spells-cast', title: 'Spellcaster', description: 'Successfully cast 7+ spells.', points: 10 },
  { id: 'achv-reagent-hoarder', title: 'Reagent Hoarder', description: 'Hold 20+ reagents total.', points: 10 },
  { id: 'achv-mana-reserve', title: 'Mana Reserve', description: 'Have 50+ mana at any time.', points: 10 },
  { id: 'achv-gold-hoarder', title: 'Gold Hoarder', description: 'Collect 30+ gold.', points: 10 },
  { id: 'achv-dungeon-master', title: 'Dungeon Mastery', description: 'Gain 3+ treasures from the dungeon.', points: 10 },
  { id: 'achv-familiar-friend', title: 'Familiar Friend', description: 'Own 5 Familiars.', points: 10 },
  { id: 'achv-diverse-collector', title: 'Diversifier', description: 'Own cards from 5 different schools.', points: 10 },
  { id: 'achv-necromancer', title: 'Necromancer', description: 'Harness Necromancy: own Necromancy cards.', points: 10 },
  { id: 'achv-resource-manager', title: 'Resource Manager', description: 'Convert 30+ resources into mana.', points: 10 },
  { id: 'achv-arcane-scholar', title: 'Arcane Scholar', description: 'Have 8+ research (spells) in hand.', points: 10 },
  { id: 'achv-defensive-lines', title: 'Defensive Lines', description: 'Have towers protecting you on 4+ turns.', points: 10 },
  { id: 'achv-speedy-builder', title: 'Speedy Builder', description: 'Build 4 Towers within 4 turns.', points: 10 },
  { id: 'achv_economic_power', title: 'Economic Power', description: 'Earn 10+ gold in a single turn.', points: 10 },
  { id: 'achv_spell_synergy', title: 'Spell Synergy', description: 'Cast 3 spells that reference the same school.', points: 10 },
  { id: 'achv_family_business', title: 'Family Business', description: 'Have 3+ familiars that share a power id.', points: 10 },
  { id: 'achv_versatile_wizard', title: 'Versatile Wizard', description: 'Have 4+ different wizard powers represented.', points: 10 },
  { id: 'achv_last_stand', title: 'Last Stand', description: 'Win despite having 0 gold at end of game.', points: 10 },
];

export default achievementsPool;
