import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Star, Leaf, Droplets, Bug, TreeDeciduous, Mountain } from 'lucide-react';

const badgeIcons = {
  // Exploration
  first_explorer:     { icon: Star,           color: 'from-yellow-400 to-amber-500',   name: 'Premier Explorateur' },
  ocean_guardian:     { icon: Droplets,        color: 'from-blue-400 to-cyan-500',      name: 'Gardien des Océans' },
  forest_protector:   { icon: TreeDeciduous,   color: 'from-green-400 to-emerald-500',  name: 'Protecteur des Forêts' },
  mountain_explorer:  { icon: Mountain,        color: 'from-slate-400 to-gray-500',     name: 'Explorateur des Sommets' },
  // Biodiversité & Climat
  biodiversity_expert:{ icon: Bug,             color: 'from-purple-400 to-pink-500',    name: 'Expert Biodiversité' },
  climate_warrior:    { icon: Leaf,            color: 'from-teal-400 to-emerald-500',   name: 'Guerrier du Climat' },
  // Recyclage
  recycling_beginner: { icon: Leaf,            color: 'from-green-400 to-emerald-500',  name: 'Recycleur Débutant' },
  recycling_expert:   { icon: Star,            color: 'from-emerald-400 to-teal-500',   name: 'Expert du Tri' },
  perfect_sorter:     { icon: Award,           color: 'from-yellow-400 to-orange-500',  name: 'Tri Parfait' },
  eco_warrior:        { icon: Shield,          color: 'from-purple-400 to-pink-500',    name: 'Guerrier Éco' },
  // Ferme
  farmer_apprentice:  { icon: Leaf,            color: 'from-lime-400 to-green-600',     name: 'Apprenti Fermier' },
  master_farmer:      { icon: Award,           color: 'from-amber-400 to-orange-600',   name: 'Maître Fermier' },
  // Quiz
  quiz_champion:      { icon: Star,            color: 'from-indigo-400 to-violet-500',  name: 'Champion des Quiz' },
};

export default function BadgeDisplay({ badge, size = 'md', showName = false, locked = false }) {
  const badgeData = badgeIcons[badge] || {
    icon: Award,
    color: 'from-gray-400 to-gray-500',
    name: 'Badge Mystère',
  };

  const Icon = badgeData.icon;
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        whileHover={{ scale: locked ? 1 : 1.1, rotate: locked ? 0 : 5 }}
        whileTap={{ scale: locked ? 1 : 0.95 }}
        className="relative group cursor-pointer"
      >
        {/* Badge principal */}
        <div className={`
          ${sizes[size]} rounded-2xl
          ${locked 
            ? 'bg-gradient-to-br from-gray-700 to-gray-800 grayscale opacity-50' 
            : `bg-gradient-to-br ${badgeData.color}`
          }
          flex items-center justify-center
          shadow-lg
          ${!locked && 'shadow-emerald-500/30'}
          border-2 border-white/20
          backdrop-blur-sm
        `}>
          <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : size === 'xl' ? 'w-10 h-10' : 'w-6 h-6'} text-white`} />
        </div>

        {/* Effet bioluminescent pour badges débloqués */}
        {!locked && (
          <>
            <motion.div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${badgeData.color} opacity-0 group-hover:opacity-30`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Particules */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-cyan-300 opacity-0 group-hover:opacity-100"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [(i - 1) * 10, (i - 1) * 20],
                  y: [-10 - i * 5, -20 - i * 10],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </>
        )}

        {/* Cadenas pour badges verrouillés */}
        {locked && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-gray-400 text-lg">🔒</div>
          </motion.div>
        )}
      </motion.div>

      {/* Nom du badge */}
      {showName && (
        <span className={`text-xs text-center ${locked ? 'text-gray-500' : 'text-emerald-300'} font-medium max-w-[100px]`}>
          {locked ? '???' : badgeData.name}
        </span>
      )}
    </div>
  );
}

export { badgeIcons };