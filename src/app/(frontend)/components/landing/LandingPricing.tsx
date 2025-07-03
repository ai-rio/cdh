'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useWaitlistModal } from '@/lib/stores/waitlist-modal-store'

export default function LandingPricing() {
  const { openModal } = useWaitlistModal()

  return (
    <section id="pricing-section" className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
          Choose Your Plan
        </h2>
        <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
          Start your creator business journey with the right tools for your needs
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Creator Plan */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-white">Creator</h3>
              <div className="mb-6">
                <p className="text-4xl font-bold text-lime-400">$29</p>
                <p className="text-gray-400">/month</p>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  Deal tracking & management
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  Basic analytics dashboard
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  Email support
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  Up to 10 active deals
                </li>
              </ul>
              <Button 
                className="w-full bg-lime-400 text-black font-bold hover:bg-lime-300 transition-colors duration-200"
                onClick={openModal}
              >
                Join Waitlist
              </Button>
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card className="bg-black/20 border-lime-400/50 backdrop-blur-xl hover:border-lime-400/70 transition-all duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-lime-400 text-black text-sm font-bold px-4 py-2 rounded-full">
                MOST POPULAR
              </div>
            </div>
            <CardContent className="p-8 pt-12">
              <h3 className="text-2xl font-bold mb-4 text-white">Business</h3>
              <div className="mb-6">
                <p className="text-4xl font-bold text-lime-400">$99</p>
                <p className="text-gray-400">/month</p>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  Everything in Creator
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  AI-powered insights & recommendations
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  Advanced analytics & reporting
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  Priority support & onboarding
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  Unlimited deals
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-lime-400 mr-3 text-lg">✓</span>
                  Custom integrations
                </li>
              </ul>
              <Button 
                className="w-full bg-lime-400 text-black font-bold hover:bg-lime-300 transition-colors duration-200"
                onClick={openModal}
              >
                Join Waitlist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}