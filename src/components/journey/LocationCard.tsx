import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface LocationCardProps {
  title: string;
  anime: string;
  image: string;
  description: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  title,
  anime,
  image,
  description
}) => {
  return (
    <Card className="overflow-hidden group cursor-pointer">
      <div className="aspect-video relative">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-sm text-gray-300 mb-2">
            Aparece en: {anime}
          </p>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </Card>
  );
};