import { Footer } from './components/Footer'
import React from 'react'
import './styles.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#111111] text-[#f3f3f4]">
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}