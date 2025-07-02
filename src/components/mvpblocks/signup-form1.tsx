'use client';
import { useState } from 'react';

interface SignupForm1Props {
  onSubmit?: (data: { name: string; email: string; password: string }) => void;
  onToggleToLogin?: () => void;
}

export default function SignupForm1({ onSubmit, onToggleToLogin }: SignupForm1Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateName = (name: string) => {
    if (!name) {
      return 'Name is required.';
    }
    if (name.length < 2) {
      return 'Name must be at least 2 characters.';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required.';
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setNameError(nameValidation);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (nameValidation || emailValidation || passwordValidation) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        onSubmit({ name, email, password });
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Signup successful:', { name, email, password });
        // In a real app, you'd handle successful signup (e.g., redirect, close modal)
      }
    } catch (error) {
      setFormError('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-white">Join the Constellation</h3>
      <p className="text-gray-400 text-sm mt-1">
        Create your account to begin your journey.
      </p>
      <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
        {formError && <p className="text-red-500 text-center text-sm">{formError}</p>}
        <div className="form-input-container">
          <input
            type="text"
            placeholder="Full Name"
            className={`form-input w-full p-3 rounded-lg text-white text-sm ${
              nameError ? 'border-red-500' : ''
            }`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: nameError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              paddingLeft: '3.25rem'
            }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(validateName(e.target.value));
            }}
            onBlur={(e) => setNameError(validateName(e.target.value))}
            onFocus={(e) => {
              if (!nameError) {
                e.target.style.borderColor = '#a3e635';
                e.target.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.2)';
              }
            }}
            onBlurCapture={(e) => {
              if (!nameError) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }
            }}
            required
          />
          <i 
            className="fas fa-user" 
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#71717a',
              transition: 'color 0.3s ease'
            }}
          ></i>
          {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
        </div>
        <div className="form-input-container">
          <input
            type="email"
            placeholder="Email Address"
            className={`form-input w-full p-3 rounded-lg text-white text-sm ${
              emailError ? 'border-red-500' : ''
            }`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: emailError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              paddingLeft: '3.25rem'
            }}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
            }}
            onBlur={(e) => setEmailError(validateEmail(e.target.value))}
            onFocus={(e) => {
              if (!emailError) {
                e.target.style.borderColor = '#a3e635';
                e.target.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.2)';
              }
            }}
            onBlurCapture={(e) => {
              if (!emailError) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }
            }}
            required
          />
          <i 
            className="fas fa-envelope" 
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#71717a',
              transition: 'color 0.3s ease'
            }}
          ></i>
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>
        <div className="form-input-container">
          <input
            type="password"
            placeholder="Password"
            className={`form-input w-full p-3 rounded-lg text-white text-sm ${
              passwordError ? 'border-red-500' : ''
            }`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: passwordError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              paddingLeft: '3.25rem'
            }}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(validatePassword(e.target.value));
            }}
            onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
            onFocus={(e) => {
              if (!passwordError) {
                e.target.style.borderColor = '#a3e635';
                e.target.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.2)';
              }
            }}
            onBlurCapture={(e) => {
              if (!passwordError) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }
            }}
            required
          />
          <i 
            className="fas fa-lock" 
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#71717a',
              transition: 'color 0.3s ease'
            }}
          ></i>
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </div>
        <button
          type="submit"
          className="w-full font-bold p-3 rounded-lg mt-2"
          style={{
            background: '#a3e635',
            color: '#111',
            boxShadow: '0 0 15px rgba(163, 230, 53, 0.3), 0 0 30px rgba(163, 230, 53, 0.2)',
            transition: 'all 0.3s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(163, 230, 53, 0.5), 0 0 50px rgba(163, 230, 53, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.3), 0 0 30px rgba(163, 230, 53, 0.2)';
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Launching...' : 'Launch My Journey'}
        </button>
      </form>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></div>
        <span className="flex-shrink mx-4 text-xs text-gray-500">OR</span>
        <div className="flex-grow border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></div>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <button 
          className="social-icon-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            color: '#e4e4e7',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#a3e635';
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#e4e4e7';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <i className="fab fa-google text-xl"></i>
        </button>
        <button 
          className="social-icon-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            color: '#e4e4e7',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#a3e635';
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#e4e4e7';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <i className="fab fa-apple text-2xl"></i>
        </button>
      </div>
      
      {/* Terms of service */}
      <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
        <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
          By signing up, you agree to our{' '}
          <a
            href="/terms"
            style={{
              color: '#3B82F6',
              textDecoration: 'underline'
            }}
          >
            Terms of Service
          </a>
        </span>
      </div>
      
      {/* Toggle to login */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleToLogin}
            style={{
              color: '#3B82F6',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Sign in
          </button>
        </span>
      </div>
    </div>
  );
}
