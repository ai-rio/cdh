import { Header } from './components/Header'
import React from 'react'

export default function HomePage() {
  return (
    <>
      <Header />
      <section className="hero-section" id="hero-section">
      <div className="flex-grow flex items-center justify-center text-center">
        <div className="p-6">
          <div className="inline-block bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4">
              This is your business.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Stop chasing data. Start seeing the connections. CDH turns your entire operation
              into one clear, interactive view.
            </p>
            <button className="cta-glow bg-[#EEFC97] text-[#1D1F04] font-bold text-lg px-8 py-4 rounded-xl">
              Request Early Access
            </button>
          </div>
        </div>
        </div>
      </section>
    </>
  )
}
