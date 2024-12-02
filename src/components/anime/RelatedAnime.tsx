import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { fetchRelatedAnime } from '../../services/api';
import { AnimeCard } from '../ui/AnimeCard';
import type { Anime } from '../../types/anime';

interface RelatedAnimeProps {
  genres: string[];
  currentAnimeId: string;
}

export const RelatedAnime: React.FC<RelatedAnimeProps> = ({ genres, currentAnimeId }) => {
  const navigate = useNavigate();
  
  const { data: relatedAnime = [], isLoading } = useQuery(
    ['relatedAnime', currentAnimeId, genres],
    () => fetchRelatedAnime(genres, currentAnimeId),
    {
      enabled: genres.length > 0,
    }
  );

  if (isLoading || relatedAnime.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-6">You Might Also Like</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {relatedAnime.map((anime, index) => (
          <motion.div
            key={anime.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AnimeCard
              anime={anime}
              onClick={() => navigate(`/anime/${anime.id}`)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};