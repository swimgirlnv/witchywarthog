// src/App.tsx
import { GameStateProvider } from './contexts/GameStateContext';
import GameBoard from './components/GameBoard';
import PlayerActions from './components/PlayerActions';
import './App.css';

function App() {
  return (
    <GameStateProvider>
      <div className="App">
        <h1>Witchy Warthog</h1>
        <GameBoard />
        <PlayerActions />
      </div>
    </GameStateProvider>
  );
}

export default App;
