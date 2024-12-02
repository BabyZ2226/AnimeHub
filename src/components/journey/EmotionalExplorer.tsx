import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useQuery } from 'react-query';
import { searchAnime } from '../../services/api';
import { Card } from '../ui/Card';
import { MOOD_RECOMMENDATIONS } from '../../data/journeyData';

interface Props {
  mood: string | null;
  onMoodSelect: (mood: string) => void;
}

export const EmotionalExplorer: React.FC<Props> = ({ mood, onMoodSelect }) => {
  const navigate = useNavigate();

  const { data: animeRecommendations, isLoading } = useQuery(
    ['animeRecommendations', mood],
    async () => {
      if (!mood) return null;
      
      const moodConfig = MOOD_RECOMMENDATIONS[mood as keyof typeof MOOD_RECOMMENDATIONS];
      const results = await searchAnime('', { genres: moodConfig.genres }, 1, 6);
      return results.data;
    },
    { enabled: !!mood }
  );

  const moods = Object.entries(MOOD_RECOMMENDATIONS).map(([id, config]) => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    Icon: config.icon,
    color: config.color
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">¿Cómo te sientes hoy?</h2>
        <p className="text-gray-400">
          Selecciona tu estado de ánimo y te recomendaremos el anime perfecto
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {moods.map((moodOption) => {
          const Icon = moodOption.Icon;
          return (
            <motion.button
              key={moodOption.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMoodSelect(moodOption.id)}
              className={`p-6 rounded-xl text-center transition-all ${
                mood === moodOption.id
                  ? 'bg-primary-500/20 ring-2 ring-primary-500'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${moodOption.color} mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium">{moodOption.name}</p>
            </motion.button>
          );
        })}
      </div>

      {mood && animeRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold mb-6">Recomendaciones para ti</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {animeRecommendations.map((anime) => (
              <Card
                key={anime.id}
                className="relative aspect-[2/3] overflow-hidden cursor-pointer"
                onClick={() => navigate(`/anime/${anime.id}`)}
              >
                <img
                  src={anime.attributes.posterImage.large}
                  alt={anime.attributes.canonicalTitle}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-lg font-semibold mb-2">
                    {anime.attributes.canonicalTitle}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>
                      {(parseFloat(anime.attributes.averageRating) / 10).toFixed(1)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};