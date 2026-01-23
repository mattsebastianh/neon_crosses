import { useState, useEffect } from 'react';
import { GameMode } from '../App';

export interface GameStats {
    wins: number;
    losses: number;
    draws: number;
    gamesPlayed: number;
}

export interface StatsByDifficulty {
    easy: GameStats;
    medium: GameStats;
    hard: GameStats;
}

const INITIAL_STATS: GameStats = {
    wins: 0,
    losses: 0,
    draws: 0,
    gamesPlayed: 0,
};

const INITIAL_STATS_BY_DIFFICULTY: StatsByDifficulty = {
    easy: { ...INITIAL_STATS },
    medium: { ...INITIAL_STATS },
    hard: { ...INITIAL_STATS },
};

export function useStats() {
    const [statsByDifficulty, setStatsByDifficulty] = useState<StatsByDifficulty>(INITIAL_STATS_BY_DIFFICULTY);

    useEffect(() => {
        const saved = localStorage.getItem('tictactoe-stats-v2');
        if (saved) {
            try {
                setStatsByDifficulty(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load stats", e);
            }
        }
    }, []);

    const saveStats = (newStats: StatsByDifficulty) => {
        setStatsByDifficulty(newStats);
        localStorage.setItem('tictactoe-stats-v2', JSON.stringify(newStats));
    };

    const recordWin = (difficulty: GameMode) => {
        const updatedStats = { ...statsByDifficulty };
        updatedStats[difficulty] = {
            ...updatedStats[difficulty],
            wins: updatedStats[difficulty].wins + 1,
            gamesPlayed: updatedStats[difficulty].gamesPlayed + 1,
        };
        saveStats(updatedStats);
    };

    const recordLoss = (difficulty: GameMode) => {
        const updatedStats = { ...statsByDifficulty };
        updatedStats[difficulty] = {
            ...updatedStats[difficulty],
            losses: updatedStats[difficulty].losses + 1,
            gamesPlayed: updatedStats[difficulty].gamesPlayed + 1,
        };
        saveStats(updatedStats);
    };

    const recordDraw = (difficulty: GameMode) => {
        const updatedStats = { ...statsByDifficulty };
        updatedStats[difficulty] = {
            ...updatedStats[difficulty],
            draws: updatedStats[difficulty].draws + 1,
            gamesPlayed: updatedStats[difficulty].gamesPlayed + 1,
        };
        saveStats(updatedStats);
    };

    const resetStats = () => saveStats(INITIAL_STATS_BY_DIFFICULTY);

    // Calculate total stats across all difficulties
    const totalStats: GameStats = {
        wins: statsByDifficulty.easy.wins + statsByDifficulty.medium.wins + statsByDifficulty.hard.wins,
        losses: statsByDifficulty.easy.losses + statsByDifficulty.medium.losses + statsByDifficulty.hard.losses,
        draws: statsByDifficulty.easy.draws + statsByDifficulty.medium.draws + statsByDifficulty.hard.draws,
        gamesPlayed: statsByDifficulty.easy.gamesPlayed + statsByDifficulty.medium.gamesPlayed + statsByDifficulty.hard.gamesPlayed,
    };

    return { statsByDifficulty, totalStats, recordWin, recordLoss, recordDraw, resetStats };
}
