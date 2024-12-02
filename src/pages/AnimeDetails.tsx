import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Plus, Star, Calendar, Clock, Tag, Users, MessageCircle, Check, Play, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { fetchAnimeDetails, fetchAnimeEpisodes, fetchAnimeGenres, fetchAnimeReviews, fetchAnimeCharacters } from '../services/api';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { EpisodeList } from '../components/anime/EpisodeList';
import { ReviewList } from '../components/anime/ReviewList';
import { CharacterList } from '../components/anime/CharacterList';
import { RelatedAnime } from '../components/anime/RelatedAnime';
import { Button } from '../components/ui/Button';

type TabType = 'episodes' | 'characters' | 'reviews';

export const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showListModal, setShowListModal] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('episodes');
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { lists, addAnimeToList, removeAnimeFromList } = useStore();

  const { data: anime, isLoading: isLoadingAnime } = useQuery(
    ['anime', id],
    () => fetchAnimeDetails(id!)
  );

  const { data: episodes, isLoading: isLoadingEpisodes } = useQuery(
    ['episodes', id],
    () => fetchAnimeEpisodes(id!),
    { enabled: !!id }
  );

  const { data: genres, isLoading: isLoadingGenres } = useQuery(
    ['genres', id],
    () => fetchAnimeGenres(id!),
    { enabled: !!id }
  );

  const { data: reviews, isLoading: isLoadingReviews } = useQuery(
    ['reviews', id],
    () => fetchAnimeReviews(id!),
    { enabled: !!id }
  );

  const { data: characters, isLoading: isLoadingCharacters } = useQuery(
    ['characters', id],
    () => fetchAnimeCharacters(id!),
    { enabled: !!id }
  );

  if (isLoadingAnime || isLoadingEpisodes || isLoadingGenres || isLoadingReviews || isLoadingCharacters) {
    return <LoadingScreen />;
  }

  if (!anime || !id) return null;

  const isInList = (listId: string) => {
    return lists.find(list => list.id === listId)?.animes.includes(id);
  };

  const handleListAction = (listId: string) => {
    if (isInList(listId)) {
      removeAnimeFromList(listId, id);
    } else {
      addAnimeToList(listId, id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const genreNames = genres?.map(genre => genre.attributes.name) || [];
  const youtubeId = anime.attributes.youtubeVideoId;

  const limitedEpisodes = showAllEpisodes ? episodes : episodes?.slice(0, 2);
  const limitedCharacters = showAllCharacters ? characters : characters?.slice(0, 2);
  const limitedReviews = showAllReviews ? reviews : reviews?.slice(0, 2);

  const renderViewMoreButton = (
    isExpanded: boolean,
    totalCount: number,
    onClick: () => void,
    type: string
  ) => (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full mt-4"
      leftIcon={<ChevronDown className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
    >
      {isExpanded ? 'Show Less' : `View All ${totalCount} ${type}`}
    </Button>
  );

  return (
    <div className="min-h-screen">
      <div
        className="h-[50vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${anime.attributes.coverImage?.large || anime.attributes.posterImage.large})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-72 flex-shrink-0"
          >
            <img
              src={anime.attributes.posterImage.large}
              alt={anime.attributes.canonicalTitle}
              className="w-full rounded-lg shadow-lg card-hover"
            />

            {youtubeId && (
              <button
                onClick={() => setShowTrailer(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Play className="w-5 h-5" />
                Watch Trailer
              </button>
            )}

            <div className="mt-6 space-y-4 bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5 text-primary-500" />
                <span>Released: {formatDate(anime.attributes.startDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5 text-primary-500" />
                <span>Episodes: {anime.attributes.episodeCount}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Tag className="w-5 h-5 text-primary-500" />
                <span>Status: {anime.attributes.status}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5 text-primary-500" />
                <span>Age Rating: {anime.attributes.ageRating}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowListModal(true)}
              className="mt-4 w-full button-glow flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add to List
            </motion.button>
          </motion.div>

          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4 gradient-text"
            >
              {anime.attributes.canonicalTitle}
            </motion.h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-full">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>{(parseFloat(anime.attributes.averageRating) / 10).toFixed(1)}</span>
              </div>
              <div className="bg-gray-800 px-3 py-1 rounded-full">
                {anime.attributes.status}
              </div>
              <div className="bg-gray-800 px-3 py-1 rounded-full">
                {anime.attributes.episodeCount} Episodes
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors"
                  >
                    {genre.attributes.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              {anime.attributes.synopsis}
            </p>

            <div className="border-b border-gray-700 mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`px-4 py-2 font-semibold transition-colors relative ${
                    activeTab === 'episodes' ? 'text-primary-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Episodes
                  </div>
                  {activeTab === 'episodes' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('characters')}
                  className={`px-4 py-2 font-semibold transition-colors relative ${
                    activeTab === 'characters' ? 'text-primary-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Characters
                  </div>
                  {activeTab === 'characters' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-2 font-semibold transition-colors relative ${
                    activeTab === 'reviews' ? 'text-primary-500' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Reviews
                  </div>
                  {activeTab === 'reviews' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                    />
                  )}
                </button>
              </div>
            </div>

            {activeTab === 'episodes' && (
              <div>
                <EpisodeList episodes={limitedEpisodes || []} />
                {episodes && episodes.length > 2 && renderViewMoreButton(
                  showAllEpisodes,
                  episodes.length,
                  () => setShowAllEpisodes(!showAllEpisodes),
                  'Episodes'
                )}
              </div>
            )}
            
            {activeTab === 'characters' && (
              <div>
                <CharacterList characters={limitedCharacters || []} />
                {characters && characters.length > 2 && renderViewMoreButton(
                  showAllCharacters,
                  characters.length,
                  () => setShowAllCharacters(!showAllCharacters),
                  'Characters'
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <ReviewList reviews={limitedReviews || []} />
                {reviews && reviews.length > 2 && renderViewMoreButton(
                  showAllReviews,
                  reviews.length,
                  () => setShowAllReviews(!showAllReviews),
                  'Reviews'
                )}
              </div>
            )}

            <RelatedAnime genres={genreNames} currentAnimeId={id} />
          </div>
        </div>
      </div>

      {showListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-96 glass"
          >
            <h3 className="text-xl font-semibold mb-4">My Lists</h3>
            <div className="space-y-2">
              {lists.map((list) => (
                <motion.button
                  key={list.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleListAction(list.id)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  <span>{list.name}</span>
                  {isInList(list.id) && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => setShowListModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {showTrailer && youtubeId && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              Close
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};