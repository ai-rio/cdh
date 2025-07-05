import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SuccessMessageView } from '../SuccessMessageView'

describe('SuccessMessageView', () => {
  const mockOnBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders success message for demo form', () => {
    render(<SuccessMessageView formType="demo" onBack={mockOnBack} />)
    
    expect(screen.getByText('Transmission Received')).toBeInTheDocument()
    expect(screen.getByText('Your request has been routed to our strategy team. Stand by for contact.')).toBeInTheDocument()
  })

  it('renders success message for press form', () => {
    render(<SuccessMessageView formType="press" onBack={mockOnBack} />)
    
    expect(screen.getByText('Transmission Received')).toBeInTheDocument()
    expect(screen.getByText("Your inquiry has been routed to our comms channel. We'll be in touch shortly.")).toBeInTheDocument()
  })

  it('renders success message for general form', () => {
    render(<SuccessMessageView formType="general" onBack={mockOnBack} />)
    
    expect(screen.getByText('Transmission Received')).toBeInTheDocument()
    expect(screen.getByText('Your signal has been received. Thank you for your feedback.')).toBeInTheDocument()
  })

  it('renders success icon', () => {
    render(<SuccessMessageView formType="demo" onBack={mockOnBack} />)
    
    const icon = screen.getByRole('img', { hidden: true })
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('text-[#EEFC97]')
  })

  it('renders back button', () => {
    render(<SuccessMessageView formType="demo" onBack={mockOnBack} />)
    
    expect(screen.getByText('Send Another Transmission')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    render(<SuccessMessageView formType="demo" onBack={mockOnBack} />)
    
    const backButton = screen.getByText('Send Another Transmission')
    fireEvent.click(backButton)
    
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('has proper styling classes', () => {
    render(<SuccessMessageView formType="demo" onBack={mockOnBack} />)
    
    const title = screen.getByText('Transmission Received')
    expect(title).toHaveClass('text-3xl')
    expect(title).toHaveClass('font-bold')
    expect(title).toHaveClass('text-white')
    
    const icon = screen.getByRole('img', { hidden: true })
    expect(icon).toHaveClass('w-16')
    expect(icon).toHaveClass('h-16')
    expect(icon).toHaveClass('mx-auto')
    
    const backButton = screen.getByText('Send Another Transmission')
    expect(backButton).toHaveClass('border-white/20')
    expect(backButton).toHaveClass('text-white')
  })

  it('has proper text styling for success message', () => {
    render(<SuccessMessageView formType="demo" onBack={mockOnBack} />)
    
    const message = screen.getByText('Your request has been routed to our strategy team. Stand by for contact.')
    expect(message).toHaveClass('text-gray-300')
  })
})
