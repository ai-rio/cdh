import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';
import CommandDeck from '../../components/CommandDeck';

// Mock the CommandDeck component as it's not the focus of these tests
vi.mock('../../components/CommandDeck', () => ({
  __esModule: true,
  default: vi.fn((props) => (
    <div data-testid="command-deck" className={props.isOpen ? 'open' : 'closed'}>
      {props.children}
      <button onClick={props.onClose} aria-label="Close navigation menu"></button>
    </div>
  )),
}));

describe('Header', () => {
  it('renders the header element with mission-control-hud class', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toHaveClass('mission-control-hud');
  });

  it('renders the CDH logo and text', () => {
    render(<Header />);
    expect(screen.getByText('CDH')).toBeInTheDocument();
    expect(screen.getByText('CDH')).toBeInTheDocument();
  });

  it('renders HUD items with correct data', () => {
    render(<Header />);
    expect(screen.getByText('Active Deals')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Key Contacts')).toBeInTheDocument();
  });

  it('toggles the CommandDeck on navigation button click', () => {
    render(<Header />);
    const navButton = screen.getByLabelText('Open navigation menu');
    fireEvent.click(navButton);
    expect(screen.getByTestId('command-deck')).toHaveClass('open');

    const closeButton = screen.getByLabelText('Close navigation menu');
    fireEvent.click(closeButton);
    expect(screen.getByTestId('command-deck')).toHaveClass('closed');
  });
});