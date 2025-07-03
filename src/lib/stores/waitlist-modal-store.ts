import { create } from 'zustand';

interface WaitlistModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useWaitlistModal = create<WaitlistModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));