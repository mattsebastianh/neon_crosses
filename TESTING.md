# Testing Guide

This project uses **Vitest** and **React Testing Library** for comprehensive testing.

## Test Coverage

### Unit Tests
- **Game Logic** ([gameLogic.test.ts](src/logic/gameLogic.test.ts)): 28 tests
  - Win detection (horizontal, vertical, diagonal)
  - Draw detection
  - AI move algorithms (easy, medium, hard)
  - Board state validation

- **Statistics Hook** ([useStats.test.ts](src/hooks/useStats.test.ts)): 19 tests
  - localStorage persistence
  - Win/loss/draw recording
  - Stats aggregation across difficulties
  - Reset functionality

### Component Tests
- **App Component** ([App.test.tsx](src/App.test.tsx)): 16 tests
  - Navigation between views
  - Difficulty selection
  - State management

- **GameBoard Component** ([GameBoard.test.tsx](src/components/GameBoard.test.tsx)): 19 tests
  - Player interactions
  - AI behavior
  - Game state management
  - Turn handling

- **MainMenu Component** ([MainMenu.test.tsx](src/components/MainMenu.test.tsx)): 27 tests
  - Difficulty button interactions
  - Stats display
  - Win rate calculations
  - Reset functionality

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── test/
│   └── setup.ts              # Test configuration & global setup
├── logic/
│   ├── gameLogic.ts
│   └── gameLogic.test.ts     # Game logic unit tests
├── hooks/
│   ├── useStats.ts
│   └── useStats.test.ts      # Hook unit tests
├── components/
│   ├── GameBoard.tsx
│   ├── GameBoard.test.tsx    # Component integration tests
│   ├── MainMenu.tsx
│   └── MainMenu.test.tsx     # Component integration tests
├── App.tsx
└── App.test.tsx              # App integration tests
```

## Test Configuration

- **Test Runner**: Vitest (fast, Vite-native)
- **Testing Library**: React Testing Library
- **Environment**: jsdom (simulates browser DOM)
- **Assertions**: Vitest + @testing-library/jest-dom

### Configuration Files
- `vitest.config.ts` - Vitest configuration
- `src/test/setup.ts` - Global test setup (mocks, cleanup)

## Writing Tests

### Example: Testing a Component

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

it('should handle click events', () => {
  render(<MyComponent />);
  const button = screen.getByText('Click Me');
  fireEvent.click(button);
  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

### Example: Testing a Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from './useMyHook';

it('should update state', () => {
  const { result } = renderHook(() => useMyHook());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## Best Practices

1. **Test behavior, not implementation** - Focus on user-facing functionality
2. **Use semantic queries** - `getByRole`, `getByLabelText` over `getByTestId`
3. **Async operations** - Use `waitFor` for asynchronous updates
4. **Mock dependencies** - Isolate units under test
5. **Clean up** - Tests automatically cleanup after each test
6. **Readable assertions** - Use descriptive expect statements

## Common Test Patterns

### Testing User Interactions
```typescript
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'new value' } });
```

### Testing Async Updates
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Testing localStorage
```typescript
localStorage.setItem('key', 'value');
// Test code
expect(localStorage.getItem('key')).toBe('value');
```

## Current Test Results

✅ **109 tests passing**
- 5 test files
- ~95%+ code coverage
- All critical paths tested

## Continuous Integration

Tests run automatically on:
- Every commit
- Pull requests
- Pre-deployment

Run `npm test` before committing to ensure all tests pass.
