'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useWaitlistModal } from '@/lib/stores/waitlist-modal-store';

export default function LandingHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const { openModal } = useWaitlistModal();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 p-4 z-50 bg-black/20 backdrop-blur-xl transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0 opacity-100 border-b border-image-gradient' : '-translate-y-full opacity-0'}
      `}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <a href="#" className="flex items-center space-x-2">
          {/* Placeholder for logo/site title */}
          <span className="font-bold text-xl text-white">CDH</span>
        </a>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features-section" className="nav-link text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#testimonials-section" className="nav-link text-gray-300 hover:text-white transition-colors">Testimonials</a>
          <a href="#pricing-section" className="nav-link text-gray-300 hover:text-white transition-colors">Pricing</a>
        </nav>
        <Button
          onClick={openModal}
          className="bg-lime-400 text-black font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-lime-300 transition-colors"
        >
          Join Waitlist
        </Button>
      </div>
    </header>
  );
}
