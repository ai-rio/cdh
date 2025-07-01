import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EarlyAccessModal({ isOpen, onClose }: EarlyAccessModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Hide form with fade out
    setFormVisible(false);
    
    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div
      id="early-access-modal"
      className={`modal ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="early-access-modal-title"
      tabIndex={-1}
      ref={modalRef}
    >
      <div className="modal-content overflow-hidden max-w-md mx-auto">
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

        <div 
          id="form-content" 
          className={`transition-opacity duration-500 ${formVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ display: showSuccess ? 'none' : 'block' }}
        >
          <div className="p-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Join the Waitlist
            </h2>
            <p className="text-gray-400 mb-8">
              Be the first to get access and redefine your business.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-4 rounded-lg text-white bg-white/5 border-white/10 placeholder-gray-400"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-4 rounded-lg text-white bg-white/5 border-white/10 placeholder-gray-400"
                  placeholder="Your Email Address"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !email || !name}
                className="w-full cta-glow bg-[#EEFC97] text-[#1D1F04] font-bold text-lg p-4 rounded-lg hover:bg-[#EEFC97]/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Securing...' : 'Secure My Spot'}
              </Button>
            </form>
          </div>
        </div>

        <div 
          id="success-message" 
          className={`transition-opacity duration-500 ${showSuccess ? 'opacity-100' : 'opacity-0 hidden'}`}
        >
          <div className="p-6 text-center">
            <svg
              className="w-16 h-16 mx-auto text-[#EEFC97]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-3xl font-bold text-white mt-4 mb-2">
              Welcome to the Command Center.
            </h2>
            <p className="text-gray-300">
              Your access is confirmed. We&apos;ll be in touch shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}