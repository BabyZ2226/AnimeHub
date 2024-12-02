import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Puzzle, 
  Brain,
  ArrowRight,
  Globe,
  Compass,
  Sparkles,
  Book,
  BarChart2
} from 'lucide-react';
import { PersonalityMatch } from '../components/games/PersonalityMatch';
import { Animedle } from '../components/games/Animedle';
import { GuessAnime } from '../components/games/GuessAnime';
import { Journey } from '../pages/Journey';
import { Insights } from '../pages/Insights';
import { BackgroundSpotlight } from '../components/ui/BackgroundSpotlight';

type ActivityType = 'personality' | 'animedle' | 'guess' | 'insights' | 'journey' | null;

const activities = [
  {
    id: 'personality',
    name: 'Personality Match',
    description: 'Find your perfect anime based on your personality',
    icon: Brain,
    color: 'from-blue-500 to-purple-500',
    bgImage: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800'
  },
  {
    id: 'animedle',
    name: 'Animedle',
    description: 'Daily anime guessing game',
    icon: Puzzle,
    color: 'from-green-500 to-teal-500',
    bgImage: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800'
  },
  {
    id: 'guess',
    name: 'Guess Anime',
    description: 'Test your anime knowledge',
    icon: Gamepad2,
    color: 'from-orange-500 to-red-500',
    bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800'
  },
  {
    id: 'insights',
    name: 'Anime Insights',
    description: 'Discover trends and analytics in anime',
    icon: BarChart2,
    color: 'from-pink-500 to-rose-500',
    bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800'
  },
  {
    id: 'journey',
    name: 'Anime Journey',
    description: 'Explore the cultural and emotional aspects of anime',
    icon: Compass,
    color: 'from-indigo-500 to-sky-500',
    bgImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800'
  }
];

export const Entertainment: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const renderActivity = () => {
    switch (selectedActivity) {
      case 'personality':
        return <PersonalityMatch onBack={() => setSelectedActivity(null)} />;
      case 'animedle':
        return <Animedle onBack={() => setSelectedActivity(null)} />;
      case 'guess':
        return <GuessAnime onBack={() => setSelectedActivity(null)} />;
      case 'insights':
        return <Insights />;
      case 'journey':
        return <Journey />;
      default:
        return null;
    }
  };

  return (
    <BackgroundSpotlight className="min-h-screen pt-6 px-6 pb-12">
      <AnimatePresence mode="wait">
        {!selectedActivity ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex p-4 rounded-full bg-primary-500/20 mb-6"
              >
                <Sparkles className="w-8 h-8 text-primary-500" />
              </motion.div>
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent"
              >
                Entertainment Hub
              </motion.h1>
              <motion.p 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-400"
              >
                Discover fun activities and immerse yourself in the world of anime!
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                const isHovered = hoveredCard === activity.id;

                return (
                  <motion.button
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedActivity(activity.id as ActivityType)}
                    onMouseEnter={() => setHoveredCard(activity.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="relative group overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm p-6 text-left hover:ring-2 hover:ring-primary-500 transition-all duration-300"
                  >
                    <div className="absolute inset-0 opacity-50">
                      <img
                        src={activity.bgImage}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gray-900/80" />
                    </div>

                    <div className="relative z-10">
                      <motion.div
                        animate={{
                          scale: isHovered ? 1.1 : 1,
                          rotate: isHovered ? 5 : 0
                        }}
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${activity.color} mb-4 transform transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <motion.div
                        animate={{
                          x: isHovered ? 10 : 0
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <h3 className="text-2xl font-bold mb-2">{activity.name}</h3>
                        <p className="text-gray-400 mb-4">{activity.description}</p>
                      </motion.div>

                      <motion.div
                        animate={{
                          x: isHovered ? 10 : 0,
                          opacity: isHovered ? 1 : 0.7
                        }}
                        className="flex items-center text-primary-500 group-hover:translate-x-2 transition-transform"
                      >
                        <span className="mr-2">Start Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>

                    <motion.div
                      animate={{
                        opacity: isHovered ? 1 : 0
                      }}
                      className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent pointer-events-none"
                    />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            {renderActivity()}
          </motion.div>
        )}
      </AnimatePresence>
    </BackgroundSpotlight>
  );
};