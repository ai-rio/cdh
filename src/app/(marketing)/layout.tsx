import React from 'react';
import '../(frontend)/styles.css';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="text-[#E5E7EB]">
        {children}
      </body>
    </html>
  );
}