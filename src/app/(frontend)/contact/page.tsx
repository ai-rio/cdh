'use client'

import { useState } from 'react'
import { Header } from '../components/Header'
import { ContactCanvas } from './components/ContactCanvas'
import { TriageCard } from './components/TriageCard'
import { ContactFormView } from './components/ContactFormView'
import { SuccessMessageView } from './components/SuccessMessageView'

export type ContactFormType = 'demo' | 'press' | 'general'

export interface ContactFormData {
  name?: string
  email: string
  company?: string
  publication?: string
  message?: string
}

export default function ContactPage() {
  const [currentView, setCurrentView] = useState<'triage' | 'form' | 'success'>('triage')
  const [selectedFormType, setSelectedFormType] = useState<ContactFormType | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleTriageSelect = (formType: ContactFormType) => {
    setSelectedFormType(formType)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentView('form')
      setIsTransitioning(false)
    }, 300)
  }

  const handleBackToTriage = () => {
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentView('triage')
      setSelectedFormType(null)
      setIsTransitioning(false)
    }, 300)
  }

  const handleFormSubmit = (data: ContactFormData) => {
    console.log('Form submitted:', data)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setCurrentView('success')
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F3F3F4] overflow-x-hidden font-['Inter',sans-serif]">
      <Header />
      <ContactCanvas />
      
      <div className="relative w-full pt-28" style={{ zIndex: 2 }}>
        <div className="min-h-[80vh] flex flex-col justify-center items-center">
          <div className="max-w-[800px] mx-auto text-center p-6">
            
            {/* Triage View */}
            {currentView === 'triage' && (
              <div className={`transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">Establish Comms</h1>
                <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
                  What is the nature of your transmission? Select a channel to route your signal to the correct command center.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <TriageCard
                    title="Request a Private Demo"
                    description="Get a personalized tour of the CDH platform."
                    onClick={() => handleTriageSelect('demo')}
                  />
                  <TriageCard
                    title="Press & Media Inquiry"
                    description="For interviews, assets, and media partnerships."
                    onClick={() => handleTriageSelect('press')}
                  />
                  <TriageCard
                    title="General Question"
                    description="For feedback or any other inquiries."
                    onClick={() => handleTriageSelect('general')}
                  />
                </div>
              </div>
            )}

            {/* Form View */}
            {currentView === 'form' && selectedFormType && (
              <div className={`transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <ContactFormView
                  formType={selectedFormType}
                  onSubmit={handleFormSubmit}
                  onBack={handleBackToTriage}
                />
              </div>
            )}

            {/* Success View */}
            {currentView === 'success' && selectedFormType && (
              <div className={`transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <SuccessMessageView
                  formType={selectedFormType}
                  onBack={handleBackToTriage}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
