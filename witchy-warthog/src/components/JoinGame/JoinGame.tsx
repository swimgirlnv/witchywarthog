import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinGame.css';
import { useGameState } from '../../contexts/GameStateContext';
import { auth } from '../../firebaseConfig';
import {
  createRoom, joinRoom, selectKingdom, startGame,
  subscribeToRoom, GameRoom,
} from '../../services/gameRooms';

export const KINGDOMS = [
  { id: 'emerald-enclave', name: 'The Emerald Enclave', emblem: '🌿', color: '#2d7a3a', description: 'Masters of Druidry, keepers of ancient forests' },
  { id: 'crimson-citadel', name: 'The Crimson Citadel', emblem: '🔥', color: '#c0392b', description: 'Fearsome sorcerers, wielders of flame and fury' },
  { id: 'azure-arcanum',   name: 'The Azure Arcanum',   emblem: '💧', color: '#1a6fa8', description: 'Scholars of conjuring, collectors of forbidden wisdom' },
  { id: 'golden-griffin',  name: 'The Golden Griffin',  emblem: '⚡', color: '#b8860b', description: 'Alchemists of fortune, turners of lead to gold' },
  { id: 'shadow-sanctum',  name: 'The Shadow Sanctum',  emblem: '🌙', color: '#5b2d8e', description: 'Necromancers who walk the veil between worlds' },
  { id: 'ivory-spire',     name: 'The Ivory Spire',     emblem: '✨', color: '#5a7a8a', description: 'Enchanters of sublime grace, weavers of fate' },
];

type Mode = 'choice' | 'joining' | 'lobby';

const uid  = () => auth.currentUser?.uid ?? 'anon';
const name = () => auth.currentUser?.email?.split('@')[0] ?? 'Wizard';

