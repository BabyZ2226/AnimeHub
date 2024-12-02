import React, { useEffect } from 'react';
import { Star, Clock, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Anime } from '../../types/anime';

interface HeroCarouselProps {
  animes: Anime[];
  onAnimeClick: (anime: Anime) => void;
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&auto=format&fit=crop';
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&auto=format&fit=crop';

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ animes, onAnimeClick }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === animes.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [animes.length]);

  const currentAnime = animes[currentIndex];

  if (!currentAnime) return null;

  const coverImage = currentAnime.attributes.coverImage?.large || 
                    currentAnime.attributes.posterImage?.large || 
                    DEFAULT_COVER;
  const posterImage = currentAnime.attributes.posterImage?.large || DEFAULT_POSTER;
  const title = currentAnime.attributes.canonicalTitle || 'Untitled Anime';
  const rating = parseFloat(currentAnime.attributes.averageRating || '0');
  const displayRating = !isNaN(rating) ? (rating / 10).toFixed(1) : 'Not rated';
  const episodeCount = currentAnime.attributes.episodeCount || 'Unknown';
  const startDate = currentAnime.attributes.startDate ? 
    new Date(currentAnime.attributes.startDate).getFullYear() : 
    'Coming Soon';
  const synopsis = currentAnime.attributes.synopsis || 'Synopsis not available yet.';

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAnime.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-8 flex items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="hidden lg:block w-80 rounded-xl overflow-hidden shadow-2xl hover:shadow-primary-500/20 transition-all duration-300"
            onClick={() => onAnimeClick(currentAnime)}
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={posterImage}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_POSTER;
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl"
          >
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6"
              >
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-6 h-6 fill-current animate-pulse-slow" />
                  <span className="text-lg font-medium">{displayRating}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5" />
                  <span>{episodeCount} Episodes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span>{startDate}</span>
                </div>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-6xl font-bold text-white leading-tight"
              >
                {title}
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xl text-gray-300 line-clamp-3"
              >
                {synopsis}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                onClick={() => onAnimeClick(currentAnime)}
                className="inline-flex items-center gap-2 text-white hover:text-primary-400 transition-colors group"
              >
                <span className="text-lg">View Details</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3">
          {animes.map((_, index) => (
            <motion.button
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'bg-primary-500 w-12' : 'bg-white/30 w-6 hover:bg-white/50'
              }`}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};