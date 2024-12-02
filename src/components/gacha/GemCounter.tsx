import React from 'react';
import { motion } from 'framer-motion';
import { Diamond } from 'lucide-react';
import { useGachaStore } from '../../store/useGachaStore';

export const GemCounter: React.FC = () => {
  const { gems } = useGachaStore();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gray-800 px-6 py-3 rounded-full flex items-center gap-2"
    >
      <Diamond className="w-5 h-5 text-primary-500" />
      <span className="font-semibold">{gems}</span>
    </motion.div>
  );
};