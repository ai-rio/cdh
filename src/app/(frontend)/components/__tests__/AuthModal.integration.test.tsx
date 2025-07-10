/**
 * Integration test for AuthModal component
 * Tests the complete authentication flow as specified in auth-modal-integration.md
 */

import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../../../../tests/utils/test-utils'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import AuthModal from '../AuthModal'

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock fetch for API calls
global.fetch = vi.fn()

// AuthProvider is now handled by the custom render function

describe('AuthModal Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    })
  })

  describe('AC1: Modal Display and Navigation', () => {
    it('should display the authentication modal with sign-in form by default', () => {
      render(<AuthModal isOpen={true} onClose={vi.fn()} />)
      
      expect(screen.getByText('Welcome Back, Commander')).toBeInTheDocument()
      expect(screen.getAllByPlaceholderText('Email')).toHaveLength(2) // Both forms have email inputs
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByText('Launch Command Center')).toBeInTheDocument()
    })

    it('should toggle between Sign In and Sign Up views', () => {
      render(<AuthModal isOpen={true} onClose={vi.fn()} />)
      
      // Click Sign Up toggle
      fireEvent.click(screen.getByText('Sign Up'))
      
      expect(screen.getByText('Join the Constellation')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
      expect(screen.getByText('Create My Account')).toBeInTheDocument()
    })

    it('should close modal when X button is clicked', () => {
      const onClose = vi.fn()
      render(<AuthModal isOpen={true} onClose={onClose} />)
      
      const closeButton = screen.getByLabelText('Close authentication modal')
      fireEvent.click(closeButton)
      
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('AC2: User Registration (Sign Up)', () => {
    it('should validate required fields before submission', async () => {
      render(<AuthModal isOpen={true} onClose={vi.fn()} />)
      
      // Switch to sign up
      fireEvent.click(screen.getByText('Sign Up'))
      
      // Try to submit without filling fields
      fireEvent.click(screen.getByText('Create My Account'))
      
      await waitFor(() => {
        expect(screen.getByText('All fields are required.')).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      render(<AuthModal isOpen={true} onClose={vi.fn()} />)
      
      // Switch to sign up
      fireEvent.click(screen.getByText('Sign Up'))
      
      // Fill invalid email
      fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } })
      const emailInputs = screen.getAllByPlaceholderText('Email')
      fireEvent.change(emailInputs[1], { target: { value: 'invalid-email' } }) // Use signup form email input
      fireEvent.change(screen.getByPlaceholderText(/Password/), { target: { value: 'Password123' } })
      
      fireEvent.click(screen.getByText('Create My Account'))
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
      })
    })

    it('should validate password strength', async () => {
      render(<AuthModal isOpen={true} onClose={vi.fn()} />)
      
      // Switch to sign up
      fireEvent.click(screen.getByText('Sign Up'))
      
      // Fill weak password
      fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } })
      const emailInputs = screen.getAllByPlaceholderText('Email')
      fireEvent.change(emailInputs[1], { target: { value: 'test@example.com' } }) // Use signup form email input
      fireEvent.change(screen.getByPlaceholderText(/Password/), { target: { value: 'weak' } })
      
      fireEvent.click(screen.getByText('Create My Account'))
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters long.')).toBeInTheDocument()
      })
    })

    it('should make API call to /api/users on successful validation', async () => {
      const mockFetch = fetch as any
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'mock-token'
        })
      })

      render(<AuthModal isOpen={true} onClose={vi.fn()} />)
      
      // Switch to sign up
      fireEvent.click(screen.getByText('Sign Up'))
      
      // Fill valid data
      fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } })
      const emailInputs = screen.getAllByPlaceholderText('Email')
      fireEvent.change(emailInputs[1], { target: { value: 'test@example.com' } }) // Use signup form email input
      fireEvent.change(screen.getByPlaceholderText(/Password/), { target: { value: 'Password123' } })
      
      fireEvent.click(screen.getByText('Create My Account'))
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password123'
          })
        })
      })
    })
  })

  describe('AC3: User Authentication (Sign In)', () => {
    it('should make API call to /api/users/login with credentials', async () => {
      const mockFetch = fetch as any
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'mock-token'
        })
      })

      render(<AuthModal isOpen={true} onClose={vi.fn()} />)
      
      // Fill login data
      const emailInputs = screen.getAllByPlaceholderText('Email')
      fireEvent.change(emailInputs[0], { target: { value: 'test@example.com' } }) // Use signin form email input
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } })
      
      fireEvent.click(screen.getByText('Launch Command Center'))
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })
      })
    })
  })

  describe('AC4: Error Handling and Validation', () => {
    it('should display server-side errors', async () => {
      const mockFetch = fetch as any
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' })
      })

      render(<AuthModal isOpen={true} onClose={vi.fn()} />)
      
      // Fill login data
      const emailInputs = screen.getAllByPlaceholderText('Email')
      fireEvent.change(emailInputs[0], { target: { value: 'test@example.com' } }) // Use signin form email input
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } })
      
      fireEvent.click(screen.getByText('Launch Command Center'))
      
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
    })
  })

  describe('AC5: Session Management', () => {
    it('should redirect to dashboard on successful authentication', async () => {
      const mockFetch = fetch as any
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'mock-token'
        })
      })

      const onClose = vi.fn()
      render(<AuthModal isOpen={true} onClose={onClose} />)
      
      // Fill login data
      const emailInputs = screen.getAllByPlaceholderText('Email')
      fireEvent.change(emailInputs[0], { target: { value: 'test@example.com' } }) // Use signin form email input
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } })
      
      fireEvent.click(screen.getByText('Launch Command Center'))
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
        expect(onClose).toHaveBeenCalled()
      })
    })
  })
})
