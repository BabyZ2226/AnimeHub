import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { useGachaStore } from '../../store/useGachaStore';
import { GachaCard } from './GachaCard';

interface PullHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PullHistory: React.FC<PullHistoryProps> = ({ isOpen, onClose }) => {
  const { pulledCards } = useGachaStore();
  const [filter, setFilter] = React.useState<string>('all');

  const calculateRarity = (rating: number) => {
    if (rating >= 8.7) return 'legendary';
    if (rating >= 8.5) return 'mythic';
    if (rating >= 8.1) return 'rare';
    if (rating >= 8.0) return 'normal';
    return 'common';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10';
      case 'mythic': return 'border-purple-500 bg-purple-500/10';
      case 'rare': return 'border-blue-500 bg-blue-500/10';
      case 'normal': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const filteredCards = React.useMemo(() => {
    if (filter === 'all') return pulledCards;
    return pulledCards.filter(card => {
      const rating = parseFloat(card.attributes.averageRating);
      const rarity = calculateRarity(rating);
      return rarity === filter;
    });
  }, [pulledCards, filter]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
        >
          <div className="min-h-screen pt-20 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Collection</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  All Cards
                </button>
                {['legendary', 'mythic', 'rare', 'normal', 'common'].map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => setFilter(rarity)}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize whitespace-nowrap ${
                      filter === rarity
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {rarity}
                  </button>
                ))}
              </div>

              {filteredCards.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredCards.map((card, index) => {
                    const rarity = calculateRarity(parseFloat(card.attributes.averageRating));
                    return (
                      <motion.div
                        key={`${card.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <GachaCard
                          anime={card}
                          rarity={rarity}
                          rarityColor={getRarityColor(rarity)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No cards found for this filter.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};