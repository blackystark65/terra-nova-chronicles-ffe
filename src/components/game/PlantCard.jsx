import React from 'react';
import { motion } from 'framer-motion';

const plantData = {
  tomato: { name: 'Tomate', emoji: '🍅', color: 'from-red-400 to-red-600', benefit: 'Attire les pollinisateurs' },
  corn: { name: 'Maïs', emoji: '🌽', color: 'from-yellow-400 to-amber-500', benefit: 'Support naturel pour haricots' },
  bean: { name: 'Haricot', emoji: '🫘', color: 'from-green-400 to-green-600', benefit: 'Fixe l\'azote dans le sol' },
  squash: { name: 'Courge', emoji: '🎃', color: 'from-orange-400 to-orange-600', benefit: 'Couvre le sol, garde l\'humidité' },
  sunflower: { name: 'Tournesol', emoji: '🌻', color: 'from-yellow-300 to-yellow-500', benefit: 'Attire les abeilles' },
  lavender: { name: 'Lavande', emoji: '💜', color: 'from-purple-400 to-purple-600', benefit: 'Repousse les parasites' },
  tree: { name: 'Arbre fruitier', emoji: '🌳', color: 'from-emerald-500 to-emerald-700', benefit: 'Ombre et refuge pour animaux' },
  hedge: { name: 'Haie', emoji: '🌿', color: 'from-lime-400 to-lime-600', benefit: 'Protège du vent' },
};

export default function PlantCard({ type, onDragStart, isDragging, small = false }) {
  const plant = plantData[type] || plantData.tomato;

  return (
    <motion.div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative cursor-grab active:cursor-grabbing
        ${small ? 'p-2' : 'p-4'}
        rounded-2xl
        bg-gradient-to-br ${plant.color}
        shadow-lg shadow-black/10
        backdrop-blur-sm
        border border-white/30
        transition-all duration-300
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-md" />
      
      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className={`${small ? 'text-2xl' : 'text-4xl'} drop-shadow-lg`}>
          {plant.emoji}
        </span>
        <span className={`font-bold text-white drop-shadow ${small ? 'text-xs' : 'text-sm'}`}>
          {plant.name}
        </span>
        {!small && (
          <span className="text-[10px] text-white/80 text-center leading-tight mt-1">
            {plant.benefit}
          </span>
        )}
      </div>

      {/* Particules décoratives */}
      <motion.div
        className="absolute -top-1 -right-1 w-3 h-3 bg-white/40 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

export { plantData };