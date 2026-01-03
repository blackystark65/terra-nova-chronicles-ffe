import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { plantData } from './PlantCard';
import { Sparkles } from 'lucide-react';

const GRID_SIZE = 6;

export default function GardenGrid({ plants, onPlantDrop, season }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [synergies, setSynergies] = useState([]);

  const seasonColors = {
    spring: 'from-green-200 via-emerald-100 to-lime-200',
    summer: 'from-amber-100 via-yellow-100 to-orange-100',
    autumn: 'from-orange-200 via-amber-200 to-red-100',
    winter: 'from-blue-100 via-slate-100 to-indigo-100',
  };

  const handleDrop = (e, x, y) => {
    e.preventDefault();
    const plantType = e.dataTransfer.getData('plantType');
    if (plantType) {
      onPlantDrop(plantType, x, y);
      checkSynergies(plantType, x, y);
    }
    setHoveredCell(null);
  };

  const checkSynergies = (newPlant, x, y) => {
    // Vérifier les synergies avec les plantes adjacentes
    const adjacentCells = [
      { x: x - 1, y }, { x: x + 1, y },
      { x, y: y - 1 }, { x, y: y + 1 },
    ];

    const synergyPairs = {
      'corn-bean': '🌟 Synergie ! Le haricot grimpe sur le maïs',
      'bean-squash': '🌟 La courge protège les racines du haricot',
      'corn-squash': '🌟 Les trois sœurs travaillent ensemble !',
      'tomato-lavender': '🌟 La lavande protège les tomates',
      'sunflower-bean': '🌟 Les abeilles adorent cette combinaison',
      'tree-hedge': '🌟 Parfait pour l\'agroforesterie !',
    };

    adjacentCells.forEach(cell => {
      const adjacentPlant = plants.find(p => p.x === cell.x && p.y === cell.y);
      if (adjacentPlant) {
        const pairKey1 = `${newPlant}-${adjacentPlant.type}`;
        const pairKey2 = `${adjacentPlant.type}-${newPlant}`;
        const synergy = synergyPairs[pairKey1] || synergyPairs[pairKey2];
        if (synergy) {
          setSynergies(prev => [...prev, { message: synergy, id: Date.now() }]);
          setTimeout(() => {
            setSynergies(prev => prev.filter(s => s.id !== Date.now()));
          }, 3000);
        }
      }
    });
  };

  const getPlantAt = (x, y) => plants.find(p => p.x === x && p.y === y);

  return (
    <div className="relative">
      {/* Notifications de synergie */}
      <AnimatePresence>
        {synergies.map(synergy => (
          <motion.div
            key={synergy.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50
              bg-gradient-to-r from-amber-400 to-yellow-500
              text-white font-bold px-6 py-3 rounded-full
              shadow-lg shadow-amber-500/30
              flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {synergy.message}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Grille de jardin */}
      <div 
        className={`
          grid grid-cols-6 gap-2 p-6 rounded-3xl
          bg-gradient-to-br ${seasonColors[season]}
          shadow-2xl shadow-black/10
          border-4 border-white/50
          backdrop-blur-lg
        `}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const plant = getPlantAt(x, y);
          const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;

          return (
            <motion.div
              key={index}
              onDragOver={(e) => {
                e.preventDefault();
                setHoveredCell({ x, y });
              }}
              onDragLeave={() => setHoveredCell(null)}
              onDrop={(e) => handleDrop(e, x, y)}
              className={`
                aspect-square rounded-xl
                transition-all duration-300
                flex items-center justify-center
                ${plant 
                  ? 'bg-white/40' 
                  : isHovered 
                    ? 'bg-white/60 ring-4 ring-emerald-400/50' 
                    : 'bg-white/20 hover:bg-white/30'
                }
                border-2 border-dashed border-white/40
                cursor-pointer
              `}
              whileHover={{ scale: 1.05 }}
            >
              <AnimatePresence mode="wait">
                {plant && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="text-3xl md:text-4xl drop-shadow-lg"
                  >
                    {plantData[plant.type]?.emoji || '🌱'}
                    
                    {/* Indicateur de croissance */}
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2"
                      initial={{ width: 0 }}
                      animate={{ width: `${plant.growth || 0}%` }}
                    >
                      <div className="h-1 bg-emerald-500 rounded-full" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Éléments décoratifs animés */}
        <motion.div
          className="absolute top-4 right-4 text-2xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🦋
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 text-2xl"
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🐝
        </motion.div>
      </div>
    </div>
  );
}