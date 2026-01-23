import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Setup localStorage mock
beforeAll(() => {
  const store: Record<string, string> = {};
  
  const localStorageMock: Storage = {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    },
    key: (index: number): string | null => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    get length(): number {
      return Object.keys(store).length;
    },
  };
  
  (globalThis as any).localStorage = localStorageMock;
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
});
