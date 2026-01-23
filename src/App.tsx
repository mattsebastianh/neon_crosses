import { useState } from 'react';
import './App.css';

// Components (We will build these next)
import GameBoard from './components/GameBoard';
import MainMenu from './components/MainMenu';

export type GameMode = 'easy' | 'medium' | 'hard';
export type View = 'menu' | 'game';

function App() {
    const [view, setView] = useState<View>('menu');
    const [difficulty, setDifficulty] = useState<GameMode>('medium');

    const startGame = (selectedDifficulty: GameMode) => {
        setDifficulty(selectedDifficulty);
        setView('game');
    };

    const returnToMenu = () => {
        setView('menu');
    };

    return (
        <div className="app-container">
            <div className="glow-overlay"></div>
            {view === 'menu' ? (
                <MainMenu onStartGame={startGame} />
            ) : (
                <GameBoard difficulty={difficulty} onBack={returnToMenu} />
            )}
        </div>
    );
}

export default App;
