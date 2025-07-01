import React, { useState } from 'react';

export default function SignupForm1() {
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Signup successful:', { name, email, password });
      // In a real app, you'd handle successful signup (e.g., redirect, close modal)
    } catch (error) {
      setFormError('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-center mb-6">
      <h3 id="auth-modal-title" className="text-2xl font-bold text-white">Join the Constellation</h3>
      <p className="text-gray-400 text-sm mt-1">
        Create your account to map your business universe.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {formError && <p className="text-red-500 text-center text-sm">{formError}</p>}
        <div>
          <input
            type="text"
            placeholder="Your Name"
            className={`form-input w-full p-3 rounded-lg text-white text-sm ${nameError ? 'border-red-500' : ''}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(validateName(e.target.value));
            }}
            onBlur={(e) => setNameError(validateName(e.target.value))}
            required
          />
          {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            className={`form-input w-full p-3 rounded-lg text-white text-sm ${emailError ? 'border-red-500' : ''}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
            }}
            onBlur={(e) => setEmailError(validateEmail(e.target.value))}
            required
          />
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className={`form-input w-full p-3 rounded-lg text-white text-sm ${passwordError ? 'border-red-500' : ''}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(validatePassword(e.target.value));
            }}
            onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
            required
          />
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </div>
        <button
          type="submit"
          className="w-full cta-glow bg-[#EEFC97] text-[#1D1F04] font-bold p-3 rounded-lg mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create My Account'}
        </button>
      </form>
      <p className="text-xs text-center text-gray-500 mt-4">
        By signing up, you agree to our Terms of Service.
      </p>
    </div>
  );
}
