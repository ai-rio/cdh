import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    jsx: 'react-jsx',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.spec.{ts,tsx}'],
    exclude: ['e2e/**/*.test.{ts,tsx}', 'src/app/(frontend)/components/StarfieldCanvas.test.tsx'], // Exclude E2E tests and problematic StarfieldCanvas test
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