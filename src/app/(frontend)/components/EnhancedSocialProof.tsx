'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

export function EnhancedSocialProof() {
  return (
    <section className="content-section">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Trusted by Top Creators
          </h3>
          <p className="text-gray-400 text-lg">
            Join thousands of creators who are already maximizing their potential
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1: No More Spreadsheet Chaos */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl hover:border-lime-400/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <h4 className="text-xl font-bold mb-4 text-lime-400">
                No More Spreadsheet Chaos
              </h4>
              <p className="text-gray-300 italic leading-relaxed">
                "This platform saved me 10+ hours a week. My brand deals used to be a nightmare of spreadsheets and missed emails. Now, everything is in one place, and I feel like a true professional."
              </p>
            </CardContent>
          </Card>

          {/* Column 2: Confidence in My Numbers */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl hover:border-lime-400/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <h4 className="text-xl font-bold mb-4 text-lime-400">
                Confidence in My Numbers
              </h4>
              <p className="text-gray-300 italic leading-relaxed">
                "For the first time, I actually understand my business. I can see which partnerships are most profitable and negotiate better deals because I have the data to back it up. It's a game-changer."
              </p>
            </CardContent>
          </Card>

          {/* Column 3: Authentic Growth */}
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl hover:border-lime-400/30 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <h4 className="text-xl font-bold mb-4 text-lime-400">
                Authentic Growth
              </h4>
              <p className="text-gray-300 italic leading-relaxed">
                "I stopped worrying about vanity metrics and started focusing on real engagement. This tool helped me identify my 'top fans' and build a stronger, more loyal community."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default EnhancedSocialProof
