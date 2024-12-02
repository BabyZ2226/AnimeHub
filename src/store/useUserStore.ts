import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, UserReview } from '../types/user';

interface UserState {
  profile: UserProfile | null;
  initialize: () => void;
  updateStats: (stats: Partial<UserProfile['stats']>) => void;
  addReview: (review: UserReview) => void;
  updateLists: (lists: Partial<UserProfile['lists']>) => void;
  unlockAchievement: (achievementId: string) => void;
  updateTheme: (theme: UserProfile['theme']) => void;
}

const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'first-review',
    title: 'First Impression',
    description: 'Write your first anime review',
    icon: '✍️',
    progress: 0,
    requirement: 1
  },
  {
    id: 'review-master',
    title: 'Review Master',
    description: 'Write 10 detailed anime reviews',
    icon: '📝',
    progress: 0,
    requirement: 10
  },
  {
    id: 'genre-explorer',
    title: 'Genre Explorer',
    description: 'Watch anime from 5 different genres',
    icon: '🔍',
    progress: 0,
    requirement: 5
  },
  {
    id: 'list-organizer',
    title: 'List Organizer',
    description: 'Add 20 anime to your lists',
    icon: '📋',
    progress: 0,
    requirement: 20
  },
  {
    id: 'high-rater',
    title: 'Critic\'s Eye',
    description: 'Rate 15 different anime',
    icon: '⭐',
    progress: 0,
    requirement: 15
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      initialize: () => {
        set((state) => {
          if (state.profile) return state;
          
          return {
            profile: {
              id: crypto.randomUUID(),
              username: 'Anime Fan',
              joinedDate: new Date().toISOString(),
              stats: {
                totalAnimeWatched: 0,
                totalReviews: 0,
                averageRating: 0,
                favoriteGenres: {}
              },
              lists: {
                watching: 0,
                completed: 0,
                planToWatch: 0,
                dropped: 0
              },
              theme: {
                primary: '#ef4444',
                background: '#111827',
                accent: '#3b82f6'
              },
              achievements: DEFAULT_ACHIEVEMENTS,
              reviews: []
            }
          };
        });
      },
      updateStats: (stats) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            stats: { ...state.profile.stats, ...stats }
          } : null
        }));
      },
      addReview: (review) => {
        set((state) => {
          if (!state.profile) return { profile: null };

          const reviews = [review, ...state.profile.reviews];
          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          
          return {
            profile: {
              ...state.profile,
              reviews,
              stats: {
                ...state.profile.stats,
                totalReviews: reviews.length,
                averageRating: totalRating / reviews.length
              }
            }
          };
        });
      },
      updateLists: (lists) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            lists: { ...state.profile.lists, ...lists }
          } : null
        }));
      },
      unlockAchievement: (achievementId) => {
        set((state) => {
          if (!state.profile) return { profile: null };

          const achievements = state.profile.achievements.map(achievement => 
            achievement.id === achievementId && !achievement.unlockedAt
              ? { ...achievement, unlockedAt: new Date().toISOString() }
              : achievement
          );

          return {
            profile: {
              ...state.profile,
              achievements
            }
          };
        });
      },
      updateTheme: (theme) => {
        set((state) => ({
          profile: state.profile ? {
            ...state.profile,
            theme
          } : null
        }));
      }
    }),
    {
      name: 'user-profile'
    }
  )
);