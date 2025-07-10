import { screen, fireEvent } from '@testing-library/react'
import { render } from '../../../../../../tests/utils/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContactFormView } from '../ContactFormView'

describe('ContactFormView', () => {
  const mockOnSubmit = vi.fn()
  const mockOnBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Demo Form', () => {
    const demoProps = {
      formType: 'demo' as const,
      onSubmit: mockOnSubmit,
      onBack: mockOnBack
    }

    it('renders demo form with correct fields', () => {
      render(<ContactFormView {...demoProps} />)
      
      expect(screen.getByText('Request a Private Demo')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Work Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Company / Channel Name')).toBeInTheDocument()
      expect(screen.getByText('Submit Request')).toBeInTheDocument()
    })

    it('submits demo form with correct data', () => {
      render(<ContactFormView {...demoProps} />)
      
      fireEvent.change(screen.getByPlaceholderText('Full Name'), {
        target: { value: 'John Doe' }
      })
      fireEvent.change(screen.getByPlaceholderText('Work Email'), {
        target: { value: 'john@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText('Company / Channel Name'), {
        target: { value: 'Test Company' }
      })
      
      fireEvent.click(screen.getByText('Submit Request'))
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'john@example.com',
        name: 'John Doe',
        company: 'Test Company'
      })
    })
  })

  describe('Press Form', () => {
    const pressProps = {
      formType: 'press' as const,
      onSubmit: mockOnSubmit,
      onBack: mockOnBack
    }

    it('renders press form with correct fields', () => {
      render(<ContactFormView {...pressProps} />)
      
      expect(screen.getByText('Press & Media Inquiry')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Work Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Publication')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Briefly describe your inquiry...')).toBeInTheDocument()
      expect(screen.getByText('Send Inquiry')).toBeInTheDocument()
    })

    it('submits press form with correct data', () => {
      render(<ContactFormView {...pressProps} />)
      
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
        target: { value: 'Interview request' }
      })
      
      fireEvent.click(screen.getByText('Send Inquiry'))
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'jane@news.com',
        name: 'Jane Reporter',
        publication: 'Tech News',
        message: 'Interview request'
      })
    })
  })

  describe('General Form', () => {
    const generalProps = {
      formType: 'general' as const,
      onSubmit: mockOnSubmit,
      onBack: mockOnBack
    }

    it('renders general form with correct fields', () => {
      render(<ContactFormView {...generalProps} />)
      
      expect(screen.getByText('General Question or Feedback')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Your message...')).toBeInTheDocument()
      expect(screen.getByText('Send Transmission')).toBeInTheDocument()
    })

    it('submits general form with correct data', () => {
      render(<ContactFormView {...generalProps} />)
      
      fireEvent.change(screen.getByPlaceholderText('Your Email'), {
        target: { value: 'user@example.com' }
      })
      fireEvent.change(screen.getByPlaceholderText('Your message...'), {
        target: { value: 'Great platform!' }
      })
      
      fireEvent.click(screen.getByText('Send Transmission'))
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        message: 'Great platform!'
      })
    })
  })

  describe('Common Functionality', () => {
    const commonProps = {
      formType: 'demo' as const,
      onSubmit: mockOnSubmit,
      onBack: mockOnBack
    }

    it('calls onBack when back button is clicked', () => {
      render(<ContactFormView {...commonProps} />)
      
      const backButton = screen.getByText('Select a different channel')
      fireEvent.click(backButton)
      
      expect(mockOnBack).toHaveBeenCalledTimes(1)
    })

    it('has proper form validation attributes', () => {
      render(<ContactFormView {...commonProps} />)
      
      expect(screen.getByPlaceholderText('Full Name')).toBeRequired()
      expect(screen.getByPlaceholderText('Work Email')).toBeRequired()
      expect(screen.getByPlaceholderText('Company / Channel Name')).toBeRequired()
    })

    it('has proper input styling', () => {
      render(<ContactFormView {...commonProps} />)
      
      const emailInput = screen.getByPlaceholderText('Work Email')
      expect(emailInput).toHaveClass('bg-white/5')
      expect(emailInput).toHaveClass('border-white/10')
      expect(emailInput).toHaveClass('focus:border-[#A3E635]')
    })

    it('has proper button styling', () => {
      render(<ContactFormView {...commonProps} />)
      
      const submitButton = screen.getByText('Submit Request')
      expect(submitButton).toHaveClass('bg-lime-400')
      expect(submitButton).toHaveClass('text-lime-900')
      expect(submitButton).toHaveClass('font-bold')
    })
  })
})
