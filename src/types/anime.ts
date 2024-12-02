export interface Anime {
  id: string;
  type: string;
  attributes: {
    canonicalTitle: string;
    synopsis: string;
    posterImage: {
      tiny: string;
      small: string;
      medium: string;
      large: string;
      original: string;
    };
    coverImage?: {
      tiny: string;
      small: string;
      large: string;
      original: string;
    };
    averageRating: string;
    status: string;
    episodeCount: number;
    startDate: string;
    ageRating: string;
    youtubeVideoId?: string;
    userCount?: number;
    genres?: {
      data: Array<{
        id: string;
        type: string;
        attributes: {
          name: string;
          slug?: string;
          description?: string;
        };
      }>;
    };
  };
  relationships?: {
    genres?: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
    categories?: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

export interface AnimeCharacter {
  id: string;
  type: string;
  attributes: {
    role: string;
    character: {
      name: string;
      image?: {
        original: string;
        small: string;
      };
      description: string;
    };
    voiceActor?: {
      name: string;
      image?: {
        original: string;
        small: string;
      };
      language: string;
    };
  };
}

export interface AnimeEpisode {
  id: string;
  type: string;
  attributes: {
    canonicalTitle: string;
    synopsis: string;
    number: number;
    airdate: string;
    thumbnail?: {
      original: string;
      small: string;
    };
  };
}

export interface AnimeGenre {
  id: string;
  type: string;
  attributes: {
    name: string;
    slug?: string;
    description?: string;
  };
}

export interface AnimeReview {
  id: string;
  type: string;
  attributes: {
    content: string;
    rating: number;
    likesCount: number;
    spoiler: boolean;
    createdAt: string;
    user: {
      name: string;
      avatar?: string | null;
    };
  };
}