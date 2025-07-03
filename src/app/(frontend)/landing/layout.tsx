import React from 'react';
import ParticleCanvas from '../components/landing/ParticleCanvas';
import LandingHeader from '../components/landing/LandingHeader';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="text-[#E5E7EB]">
        <ParticleCanvas />
        <LandingHeader />
        {children}
      </body>
    </html>
  );
}