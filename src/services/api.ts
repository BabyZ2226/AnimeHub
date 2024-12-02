import axios from 'axios';
import type { Anime, AnimeEpisode, AnimeReview, AnimeCharacter } from '../types/anime';

interface SearchFilters {
  genres?: string[];
  year?: string;
  rating?: string;
  minScore?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    count: number;
  };
  links: {
    first: string;
    prev?: string;
    next?: string;
    last: string;
  };
}

const api = axios.create({
  baseURL: 'https://kitsu.io/api/edge',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  }
});

// Add response time optimization and error handling
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    'page[limit]': 20,
  };
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(new Error(error?.response?.data?.errors?.[0]?.detail || 'An error occurred'));
  }
);

const handleApiError = (error: any): never => {
  const message = error?.response?.data?.errors?.[0]?.detail || error.message || 'An error occurred';
  throw new Error(message);
};

export const searchAnime = async (
  query: string,
  filters: SearchFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Anime>> => {
  try {
    const params: Record<string, any> = {
      'page[limit]': limit,
      'page[offset]': (page - 1) * limit,
      'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres,youtubeVideoId',
      'include': 'genres',
    };

    if (query) {
      params['filter[text]'] = query;
    }

    if (filters.genres?.length) {
      params['filter[categories]'] = filters.genres.join(',');
    }

    if (filters.year) {
      params['filter[seasonYear]'] = filters.year;
    }

    if (filters.rating) {
      params['filter[ageRating]'] = filters.rating;
    }

    if (filters.minScore) {
      params['filter[averageRating]'] = `${filters.minScore * 20}..`;
    }

    const response = await api.get('/anime', { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchSeasonalAnime = async (season: string, year: number): Promise<Anime[]> => {
  try {
    const response = await api.get('/anime', {
      params: {
        'filter[season]': season,
        'filter[seasonYear]': year,
        'sort': '-averageRating',
        'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres,youtubeVideoId',
        'include': 'genres',
        'page[limit]': 20,
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchTrendingAnime = async (): Promise<Anime[]> => {
  try {
    const response = await api.get('/trending/anime', {
      params: {
        'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres,youtubeVideoId',
        'include': 'genres',
        'page[limit]': 20,
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchPopularAnime = async (): Promise<Anime[]> => {
  try {
    const response = await api.get('/anime', {
      params: {
        'sort': '-averageRating',
        'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres,youtubeVideoId',
        'include': 'genres',
        'page[limit]': 20,
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchAnimeDetails = async (id: string): Promise<Anime> => {
  try {
    const response = await api.get(`/anime/${id}`, {
      params: {
        'include': 'episodes,genres',
        'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres,youtubeVideoId',
        'fields[episodes]': 'canonicalTitle,synopsis,number,airdate,thumbnail',
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchAnimeCharacters = async (id: string): Promise<AnimeCharacter[]> => {
  try {
    const response = await api.get(`/anime/${id}/characters`, {
      params: {
        'include': 'character,character.castings,character.castings.person',
        'fields[characters]': 'name,image,description',
        'fields[castings]': 'role,voiceActor,language',
        'fields[people]': 'name,image',
        'page[limit]': 20,
      },
    });

    const characters = response.data.data;
    const included = response.data.included || [];

    return characters.map(character => {
      const characterData = included.find(
        inc => inc.type === 'characters' && inc.id === character.relationships.character.data.id
      );

      const casting = included.find(
        inc => inc.type === 'castings' && 
        inc.relationships?.character?.data?.id === characterData?.id &&
        inc.attributes.language === 'Japanese'
      );

      const voiceActor = casting ? included.find(
        inc => inc.type === 'people' && inc.id === casting.relationships.person.data.id
      ) : null;

      return {
        id: character.id,
        type: character.type,
        attributes: {
          role: character.attributes.role,
          character: {
            name: characterData?.attributes.name || 'Unknown',
            image: characterData?.attributes.image || undefined,
            description: characterData?.attributes.description || ''
          },
          voiceActor: voiceActor ? {
            name: voiceActor.attributes.name,
            image: voiceActor.attributes.image,
            language: 'Japanese'
          } : undefined
        }
      };
    });
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchAnimeEpisodes = async (id: string): Promise<AnimeEpisode[]> => {
  try {
    const response = await api.get(`/anime/${id}/episodes`, {
      params: {
        'page[limit]': 20,
        'sort': 'number',
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchAnimeGenres = async (id: string): Promise<any[]> => {
  try {
    const response = await api.get(`/anime/${id}/genres`, {
      params: {
        'page[limit]': 20,
        'sort': 'name',
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchAnimeReviews = async (id: string): Promise<AnimeReview[]> => {
  try {
    const response = await api.get(`/anime/${id}/reviews`, {
      params: {
        'page[limit]': 20,
        'sort': '-likesCount',
        'fields[reviews]': 'content,rating,likesCount,spoiler,createdAt',
        'fields[users]': 'name,avatar',
        'include': 'user',
      },
    });

    const reviews = response.data.data;
    const included = response.data.included || [];

    return reviews.map(review => {
      const userId = review.relationships?.user?.data?.id;
      const userData = included.find(inc => inc.type === 'users' && inc.id === userId);

      return {
        ...review,
        attributes: {
          ...review.attributes,
          user: userData ? {
            name: userData.attributes?.name || 'Anonymous User',
            avatar: userData.attributes?.avatar?.medium || null
          } : {
            name: 'Anonymous User',
            avatar: null
          }
        }
      };
    });
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchRelatedAnime = async (genres: string[], excludeId: string): Promise<Anime[]> => {
  try {
    const genreString = genres.join(',');
    const response = await api.get('/anime', {
      params: {
        'filter[categories]': genreString,
        'filter[id]': `!${excludeId}`,
        'sort': '-averageRating',
        'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres,youtubeVideoId',
        'include': 'genres',
        'page[limit]': 6,
      },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getRandomAnime = async (): Promise<Anime> => {
  try {
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const randomId = Math.floor(Math.random() * 50000) + 1;
        const response = await api.get(`/anime/${randomId}`, {
          params: {
            'include': 'genres',
            'fields[anime]': 'canonicalTitle,synopsis,posterImage,coverImage,averageRating,status,episodeCount,startDate,genres,youtubeVideoId'
          }
        });
        return response.data.data;
      } catch (error) {
        attempts++;
        if (attempts === maxAttempts) {
          throw new Error('Could not find a random anime after multiple attempts');
        }
      }
    }
    throw new Error('Could not find a random anime');
  } catch (error) {
    handleApiError(error);
  }
};