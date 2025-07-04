'use client';

import React from 'react';

const PricingPageCtaFooter: React.FC = () => {
  return (
    <footer id="final-cta" className="py-20 px-4 md:px-8 content-section text-center border-t border-white/10">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold reveal">Your AI co-pilot is ready.</h2>
        <p className="text-gray-400 mt-4 mb-8 reveal">
          Stop managing, start commanding. Transform your creator business in minutes.
        </p>
        <button className="waitlist-trigger bg-lime-400 text-black font-bold text-xl px-10 py-5 rounded-xl shadow-[0_0_20px_rgba(192,252,50,0.4)] transition-all duration-300 ease-in-out hover:bg-lime-300 hover:shadow-[0_0_30px_rgba(192,252,50,0.6)] hover:scale-105 active:scale-100 active:bg-lime-500 reveal">
          Get Early Access
        </button>
        <p className="text-gray-500 text-sm mt-4 reveal">Be the first to know when we launch.</p>
      </div>
      <div className="mt-16 text-gray-500 text-sm reveal">
        &copy; 2025 Creator&apos;s Deal Hub. All rights reserved.
      </div>
    </footer>
  );
};

export default PricingPageCtaFooter;