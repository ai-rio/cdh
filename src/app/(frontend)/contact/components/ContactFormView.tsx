'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ContactFormType, ContactFormData } from '../page'

interface ContactFormViewProps {
  formType: ContactFormType
  onSubmit: (data: ContactFormData) => void
  onBack: () => void
}

const formConfigs = {
  demo: {
    title: "Request a Private Demo",
    fields: ['name', 'email', 'company'] as (keyof ContactFormData)[],
    buttonText: "Submit Request"
  },
  press: {
    title: "Press & Media Inquiry", 
    fields: ['name', 'email', 'publication', 'message'] as (keyof ContactFormData)[],
    buttonText: "Send Inquiry"
  },
  general: {
    title: "General Question or Feedback",
    fields: ['email', 'message'] as (keyof ContactFormData)[],
    buttonText: "Send Transmission"
  }
}

export function ContactFormView({ formType, onSubmit, onBack }: ContactFormViewProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    name: '',
    company: '',
    publication: '',
    message: ''
  })

  const config = formConfigs[formType]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter form data to only include relevant fields
    const relevantData: ContactFormData = { email: formData.email }
    
    if (config.fields.includes('name') && formData.name) {
      relevantData.name = formData.name
    }
    if (config.fields.includes('company') && formData.company) {
      relevantData.company = formData.company
    }
    if (config.fields.includes('publication') && formData.publication) {
      relevantData.publication = formData.publication
    }
    if (config.fields.includes('message') && formData.message) {
      relevantData.message = formData.message
    }
    
    onSubmit(relevantData)
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-gray-400 hover:text-white mb-8 flex items-center group p-0 bg-transparent hover:bg-transparent"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Select a different channel
      </Button>
      
      <div className="bg-gray-900/50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold text-white mb-6">{config.title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {config.fields.includes('name') && (
            <div>
              <Label htmlFor="name" className="sr-only">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="form-input w-full p-3 rounded-lg text-white bg-white/5 border border-white/10 focus:border-[#A3E635] focus:shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all duration-300 ease-in-out focus:outline-none"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email" className="sr-only">
              {formType === 'general' ? 'Your Email' : 'Work Email'}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={formType === 'general' ? 'Your Email' : 'Work Email'}
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="form-input w-full p-3 rounded-lg text-white bg-white/5 border border-white/10 focus:border-[#A3E635] focus:shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all duration-300 ease-in-out focus:outline-none"
            />
          </div>
          
          {config.fields.includes('company') && (
            <div>
              <Label htmlFor="company" className="sr-only">Company / Channel Name</Label>
              <Input
                id="company"
                type="text"
                placeholder="Company / Channel Name"
                required
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="form-input w-full p-3 rounded-lg text-white bg-white/5 border border-white/10 focus:border-[#A3E635] focus:shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all duration-300 ease-in-out focus:outline-none"
              />
            </div>
          )}
          
          {config.fields.includes('publication') && (
            <div>
              <Label htmlFor="publication" className="sr-only">Publication</Label>
              <Input
                id="publication"
                type="text"
                placeholder="Publication"
                required
                value={formData.publication}
                onChange={(e) => handleInputChange('publication', e.target.value)}
                className="form-input w-full p-3 rounded-lg text-white bg-white/5 border border-white/10 focus:border-[#A3E635] focus:shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all duration-300 ease-in-out focus:outline-none"
              />
            </div>
          )}
          
          {config.fields.includes('message') && (
            <div>
              <Label htmlFor="message" className="sr-only">
                {formType === 'press' ? 'Briefly describe your inquiry...' : 'Your message...'}
              </Label>
              <Textarea
                id="message"
                rows={formType === 'general' ? 5 : 4}
                placeholder={formType === 'press' ? 'Briefly describe your inquiry...' : 'Your message...'}
                required
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="form-input w-full p-3 rounded-lg text-white bg-white/5 border border-white/10 focus:border-[#A3E635] focus:shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all duration-300 ease-in-out resize-none focus:outline-none"
              />
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-lime-400 text-lime-900 font-bold p-4 rounded-lg hover:bg-lime-300 transition-colors duration-300"
          >
            {config.buttonText}
          </Button>
        </form>
      </div>
    </div>
  )
}
