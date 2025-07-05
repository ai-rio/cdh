import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { Header } from '@/app/(frontend)/components/Header'

// Mock the AuthModal component
vi.mock('@/app/(frontend)/components/AuthModal', () => {
  return {
    default: ({ isOpen, onClose }: any) =>
      isOpen
        ? React.createElement(
            'div',
            {
              'data-testid': 'auth-modal',
              role: 'dialog',
            },
            [
              React.createElement(
                'button',
                {
                  key: 'close',
                  onClick: onClose,
                  'aria-label': 'Close modal',
                },
                '×',
              ),
              React.createElement('div', { key: 'content' }, 'Mock Auth Modal Content'),
            ],
          )
        : null,
  }
})

// Mock the CommandDeck component
vi.mock('@/app/(frontend)/components/CommandDeck', () => {
  return {
    CommandDeck: ({ isOpen, onClose, onOpenAuthModal }: any) =>
      isOpen
        ? React.createElement('div', { 'data-testid': 'command-deck' }, [
            React.createElement(
              'button',
              {
                key: 'login',
                onClick: () => {
                  onOpenAuthModal?.()
                  onClose() // Close command deck when opening auth modal
                },
                'data-testid': 'login-button',
              },
              'Login',
            ),
            React.createElement('button', { key: 'close', onClick: onClose }, 'Close'),
          ])
        : null,
  }
})

describe('Header Modal Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render header with navigation button', () => {
    render(React.createElement(Header))

    const navButton = screen.getByLabelText('Open navigation menu')
    expect(navButton).toBeInTheDocument()
  })

  it('should open command deck when navigation button is clicked', () => {
    render(React.createElement(Header))

    const navButton = screen.getByLabelText('Open navigation menu')
    fireEvent.click(navButton)

    expect(screen.getByTestId('command-deck')).toBeInTheDocument()
  })

  it('should open auth modal when Login button in command deck is clicked', () => {
    render(React.createElement(Header))

    // Open command deck first
    const navButton = screen.getByLabelText('Open navigation menu')
    fireEvent.click(navButton)

    // Click login button
    const loginButton = screen.getByTestId('login-button')
    fireEvent.click(loginButton)

    // Auth modal should be open
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument()
  })

  it('should close command deck when login button is clicked', () => {
    render(React.createElement(Header))

    // Open command deck first
    const navButton = screen.getByLabelText('Open navigation menu')
    fireEvent.click(navButton)

    expect(screen.getByTestId('command-deck')).toBeInTheDocument()

    // Click login button
    const loginButton = screen.getByTestId('login-button')
    fireEvent.click(loginButton)

    // Command deck should be closed
    expect(screen.queryByTestId('command-deck')).not.toBeInTheDocument()
  })

  it('should close auth modal when close button is clicked', () => {
    render(React.createElement(Header))

    // Open command deck and then auth modal
    const navButton = screen.getByLabelText('Open navigation menu')
    fireEvent.click(navButton)

    const loginButton = screen.getByTestId('login-button')
    fireEvent.click(loginButton)

    expect(screen.getByTestId('auth-modal')).toBeInTheDocument()

    // Close auth modal
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument()
  })

  it('should handle multiple modal state changes correctly', () => {
    render(React.createElement(Header))

    // Open command deck
    const navButton = screen.getByLabelText('Open navigation menu')
    fireEvent.click(navButton)
    expect(screen.getByTestId('command-deck')).toBeInTheDocument()

    // Open auth modal
    const loginButton = screen.getByTestId('login-button')
    fireEvent.click(loginButton)
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument()
    expect(screen.queryByTestId('command-deck')).not.toBeInTheDocument()

    // Close auth modal
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)
    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument()

    // Open command deck again
    fireEvent.click(navButton)
    expect(screen.getByTestId('command-deck')).toBeInTheDocument()
  })

  it('should have proper navigation structure', () => {
    render(React.createElement(Header))

    // Check for logo
    expect(screen.getByText('CDH')).toBeInTheDocument()

    // Check for navigation button
    expect(screen.getByLabelText('Open navigation menu')).toBeInTheDocument()

    // Check that header has proper styling
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('should maintain proper modal state isolation', () => {
    render(React.createElement(Header))

    // Initially no modals should be open
    expect(screen.queryByTestId('command-deck')).not.toBeInTheDocument()
    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument()

    // Open command deck
    const navButton = screen.getByLabelText('Open navigation menu')
    fireEvent.click(navButton)
    expect(screen.getByTestId('command-deck')).toBeInTheDocument()
    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument()

    // Open auth modal (should close command deck)
    const loginButton = screen.getByTestId('login-button')
    fireEvent.click(loginButton)
    expect(screen.queryByTestId('command-deck')).not.toBeInTheDocument()
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument()
  })
})
