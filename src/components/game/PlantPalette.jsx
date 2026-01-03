import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlantCard, { plantData } from './PlantCard';
import { ChevronDown, ChevronUp, Sprout, TreeDeciduous } from 'lucide-react';

const categories = {
  vegetables: {
    name: 'Légumes',
    icon: '🥬',
    plants: ['tomato', 'corn', 'bean', 'squash'],
  },
  flowers: {
    name: 'Fleurs',
    icon: '🌸',
    plants: ['sunflower', 'lavender'],
  },
  trees: {
    name: 'Arbres & Haies',
    icon: '🌳',
    plants: ['tree', 'hedge'],
  },
};

export default function PlantPalette({ onDragStart, draggingPlant }) {
  const [expandedCategory, setExpandedCategory] = useState('vegetables');

  return (
    <div className="p-4 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-slate-800">Mes Plantes</h3>
      </div>

      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        Glisse les plantes sur le jardin pour créer ton écosystème ! 
        Combine-les intelligemment pour découvrir des synergies 🌟
      </p>

      <div className="space-y-3">
        {Object.entries(categories).map(([key, category]) => (
          <div key={key}>
            <motion.button
              onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
              className={`
                w-full flex items-center justify-between
                px-4 py-3 rounded-xl
                transition-all duration-300
                ${expandedCategory === key 
                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 shadow-md' 
                  : 'bg-white/50 hover:bg-white/70'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{category.icon}</span>
                <span className="font-semibold text-slate-700">{category.name}</span>
                <span className="text-xs text-slate-500">({category.plants.length})</span>
              </div>
              {expandedCategory === key ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </motion.button>

            <AnimatePresence>
              {expandedCategory === key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3 pt-3 pb-1">
                    {category.plants.map((plantType) => (
                      <PlantCard
                        key={plantType}
                        type={plantType}
                        onDragStart={onDragStart}
                        isDragging={draggingPlant === plantType}
                        small
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Conseil du jour */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200"
      >
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <p className="text-xs text-amber-800">
            <strong>Le savais-tu ?</strong> Le maïs, le haricot et la courge forment 
            "Les Trois Sœurs" - une technique ancestrale de permaculture !
          </p>
        </div>
      </motion.div>
    </div>
  );
}