import { Footer } from './components/Footer'
import React from 'react'
import './styles.css'
import { Header } from './components/Header'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#111111] text-[#f3f3f4]">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
      />
      <Header />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </div>
  )
}