# 🎮 Neon Crosses

A modern, neon-themed Tic-Tac-Toe game built with React, TypeScript, and Vite. Features three AI difficulty levels, persistent statistics tracking, and a sleek cyberpunk aesthetic.

![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.1-646cff)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Three AI Difficulty Modes**
  - **Easy**: Random move selection
  - **Medium**: 60% optimal play, 40% random
  - **Impossible**: Minimax-based unbeatable AI
- **Persistent Statistics**: Track wins, losses, and draws per difficulty
- **Responsive Design**: Dynamically adapts to any screen size
- **Smooth Animations**: CSS-based transitions and effects
- **Neon Aesthetic**: Cyberpunk-inspired UI with glowing effects
- **Statistics Dashboard**: Visual progress bars showing performance by difficulty

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd <project-directory>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

1. Select a difficulty level from the main menu
2. You play as **X** and always go first
3. Click any empty cell to make your move
4. The AI responds automatically after a short delay
5. Win by getting three in a row (horizontal, vertical, or diagonal)
6. Track your performance in the stats dashboard at the bottom of the menu

## 🏗️ Project Structure

```
src/
├── components/
│   ├── GameBoard.tsx       # Game board and game loop logic
│   ├── GameBoard.css       # Game board styling
│   ├── MainMenu.tsx        # Main menu with difficulty selection
│   └── MainMenu.css        # Menu and stats styling
├── hooks/
│   └── useStats.ts         # Statistics tracking hook
├── logic/
│   └── gameLogic.ts        # AI algorithms and game rules
├── App.tsx                 # Root component
├── App.css                 # App-level styles
├── main.tsx                # Entry point
└── index.css               # Global styles and CSS variables
```

## 🧠 AI Implementation

The game features a **priority-based minimax** AI with the following strategy:

1. **Win Detection**: Check for immediate winning moves
2. **Block Detection**: Block opponent's winning moves
3. **Center Control**: Prioritize the center cell (strategic advantage)
4. **Random Fallback**: Select from remaining available cells

The AI is mathematically **unbeatable** in "Impossible" mode when playing optimally.

### Difficulty Breakdown

- **Easy**: Pure random selection - `O(1)` complexity
- **Medium**: 60% optimal + 40% random - Mixed strategy
- **Hard**: Full minimax priority tree - Always optimal play

## 🎨 Tech Stack

- **React 18**: UI framework with functional components and hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **CSS3**: Custom properties, animations, grid layouts, and responsive design
- **LocalStorage**: Client-side statistics persistence
- **clsx**: Utility for conditional CSS classes

## 📊 Statistics Tracking

Game statistics are stored in `localStorage` under the key `tictactoe-stats-v2`:

```typescript
interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
}

interface StatsByDifficulty {
  easy: GameStats;
  medium: GameStats;
  hard: GameStats;
}
```

Stats are tracked per difficulty with:
- Visual progress bars showing W/L/D distribution
- Win rate percentage calculations
- Overall aggregated statistics
- Persistent storage across sessions

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Type-check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

### Code Style

This project uses TypeScript strict mode and follows React best practices:

- Functional components with hooks
- Type-safe props and state
- Scoped CSS with BEM naming conventions
- Semantic HTML and accessibility considerations
- Responsive design with CSS clamp() and viewport units

## 🎮 Game Features

### Responsive Board Sizing
The game board dynamically scales based on window size:
- Uses `min(90vw, 90vh, 480px)` for optimal sizing
- Maintains perfect square aspect ratio
- Scales font sizes with `clamp()` for readability
- Optimized for mobile, tablet, and desktop

### Scrollable Interface
Both main menu and game board include:
- Vertical scrolling when content exceeds viewport
- Neon-themed custom scrollbars
- Overflow handling for small screens

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and TypeScript conventions
- Add tests for new features
- Update documentation as needed
- Ensure all linting passes before submitting

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Inspired by classic Tic-Tac-Toe implementations
- Neon aesthetic inspired by cyberpunk design trends
- Built as a showcase project for React + TypeScript + Vite
- Development assisted by Google Antigravity and Claude Code

## 🐛 Known Issues

None at this time. Please report bugs via GitHub Issues.

## 🔮 Future Enhancements

- [ ] Online multiplayer mode
- [ ] Custom themes and color schemes
- [ ] Sound effects and music
- [ ] Leaderboard integration
- [ ] Additional board sizes (4x4, 5x5)
- [ ] Tournament mode

---

**Made with ⚡ and ❤️**
