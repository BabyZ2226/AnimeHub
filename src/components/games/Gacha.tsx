import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Gacha as GachaPage } from '../../pages/Gacha';

interface GachaProps {
  onBack: () => void;
}

export const Gacha: React.FC<GachaProps> = ({ onBack }) => {
  return (
    <div>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </motion.button>
      
      <GachaPage />
    </div>
  );
};