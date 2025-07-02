import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import AuthModal from '@/app/(frontend)/components/AuthModal';

// Mock the form components
vi.mock('@/components/mvpblocks/login-form1', () => {
  return {
    default: ({ onSubmit, onToggleToSignup }: any) => 
      React.createElement('div', { 'data-testid': 'login-form' }, [
        React.createElement('input', { key: 'email', 'data-testid': 'email-input', type: 'email' }),
        React.createElement('input', { key: 'password', 'data-testid': 'password-input', type: 'password' }),
        React.createElement('button', { 
          key: 'submit',
          onClick: () => onSubmit({ email: 'test@test.com', password: 'password' })
        }, 'Launch Command Center'),
        React.createElement('button', { key: 'toggle', onClick: onToggleToSignup }, 'Sign up')
      ])
  };
});

vi.mock('@/components/mvpblocks/signup-form1', () => {
  return {
    default: ({ onSubmit, onToggleToLogin }: any) => 
      React.createElement('div', { 'data-testid': 'signup-form' }, [
        React.createElement('input', { key: 'name', 'data-testid': 'name-input', type: 'text' }),
        React.createElement('input', { key: 'email', 'data-testid': 'email-input', type: 'email' }),
        React.createElement('input', { key: 'password', 'data-testid': 'password-input', type: 'password' }),
        React.createElement('button', { 
          key: 'submit',
          onClick: () => onSubmit({ name: 'Test User', email: 'test@test.com', password: 'password' })
        }, 'Create My Account'),
        React.createElement('button', { key: 'toggle', onClick: onToggleToLogin }, 'Sign in'),
        React.createElement('p', { key: 'terms' }, 'By signing up, you agree to our Terms of Service')
      ])
  };
});

describe('AuthModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(React.createElement(AuthModal, { isOpen: false, onClose: mockOnClose }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should display Sign In view by default', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
  });

  it('should have Sign In toggle button active by default', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    const signInButton = screen.getByText('Sign In');
    expect(signInButton).toHaveClass('active');
  });

  it('should switch to Sign Up view when Sign Up toggle is clicked', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('should switch back to Sign In view when Sign In toggle is clicked', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    // Switch to Sign Up first
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    // Switch back to Sign In
    const signInToggle = screen.getByText('Sign In');
    fireEvent.click(signInToggle);
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
  });

  it('should close modal when close button is clicked', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should close modal when Escape key is pressed', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should toggle to signup from login form', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    const signUpLink = screen.getByText('Sign up');
    fireEvent.click(signUpLink);
    
    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
  });

  it('should toggle to login from signup form', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    // Switch to signup first
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    // Click sign in link in form
    const signInLink = screen.getByText('Sign in');
    fireEvent.click(signInLink);
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should display Terms of Service text in signup form', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    // Switch to signup
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    expect(screen.getByText('By signing up, you agree to our Terms of Service')).toBeInTheDocument();
  });

  it('should have proper modal styling classes', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    const modal = screen.getByRole('dialog').parentElement;
    expect(modal).toHaveClass('modal');
    
    const modalContent = screen.getByRole('dialog');
    expect(modalContent).toHaveClass('modal-content');
  });

  it('should handle form submission in login form', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    const submitButton = screen.getByText('Launch Command Center');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login data:', { email: 'test@test.com', password: 'password' });
    });
    
    consoleSpy.mockRestore();
  });

  it('should handle form submission in signup form', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    // Switch to signup
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    const submitButton = screen.getByText('Create My Account');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Signup data:', { name: 'Test User', email: 'test@test.com', password: 'password' });
    });
    
    consoleSpy.mockRestore();
  });
});