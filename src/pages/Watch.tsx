import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ChevronLeft, ChevronRight, List, Server } from 'lucide-react';
import { fetchAnimeDetails, fetchAnimeEpisodes } from '../services/api';
import { searchAnimeFlv, getEpisodeStreams } from '../services/animeflv';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { VideoPlayer } from '../components/video/VideoPlayer';

export const Watch: React.FC = () => {
  const { id, episode } = useParams<{ id: string; episode: string }>();
  const navigate = useNavigate();
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [showServers, setShowServers] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<number>(0);
  const [streams, setStreams] = useState<Array<{ url: string; server: string; quality?: string }>>([]);
  const [animeFlvId, setAnimeFlvId] = useState<string | null>(null);
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const { data: anime, isLoading: isLoadingAnime } = useQuery(
    ['anime', id],
    () => fetchAnimeDetails(id!)
  );

  const { data: episodes, isLoading: isLoadingEpisodes } = useQuery(
    ['episodes', id],
    () => fetchAnimeEpisodes(id!)
  );

  useEffect(() => {
    const initializeAnimeFlv = async () => {
      if (anime?.attributes?.canonicalTitle && !animeFlvId) {
        setError(null);
        try {
          const result = await searchAnimeFlv(anime.attributes.canonicalTitle);
          if (result?.id) {
            setAnimeFlvId(result.id);
          } else {
            setError('No streaming sources found for this anime');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.error('Failed to initialize AnimeFlv:', errorMessage);
          setError(`Unable to load streaming sources: ${errorMessage}`);
        }
      }
    };
    initializeAnimeFlv();
  }, [anime, animeFlvId]);

  useEffect(() => {
    const loadEpisodeStreams = async () => {
      if (animeFlvId && episode) {
        setIsLoadingStreams(true);
        setError(null);
        try {
          const episodeStreams = await getEpisodeStreams(animeFlvId, parseInt(episode, 10));
          setStreams(episodeStreams);
          if (episodeStreams.length > 0) {
            setVideoUrl(episodeStreams[selectedServer].url);
          } else {
            throw new Error('No available streams found for this episode');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.error('Failed to load episode streams:', errorMessage);
          setError(`Unable to load video streams: ${errorMessage}`);
          
          // Retry logic for stream loading
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000 * (retryCount + 1)); // Exponential backoff
          }
        } finally {
          setIsLoadingStreams(false);
        }
      }
    };
    loadEpisodeStreams();
  }, [animeFlvId, episode, selectedServer, retryCount]);

  if (isLoadingAnime || isLoadingEpisodes) {
    return <LoadingScreen />;
  }

  if (!anime || !episodes) return null;

  const currentEpisodeNumber = parseInt(episode!, 10);
  const currentEpisode = episodes.find(ep => ep.attributes.number === currentEpisodeNumber);
  
  const handleEpisodeChange = (newEpisode: number) => {
    if (newEpisode >= 1 && newEpisode <= anime.attributes.episodeCount) {
      setRetryCount(0); // Reset retry count on episode change
      navigate(`/watch/${id}/${newEpisode}`);
      setShowEpisodeList(false);
      setSelectedServer(0);
    }
  };

  const handleServerChange = (index: number) => {
    setSelectedServer(index);
    setRetryCount(0); // Reset retry count on server change
    if (streams[index]) {
      setVideoUrl(streams[index].url);
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
          {isLoadingStreams ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="loading-pulse">Loading video...</div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <p className="text-red-500">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : videoUrl ? (
            <VideoPlayer
              src={videoUrl}
              poster={currentEpisode?.attributes.thumbnail?.original}
              onNext={currentEpisodeNumber < anime.attributes.episodeCount ? 
                () => handleEpisodeChange(currentEpisodeNumber + 1) : undefined}
              onPrevious={currentEpisodeNumber > 1 ? 
                () => handleEpisodeChange(currentEpisodeNumber - 1) : undefined}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white">No video available</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowServers(!showServers)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Server className="w-5 h-5" />
            Select Server
          </button>

          {showServers && (
            <div className="flex flex-wrap gap-2">
              {streams.map((stream, index) => (
                <button
                  key={index}
                  onClick={() => handleServerChange(index)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedServer === index
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {stream.server} {stream.quality && `(${stream.quality})`}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => handleEpisodeChange(currentEpisodeNumber - 1)}
            disabled={currentEpisodeNumber <= 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous Episode
          </button>

          <button
            onClick={() => setShowEpisodeList(!showEpisodeList)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <List className="w-5 h-5" />
            Episode List
          </button>

          <button
            onClick={() => handleEpisodeChange(currentEpisodeNumber + 1)}
            disabled={currentEpisodeNumber >= anime.attributes.episodeCount}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next Episode
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {currentEpisode && (
          <div className="mt-6">
            <h1 className="text-2xl font-bold mb-2">
              {anime.attributes.canonicalTitle} - Episode {currentEpisode.attributes.number}
            </h1>
            <p className="text-gray-400">{currentEpisode.attributes.synopsis}</p>
          </div>
        )}

        {showEpisodeList && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Episodes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => handleEpisodeChange(ep.attributes.number)}
                  className={`relative group overflow-hidden rounded-lg ${
                    ep.attributes.number === currentEpisodeNumber
                      ? 'ring-2 ring-primary-600'
                      : ''
                  }`}
                >
                  <div className="aspect-video">
                    <img
                      src={ep.attributes.thumbnail?.original || anime.attributes.posterImage.large}
                      alt={ep.attributes.canonicalTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 flex flex-col justify-end">
                    <div className="font-semibold">Episode {ep.attributes.number}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};