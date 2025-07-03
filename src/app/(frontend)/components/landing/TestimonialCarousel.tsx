"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface Testimonial {
  id: number
  quote: string
  name: string
  handle: string
  avatar: string
  platform: string
  followers: string
}

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    quote: "This platform has completely transformed how I manage my brand partnerships. The AI insights are incredible!",
    name: "Sarah Chen",
    handle: "@sarahcreates",
    avatar: "SC",
    platform: "YouTube",
    followers: "2.3M"
  },
  {
    id: 2,
    quote: "Finally, a tool that understands the creator economy. The deal tracking and analytics have boosted my revenue by 40%.",
    name: "Marcus Johnson",
    handle: "@marcustech",
    avatar: "MJ",
    platform: "TikTok",
    followers: "1.8M"
  },
  {
    id: 3,
    quote: "The cashflow visualization helped me make better financial decisions. I can see exactly where my money is coming from.",
    name: "Elena Rodriguez",
    handle: "@elenalifestyle",
    avatar: "ER",
    platform: "Instagram",
    followers: "950K"
  },
  {
    id: 4,
    quote: "Game-changer for my creator business! The AI co-pilot feels like having a personal business advisor 24/7.",
    name: "David Kim",
    handle: "@davidgaming",
    avatar: "DK",
    platform: "Twitch",
    followers: "1.2M"
  },
  {
    id: 5,
    quote: "I've tried many creator tools, but this one actually delivers on its promises. The deal management is seamless.",
    name: "Zoe Williams",
    handle: "@zoefashion",
    avatar: "ZW",
    platform: "YouTube",
    followers: "3.1M"
  },
  {
    id: 6,
    quote: "The platform's insights helped me negotiate better deals and understand my true worth as a creator.",
    name: "Alex Thompson",
    handle: "@alexfitness",
    avatar: "AT",
    platform: "Instagram",
    followers: "1.5M"
  }
]

export default function TestimonialCarousel() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Trusted by Top Creators
        </h3>
        <p className="text-gray-400 text-lg">
          Join thousands of creators who are already maximizing their potential
        </p>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {mockTestimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Quote */}
                  <div className="flex-1 mb-6">
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-bold text-sm">
                        {testimonial.avatar}
                      </span>
                    </div>
                    
                    {/* Name and Handle */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm md:text-base truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-400 text-xs md:text-sm truncate">
                        {testimonial.handle}
                      </p>
                      <p className="text-lime-400 text-xs font-medium">
                        {testimonial.platform} • {testimonial.followers} followers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Buttons */}
        <CarouselPrevious className="-left-4 md:-left-12 bg-black/20 border-white/10 text-white hover:bg-white/10" />
        <CarouselNext className="-right-4 md:-right-12 bg-black/20 border-white/10 text-white hover:bg-white/10" />
      </Carousel>
      
      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <p className="text-2xl md:text-3xl font-bold text-lime-400">10K+</p>
          <p className="text-gray-400 text-sm md:text-base">Active Creators</p>
        </div>
        <div>
          <p className="text-2xl md:text-3xl font-bold text-lime-400">$50M+</p>
          <p className="text-gray-400 text-sm md:text-base">Deals Tracked</p>
        </div>
        <div>
          <p className="text-2xl md:text-3xl font-bold text-lime-400">95%</p>
          <p className="text-gray-400 text-sm md:text-base">Satisfaction Rate</p>
        </div>
        <div>
          <p className="text-2xl md:text-3xl font-bold text-lime-400">24/7</p>
          <p className="text-gray-400 text-sm md:text-base">AI Support</p>
        </div>
      </div>
    </div>
  )
}