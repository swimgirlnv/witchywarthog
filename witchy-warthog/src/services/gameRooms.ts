import { db } from '../firebaseConfig';
import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
} from 'firebase/firestore';

export interface RoomPlayer {
  uid: string;
  displayName: string;
  kingdomId: string | null;
  kingdomName: string | null;
}

export interface GameRoom {
  code: string;
  hostUid: string;
  status: 'lobby' | 'playing';
  createdAt: number;
  updatedAt?: number;
  startedAt?: number;
  players: RoomPlayer[];
  gameState?: any;
}

const roomNamespace = import.meta.env.VITE_GAME_NAMESPACE || 'default';
const gamesCollection = `games_${roomNamespace}`;
const roomRef = (code: string) => doc(db, gamesCollection, code);

const generateCode = (): string =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const createRoom = async (
  hostUid: string,
  displayName: string,
): Promise<string> => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateCode();
    const created = await runTransaction(db, async transaction => {
      const ref = roomRef(code);
      const snap = await transaction.get(ref);
      if (snap.exists()) return false;

      const room: GameRoom = {
        code,
        hostUid,
        status: 'lobby',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        players: [{ uid: hostUid, displayName, kingdomId: null, kingdomName: null }],
      };
      transaction.set(ref, room);
      return true;
    });

    if (created) return code;
  }

  throw new Error('Could not create a unique room code.');
};

export const joinRoom = async (
  code: string,
  uid: string,
  displayName: string,
): Promise<{ ok: boolean; error?: string }> => {
  return runTransaction(db, async transaction => {
    const ref = roomRef(code);
    const snap = await transaction.get(ref);
    if (!snap.exists()) return { ok: false, error: 'Game not found. Check the code and try again.' };

    const room = snap.data() as GameRoom;
    if (room.status !== 'lobby') return { ok: false, error: 'This game has already started.' };
    if (room.players.length >= 4 && !room.players.some(player => player.uid === uid)) {
      return { ok: false, error: 'This game is full (max 4 players).' };
    }

    const alreadyIn = room.players.some(player => player.uid === uid);
    if (!alreadyIn) {
      const updatedPlayers: RoomPlayer[] = [
        ...room.players,
        { uid, displayName, kingdomId: null, kingdomName: null },
      ];
      transaction.update(ref, { players: updatedPlayers, updatedAt: Date.now() });
    }

    return { ok: true };
  });
};

export const selectKingdom = async (
  code: string,
  uid: string,
  kingdomId: string,
  kingdomName: string,
): Promise<void> => {
  await runTransaction(db, async transaction => {
    const ref = roomRef(code);
    const snap = await transaction.get(ref);
    if (!snap.exists()) return;

    const room = snap.data() as GameRoom;
    if (room.status !== 'lobby') return;

    const takenByOther = room.players.some(player => player.uid !== uid && player.kingdomId === kingdomId);
    if (takenByOther) {
      throw new Error('That kingdom is already taken.');
    }

    const updatedPlayers = room.players.map(player =>
      player.uid === uid ? { ...player, kingdomId, kingdomName } : player,
    );
    transaction.update(ref, { players: updatedPlayers, updatedAt: Date.now() });
  });
};

export const startGame = async (code: string, starterUid: string, initialGameState: any): Promise<void> => {
  await runTransaction(db, async transaction => {
    const ref = roomRef(code);
    const snap = await transaction.get(ref);
    if (!snap.exists()) {
      throw new Error('Game room not found.');
    }

    const room = snap.data() as GameRoom;
    if (room.status !== 'lobby') {
      throw new Error('This game has already started.');
    }
    if (room.hostUid !== starterUid) {
      throw new Error('Only the host can start the game.');
    }
    if (room.players.length < 1) {
      throw new Error('You need at least one player.');
    }
    if (!room.players.every(player => player.kingdomId)) {
      throw new Error('All players must choose a kingdom before starting.');
    }

    transaction.update(ref, {
      status: 'playing',
      startedAt: Date.now(),
      updatedAt: Date.now(),
      gameState: initialGameState,
    });
  });
};

export const subscribeToRoom = (
  code: string,
  callback: (room: GameRoom) => void,
): (() => void) =>
  onSnapshot(roomRef(code), snap => {
    if (snap.exists()) callback(snap.data() as GameRoom);
  });

export const getRoom = async (code: string): Promise<GameRoom | null> => {
  const snap = await getDoc(roomRef(code));
  return snap.exists() ? (snap.data() as GameRoom) : null;
};

export const updateRoomGameState = async <T>(
  code: string,
  updater: (room: GameRoom) => { room: GameRoom; result: T },
): Promise<T> => {
  return runTransaction(db, async transaction => {
    const ref = roomRef(code);
    const snap = await transaction.get(ref);
    if (!snap.exists()) {
      throw new Error('Game room not found.');
    }

    const room = snap.data() as GameRoom;
    const updated = updater(room);
    transaction.update(ref, { ...updated.room, updatedAt: Date.now() });
    return updated.result;
  });
};
