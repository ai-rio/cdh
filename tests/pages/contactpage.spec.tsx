import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ContactPage from '../../src/app/(frontend)/contact/page'

// Mock the components that have external dependencies
vi.mock('../../src/app/(frontend)/components/Header', () => ({
  Header: () => <header data-testid="header">Header</header>
}))

vi.mock('../../src/app/(frontend)/components/StarfieldCanvas', () => ({
  StarfieldCanvas: () => <canvas data-testid="starfield-canvas">Starfield Canvas</canvas>
}))

describe('Contact Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the contact page with initial triage view', () => {
    render(<ContactPage />)
    
    expect(screen.getByText('Establish Comms')).toBeInTheDocument()
    expect(screen.getByText(/What is the nature of your transmission/)).toBeInTheDocument()
    expect(screen.getByText('Request a Private Demo')).toBeInTheDocument()
    expect(screen.getByText('Press & Media Inquiry')).toBeInTheDocument()
    expect(screen.getByText('General Question')).toBeInTheDocument()
  })

  it('renders header and starfield canvas', () => {
    render(<ContactPage />)
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('starfield-canvas')).toBeInTheDocument()
  })

  it('shows demo form when demo triage card is clicked', async () => {
    render(<ContactPage />)
    
    const demoCard = screen.getByText('Request a Private Demo').closest('div')
    fireEvent.click(demoCard!)
    
    await waitFor(() => {
      expect(screen.getByText('Request a Private Demo')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Work Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Company / Channel Name')).toBeInTheDocument()
      expect(screen.getByText('Submit Request')).toBeInTheDocument()
    })
  })

  it('shows press form when press triage card is clicked', async () => {
    render(<ContactPage />)
    
    const pressCard = screen.getByText('Press & Media Inquiry').closest('div')
    fireEvent.click(pressCard!)
    
    await waitFor(() => {
      expect(screen.getByText('Press & Media Inquiry')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Work Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Publication')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Briefly describe your inquiry...')).toBeInTheDocument()
      expect(screen.getByText('Send Inquiry')).toBeInTheDocument()
    })
  })

  it('shows general form when general triage card is clicked', async () => {
    render(<ContactPage />)
    
    const generalCard = screen.getByText('General Question').closest('div')
    fireEvent.click(generalCard!)
    
    await waitFor(() => {
      expect(screen.getByText('General Question or Feedback')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Your message...')).toBeInTheDocument()
      expect(screen.getByText('Send Transmission')).toBeInTheDocument()
    })
  })

  it('allows navigation back to triage from form view', async () => {
    render(<ContactPage />)
    
    // Click demo card to go to form
    const demoCard = screen.getByText('Request a Private Demo').closest('div')
    fireEvent.click(demoCard!)
    
    await waitFor(() => {
      expect(screen.getByText('Select a different channel')).toBeInTheDocument()
    })
    
    // Click back button
    const backButton = screen.getByText('Select a different channel')
    fireEvent.click(backButton)
    
    await waitFor(() => {
      expect(screen.getByText('Establish Comms')).toBeInTheDocument()
      expect(screen.getByText('Request a Private Demo')).toBeInTheDocument()
      expect(screen.getByText('Press & Media Inquiry')).toBeInTheDocument()
      expect(screen.getByText('General Question')).toBeInTheDocument()
    })
  })

  it('submits demo form and shows success message', async () => {
    render(<ContactPage />)
    
    // Navigate to demo form
    const demoCard = screen.getByText('Request a Private Demo').closest('div')
    fireEvent.click(demoCard!)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
    })
    
    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByPlaceholderText('Work Email'), {
      target: { value: 'john@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Company / Channel Name'), {
      target: { value: 'Test Company' }
    })
    
    // Submit form
    const submitButton = screen.getByText('Submit Request')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Transmission Received')).toBeInTheDocument()
      expect(screen.getByText('Your request has been routed to our strategy team. Stand by for contact.')).toBeInTheDocument()
    })
  })

  it('submits press form and shows success message', async () => {
    render(<ContactPage />)
    
    // Navigate to press form
    const pressCard = screen.getByText('Press & Media Inquiry').closest('div')
    fireEvent.click(pressCard!)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Publication')).toBeInTheDocument()
    })
    
    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Full Name'), {
      target: { value: 'Jane Reporter' }
    })
    fireEvent.change(screen.getByPlaceholderText('Work Email'), {
      target: { value: 'jane@news.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Publication'), {
      target: { value: 'Tech News' }
    })
    fireEvent.change(screen.getByPlaceholderText('Briefly describe your inquiry...'), {
      target: { value: 'Looking for an interview about creator economy trends.' }
    })
    
    // Submit form
    const submitButton = screen.getByText('Send Inquiry')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Transmission Received')).toBeInTheDocument()
      expect(screen.getByText("Your inquiry has been routed to our comms channel. We'll be in touch shortly.")).toBeInTheDocument()
    })
  })

  it('submits general form and shows success message', async () => {
    render(<ContactPage />)
    
    // Navigate to general form
    const generalCard = screen.getByText('General Question').closest('div')
    fireEvent.click(generalCard!)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
    })
    
    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Your Email'), {
      target: { value: 'user@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your message...'), {
      target: { value: 'Great platform! Love the features.' }
    })
    
    // Submit form
    const submitButton = screen.getByText('Send Transmission')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Transmission Received')).toBeInTheDocument()
      expect(screen.getByText('Your signal has been received. Thank you for your feedback.')).toBeInTheDocument()
    })
  })

  it('allows navigation back to triage from success view', async () => {
    render(<ContactPage />)
    
    // Navigate to form and submit
    const generalCard = screen.getByText('General Question').closest('div')
    fireEvent.click(generalCard!)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
    })
    
    fireEvent.change(screen.getByPlaceholderText('Your Email'), {
      target: { value: 'user@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('Your message...'), {
      target: { value: 'Test message' }
    })
    
    const submitButton = screen.getByText('Send Transmission')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Send Another Transmission')).toBeInTheDocument()
    })
    
    // Click back to triage
    const backButton = screen.getByText('Send Another Transmission')
    fireEvent.click(backButton)
    
    await waitFor(() => {
      expect(screen.getByText('Establish Comms')).toBeInTheDocument()
    })
  })

  it('has proper form validation', async () => {
    render(<ContactPage />)
    
    // Navigate to demo form
    const demoCard = screen.getByText('Request a Private Demo').closest('div')
    fireEvent.click(demoCard!)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
    })
    
    // Try to submit without filling required fields
    const submitButton = screen.getByText('Submit Request')
    fireEvent.click(submitButton)
    
    // Form should not submit (browser validation will handle this)
    expect(screen.getByPlaceholderText('Full Name')).toBeRequired()
    expect(screen.getByPlaceholderText('Work Email')).toBeRequired()
    expect(screen.getByPlaceholderText('Company / Channel Name')).toBeRequired()
  })

  it('applies correct styling classes', () => {
    render(<ContactPage />)
    
    // Check main container styling
    const mainContainer = screen.getByText('Establish Comms').closest('div')
    expect(mainContainer).toHaveClass('text-center')
    
    // Check triage cards have hover effects
    const demoCard = screen.getByText('Request a Private Demo').closest('div')
    expect(demoCard).toHaveClass('cursor-pointer')
  })
})
