'use client';

import { Button } from '@/components/ui/button';
import { useMissionModal } from '../hooks/useMissionModal';

interface Mission {
  title: string;
  department: string;
  location: string;
  briefing: string;
}

interface MissionCardProps {
  title: string;
  department: string;
  location: string;
  mission: Mission;
}

export default function MissionCard({ title, department, location, mission }: MissionCardProps) {
  const { openModal } = useMissionModal();

  const handleClick = () => {
    openModal(mission);
  };

  return (
    <div className="mission-card p-6 cursor-pointer" onClick={handleClick}>
      <p className="text-sm text-lime-400 font-semibold">{department}</p>
      <h3 className="text-2xl font-bold mt-2">{title}</h3>
      <p className="text-gray-400 mt-4">{location}</p>
      <Button 
        className="mt-4 w-full bg-lime-400 text-lime-900 font-bold hover:bg-lime-300"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        View Briefing
      </Button>
    </div>
  );
}