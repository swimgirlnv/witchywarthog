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

export const spellDeck: Spell[] = [
    { id: 'spell1', name: 'Valorem Incremento', description: 'Tower Cards = +1 VP', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell2', name: 'Non Mortui', description: '+3 VP / Necromancer Wizard and Familiar Cards owned', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell3', name: 'Impostoro', description: 'Gain 1 Gold / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell4', name: 'Magicis Divitiis', description: '+1 VP / 10 Mana at the end of the game', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell5', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell6', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell7', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell8', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell9', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell10', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell11', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell12', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell13', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell14', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png'},
    { id: 'spell15', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell16', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell17', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell18', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell19', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell20', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell21', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell22', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell23', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell24', name: 'Vitae Aqua', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell25', name: 'Aqua Vitae', description: 'Gain 1 VP / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
// Add more spells as needed
];

export const spellsOnOffer: Spell[] = [
    { id: 'spell1', name: 'Valorem Incremento', description: 'Tower Cards = +1 VP', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell2', name: 'Non Mortui', description: '+3 VP / Necromancer Wizard and Familiar Cards owned', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell3', name: 'Impostoro', description: 'Gain 1 Gold / Card of a School of Magic of your choice', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'spell4', name: 'Magicis Divitiis', description: '+1 VP / 10 Mana at the end of the game', isCast: false, cost: generateRandomResources(), power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
];
