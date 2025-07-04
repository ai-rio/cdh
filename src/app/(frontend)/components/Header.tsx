'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CommandDeck } from './CommandDeck'
import AuthModal from './AuthModal'

export function Header() {
  const [isCommandDeckOpen, setIsCommandDeckOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header className="mission-control-hud">
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
            <span className="font-bold text-xl text-white">CDH </span>
          </Link>
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
