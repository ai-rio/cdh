"use client"

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent } from '@/components/ui/card'

// TypeScript interface for deal data
interface Deal {
  id: string
  brandName: string
  dealValue: number
  startDate: string
  endDate: string
  status: 'active' | 'pending' | 'completed'
  description: string
  deliverables: string[]
  progress: number
}

// Mock data for deals
const mockDeals: Deal[] = [
  {
    id: '1',
    brandName: 'TechCorp',
    dealValue: 15000,
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    status: 'active',
    description: 'Product review and social media campaign for new smartphone launch',
    deliverables: ['Instagram posts (5)', 'YouTube review', 'Stories (10)'],
    progress: 75
  },
  {
    id: '2',
    brandName: 'FashionBrand',
    dealValue: 8500,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    status: 'completed',
    description: 'Spring collection showcase and styling content',
    deliverables: ['TikTok videos (3)', 'Instagram Reels (5)', 'Blog post'],
    progress: 100
  },
  {
    id: '3',
    brandName: 'FitnessGear',
    dealValue: 12000,
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    status: 'active',
    description: 'Fitness equipment review and workout content creation',
    deliverables: ['YouTube workouts (4)', 'Instagram posts (8)', 'Product reviews'],
    progress: 45
  },
  {
    id: '4',
    brandName: 'FoodieApp',
    dealValue: 6000,
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: 'pending',
    description: 'App promotion and recipe content collaboration',
    deliverables: ['Recipe videos (6)', 'App tutorials (2)', 'Stories (15)'],
    progress: 0
  },
  {
    id: '5',
    brandName: 'TravelCo',
    dealValue: 20000,
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    status: 'active',
    description: 'Destination showcase and travel vlog series',
    deliverables: ['Travel vlogs (8)', 'Instagram posts (12)', 'Blog articles (4)'],
    progress: 20
  }
]

const DealsTimeline: React.FC = () => {
  const getStatusColor = (status: Deal['status']) => {
    switch (status) {
      case 'active':
        return 'bg-lime-400'
      case 'completed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getProgressWidth = (progress: number) => {
    return `${progress}%`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-4">
        {mockDeals.map((deal, index) => (
          <Popover key={deal.id}>
            <PopoverTrigger asChild>
              <div className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center space-x-4 p-4 bg-black/20 border border-white/10 rounded-lg backdrop-blur-xl hover:border-lime-400/50">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(deal.status)} shadow-lg`} />
                    {index < mockDeals.length - 1 && (
                      <div className="w-0.5 h-8 bg-white/20 mt-2" />
                    )}
                  </div>
                  
                  {/* Deal info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white text-center">{deal.brandName}</h3>
                      <span className="text-lime-400 font-bold">{formatCurrency(deal.dealValue)}</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(deal.status)}`}
                        style={{ width: getProgressWidth(deal.progress) }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{formatDate(deal.startDate)} - {formatDate(deal.endDate)}</span>
                      <span className="capitalize">{deal.status} • {deal.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            
            <PopoverContent 
              className="w-80 bg-black/90 border-white/20 backdrop-blur-xl"
              sideOffset={8}
            >
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h4 className="text-lg font-bold text-white mb-1 text-center">{deal.brandName}</h4>
                  <p className="text-2xl font-bold text-lime-400">{formatCurrency(deal.dealValue)}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-300 mb-2 text-center">Description</h5>
                  <p className="text-sm text-gray-400">{deal.description}</p>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-300 mb-2 text-center">Deliverables</h5>
                  <ul className="space-y-1">
                    {deal.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="text-sm text-gray-400 flex items-center">
                        <span className="text-lime-400 mr-2">•</span>
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500">Timeline</p>
                    <p className="text-sm text-gray-300">{formatDate(deal.startDate)} - {formatDate(deal.endDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Progress</p>
                    <p className="text-sm font-semibold text-white">{deal.progress}%</p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-lime-400" />
          <span className="text-sm text-gray-400">Active</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-400">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-sm text-gray-400">Pending</span>
        </div>
      </div>
    </div>
  )
}

export default DealsTimeline