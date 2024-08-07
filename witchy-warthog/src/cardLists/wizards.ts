import { Wizard, Power } from "../contexts/GameStateContext";

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

export const wizardDeck: Wizard[] = [
    { id: 'wizard1', name: 'Witchy Warthog', description: 'A powerful wizard', power: assignRandomPower(), image: 'https://i.imgur.com/0zaAlS0.png' },
    { id: 'wizard2', name: 'Salmon Sorcerer', description: 'A wise wizard', power: assignRandomPower(), image: 'https://i.imgur.com/Vj8FHHb.png' },
    { id: 'wizard3', name: 'Bear Battlemage', description: 'A fiery wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard4', name: 'Dragon Druid', description: 'A gentle wizard', power: assignRandomPower(), image: 'https://i.imgur.com/w1wEqgi.png' },
    { id: 'wizard5', name: 'Giraffe Geomancer', description: 'An earthy wizard', power: assignRandomPower(), image: 'https://i.imgur.com/PrIQBeq.png' }, //beginning of placeholders
    { id: 'wizard6', name: 'Elephant Enchanter', description: 'A magical wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard7', name: 'Kangaroo Kinetist', description: 'A kinetic wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard8', name: 'Lion Luminator', description: 'A radiant wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard9', name: 'Monkey Mesmerist', description: 'A mesmerizing wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard10', name: 'Narwhal Necromancer', description: 'A spooky wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard11', name: 'Owl Oracle', description: 'A wise wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard12', name: 'Penguin Pyrotechnician', description: 'An explosive wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard13', name: 'Quokka Quantumist', description: 'A quantum wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard14', name: 'Raccoon Runemaster', description: 'A runic wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard15', name: 'Sloth Sorcerer', description: 'A slow wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard16', name: 'Tiger Telekinetic', description: 'A telekinetic wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard17', name: 'Unicorn Usurper', description: 'A usurping wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard18', name: 'Vulture Vexer', description: 'A vexing wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard19', name: 'Walrus Warlock', description: 'A warlike wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard20', name: 'Xerus Xenomancer', description: 'An alien wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard21', name: 'Yak Yeller', description: 'A loud wizard', power: assignRandomPower(), image: 'https://i.imgur.com/1zn1W9K.png' },
    { id: 'wizard22', name: 'Zebra Zapper', description: 'A zapping wizard', power: assignRandomPower(), image: 'https://i.imgur.com/8jQbB9X.png' }, // this one is done
    // Add more wizards as needed
  ];

export const wizardsOnOffer: Wizard[] = [
  { id: 'wizard1', name: 'Witchy Warthog', description: 'A powerful wizard', power: assignRandomPower(), image: 'https://i.imgur.com/0zaAlS0.png' },
  { id: 'wizard2', name: 'Salmon Sorcerer', description: 'A wise wizard', power: assignRandomPower(), image: 'https://i.imgur.com/Vj8FHHb.png' },
];
