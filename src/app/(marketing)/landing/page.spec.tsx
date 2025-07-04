import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from '@/app/(marketing)/landing/page';

// Mock child components
vi.mock('@/components/landing/HeroSection', () => ({
  default: () => <div data-testid="mock-hero-section" />,
}));
vi.mock('@/components/landing/AITypingDemo', () => ({
  default: () => <div data-testid="mock-ai-typing-demo" />,
}));
vi.mock('@/components/landing/DealsTimeline', () => ({
  default: () => <div data-testid="mock-deals-timeline" />,
}));
vi.mock('@/components/landing/CashflowChart', () => ({
  default: () => <div data-testid="mock-cashflow-chart" />,
}));
vi.mock('@/components/landing/TestimonialCarousel', () => ({
  default: () => <div data-testid="mock-testimonial-carousel" />,
}));
vi.mock('@/components/landing/LandingPricing', () => ({
  default: () => <div data-testid="mock-landing-pricing" />,
}));
vi.mock('@/components/landing/LandingFooter', () => ({
  default: () => <div data-testid="mock-landing-footer" />,
}));

describe('Marketing LandingPage Assembly Unit Tests', () => {
  it('renders without crashing', () => {
    render(<LandingPage />);
    // No assertion needed, test fails if render throws an error
  });

  it('renders all child components', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('mock-hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('mock-ai-typing-demo')).toBeInTheDocument();
    expect(screen.getByTestId('mock-deals-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('mock-cashflow-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-testimonial-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('mock-landing-pricing')).toBeInTheDocument();
    expect(screen.getByTestId('mock-landing-footer')).toBeInTheDocument();
  });
});
