import React from 'react';
import { motion } from 'framer-motion';

interface TermCardProps {
  term: string;
  definition: string;
  index: number;
}

export const TermCard: React.FC<TermCardProps> = ({ term, definition, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800 p-6 rounded-xl hover:ring-2 hover:ring-primary-500/50 transition-all"
    >
      <h3 className="text-xl font-bold mb-2">{term}</h3>
      <p className="text-gray-400">{definition}</p>
    </motion.div>
  );
};