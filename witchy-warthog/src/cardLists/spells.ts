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

export const spellDeck: Spell[] = [
    { id: 'spell1', name: 'Valorem Incremento', description: 'Tower Cards = +1 VP', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell2', name: 'Non Mortui', description: '+3 VP / Necromancer Wizard and Familiar Cards owned', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell3', name: 'Impostoro', description: 'Gain 1 Gold / Card of a School of Magic of your choice', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell4', name: 'Magicis Divitiis', description: '+1 VP / 10 Mana at the end of the game', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell5', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    // Add more spells as needed
];

export const spellsOnOffer: Spell[] = [
    { id: 'spell1', name: 'Valorem Incremento', description: 'Tower Cards = +1 VP', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell2', name: 'Non Mortui', description: '+3 VP / Necromancer Wizard and Familiar Cards owned', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell3', name: 'Impostoro', description: 'Gain 1 Gold / Card of a School of Magic of your choice', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell4', name: 'Magicis Divitiis', description: '+1 VP / 10 Mana at the end of the game', isCast: false, manaCost: generateRandomManaCost(), cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
];
