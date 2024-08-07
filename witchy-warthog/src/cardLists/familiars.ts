import { Familiar, Power } from "../contexts/GameStateContext";

const powers: Power[] = [
    { id: '1', name: 'Conjuring', description: 'Summoning creatures and objects', image: 'https://i.imgur.com/a4RpdV0.png' },
    { id: '2', name: 'Sorcery', description: 'Casting powerful spells', image: 'https://i.imgur.com/wIuKR49.png' },
    { id: '3', name: 'Alchemy', description: 'Transmuting substances', image: 'https://i.imgur.com/oKHPi2G.png' },
    { id: '4', name: 'Enchantment', description: 'Imbuing objects with magic', image: 'https://i.imgur.com/0TCztl1.png' },
    { id: '5', name: 'Druidry', description: 'Harnessing nature\'s power', image: 'https://i.imgur.com/L1kniUc.png' },
    { id: '6', name: 'Thaumaturgy', description: 'Performing miracles and wonders', image: 'https://i.imgur.com/eotB4wd.png' },
    { id: '7', name: 'Necromancy', description: 'Communicating with the dead', image: 'https://i.imgur.com/n4UFpM6.png' },
  ];

const powerImages: { [key: string]: string } = {
  'Conjuring': 'https://i.imgur.com/z2dJs40.png',
  'Sorcery': 'https://i.imgur.com/2HtdLXw.png',
  'Alchemy': 'https://i.imgur.com/E9cmtKv.png',
  'Enchantment': 'https://i.imgur.com/Mn4wIH2.png',
  'Druidry': 'https://i.imgur.com/WP7F6ou.png',
  'Thaumaturgy': 'https://i.imgur.com/oEa7XMn.png',
  'Necromancy': 'https://i.imgur.com/wYbpnr4.png',
};

const familiarDescriptions: { [key: string]: string } = {
    'Conjuring': 'Summoned from another realm',
    'Sorcery': 'Imbued with powerful magic',
    'Alchemy': 'Transmuted from one substance to another',
    'Enchantment': 'Imbued with magical properties',
    'Druidry': 'Imbued with the power of nature',
    'Thaumaturgy': 'Imbued with miraculous powers',
    'Necromancy': 'Imbued with the power of the dead',
    };

const familiarNames: { [key: string]: string } = {
    'Conjuring': 'Summoner Fox',
    'Sorcery': 'Enchanted Owl',
    'Alchemy': 'Transmuted Serpent',
    'Enchantment': 'Magical Deer',
    'Druidry': 'Spirit Wolf',
    'Thaumaturgy': 'Miracle Phoenix',
    'Necromancy': 'Undead Raven',
    };

const assignRandomPower = (): Power => {
  return powers[Math.floor(Math.random() * powers.length)];
};

const assignRandomCost = (): string => {
    const cost = Math.floor(Math.random() * 3) + 1;
    return `${cost} Mana`;
    };


export const familiarDeck: Familiar[] = Array.from({ length: 25 }, (_, index) => {
    const id = `familiar${index + 1}`;
    const power = assignRandomPower();
    return {
      id,
      name: familiarNames[power.name],
      description: familiarDescriptions[power.name],
      power: power,
      cost: assignRandomCost(),
      image: powerImages[power.name],
    };
  });
  
  export const familiarsOnOffer: Familiar[] = familiarDeck.slice(0, 2);
  