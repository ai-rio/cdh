import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './page';

// Mock child components
vi.mock('@/components/Header', () => ({ default: () => <div data-testid="mock-header" /> }));
vi.mock('@/components/StarfieldCanvas', () => ({ default: () => <div data-testid="mock-starfield" /> }));
vi.mock('@/components/HeroSection', () => ({ default: () => <div data-testid="mock-hero" /> }));
vi.mock('@/components/InfoSection', () => ({ default: () => <div data-testid="mock-info" /> }));
vi.mock('@/components/Footer', () => ({ default: () => <div data-testid="mock-footer" /> }));

describe('HomePage Assembly', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    // No assertion needed, test fails if render throws an error
  });

  it('renders all child components', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-starfield')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByTestId('mock-info')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });
});
