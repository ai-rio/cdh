import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TriageCard } from '../TriageCard'

describe('TriageCard', () => {
  const mockOnClick = vi.fn()
  
  const defaultProps = {
    title: 'Test Title',
    description: 'Test description',
    onClick: mockOnClick
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and description correctly', () => {
    render(<TriageCard {...defaultProps} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<TriageCard {...defaultProps} />)
    
    const card = screen.getByText('Test Title').closest('div')
    fireEvent.click(card!)
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('has proper styling classes', () => {
    render(<TriageCard {...defaultProps} />)
    
    const card = screen.getByText('Test Title').closest('div')
    expect(card).toHaveClass('cursor-pointer')
    expect(card).toHaveClass('transition-all')
    expect(card).toHaveClass('duration-300')
  })

  it('has hover effects', () => {
    render(<TriageCard {...defaultProps} />)
    
    const card = screen.getByText('Test Title').closest('div')
    expect(card).toHaveClass('hover:translate-y-[-5px]')
    expect(card).toHaveClass('hover:border-[#A3E635]')
  })

  it('title has proper styling', () => {
    render(<TriageCard {...defaultProps} />)
    
    const title = screen.getByText('Test Title')
    expect(title).toHaveClass('text-xl')
    expect(title).toHaveClass('font-bold')
    expect(title).toHaveClass('text-lime-300')
  })

  it('description has proper styling', () => {
    render(<TriageCard {...defaultProps} />)
    
    const description = screen.getByText('Test description')
    expect(description).toHaveClass('text-sm')
    expect(description).toHaveClass('text-gray-400')
    expect(description).toHaveClass('mt-2')
  })
})
