import React from 'react';
import { Filter } from 'lucide-react';

interface FiltersProps {
  filters: {
    genres: string[];
    year?: string;
    rating?: string;
    minScore?: number;
  };
  onFilterChange: (filters: FiltersProps['filters']) => void;
}

export const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
  const ratings = ['G', 'PG', 'R', 'R18'];
  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
    'Sports', 'Supernatural', 'Thriller'
  ];

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    onFilterChange({ ...filters, genres: newGenres });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Year</h4>
        <select
          value={filters.year || ''}
          onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
        >
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Age Rating</h4>
        <select
          value={filters.rating || ''}
          onChange={(e) => onFilterChange({ ...filters, rating: e.target.value })}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
        >
          <option value="">All Ratings</option>
          {ratings.map(rating => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Minimum Score</h4>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={filters.minScore || 0}
          onChange={(e) => onFilterChange({ ...filters, minScore: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="text-sm text-gray-400 text-center">
          {filters.minScore || 0} / 10
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Genres</h4>
        <div className="flex flex-wrap gap-2">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenreToggle(genre)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filters.genres.includes(genre)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};