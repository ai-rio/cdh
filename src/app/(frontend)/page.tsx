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

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <>
      <StarfieldCanvas className="fixed top-0 left-0 w-full h-full z-[1]" />
      <div className="scroll-container relative z-[2] w-full">
        <section className="hero-section" id="hero-section">
          <div className="flex-grow flex items-center justify-center text-center">
            <div className="p-6">
              <div className="inline-block bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4">
                  This is your business.
                </h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                  Stop chasing data. Start seeing the connections. CDH turns your entire operation
                  into one clear, interactive view.
                </p>
                <button className="cta-glow bg-[#EEFC97] text-[#1D1F04] font-bold text-lg px-8 py-4 rounded-xl">
                  Request Early Access
                </button>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </>
  )
}
