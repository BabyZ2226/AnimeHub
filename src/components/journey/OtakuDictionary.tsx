import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { OTAKU_TERMS } from '../../data/journeyData';

export const OtakuDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = OTAKU_TERMS.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Diccionario Otaku</h2>
        <p className="text-gray-400">
          Aprende los términos más importantes del mundo del anime
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar término..."
          className="w-full bg-gray-800 text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTerms.map((term, index) => (
          <motion.div
            key={term.term}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 p-6 rounded-xl hover:ring-2 hover:ring-primary-500/50 transition-all"
          >
            <h3 className="text-xl font-bold mb-2">{term.term}</h3>
            <p className="text-gray-400">{term.definition}</p>
          </motion.div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center text-gray-400">
          No se encontraron términos que coincidan con tu búsqueda.
        </div>
      )}
    </motion.div>
  );
};