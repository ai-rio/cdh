'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWaitlistModal } from '@/lib/stores/waitlist-modal-store';

export default function HeroSection() {
  const { openModal } = useWaitlistModal();
  
  return (
    <main className="relative h-screen flex flex-col justify-center items-center p-4 md:p-8">
        <div className="text-center">
            <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
                <CardContent className="p-8 md:p-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-blue-300">From Burnout to Business Owner. The Creator-First Management Platform.</h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">Stop wrestling with spreadsheets and chasing payments. Our AI Co-Pilot automates your brand deal management and clarifies your finances, so you can escape the admin nightmare and focus on creating.</p>
                    <Button 
                      onClick={openModal}
                      className="waitlist-trigger bg-lime-400 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(192,252,50,0.4)] transition-all duration-300 ease-in-out hover:bg-lime-300 hover:shadow-[0_0_30px_rgba(192,252,50,0.6)] hover:scale-105 active:scale-100 active:bg-lime-500"
                    >
                      Request Early Access
                    </Button>
                </CardContent>
            </Card>
        </div>
        <a href="#features-section" className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center space-y-2 scroll-indicator">
                <span className="text-sm text-gray-400">Scroll to explore</span>
                <div className="w-6 h-6 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
        </a>
    </main>
  );
}
