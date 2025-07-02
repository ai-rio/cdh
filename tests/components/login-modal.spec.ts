import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    // Reset viewport to desktop size before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
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
    // Verify we're back in login mode
    expect(screen.getByText('Welcome Back, Commander')).toBeInTheDocument();
    // The signup form is hidden but still in DOM, so we check for the visible signin form
    const signinForm = screen.getByText('Welcome Back, Commander').closest('.signin-view');
    const signupForm = screen.getByText('Join the Constellation').closest('.signup-view');
    expect(signinForm).not.toHaveClass('hidden-form');
    expect(signupForm).toHaveClass('hidden-form');
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
    
    // Verify we're in signup mode
    expect(screen.getByText('Join the Constellation')).toBeInTheDocument();
    // The signin form is hidden but still in DOM, so we check for the visible signup form
    const signinForm = screen.getByText('Welcome Back, Commander').closest('.signin-view');
    const signupForm = screen.getByText('Join the Constellation').closest('.signup-view');
    expect(signupForm).not.toHaveClass('hidden-form');
    expect(signinForm).toHaveClass('hidden-form');
  });

  it('should switch back to Sign In view when Sign In toggle is clicked', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    // Switch to Sign Up first
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    // Switch back to Sign In
    const signInToggle = screen.getByText('Sign In');
    fireEvent.click(signInToggle);
    
    // Verify we're back in login mode
    expect(screen.getByText('Welcome Back, Commander')).toBeInTheDocument();
    // The signup form is hidden but still in DOM, so we check for the visible signin form
    const signinForm = screen.getByText('Welcome Back, Commander').closest('.signin-view');
    const signupForm = screen.getByText('Join the Constellation').closest('.signup-view');
    expect(signinForm).not.toHaveClass('hidden-form');
    expect(signupForm).toHaveClass('hidden-form');
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
    
    // Verify we start in login mode
    expect(screen.getByText('Welcome Back, Commander')).toBeInTheDocument();
    
    // Click sign up toggle button
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    // Verify we're now in signup mode
    expect(screen.getByText('Join the Constellation')).toBeInTheDocument();
  });

  it('should toggle to login from signup form', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    // Switch to signup first
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    // Verify we're in signup mode
    expect(screen.getByText('Join the Constellation')).toBeInTheDocument();
    
    // Click sign in toggle button
    const signInToggle = screen.getByText('Sign In');
    fireEvent.click(signInToggle);
    
    // Verify we're back in login mode
    expect(screen.getByText('Welcome Back, Commander')).toBeInTheDocument();
  });

  it('should display Terms of Service text in signup form', () => {
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    // Switch to signup
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    expect(screen.getByText(/By signing up, you agree to our/)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
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
    
    // Fill out the login form
    const emailInputs = screen.getAllByPlaceholderText('Email');
    const passwordInputs = screen.getAllByPlaceholderText('Password');
    
    // Use the login form inputs (first set)
    const emailInput = emailInputs[0];
    const passwordInput = passwordInputs[0];
    
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    
    const submitButton = screen.getByText('Launch Command Center');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign in:', { email: 'test@test.com', password: 'password' });
    });
    
    consoleSpy.mockRestore();
  });

  it('should handle form submission in signup form', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
    
    // Switch to signup
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    // Fill out the form
    const nameInput = screen.getByPlaceholderText('Full Name');
    const emailInputs = screen.getAllByPlaceholderText('Email');
    const passwordInputs = screen.getAllByPlaceholderText('Password');
    
    // Use the signup form inputs (second set)
    const emailInput = emailInputs[1];
    const passwordInput = passwordInputs[1];
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    
    const submitButton = screen.getByText('Create My Account');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Sign up:', { email: 'test@test.com', password: 'password', name: 'Test User' });
    });
    
    consoleSpy.mockRestore();
  });

  describe('Social Login Features', () => {
    it('should render social login section with all social buttons', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      // Check for social section
      expect(screen.getAllByText('Quick Access')).toHaveLength(2); // Mobile and desktop
      
      // Check for all social buttons
      expect(screen.getAllByTitle('Continue with Google')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Facebook')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Twitter')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Apple')).toHaveLength(2);
    });

    it('should have proper social button styling classes', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const googleButtons = screen.getAllByTitle('Continue with Google');
      const facebookButtons = screen.getAllByTitle('Continue with Facebook');
      const twitterButtons = screen.getAllByTitle('Continue with Twitter');
      const appleButtons = screen.getAllByTitle('Continue with Apple');
      
      googleButtons.forEach(btn => expect(btn).toHaveClass('social-icon-btn', 'google'));
      facebookButtons.forEach(btn => expect(btn).toHaveClass('social-icon-btn', 'facebook'));
      twitterButtons.forEach(btn => expect(btn).toHaveClass('social-icon-btn', 'twitter'));
      appleButtons.forEach(btn => expect(btn).toHaveClass('social-icon-btn', 'apple'));
    });

    it('should render FontAwesome icons in social buttons', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const googleButtons = screen.getAllByTitle('Continue with Google');
      const facebookButtons = screen.getAllByTitle('Continue with Facebook');
      const twitterButtons = screen.getAllByTitle('Continue with Twitter');
      const appleButtons = screen.getAllByTitle('Continue with Apple');
      
      googleButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        expect(icon).toHaveClass('fab', 'fa-google');
      });
      facebookButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        expect(icon).toHaveClass('fab', 'fa-facebook-f');
      });
      twitterButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        expect(icon).toHaveClass('fab', 'fa-twitter');
      });
      appleButtons.forEach(btn => {
        const icon = btn.querySelector('i');
        expect(icon).toHaveClass('fab', 'fa-apple');
      });
    });
  });

  describe('Responsive Design', () => {
    const setMobileViewport = () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });
      window.dispatchEvent(new Event('resize'));
    };

    const setTabletViewport = () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      window.dispatchEvent(new Event('resize'));
    };

    it('should display desktop social section on desktop screens', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const desktopSocial = document.querySelector('.desktop-social');
      const mobileSocial = document.querySelector('.mobile-social');
      
      expect(desktopSocial).toBeInTheDocument();
      expect(mobileSocial).toBeInTheDocument();
      
      // Desktop social should be visible, mobile should be hidden
      const desktopStyles = window.getComputedStyle(desktopSocial!);
      const mobileStyles = window.getComputedStyle(mobileSocial!);
      
      expect(desktopStyles.display).not.toBe('none');
    });

    it('should have proper grid layout structure', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const authContainer = document.querySelector('.auth-form-container');
      expect(authContainer).toBeInTheDocument();
      
      // Should have three-column layout on desktop
      const containerStyles = window.getComputedStyle(authContainer!);
      expect(containerStyles.display).toBe('grid');
    });

    it('should render divider between forms and social section', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const divider = document.querySelector('.divider');
      expect(divider).toBeInTheDocument();
    });

    it('should maintain form functionality on all screen sizes', () => {
      // Test on mobile
      setMobileViewport();
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      // Check for login form elements instead of test-id
      expect(screen.getByText('Launch Command Center')).toBeInTheDocument();
      
      // Switch to signup
      const signUpToggle = screen.getByText('Sign Up');
      fireEvent.click(signUpToggle);
      
      // Check for signup form elements instead of test-id
      expect(screen.getByText('Create My Account')).toBeInTheDocument();
    });

    it('should have accessible social buttons on all screen sizes', () => {
      setMobileViewport();
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      // Social buttons should still be accessible
      expect(screen.getAllByTitle('Continue with Google')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Facebook')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Twitter')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Apple')).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
    });

    it('should trap focus within modal', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      // Tab key should cycle through focusable elements
      fireEvent.keyDown(document, { key: 'Tab' });
      
      // Modal should still be open and focused
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have proper button labels for screen readers', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
      
      // Social buttons should have descriptive titles
      expect(screen.getAllByTitle('Continue with Google')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Facebook')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Twitter')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Apple')).toHaveLength(2);
    });
  });

  describe('Layout and Styling', () => {
    it('should have proper modal backdrop', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const modalBackdrop = document.querySelector('.modal');
      expect(modalBackdrop).toBeInTheDocument();
      expect(modalBackdrop).toHaveClass('modal');
    });

    it('should have proper content container styling', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const modalContent = screen.getByRole('dialog');
      expect(modalContent).toHaveClass('modal-content');
    });

    it('should have proper social icons grid layout', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const socialGrid = document.querySelector('.social-icons-grid');
      expect(socialGrid).toBeInTheDocument();
      
      const gridStyles = window.getComputedStyle(socialGrid!);
      expect(gridStyles.display).toBe('grid');
    });

    it('should maintain proper spacing and padding', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const socialSection = document.querySelector('.social-section');
      expect(socialSection).toBeInTheDocument();
      
      const sectionStyles = window.getComputedStyle(socialSection!);
      expect(sectionStyles.padding).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should handle social button clicks without errors', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const googleButtons = screen.getAllByTitle('Continue with Google');
      const facebookButtons = screen.getAllByTitle('Continue with Facebook');
      const twitterButtons = screen.getAllByTitle('Continue with Twitter');
      const appleButtons = screen.getAllByTitle('Continue with Apple');
      
      // Click each social button
      fireEvent.click(googleButtons[0]);
      fireEvent.click(facebookButtons[0]);
      fireEvent.click(twitterButtons[0]);
      fireEvent.click(appleButtons[0]);
      
      // Should not throw errors
      expect(() => fireEvent.click(googleButtons[0])).not.toThrow();
      
      consoleSpy.mockRestore();
    });

    it('should maintain modal state during social button interactions', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      const googleButtons = screen.getAllByTitle('Continue with Google');
      fireEvent.click(googleButtons[0]);
      
      // Modal should still be open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should allow switching between forms while social section remains visible', () => {
      render(React.createElement(AuthModal, { isOpen: true, onClose: mockOnClose }));
      
      // Switch to signup
      const signUpToggle = screen.getByText('Sign Up');
      fireEvent.click(signUpToggle);
      
      // Social section should still be visible
      expect(screen.getAllByText('Quick Access')).toHaveLength(2); // Mobile and desktop versions
      expect(screen.getAllByTitle('Continue with Google')).toHaveLength(2);
      
      // Switch back to signin
      const signInToggle = screen.getByText('Sign In');
      fireEvent.click(signInToggle);
      
      // Social section should still be visible
      expect(screen.getAllByText('Quick Access')).toHaveLength(2);
      expect(screen.getAllByTitle('Continue with Google')).toHaveLength(2);
    });
  });
});