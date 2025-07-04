'use client'

import React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface BillingToggleProps {
  value: 'monthly' | 'annually'
  onValueChange: (value: 'monthly' | 'annually') => void
}

export function BillingToggle({ value, onValueChange }: BillingToggleProps) {
  return (
    <div className="flex justify-center items-center my-10">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(newValue) => {
          if (newValue && (newValue === 'monthly' || newValue === 'annually')) {
            onValueChange(newValue)
          }
        }}
        className="bg-gray-800 border border-white/10 p-1 rounded-full w-max mx-auto"
      >
        <ToggleGroupItem
          value="monthly"
          className="px-6 py-2 text-sm font-semibold rounded-full data-[state=on]:bg-[#EEFC97] data-[state=on]:text-[#1D1F04] data-[state=on]:shadow-sm data-[state=off]:text-white hover:bg-white/10"
        >
          Monthly
        </ToggleGroupItem>
        <ToggleGroupItem
          value="annually"
          className="px-6 py-2 text-sm font-semibold rounded-full relative data-[state=on]:bg-[#EEFC97] data-[state=on]:text-[#1D1F04] data-[state=on]:shadow-sm data-[state=off]:text-white hover:bg-white/10"
        >
          Annually
          <span className="absolute -top-2 -right-2 bg-green-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}