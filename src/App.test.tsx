import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the child components
vi.mock('./components/MainMenu', () => ({
  default: ({ onStartGame }: { onStartGame: (difficulty: string) => void }) => (
    <div data-testid="main-menu">
      <button onClick={() => onStartGame('easy')}>Start Easy</button>
      <button onClick={() => onStartGame('medium')}>Start Medium</button>
      <button onClick={() => onStartGame('hard')}>Start Hard</button>
    </div>
  ),
}));

vi.mock('./components/GameBoard', () => ({
  default: ({ difficulty, onBack }: { difficulty: string; onBack: () => void }) => (
    <div data-testid="game-board">
      <div>Difficulty: {difficulty}</div>
      <button onClick={onBack}>Back to Menu</button>
    </div>
  ),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial render', () => {
    it('should render the app container', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.app-container')).toBeInTheDocument();
    });

    it('should render the glow overlay', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.glow-overlay')).toBeInTheDocument();
    });

    it('should show main menu initially', () => {
      render(<App />);
      expect(screen.getByTestId('main-menu')).toBeInTheDocument();
    });

    it('should not show game board initially', () => {
      render(<App />);
      expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should show game board when easy difficulty is selected', () => {
      render(<App />);
      
      const startEasyButton = screen.getByText('Start Easy');
      fireEvent.click(startEasyButton);
      
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.queryByTestId('main-menu')).not.toBeInTheDocument();
    });

    it('should show game board when medium difficulty is selected', () => {
      render(<App />);
      
      const startMediumButton = screen.getByText('Start Medium');
      fireEvent.click(startMediumButton);
      
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.getByText('Difficulty: medium')).toBeInTheDocument();
    });

    it('should show game board when hard difficulty is selected', () => {
      render(<App />);
      
      const startHardButton = screen.getByText('Start Hard');
      fireEvent.click(startHardButton);
      
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.getByText('Difficulty: hard')).toBeInTheDocument();
    });

    it('should return to menu when back button is clicked', () => {
      render(<App />);
      
      // Start a game
      const startEasyButton = screen.getByText('Start Easy');
      fireEvent.click(startEasyButton);
      
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      
      // Go back to menu
      const backButton = screen.getByText('Back to Menu');
      fireEvent.click(backButton);
      
      expect(screen.getByTestId('main-menu')).toBeInTheDocument();
      expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
    });
  });

  describe('difficulty state management', () => {
    it('should pass correct difficulty to GameBoard', () => {
      render(<App />);
      
      const startEasyButton = screen.getByText('Start Easy');
      fireEvent.click(startEasyButton);
      
      expect(screen.getByText('Difficulty: easy')).toBeInTheDocument();
    });

    it('should update difficulty when different levels are selected', () => {
      render(<App />);
      
      // Start easy game
      fireEvent.click(screen.getByText('Start Easy'));
      expect(screen.getByText('Difficulty: easy')).toBeInTheDocument();
      
      // Go back
      fireEvent.click(screen.getByText('Back to Menu'));
      
      // Start medium game
      fireEvent.click(screen.getByText('Start Medium'));
      expect(screen.getByText('Difficulty: medium')).toBeInTheDocument();
      
      // Go back
      fireEvent.click(screen.getByText('Back to Menu'));
      
      // Start hard game
      fireEvent.click(screen.getByText('Start Hard'));
      expect(screen.getByText('Difficulty: hard')).toBeInTheDocument();
    });

    it('should maintain difficulty when navigating back and forth', () => {
      render(<App />);
      
      // Start medium game
      fireEvent.click(screen.getByText('Start Medium'));
      expect(screen.getByText('Difficulty: medium')).toBeInTheDocument();
      
      // Go back to menu
      fireEvent.click(screen.getByText('Back to Menu'));
      expect(screen.getByTestId('main-menu')).toBeInTheDocument();
      
      // Start another medium game
      fireEvent.click(screen.getByText('Start Medium'));
      expect(screen.getByText('Difficulty: medium')).toBeInTheDocument();
    });
  });

  describe('view state management', () => {
    it('should toggle between menu and game views', () => {
      render(<App />);
      
      // Initial state: menu
      expect(screen.getByTestId('main-menu')).toBeInTheDocument();
      
      // Switch to game
      fireEvent.click(screen.getByText('Start Easy'));
      expect(screen.queryByTestId('main-menu')).not.toBeInTheDocument();
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      
      // Switch back to menu
      fireEvent.click(screen.getByText('Back to Menu'));
      expect(screen.getByTestId('main-menu')).toBeInTheDocument();
      expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
    });

    it('should only render one view at a time', () => {
      render(<App />);
      
      // Menu view
      expect(screen.getByTestId('main-menu')).toBeInTheDocument();
      expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
      
      // Game view
      fireEvent.click(screen.getByText('Start Easy'));
      expect(screen.queryByTestId('main-menu')).not.toBeInTheDocument();
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
    });
  });

  describe('multiple game sessions', () => {
    it('should handle multiple game sessions correctly', () => {
      render(<App />);
      
      // Play easy game
      fireEvent.click(screen.getByText('Start Easy'));
      expect(screen.getByText('Difficulty: easy')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Back to Menu'));
      
      // Play medium game
      fireEvent.click(screen.getByText('Start Medium'));
      expect(screen.getByText('Difficulty: medium')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Back to Menu'));
      
      // Play hard game
      fireEvent.click(screen.getByText('Start Hard'));
      expect(screen.getByText('Difficulty: hard')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Back to Menu'));
      
      // Should be back at menu
      expect(screen.getByTestId('main-menu')).toBeInTheDocument();
    });
  });

  describe('component integration', () => {
    it('should pass onStartGame callback to MainMenu', () => {
      render(<App />);
      
      expect(screen.getByTestId('main-menu')).toBeInTheDocument();
      expect(screen.getByText('Start Easy')).toBeInTheDocument();
      expect(screen.getByText('Start Medium')).toBeInTheDocument();
      expect(screen.getByText('Start Hard')).toBeInTheDocument();
    });

    it('should pass difficulty and onBack callback to GameBoard', () => {
      render(<App />);
      
      fireEvent.click(screen.getByText('Start Easy'));
      
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.getByText('Difficulty: easy')).toBeInTheDocument();
      expect(screen.getByText('Back to Menu')).toBeInTheDocument();
    });
  });
});
