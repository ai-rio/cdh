'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeprecationNotice } from './deprecation-notice';

export default function ControlPanelLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter();

  // Auto-redirect after 10 seconds for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Prominent Deprecation Notice */}
        <div className="mb-8">
          <DeprecationNotice autoRedirect={true} redirectDelay={10} />
        </div>
        
        {/* Original Control Panel Content with Overlay */}
        <div className="relative">
          <div className="absolute inset-0 bg-black/50 z-10 rounded-lg"></div>
          <div className="relative z-0 opacity-50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}