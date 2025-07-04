'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

interface PricingCardProps {
  planName: string
  description: string
  monthlyPrice: string
  annuallyPrice: string
  features: string[]
  isPopular?: boolean
  onChoosePlan: () => void
  billingPeriod: 'monthly' | 'annually'
}

export function PricingCard({
  planName,
  description,
  monthlyPrice,
  annuallyPrice,
  features,
  isPopular = false,
  onChoosePlan,
  billingPeriod
}: PricingCardProps) {
  const currentPrice = billingPeriod === 'monthly' ? monthlyPrice : annuallyPrice
  
  return (
    <div className={`pricing-card p-8 text-left relative ${
      isPopular 
        ? 'border-lime-400 shadow-[0_0_30px_rgba(163,230,53,0.2)]' 
        : ''
    }`}>
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-lime-400 text-black text-sm font-bold px-4 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-white">{planName}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      
      <div className="text-5xl font-extrabold mb-6 text-white">
        <span>${currentPrice}</span>
        <span className="text-lg font-medium text-gray-400">/mo</span>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start feature-item">
            <CheckCircle className="text-lime-400 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
            <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }} />
          </li>
        ))}
      </ul>
      
      <Button
        onClick={onChoosePlan}
        className={`w-full font-semibold py-3 rounded-lg transition-colors ${
          isPopular
            ? 'bg-lime-400 text-black hover:bg-lime-300'
            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
        }`}
        variant={isPopular ? 'default' : 'outline'}
      >
        Choose {planName}
      </Button>
    </div>
  )
}