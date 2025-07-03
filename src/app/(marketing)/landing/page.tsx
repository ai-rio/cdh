import React from 'react'
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
    <div className="min-h-screen bg-black">
      
      <div className="relative z-10 bg-transparent">
        <HeroSection />

        {/* Features Section - Testing scroll behavior */}
        <section id="features-section" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-white">Bridge Your Monetization Maturity Gap</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-lime-400">Manage Deals Without the Mess</h3>
                  <p className="text-gray-300">Centralize every contract, deadline, and deliverable. Ditch the spreadsheet chaos and manage your partnerships with the professionalism of a top-tier creator.</p>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-lime-400">Invoice Like a Pro, Get Paid Faster</h3>
                  <p className="text-gray-300">Generate and track professional invoices in seconds. End the &ldquo;nightmare&rdquo; of tracking payments and automate your follow-ups to ensure your cash flow is always healthy.</p>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-lime-400">Prove Your Authentic Value</h3>
                  <p className="text-gray-300">Move beyond vanity metrics. Our dashboard helps you track the influencer analytics that matter, so you can prove your ROI and negotiate from a position of strength.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Co-Pilot Demo Section */}
        <section id="ai-demo-section" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Experience the AI Co-Pilot
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
              See how our AI assistant can help you make data-driven decisions for your creator business
            </p>
            <AITypingDemo />
          </div>
        </section>

        {/* Deals Timeline Section */}
        <section id="deals-timeline-section" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              The End of Spreadsheet Chaos: Your Centralized Brand Deal Hub
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
              Never miss a deadline or lose a contract again. We built the simple, visual brand deal management system you wish you had, giving you total control and clarity over every partnership.
            </p>
            <DealsTimeline />
          </div>
        </section>

        {/* Cashflow Analytics Section */}
        <section id="cashflow-section" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Close the Financial Literacy Gap: Your Revenue, Demystified.
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
              Finally, a clear view of your content creator finances. See what you&apos;re earning across all platforms in one place. Understand your income streams, track expenses, and make smart decisions without needing an accounting degree. This is the simple influencer revenue tracking you&apos;ve been looking for.
            </p>
            <CashflowChart />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials-section" className="min-h-screen flex items-center justify-center px-4">
          <TestimonialCarousel />
        </section>

        {/* Pricing Section */}
        <LandingPricing />

        {/* Footer Section */}
        <LandingFooter />
      </div>
    </div>
  )
}
