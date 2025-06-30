import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import CommandDeck from './CommandDeck.tsx';

describe('CommandDeck', () => {
  const mockOnClose = vi.fn();

  it('renders navigation links', () => {
    render(<CommandDeck onClose={mockOnClose} />);
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<CommandDeck onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close navigation menu');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
