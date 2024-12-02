import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, 
  Users, 
  Star, 
  Calendar,
  Shield,
  Tv,
  Film,
  Play,
  Sword,
  Brain,
  Heart,
  Sparkles
} from 'lucide-react';
import { useQuery } from 'react-query';
import { fetchSeasonalAnime } from '../services/api';

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const DEMOGRAPHICS = [
  { name: 'Shounen', count: 320, percentage: 35, icon: Sword, color: 'from-blue-500 to-cyan-500' },
  { name: 'Seinen', count: 245, percentage: 27, icon: Brain, color: 'from-purple-500 to-indigo-500' },
  { name: 'Shoujo', count: 198, percentage: 22, icon: Heart, color: 'from-pink-500 to-rose-500' },
  { name: 'Josei', count: 145, percentage: 16, icon: Sparkles, color: 'from-amber-500 to-orange-500' }
];

const SEASONAL_STATS = [
  {
    season: 'Winter',
    stats: {
      totalAnime: 42,
      avgRating: 7.8,
      topGenres: ['Action', 'Drama', 'Fantasy'],
      color: 'from-blue-500 to-cyan-500'
    }
  },
  {
    season: 'Spring',
    stats: {
      totalAnime: 56,
      avgRating: 8.1,
      topGenres: ['Romance', 'Comedy', 'Slice of Life'],
      color: 'from-pink-500 to-rose-500'
    }
  },
  {
    season: 'Summer',
    stats: {
      totalAnime: 48,
      avgRating: 7.9,
      topGenres: ['Adventure', 'Sports', 'Comedy'],
      color: 'from-yellow-500 to-amber-500'
    }
  },
  {
    season: 'Fall',
    stats: {
      totalAnime: 51,
      avgRating: 8.2,
      topGenres: ['Mystery', 'Horror', 'Drama'],
      color: 'from-orange-500 to-red-500'
    }
  }
];

export const Insights: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trends');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: seasonalAnime } = useQuery(
    ['seasonalAnime', selectedYear],
    () => fetchSeasonalAnime('winter', selectedYear)
  );

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Anime Insights
          </h1>
          <p className="text-xl text-gray-400">
            Discover trends and statistics in the anime world
          </p>
        </motion.div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'trends'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Trends & Statistics
            </div>
          </button>
          <button
            onClick={() => setActiveTab('demographics')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'demographics'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Demographics
            </div>
          </button>
          <button
            onClick={() => setActiveTab('seasonal')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'seasonal'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Seasonal Analysis
            </div>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Yearly Trends */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-primary-500" />
                  Yearly Trends
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Releases', value: '1,245', trend: '+12%' },
                    { label: 'Average Rating', value: '7.8', trend: '+0.3' },
                    { label: 'Total Episodes', value: '15,678', trend: '+8%' },
                    { label: 'Active Studios', value: '156', trend: '+5%' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className={`text-sm ${
                        stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stat.trend}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Genre Distribution */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6">Genre Distribution</h3>
                <div className="space-y-4">
                  {[
                    { genre: 'Action', percentage: 75, count: 450 },
                    { genre: 'Romance', percentage: 65, count: 390 },
                    { genre: 'Comedy', percentage: 60, count: 360 },
                    { genre: 'Fantasy', percentage: 55, count: 330 },
                    { genre: 'Slice of Life', percentage: 45, count: 270 }
                  ].map((genre, index) => (
                    <motion.div
                      key={genre.genre}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span>{genre.genre}</span>
                        <span className="text-gray-400">{genre.count} anime</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${genre.percentage}%` }}
                          className="h-full bg-primary-500 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary-500" />
                  Rating Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[9, 8, 7, 6, 5].map((rating) => (
                    <motion.div
                      key={rating}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-700 p-4 rounded-lg text-center"
                    >
                      <div className="text-2xl font-bold mb-1">{rating}+</div>
                      <div className="text-sm text-gray-400">
                        {Math.floor(Math.random() * 100) + 50} anime
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'demographics' && (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Demographics Distribution */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  Demographics Distribution
                </h3>
                <div className="space-y-6">
                  {DEMOGRAPHICS.map((demo, index) => {
                    const Icon = demo.icon;
                    return (
                      <motion.div
                        key={demo.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-4 mb-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${demo.color}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-semibold">{demo.name}</span>
                              <div className="text-gray-400">
                                <span>{demo.count} anime</span>
                                <span className="mx-2">•</span>
                                <span>{demo.percentage}%</span>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${demo.percentage}%` }}
                                className={`h-full rounded-full bg-gradient-to-r ${demo.color}`}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Age Rating Distribution */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  Age Rating Distribution
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {['G', 'PG', 'PG-13', 'R', 'R+', 'Rx'].map((rating, index) => (
                    <motion.div
                      key={rating}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700 p-4 rounded-lg text-center"
                    >
                      <div className="text-2xl font-bold mb-1">{rating}</div>
                      <div className="text-sm text-gray-400">
                        {Math.floor(Math.random() * 100) + 50} titles
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Viewing Platform Stats */}
              <div className="bg-gray-800 rounded-xl p-6 md:col-span-2">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Tv className="w-5 h-5 text-primary-500" />
                  Viewing Platform Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: 'TV Series', count: 580, icon: Tv },
                    { name: 'Movies', count: 245, icon: Film },
                    { name: 'OVAs', count: 167, icon: Play },
                    { name: 'Specials', count: 98, icon: Star }
                  ].map((platform, index) => (
                    <motion.div
                      key={platform.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700 p-4 rounded-lg"
                    >
                      <platform.icon className="w-8 h-8 text-primary-500 mb-2" />
                      <div className="text-2xl font-bold">{platform.count}</div>
                      <div className="text-sm text-gray-400">{platform.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'seasonal' && (
            <motion.div
              key="seasonal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Year Selector */}
              <div className="flex justify-center gap-2 mb-8">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedYear === year
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              {/* Seasonal Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {SEASONAL_STATS.map((season, index) => (
                  <motion.div
                    key={season.season}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl p-6"
                  >
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${season.stats.color} mb-4`}>
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold mb-4">{season.season}</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Total Anime</div>
                        <div className="text-2xl font-bold">{season.stats.totalAnime}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Average Rating</div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {season.stats.avgRating}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Top Genres</div>
                        <div className="flex flex-wrap gap-2">
                          {season.stats.topGenres.map((genre) => (
                            <span
                              key={genre}
                              className="px-2 py-1 bg-gray-700 rounded-full text-xs"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Top Seasonal Picks */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  Top Seasonal Picks
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {seasonalAnime?.slice(0, 4).map((anime, index) => (
                    <motion.div
                      key={anime.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="aspect-[2/3] rounded-lg overflow-hidden">
                        <img
                          src={anime.attributes.posterImage.large}
                          alt={anime.attributes.canonicalTitle}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className="font-semibold mb-2 line-clamp-2">
                            {anime.attributes.canonicalTitle}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>
                              {(parseFloat(anime.attributes.averageRating) / 10).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};