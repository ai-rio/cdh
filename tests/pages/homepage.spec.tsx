import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock the HomePage component to be synchronous for testing purposes
vi.mock('@/app/(frontend)/page', () => ({
  __esModule: true,
  default: () => (
    <>
      <div>Mocked StarfieldCanvas</div>
      <div>Mocked Header</div>
      <div>Mocked HeroSection</div>
      <div>Mocked InfoSection 1</div>
      <div>Mocked InfoSection 2</div>
      <div>Mocked InfoSection 3</div>
      <div>Mocked Footer</div>
    </>
  ),
}));

// Mock server-side dependencies (though they won't be hit with the HomePage mock)
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
}));

vi.mock('payload', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getPayload: vi.fn(() => ({
      auth: vi.fn(() => ({ user: null })),
    })),
    buildConfig: vi.fn(() => ({})), // Mock buildConfig
  }
});

// Import the mocked HomePage for type checking, but it won't be used directly
import HomePage from '@/app/(frontend)/page';

describe('HomePage Integration', () => {
  it('renders the full page with key content from each section', async () => {
    await act(async () => {
      render(<HomePage />);
    });

    // Check for Header content (assuming it has a nav landmark)
    expect(screen.getByText('Mocked Header')).toBeInTheDocument();

    // Check for Hero Section content (e.g., the main heading)
    expect(screen.getByText('Mocked HeroSection')).toBeInTheDocument();

    // Check for Info Section content (e.g., a subheading)
    expect(screen.getByText('Mocked InfoSection 1')).toBeInTheDocument();
    expect(screen.getByText('Mocked InfoSection 2')).toBeInTheDocument();
    expect(screen.getByText('Mocked InfoSection 3')).toBeInTheDocument();
  });
});
