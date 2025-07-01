import React, { useState, useEffect, useRef } from 'react';
import LoginForm1 from '@/components/mvpblocks/login-form1';
import SignupForm1 from '@/components/mvpblocks/signup-form1';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignInView, setIsSignInView] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Store the currently focused element when the modal opens
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      // Focus the first interactive element inside the modal
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 0);
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      // Return focus to the element that triggered the modal
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="auth-modal"
      className={`modal ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      tabIndex={-1} // Make the modal focusable for initial focus
      ref={modalRef}
    >
      <div className="modal-content overflow-hidden">
        <button
          className="modal-close-btn absolute top-4 right-4 p-2 text-gray-500 hover:text-white"
          aria-label="Close form"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="relative auth-toggle-bg p-1 rounded-full flex items-center mb-6">
          <div
            className="auth-toggle-slider absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-[#EEFC97] rounded-full"
            style={{ transform: isSignInView ? 'translateX(0%)' : 'translateX(100%)' }}
          ></div>
          <button
            data-auth-view="signin"
            className={`auth-toggle-button w-1/2 p-2 rounded-full relative z-10 font-semibold text-sm ${isSignInView ? 'active text-[#111111]' : 'text-gray-300'}`}
            onClick={() => setIsSignInView(true)}
          >
            Sign In
          </button>
          <button
            data-auth-view="signup"
            className={`auth-toggle-button w-1/2 p-2 rounded-full relative z-10 font-semibold text-sm ${!isSignInView ? 'active text-[#111111]' : 'text-gray-300'}`}
            onClick={() => setIsSignInView(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="relative min-h-[360px]">
          <div className={`auth-form-view ${isSignInView ? '' : 'hidden-form'}`}>
            <LoginForm1 />
          </div>
          <div className={`auth-form-view ${!isSignInView ? '' : 'hidden-form'}`}>
            <SignupForm1 />
          </div>
        </div>
      </div>
    </div>
  );
}
