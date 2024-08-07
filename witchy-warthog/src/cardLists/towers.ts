import { Tower, Power } from "../contexts/GameStateContext";

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

const assignRandomCost = (): string => {
    const cost = Math.floor(Math.random() * 3) + 1;
    return `${cost} Gold Coins`;
}

export const towerDeck: Tower[] = [
    { id: 'tower1', name: 'Crimson Bastion', description: 'A crimson fortress imbued with fire magic', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/jwUmGqI.png' },
    { id: 'tower2', name: 'Azure Keep', description: 'A lair of mystical blue energy', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/2TPro9X.png' },
    { id: 'tower3', name: 'Golden Spire', description: 'A towering golden structure of light', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/716fASE.png' },
    { id: 'tower4', name: 'Emerald Citadel', description: 'A citadel harnessing the power of nature', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/fVHcF7U.png' },
    { id: 'tower5', name: 'Violet Stronghold', description: 'A stronghold emanating violet arcane energy', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' }, //beginning of placeholders
    { id: 'tower6', name: 'Amber Tower', description: 'A tower of amber that glows with ancient power', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower7', name: 'Ivory Fortress', description: 'A pristine fortress of pure ivory', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower8', name: 'Obsidian Keep', description: 'A dark keep made of black obsidian', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower9', name: 'Cerulean Spire', description: 'A spire reaching the sky with cerulean energy', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower10', name: 'Ruby Citadel', description: 'A citadel of rubies glowing with fierce power', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower11', name: 'Topaz Stronghold', description: 'A stronghold of topaz that sparkles brightly', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower12', name: 'Peridot Tower', description: 'A tower of green peridot infused with earth magic', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower13', name: 'Amethyst Fortress', description: 'A fortress of amethyst filled with mystic power', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower14', name: 'Bone Keep', description: 'A keep constructed from ancient bones', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower15', name: 'Crystal Spire', description: 'A spire of pure crystal that shines brightly', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower16', name: 'Diamond Citadel', description: 'A citadel made of the hardest diamonds', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower17', name: 'Ebony Stronghold', description: 'A stronghold crafted from dark ebony wood', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower18', name: 'Frost Tower', description: 'A tower that emanates a chilling frost', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower19', name: 'Garnet Fortress', description: 'A fortress glowing with red garnet power', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower20', name: 'Horn Keep', description: 'A keep adorned with mystical horns', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower21', name: 'Iron Spire', description: 'A spire forged from the strongest iron', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'tower22', name: 'Jade Citadel', description: 'A citadel made from green jade stone', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/1zn1W9K.png' },
    // Add more towers as needed
];

export const towersOnOffer: Tower[] = [
    { id: 'tower1', name: 'Crimson Bastion', description: 'A crimson fortress imbued with fire magic', power: assignRandomPower(), cost: assignRandomCost(), image: 'https://i.imgur.com/jwUmGqI.png' },
];
