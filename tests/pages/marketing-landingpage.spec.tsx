import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from '@/app/(marketing)/landing/page';

// Mock server-side dependencies
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
}));

vi.mock('payload', () => ({
  getPayload: vi.fn(() => ({
    auth: vi.fn(() => ({ user: null })),
  })),
}));



vi.mock('@/components/landing/TestimonialCarousel', () => ({
  default: () => <div data-testid="mock-testimonial-carousel" />,
}));

describe('Marketing LandingPage Integration Tests', () => {
  it('renders the full page with key sections', async () => {
    render(<LandingPage />);

    // Check for key sections by their content
    expect(await screen.findByText('Experience the AI Co-Pilot')).toBeInTheDocument();
    expect(await screen.findByText('The End of Spreadsheet Chaos: Your Centralized Brand Deal Hub')).toBeInTheDocument();
    expect(await screen.findByText('Close the Financial Literacy Gap: Your Revenue, Demystified.')).toBeInTheDocument();
    expect(await screen.findByText('Trusted by Creators Like You')).toBeInTheDocument();
    expect(await screen.findByText('Choose Your Plan')).toBeInTheDocument();
  });

  it('renders the HeroSection with its main heading', async () => {
    render(<LandingPage />);
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  // Add more integration tests as needed for specific interactions or visual elements
});
