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
    
    // Find the link by its text content (it's a link, not a button)
    const link = screen.getByRole('link', { name: /Re-establish Connection/i })
    expect(link).toBeInTheDocument()
    
    // Check that the link has the correct href
    expect(link).toHaveAttribute('href', '/')
    
    // Check that it has a CSS module class for the CTA button
    expect(link.className).toMatch(/_ctaButton_/)
  })

  it('applies the glitch-text class to the 404 heading', () => {
    render(<NotFound />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    // Check that it has the CSS module class (not the literal class name)
    expect(heading.className).toMatch(/_glitchText_/)
  })

  it('has proper styling for the main container', () => {
    render(<NotFound />)
    
    // Check for the holo panel container with CSS module classes
    const container = screen.getByRole('heading', { level: 1 }).closest('div')
    expect(container?.className).toMatch(/_holoPanel_/)
  })

  it('includes the global styles for body background', () => {
    const { container } = render(<NotFound />)
    
    // Check that the style tag is present in the document
    const styleTag = container.querySelector('style')
    expect(styleTag).toBeInTheDocument()
    expect(styleTag?.innerHTML).toContain('background-color: #000000')
    expect(styleTag?.innerHTML).toContain('overflow: hidden')
  })

  it('has the correct root container styling for dark theme', () => {
    const { container } = render(<NotFound />)
    
    // Check for the page wrapper with CSS module classes
    const rootContainer = container.firstChild as HTMLElement
    expect(rootContainer.className).toMatch(/_pageWrapper_/)
  })

  it('has proper text colors for dark theme', () => {
    render(<NotFound />)
    
    // Check that the main title has the CSS module class
    const mainTitle = screen.getByRole('heading', { level: 2 })
    expect(mainTitle.className).toMatch(/_subtitle_/)
    
    // Check that the description has the CSS module class
    const description = screen.getByText(/You've discovered an uncharted sector of the constellation/)
    expect(description.className).toMatch(/_description_/)
  })
})
