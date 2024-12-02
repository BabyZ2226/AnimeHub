import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import type { AnimeEpisode } from '../../types/anime';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
}

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&auto=format&fit=crop';

export const EpisodeList: React.FC<EpisodeListProps> = ({ episodes }) => {
  if (episodes.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No episodes available yet. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {episodes.map((episode, index) => (
        <motion.div
          key={episode.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all"
        >
          <div className="aspect-video relative">
            <img
              src={episode.attributes.thumbnail?.original || DEFAULT_THUMBNAIL}
              alt={episode.attributes.canonicalTitle || `Episode ${episode.attributes.number}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_THUMBNAIL;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-semibold mb-1">
                Episode {episode.attributes.number}
              </h3>
              <p className="text-sm text-gray-300 line-clamp-1">
                {episode.attributes.canonicalTitle || `Episode ${episode.attributes.number}`}
              </p>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-sm text-gray-300 line-clamp-2">
              {episode.attributes.synopsis || 'Episode synopsis coming soon.'}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{episode.attributes.airdate ? 
                  new Date(episode.attributes.airdate).toLocaleDateString() : 
                  'Coming Soon'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Episode {episode.attributes.number}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};