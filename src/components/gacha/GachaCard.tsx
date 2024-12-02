import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Anime } from '../../types/anime';

interface GachaCardProps {
  anime: Anime;
  rarity: string;
  rarityColor: string;
}

export const GachaCard: React.FC<GachaCardProps> = ({ anime, rarity, rarityColor }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative aspect-[2/3] rounded-xl overflow-hidden border-2 ${rarityColor}`}
    >
      <img
        src={anime.attributes.posterImage.large}
        alt={anime.attributes.canonicalTitle}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-sm font-semibold mb-2 line-clamp-2">
          {anime.attributes.canonicalTitle}
        </h3>
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span>{(parseFloat(anime.attributes.averageRating) / 10).toFixed(1)}</span>
        </div>
      </div>

      <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold capitalize bg-black/50 backdrop-blur-sm">
        {rarity}
      </div>

      {(rarity === 'legendary' || rarity === 'mythic') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent pointer-events-none"
        />
      )}
    </motion.div>
  );
};