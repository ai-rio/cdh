import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BillingToggle } from '../BillingToggle'

describe('BillingToggle', () => {
  it('renders with monthly selected by default', () => {
    const mockOnChange = vi.fn()
    render(<BillingToggle value="monthly" onValueChange={mockOnChange} />)
    
    expect(screen.getByText('Monthly')).toBeInTheDocument()
    expect(screen.getByText('Annually')).toBeInTheDocument()
    expect(screen.getByText('Save 20%')).toBeInTheDocument()
  })

  it('calls onValueChange when switching to annually', () => {
    const mockOnChange = vi.fn()
    render(<BillingToggle value="monthly" onValueChange={mockOnChange} />)
    
    const annuallyButton = screen.getByText('Annually')
    fireEvent.click(annuallyButton)
    
    expect(mockOnChange).toHaveBeenCalledWith('annually')
  })

  it('calls onValueChange when switching to monthly', () => {
    const mockOnChange = vi.fn()
    render(<BillingToggle value="annually" onValueChange={mockOnChange} />)
    
    const monthlyButton = screen.getByText('Monthly')
    fireEvent.click(monthlyButton)
    
    expect(mockOnChange).toHaveBeenCalledWith('monthly')
  })

  it('shows correct selected state for annually', () => {
    const mockOnChange = vi.fn()
    render(<BillingToggle value="annually" onValueChange={mockOnChange} />)
    
    const annuallyButton = screen.getByText('Annually')
    expect(annuallyButton).toHaveAttribute('data-state', 'on')
  })

  it('shows correct selected state for monthly', () => {
    const mockOnChange = vi.fn()
    render(<BillingToggle value="monthly" onValueChange={mockOnChange} />)
    
    const monthlyButton = screen.getByText('Monthly')
    expect(monthlyButton).toHaveAttribute('data-state', 'on')
  })

  it('displays save 20% badge for annually option', () => {
    const mockOnChange = vi.fn()
    render(<BillingToggle value="monthly" onValueChange={mockOnChange} />)
    
    const saveBadge = screen.getByText('Save 20%')
    expect(saveBadge).toBeInTheDocument()
    expect(saveBadge).toHaveClass('bg-green-400')
  })
})