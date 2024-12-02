import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';
import type { UserReview } from '../../types/user';

interface UserReviewsProps {
  reviews: UserReview[];
}

export const UserReviews: React.FC<UserReviewsProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">You haven't written any reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800 rounded-lg overflow-hidden"
        >
          <div className="flex">
            <img
              src={review.animeCover}
              alt={review.animeTitle}
              className="w-32 object-cover"
            />
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{review.animeTitle}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{(review.rating / 20).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.likesCount}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 line-clamp-2">{review.content}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};