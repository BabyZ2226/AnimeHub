import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { CULTURAL_LOCATIONS } from '../../data/journeyData';

export const CulturalExplorer: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Viaje Cultural por Japón</h2>
        <p className="text-gray-400">
          Explora las ubicaciones reales que inspiraron tus animes favoritos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CULTURAL_LOCATIONS.map((location) => (
          <Card
            key={location.title}
            className="overflow-hidden group cursor-pointer"
          >
            <div className="aspect-video relative">
              <img
                src={location.image}
                alt={location.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold mb-1">{location.title}</h3>
                <p className="text-sm text-gray-300 mb-2">
                  Aparece en: {location.anime}
                </p>
                <p className="text-gray-400">{location.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};