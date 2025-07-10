'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CommandDeck } from './CommandDeck'
import AuthModal from './AuthModal'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [isCommandDeckOpen, setIsCommandDeckOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(false) // New state for header visibility
  const pathname = usePathname()
  const { user, isInitialized, logout } = useAuth()

  const handleDashboardClick = () => {
    try {
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleLogout = () => {
    try {
      logout();
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback logout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderVisible(true)
      } else {
        setIsHeaderVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 p-1 z-50 main-header bg-black/20 backdrop-blur-xl ${isHeaderVisible ? 'visible' : ''} mission-control-hud`}>
        <nav className="p-4 w-full max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="logo-circle"
                d="M16 2.66663C8.63636 2.66663 2.66669 8.63632 2.66669 16C2.66669 23.3636 8.63636 29.3333 16 29.3333C23.3637 29.3333 29.3334 23.3636 29.3334 16C29.3334 8.63632 23.3637 2.66663 16 2.66663Z"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                id="logo-cross-1"
                d="M21.3333 10.6667L10.6667 21.3334"
                stroke="#A3E635"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                id="logo-cross-2"
                d="M10.6667 10.6667L21.3333 21.3334"
                stroke="#A3E635"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-bold text-lg text-white">CDH </span>
          </Link>
          
          {/* Dashboard link and logout for authenticated users */}
          {user && isInitialized && (
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={handleDashboardClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-lime-600/20 hover:bg-lime-600/30 transition-colors border border-lime-600/30"
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
                  className="text-lime-400"
                >
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span className="text-lime-400 font-medium">Dashboard</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors border border-red-600/30"
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
                  className="text-red-400"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span className="text-red-400 font-medium">Logout</span>
              </button>
            </div>
          )}
          
          {pathname === '/' && (
            <div className="hidden md:flex items-center space-x-8">
              <div
                className="hud-item cursor-pointer"
                onClick={() => scrollToSection('deals-section')}
                data-target="#deals-section"
              >
                <div className="hud-label">Deals</div>
                <div className="hud-value">12</div>
              </div>
              <div
                className="hud-item cursor-pointer"
                onClick={() => scrollToSection('finance-section')}
                data-target="#finance-section"
              >
                <div className="hud-label">Finance</div>
                <div className="hud-value overdue">3</div>
              </div>
              <div
                className="hud-item cursor-pointer"
                onClick={() => scrollToSection('contacts-section')}
                data-target="#contacts-section"
              >
                <div className="hud-label">Contacts</div>
                <div className="hud-value">47</div>
              </div>
            </div>
          )}
          <button
            id="command-deck-toggle"
            className="p-2 rounded-md hover:bg-white/10"
            onClick={() => setIsCommandDeckOpen(!isCommandDeckOpen)}
            aria-label="Open navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </nav>
      </header>
      <CommandDeck
        isOpen={isCommandDeckOpen}
        onClose={() => setIsCommandDeckOpen(false)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
