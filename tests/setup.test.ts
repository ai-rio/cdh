import { describe, it, expect } from 'vitest';

describe('Test Setup', () => {
  it('should have working test environment', () => {
    expect(true).toBe(true);
  });

  it('should have global mocks available', () => {
    expect(global.IntersectionObserver).toBeDefined();
    expect(global.ResizeObserver).toBeDefined();
    expect(global.WebSocket).toBeDefined();
    expect(global.performance).toBeDefined();
  });
});