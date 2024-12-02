import { Anime } from './anime';

export interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
  joinedDate: string;
  stats: {
    totalAnimeWatched: number;
    totalReviews: number;
    averageRating: number;
    favoriteGenres: { [key: string]: number };
    completedAnime?: number;
    totalEpisodes?: number;
  };
  achievements: Achievement[];
  reviews: UserReview[];
  lists: {
    watching: number;
    completed: number;
    planToWatch: number;
    dropped: number;
  };
  theme: {
    primary: string;
    background: string;
    accent: string;
  };
  watchHistory?: WatchHistory[];
  favorites?: FavoriteAnime[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  requirement: number;
}

export interface UserReview {
  id: string;
  animeId: string;
  animeTitle: string;
  animeCover: string;
  rating: number;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface WatchHistory {
  animeId: string;
  episodeNumber: number;
  progress: number;
  timestamp: string;
  completed: boolean;
}

export interface FavoriteAnime {
  id: string;
  title: string;
  coverImage: string;
  addedAt: string;
}