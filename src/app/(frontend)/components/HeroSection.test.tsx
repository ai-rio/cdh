import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HeroSection } from './HeroSection';

// Mock the EarlyAccessModal component
vi.mock('./EarlyAccessModal', () => ({
  EarlyAccessModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? (
      <div data-testid="early-access-modal">
        <button onClick={onClose} data-testid="close-modal">Close</button>
        <div>Early Access Modal Content</div>
      </div>
    ) : null
  ),
}));

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the hero section with correct content', () => {
    render(<HeroSection />);
    
    // Check for main heading
    expect(screen.getByText('This is your business.')).toBeInTheDocument();
    
    // Check for description text
    expect(screen.getByText(/Stop chasing data. Start seeing the connections/)).toBeInTheDocument();
    
    // Check for CTA button
    expect(screen.getByRole('button', { name: 'Request Early Access' })).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-hero-class';
    render(<HeroSection className={customClass} />);
    
    const heroSection = document.querySelector('.hero-section');
    
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveClass(customClass);
  });

  it('has correct section id', () => {
    render(<HeroSection />);
    
    const heroSection = document.querySelector('#hero-section');
    expect(heroSection).toBeInTheDocument();
  });

  it('opens EarlyAccessModal when Request Early Access button is clicked', async () => {
    render(<HeroSection />);
    
    const ctaButton = screen.getByRole('button', { name: 'Request Early Access' });
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('early-access-modal')).not.toBeInTheDocument();
    
    // Click the CTA button
    fireEvent.click(ctaButton);
    
    // Modal should now be visible
    await waitFor(() => {
      expect(screen.getByTestId('early-access-modal')).toBeInTheDocument();
    });
  });

  it('closes EarlyAccessModal when onClose is called', async () => {
    render(<HeroSection />);
    
    const ctaButton = screen.getByRole('button', { name: 'Request Early Access' });
    
    // Open the modal
    fireEvent.click(ctaButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('early-access-modal')).toBeInTheDocument();
    });
    
    // Close the modal
    const closeButton = screen.getByTestId('close-modal');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('early-access-modal')).not.toBeInTheDocument();
    });
  });

  it('uses Shadcn Button component with correct styling', () => {
    render(<HeroSection />);
    
    const ctaButton = screen.getByRole('button', { name: 'Request Early Access' });
    
    // Check for the glow effect class and other styling
    expect(ctaButton).toHaveClass('cta-glow');
    expect(ctaButton).toHaveClass('bg-[#EEFC97]');
    expect(ctaButton).toHaveClass('text-[#1D1F04]');
    expect(ctaButton).toHaveClass('font-bold');
  });

  it('has proper semantic structure', () => {
    render(<HeroSection />);
    
    // Check for semantic section element
    const section = document.querySelector('section.hero-section');
    expect(section).toBeInTheDocument();
    
    // Check for proper heading hierarchy
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('This is your business.');
  });

  it('maintains focus management for accessibility', async () => {
    render(<HeroSection />);
    
    const ctaButton = screen.getByRole('button', { name: 'Request Early Access' });
    
    // Focus the button
    ctaButton.focus();
    expect(document.activeElement).toBe(ctaButton);
    
    // Click to open modal
    fireEvent.click(ctaButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('early-access-modal')).toBeInTheDocument();
    });
  });
});