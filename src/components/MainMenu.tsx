import React from 'react';
import clsx from 'clsx';
import { GameMode } from '../App';
import { useStats } from '../hooks/useStats';
import './MainMenu.css';

interface MainMenuProps {
    onStartGame: (difficulty: GameMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
    const { statsByDifficulty, totalStats, resetStats } = useStats();

    const difficultyList: Array<{ key: GameMode; label: string }> = [
        { key: 'easy', label: 'Easy' },
        { key: 'medium', label: 'Medium' },
        { key: 'hard', label: 'Hard' },
    ];

    const getWinRate = (wins: number, gamesPlayed: number) => {
        if (!gamesPlayed) return '0%';
        return `${Math.round((wins / gamesPlayed) * 100)}%`;
    };

    return (
        <div className="main-menu">
            <h1 className="title">
                Neon <span className="highlight">Crosses</span>
            </h1>

            <div className="menu-options">
                <h3>SELECT DIFFICULTY</h3>
                <button onClick={() => onStartGame('easy')}>EASY</button>
                <button onClick={() => onStartGame('medium')}>MEDIUM</button>
                <button className="btn-hard" onClick={() => onStartGame('hard')}>HARD</button>
            </div>

            <div className="stats-section">
                <div className="stats-header">
                    <div className="stats-title">STATS BY DIFFICULTY</div>
                    <div className="overall-pill">
                        <span className="pill-label">Overall</span>
                        <span className="pill-value">{totalStats.wins}W / {totalStats.losses}L / {totalStats.draws}D</span>
                        <span className="pill-muted">{totalStats.gamesPlayed} played</span>
                    </div>
                </div>

                <div className="difficulty-bars">
                    {difficultyList.map(({ key, label }) => {
                        const stats = statsByDifficulty[key];
                        const total = stats.gamesPlayed;
                        const segments = [
                            { label: 'W', value: stats.wins, className: 'seg-win' },
                            { label: 'D', value: stats.draws, className: 'seg-draw' },
                            { label: 'L', value: stats.losses, className: 'seg-loss' },
                        ];

                        return (
                            <div key={key} className="difficulty-row">
                                <div className="difficulty-meta">
                                    <div className="difficulty-label">{label}</div>
                                    <div className="difficulty-rate">{getWinRate(stats.wins, total)} win rate</div>
                                </div>

                                <div className={clsx('bar-track', total === 0 && 'bar-empty')}>
                                    {segments.map(({ label: segLabel, value, className }) => {
                                        const widthPct = total ? (value / total) * 100 : 0;
                                        return (
                                            <div
                                                key={className}
                                                className={clsx('bar-segment', className, value === 0 && 'empty-segment')}
                                                style={{ width: `${widthPct}%` }}
                                            >
                                                {value > 0 && <span className="bar-count">{segLabel} {value}</span>}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="difficulty-total">{total} played</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button className="btn-reset" onClick={resetStats}>RESET STATS</button>
        </div>
    );
};

export default MainMenu;
