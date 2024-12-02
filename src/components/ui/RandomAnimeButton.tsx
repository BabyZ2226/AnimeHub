import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useQuery } from 'react-query';
import { getRandomAnime } from '../../services/api';

export const RandomAnimeButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { refetch, isLoading } = useQuery('randomAnime', getRandomAnime, {
    enabled: false,
    retry: 3,
    onSuccess: (data) => {
      navigate(`/anime/${data.id}`);
    }
  });

  if (location.pathname !== '/') return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-20 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={() => refetch()}
        disabled={isLoading}
        className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
      >
        <Shuffle className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
};