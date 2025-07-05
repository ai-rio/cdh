'use client'

import { Card, CardContent } from '@/components/ui/card'

interface TriageCardProps {
  title: string
  description: string
  onClick: () => void
}

export function TriageCard({ title, description, onClick }: TriageCardProps) {
  return (
    <Card 
      className="triage-card bg-[rgba(23,23,23,0.5)] backdrop-blur-[15px] border border-white/10 rounded-2xl transition-all duration-300 ease-in-out cursor-pointer hover:translate-y-[-5px] hover:border-[#A3E635] group"
      onClick={onClick}
    >
      <CardContent className="p-8">
        <h3 className="text-xl font-bold text-lime-300 group-hover:text-[#A3E635] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mt-2">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
