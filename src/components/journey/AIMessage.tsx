import React from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageCircle } from 'lucide-react';

interface AIMessageProps {
  role: 'user' | 'assistant';
  content: string;
  index: number;
}

export const AIMessage: React.FC<AIMessageProps> = ({ role, content, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex gap-4 ${
        role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
        role === 'assistant' ? 'bg-primary-500' : 'bg-gray-600'
      }`}>
        {role === 'assistant' ? (
          <Brain className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
      </div>
      <div className={`flex-1 p-4 rounded-lg ${
        role === 'assistant' ? 'bg-gray-700' : 'bg-primary-500/20'
      }`}>
        <p className="text-gray-200 whitespace-pre-wrap">{content}</p>
      </div>
    </motion.div>
  );
};