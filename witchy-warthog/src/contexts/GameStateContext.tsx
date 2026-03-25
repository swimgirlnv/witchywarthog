import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { towerDeck, towersOnOffer } from '../cardLists/towers';
import { wizardDeck, wizardsOnOffer } from '../cardLists/wizards';
import { familiarDeck, familiarsOnOffer } from '../cardLists/familiars';
import { spellDeck, spellsOnOffer, allSpells } from '../cardLists/spells';
import { resourceDeck } from '../cardLists/resources';
import { shuffledDungeonDeck } from '../cardLists/dungeon';
import { achievementsPool, Achievement } from '../components/Achievements/achievementsData';
import { subscribeToRoom, updateRoomGameState } from '../services/gameRooms';

const REAGENT_KEYS = ['mandrake', 'nightshade', 'foxglove', 'toadstool', 'horn'] as const;
const SPELL_RESEARCH_COST = 5;
const ACTIVE_ROOM_KEY = 'witchyWarthog.activeRoomCode';
const ACTIVE_UID_KEY = 'witchyWarthog.activeUid';

type ReagentKey = typeof REAGENT_KEYS[number];

interface Resources {
  mandrake: number;
  nightshade: number;
  foxglove: number;
  toadstool: number;
  horn: number;
  gold: number;
  mana: number;
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  power: Power;
  manaCost: number;
  cost: ResourceOptions;
  isCast: boolean;
  image: string;
}

export interface Wizard {
  id: string;
  name: string;
  description: string;
  power: Power;
  image: string;
}

export interface Familiar {
  id: string;
  name: string;
  description: string;
  power: Power;
  cost: number;
  reagentCost: ResourceOptions;
  gather: ResourceOptions;
  image: string;
}

export interface Tower {
  id: string;
  name: string;
  description: string;
  power: Power;
  cost: number;
  reagentCost: ResourceOptions;
  image: string;
}

export interface ResourceOptions {
  [key: string]: number;
  mandrake: number;
  nightshade: number;
  foxglove: number;
  toadstool: number;
  horn: number;
}

