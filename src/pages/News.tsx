import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Star, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchPopularAnime } from '../services/api';
import { fetchNews } from '../services/news';
import { NewsCard } from '../components/news/NewsCard';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export const News: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 9;

  const { data: news, isLoading: isLoadingNews } = useQuery(
    ['news', currentPage],
    () => fetchNews(currentPage, newsPerPage)
  );
  
  const { data: popularAnime, isLoading: isLoadingAnime } = useQuery(
    'popularAnime',
    fetchPopularAnime
  );

  if (isLoadingNews || isLoadingAnime) {
    return <LoadingScreen />;
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* News Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Anime News & Rankings
          </h1>
          <p className="text-xl text-gray-400">
            Stay updated with the latest anime news and top rankings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
          {/* News Feed */}
          <div className="space-y-8">
            {/* Featured News */}
            {news && news[0] && (
              <NewsCard news={news[0]} featured />
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news?.slice(1).map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(5)].map((_, i) => {
                const pageNumber = currentPage - 2 + i;
                if (pageNumber > 0) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-primary-600'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar with Rankings */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Top Anime Rankings
              </h2>
              <div className="space-y-4">
                {popularAnime?.slice(0, 5).map((anime, index) => (
                  <motion.div
                    key={anime.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="text-2xl font-bold text-gray-500 w-8">
                      #{index + 1}
                    </div>
                    <img
                      src={anime.attributes.posterImage.tiny}
                      alt={anime.attributes.canonicalTitle}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-2">
                        {anime.attributes.canonicalTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>
                            {(parseFloat(anime.attributes.averageRating) / 10).toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(anime.attributes.startDate).getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};