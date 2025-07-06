import React from 'react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'

interface CommandDeckProps {
  isOpen: boolean
  onClose: () => void
  onOpenAuthModal?: () => void
}

export function CommandDeck({ isOpen, onClose, onOpenAuthModal }: CommandDeckProps) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Close (X) Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-50 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 rounded-lg p-2 w-10 h-10 flex items-center justify-center backdrop-blur-sm"
        aria-label="Close navigation menu"
        title="Close"
        type="button"
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8 max-w-7xl mx-auto text-center">
        <Link
          href="/blog"
          className="nav-card bg-white/5 border border-white/10 rounded-xl p-8 w-[90%] max-w-[280px] hover:bg-white/10 hover:border-lime-400/50 transition-all duration-300 hover:transform hover:-translate-y-1"
          onClick={onClose}
        >
          <h3 className="text-xl font-bold mb-2 text-lime-400">Blog</h3>
          <p className="text-gray-300 text-sm">
            Insights and strategies from the forefront of the creator economy.
          </p>
        </Link>
        <Link
          href="/pricing"
          className="nav-card bg-white/5 border border-white/10 rounded-xl p-8 w-[90%] max-w-[280px] hover:bg-white/10 hover:border-lime-400/50 transition-all duration-300 hover:transform hover:-translate-y-1"
          onClick={onClose}
        >
          <h3 className="text-xl font-bold mb-2 text-lime-400">Pricing</h3>
          <p className="text-gray-300 text-sm">
            Simple, transparent plans that scale with your success.
          </p>
        </Link>
        <Link
          href="/about"
          className="nav-card bg-white/5 border border-white/10 rounded-xl p-8 w-[90%] max-w-[280px] hover:bg-white/10 hover:border-lime-400/50 transition-all duration-300 hover:transform hover:-translate-y-1"
          onClick={onClose}
        >
          <h3 className="text-xl font-bold mb-2 text-lime-400">About Us</h3>
          <p className="text-gray-300 text-sm">
            Learn about our mission to empower professional creators.
          </p>
        </Link>
        <button
          className="nav-card text-left bg-white/5 border border-white/10 rounded-xl p-8 w-[90%] max-w-[280px] hover:bg-white/10 hover:border-lime-400/50 transition-all duration-300 hover:transform hover:-translate-y-1"
          onClick={() => {
            onOpenAuthModal?.()
            onClose()
          }}
        >
          <h3 className="text-xl font-bold mb-2 text-lime-400">Login</h3>
          <p className="text-gray-300 text-sm">Access your Creator&apos;s Deal Hub account.</p>
        </button>
      </div>
    </div>
  )
}
