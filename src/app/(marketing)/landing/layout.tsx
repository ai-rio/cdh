'use client';

import React, { useRef, useEffect, useState } from 'react';
import ParticleCanvas from '@/components/landing/ParticleCanvas';
import LandingHeader from '@/components/landing/LandingHeader';
import WaitlistModal from '@/components/landing/WaitlistModal';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const contentDivRef = useRef<HTMLDivElement>(null);
  const [targetElementRef, setTargetElementRef] = useState<React.RefObject<HTMLElement> | null>(null);

  useEffect(() => {
    if (contentDivRef.current) {
      setTargetElementRef({ current: contentDivRef.current });
    }
  }, [contentDivRef]);

  return (
    <div ref={contentDivRef}>
      {targetElementRef && <ParticleCanvas targetRef={targetElementRef as React.RefObject<HTMLDivElement>} />}
      <LandingHeader />
      {children}
      <WaitlistModal />
    </div>
  );
}