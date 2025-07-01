'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InfoSectionProps {
  title: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoSection({ title, id, children, className = '' }: InfoSectionProps) {
  return (
    <section className={cn('content-section', className)} id={id} role="region">
      <Card className="content-box max-w-2xl bg-black/70 backdrop-blur-md border-white/10 text-center">
        <CardContent className="p-8">
          <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
          <div className="text-gray-300">
            {children}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default InfoSection;