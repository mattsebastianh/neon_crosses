import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStats } from './useStats';

describe('useStats', () => {
  const STORAGE_KEY = 'tictactoe-stats-v2';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with zero stats when localStorage is empty', () => {
      const { result } = renderHook(() => useStats());

      expect(result.current.statsByDifficulty).toEqual({
        easy: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        medium: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        hard: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
      });

      expect(result.current.totalStats).toEqual({
        wins: 0,
        losses: 0,
        draws: 0,
        gamesPlayed: 0,
      });
    });

    it('should load stats from localStorage if available', () => {
      const savedStats = {
        easy: { wins: 5, losses: 3, draws: 2, gamesPlayed: 10 },
        medium: { wins: 2, losses: 4, draws: 1, gamesPlayed: 7 },
        hard: { wins: 0, losses: 5, draws: 0, gamesPlayed: 5 },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStats));

      const { result } = renderHook(() => useStats());

      expect(result.current.statsByDifficulty).toEqual(savedStats);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json');

      const { result } = renderHook(() => useStats());

      // Should fall back to initial stats
      expect(result.current.statsByDifficulty).toEqual({
        easy: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        medium: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        hard: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
      });
    });
  });

  describe('recordWin', () => {
    it('should record a win for easy difficulty', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordWin('easy');
      });

      expect(result.current.statsByDifficulty.easy).toEqual({
        wins: 1,
        losses: 0,
        draws: 0,
        gamesPlayed: 1,
      });
    });

    it('should record a win for medium difficulty', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordWin('medium');
      });

      expect(result.current.statsByDifficulty.medium).toEqual({
        wins: 1,
        losses: 0,
        draws: 0,
        gamesPlayed: 1,
      });
    });

    it('should record a win for hard difficulty', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordWin('hard');
      });

      expect(result.current.statsByDifficulty.hard).toEqual({
        wins: 1,
        losses: 0,
        draws: 0,
        gamesPlayed: 1,
      });
    });

    it('should persist wins to localStorage', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordWin('easy');
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.easy.wins).toBe(1);
    });

    it('should accumulate multiple wins', async () => {
      const { result } = renderHook(() => useStats());

      await act(async () => {
        result.current.recordWin('easy');
      });
      await act(async () => {
        result.current.recordWin('easy');
      });
      await act(async () => {
        result.current.recordWin('easy');
      });

      expect(result.current.statsByDifficulty.easy.wins).toBe(3);
      expect(result.current.statsByDifficulty.easy.gamesPlayed).toBe(3);
    });
  });

  describe('recordLoss', () => {
    it('should record a loss for easy difficulty', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordLoss('easy');
      });

      expect(result.current.statsByDifficulty.easy).toEqual({
        wins: 0,
        losses: 1,
        draws: 0,
        gamesPlayed: 1,
      });
    });

    it('should persist losses to localStorage', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordLoss('medium');
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.medium.losses).toBe(1);
    });

    it('should accumulate multiple losses', async () => {
      const { result } = renderHook(() => useStats());

      await act(async () => {
        result.current.recordLoss('hard');
      });
      await act(async () => {
        result.current.recordLoss('hard');
      });

      expect(result.current.statsByDifficulty.hard.losses).toBe(2);
      expect(result.current.statsByDifficulty.hard.gamesPlayed).toBe(2);
    });
  });

  describe('recordDraw', () => {
    it('should record a draw for easy difficulty', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordDraw('easy');
      });

      expect(result.current.statsByDifficulty.easy).toEqual({
        wins: 0,
        losses: 0,
        draws: 1,
        gamesPlayed: 1,
      });
    });

    it('should persist draws to localStorage', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordDraw('hard');
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.hard.draws).toBe(1);
    });

    it('should accumulate multiple draws', async () => {
      const { result } = renderHook(() => useStats());

      await act(async () => {
        result.current.recordDraw('medium');
      });
      await act(async () => {
        result.current.recordDraw('medium');
      });
      await act(async () => {
        result.current.recordDraw('medium');
      });

      expect(result.current.statsByDifficulty.medium.draws).toBe(3);
      expect(result.current.statsByDifficulty.medium.gamesPlayed).toBe(3);
    });
  });

  describe('totalStats', () => {
    it('should calculate total stats across all difficulties', async () => {
      const { result } = renderHook(() => useStats());

      await act(async () => {
        result.current.recordWin('easy');
      });
      await act(async () => {
        result.current.recordWin('easy');
      });
      await act(async () => {
        result.current.recordLoss('medium');
      });
      await act(async () => {
        result.current.recordDraw('hard');
      });
      await act(async () => {
        result.current.recordWin('hard');
      });

      expect(result.current.totalStats).toEqual({
        wins: 3,
        losses: 1,
        draws: 1,
        gamesPlayed: 5,
      });
    });

    it('should update totalStats reactively', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordWin('easy');
      });

      expect(result.current.totalStats.gamesPlayed).toBe(1);

      act(() => {
        result.current.recordLoss('medium');
      });

      expect(result.current.totalStats.gamesPlayed).toBe(2);
    });
  });

  describe('resetStats', () => {
    it('should reset all stats to zero', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordWin('easy');
        result.current.recordLoss('medium');
        result.current.recordDraw('hard');
      });

      act(() => {
        result.current.resetStats();
      });

      expect(result.current.statsByDifficulty).toEqual({
        easy: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        medium: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        hard: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
      });

      expect(result.current.totalStats).toEqual({
        wins: 0,
        losses: 0,
        draws: 0,
        gamesPlayed: 0,
      });
    });

    it('should persist reset to localStorage', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordWin('easy');
        result.current.resetStats();
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toEqual({
        easy: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        medium: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
        hard: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
      });
    });
  });

  describe('mixed operations', () => {
    it('should handle mixed game results correctly', async () => {
      const { result } = renderHook(() => useStats());

      await act(async () => {
        // Play some easy games
        result.current.recordWin('easy');
      });
      await act(async () => {
        result.current.recordWin('easy');
      });
      await act(async () => {
        result.current.recordLoss('easy');
      });
      await act(async () => {
        // Play some medium games
        result.current.recordDraw('medium');
      });
      await act(async () => {
        result.current.recordLoss('medium');
      });
      await act(async () => {
        result.current.recordLoss('medium');
      });
      await act(async () => {
        // Play some hard games
        result.current.recordLoss('hard');
      });
      await act(async () => {
        result.current.recordDraw('hard');
      });

      expect(result.current.statsByDifficulty).toEqual({
        easy: { wins: 2, losses: 1, draws: 0, gamesPlayed: 3 },
        medium: { wins: 0, losses: 2, draws: 1, gamesPlayed: 3 },
        hard: { wins: 0, losses: 1, draws: 1, gamesPlayed: 2 },
      });

      expect(result.current.totalStats).toEqual({
        wins: 2,
        losses: 4,
        draws: 2,
        gamesPlayed: 8,
      });
    });
  });
});
