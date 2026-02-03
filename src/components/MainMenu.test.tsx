import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MainMenu from './MainMenu';
import { useStats } from '../hooks/useStats';
import type { StatsByDifficulty } from '../hooks/useStats';

// Mock the useStats hook
vi.mock('../hooks/useStats', () => ({
  useStats: vi.fn(),
}));

describe('MainMenu', () => {
  const mockOnStartGame = vi.fn();
  const mockResetStats = vi.fn();

  const mockStatsEmpty: StatsByDifficulty = {
    easy: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
    medium: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
    hard: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
  };

  const mockStatsWithData: StatsByDifficulty = {
    easy: { wins: 10, losses: 5, draws: 2, gamesPlayed: 17 },
    medium: { wins: 5, losses: 8, draws: 3, gamesPlayed: 16 },
    hard: { wins: 1, losses: 15, draws: 2, gamesPlayed: 18 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useStats as any).mockReturnValue({
      statsByDifficulty: mockStatsEmpty,
      totalStats: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
      resetStats: mockResetStats,
    });
  });

  describe('rendering', () => {
    it('should render the title', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('Neon')).toBeInTheDocument();
      expect(screen.getByText('Crosses')).toBeInTheDocument();
    });

    it('should render difficulty selection header', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('SELECT DIFFICULTY')).toBeInTheDocument();
    });

    it('should render all three difficulty buttons', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('EASY')).toBeInTheDocument();
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
      expect(screen.getByText('HARD')).toBeInTheDocument();
    });

    it('should render reset stats button', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('RESET STATS')).toBeInTheDocument();
    });

    it('should render stats section', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('STATS BY DIFFICULTY')).toBeInTheDocument();
    });
  });

  describe('difficulty buttons', () => {
    it('should call onStartGame with "easy" when Easy button is clicked', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      const easyButton = screen.getByText('EASY');
      fireEvent.click(easyButton);
      expect(mockOnStartGame).toHaveBeenCalledWith('easy');
    });

    it('should call onStartGame with "medium" when Medium button is clicked', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      const mediumButton = screen.getByText('MEDIUM');
      fireEvent.click(mediumButton);
      expect(mockOnStartGame).toHaveBeenCalledWith('medium');
    });

    it('should call onStartGame with "hard" when Challenge button is clicked', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      const hardButton = screen.getByText('HARD');
      fireEvent.click(hardButton);
      expect(mockOnStartGame).toHaveBeenCalledWith('hard');
    });
  });

  describe('reset stats', () => {
    it('should call resetStats when reset button is clicked', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      const resetButton = screen.getByText('RESET STATS');
      fireEvent.click(resetButton);
      expect(mockResetStats).toHaveBeenCalledTimes(1);
    });
  });

  describe('stats display with no data', () => {
    it('should display 0% win rate for all difficulties when no games played', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      const winRates = screen.getAllByText(/0% win rate/);
      expect(winRates).toHaveLength(3);
    });

    it('should display "0 played" for all difficulties when no games played', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      const playedTexts = screen.getAllByText('0 played');
      // Should have 4: 3 for difficulties + 1 for overall
      expect(playedTexts).toHaveLength(4);
    });

    it('should display overall stats as 0W / 0L / 0D', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('0W / 0L / 0D')).toBeInTheDocument();
    });

    it('should display "0 played" in overall pill', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      const playedTexts = screen.getAllByText('0 played');
      expect(playedTexts.length).toBeGreaterThan(0);
    });
  });

  describe('stats display with data', () => {
    beforeEach(() => {
      (useStats as any).mockReturnValue({
        statsByDifficulty: mockStatsWithData,
        totalStats: { wins: 16, losses: 28, draws: 7, gamesPlayed: 51 },
        resetStats: mockResetStats,
      });
    });

    it('should display correct win rate for easy difficulty', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      // 10 wins / 17 games = 58.82% ≈ 59%
      expect(screen.getByText('59% win rate')).toBeInTheDocument();
    });

    it('should display correct win rate for medium difficulty', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      // 5 wins / 16 games = 31.25% ≈ 31%
      expect(screen.getByText('31% win rate')).toBeInTheDocument();
    });

    it('should display correct win rate for hard difficulty', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      // 1 win / 18 games = 5.55% ≈ 6%
      expect(screen.getByText('6% win rate')).toBeInTheDocument();
    });

    it('should display correct games played for each difficulty', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('17 played')).toBeInTheDocument();
      expect(screen.getByText('16 played')).toBeInTheDocument();
      expect(screen.getByText('18 played')).toBeInTheDocument();
    });

    it('should display correct overall stats', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('16W / 28L / 7D')).toBeInTheDocument();
      expect(screen.getByText('51 played')).toBeInTheDocument();
    });

    it('should display individual stats for easy difficulty', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      // Looking for W 10, D 2, L 5 - D 2 appears twice (easy and hard)
      expect(screen.getByText(/W 10/)).toBeInTheDocument();
      expect(screen.getAllByText(/D 2/).length).toBeGreaterThan(0);
      expect(screen.getByText(/L 5/)).toBeInTheDocument();
    });
  });

  describe('difficulty labels', () => {
    it('should display "Easy" label', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    it('should display "Medium" label', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should display "Hard" label for hard difficulty', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('Hard')).toBeInTheDocument();
    });
  });

  describe('win rate calculation', () => {
    it('should show 0% for zero games played', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      const winRates = screen.getAllByText(/0% win rate/);
      expect(winRates.length).toBeGreaterThanOrEqual(1);
    });

    it('should calculate 100% win rate correctly', () => {
      (useStats as any).mockReturnValue({
        statsByDifficulty: {
          easy: { wins: 5, losses: 0, draws: 0, gamesPlayed: 5 },
          medium: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
          hard: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        },
        totalStats: { wins: 5, losses: 0, draws: 0, gamesPlayed: 5 },
        resetStats: mockResetStats,
      });

      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('100% win rate')).toBeInTheDocument();
    });

    it('should calculate 50% win rate correctly', () => {
      (useStats as any).mockReturnValue({
        statsByDifficulty: {
          easy: { wins: 5, losses: 5, draws: 0, gamesPlayed: 10 },
          medium: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
          hard: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        },
        totalStats: { wins: 5, losses: 5, draws: 0, gamesPlayed: 10 },
        resetStats: mockResetStats,
      });

      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('50% win rate')).toBeInTheDocument();
    });
  });

  describe('overall pill', () => {
    it('should display "Overall" label', () => {
      render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('Overall')).toBeInTheDocument();
    });

    it('should update when stats change', () => {
      const { rerender } = render(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('0W / 0L / 0D')).toBeInTheDocument();

      (useStats as any).mockReturnValue({
        statsByDifficulty: mockStatsWithData,
        totalStats: { wins: 16, losses: 28, draws: 7, gamesPlayed: 51 },
        resetStats: mockResetStats,
      });

      rerender(<MainMenu onStartGame={mockOnStartGame} />);
      expect(screen.getByText('16W / 28L / 7D')).toBeInTheDocument();
    });
  });
});
