import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { Search, HelpCircle, X, AlertTriangle, Trophy, Share2, Film } from 'lucide-react';
import { searchAnime, fetchAnimeDetails } from '../services/api';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { Button } from '../components/ui/Button';
import type { Anime } from '../types/anime';

interface GuessResult {
  anime: Anime;
  matches: {
    genres: boolean[];
    type: boolean;
    year: boolean;
    episodes: boolean;
    rating: boolean;
    status: boolean;
    ageRating: boolean;
  };
}

const getRandomAnime = async (): Promise<Anime> => {
  // Get a random page between 1 and 50
  const randomPage = Math.floor(Math.random() * 50) + 1;
  const response = await searchAnime('', {}, randomPage);
  const animes = response.data.filter(anime => 
    anime.attributes.canonicalTitle &&
    anime.attributes.startDate &&
    anime.attributes.episodeCount &&
    anime.attributes.status
  );
  return animes[Math.floor(Math.random() * animes.length)];
};

export const Animedle: React.FC = () => {
  const [targetAnime, setTargetAnime] = useState<Anime | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Anime[]>([]);

  const { data: searchData, isLoading: isLoadingResults } = useQuery(
    ['animeSearch', searchQuery],
    () => searchAnime(searchQuery),
    {
      enabled: isSearching,
      staleTime: 60000,
    }
  );

  useEffect(() => {
    const initializeGame = async () => {
      const anime = await getRandomAnime();
      setTargetAnime(anime);
    };
    initializeGame();
  }, []);

  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData.data);
      setIsSearching(false);
    }
  }, [searchData]);

  const handleSearch = () => {
    if (!searchQuery.trim() || !targetAnime) return;
    setIsSearching(true);
  };

  const handleGuess = async (guessedAnime: Anime) => {
    if (!targetAnime) return;

    const targetYear = new Date(targetAnime.attributes.startDate).getFullYear();
    const guessedYear = new Date(guessedAnime.attributes.startDate).getFullYear();

    // Compare characteristics
    const matches = {
      genres: targetAnime.attributes.genres?.data.map(targetGenre =>
        guessedAnime.attributes.genres?.data.some(
          guessedGenre => guessedGenre.attributes.name === targetGenre.attributes.name
        )
      ) || [],
      type: guessedAnime.type === targetAnime.type,
      year: guessedYear === targetYear,
      episodes: guessedAnime.attributes.episodeCount === targetAnime.attributes.episodeCount,
      rating: Math.abs(
        parseFloat(guessedAnime.attributes.averageRating) -
        parseFloat(targetAnime.attributes.averageRating)
      ) <= 5,
      status: guessedAnime.attributes.status === targetAnime.attributes.status,
      ageRating: guessedAnime.attributes.ageRating === targetAnime.attributes.ageRating,
    };

    const newGuess: GuessResult = {
      anime: guessedAnime,
      matches,
    };

    setGuesses(prev => [newGuess, ...prev]);
    setSearchQuery('');
    setSearchResults([]);

    // Check if won
    if (guessedAnime.id === targetAnime.id) {
      setGameWon(true);
      setGameOver(true);
    }
  };

  const handleGiveUp = () => {
    setGameOver(true);
  };

  const handleNewGame = () => {
    getRandomAnime().then(anime => {
      setTargetAnime(anime);
      setGuesses([]);
      setGameWon(false);
      setGameOver(false);
      setShowHint(false);
      setHintsUsed(0);
      setSearchQuery('');
      setSearchResults([]);
    });
  };

  const handleShare = async () => {
    if (!targetAnime) return;

    const guessCount = guesses.length;
    const hintsText = hintsUsed > 0 ? ` with ${hintsUsed} hint${hintsUsed > 1 ? 's' : ''}` : '';
    const shareText = gameWon
      ? `I guessed today's Animedle in ${guessCount} tries${hintsText}! Can you beat that?`
      : `I couldn't guess today's Animedle. Can you do better?`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Animedle',
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        // Show success message
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!targetAnime) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Animedle
          </h1>
          <p className="text-xl text-gray-400">
            Guess the mystery anime based on characteristics
          </p>
        </motion.div>

        {!gameOver && (
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length >= 3) {
                    setIsSearching(true);
                  } else {
                    setSearchResults([]);
                  }
                }}
                placeholder="Enter anime name..."
                className="w-full bg-gray-800 text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  disabled={guesses.length < 3 || hintsUsed >= 3}
                >
                  <HelpCircle className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGiveUp}
                >
                  Give Up
                </Button>
              </div>
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-96 overflow-y-auto"
                >
                  {searchResults.map((anime) => (
                    <button
                      key={anime.id}
                      onClick={() => handleGuess(anime)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center gap-4 transition-colors"
                    >
                      <img
                        src={anime.attributes.posterImage.tiny}
                        alt={anime.attributes.canonicalTitle}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{anime.attributes.canonicalTitle}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(anime.attributes.startDate).getFullYear()} • {anime.attributes.episodeCount} episodes
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {isLoadingResults && (
              <div className="mt-4 text-center text-gray-400">
                Searching...
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-gray-800 p-6 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hint {hintsUsed + 1}/3</h3>
                  {hintsUsed === 0 && (
                    <p className="text-gray-300">{targetAnime.attributes.synopsis}</p>
                  )}
                  {hintsUsed === 1 && targetAnime.attributes.genres?.data[0] && (
                    <p className="text-gray-300">
                      Primary genre: {targetAnime.attributes.genres.data[0].attributes.name}
                    </p>
                  )}
                  {hintsUsed === 2 && (
                    <p className="text-gray-300">
                      Released in {new Date(targetAnime.attributes.startDate).getFullYear()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowHint(false);
                    setHintsUsed(prev => prev + 1);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-gray-800 rounded-lg text-center"
          >
            {gameWon ? (
              <>
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-gray-300 mb-4">
                  You guessed it in {guesses.length} tries
                  {hintsUsed > 0 && ` with ${hintsUsed} hint${hintsUsed > 1 ? 's' : ''}`}!
                </p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Game Over</h2>
                <p className="text-gray-300 mb-2">
                  The anime was: {targetAnime.attributes.canonicalTitle}
                </p>
              </>
            )}
            
            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={handleNewGame}>
                Play Again
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                leftIcon={<Share2 className="w-5 h-5" />}
              >
                Share
              </Button>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          {guesses.map((guess, index) => (
            <motion.div
              key={`${guess.anime.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                  {guess.anime.attributes.canonicalTitle}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Type</div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      guess.matches.type
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {guess.anime.type}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Year</div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      guess.matches.year
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {new Date(guess.anime.attributes.startDate).getFullYear()}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Episodes</div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      guess.matches.episodes
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {guess.anime.attributes.episodeCount}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Status</div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      guess.matches.status
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {guess.anime.attributes.status}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Rating</div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      guess.matches.rating
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {(parseFloat(guess.anime.attributes.averageRating) / 10).toFixed(1)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Age Rating</div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      guess.matches.ageRating
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {guess.anime.attributes.ageRating || 'N/A'}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-400 mb-1">Genres</div>
                    <div className="flex flex-wrap gap-2">
                      {guess.anime.attributes.genres?.data.map((genre, i) => (
                        <span
                          key={genre.id}
                          className={`px-3 py-1 rounded-full text-sm ${
                            guess.matches.genres[i]
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {genre.attributes.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};