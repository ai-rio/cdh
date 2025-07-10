'use client'

import { Button } from '@/components/ui/button'
import { ContactFormType } from '../page'

interface SuccessMessageViewProps {
  formType: ContactFormType
  onBack: () => void
}

const successMessages = {
  demo: "Your request has been routed to our strategy team. Stand by for contact.",
  press: "Your inquiry has been routed to our comms channel. We'll be in touch shortly.",
  general: "Your signal has been received. Thank you for your feedback."
}

export function SuccessMessageView({ formType, onBack }: SuccessMessageViewProps) {
  return (
    <div className="text-center">
      <svg 
        className="w-16 h-16 mx-auto text-[#EEFC97]" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Success checkmark"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      
      <h2 className="text-3xl font-bold text-white mt-4 mb-2">
        Transmission Received
      </h2>
      
      <p className="text-gray-300 mb-8">
        {successMessages[formType]}
      </p>
      
      <Button
        onClick={onBack}
        variant="outline"
        className="border-white/20 text-white hover:bg-white/10"
      >
        Send Another Transmission
      </Button>
    </div>
  )
}
