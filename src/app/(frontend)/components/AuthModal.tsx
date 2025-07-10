'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null); // New state for validation errors

  const { user, login, register, isLoading, error, isInitialized } = useAuth(); // Integrate useAuth hook
  const router = useRouter(); // Initialize useRouter

  // Debug logging
  useEffect(() => {
    if (user && isInitialized) {
      console.log('AuthModal: User authenticated, preparing to redirect', { 
        userId: user.id, 
        email: user.email,
        routerAvailable: !!router 
      });
    }
  }, [user, isInitialized, router]);

  // Effect to handle modal closure after successful login/registration
  // Let the parent component or middleware handle the redirect
  useEffect(() => {
    if (user && isInitialized) {
      console.log('AuthModal: User authenticated, closing modal', { 
        userId: user.id, 
        email: user.email
      });

      // Just close the modal, let the app handle navigation naturally
      const timeoutId = setTimeout(() => {
        onClose();
      }, 500); // Small delay to show success state

      return () => clearTimeout(timeoutId);
    }
  }, [user, isInitialized, onClose]);

  // Effect to clear validation errors and reset form when modal opens
  useEffect(() => {
    setValidationError(null);
    if (isOpen) {
      // Reset form fields when modal opens
      setEmail('');
      setPassword('');
      setName('');
    }
  }, [isOpen]);

  // Effect to clear validation errors when form type changes
  useEffect(() => {
    setValidationError(null);
    // Clear form fields when switching between sign in and sign up
    setEmail('');
    setPassword('');
    setName('');
  }, [isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => { // Make handleSubmit async
    e.preventDefault();
    setValidationError(null); // Clear previous validation errors

    // Enhanced client-side validation
    if (!email || !password || (isSignUp && !name)) {
      setValidationError('All fields are required.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    
    // Password validation
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }
    
    if (isSignUp) {
      // Additional validation for sign up
      if (name.trim().length < 2) {
        setValidationError('Name must be at least 2 characters long.');
        return;
      }
      
      // Password strength validation for sign up
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        setValidationError('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
        return;
      }
    }

    try {
      if (isSignUp) {
        await register(name.trim(), email.toLowerCase().trim(), password);
      } else {
        await login(email.toLowerCase().trim(), password);
      }
    } catch (err) {
      // Error is already handled in AuthContext, but we can add additional handling here if needed
      console.error('Authentication error:', err);
    }
  };
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the first focusable element when modal opens
      firstFocusableElementRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      }

      // Tab key handling for focus trapping
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* FontAwesome CDN for icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
      
      {/* Modal styles */}
      <style>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(17, 17, 17, 0.8);
          z-index: 200;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }
        
        .modal.open {
          opacity: 1;
          pointer-events: auto;
        }
        
        .modal-content {
          background-color: #111111;
          border-radius: 1.5rem;
          padding: 1rem;
          width: 90%;
          max-width: 800px;
          transform: scale(0.95);
          transition: transform 0.5s ease;
          position: relative;
          border: 1px solid transparent;
          background-clip: padding-box;
          overflow: visible; /* Changed from hidden to visible */
        }
        
        .modal-content::before {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          z-index: -1;
          margin: -1px;
          border-radius: inherit;
          background: radial-gradient(ellipse at center, rgba(163, 230, 53, 0.3) 0%, transparent 70%);
        }
        
        .modal.open .modal-content {
          transform: scale(1);
        }
        
        .form-input-container {
          position: relative;
        }
        
        .form-input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
          transition: color 0.3s ease;
          font-size: 0.875rem;
        }
        
        .form-input {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          padding-left: 3.25rem;
        }
        
        .form-input:focus {
          border-color: #a3e635;
          outline: none;
          box-shadow: 0 0 15px rgba(163, 230, 53, 0.2);
        }
        
        .form-input:focus + .form-input-icon {
          color: #a3e635;
        }
        
        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .auth-toggle-bg {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .auth-toggle-button {
          transition: color 0.3s ease;
        }
        
        .auth-toggle-button.active {
          color: #111111;
        }
        
        .auth-toggle-slider {
          transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        
        .social-login-btn {
          background-color: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          height: 2.5rem;
        }
        
        .social-login-btn:hover {
          background-color: rgba(255,255,255,0.1);
          border-color: #a3e635;
        }
        
        .auth-form-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .auth-form-container {
            grid-template-columns: 1fr 1px 300px;
            gap: 2rem;
          }
          
          .modal-content {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 767px) {
          .modal-content {
            padding: 1rem;
          }
          
          .auth-form-container {
            gap: 1rem;
            grid-template-columns: 1fr;
          }
          
          .form-input {
            height: 2.5rem;
            font-size: 0.75rem;
            padding: 0.5rem 0.75rem 0.5rem 2.5rem;
          }
          
          .auth-toggle-bg {
            height: 2.5rem;
            margin-bottom: 1rem;
          }
          
          .auth-toggle-button {
            font-size: 0.75rem;
            padding: 0.4rem;
          }
          
          .form-input-icon {
            left: 0.75rem;
            font-size: 0.875rem;
          }
          
          .signin-view, .signup-view {
          padding: 2rem;
        }
        }
        
        .signin-view, .signup-view {
          transition: opacity 0.4s ease, transform 0.4s ease;
          opacity: 1;
          transform: translateX(0);
          position: relative;
        }
        
        .signin-view.hidden-form, .signup-view.hidden-form {
          opacity: 0;
          transform: translateX(20px);
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }
        
        .signin-view.hidden-form.from-left, .signup-view.hidden-form.from-left {
          transform: translateX(-20px);
        }
        
        .form-container-wrapper {
          position: relative;
          height: auto;
        }
        
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 9999;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 1.25rem;
          font-weight: bold;
          line-height: 1;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          pointer-events: auto;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
          transform: scale(1.05);
        }
        
        .close-btn:focus {
          outline: 2px solid #a3e635;
          outline-offset: 2px;
        }
        
        .close-btn:active {
          transform: scale(0.95);
        }
        
        .form-input {
          color: white;
          outline: none;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem 0.5rem 2.5rem;
          width: 100%;
          font-size: 0.75rem;
          height: 2.5rem;
        }
        
        .auth-toggle-bg {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 0.2rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          position: relative;
          height: 2.5rem;
        }
        
        .auth-toggle-slider {
          position: absolute;
          top: 0.25rem;
          left: 0.25rem;
          height: calc(100% - 0.5rem);
          width: calc(50% - 0.25rem);
          background: #a3e635;
          border-radius: 9999px;
          transform: translateX(0);
        }
        
        .auth-toggle-slider.signup {
          transform: translateX(100%);
        }
        
        .auth-toggle-button {
          width: 50%;
          padding: 0.4rem;
          border-radius: 9999px;
          position: relative;
          z-index: 10;
          font-weight: 600;
          font-size: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
        }
        
        .social-icon-btn {
          background-color: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.875rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
        }
        
        .social-icon-btn:hover {
          background-color: rgba(255,255,255,0.1);
          border-color: #a3e635;
        }
        
        .cta-glow {
          background: linear-gradient(135deg, #a3e635 0%, #84cc16 100%);
          border: none;
          border-radius: 0.75rem;
          padding: 0.875rem 1.5rem;
          color: #111111;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        
        .cta-glow:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(163, 230, 53, 0.3);
        }
        
        .cta-glow:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .cta-glow:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .divider {
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
          margin: 0 2rem;
        }
        
        .signin-view, .signup-view {
          padding: 2rem;
        }
        
        .signin-view h2, .signup-view h2 {
          color: white;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .social-login {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        
        .social-login .social-icon-btn {
          flex: 1;
        }
        
        .terms-text {
          font-size: 0.625rem;
          color: #9ca3af;
          text-align: center;
          margin-top: 0.5rem;
          line-height: 1.3;
        }
        
        .terms-text a {
          color: #a3e635;
          text-decoration: none;
        }
        
        .terms-text a:hover {
          text-decoration: underline;
        }
        
        .social-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          height: 100%;
        }
        
        .mobile-social {
          display: none;
        }
        
        .desktop-social {
          display: block;
        }
        
        .social-section h3 {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .social-icons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          width: 100%;
          max-width: 200px;
        }
        
        .social-icon-btn {
          background-color: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 1rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          aspect-ratio: 1;
        }
        
        .social-icon-btn:hover {
          background-color: rgba(255,255,255,0.1);
          border-color: #a3e635;
          transform: translateY(-2px);
        }
        
        .social-icon-btn.google:hover {
          border-color: #ea4335;
        }
        
        .social-icon-btn.facebook:hover {
          border-color: #1877f2;
        }
        
        .social-icon-btn.twitter:hover {
          border-color: #1da1f2;
        }
        
        .social-icon-btn.apple:hover {
          border-color: #ffffff;
        }
        
        @media (max-width: 767px) {
           .mobile-social {
             display: block;
             padding: 1rem;
             margin-top: 1rem;
           }
           
           .desktop-social {
             display: none;
           }
           
           .social-section h3 {
             font-size: 1.125rem;
             margin-bottom: 1.5rem;
           }
           
           .social-icons-grid {
             grid-template-columns: 1fr 1fr;
             gap: 1rem;
             max-width: 200px;
           }
           
           .social-icon-btn {
             padding: 0.875rem;
             font-size: 1.125rem;
           }
           
           .divider {
             display: none;
           }
         }
      `}</style>
      
      <div 
        className={`modal ${isOpen ? 'open' : ''}`}
        onClick={(e) => {
          // Only close modal when clicking directly on the backdrop (not on child elements)
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div 
          ref={modalRef}
          className="modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          onClick={(e) => {
            // Prevent backdrop click when clicking inside modal content
            e.stopPropagation();
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="close-btn"
            aria-label="Close authentication modal"
            title="Close"
            type="button"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 9999,
              pointerEvents: 'auto'
            }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ pointerEvents: 'none' }}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="auth-form-container">
            {/* Left Column - Toggle and Forms */}
            <div>
              {/* Toggle Switch */}
              <div className="auth-toggle-bg">
                <div className={`auth-toggle-slider ${isSignUp ? 'signup' : ''}`}></div>
                <button
                  ref={firstFocusableElementRef}
                  onClick={() => setIsSignUp(false)}
                  className={`auth-toggle-button ${!isSignUp ? 'active' : ''}`}
                  disabled={isLoading}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`auth-toggle-button ${isSignUp ? 'active' : ''}`}
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </div>
              
              {/* Forms Container */}
              <div className="form-container-wrapper">
                {/* Sign In Form */}
                <div className={`signin-view ${isSignUp ? 'hidden-form from-left' : ''}`}>
                  <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Welcome Back, Commander</h2>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(error || validationError) && (
                      <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                        {error || validationError}
                      </p>
                    )}
                    <div className="form-group">
                      <div className="form-input-container">
                        <i className="fas fa-envelope form-input-icon"></i>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <div className="form-input-container">
                        <i className="fas fa-lock form-input-icon"></i>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="cta-glow" style={{padding: '0.75rem', fontSize: '0.875rem', height: '2.75rem'}} disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Launch Command Center'}
                    </button>
                  </form>
                </div>
                <div className={`signup-view ${!isSignUp ? 'hidden-form' : ''}`}>
                  <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Join the Constellation</h2>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(error || validationError) && (
                      <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
                        {error || validationError}
                      </p>
                    )}
                    <div className="form-group">
                      <div className="form-input-container">
                        <i className="fas fa-user form-input-icon"></i>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <div className="form-input-container">
                        <i className="fas fa-envelope form-input-icon"></i>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <div className="form-input-container">
                        <i className="fas fa-lock form-input-icon"></i>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Password (8+ chars, uppercase, lowercase, number)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="cta-glow" style={{padding: '0.75rem', fontSize: '0.875rem', height: '2.75rem'}} disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Create My Account'}
                    </button>
                    
                    <p className="terms-text">
                      By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </p>
                  </form>
                </div>
              </div>
              
              {/* Mobile Social Login - Below Forms */}
              <div className="social-section mobile-social">
                <h3>Quick Access</h3>
                <div className="social-icons-grid">
                  <button className="social-icon-btn google" title="Continue with Google" disabled={isLoading}>
                    <i className="fab fa-google"></i>
                  </button>
                  <button className="social-icon-btn facebook" title="Continue with Facebook" disabled={isLoading}>
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button className="social-icon-btn twitter" title="Continue with Twitter" disabled={isLoading}>
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button className="social-icon-btn apple" title="Continue with Apple" disabled={isLoading}>
                    <i className="fab fa-apple"></i>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="divider"></div>
            
            {/* Right Column - Social Login (Desktop) */}
            <div className="social-section desktop-social">
              <h3>Quick Access</h3>
              <div className="social-icons-grid">
                <button className="social-icon-btn google" title="Continue with Google" disabled={isLoading}>
                  <i className="fab fa-google"></i>
                </button>
                <button className="social-icon-btn facebook" title="Continue with Facebook" disabled={isLoading}>
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="social-icon-btn twitter" title="Continue with Twitter" disabled={isLoading}>
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="social-icon-btn apple" title="Continue with Apple" disabled={isLoading}>
                  <i className="fab fa-apple"></i>
                </button>
              </div>
            </div>
          </div>
          
          <button
            ref={lastFocusableElementRef}
            className="sr-only"
            onFocus={() => firstFocusableElementRef.current?.focus()}
          >
            Focus trap
          </button>
        </div>
      </div>
    </>
  );
}
