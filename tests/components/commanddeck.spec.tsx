import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { CommandDeck } from '@/app/(frontend)/components/CommandDeck';
import { vi } from 'vitest';

// Mock the next/link component
vi.mock('next/link', () => {
    return {
        __esModule: true,
        default: ({children, href}) => {
            return <a href={href}>{children}</a>
        }
    }
});

describe('CommandDeck', () => {
  it('should render when open', () => {
    render(<CommandDeck isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<CommandDeck isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('Blog')).not.toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<CommandDeck isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onOpenAuthModal when the login button is clicked', () => {
    const onOpenAuthModal = vi.fn();
    render(
      <CommandDeck isOpen={true} onClose={() => {}} onOpenAuthModal={onOpenAuthModal} />
    );
    fireEvent.click(screen.getByText('Login'));
    expect(onOpenAuthModal).toHaveBeenCalled();
  });
});
