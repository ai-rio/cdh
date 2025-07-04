import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PricingCard } from '../PricingCard'

describe('PricingCard', () => {
  const mockOnChoosePlan = vi.fn()
  
  const props = {
    planName: 'Creator',
    description: 'For individuals ready to professionalize.',
    monthlyPrice: '29',
    annuallyPrice: '23',
    features: ['Feature 1', 'Feature 2'],
    isPopular: false,
    onChoosePlan: mockOnChoosePlan,
    billingPeriod: 'monthly' as const
  }

  beforeEach(() => {
    mockOnChoosePlan.mockClear()
  })

  it('renders plan details correctly', () => {
    render(<PricingCard {...props} />)
    
    expect(screen.getByText('Creator')).toBeInTheDocument()
    expect(screen.getByText('For individuals ready to professionalize.')).toBeInTheDocument()
    expect(screen.getByText('$29')).toBeInTheDocument()
    expect(screen.getByText('/mo')).toBeInTheDocument()
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
  })

  it('displays monthly price when billingPeriod is monthly', () => {
    render(<PricingCard {...props} billingPeriod="monthly" />)
    expect(screen.getByText('$29')).toBeInTheDocument()
  })

  it('displays annual price when billingPeriod is annually', () => {
    render(<PricingCard {...props} billingPeriod="annually" />)
    expect(screen.getByText('$23')).toBeInTheDocument()
  })

  it('shows popular badge when isPopular is true', () => {
    render(<PricingCard {...props} isPopular={true} />)
    expect(screen.getByText('MOST POPULAR')).toBeInTheDocument()
  })

  it('does not show popular badge when isPopular is false', () => {
    render(<PricingCard {...props} isPopular={false} />)
    expect(screen.queryByText('MOST POPULAR')).not.toBeInTheDocument()
  })

  it('applies popular styling when isPopular is true', () => {
    const { container } = render(<PricingCard {...props} isPopular={true} />)
    const card = container.querySelector('.pricing-card')
    expect(card).toHaveClass('border-lime-400')
  })

  it('calls onChoosePlan when button is clicked', () => {
    render(<PricingCard {...props} />)
    const button = screen.getByText('Choose Creator')
    fireEvent.click(button)
    expect(mockOnChoosePlan).toHaveBeenCalledTimes(1)
  })

  it('renders all features with check icons', () => {
    const features = ['AI-Powered Insights', 'Deal Management', 'Invoicing']
    const { container } = render(<PricingCard {...props} features={features} />)
    
    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument()
    })
    
    // Check that check icons are present
    const checkIcons = container.querySelectorAll('svg')
    expect(checkIcons.length).toBeGreaterThan(0)
  })

  it('renders HTML content in features correctly', () => {
    const htmlFeature = '<strong>AI-Powered Insights:</strong> Turn your data into actionable advice.'
    render(<PricingCard {...props} features={[htmlFeature]} />)
    
    expect(screen.getByText('AI-Powered Insights:')).toBeInTheDocument()
    expect(screen.getByText('Turn your data into actionable advice.')).toBeInTheDocument()
  })
})