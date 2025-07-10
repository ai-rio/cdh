import React from 'react'
import { vi } from 'vitest'
import { render } from '../utils/test-utils'
import { screen, fireEvent } from '@testing-library/react'
import { Header } from '../../src/app/(frontend)/components/Header'

// Mock the next/link component
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href }) => {
      return <a href={href}>{children}</a>
    },
  }
})

describe('Header Integration Tests', () => {
  beforeEach(() => {
    render(<Header />)
  })

  it('renders the mission control HUD header', () => {
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('mission-control-hud')
  })

  it("displays the Creator's Deal Hub logo and title", () => {
    const logoLink = screen.getByRole('link', { name: /CDH/i })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
    expect(screen.getByText(/CDH/)).toBeInTheDocument()
  })

  it('has navigation toggle functionality', () => {
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('has a navigation toggle button', () => {
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i })
    expect(toggleButton).toBeInTheDocument()
    expect(toggleButton).toHaveAttribute('id', 'command-deck-toggle')
  })

  it('opens and closes the CommandDeck overlay when toggle is clicked', () => {
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i })

    // Initially, CommandDeck should not be visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Click to open
    fireEvent.click(toggleButton)

    // CommandDeck should now be visible with navigation items
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()

    // Click close button to close
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays navigation cards with correct content', () => {
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i })
    fireEvent.click(toggleButton)

    // Check Blog card
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(
      screen.getByText('Insights and strategies from the forefront of the creator economy.'),
    ).toBeInTheDocument()

    // Check Pricing card
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(
      screen.getByText('Simple, transparent plans that scale with your success.'),
    ).toBeInTheDocument()

    // Check About Us card
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(
      screen.getByText('Learn about our mission to empower professional creators.'),
    ).toBeInTheDocument()

    // Check Login card
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText("Access your Creator's Deal Hub account.")).toBeInTheDocument()
  })

  it('has proper navigation links', () => {
    const toggleButton = screen.getByRole('button', { name: /open navigation menu/i })
    fireEvent.click(toggleButton)

    const blogLink = screen.getByRole('link', { name: /Blog/i })
    expect(blogLink).toHaveAttribute('href', '/blog')

    const pricingLink = screen.getByRole('link', { name: /Pricing/i })
    expect(pricingLink).toHaveAttribute('href', '/pricing')

    const aboutLink = screen.getByRole('link', { name: /About Us/i })
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

  it('has proper header styling classes', () => {
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('mission-control-hud')
  })
})
