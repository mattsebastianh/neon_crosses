import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Setup localStorage mock
beforeAll(() => {
  const localStorageMock = {
    getItem: (key: string) => {
      return localStorageMock[key] || null;
    },
    setItem: (key: string, value: string) => {
      localStorageMock[key] = value;
    },
    removeItem: (key: string) => {
      delete localStorageMock[key];
    },
    clear: () => {
      Object.keys(localStorageMock).forEach(key => {
        if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
          delete localStorageMock[key];
        }
      });
    },
  };
  
  global.localStorage = localStorageMock as any;
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
});
