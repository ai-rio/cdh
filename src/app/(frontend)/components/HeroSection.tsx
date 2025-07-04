'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EarlyAccessModal } from './EarlyAccessModal'

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className = '' }: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRequestAccess = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      {/* The main section is a flex container to center the card */}
      <section
        className={`hero-section flex items-center justify-center text-center ${className}`}
        id="hero-section"
      >
        {/* --- CORRECTED CARD STRUCTURE --- */}
        {/* This div is now a flex column to center its children (h2, p, button) */}
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col items-center gap-8 max-w-4xl">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            Your Creator Business, Under Command.
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
            Stop chasing data. Start seeing the connections. CDH turns your entire operation into
            one clear, interactive view—moving you beyond spreadsheet chaos and towards professional
            clarity.
          </p>
          <Button
            onClick={handleRequestAccess}
            className="cta-glow bg-[#EEFC97] text-[#1D1F04] font-bold text-lg px-8 py-4 rounded-xl hover:bg-[#EEFC97]/90 transition-all duration-300"
          >
            Request Early Access
          </Button>
        </div>
      </section>

      <EarlyAccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
