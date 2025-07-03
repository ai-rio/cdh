import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import HeroSection from '../components/landing/HeroSection'
import ParticleCanvas from '../components/landing/ParticleCanvas'
import AITypingDemo from '../components/landing/AITypingDemo'
import DealsTimeline from '../components/landing/DealsTimeline'
import CashflowChart from '../components/landing/CashflowChart'
import TestimonialCarousel from '../components/landing/TestimonialCarousel'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <ParticleCanvas />
      <div className="relative z-10">
        <HeroSection />

        {/* Features Section - Testing scroll behavior */}
        <section id="features-section" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-white">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-lime-400">AI Co-Pilot</h3>
                  <p className="text-gray-300">Get intelligent insights and recommendations for your creator business.</p>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-lime-400">Deal Management</h3>
                  <p className="text-gray-300">Track and manage all your brand partnerships in one place.</p>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-lime-400">Cashflow Analytics</h3>
                  <p className="text-gray-300">Visualize your revenue streams and financial performance.</p>
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
              Track Your Brand Collaborations
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
              Visualize and manage all your active deals in one comprehensive timeline
            </p>
            <DealsTimeline />
          </div>
        </section>

        {/* Cashflow Analytics Section */}
        <section id="cashflow-section" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Visualize Your Revenue Growth
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
              Get real-time insights into your earnings with interactive charts. Compare projected vs actual revenue and track your financial performance.
            </p>
            <CashflowChart />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials-section" className="min-h-screen flex items-center justify-center px-4">
          <TestimonialCarousel />
        </section>

        {/* Pricing Section */}
        <section id="pricing-section" className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-white">Pricing</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">Creator</h3>
                  <p className="text-3xl font-bold mb-6 text-lime-400">$29/mo</p>
                  <ul className="text-left space-y-2 mb-8">
                    <li className="flex items-center text-gray-300">
                      <span className="text-lime-400 mr-2">✓</span>
                      Deal tracking
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-lime-400 mr-2">✓</span>
                      Basic analytics
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-lime-400 mr-2">✓</span>
                      Email support
                    </li>
                  </ul>
                  <Button className="w-full bg-lime-400 text-black font-bold hover:bg-lime-300">
                    Join Waitlist
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl border-lime-400/50">
                <CardContent className="p-8">
                  <div className="bg-lime-400 text-black text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                    POPULAR
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Business</h3>
                  <p className="text-3xl font-bold mb-6 text-lime-400">$99/mo</p>
                  <ul className="text-left space-y-2 mb-8">
                    <li className="flex items-center text-gray-300">
                      <span className="text-lime-400 mr-2">✓</span>
                      Everything in Creator
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-lime-400 mr-2">✓</span>
                      AI insights
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-lime-400 mr-2">✓</span>
                      Advanced analytics
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-lime-400 mr-2">✓</span>
                      Priority support
                    </li>
                  </ul>
                  <Button className="w-full bg-lime-400 text-black font-bold hover:bg-lime-300">
                    Join Waitlist
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
