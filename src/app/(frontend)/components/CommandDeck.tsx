import React from 'react';

interface CommandDeckProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: () => void;
}

export function CommandDeck({ isOpen, onClose, onOpenAuthModal }: CommandDeckProps) {
  if (!isOpen) return null;

  return (
    <div id="command-deck" className={`command-deck ${isOpen ? 'open' : ''}`}>
      <button
        id="command-deck-close"
        className="absolute top-8 right-8 p-2 text-gray-400 hover:text-white"
        aria-label="Close navigation menu"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8 max-w-7xl mx-auto text-center">
          <a href="/blog" className="nav-card">
            <h3 className="text-xl font-bold mb-2">Blog</h3>
            <p className="text-gray-300 text-sm">
              Insights and strategies from the forefront of the creator economy.
            </p>
          </a>
          <a href="/pricing" className="nav-card">
            <h3 className="text-xl font-bold mb-2">Pricing</h3>
            <p className="text-gray-300 text-sm">
              Simple, transparent plans that scale with your success.
            </p>
          </a>
          <a href="/about" className="nav-card">
            <h3 className="text-xl font-bold mb-2">About Us</h3>
            <p className="text-gray-300 text-sm">
              Learn about our mission to empower professional creators.
            </p>
          </a>
          <button 
            id="auth-modal-trigger" 
            className="nav-card text-left"
            onClick={() => {
              onOpenAuthModal?.();
              onClose(); // Close command deck when opening auth modal
            }}
          >
            <h3 className="text-xl font-bold mb-2">Login</h3>
            <p className="text-gray-300 text-sm">Access your Creator&apos;s Deal Hub account.</p>
          </button>
        </div>
    </div>
  );
}