import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Share2 } from 'lucide-react';
import type { NewsItem } from '../../services/news';

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, featured = false }) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: news.title,
          text: news.excerpt,
          url: news.url,
        });
      } else {
        await navigator.clipboard.writeText(news.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all`}
    >
      <div className="relative aspect-video">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-4 mb-2">
            {featured && (
              <span className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
                Featured
              </span>
            )}
            <span className="text-gray-300 text-sm">
              {news.category}
            </span>
          </div>
        </div>
      </div>
      <div className={`p-${featured ? '6' : '4'}`}>
        <span className="text-gray-400 text-sm block mb-2">
          {news.date}
        </span>
        <h2 
          className={`${featured ? 'text-2xl' : 'text-lg'} font-bold mb-4 line-clamp-2`}
          dangerouslySetInnerHTML={{ __html: news.title }}
        />
        <p 
          className="text-gray-300 text-sm mb-4 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: news.excerpt }}
        />
        <div className="flex items-center justify-between">
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors"
          >
            Read More
            <ExternalLink className="w-4 h-4" />
          </a>
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};