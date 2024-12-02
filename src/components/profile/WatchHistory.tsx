import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, CheckCircle } from 'lucide-react';
import { useQuery } from 'react-query';
import { fetchAnimeDetails } from '../../services/api';
import type { WatchHistory as WatchHistoryType } from '../../types/user';

interface WatchHistoryProps {
  history: WatchHistoryType[];
}

export const WatchHistory: React.FC<WatchHistoryProps> = ({ history }) => {
  const navigate = useNavigate();
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const animeIds = [...new Set(history.map(h => h.animeId))];
  const animeQueries = animeIds.map(id =>
    useQuery(['anime', id], () => fetchAnimeDetails(id))
  );

  const isLoading = animeQueries.some(query => query.isLoading);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const getAnimeDetails = (animeId: string) => {
    const query = animeQueries.find(q => q.data?.id === animeId);
    return query?.data;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="space-y-4">
        {sortedHistory.map((item, index) => {
          const anime = getAnimeDetails(item.animeId);
          if (!anime) return null;

          return (
            <motion.div
              key={`${item.animeId}-${item.episodeNumber}-${item.timestamp}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-700 rounded-lg overflow-hidden"
            >
              <div className="flex">
                <img
                  src={anime.attributes.posterImage.small}
                  alt={anime.attributes.canonicalTitle}
                  className="w-24 h-36 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">
                        {anime.attributes.canonicalTitle}
                      </h4>
                      <p className="text-sm text-gray-400">
                        Episode {item.episodeNumber}
                      </p>
                    </div>
                    {item.completed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/watch/${item.animeId}/${item.episodeNumber}`)}
                      className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      {item.completed ? 'Rewatch' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};