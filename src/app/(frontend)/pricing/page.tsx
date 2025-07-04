'use client'

import React, { useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { StarfieldCanvas } from '../components/StarfieldCanvas'
import { FoundersKeyCard } from '../components/FoundersKeyCard'
import { PricingCard } from '../components/PricingCard'
import { BillingToggle } from '../components/BillingToggle'
import { EarlyAccessModal } from '../components/EarlyAccessModal'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly')
  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] = useState(false)

  const handleClaimOffer = () => {
    setIsEarlyAccessModalOpen(true)
  }

  const handleChoosePlan = () => {
    setIsEarlyAccessModalOpen(true)
  }

  const creatorFeatures = [
    '<strong>AI-Powered Insights:</strong> Turn your data into actionable advice.',
    '<strong>Deal & Contact Management:</strong> Track every pitch, negotiation, and relationship.',
    '<strong>Invoicing & Payments:</strong> Automate billing and get paid faster.',
    '<strong>Up to 100 Contacts:</strong> Build your professional network.'
  ]

  const businessFeatures = [
    'Everything in Creator, plus:',
    '<strong>Advanced Analytics & Reporting:</strong> Deep dive into your business performance.',
    '<strong>Multi-user Support:</strong> Collaborate with up to 3 team members.',
    '<strong>Priority Support:</strong> Get faster help when you need it.',
    '<strong>Unlimited Contacts:</strong> Scale your network without limits.'
  ]

  return (
    <div className="min-h-screen bg-[#111111] text-[#F3F3F4] overflow-y-auto overflow-x-hidden">
      <StarfieldCanvas />
      <Header />
      
      <div className="content-container">
        <div className="max-w-5xl mx-auto p-6 lg:p-8 text-center">
          
          <FoundersKeyCard onClaimOffer={handleClaimOffer} />

          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Choose Your Command Center
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Simple, transparent pricing that grows with you. No hidden fees. Ever.
          </p>
          
          <BillingToggle 
            value={billingPeriod} 
            onValueChange={setBillingPeriod} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <PricingCard
              planName="Creator"
              description="For individuals ready to professionalize."
              monthlyPrice="29"
              annuallyPrice="23"
              features={creatorFeatures}
              isPopular={false}
              onChoosePlan={handleChoosePlan}
              billingPeriod={billingPeriod}
            />
            
            <PricingCard
              planName="Business"
              description="For established creators & small teams."
              monthlyPrice="79"
              annuallyPrice="63"
              features={businessFeatures}
              isPopular={true}
              onChoosePlan={handleChoosePlan}
              billingPeriod={billingPeriod}
            />
          </div>
        </div>
      </div>
      
      <Footer />
      
      <EarlyAccessModal 
        isOpen={isEarlyAccessModalOpen} 
        onClose={() => setIsEarlyAccessModalOpen(false)} 
      />
    </div>
  )
}