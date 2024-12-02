import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Anime } from '../types/anime';

interface GachaState {
  gems: number;
  pullCount: number;
  pulledCards: Anime[];
  lastLogin: string | null;
  loginStreak: number;
  addGems: (amount: number) => void;
  removeGems: (amount: number) => void;
  addPulledCard: (card: Anime) => void;
  incrementPullCount: (amount: number) => void;
  checkDailyLogin: () => void;
}

export const useGachaStore = create<GachaState>()(
  persist(
    (set, get) => ({
      gems: 0,
      pullCount: 0,
      pulledCards: [],
      lastLogin: null,
      loginStreak: 0,

      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
      removeGems: (amount) => set((state) => ({ gems: state.gems - amount })),
      
      addPulledCard: (card) => set((state) => ({
        pulledCards: [...state.pulledCards, card]
      })),

      incrementPullCount: (amount) => set((state) => ({
        pullCount: state.pullCount + amount
      })),

      checkDailyLogin: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        
        if (state.lastLogin !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          // Check if the last login was yesterday to maintain streak
          const newStreak = state.lastLogin === yesterdayStr
            ? state.loginStreak + 1
            : 1;

          // Award gems
          const streakBonus = newStreak >= 7 ? 50 : 0;
          set({
            gems: state.gems + 10 + streakBonus,
            lastLogin: today,
            loginStreak: newStreak >= 7 ? 0 : newStreak
          });
        }
      }
    }),
    {
      name: 'gacha-storage',
      version: 1,
    }
  )
);