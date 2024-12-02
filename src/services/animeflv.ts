import axios from 'axios';
import * as cheerio from 'cheerio';

const ANIMEFLV_BASE = 'https://www3.animeflv.net';
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest='
];

interface AnimeEpisodeStream {
  url: string;
  server: string;
  quality?: string;
}

interface AnimeInfo {
  id: string;
  title: string;
  episodes: number;
  status: string;
  type: string;
  cover: string;
}

const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
});

async function tryWithDifferentProxies(url: string): Promise<any> {
  let lastError;
  
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await axiosInstance.get(proxy + encodeURIComponent(url));
      if (response.data) {
        return response;
      }
    } catch (error) {
      lastError = error;
      continue;
    }
  }
  
  throw new Error(lastError?.message || 'Failed to fetch data from all proxies');
}

const extractVideoServers = async (url: string): Promise<AnimeEpisodeStream[]> => {
  try {
    const response = await tryWithDifferentProxies(url);
    if (!response.data) {
      throw new Error('No data received from server');
    }

    const $ = cheerio.load(response.data);
    const servers: AnimeEpisodeStream[] = [];
    let foundVideos = false;

    $('script').each((_, elem) => {
      const content = $(elem).html() || '';
      if (content.includes('var videos =')) {
        try {
          const videosMatch = content.match(/var videos = ([^;]+);/);
          if (videosMatch && videosMatch[1]) {
            foundVideos = true;
            const videosData = JSON.parse(videosMatch[1]);
            
            Object.entries(videosData).forEach(([server, urls]: [string, any]) => {
              if (typeof urls === 'string' && urls.trim()) {
                servers.push({
                  url: urls.trim(),
                  server,
                  quality: 'HD'
                });
              } else if (Array.isArray(urls)) {
                urls.forEach((url: string) => {
                  if (url && typeof url === 'string' && url.trim()) {
                    servers.push({
                      url: url.trim(),
                      server,
                      quality: 'HD'
                    });
                  }
                });
              }
            });
          }
        } catch (e) {
          console.error('Error parsing video data:', e);
        }
      }
    });

    if (!foundVideos) {
      throw new Error('No video sources found on the page');
    }

    const validServers = servers.filter(server => server.url && isValidStreamUrl(server.url));
    
    if (validServers.length === 0) {
      throw new Error('No valid video streams found');
    }

    return validServers;
  } catch (error) {
    console.error('Error extracting video servers:', error);
    throw error;
  }
};

const isValidStreamUrl = (url: string): boolean => {
  const invalidPatterns = [
    'redirector.googlevideo.com',
    'storage.googleapis.com',
    'undefined',
    'null',
    'about:blank'
  ];
  
  const validProtocols = ['http://', 'https://', '//'];
  const hasValidProtocol = validProtocols.some(protocol => 
    url.toLowerCase().startsWith(protocol)
  );
  
  return hasValidProtocol && 
         !invalidPatterns.some(pattern => url.includes(pattern)) &&
         url.length > 10;
};

export const searchAnimeFlv = async (title: string): Promise<AnimeInfo | null> => {
  if (!title) {
    throw new Error('Title is required for search');
  }
  
  try {
    const response = await tryWithDifferentProxies(
      `${ANIMEFLV_BASE}/browse?q=${encodeURIComponent(title)}`
    );
    
    if (!response.data) {
      throw new Error('No search results received');
    }

    const $ = cheerio.load(response.data);
    const firstResult = $('.ListAnimes article').first();
    
    if (firstResult.length === 0) {
      return null;
    }

    const id = firstResult.find('a').attr('href')?.split('/').pop() || '';
    if (!id) {
      throw new Error('Invalid anime ID found');
    }

    const cover = firstResult.find('img').attr('src') || '';
    const titleText = firstResult.find('.Title').text().trim();
    const type = firstResult.find('.Type').text().trim();
    const episodeCount = parseInt(firstResult.find('.Episode').text(), 10) || 12;

    return {
      id,
      title: titleText,
      episodes: episodeCount,
      status: 'Ongoing',
      type,
      cover: cover.startsWith('//') ? `https:${cover}` : cover
    };
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};

export const getEpisodeStreams = async (animeId: string, episode: number): Promise<AnimeEpisodeStream[]> => {
  if (!animeId || !episode) {
    throw new Error('Anime ID and episode number are required');
  }

  try {
    const episodeUrl = `${ANIMEFLV_BASE}/ver/${animeId}-${episode}`;
    const servers = await extractVideoServers(episodeUrl);

    return servers.map(server => ({
      ...server,
      url: server.url.startsWith('//') ? `https:${server.url}` : server.url
    }));
  } catch (error) {
    console.error('Error getting episode streams:', error);
    throw error;
  }
};

export const getAnimeDetails = async (animeId: string): Promise<AnimeInfo | null> => {
  if (!animeId) {
    throw new Error('Anime ID is required');
  }

  try {
    const response = await tryWithDifferentProxies(`${ANIMEFLV_BASE}/anime/${animeId}`);
    if (!response.data) {
      throw new Error('No anime details received');
    }

    const $ = cheerio.load(response.data);

    const title = $('.AnimeName').text().trim();
    if (!title) {
      throw new Error('Invalid anime page - title not found');
    }

    const synopsis = $('.Description p').text().trim();
    const cover = $('.AnimeCover img').attr('src') || '';
    const type = $('.Type').text().trim();
    const status = $('.Status').text().trim();
    const genres = $('.Nvgnrs a').map((_, el) => $(el).text().trim()).get();
    
    const episodes = $('.Episodes li').map((_, el) => ({
      number: parseInt($(el).find('.Num').text(), 10),
      title: $(el).find('.Title').text().trim()
    })).get();

    return {
      id: animeId,
      title,
      synopsis,
      cover: cover.startsWith('//') ? `https:${cover}` : cover,
      type,
      status,
      genres,
      episodes: episodes.sort((a, b) => a.number - b.number)
    };
  } catch (error) {
    console.error('Error getting anime details:', error);
    throw error;
  }
};