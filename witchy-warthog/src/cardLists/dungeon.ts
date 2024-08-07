const generateRandomValue = (min: number, max: number): number => {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return value;
  };
  
  const monsterImages = [
    'https://i.imgur.com/zvjzhBr.pngg',
    'https://i.imgur.com/aM39ntn.png',
    'https://i.imgur.com/56UpjaA.png',
    'https://i.imgur.com/uH2NLzg.png'
  ];
  
  const treasureImage = 'https://i.imgur.com/Lu4BomI.png';
  
  export const dungeonDeckData = [
    { id: 'dungeon1', type: 'monster', description: 'A fierce monster', image: monsterImages[0] },
    { id: 'dungeon2', type: 'treasure', description: 'A pile of gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon3', type: 'monster', description: 'A terrifying monster', image: monsterImages[1] },
    { id: 'dungeon4', type: 'treasure', description: 'A chest of gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon5', type: 'monster', description: 'A fearsome monster', image: monsterImages[2] },
    { id: 'dungeon6', type: 'treasure', description: 'A hoard of gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon7', type: 'monster', description: 'A monstrous monster', image: monsterImages[3] },
    { id: 'dungeon8', type: 'treasure', description: 'A mountain of gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon9', type: 'monster', description: 'A gigantic monster', image: monsterImages[0] },
    { id: 'dungeon10', type: 'treasure', description: 'A dragon\'s hoard', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon11', type: 'monster', description: 'A colossal monster', image: monsterImages[1] },
    { id: 'dungeon12', type: 'treasure', description: 'A king\'s ransom in gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon13', type: 'monster', description: 'A gargantuan monster', image: monsterImages[2] },
    { id: 'dungeon14', type: 'treasure', description: 'A pirate\'s treasure', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon15', type: 'monster', description: 'A behemoth monster', image: monsterImages[3] },
    { id: 'dungeon16', type: 'treasure', description: 'A leprechaun\'s pot of gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon17', type: 'monster', description: 'A titan monster', image: monsterImages[0] },
    { id: 'dungeon18', type: 'treasure', description: 'A dragon\'s treasure hoard', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon19', type: 'monster', description: 'A colossal monster', image: monsterImages[1] },
    { id: 'dungeon20', type: 'treasure', description: 'A king\'s ransom in gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon21', type: 'monster', description: 'A gargantuan monster', image: monsterImages[2] },
    { id: 'dungeon22', type: 'treasure', description: 'A pirate\'s treasure', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon23', type: 'monster', description: 'A behemoth monster', image: monsterImages[3] },
    { id: 'dungeon24', type: 'treasure', description: 'A leprechaun\'s pot of gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon25', type: 'monster', description: 'A titan monster', image: monsterImages[0] },
    { id: 'dungeon26', type: 'treasure', description: 'A dragon\'s treasure hoard', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon27', type: 'monster', description: 'A colossal monster', image: monsterImages[1] },
    { id: 'dungeon28', type: 'treasure', description: 'A king\'s ransom in gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon29', type: 'monster', description: 'A gargantuan monster', image: monsterImages[2] },
    { id: 'dungeon30', type: 'treasure', description: 'A pirate\'s treasure', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon31', type: 'monster', description: 'A behemoth monster', image: monsterImages[3] },
    { id: 'dungeon32', type: 'treasure', description: 'A leprechaun\'s pot of gold', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon33', type: 'monster', description: 'A titan monster', image: monsterImages[0] },
    { id: 'dungeon34', type: 'treasure', description: 'A dragon\'s treasure hoard', image: treasureImage, value: generateRandomValue(1, 5) },
    { id: 'dungeon35', type: 'monster', description: 'A colossal monster', image: monsterImages[1] },
    // Add more dungeon cards here
  ];
  
  const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  export const shuffledDungeonDeck = shuffleArray(dungeonDeckData);
  