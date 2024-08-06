// // src/App.tsx
// import { GameStateProvider } from './contexts/GameStateContext';
// import GameBoard from './components/GameBoard/GameBoard';
// import PlayerActions from './components/PlayerActions';
// import './App.css';
// import TopBar from './components/TobBar';

// function App() {
//   return (
//     <GameStateProvider>
//       <div className="App">
//         <TopBar />
//         <GameBoard />
//         <PlayerActions />
//       </div>
//     </GameStateProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import GameBoard from './components/GameBoard/GameBoard';
import JoinGame from './components/JoinGame/JoinGame';
import { GameStateProvider } from './contexts/GameStateContext';
import './App.css'; // Import your global styles here

const App = () => {
  return (
    <GameStateProvider>
      <Router>
        <Routes>
          <Route path="/game" element={<GameBoard />} />
          <Route path="/join" element={<JoinGame />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </GameStateProvider>
  );
};

export default App;


