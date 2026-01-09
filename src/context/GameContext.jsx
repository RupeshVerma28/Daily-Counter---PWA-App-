import React, { createContext, useContext } from 'react';
import { useCounterStorage } from '../hooks/useCounterStorage';

const GameContext = createContext();

export function GameProvider({ children }) {
    const counterData = useCounterStorage();

    return (
        <GameContext.Provider value={counterData}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
