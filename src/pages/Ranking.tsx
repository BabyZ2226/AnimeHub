import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Trophy, TrendingUp, ThumbsUp, Star, Calendar, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { fetchPopularAnime } from '../services/api';
import { LoadingScreen } from '../components/ui/LoadingScreen';

interface RankingPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

const getCurrentPeriod = (): RankingPeriod => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    id: `${startOfWeek.toISOString().split('T')[0]}_${endOfWeek.toISOString().split('T')[0]}`,
    name: 'Esta Semana',
    startDate: startOfWeek,
    endDate: endOfWeek
  };
};

const getPreviousPeriods = (): RankingPeriod[] => {
  const currentPeriod = getCurrentPeriod();
  const periods: RankingPeriod[] = [];

  for (let i = 1; i <= 3; i++) {
    const startDate = new Date(currentPeriod.startDate);
    startDate.setDate(startDate.getDate() - (7 * i));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    periods.push({
      id: `${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`,
      name: `Hace ${i} ${i === 1 ? 'semana' : 'semanas'}`,
      startDate,
      endDate
    });
  }

  return periods;
};

export const Ranking: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<RankingPeriod>(getCurrentPeriod());
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});

  const { data: animes, isLoading } = useQuery(
    ['popularAnime', selectedPeriod.id],
    fetchPopularAnime,
    { keepPreviousData: true }
  );

  const handleVote = (animeId: string) => {
    setUserVotes(prev => ({
      ...prev,
      [animeId]: !prev[animeId]
    }));
  };

  const getRankingChange = (currentRank: number): 'up' | 'down' | 'same' => {
    // Simulate ranking changes randomly for demo purposes
    const changes = ['up', 'down', 'same'];
    return changes[Math.floor(Math.random() * changes.length)] as 'up' | 'down' | 'same';
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Ranking de Animes
          </h1>
          <p className="text-xl text-gray-400">
            Los animes más populares según la comunidad
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setSelectedPeriod(getCurrentPeriod())}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedPeriod.id === getCurrentPeriod().id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Esta Semana
          </button>
          {getPreviousPeriods().map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod.id === period.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {period.name}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {animes?.map((anime, index) => {
            const rankChange = getRankingChange(index + 1);
            
            return (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all"
              >
                <div className="flex items-center p-4">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-16 text-center">
                        <div className={`text-2xl font-bold ${
                          index < 3 ? 'text-primary-500' : 'text-gray-400'
                        }`}>
                          #{index + 1}
                        </div>
                        <div className="flex justify-center mt-1">
                          {rankChange === 'up' && <ArrowUp className="w-4 h-4 text-green-500" />}
                          {rankChange === 'down' && <ArrowDown className="w-4 h-4 text-red-500" />}
                          {rankChange === 'same' && <Minus className="w-4 h-4 text-gray-500" />}
                        </div>
                      </div>
                      <div className="w-24 h-36 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={anime.attributes.posterImage.medium}
                          alt={anime.attributes.canonicalTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 hover:text-primary-500 cursor-pointer"
                          onClick={() => navigate(`/anime/${anime.id}`)}>
                        {anime.attributes.canonicalTitle}
                      </h3>
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{(parseFloat(anime.attributes.averageRating) / 10).toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(anime.attributes.startDate).getFullYear()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 1000) + 500} votos</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleVote(anime.id)}
                    className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                      userVotes[anime.id]
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>{userVotes[anime.id] ? 'Votado' : 'Votar'}</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary-500" />
            Hall de la Fama
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((position) => (
              <motion.div
                key={position}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: position * 0.2 }}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="text-lg font-semibold mb-2">
                  Top {position} de la Semana Pasada
                </div>
                <div className="text-sm text-gray-400">
                  {animes?.[position - 1]?.attributes.canonicalTitle}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};