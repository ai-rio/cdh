'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EarlyAccessModal } from './EarlyAccessModal'

interface CTASectionProps {
  className?: string
}

export function CTASection({ className = '' }: CTASectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRequestAccess = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <section className={`content-section ${className}`}>
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          <div className="bg-black/30 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Creator Business?
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Experience the power of organized deals, clear finances, and intelligent insights. 
              Join the waitlist and be among the first to access our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleRequestAccess}
                size="lg" 
                className="bg-lime-400 hover:bg-lime-500 text-black font-bold px-8 py-3 text-lg cta-glow"
              >
                Request Early Access
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      <EarlyAccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

export default CTASection
