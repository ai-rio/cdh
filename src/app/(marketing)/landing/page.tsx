import React from 'react'

// Assuming these components are correctly defined in your project structure
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import HeroSection from '@/components/landing/HeroSection'
import AITypingDemo from '@/components/landing/AITypingDemo'
import DealsTimeline from '@/components/landing/DealsTimeline'
import CashflowChart from '@/components/landing/CashflowChart'
import TestimonialCarousel from '@/components/landing/TestimonialCarousel'
import LandingPricing from '@/components/landing/LandingPricing'
import LandingFooter from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative z-10 bg-transparent">
        <HeroSection />

        {/* Features Section */}
        <section
          id="features-section"
          className="min-h-screen flex items-center justify-center px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-white">
              Bridge Your Monetization Maturity Gap
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-4 text-lime-400 text-center">
                    Manage Deals Without the Mess
                  </h3>
                  <p className="text-gray-300">
                    Centralize every contract, deadline, and deliverable. Ditch the spreadsheet
                    chaos.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-4 text-lime-400 text-center">
                    Invoice Like a Pro, Get Paid Faster
                  </h3>
                  <p className="text-gray-300">
                    Generate and track professional invoices in seconds and automate your
                    follow-ups.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-4 text-lime-400 text-center">
                    Prove Your Authentic Value
                  </h3>
                  <p className="text-gray-300">
                    Move beyond vanity metrics and track the analytics that matter to prove your
                    ROI.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Co-Pilot Demo Section */}
        <section
          id="ai-demo-section"
          className="min-h-screen flex flex-col justify-center items-center gap-8 md:gap-12 px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            Experience the AI Co-Pilot
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl">
            See how our AI assistant can help you make data-driven decisions for your creator
            business.
          </p>
          <AITypingDemo />
        </section>

        {/* Deals Timeline Section */}
        <section
          id="deals-timeline-section"
          className="min-h-screen flex flex-col justify-center items-center gap-8 md:gap-12 px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            The End of Spreadsheet Chaos: Your Centralized Brand Deal Hub
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl">
            Never miss a deadline or lose a contract again. We built the simple, visual brand deal
            management system you wish you had.
          </p>
          <DealsTimeline />
        </section>

        {/* Cashflow Section */}
        <section
          id="cashflow-section"
          className="min-h-screen flex flex-col justify-center items-center gap-8 md:gap-12 px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            Close the Financial Literacy Gap: Your Revenue, Demystified.
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl">
            Finally, a clear view of your finances. See what you&apos;re earning, track expenses,
            and make smart decisions.
          </p>
          <CashflowChart />
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials-section"
          className="min-h-screen flex flex-col justify-center items-center gap-8 md:gap-12 px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            Trusted by Creators Like You
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl">
            See what other influencers and content creators are saying about their success.
          </p>
          <TestimonialCarousel />
        </section>

        {/* Pricing Section */}
        <section
          id="pricing-section"
          className="flex flex-col justify-center items-center py-24 px-4 text-cente"
        >
          <LandingPricing />
        </section>

        {/* Footer Section */}
        <section
          id="footer-section"
          className="flex flex-col justify-center items-center py-24 px-4 text-center"
        >
          <LandingFooter />
        </section>
      </div>
    </div>
  )
}