export interface Power {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface ResourceCard {
  id: string;
  gather: ResourceOptions;
  increase: ResourceOptions;
}

interface Player {
  id: string;
  name: string;
  resources: Resources;
  spells: Spell[];
  wizards: Wizard[];
  familiars: Familiar[];
  towers: Tower[];
  resourceCards: ResourceCard[];
  dungeonHits: number;
  dungeonTreasures: DungeonCard[];
  dungeonDrawnThisExpedition: DungeonCard[];
}

export interface DungeonCard {
  id: string;
  type: 'monster' | 'treasure';
  description: string;
  image: string;
  value?: number;
}

export interface GameState {
  players: Player[];
  resources: Resources;
  towerDeck: Tower[];
  towersOnOffer: Tower[];
  wizardDeck: Wizard[];
  wizardsOnOffer: Wizard[];
  familiarDeck: Familiar[];
  familiarsOnOffer: Familiar[];
  spellDeck: Spell[];
  spellsOnOffer: Spell[];
  dungeonDeck: DungeonCard[];
  achievementsPool: Achievement[];
  achievementsOnOffer: Achievement[];
  currentPlayerIndex: number;
  turnNumber: number;
  gameEnded: boolean;
}

export interface ActionResult {
  ok: boolean;
  message: string;
}

interface InitializePlayer {
  uid: string;
  name: string;
}

const shuffleArray = <T,>(cards: T[]): T[] => {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const cloneResourceBundle = (bundle: ResourceOptions): ResourceOptions => ({
  mandrake: bundle.mandrake,
  nightshade: bundle.nightshade,
  foxglove: bundle.foxglove,
  toadstool: bundle.toadstool,
  horn: bundle.horn,
});

const clonePlayer = (player: Player): Player => ({
  ...player,
  resources: { ...player.resources },
  spells: player.spells.map(spell => ({ ...spell, cost: cloneResourceBundle(spell.cost) })),
  wizards: [...player.wizards],
  familiars: player.familiars.map(familiar => ({ ...familiar, reagentCost: cloneResourceBundle(familiar.reagentCost), gather: cloneResourceBundle(familiar.gather) })),
  towers: player.towers.map(tower => ({ ...tower, reagentCost: cloneResourceBundle(tower.reagentCost) })),
  resourceCards: player.resourceCards.map(card => ({
    ...card,
    gather: cloneResourceBundle(card.gather),
    increase: cloneResourceBundle(card.increase),
  })),
  dungeonTreasures: [...player.dungeonTreasures],
  dungeonDrawnThisExpedition: [...player.dungeonDrawnThisExpedition],
});

const cloneState = (state: GameState): GameState => ({
  ...state,
  players: state.players.map(clonePlayer),
  resources: { ...state.resources },
  towerDeck: state.towerDeck.map(tower => ({ ...tower, reagentCost: cloneResourceBundle(tower.reagentCost) })),
  towersOnOffer: state.towersOnOffer.map(tower => ({ ...tower, reagentCost: cloneResourceBundle(tower.reagentCost) })),
  wizardDeck: state.wizardDeck.map(wizard => ({ ...wizard })),
  wizardsOnOffer: state.wizardsOnOffer.map(wizard => ({ ...wizard })),
  familiarDeck: state.familiarDeck.map(familiar => ({ ...familiar, reagentCost: cloneResourceBundle(familiar.reagentCost), gather: cloneResourceBundle(familiar.gather) })),
  familiarsOnOffer: state.familiarsOnOffer.map(familiar => ({ ...familiar, reagentCost: cloneResourceBundle(familiar.reagentCost), gather: cloneResourceBundle(familiar.gather) })),
  spellDeck: state.spellDeck.map(spell => ({ ...spell, cost: cloneResourceBundle(spell.cost) })),
  spellsOnOffer: state.spellsOnOffer.map(spell => ({ ...spell, cost: cloneResourceBundle(spell.cost) })),
  dungeonDeck: [...state.dungeonDeck],
  achievementsPool: [...state.achievementsPool],
  achievementsOnOffer: [...state.achievementsOnOffer],
});

const getCarryLimit = (player: Player) => 10 + player.towers.length;

const canAffordReagentCost = (resources: Resources, cost: ResourceOptions) =>
  REAGENT_KEYS.every(reagent => resources[reagent] >= cost[reagent]);

const spendReagentCost = (resources: Resources, cost: ResourceOptions) => {
  REAGENT_KEYS.forEach(reagent => {
    resources[reagent] -= cost[reagent];
  });
};

const canCastSpell = (resources: Resources, spell: Spell) =>
  REAGENT_KEYS.every(reagent => resources[reagent] >= spell.cost[reagent]);

const castSpell = (player: Player, spellId: string) => {
  const spell = player.spells.find(candidate => candidate.id === spellId && !candidate.isCast);
  if (!spell || !canCastSpell(player.resources, spell)) {
    return false;
  }

  spendReagentCost(player.resources, spell.cost);
  spell.isCast = true;
  return true;
};

const addReagentsWithLimit = (player: Player, bundle: ResourceOptions) => {
  let remainingSpace = getCarryLimit(player) - REAGENT_KEYS.reduce((sum, reagent) => sum + player.resources[reagent], 0);
  let gained = 0;
  let overflow = 0;

  REAGENT_KEYS.forEach(reagent => {
    const requested = bundle[reagent];
    if (requested <= 0) return;

    const added = Math.max(0, Math.min(requested, remainingSpace));
    player.resources[reagent] += added;
    gained += added;
    overflow += requested - added;
    remainingSpace -= added;
  });

  return { gained, overflow };
};

const addReagentsIgnoringLimit = (player: Player, bundle: ResourceOptions) => {
  REAGENT_KEYS.forEach(reagent => {
    player.resources[reagent] += bundle[reagent];
  });
};

const formatBundle = (bundle: ResourceOptions) => {
  const parts = REAGENT_KEYS
    .filter(reagent => bundle[reagent] > 0)
    .map(reagent => `${bundle[reagent]} ${reagent}`);
  return parts.length > 0 ? parts.join(', ') : 'nothing';
};

const countMatchingSchoolCards = (player: Player, schoolName: string) => {
  const allCards = [...player.wizards, ...player.towers, ...player.spells, ...player.familiars];
  return allCards.filter(card => card.power.name === schoolName).length;
};

const removeCardFromOffer = <T extends { id: string }>(offer: T[], deck: T[], selectedId: string) => {
  const nextOffer = offer.filter(card => card.id !== selectedId);
  const nextDeck = [...deck];

  if (nextDeck.length > 0) {
    const nextCard = nextDeck.pop();
    if (nextCard) nextOffer.push(nextCard);
  }

  return { nextOffer, nextDeck };
};

const isGameEnded = (state: GameState) =>
  state.wizardDeck.length === 0 ||
  state.towerDeck.length === 0 ||
  state.spellDeck.length === 0 ||
  state.familiarDeck.length === 0;

const createPlayer = ({ uid, name }: InitializePlayer): Player => ({
  id: uid,
  name,
  resources: { mandrake: 0, nightshade: 0, foxglove: 0, toadstool: 0, horn: 0, gold: 0, mana: 20 },
  spells: [],
  wizards: [],
  familiars: [],
  towers: [],
  resourceCards: resourceDeck.slice(0, 3).map(card => ({
    ...card,
    gather: cloneResourceBundle(card.gather),
    increase: cloneResourceBundle(card.increase),
  })),
  dungeonHits: 0,
  dungeonTreasures: [],
  dungeonDrawnThisExpedition: [],
});

export const buildInitialGameState = (players: InitializePlayer[]): GameState => ({
  players: players.length > 0 ? players.map(createPlayer) : [createPlayer({ uid: 'player1', name: 'Player 1' })],
  resources: { mandrake: 1, nightshade: 1, foxglove: 1, toadstool: 1, horn: 1, gold: 0, mana: 0 },
  towerDeck: shuffleArray(towerDeck.map(tower => ({ ...tower, reagentCost: cloneResourceBundle(tower.reagentCost) }))),
  towersOnOffer: shuffleArray(towersOnOffer.map(tower => ({ ...tower, reagentCost: cloneResourceBundle(tower.reagentCost) }))),
  wizardDeck: shuffleArray(wizardDeck.map(wizard => ({ ...wizard }))),
  wizardsOnOffer: shuffleArray(wizardsOnOffer.map(wizard => ({ ...wizard }))),
  familiarDeck: shuffleArray(familiarDeck.map(familiar => ({ ...familiar, reagentCost: cloneResourceBundle(familiar.reagentCost), gather: cloneResourceBundle(familiar.gather) }))),
  familiarsOnOffer: shuffleArray(familiarsOnOffer.map(familiar => ({ ...familiar, reagentCost: cloneResourceBundle(familiar.reagentCost), gather: cloneResourceBundle(familiar.gather) }))),
  spellDeck: shuffleArray(allSpells.slice(4).map(spell => ({ ...spell, cost: cloneResourceBundle(spell.cost), manaCost: SPELL_RESEARCH_COST }))),
  spellsOnOffer: shuffleArray(allSpells.slice(0, 4).map(spell => ({ ...spell, cost: cloneResourceBundle(spell.cost), manaCost: SPELL_RESEARCH_COST }))),
  dungeonDeck: shuffleArray(shuffledDungeonDeck as DungeonCard[]),
  achievementsPool: [...achievementsPool],
  achievementsOnOffer: shuffleArray(achievementsPool).slice(0, 4),
  currentPlayerIndex: 0,
  turnNumber: 1,
  gameEnded: false,
});

const defaultState = buildInitialGameState([{ uid: 'player1', name: 'Player 1' }]);

const applyPlayerAction = (state: GameState, playerId: string, action: string, payload: any = {}) => {
  const nextState = cloneState(state);
  const playerIndex = nextState.players.findIndex(player => player.id === playerId);
  if (playerIndex === -1) {
    return { nextState: state, result: { ok: false, message: 'Player not found.' } as ActionResult };
  }

  if (nextState.players[nextState.currentPlayerIndex]?.id !== playerId) {
    return { nextState: state, result: { ok: false, message: 'It is not your turn.' } as ActionResult };
  }

  const player = nextState.players[playerIndex];
  let result: ActionResult = { ok: false, message: 'That action could not be completed.' };

  switch (action) {
    case 'gatherResources': {
      const card = player.resourceCards.find(resourceCard => resourceCard.id === payload.cardId);
      if (!card) return { nextState: state, result: { ok: false, message: 'Choose a valid reagent card.' } };
      const { gained, overflow } = addReagentsWithLimit(player, card.gather);
      REAGENT_KEYS.forEach(reagent => {
        nextState.resources[reagent] = Math.min(10, nextState.resources[reagent] + card.increase[reagent]);
      });
      result = {
        ok: true,
        message: overflow > 0
          ? `Gathered ${gained} reagents. ${overflow} could not be stored.`
          : `Gathered ${gained} reagents and raised the market values shown on the card.`,
      };
      break;
    }
    case 'convertResourcesToMana': {
      const resource = payload.resource as ReagentKey;
      const quantity = Number(payload.quantity ?? 0);
      if (!REAGENT_KEYS.includes(resource) || quantity < 1) {
        return { nextState: state, result: { ok: false, message: 'Select a reagent and a valid quantity.' } };
      }
      if (player.resources[resource] < quantity) {
        return { nextState: state, result: { ok: false, message: `You only have ${player.resources[resource]} ${resource}.` } };
      }
      const currentTrackValue = nextState.resources[resource];
      const manaGained = currentTrackValue * quantity;
      player.resources[resource] -= quantity;
      player.resources.mana += manaGained;
      nextState.resources[resource] = Math.max(1, currentTrackValue - quantity);
      result = { ok: true, message: `Converted ${quantity} ${resource} into ${manaGained} mana.` };
      break;
    }
    case 'recruitWizard': {
      const wizard = nextState.wizardsOnOffer.find(card => card.id === payload.wizardId);
      const bidAmount = Number(payload.bidAmount ?? 0);
      if (!wizard) return { nextState: state, result: { ok: false, message: 'Choose a wizard to recruit.' } };
      if (bidAmount < 1) return { nextState: state, result: { ok: false, message: 'A wizard bid must be at least 1 mana.' } };
      if (player.resources.mana < bidAmount) {
        return { nextState: state, result: { ok: false, message: `You need ${bidAmount} mana to make that bid.` } };
      }
      player.resources.mana -= bidAmount;
      player.wizards.push(wizard);
      const { nextOffer, nextDeck } = removeCardFromOffer(nextState.wizardsOnOffer, nextState.wizardDeck, wizard.id);
      nextState.wizardsOnOffer = nextOffer;
      nextState.wizardDeck = nextDeck;
      result = { ok: true, message: `Recruited ${wizard.name} for ${bidAmount} mana.` };
      break;
    }
    case 'researchSpell': {
      const spell = nextState.spellsOnOffer.find(card => card.id === payload.spellId);
      const castNow = Boolean(payload.castNow);
      if (!spell) return { nextState: state, result: { ok: false, message: 'Choose a spell to research.' } };
      if (player.resources.mana < SPELL_RESEARCH_COST) {
        return { nextState: state, result: { ok: false, message: `Researching a spell costs ${SPELL_RESEARCH_COST} mana.` } };
      }
      player.resources.mana -= SPELL_RESEARCH_COST;
      const researchedSpell = { ...spell, isCast: false, cost: cloneResourceBundle(spell.cost), manaCost: SPELL_RESEARCH_COST };
      player.spells.push(researchedSpell);
      if (castNow) castSpell(player, researchedSpell.id);
      const { nextOffer, nextDeck } = removeCardFromOffer(nextState.spellsOnOffer, nextState.spellDeck, spell.id);
      nextState.spellsOnOffer = nextOffer;
      nextState.spellDeck = nextDeck;
      result = {
        ok: true,
        message: researchedSpell.isCast ? `Researched and cast ${spell.name}.` : `Researched ${spell.name}. It is ready to cast later.`,
      };
      break;
    }
    case 'createTower': {
      const tower = nextState.towersOnOffer.find(card => card.id === payload.towerId);
      const paymentMethod = payload.paymentMethod as 'gold' | 'reagents';
      if (!tower) return { nextState: state, result: { ok: false, message: 'Choose a tower to create.' } };
      if (paymentMethod === 'reagents') {
        if (!canAffordReagentCost(player.resources, tower.reagentCost)) {
          return { nextState: state, result: { ok: false, message: `You cannot afford ${tower.name} with reagents.` } };
        }
        spendReagentCost(player.resources, tower.reagentCost);
      } else {
        if (player.resources.gold < tower.cost) {
          return { nextState: state, result: { ok: false, message: `You need ${tower.cost} gold to create ${tower.name}.` } };
        }
        player.resources.gold -= tower.cost;
      }
      player.towers.push(tower);
      const { nextOffer, nextDeck } = removeCardFromOffer(nextState.towersOnOffer, nextState.towerDeck, tower.id);
      nextState.towersOnOffer = nextOffer;
      nextState.towerDeck = nextDeck;
      result = {
        ok: true,
        message: paymentMethod === 'reagents'
          ? `Created ${tower.name} by spending ${formatBundle(tower.reagentCost)}.`
          : `Created ${tower.name} by spending ${tower.cost} gold.`,
      };
      break;
    }
    case 'summonFamiliar': {
      const familiar = nextState.familiarsOnOffer.find(card => card.id === payload.familiarId);
      const familiarAction = payload.action as string;
      const selectedSpellIds = Array.isArray(payload.spellIds) ? payload.spellIds : [];
      const spellId = payload.spellId as string | undefined;
      const familiarPaymentMethod = payload.paymentMethod as 'mana' | 'reagents' ?? 'mana';
      if (!familiar) return { nextState: state, result: { ok: false, message: 'Choose a familiar to summon.' } };
      if (familiarPaymentMethod === 'reagents') {
        if (!canAffordReagentCost(player.resources, familiar.reagentCost)) {
          return { nextState: state, result: { ok: false, message: `You cannot afford ${familiar.name} with reagents.` } };
        }
        spendReagentCost(player.resources, familiar.reagentCost);
      } else {
        if (player.resources.mana < familiar.cost) {
          return { nextState: state, result: { ok: false, message: `You need ${familiar.cost} mana to summon ${familiar.name}.` } };
        }
        player.resources.mana -= familiar.cost;
      }
      player.familiars.push(familiar);
      const { nextOffer, nextDeck } = removeCardFromOffer(nextState.familiarsOnOffer, nextState.familiarDeck, familiar.id);
      nextState.familiarsOnOffer = nextOffer;
      nextState.familiarDeck = nextDeck;

      switch (familiarAction) {
        case 'scoreSchool': {
          const matchingCards = countMatchingSchoolCards(player, familiar.power.name);
          const goldEarned = matchingCards * 2;
          player.resources.gold += goldEarned;
          result = { ok: true, message: `${familiar.name} scored ${goldEarned} gold from ${matchingCards} ${familiar.power.name} cards.` };
          break;
        }
        case 'gatherResourcesAndCastSpells': {
          addReagentsIgnoringLimit(player, familiar.gather);
          const castCount = selectedSpellIds.reduce((count, candidateId) => (castSpell(player, candidateId) ? count + 1 : count), 0);
          result = { ok: true, message: `${familiar.name} gathered ${formatBundle(familiar.gather)} and cast ${castCount} spell${castCount === 1 ? '' : 's'}.` };
          break;
        }
        case 'newResearch': {
          if (!spellId) return { nextState: state, result: { ok: false, message: 'Select one of the refreshed spells to keep.' } };
          const selectedSpell = nextState.spellsOnOffer.find(card => card.id === spellId);
          if (!selectedSpell) return { nextState: state, result: { ok: false, message: 'Choose a spell from the refreshed offer.' } };
          player.spells.push({ ...selectedSpell, isCast: false, cost: cloneResourceBundle(selectedSpell.cost), manaCost: SPELL_RESEARCH_COST });
          const refreshed = removeCardFromOffer(nextState.spellsOnOffer, nextState.spellDeck, spellId);
          nextState.spellsOnOffer = refreshed.nextOffer;
          nextState.spellDeck = refreshed.nextDeck;
          result = { ok: true, message: `${familiar.name} discovered ${selectedSpell.name} for free.` };
          break;
        }
        case 'enterDungeon':
          player.dungeonHits = 0;
          player.dungeonDrawnThisExpedition = [];
          result = { ok: true, message: `${familiar.name} entered the dungeon.` };
          break;
        default:
          return { nextState: state, result: { ok: false, message: 'Choose a familiar action.' } };
      }
      break;
    }
    default:
      return { nextState: state, result: { ok: false, message: 'Unknown action.' } };
  }

  nextState.gameEnded = isGameEnded(nextState);
  return { nextState, result };
};

const drawDungeonCardState = (state: GameState, playerId: string) => {
  const nextState = cloneState(state);
  const playerIndex = nextState.players.findIndex(player => player.id === playerId);
  if (playerIndex === -1 || nextState.players[nextState.currentPlayerIndex]?.id !== playerId || nextState.dungeonDeck.length === 0) {
    return { nextState: state, drawnCard: null };
  }

  const player = nextState.players[playerIndex];
  const card = nextState.dungeonDeck.pop();
  if (!card) return { nextState: state, drawnCard: null };

  player.dungeonDrawnThisExpedition.push(card);

  if (card.type === 'monster') {
    player.dungeonHits += 1;
    if (player.dungeonHits >= 2) {
      nextState.dungeonDeck = shuffleArray([...nextState.dungeonDeck, ...player.dungeonDrawnThisExpedition]);
      player.dungeonHits = 0;
      player.dungeonDrawnThisExpedition = [];
      return { nextState, drawnCard: null };
    }
  }

  return { nextState, drawnCard: card };
};

const endDungeonExpeditionState = (state: GameState, playerId: string) => {
  const nextState = cloneState(state);
  const playerIndex = nextState.players.findIndex(player => player.id === playerId);
  if (playerIndex === -1 || nextState.players[nextState.currentPlayerIndex]?.id !== playerId) return state;

  const player = nextState.players[playerIndex];
  const treasures = player.dungeonDrawnThisExpedition.filter(card => card.type === 'treasure');
  const monsters = player.dungeonDrawnThisExpedition.filter(card => card.type === 'monster');
  const goldEarned = treasures.reduce((sum, card) => sum + (card.value ?? 0), 0);

  player.resources.gold += goldEarned;
  player.dungeonTreasures.push(...treasures);
  player.dungeonHits = 0;
  player.dungeonDrawnThisExpedition = [];
  nextState.dungeonDeck = shuffleArray([...nextState.dungeonDeck, ...monsters]);
  return nextState;
};

const refreshSpellOfferState = (state: GameState, playerId: string) => {
  if (state.players[state.currentPlayerIndex]?.id !== playerId || state.spellDeck.length === 0) return state;
  const nextState = cloneState(state);
  const nextDeck = [...nextState.spellDeck];
  const nextOffer: Spell[] = [];
  for (let i = 0; i < 4 && nextDeck.length > 0; i += 1) {
    const card = nextDeck.pop();
    if (card) nextOffer.push({ ...card, cost: cloneResourceBundle(card.cost), manaCost: SPELL_RESEARCH_COST });
  }
  nextState.spellsOnOffer = nextOffer;
  nextState.spellDeck = nextDeck;
  nextState.gameEnded = nextDeck.length === 0 || nextState.gameEnded;
  return nextState;
};

const endTurnState = (state: GameState) => {
  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  const nextTurnNumber = nextPlayerIndex === 0 ? state.turnNumber + 1 : state.turnNumber;
  return {
    ...cloneState(state),
    currentPlayerIndex: nextPlayerIndex,
    turnNumber: nextTurnNumber,
    gameEnded: isGameEnded(state),
  };
};

const GameStateContext = createContext<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  takeTurn: (playerId: string, action: string, payload?: any) => Promise<ActionResult>;
  drawDungeonCard: (playerId: string) => Promise<DungeonCard | null>;
  endDungeonExpedition: (playerId: string) => Promise<void>;
  refreshSpellOffer: () => Promise<void>;
  endTurn: () => Promise<void>;
  initializeGame: (players: InitializePlayer[]) => GameState;
  attachToRoom: (roomCode: string, viewerUid: string) => void;
  leaveRoom: () => void;
  activeRoomCode: string | null;
  viewerPlayerId: string | null;
  isMyTurn: boolean;
}>({
  gameState: defaultState,
  setGameState: () => {},
  takeTurn: async () => ({ ok: false, message: 'Action unavailable.' }),
  drawDungeonCard: async () => null,
  endDungeonExpedition: async () => {},
  refreshSpellOffer: async () => {},
  endTurn: async () => {},
  initializeGame: () => defaultState,
  attachToRoom: () => {},
  leaveRoom: () => {},
  activeRoomCode: null,
  viewerPlayerId: null,
  isMyTurn: true,
});

export const useGameState = () => useContext(GameStateContext);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(defaultState);
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(() => localStorage.getItem(ACTIVE_ROOM_KEY));
  const [viewerUid, setViewerUid] = useState<string | null>(() => localStorage.getItem(ACTIVE_UID_KEY));

