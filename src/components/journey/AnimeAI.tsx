import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Brain, Loader, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { getAIResponse } from '../../services/ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AnimeAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: '¡Hola! Soy SenpaiAI, tu asistente personal de anime. Puedo ayudarte a encontrar nuevas series basadas en tus gustos, explicarte conceptos del anime o responder tus preguntas sobre cualquier serie. ¿En qué puedo ayudarte hoy?'
  }]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAIResponse(query);
      const aiMessage = { role: 'assistant' as const, content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setError('Lo siento, hubo un error al procesar tu pregunta. ¿Podrías intentarlo de nuevo?');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">SenpaiAI</h2>
        <p className="text-gray-400">
          Tu asistente personal para descubrir nuevo anime
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${
                  message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  message.role === 'assistant' ? 'bg-primary-500' : 'bg-gray-600'
                }`}>
                  {message.role === 'assistant' ? (
                    <Brain className="w-5 h-5" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                </div>
                <div className={`flex-1 p-4 rounded-lg ${
                  message.role === 'assistant' ? 'bg-gray-700' : 'bg-primary-500/20'
                }`}>
                  <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Recomiéndame un anime similar a Death Note..."
              className="flex-1 bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading}
              leftIcon={isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
            >
              {isLoading ? 'Pensando...' : 'Preguntar'}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};