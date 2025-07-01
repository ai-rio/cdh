'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EarlyAccessModal } from './EarlyAccessModal';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = '' }: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestAccess = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section className={`hero-section ${className}`} id="hero-section">
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
              <Button
                onClick={handleRequestAccess}
                className="cta-glow bg-[#EEFC97] text-[#1D1F04] font-bold text-lg px-8 py-4 rounded-xl hover:bg-[#EEFC97]/90 transition-all duration-300"
              >
                Request Early Access
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <EarlyAccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}