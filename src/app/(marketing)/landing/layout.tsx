import React from 'react';
import ParticleCanvas from '@/components/landing/ParticleCanvas';
import LandingHeader from '@/components/landing/LandingHeader';
import WaitlistModal from '@/components/landing/WaitlistModal';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ParticleCanvas />
      <LandingHeader />
      {children}
      <WaitlistModal />
    </>
  );
}