  useEffect(() => {
    if (!activeRoomCode) return;
    const unsubscribe = subscribeToRoom(activeRoomCode, room => {
      if (room.gameState) {
        setGameState(room.gameState as GameState);
      }
    });
    return unsubscribe;
  }, [activeRoomCode]);

  const attachToRoom = (roomCode: string, nextViewerUid: string) => {
    setActiveRoomCode(roomCode);
    setViewerUid(nextViewerUid);
    localStorage.setItem(ACTIVE_ROOM_KEY, roomCode);
    localStorage.setItem(ACTIVE_UID_KEY, nextViewerUid);
  };

  const leaveRoom = () => {
    setActiveRoomCode(null);
    setViewerUid(null);
    localStorage.removeItem(ACTIVE_ROOM_KEY);
    localStorage.removeItem(ACTIVE_UID_KEY);
  };

  const initializeGame = (players: InitializePlayer[]) => {
    const state = buildInitialGameState(players);
    setGameState(state);
    return state;
  };

  const viewerPlayerId = useMemo(
    () => gameState.players.find(player => player.id === viewerUid)?.id ?? null,
    [gameState.players, viewerUid],
  );
  const isMyTurn = viewerPlayerId ? gameState.players[gameState.currentPlayerIndex]?.id === viewerPlayerId : true;

