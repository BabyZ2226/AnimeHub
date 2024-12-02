import React from 'react';
import { motion } from 'framer-motion';
import type { UserProfile } from '../../types/user';

interface UserStatsProps {
  stats: UserProfile['stats'];
}

export const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  const sortedGenres = Object.entries(stats.favoriteGenres)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxGenreCount = Math.max(...Object.values(stats.favoriteGenres));

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Favorite Genres</h3>
        <div className="space-y-4">
          {sortedGenres.map(([genre, count], index) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{genre}</span>
                <span className="text-sm text-gray-400">{count} anime</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / maxGenreCount) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-primary-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm text-gray-400 mb-1">Average Rating</h4>
          <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm text-gray-400 mb-1">Total Reviews</h4>
          <p className="text-2xl font-bold">{stats.totalReviews}</p>
        </div>
      </div>
    </div>
  );
};