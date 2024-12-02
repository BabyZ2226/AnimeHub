import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, User } from 'lucide-react';
import type { AnimeReview } from '../../types/anime';

interface ReviewListProps {
  reviews: AnimeReview[];
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop';

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">Be the first to review this anime!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => {
        const rating = (review.attributes.rating / 2).toFixed(1);
        const displayRating = !isNaN(parseFloat(rating)) ? rating : 'Not rated';

        return (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {review.attributes.user?.avatar ? (
                    <img
                      src={review.attributes.user.avatar}
                      alt={review.attributes.user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{review.attributes.user?.name || 'Anonymous User'}</h4>
                  <p className="text-sm text-gray-400">
                    {new Date(review.attributes.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{displayRating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.attributes.likesCount || 0}</span>
                </div>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line line-clamp-3">
                {review.attributes.content || 'This user left their rating without a written review.'}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};