  const syncStateMutation = async <T,>(
    localUpdater: (state: GameState) => { nextState: GameState; result: T },
    remoteUpdater: (state: GameState) => { nextState: GameState; result: T },
  ) => {
    if (!activeRoomCode) {
      let output: T | null = null;
      setGameState(prevState => {
        const updated = localUpdater(prevState);
        output = updated.result;
        return updated.nextState;
      });
      return output as T;
    }

    const remoteResult = await updateRoomGameState(activeRoomCode, room => {
      const currentState = (room.gameState as GameState) ?? defaultState;
      const updated = remoteUpdater(currentState);
      return { room: { ...room, gameState: updated.nextState }, result: updated };
    });
    setGameState(remoteResult.nextState);
    return remoteResult.result;
  };

  const takeTurn = async (playerId: string, action: string, payload: any = {}) => {
    return syncStateMutation(
      state => applyPlayerAction(state, playerId, action, payload),
      state => applyPlayerAction(state, playerId, action, payload),
    );
  };

  const drawDungeonCard = async (playerId: string) => {
    return syncStateMutation(
      state => {
        const updated = drawDungeonCardState(state, playerId);
        return { nextState: updated.nextState, result: updated.drawnCard };
      },
      state => {
        const updated = drawDungeonCardState(state, playerId);
        return { nextState: updated.nextState, result: updated.drawnCard };
      },
    );
  };

  const endDungeonExpedition = async (playerId: string) => {
    await syncStateMutation(
      state => ({ nextState: endDungeonExpeditionState(state, playerId), result: undefined }),
      state => ({ nextState: endDungeonExpeditionState(state, playerId), result: undefined }),
    );
  };

  const refreshSpellOffer = async () => {
    const actingPlayerId = gameState.players[gameState.currentPlayerIndex]?.id;
    if (!actingPlayerId) return;
    await syncStateMutation(
      state => ({ nextState: refreshSpellOfferState(state, actingPlayerId), result: undefined }),
      state => ({ nextState: refreshSpellOfferState(state, actingPlayerId), result: undefined }),
    );
  };

  const endTurn = async () => {
    await syncStateMutation(
      state => ({ nextState: endTurnState(state), result: undefined }),
      state => ({ nextState: endTurnState(state), result: undefined }),
    );
  };

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        setGameState,
        takeTurn,
        drawDungeonCard,
        endDungeonExpedition,
        refreshSpellOffer,
        endTurn,
        initializeGame,
        attachToRoom,
        leaveRoom,
        activeRoomCode,
        viewerPlayerId,
        isMyTurn,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
