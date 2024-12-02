import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCcw, Share2, BookmarkPlus, Star, Sparkles, Sword, Heart, Compass, Brain, Wand2, Coffee } from 'lucide-react';
import { useQuery } from 'react-query';
import { searchAnime } from '../services/api';
import { createQuestionnaire } from '../data/personalityQuestions';
import { LoadingScreen } from '../components/ui/LoadingScreen';

const QUESTIONNAIRE_CATEGORIES = [
  { 
    id: 'action', 
    name: 'Acción y Aventura', 
    description: 'Descubre qué anime de acción te representa más',
    icon: Sword,
    color: 'from-red-500 to-orange-500',
    bgImage: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800'
  },
  { 
    id: 'romance', 
    name: 'Romance', 
    description: 'Encuentra tu historia de amor anime ideal',
    icon: Heart,
    color: 'from-pink-500 to-purple-500',
    bgImage: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800'
  },
  { 
    id: 'mystery', 
    name: 'Misterio', 
    description: 'Explora los enigmas que más te intrigan',
    icon: Compass,
    color: 'from-indigo-500 to-blue-500',
    bgImage: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=800'
  },
  { 
    id: 'fantasy', 
    name: 'Fantasía', 
    description: 'Adéntrate en mundos mágicos y legendarios',
    icon: Wand2,
    color: 'from-purple-500 to-blue-500',
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800'
  },
  { 
    id: 'slice-of-life', 
    name: 'Slice of Life', 
    description: 'Descubre historias que reflejan la vida cotidiana',
    icon: Coffee,
    color: 'from-green-500 to-teal-500',
    bgImage: 'https://images.unsplash.com/photo-1523294587484-bae6cc870010?auto=format&fit=crop&w=800'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { when: "afterChildren" }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { y: -20, opacity: 0 }
};

export const PersonalityMatch: React.FC = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'start' | 'category' | 'quiz' | 'results'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: recommendedAnime, isLoading } = useQuery(
    ['recommendedAnime', answers],
    async () => {
      if (Object.keys(answers).length < (currentQuestionnaire?.questions.length || 10)) return null;
      
      const genreWeights = Object.entries(answers).reduce((acc, [questionId, answer]) => {
        const question = currentQuestionnaire?.questions.find(q => q.id === questionId);
        if (!question?.genreWeights) return acc;

        const answerIndex = question.options.indexOf(answer);
        if (answerIndex === -1) return acc;

        Object.entries(question.genreWeights[answerIndex]).forEach(([genre, weight]) => {
          acc[genre] = (acc[genre] || 0) + weight;
        });
        return acc;
      }, {} as Record<string, number>);

      const topGenres = Object.entries(genreWeights)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre);

      const results = await searchAnime('', { genres: topGenres }, 1, 4);
      return results.data;
    },
    { enabled: gameState === 'results' }
  );

  const handleCategorySelect = (categoryId: string) => {
    const category = QUESTIONNAIRE_CATEGORIES.find(c => c.id === categoryId);
    if (category) {
      const questionnaire = createQuestionnaire(
        category.name,
        category.description,
        categoryId
      );
      setCurrentQuestionnaire(questionnaire);
      setSelectedCategory(categoryId);
      setGameState('quiz');
      setCurrentQuestionIndex(0);
      setAnswers({});
    }
  };

  const handleAnswer = (answer: string) => {
    const question = currentQuestionnaire?.questions[currentQuestionIndex];
    if (!question) return;

    setAnswers(prev => ({
      ...prev,
      [question.id]: answer
    }));

    if (currentQuestionIndex < currentQuestionnaire.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('results');
    }
  };

  if (isLoading && gameState === 'results') {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div
              key="start"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center relative overflow-hidden"
            >
              <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920')] bg-cover bg-center"
              />
              <div className="relative z-10 backdrop-blur-sm bg-black/30 p-12 rounded-2xl">
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                </motion.div>
                <motion.h1 
                  variants={itemVariants}
                  className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent"
                >
                  Descubre tu Anime Ideal
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-xl text-gray-300 mb-8"
                >
                  Responde algunas preguntas y encuentra tu próximo anime favorito basado en tus gustos y personalidad
                </motion.p>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('category')}
                  className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-primary-500/20 transition-all duration-300"
                >
                  ¡Comenzar la Aventura!
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'category' && (
            <motion.div
              key="category"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-2xl mx-auto"
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent"
              >
                Elige tu Aventura
              </motion.h2>
              <div className="space-y-4">
                {QUESTIONNAIRE_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCategorySelect(category.id)}
                      className="relative w-full group overflow-hidden rounded-xl"
                    >
                      <div className="absolute inset-0">
                        <img 
                          src={category.bgImage} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
                      </div>
                      <div className="relative p-8 flex items-center">
                        <div className={`flex-shrink-0 inline-flex p-3 rounded-xl bg-gradient-to-r ${category.color} transform group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="ml-6 text-left">
                          <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-primary-400 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-200 group-hover:text-white transition-colors">
                            {category.description}
                          </p>
                        </div>
                        <ArrowRight className="w-6 h-6 ml-auto text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {gameState === 'quiz' && currentQuestionnaire && (
            <motion.div
              key="quiz"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-2xl mx-auto"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Pregunta {currentQuestionIndex + 1} de {currentQuestionnaire.questions.length}
                  </h2>
                  <div className="text-primary-500 font-semibold">
                    {Math.round(((currentQuestionIndex + 1) / currentQuestionnaire.questions.length) * 100)}%
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${((currentQuestionIndex + 1) / currentQuestionnaire.questions.length) * 100}%` 
                    }}
                    className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                  />
                </div>
              </motion.div>

              <motion.div
                key={currentQuestionIndex}
                variants={itemVariants}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl"
              >
                <h3 className="text-2xl mb-8 font-medium">
                  {currentQuestionnaire.questions[currentQuestionIndex].question}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestionnaire.questions[currentQuestionIndex].options.map((option: string, index: number) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02, x: 10 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option)}
                      className="p-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-left transition-all duration-300 flex items-center justify-between group"
                    >
                      <span className="text-lg">{option}</span>
                      <ArrowRight className="w-5 h-5 text-primary-500 transform group-hover:translate-x-2 transition-transform" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {gameState === 'results' && recommendedAnime && (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                  ¡Tus Animes Ideales!
                </h2>
                <p className="text-xl text-gray-300">
                  Hemos encontrado estas joyas que coinciden con tu personalidad
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedAnime.map((anime, index) => (
                  <motion.div
                    key={anime.id}
                    variants={itemVariants}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={anime.attributes.posterImage.large}
                        alt={anime.attributes.canonicalTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {anime.attributes.canonicalTitle}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{(parseFloat(anime.attributes.averageRating) / 10).toFixed(1)}</span>
                          </div>
                          <span>•</span>
                          <span>{anime.attributes.episodeCount} episodios</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-300 line-clamp-3 mb-4">
                        {anime.attributes.synopsis}
                      </p>
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/anime/${anime.id}`)}
                          className="flex-1 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                        >
                          Ver detalles
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <BookmarkPlus className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                variants={itemVariants}
                className="flex justify-center gap-4 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setGameState('start');
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setSelectedCategory(null);
                    setCurrentQuestionnaire(null);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Volver a intentar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                  Compartir resultados
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};