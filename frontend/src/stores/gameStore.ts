import { create } from 'zustand';

interface GameState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
