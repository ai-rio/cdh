'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface FoundersKeyCardProps {
  onClaimOffer: () => void
}

export function FoundersKeyCard({ onClaimOffer }: FoundersKeyCardProps) {
  const [countdown, setCountdown] = useState('72:00:00')

  useEffect(() => {
    // Set end time to 72 hours from now
    const endTime = new Date().getTime() + 72 * 3600 * 1000
    
    const timerInterval = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime - now
      
      if (distance < 0) {
        clearInterval(timerInterval)
        setCountdown('00:00:00')
        return
      }

      const hours = Math.floor(distance / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      
      setCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [])

  return (
    <div className="founders-key-card p-8 rounded-2xl mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">
        Join the <span className="text-lime-300">Founder&apos;s Circle</span>
      </h2>
      <p className="text-lg text-gray-300 mt-2">A one-time offer for the pioneers.</p>
      
      <div className="my-6">
        <p className="text-xl font-semibold text-gray-300">
          Get <strong className="text-white">50% OFF</strong> the Business Plan.{' '}
          <strong className="text-white">Forever.</strong>
        </p>
      </div>
      
      <div className="flex justify-center items-center space-x-4">
        <p className="text-gray-400 font-semibold">Offer ends in:</p>
        <div className="countdown-timer text-2xl font-bold text-lime-300">
          <span>{countdown}</span>
        </div>
      </div>
      
      <Button
        onClick={onClaimOffer}
        className="mt-8 w-full max-w-sm mx-auto cta-glow bg-[#EEFC97] text-[#1D1F04] font-bold text-lg p-4 rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-[0_0_25px_rgba(238,252,151,0.5),0_0_50px_rgba(238,252,151,0.3)]"
      >
        Claim My Founder&apos;s Key
      </Button>
    </div>
  )
}