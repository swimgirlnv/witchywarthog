import { Spell, Power } from "../contexts/GameStateContext";
import { ResourceOptions } from "../contexts/GameStateContext";

const powers: Power[] = [
    { id: 'conjuring', name: 'Conjuring', description: 'Summoning creatures and objects', image: 'https://i.imgur.com/a4RpdV0.png' },
    { id: 'sorcery', name: 'Sorcery', description: 'Casting powerful spells', image: 'https://i.imgur.com/wIuKR49.png' },
    { id: 'alchemy', name: 'Alchemy', description: 'Transmuting substances', image: 'https://i.imgur.com/oKHPi2G.png' },
    { id: 'enchantment', name: 'Enchantment', description: 'Imbuing objects with magic', image: 'https://i.imgur.com/0TCztl1.png' },
    { id: 'druidry', name: 'Druidry', description: 'Harnessing nature\'s power', image: 'https://i.imgur.com/L1kniUc.png' },
    { id: 'thaumaturgy', name: 'Thaumaturgy', description: 'Performing miracles and wonders', image: 'https://i.imgur.com/eotB4wd.png' },
    { id: 'necromancy', name: 'Necromancy', description: 'Communicating with the dead', image: 'https://i.imgur.com/n4UFpM6.png' },
];

const assignRandomPower = (): Power => {
    return powers[Math.floor(Math.random() * powers.length)];
};

const generateRandomResources = (): ResourceOptions => {
    const resources: ResourceOptions = {
        mandrake: 0,
        nightshade: 0,
        foxglove: 0,
        toadstool: 0,
        horn: 0,
    };
    const resourceKeys = Object.keys(resources) as (keyof ResourceOptions)[];
    const numberOfResources = Math.floor(Math.random() * 3) + 1; // 1 to 3 resources

    for (let i = 0; i < numberOfResources; i++) {
        const resource = resourceKeys[Math.floor(Math.random() * resourceKeys.length)];
        resources[resource] += Math.floor(Math.random() * 3) + 1; // 1 to 3 units of the resource
    }

    return resources;
};

const generateRandomManaCost = (): number => {
    return Math.floor(Math.random() * 5) + 1; // Mana cost between 1 and 5
};

const allSpells: Spell[] = [
    { id: 'spell1', name: 'Valorem Incremento', description: 'Tower Cards = +1 VP', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell2', name: 'Non Mortui', description: '+3 VP / Necromancer Wizard and Familiar Cards owned', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell3', name: 'Impostoro', description: 'Gain 1 Gold / Card of a School of Magic of your choice', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell4', name: 'Magicis Divitiis', description: '+1 VP / 10 Mana at the end of the game', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell5', name: 'Aqua Vitae', description: '+1 VP / Conjuring card you own', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell6', name: 'Aurum Potestas', description: '+1 VP / Alchemy card you own', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell7', name: 'Caelum Cognitio', description: '+1 VP / Sorcery card you own', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell8', name: 'Fulguris', description: '+1 VP / Enchantment card you own', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell9', name: 'Gelum', description: '+1 VP / Druidry card you own', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell10', name: 'Ignis', description: '+1 VP / Thaumaturgy card you own', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell11', name: 'Lux', description: '+2 VP / Familiar card you own', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell12', name: 'Mors', description: '+2 VP / Wizard card you own', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell13', name: 'Nubes', description: '+1 VP / 5 Gold you have at game end', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell14', name: 'Oceani', description: '+3 VP if you have the most Towers', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
    { id: 'spell15', name: 'Pax', description: '+3 VP if you have the most Wizards', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/XifSj3R.png' },
];

export const spellsOnOffer: Spell[] = allSpells.slice(0, 4);
export const spellDeck: Spell[] = allSpells.slice(4);
