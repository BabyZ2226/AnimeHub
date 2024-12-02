import axios from 'axios';
import { decode } from 'html-entities';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  url: string;
  category: string;
}

const ANMOSUGOI_URL = 'https://www.anmosugoi.com/wp-json/wp/v2/posts';

const fetchAnmosugoiNews = async (page: number = 1, perPage: number = 10): Promise<NewsItem[]> => {
  try {
    const response = await axios.get(ANMOSUGOI_URL, {
      params: {
        page,
        per_page: perPage,
        _embed: true,
      },
    });

    return response.data.map((post: any) => ({
      id: post.id.toString(),
      title: decode(post.title.rendered),
      excerpt: decode(post.excerpt.rendered.replace(/<[^>]*>/g, '')),
      content: decode(post.content.rendered),
      imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop',
      date: new Date(post.date).toLocaleDateString(),
      url: post.link,
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'News'
    }));
  } catch (error) {
    console.error('Error fetching Anmosugoi news:', error);
    return [];
  }
};

export const fetchNews = async (page: number = 1, perPage: number = 10): Promise<NewsItem[]> => {
  try {
    const anmosugoiNews = await fetchAnmosugoiNews(page, perPage);
    return anmosugoiNews;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};