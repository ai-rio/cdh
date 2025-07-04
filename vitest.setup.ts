import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

// Make React available globally for tests
global.React = React;

global.requestAnimationFrame = vi.fn((cb) => {
  return setTimeout(cb, 0);
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});

// Mock IntersectionObserver
class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});