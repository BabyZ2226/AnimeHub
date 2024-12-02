import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { Sparkles, Diamond, Album, Gift, Crown } from 'lucide-react';
import { fetchPopularAnime } from '../services/api';
import { useGachaStore } from '../store/useGachaStore';
import { GachaMachine } from '../components/gacha/GachaMachine';
import { GachaCard } from '../components/gacha/GachaCard';
import { PullHistory } from '../components/gacha/PullHistory';
import { GemCounter } from '../components/gacha/GemCounter';
import { Button } from '../components/ui/Button';
import { LoadingScreen } from '../components/ui/LoadingScreen';

export const Gacha: React.FC = () => {
  const [showPullAnimation, setShowPullAnimation] = useState(false);
  const [pulledCards, setPulledCards] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { gems, pullCount, addPulledCard, incrementPullCount } = useGachaStore();

  const { data: animePool, isLoading } = useQuery(
    'animePool',
    () => fetchPopularAnime(),
    {
      staleTime: Infinity,
    }
  );

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

  const performPull = (amount: number) => {
    if (!animePool) return;
    
    const cost = amount === 10 ? 450 : 50;
    if (gems < cost) return;

    setShowPullAnimation(true);
    
    // Simulate gacha pull with rarity weights
    const pulls = Array(amount).fill(null).map(() => {
      const rand = Math.random() * 100;
      let pool;
      
      if (rand < 60) pool = animePool.filter(a => parseFloat(a.attributes.averageRating) <= 79);
      else if (rand < 80) pool = animePool.filter(a => parseFloat(a.attributes.averageRating) === 80);
      else if (rand < 92) pool = animePool.filter(a => parseFloat(a.attributes.averageRating) >= 81 && parseFloat(a.attributes.averageRating) <= 83);
      else if (rand < 98) pool = animePool.filter(a => parseFloat(a.attributes.averageRating) >= 85 && parseFloat(a.attributes.averageRating) <= 86);
      else pool = animePool.filter(a => parseFloat(a.attributes.averageRating) >= 87);

      const randomIndex = Math.floor(Math.random() * pool.length);
      return pool[randomIndex];
    });

    // Apply pity system
    if (amount === 10) {
      const hasRareOrBetter = pulls.some(card => 
        parseFloat(card.attributes.averageRating) >= 8.1
      );
      
      if (!hasRareOrBetter) {
        const randomIndex = Math.floor(Math.random() * 10);
        const rarePool = animePool.filter(a => 
          parseFloat(a.attributes.averageRating) >= 8.1 &&
          parseFloat(a.attributes.averageRating) <= 8.3
        );
        pulls[randomIndex] = rarePool[Math.floor(Math.random() * rarePool.length)];
      }
    }

    // Apply 50-pull pity
    if (pullCount >= 49) {
      const mythicPool = animePool.filter(a => 
        parseFloat(a.attributes.averageRating) >= 8.5
      );
      pulls[pulls.length - 1] = mythicPool[Math.floor(Math.random() * mythicPool.length)];
      incrementPullCount(-50); // Reset pity counter
    }

    setPulledCards(pulls);
    pulls.forEach(card => addPulledCard(card));
    incrementPullCount(amount);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Anime Gacha
          </h1>
          <p className="text-xl text-gray-400">
            Collect your favorite anime posters!
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <GemCounter />
        </div>

        <AnimatePresence>
          {showPullAnimation ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            >
              <div className="max-w-7xl w-full px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {pulledCards.map((card, index) => {
                    const rarity = calculateRarity(parseFloat(card.attributes.averageRating));
                    return (
                      <motion.div
                        key={`${card.id}-${index}`}
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1, 
                          y: 0,
                          transition: { delay: index * 0.2 }
                        }}
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: pulledCards.length * 0.2 + 1 }}
                  className="mt-8 flex justify-center"
                >
                  <Button
                    onClick={() => {
                      setShowPullAnimation(false);
                      setPulledCards([]);
                    }}
                  >
                    Continue
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <GachaMachine />

              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={() => performPull(1)}
                  disabled={gems < 50}
                  leftIcon={<Diamond className="w-5 h-5" />}
                  className="w-full max-w-md"
                >
                  Single Pull (50 Gems)
                </Button>
                <Button
                  onClick={() => performPull(10)}
                  disabled={gems < 450}
                  leftIcon={<Sparkles className="w-5 h-5" />}
                  variant="primary"
                  className="w-full max-w-md"
                >
                  10x Pull (450 Gems)
                </Button>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowHistory(true)}
                    variant="outline"
                    leftIcon={<Album className="w-5 h-5" />}
                  >
                    Collection
                  </Button>
                  {pullCount === 0 && (
                    <Button
                      onClick={() => performPull(10)}
                      variant="primary"
                      leftIcon={<Gift className="w-5 h-5" />}
                    >
                      First 10x Pull Free!
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Legendary</h3>
                  <p className="text-sm text-gray-400">2% chance</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Crown className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Mythic</h3>
                  <p className="text-sm text-gray-400">6% chance</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Crown className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Rare</h3>
                  <p className="text-sm text-gray-400">12% chance</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Crown className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Normal</h3>
                  <p className="text-sm text-gray-400">20% chance</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <Crown className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Common</h3>
                  <p className="text-sm text-gray-400">60% chance</p>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        <PullHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>
    </div>
  );
};