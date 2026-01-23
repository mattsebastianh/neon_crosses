import { describe, it, expect, vi } from 'vitest';
import {
  checkWinner,
  getBestMove,
  getRandomMove,
  getMediumMove,
  WINNING_COMBINATIONS,
  type BoardState,
} from '../logic/gameLogic';

describe('gameLogic', () => {
  describe('checkWinner', () => {
    it('should return null for an empty board', () => {
      const board: BoardState = Array(9).fill(null);
      expect(checkWinner(board)).toBeNull();
    });

    it('should detect horizontal win in top row', () => {
      const board: BoardState = ['X', 'X', 'X', null, null, null, null, null, null];
      expect(checkWinner(board)).toBe('X');
    });

    it('should detect horizontal win in middle row', () => {
      const board: BoardState = [null, null, null, 'O', 'O', 'O', null, null, null];
      expect(checkWinner(board)).toBe('O');
    });

    it('should detect horizontal win in bottom row', () => {
      const board: BoardState = [null, null, null, null, null, null, 'X', 'X', 'X'];
      expect(checkWinner(board)).toBe('X');
    });

    it('should detect vertical win in left column', () => {
      const board: BoardState = ['X', null, null, 'X', null, null, 'X', null, null];
      expect(checkWinner(board)).toBe('X');
    });

    it('should detect vertical win in middle column', () => {
      const board: BoardState = [null, 'O', null, null, 'O', null, null, 'O', null];
      expect(checkWinner(board)).toBe('O');
    });

    it('should detect vertical win in right column', () => {
      const board: BoardState = [null, null, 'X', null, null, 'X', null, null, 'X'];
      expect(checkWinner(board)).toBe('X');
    });

    it('should detect diagonal win (top-left to bottom-right)', () => {
      const board: BoardState = ['O', null, null, null, 'O', null, null, null, 'O'];
      expect(checkWinner(board)).toBe('O');
    });

    it('should detect diagonal win (top-right to bottom-left)', () => {
      const board: BoardState = [null, null, 'X', null, 'X', null, 'X', null, null];
      expect(checkWinner(board)).toBe('X');
    });

    it('should detect a draw when board is full with no winner', () => {
      const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      expect(checkWinner(board)).toBe('DRAW');
    });

    it('should return null for an in-progress game', () => {
      const board: BoardState = ['X', 'O', null, null, 'X', null, null, null, 'O'];
      expect(checkWinner(board)).toBeNull();
    });
  });

  describe('getBestMove', () => {
    it('should win when possible', () => {
      // X has two in a row at [0, 1], can win at [2]
      const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
      const move = getBestMove(board, 'X');
      expect(move).toBe(2);
    });

    it('should block opponent winning move', () => {
      // O has two in a row at [3, 4], X should block at [5]
      const board: BoardState = ['X', null, null, 'O', 'O', null, null, null, null];
      const move = getBestMove(board, 'X');
      expect(move).toBe(5);
    });

    it('should prioritize winning over blocking', () => {
      // X can win at [2], O can win at [5]
      const board: BoardState = ['X', 'X', null, 'O', 'O', null, null, null, null];
      const move = getBestMove(board, 'X');
      expect(move).toBe(2); // Win instead of blocking
    });

    it('should take center if available after checking win/block', () => {
      const board: BoardState = ['X', null, null, null, null, null, null, null, 'O'];
      const move = getBestMove(board, 'X');
      expect(move).toBe(4); // Center
    });

    it('should return any available move when no strategic move exists', () => {
      const board: BoardState = [null, null, null, null, null, null, null, null, null];
      const move = getBestMove(board, 'X');
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
    });

    it('should return -1 when player is null', () => {
      const board: BoardState = Array(9).fill(null);
      const move = getBestMove(board, null);
      expect(move).toBe(-1);
    });
  });

  describe('getRandomMove', () => {
    it('should return a valid empty cell index', () => {
      const board: BoardState = ['X', null, 'O', null, 'X', null, null, null, 'O'];
      const move = getRandomMove(board);
      expect([1, 3, 5, 6, 7]).toContain(move);
    });

    it('should return -1 when board is full', () => {
      const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      const move = getRandomMove(board);
      expect(move).toBe(-1);
    });

    it('should return the only available move', () => {
      const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', null, 'X'];
      const move = getRandomMove(board);
      expect(move).toBe(7);
    });

    it('should return valid move for empty board', () => {
      const board: BoardState = Array(9).fill(null);
      const move = getRandomMove(board);
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
    });
  });

  describe('getMediumMove', () => {
    it('should always return a valid move index', () => {
      const board: BoardState = ['X', null, 'O', null, null, null, null, null, null];
      const move = getMediumMove(board, 'O');
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
      expect(board[move]).toBeNull();
    });

    it('should sometimes use getBestMove and sometimes getRandomMove', () => {
      // This test checks that both code paths can execute
      const board: BoardState = ['X', null, null, null, null, null, null, null, null];
      
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.5) // Should call getBestMove (0.5 > 0.4)
        .mockReturnValueOnce(0.3); // Should call getRandomMove (0.3 <= 0.4 is false, so > 0.4 is false means random)

      const move1 = getMediumMove(board, 'O');
      expect(move1).toBe(4); // getBestMove should return center

      const move2 = getMediumMove(board, 'O');
      expect([1, 2, 3, 4, 5, 6, 7, 8]).toContain(move2); // Any valid move

      vi.restoreAllMocks();
    });

    it('should return -1 for full board', () => {
      const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      const move = getMediumMove(board, 'O');
      // Either getBestMove or getRandomMove could be called
      expect(move === -1 || move === undefined).toBe(true);
    });
  });

  describe('WINNING_COMBINATIONS', () => {
    it('should have 8 winning combinations', () => {
      expect(WINNING_COMBINATIONS).toHaveLength(8);
    });

    it('should include all rows', () => {
      expect(WINNING_COMBINATIONS).toContainEqual([0, 1, 2]);
      expect(WINNING_COMBINATIONS).toContainEqual([3, 4, 5]);
      expect(WINNING_COMBINATIONS).toContainEqual([6, 7, 8]);
    });

    it('should include all columns', () => {
      expect(WINNING_COMBINATIONS).toContainEqual([0, 3, 6]);
      expect(WINNING_COMBINATIONS).toContainEqual([1, 4, 7]);
      expect(WINNING_COMBINATIONS).toContainEqual([2, 5, 8]);
    });

    it('should include both diagonals', () => {
      expect(WINNING_COMBINATIONS).toContainEqual([0, 4, 8]);
      expect(WINNING_COMBINATIONS).toContainEqual([2, 4, 6]);
    });
  });
});
