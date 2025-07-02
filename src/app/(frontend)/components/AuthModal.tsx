'use client';
import { useEffect, useRef, useState } from 'react';
import LoginForm1 from '@/components/mvpblocks/login-form1';
import SignupForm1 from '@/components/mvpblocks/signup-form1';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (isSignUp) {
      console.log('Sign up:', { email, password, name });
    } else {
      console.log('Sign in:', { email, password });
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
          border-radius: 0;
          padding: 1rem;
          width: 100vw;
          height: 100vh;
          transform: scale(0.95);
          transition: transform 0.5s ease;
          position: relative;
          border: none;
          background-clip: padding-box;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
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
          height: 100%;
          max-height: calc(100vh - 2rem);
        }
        
        @media (min-width: 768px) {
          .auth-form-container {
            grid-template-columns: 1fr 1px 1fr;
            gap: 2rem;
          }
          
          .modal-content {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 767px) {
          .modal-content {
            padding: 0.75rem;
          }
          
          .auth-form-container {
            gap: 0.75rem;
            max-height: calc(100vh - 1.5rem);
          }
          
          .form-input {
            height: 2.25rem;
            font-size: 0.7rem;
            padding: 0.4rem 0.6rem 0.4rem 2.25rem;
          }
          
          .auth-toggle-bg {
            height: 2.25rem;
            margin-bottom: 0.75rem;
          }
          
          .auth-toggle-button {
            font-size: 0.7rem;
            padding: 0.3rem;
          }
          
          .form-input-icon {
            left: 0.6rem;
            font-size: 0.8rem;
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
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: none;
          color: rgba(156, 163, 175, 1);
          cursor: pointer;
          transition: color 0.3s ease;
          z-index: 20;
          padding: 0.5rem;
        }
        
        .close-btn:hover {
          color: white;
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
        
        .cta-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(163, 230, 53, 0.3);
        }
        
        .cta-glow:active {
          transform: translateY(0);
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
      `}</style>
      
      <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div 
          ref={modalRef}
          className="modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          <button
            onClick={onClose}
            className="close-btn"
            aria-label="Close modal"
          >
            ×
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
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`auth-toggle-button ${isSignUp ? 'active' : ''}`}
                >
                  Sign Up
                </button>
              </div>
              
              {/* Forms Container */}
              <div className="form-container-wrapper">
                {/* Sign In Form */}
                <div className={`signin-view ${isSignUp ? 'hidden-form from-left' : ''}`}>
                  <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Welcome Back, Commander</h2>
                  <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <div className="form-input-container">
                        <i className="fas fa-envelope form-input-icon"></i>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                          required
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="cta-glow" onClick={handleSubmit} style={{padding: '0.75rem', fontSize: '0.875rem', height: '2.75rem'}}>
                      Launch Command Center
                    </button>
                  </form>
                </div>
                
                {/* Sign Up Form */}
                <div className={`signup-view ${!isSignUp ? 'hidden-form' : ''}`}>
                  <h2 style={{fontSize: '1.25rem', marginBottom: '1rem'}}>Join the Constellation</h2>
                  <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <div className="form-input-container">
                        <i className="fas fa-user form-input-icon"></i>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                          required
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="cta-glow" onClick={handleSubmit} style={{padding: '0.75rem', fontSize: '0.875rem', height: '2.75rem'}}>
                      Create My Account
                    </button>
                    
                    <p className="terms-text">
                      By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="divider"></div>
            
            {/* Right Column - Social Login */}
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem'}}>
              <div style={{textAlign: 'center', marginBottom: '1rem'}}>
                <h3 style={{color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem'}}>Quick Access</h3>
                <p style={{color: '#9ca3af', fontSize: '0.75rem'}}>Social login</p>
              </div>
              
              <div style={{display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '200px'}}>
                <button type="button" className="social-login-btn" onClick={() => console.log('Google login')} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                  <i className="fab fa-google" style={{fontSize: '1.125rem'}}></i>
                </button>
                <button type="button" className="social-login-btn" onClick={() => console.log('Apple login')} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                  <i className="fab fa-apple" style={{fontSize: '1.25rem'}}></i>
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
