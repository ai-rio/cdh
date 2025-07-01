import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    jsx: 'react-jsx',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.spec.{ts,tsx}'],
    exclude: ['e2e/**/*.test.{ts,tsx}'], // Exclude E2E tests
    transform: {
      '^.+\.tsx?$': 'esbuild',
    },
    coverage: {
      reporter: ['json', 'lcov', 'text', 'clover'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});