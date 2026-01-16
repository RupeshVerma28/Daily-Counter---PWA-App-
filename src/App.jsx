import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import CounterDisplay from './components/CounterDisplay';
import AchievementBanner from './components/AchievementBanner';
import HistoryModal from './components/HistoryModal';

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <GameProvider>
      <div className="full-screen">
        <Navbar onHistoryToggle={() => setIsHistoryOpen(true)} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
          <CounterDisplay />
          <AchievementBanner />
        </main>

        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      </div>
    </GameProvider>
  );
}

export default App;
