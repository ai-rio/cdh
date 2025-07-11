import React from 'react'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext' // Import AuthProvider
import PerformanceMonitor from '@/components/PerformanceMonitor'
import ScrollOptimizer from '@/components/ScrollOptimizer'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PerformanceMonitor />
        <ScrollOptimizer />
        <AuthProvider> {/* Wrap children with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
