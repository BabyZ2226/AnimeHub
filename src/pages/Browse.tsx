import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeCard } from '../components/ui/AnimeCard';
import { SearchBar } from '../components/browse/SearchBar';
import { Filters } from '../components/browse/Filters';
import { searchAnime } from '../services/api';
import { LoadingScreen } from '../components/ui/LoadingScreen';

const ITEMS_PER_PAGE = 20;

export const Browse: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genres: [],
    year: '',
    rating: '',
    minScore: 0,
  });

  const { data, isLoading } = useQuery(
    ['animeSearch', searchQuery, filters, currentPage, i18n.language],
    () => searchAnime(searchQuery, filters, currentPage, ITEMS_PER_PAGE, i18n.language),
    { 
      keepPreviousData: true,
      staleTime: 5000 
    }
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  const totalPages = Math.ceil((data?.meta?.count || 0) / ITEMS_PER_PAGE);
  const animeList = data?.data || [];

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate pagination range
  const getPaginationRange = () => {
    const range = [];
    const maxVisiblePages = 3; // Show only 3 pages at a time
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
        <div className="space-y-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
          />
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {animeList.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onClick={() => navigate(`/anime/${anime.id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {currentPage > 2 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
                  >
                    1
                  </button>
                  {currentPage > 3 && (
                    <span className="px-2 py-2 text-gray-500">...</span>
                  )}
                </>
              )}

              {getPaginationRange().map((pageNumber) => (
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
              ))}

              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <span className="px-2 py-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};