const JoinGame: React.FC = () => {
  const [mode, setMode]           = useState<Mode>('choice');
  const [codeInput, setCodeInput] = useState('');
  const [roomCode, setRoomCode]   = useState('');
  const [room, setRoom]           = useState<GameRoom | null>(null);
  const [joinError, setJoinError] = useState('');
  const [busy, setBusy]           = useState(false);
  const [copied, setCopied]       = useState(false);
  const unsubRef                  = useRef<(() => void) | null>(null);

  const { initializeGame, attachToRoom } = useGameState();
  const navigate = useNavigate();

  // Subscribe to room changes whenever roomCode is set
  useEffect(() => {
    if (!roomCode) return;
    unsubRef.current = subscribeToRoom(roomCode, updatedRoom => {
      setRoom(updatedRoom);
      // All players navigate when host starts
      if (updatedRoom.status === 'playing' && updatedRoom.gameState) {
        attachToRoom(updatedRoom.code, uid());
        navigate('/game');
      }
    });
    return () => unsubRef.current?.();
  }, [roomCode]);

  const handleCreate = async () => {
    setBusy(true);
    const code = await createRoom(uid(), name());
    setRoomCode(code);
    setMode('lobby');
    setBusy(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');
    setBusy(true);
    const result = await joinRoom(codeInput.trim().toUpperCase(), uid(), name());
    if (result.ok) {
      setRoomCode(codeInput.trim().toUpperCase());
      setMode('lobby');
    } else {
      setJoinError(result.error ?? 'Could not join game.');
    }
    setBusy(false);
  };

  const handleKingdomSelect = async (kingdomId: string) => {
    try {
      setJoinError('');
      const k = KINGDOMS.find(k => k.id === kingdomId)!;
      await selectKingdom(roomCode, uid(), k.id, k.name);
    } catch (error: any) {
      setJoinError(error?.message ?? 'Could not claim that kingdom.');
    }
  };

  const handleStart = async () => {
    try {
      setJoinError('');
      if (!room) return;
      const initialState = initializeGame(
        room.players.map(player => ({
          uid: player.uid,
          name: player.kingdomName ?? player.displayName,
        })),
      );
      await startGame(roomCode, uid(), initialState);
      // Navigation is handled by the onSnapshot listener above
    } catch (error: any) {
      setJoinError(error?.message ?? 'Could not start the game.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const myKingdom  = room?.players.find(p => p.uid === uid())?.kingdomId ?? null;
  const isHost     = room?.hostUid === uid();
  const hostReady  = myKingdom !== null && allPicked;
  const allPicked  = room?.players.every(p => p.kingdomId !== null) ?? false;
  const takenIds   = room?.players
    .filter(p => p.uid !== uid() && p.kingdomId)
    .map(p => p.kingdomId!) ?? [];

  // ── Choice screen ─────────────────────────────────────────
  if (mode === 'choice') {
    return (
      <div className="join-game">
        <div className="setup-panel choice-panel">
          <div className="setup-header">
            <img src="/witchy-warthog-face-right.png" alt="Witchy Warthog" className="setup-mascot" />
            <div>
              <h1 className="setup-title">Witchy Warthog</h1>
              <p className="setup-subtitle">Gather your allies and claim arcane glory</p>
            </div>
          </div>

          <div className="choice-buttons">
            <button className="choice-btn primary" onClick={handleCreate} disabled={busy}>
              <span className="choice-icon">⚔️</span>
              <span className="choice-label">Create a Game</span>
              <span className="choice-hint">Get a code to share with friends</span>
            </button>

            <div className="choice-divider"><span>or</span></div>

            <form className="join-code-form" onSubmit={handleJoin}>
              <label className="join-code-label">Enter Game Code</label>
              <div className="join-code-row">
                <input
                  className="join-code-input"
                  type="text"
                  placeholder="ABC123"
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value.toUpperCase())}
                  maxLength={6}
                  required
                />
                <button className="choice-btn secondary" type="submit" disabled={busy || codeInput.length < 4}>
                  Join →
                </button>
              </div>
              {joinError && <p className="join-error">{joinError}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Lobby screen ──────────────────────────────────────────
  return (
    <div className="join-game">
      <div className="setup-panel">
        <div className="setup-header">
          <img src="/witchy-warthog-face-right.png" alt="Witchy Warthog" className="setup-mascot" />
          <div>
            <h1 className="setup-title">Game Lobby</h1>
            <p className="setup-subtitle">Choose your kingdom while you wait for others to join</p>
          </div>
        </div>

        {/* Share code */}
        <div className="room-code-banner">
          <span className="room-code-label">Invite Code</span>
          <span className="room-code">{roomCode}</span>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

        {/* Connected players */}
        <div className="lobby-players">
          <h3 className="lobby-section-heading">Players in Lobby</h3>
          <div className="lobby-player-list">
            {room?.players.map(player => {
              const k = KINGDOMS.find(k => k.id === player.kingdomId);
              return (
                <div key={player.uid} className="lobby-player-row">
                  <span className="lobby-player-name">
                    {player.displayName}
                    {player.uid === room.hostUid && <span className="host-badge">Host</span>}
                  </span>
                  {k
                    ? <span className="lobby-kingdom-chip" style={{ borderColor: k.color, color: k.color }}>
                        {k.emblem} {k.name}
                      </span>
                    : <span className="lobby-kingdom-pending">choosing…</span>
                  }
                </div>
              );
            })}
            {(!room || room.players.length < 4) && (
              <div className="lobby-waiting-slot">Waiting for players… share the code above</div>
            )}
          </div>
        </div>

        {/* Kingdom picker for current player */}
        <div className="kingdom-section">
          <h3 className="lobby-section-heading">Your Kingdom</h3>
          <div className="kingdom-grid">
            {KINGDOMS.map(kingdom => {
              const isSelected = myKingdom === kingdom.id;
              const isTaken    = takenIds.includes(kingdom.id);
              return (
                <button
                  key={kingdom.id}
                  className={`kingdom-tile ${isSelected ? 'selected' : ''} ${isTaken ? 'taken' : ''}`}
                  style={isSelected ? { borderColor: kingdom.color, background: `${kingdom.color}22` } : {}}
                  onClick={() => !isTaken && handleKingdomSelect(kingdom.id)}
                  disabled={isTaken}
                >
                  <span className="kingdom-emblem">{kingdom.emblem}</span>
                  <span className="kingdom-name" style={isSelected ? { color: kingdom.color } : {}}>
                    {kingdom.name}
                  </span>
                  <span className="kingdom-desc">{kingdom.description}</span>
                  {isTaken && <span className="kingdom-taken-badge">Taken</span>}
                </button>
              );
            })}
          </div>
        </div>

        {isHost && (
          <button
            className={`start-btn ${hostReady ? 'ready' : ''}`}
            onClick={handleStart}
            disabled={!hostReady}
          >
            {hostReady
              ? '⚔️ Begin the Journey!'
              : 'All players must pick kingdoms before the host can start'}
          </button>
        )}
        {!isHost && (
          <p className="waiting-for-host">
            {allPicked ? 'All kingdoms chosen! Waiting for the host to start…' : 'Pick your kingdom above, then wait for the host to begin.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default JoinGame;
