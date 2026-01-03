import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Leaf, Bug, TreeDeciduous, Sparkles, Heart } from 'lucide-react';

function StatBar({ icon: Icon, label, value, maxValue = 100, color, delay = 0 }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="relative"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="ml-auto text-sm font-bold text-slate-800">{value}%</span>
      </div>
      
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Effet de brillance */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 2, delay: delay + 1, repeat: Infinity, repeatDelay: 5 }}
      >
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </motion.div>
    </motion.div>
  );
}

function AnimalCounter({ animals }) {
  const animalIcons = {
    bee: '🐝',
    butterfly: '🦋',
    ladybug: '🐞',
    bird: '🐦',
    hedgehog: '🦔',
    frog: '🐸',
    worm: '🪱',
    squirrel: '🐿️',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <Bug className="w-5 h-5 text-amber-600" />
        <span className="font-semibold text-slate-700">Animaux attirés</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {animals.length === 0 ? (
          <span className="text-sm text-slate-500 italic">
            Plante pour attirer des animaux ! 🌱
          </span>
        ) : (
          animals.map((animal, index) => (
            <motion.div
              key={animal.type}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full
                bg-gradient-to-r from-amber-100 to-orange-100
                border border-amber-200"
            >
              <span className="text-lg">{animalIcons[animal.type] || '🐾'}</span>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default function EcosystemStats({ garden }) {
  const { soil_health = 50, water_level = 50, biodiversity_points = 0, animals = [], level = 1 } = garden || {};

  return (
    <div className="p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl">
      {/* En-tête avec niveau */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg"
          >
            <TreeDeciduous className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-slate-800">Mon Écosystème</h3>
            <p className="text-sm text-slate-600">Niveau {level}</p>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-gradient-to-r from-amber-400 to-yellow-500
            text-white font-bold shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>{biodiversity_points}</span>
        </motion.div>
      </div>

      {/* Barres de statistiques */}
      <div className="space-y-4">
        <StatBar
          icon={Heart}
          label="Santé du sol"
          value={soil_health}
          color="from-emerald-400 to-green-500"
          delay={0}
        />
        <StatBar
          icon={Droplets}
          label="Niveau d'eau"
          value={water_level}
          color="from-blue-400 to-cyan-500"
          delay={0.1}
        />
        <StatBar
          icon={Leaf}
          label="Biodiversité"
          value={Math.min(biodiversity_points, 100)}
          color="from-purple-400 to-pink-500"
          delay={0.2}
        />
      </div>

      {/* Compteur d'animaux */}
      <AnimalCounter animals={animals} />
    </div>
  );
}