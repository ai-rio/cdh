'use client';

import { create } from 'zustand';

interface Mission {
  title: string;
  department: string;
  location: string;
  briefing: string;
}

interface MissionModalState {
  isOpen: boolean;
  currentMission: Mission | null;
  currentView: 'briefing' | 'apply' | 'success';
  openModal: (mission: Mission) => void;
  closeModal: () => void;
  setView: (view: 'briefing' | 'apply' | 'success') => void;
}

export const useMissionModal = create<MissionModalState>((set) => ({
  isOpen: false,
  currentMission: null,
  currentView: 'briefing',
  openModal: (mission: Mission) => set({ 
    isOpen: true, 
    currentMission: mission, 
    currentView: 'briefing' 
  }),
  closeModal: () => set({ 
    isOpen: false, 
    currentMission: null, 
    currentView: 'briefing' 
  }),
  setView: (view: 'briefing' | 'apply' | 'success') => set({ currentView: view }),
}));