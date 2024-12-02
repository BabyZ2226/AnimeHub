import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { AnimeCard } from '../components/ui/AnimeCard';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { fetchSeasonalAnime } from '../services/api';

const seasons = [
  { name: 'winter', months: [12, 1, 2], color: 'from-blue-500 to-cyan-400' },
  { name: 'spring', months: [3, 4, 5], color: 'from-pink-500 to-rose-400' },
  { name: 'summer', months: [6, 7, 8], color: 'from-yellow-500 to-orange-400' },
  { name: 'fall', months: [9, 10, 11], color: 'from-amber-500 to-red-400' }
] as const;

type Season = typeof seasons[number]['name'];

const getCurrentSeason = (): { season: Season; year: number } => {
  const now = new Date();
  const month = now.getMonth() + 1; // JavaScript months are 0-based
  const year = now.getFullYear();
  
  const currentSeason = seasons.find(season => 
    season.months.includes(month)
  )?.name || 'winter';

  return { season: currentSeason, year };
};

const getSeasonDates = (season: Season, year: number) => {
  const seasonInfo = seasons.find(s => s.name === season)!;
  const startMonth = seasonInfo.months[0];
  const endMonth = seasonInfo.months[seasonInfo.months.length - 1];
  
  // Adjust year for winter season which starts in December
  const startYear = season === 'winter' && startMonth === 12 ? year - 1 : year;
  const endYear = season === 'winter' && endMonth < 3 ? year : year;

  return {
    start: new Date(startYear, startMonth - 1, 1),
    end: new Date(endYear, endMonth - 1, new Date(year, endMonth, 0).getDate())
  };
};

export const Seasonal: React.FC = () => {
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(getCurrentSeason().year);
  const [currentSeason, setCurrentSeason] = useState<Season>(getCurrentSeason().season);

  const { data: animes, isLoading } = useQuery(
    ['seasonal', currentSeason, currentYear],
    () => fetchSeasonalAnime(currentSeason, currentYear),
    { keepPreviousData: true }
  );

  const seasonDates = getSeasonDates(currentSeason, currentYear);
  const seasonColor = seasons.find(s => s.name === currentSeason)?.color || 'from-gray-500 to-gray-400';

  const handleSeasonChange = (direction: 'prev' | 'next') => {
    let newSeasonIndex = seasons.findIndex(s => s.name === currentSeason);
    let newYear = currentYear;

    if (direction === 'next') {
      if (newSeasonIndex === seasons.length - 1) {
        newSeasonIndex = 0;
        newYear++;
      } else {
        newSeasonIndex++;
      }
    } else {
      if (newSeasonIndex === 0) {
        newSeasonIndex = seasons.length - 1;
        newYear--;
      } else {
        newSeasonIndex--;
      }
    }

    setCurrentSeason(seasons[newSeasonIndex].name);
    setCurrentYear(newYear);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r ${seasonColor} mb-4`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span className="capitalize">{currentSeason} {currentYear}</span>
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
              Seasonal Anime Calendar
            </h1>
            
            <p className="text-gray-400">
              {seasonDates.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
              {seasonDates.end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
            <button
              onClick={() => handleSeasonChange('prev')}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSeasonChange('next')}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {animes?.map((anime, index) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <AnimeCard
                anime={anime}
                onClick={() => navigate(`/anime/${anime.id}`)}
              />
              
              {anime.attributes.startDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {new Date(anime.attributes.startDate).toLocaleDateString('en-US', { 
                    month: 'short',
                    day: 'numeric'
                  })}
                </motion.div>
              )}

              {anime.attributes.averageRating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {(parseFloat(anime.attributes.averageRating) / 10).toFixed(1)}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {animes?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No anime found for this season.</p>
          </div>
        )}
      </div>
    </div>
  );
};