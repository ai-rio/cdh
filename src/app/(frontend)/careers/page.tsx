'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '../components/Header';
import BackgroundAnimation from './components/BackgroundAnimation';
import CodeCard from './components/CodeCard';
import MissionCard from './components/MissionCard';
import MissionBriefingModal from './components/MissionBriefingModal';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

// Mission data from the original HTML
const missions = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote / San Francisco",
    briefing: "Lead the development of our next-generation AI-powered platform. You'll architect scalable systems that handle millions of transactions while maintaining sub-100ms response times."
  },
  {
    title: "AI Research Scientist",
    department: "Research & Development",
    location: "Remote / New York",
    briefing: "Push the boundaries of what's possible with large language models. Design and implement novel architectures that will define the next generation of AI assistants."
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote / Los Angeles",
    briefing: "Craft intuitive interfaces that make complex AI interactions feel natural. You'll design the future of human-computer collaboration."
  },
  {
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote / Austin",
    briefing: "Build and maintain the infrastructure that powers our AI platform. Design systems that scale from thousands to millions of users seamlessly."
  },
  {
    title: "Data Scientist",
    department: "Analytics",
    location: "Remote / Boston",
    briefing: "Turn data into insights that drive product decisions. Build models that predict user behavior and optimize our AI's performance."
  },
  {
    title: "Technical Writer",
    department: "Documentation",
    location: "Remote / Seattle",
    briefing: "Make complex AI concepts accessible to developers worldwide. Create documentation that turns confusion into clarity."
  }
];

export default function CareersPage() {
  const [isCommandDeckOpen, setIsCommandDeckOpen] = useState(false);

  const toggleCommandDeck = () => {
    setIsCommandDeckOpen(!isCommandDeckOpen);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Mission Control HUD */}
      <div className="mission-control-hud fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex justify-between items-center">
          <div className="text-lime-400 font-mono text-sm">
            MISSION_CONTROL_ACTIVE
          </div>
          <Button
            onClick={toggleCommandDeck}
            variant="ghost"
            size="icon"
            className="text-lime-400 hover:text-lime-300 hover:bg-lime-400/10"
            aria-label="Toggle command deck"
          >
            {isCommandDeckOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Command Deck Overlay */}
      {isCommandDeckOpen && (
        <div className="command-deck fixed inset-0 z-40 bg-black/90 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen p-4">
            <nav className="text-center space-y-8">
              <h2 className="text-4xl font-bold text-lime-400 mb-12">Command Deck</h2>
              <div className="space-y-6">
                 <Link href="/" className="block text-2xl hover:text-lime-400 transition-colors">
                   Home Base
                 </Link>
                 <Link href="/about" className="block text-2xl hover:text-lime-400 transition-colors">
                   About Mission
                 </Link>
                 <Link href="/pricing" className="block text-2xl hover:text-lime-400 transition-colors">
                   Pricing Intel
                 </Link>
                 <Link href="/blog" className="block text-2xl hover:text-lime-400 transition-colors">
                   Mission Logs
                 </Link>
                 <Link href="/login" className="block text-2xl hover:text-lime-400 transition-colors">
                   Access Terminal
                 </Link>
               </div>
            </nav>
          </div>
        </div>
      )}

      <Header />
      <BackgroundAnimation />
      
      {/* Main Content */}
      <div className="content-container relative z-10 pt-20">
        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            Join the <span className="text-lime-400">Expedition</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto inline-block">
             We&apos;re building the future of human-AI collaboration. 
             Help us push the boundaries of what&apos;s possible.
           </p>
        </section>

        {/* Our Core Code Section */}
        <section className="py-20 px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Our <span className="text-lime-400">Core Code</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <CodeCard 
               title="Push Boundaries"
               description="We don&apos;t accept &apos;impossible.&apos; Every limitation is just a problem waiting for an elegant solution."
             />
            <CodeCard 
              title="Ship Fast, Think Faster"
              description="Velocity without vision is chaos. We move quickly because we think deeply about where we're going."
            />
            <CodeCard 
               title="Human + AI = Exponential"
               description="We&apos;re not replacing humans with AI. We&apos;re amplifying human potential through intelligent collaboration."
             />
            <CodeCard 
               title="Own the Outcome"
               description="We don&apos;t just write code or design interfaces. We take responsibility for the impact our work has on the world."
             />
          </div>
        </section>

        {/* Open Missions Section */}
        <section className="py-20 px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Open <span className="text-lime-400">Missions</span>
          </h2>
          <div id="mission-board" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {missions.map((mission, index) => (
              <MissionCard
                key={index}
                title={mission.title}
                department={mission.department}
                location={mission.location}
                mission={mission}
              />
            ))}
          </div>
        </section>
      </div>

      <MissionBriefingModal />
    </div>
  );
}
