import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

// Mock the SignalLostAnimation component
vi.mock('@/components/special/SignalLostAnimation', () => ({
  SignalLostAnimation: () => <div data-testid="signal-lost-animation">Mocked Animation</div>
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

describe('404 Not Found Page', () => {
  it('renders the main text content', () => {
    render(<NotFound />)
    
    // Check for the 404 heading
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404')
    
    // Check for the main title
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Signal Lost: Trajectory Anomaly')
    
    // Check for the description text
    expect(screen.getByText(/You've discovered an uncharted sector of the constellation/)).toBeInTheDocument()
  })

  it('renders the SignalLostAnimation component', () => {
    render(<NotFound />)
    
    // Check that the mocked animation component is rendered
    expect(screen.getByTestId('signal-lost-animation')).toBeInTheDocument()
  })

  it('renders the Re-establish Connection button with correct styling and link', () => {
    render(<NotFound />)
    
    // Find the button by its text content
    const button = screen.getByRole('button', { name: /Re-establish Connection/i })
    expect(button).toBeInTheDocument()
    
    // Check that the button has the correct styling classes
    expect(button).toHaveClass('bg-[#A3E635]')
    expect(button).toHaveClass('text-[#1D1F04]')
    
    // Check that the button is wrapped in a link to the homepage
    const link = button.closest('a')
    expect(link).toHaveAttribute('href', '/')
  })

  it('applies the glitch-text class to the 404 heading', () => {
    render(<NotFound />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('glitch-text')
  })

  it('has proper styling for the main container', () => {
    render(<NotFound />)
    
    // Check for the main content container - now it's a simple text-center div
    const container = screen.getByRole('heading', { level: 1 }).closest('div')
    expect(container).toHaveClass('text-center')
    expect(container).toHaveClass('max-w-lg')
    expect(container).toHaveClass('mx-auto')
  })

  it('includes the global styles for glitch-text', () => {
    const { container } = render(<NotFound />)
    
    // Check that the style tag is present in the document
    const styleTag = container.querySelector('style')
    expect(styleTag).toBeInTheDocument()
    expect(styleTag?.innerHTML).toContain('.glitch-text')
    expect(styleTag?.innerHTML).toContain("font-family: 'Share Tech Mono', monospace")
    expect(styleTag?.innerHTML).toContain('text-shadow: 0 0 5px #A3E635, 0 0 10px #A3E635')
    expect(styleTag?.innerHTML).toContain('color: #000000')
  })

  it('has the correct root container styling for light theme', () => {
    const { container } = render(<NotFound />)
    
    // Check for the root container styling - should have light theme classes
    const rootContainer = container.firstChild as HTMLElement
    expect(rootContainer).toHaveClass('overflow-hidden')
    expect(rootContainer).toHaveClass('font-inter')
    expect(rootContainer).toHaveClass('bg-white')
    expect(rootContainer).toHaveClass('min-h-screen')
  })

  it('has proper text colors for light theme', () => {
    render(<NotFound />)
    
    // Check that the main title has black text
    const mainTitle = screen.getByRole('heading', { level: 2 })
    expect(mainTitle).toHaveClass('text-black')
    
    // Check that the description has gray text
    const description = screen.getByText(/You've discovered an uncharted sector of the constellation/)
    expect(description).toHaveClass('text-gray-600')
  })
})
