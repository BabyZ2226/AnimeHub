import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MoodCardProps {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

export const MoodCard: React.FC<MoodCardProps> = ({
  id,
  name,
  icon: Icon,
  color,
  isSelected,
  onClick
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-6 rounded-xl text-center transition-all ${
        isSelected
          ? 'bg-primary-500/20 ring-2 ring-primary-500'
          : 'bg-gray-800 hover:bg-gray-700'
      }`}
    >
      <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${color} mb-3`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="font-medium">{name}</p>
    </motion.button>
  );
};