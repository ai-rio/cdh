import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { StarfieldCanvas } from './components/StarfieldCanvas'
import { HeroSection } from './components/HeroSection'
import { InfoSection } from './components/InfoSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <>
      <StarfieldCanvas className="fixed top-0 left-0 w-full h-full z-[1]" />
      <Header />
      <div className="scroll-container relative z-[2] w-full">
        <HeroSection />

        <InfoSection title="Command Your Deals" id="deals-section">
          <p>
            From pitch to payment, visualize your entire deal pipeline. See active negotiations,
            track deliverable deadlines, and identify high-value partnerships at a glance.
          </p>
        </InfoSection>

        <InfoSection title="Financial Clarity" id="finance-section">
          <p>
            Connect your income streams and watch your finances organize themselves. Instantly see
            overdue invoices and track campaign performance against its value.
          </p>
        </InfoSection>

        <InfoSection title="Contact Intelligence" id="contacts-section">
          <p>
            Your network is your net worth. See your key relationships in context, understanding who
            your most valuable partners are and how they connect to your deals.
          </p>
        </InfoSection>
        <Footer />
      </div>
    </>
  )
}
