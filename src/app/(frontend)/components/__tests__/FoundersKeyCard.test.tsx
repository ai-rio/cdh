import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { FoundersKeyCard } from '../FoundersKeyCard'

describe('FoundersKeyCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    cleanup()
  })

  it('renders the founders key offer correctly', () => {
    const mockOnClaim = vi.fn()
    render(<FoundersKeyCard onClaimOffer={mockOnClaim} />)
    
    expect(screen.getByText(/Join the/)).toBeInTheDocument()
    expect(screen.getByText(/Founder's Circle/)).toBeInTheDocument()
    expect(screen.getByText('A one-time offer for the pioneers.')).toBeInTheDocument()
    expect(screen.getByText('Claim My Founder\'s Key')).toBeInTheDocument()
  })

  it('displays countdown timer', () => {
    const mockOnClaim = vi.fn()
    render(<FoundersKeyCard onClaimOffer={mockOnClaim} />)
    
    // Should show countdown format HH:MM:SS
    expect(screen.getByText(/\d{2}:\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('calls onClaimOffer when button is clicked', () => {
    const mockOnClaim = vi.fn()
    const { container } = render(<FoundersKeyCard onClaimOffer={mockOnClaim} />)
    
    const claimButton = container.querySelector('button')
    expect(claimButton).toBeInTheDocument()
    fireEvent.click(claimButton!)
    
    expect(mockOnClaim).toHaveBeenCalledTimes(1)
  })

  it('updates countdown timer every second', () => {
    const mockOnClaim = vi.fn()
    const { container } = render(<FoundersKeyCard onClaimOffer={mockOnClaim} />)
    
    const timerElement = container.querySelector('.countdown-timer span')
    expect(timerElement).toBeInTheDocument()
    const initialTimeText = timerElement?.textContent
    
    // Advance timer by 1 second
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    const updatedTimeText = timerElement?.textContent
    expect(updatedTimeText).not.toBe(initialTimeText)
  })

  it('applies correct CSS classes', () => {
    const mockOnClaim = vi.fn()
    const { container } = render(<FoundersKeyCard onClaimOffer={mockOnClaim} />)
    
    const card = container.querySelector('.founders-key-card')
    expect(card).toBeInTheDocument()
    
    const timer = container.querySelector('.countdown-timer')
    expect(timer).toBeInTheDocument()
  })

  it('has accessible button', () => {
    const mockOnClaim = vi.fn()
    render(<FoundersKeyCard onClaimOffer={mockOnClaim} />)
    
    const button = screen.getByRole('button', { name: 'Claim My Founder\'s Key' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('cta-glow')
  })

  it('displays offer benefits', () => {
    const mockOnClaim = vi.fn()
    render(<FoundersKeyCard onClaimOffer={mockOnClaim} />)
    
    expect(screen.getByText(/50% OFF/)).toBeInTheDocument()
    expect(screen.getByText(/Forever/)).toBeInTheDocument()
    expect(screen.getByText('Offer ends in:')).toBeInTheDocument()
  })

  it('formats countdown correctly', () => {
    const mockOnClaim = vi.fn()
    const { container } = render(<FoundersKeyCard onClaimOffer={mockOnClaim} />)
    
    const countdown = container.querySelector('.countdown-timer span')
    expect(countdown).toBeInTheDocument()
    // Should be in format HH:MM:SS
    expect(countdown?.textContent).toMatch(/^\d{2}:\d{2}:\d{2}$/)
  })

  it('cleans up timer on unmount', () => {
    const mockOnClaim = vi.fn()
    const { unmount } = render(<FoundersKeyCard onClaimOffer={mockOnClaim} />)
    
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    unmount()
    
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})