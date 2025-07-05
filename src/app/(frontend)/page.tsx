import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { StarfieldCanvas } from './components/StarfieldCanvas'
import { HeroSection } from './components/HeroSection'
import { InfoSection } from './components/InfoSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CTASection } from './components/CTASection'
import { EnhancedSocialProof } from './components/EnhancedSocialProof'

// Import existing landing page components for proof-of-concept demos
import AITypingDemo from '@/components/landing/AITypingDemo'
import DealsTimelineWrapper from './components/DealsTimelineWrapper'
import CashflowChart from '@/components/landing/CashflowChart'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <>
      <StarfieldCanvas className="fixed top-0 left-0 w-full h-full z-[1]" />
      <Header />
      <div className="scroll-container relative z-[2] w-full">
        <HeroSection />

        {/* Deals Section with Proof-of-Concept Demo */}
        <InfoSection title="Command Your Deals" id="deals-section">
          <p>
            From pitch to payment, master your entire deal pipeline. Go beyond the spreadsheet and manage every brand collaboration with the confidence of a top-tier creator, ensuring you never miss a deadline or a payment again.
          </p>
        </InfoSection>

        {/* See Deal Management In Action */}
        <section className="content-section demo-section">
          <div className="w-full max-w-6xl mx-auto px-4 text-center">
            <div className="mb-8">
              <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">
                See Deal Management In Action
              </h4>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Experience how our platform transforms chaotic spreadsheets into a visual, 
                organized deal pipeline that keeps you on top of every opportunity.
              </p>
            </div>
            <div className="deals-timeline">
              <DealsTimelineWrapper />
            </div>
          </div>
        </section>

        {/* Finance Section with Proof-of-Concept Demo */}
        <InfoSection title="Financial Clarity" id="finance-section">
          <p>
            Connect your income streams and watch your finances align. Finally prove your ROI with clear analytics that bridge the financial literacy gap, all without the headache of complex accounting software.
          </p>
        </InfoSection>

        {/* See Financial Analytics In Action */}
        <section className="content-section demo-section">
          <div className="w-full max-w-6xl mx-auto px-4 text-center">
            <div className="mb-8">
              <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">
                See Financial Analytics In Action
              </h4>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Watch your revenue data come to life with intelligent forecasting and 
                real-time tracking that shows exactly where your money is coming from.
              </p>
            </div>
            <CashflowChart />
          </div>
        </section>

        {/* Contacts Section with Proof-of-Concept Demo */}
        <InfoSection title="Contact Intelligence" id="contacts-section">
          <p>
            Your entire deal network is now in the clear. Use AI-driven insights to understand who your most valuable partners are, what relationships are at risk, and how to connect to grow your brand and your business.
          </p>
        </InfoSection>

        {/* See AI Intelligence In Action */}
        <section className="content-section demo-section">
          <div className="w-full max-w-6xl mx-auto px-4 text-center">
            <div className="mb-8">
              <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">
                See AI Intelligence In Action
              </h4>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Experience how our AI co-pilot analyzes your business data to provide 
                actionable insights and strategic recommendations for growth.
              </p>
            </div>
            <AITypingDemo />
          </div>
        </section>

        {/* Enhanced Social Proof Section */}
        <EnhancedSocialProof />

        {/* Request Early Access CTA */}
        <CTASection />
      </div>
    </>
  )
}
