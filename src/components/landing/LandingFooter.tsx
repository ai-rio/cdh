'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useWaitlistModal } from '@/lib/stores/waitlist-modal-store'

export default function LandingFooter() {
  const { openModal } = useWaitlistModal()

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Final CTA Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
            Ready to Run Your Business Like a Business?
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop being just a content creator. Become the CEO of your brand.
          </p>
          
          <Card className="bg-black/30 border-lime-400/30 backdrop-blur-xl p-8 mb-12">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-3xl font-bold text-lime-400 mb-2">10K+</h3>
                  <p className="text-gray-300">Creators on Waitlist</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-lime-400 mb-2">$2M+</h3>
                  <p className="text-gray-300">Revenue Tracked</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-lime-400 mb-2">500+</h3>
                  <p className="text-gray-300">Brand Partnerships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button 
              size="lg"
              className="bg-lime-400 text-black font-bold hover:bg-lime-300 transition-all duration-200 px-12 py-6 text-lg"
              onClick={openModal}
            >
              Start My Free Trial
            </Button>
            <p className="text-sm text-gray-500">
              No credit card required • Launch in Q2 2024
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-white/10 pt-12">
          <div className="grid md:grid-cols-4 gap-8 text-center mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4 text-center">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-lime-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-lime-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-center">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-lime-400 transition-colors">About</a></li>
                <li><a href="/careers" className="hover:text-lime-400 transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-lime-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-center">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-lime-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-center">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-lime-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-lime-400 transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="text-2xl font-bold text-lime-400">CreatorDashboard</div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="text-center pt-8">
            <p className="text-gray-500 text-sm">
              © 2024 CreatorDashboard. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}