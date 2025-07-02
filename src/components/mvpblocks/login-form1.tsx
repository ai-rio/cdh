'use client'
import { useState } from 'react'

interface LoginForm1Props {
  onSubmit?: (data: { email: string; password: string }) => void
  onToggleToSignup?: () => void
}

export default function LoginForm1({ onSubmit, onToggleToSignup }: LoginForm1Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required.'
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return 'Please enter a valid email address.'
    }
    return ''
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required.'
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    setEmailError(emailValidation)
    setPasswordError(passwordValidation)

    if (emailValidation || passwordValidation) {
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Login successful:', { email, password })
      // In a real app, you'd handle successful login (e.g., redirect, close modal)
      if (onSubmit) {
        onSubmit({ email, password })
      }
    } catch (error) {
      setFormError('Login failed. Please check your credentials and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-white">Welcome Back, Commander</h3>
      <p className="text-gray-400 text-sm mt-1">
        Enter your credentials to access the constellation.
      </p>
      <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
        {formError && <p className="text-red-500 text-center text-sm">{formError}</p>}
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
              paddingLeft: '3.25rem',
            }}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError(validateEmail(e.target.value))
            }}
            onBlur={(e) => setEmailError(validateEmail(e.target.value))}
            onFocus={(e) => {
              if (!emailError) {
                e.target.style.borderColor = '#a3e635'
                e.target.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.2)'
              }
            }}
            onBlurCapture={(e) => {
              if (!emailError) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.target.style.boxShadow = 'none'
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
              transition: 'color 0.3s ease',
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
              paddingLeft: '3.25rem',
            }}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError(validatePassword(e.target.value))
            }}
            onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
            onFocus={(e) => {
              if (!passwordError) {
                e.target.style.borderColor = '#a3e635'
                e.target.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.2)'
              }
            }}
            onBlurCapture={(e) => {
              if (!passwordError) {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.target.style.boxShadow = 'none'
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
              transition: 'color 0.3s ease',
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
            transition: 'all 0.3s ease-in-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow =
              '0 0 25px rgba(163, 230, 53, 0.5), 0 0 50px rgba(163, 230, 53, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow =
              '0 0 15px rgba(163, 230, 53, 0.3), 0 0 30px rgba(163, 230, 53, 0.2)'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Launching...' : 'Launch Command Center'}
        </button>
      </form>
      <div className="flex items-center my-4">
        <div
          className="flex-grow border-t"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        ></div>
        <span className="flex-shrink mx-4 text-xs text-gray-500">OR</span>
        <div
          className="flex-grow border-t"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        ></div>
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
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.color = '#ffffff'
            e.currentTarget.style.borderColor = '#a3e635'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.color = '#e4e4e7'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
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
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.color = '#ffffff'
            e.currentTarget.style.borderColor = '#a3e635'
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(163, 230, 53, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.color = '#e4e4e7'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <i className="fab fa-apple text-2xl"></i>
        </button>
      </div>

      {/* Toggle to signup */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onToggleToSignup}
            style={{
              color: '#3B82F6',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Sign up
          </button>
        </span>
      </div>
    </div>
  )
}
