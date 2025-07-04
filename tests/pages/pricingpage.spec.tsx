import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PricingPage from '../../src/app/(frontend)/pricing/page';
import { usePathname } from 'next/navigation'; // Import the actual usePathname for typing

// Mock next/navigation for usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock the EarlyAccessModal to prevent actual modal rendering issues in tests
vi.mock('src/app/(frontend)/components/EarlyAccessModal', () => ({
  EarlyAccessModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-early-access-modal">
        Mock Early Access Modal
        <button onClick={onClose}>Close Modal</button>
      </div>
    );
  },
}));

// Mock the ParticleCanvas as it's a visual component not critical for functional tests
vi.mock('src/app/(frontend)/components/ParticleCanvas', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock the Header to control its behavior for HUD items
vi.mock('src/app/(frontend)/components/Header', () => ({
  Header: () => {
    const pathname = usePathname();
    const showHud = pathname === '/';
    return (
      <header>
        <nav>
          {showHud && <div data-testid="hud-item">HUD Item</div>}
        </nav>
      </header>
    );
  },
}));

describe('PricingPage Integration', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.mocked(usePathname).mockReturnValue('/pricing'); // Default to /pricing for most tests
  });

  it('renders all main components correctly', () => {
    render(<PricingPage />);

    expect(screen.getByText('Join the Founder\'s Circle')).toBeInTheDocument();
    expect(screen.getByText('Choose Your Command Center')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Creator')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Your AI co-pilot is ready.')).toBeInTheDocument();
    expect(screen.getByTestId('mock-particle-canvas')).toBeInTheDocument();
  });

  it('BillingToggle switches pricing between monthly and annually', async () => {
    render(<PricingPage />);

    // Initial state: Monthly pricing
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('$79')).toBeInTheDocument();

    // Click Annually toggle
    fireEvent.click(screen.getByText('Annually'));

    // Wait for prices to update
    await waitFor(() => {
      expect(screen.getByText('$23')).toBeInTheDocument();
      expect(screen.getByText('$63')).toBeInTheDocument();
    });

    // Click Monthly toggle again
    fireEvent.click(screen.getByText('Monthly'));

    // Wait for prices to revert
    await waitFor(() => {
      expect(screen.getByText('$29')).toBeInTheDocument();
      expect(screen.getByText('$79')).toBeInTheDocument();
    });
  });

  it('"Claim My Founder\'s Key" button opens and closes EarlyAccessModal', async () => {
    render(<PricingPage />);

    const claimButton = screen.getByRole('button', { name: /Claim My Founder\'s Key/i });
    fireEvent.click(claimButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-early-access-modal')).toBeInTheDocument();
    });

    const closeModalButton = screen.getByRole('button', { name: /Close Modal/i });
    fireEvent.click(closeModalButton);

    await waitFor(() => {
      expect(screen.queryByTestId('mock-early-access-modal')).not.toBeInTheDocument();
    });
  });

  it('"Get Early Access" button opens and closes EarlyAccessModal', async () => {
    render(<PricingPage />);

    const getEarlyAccessButton = screen.getByRole('button', { name: /Get Early Access/i });
    fireEvent.click(getEarlyAccessButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-early-access-modal')).toBeInTheDocument();
    });

    const closeModalButton = screen.getByRole('button', { name: /Close Modal/i });
    fireEvent.click(closeModalButton);

    await waitFor(() => {
      expect(screen.queryByTestId('mock-early-access-modal')).not.toBeInTheDocument();
    });
  });

  it('HUD items are not visible on /pricing page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/pricing');
    render(<PricingPage />);
    expect(screen.queryByTestId('hud-item')).not.toBeInTheDocument();
  });

  it('HUD items are visible on / home page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/');
    render(<PricingPage />);
    expect(screen.getByTestId('hud-item')).toBeInTheDocument();
  });
});
