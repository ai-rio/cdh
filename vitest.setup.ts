import '@testing-library/jest-dom/vitest';
import React from 'react';

// Make React available globally for tests
global.React = React;

global.requestAnimationFrame = vi.fn((cb) => {
  return setTimeout(cb, 0);
});

global.cancelAnimationFrame = vi.fn((id) => {
  clearTimeout(id);
});