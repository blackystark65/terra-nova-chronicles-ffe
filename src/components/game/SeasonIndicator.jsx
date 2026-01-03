import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Snowflake, Leaf, Flower2 } from 'lucide-react';

const seasons = {
  spring: {
    name: 'Printemps',
    icon: Flower2,
    emoji: '🌸',
    gradient: 'from-pink-400 via-rose-400 to-fuchsia-400',
    bgGradient: 'from-green-100 to-emerald-100',
  },
  summer: {
    name: 'Été',
    icon: Sun,
    emoji: '☀️',
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
    bgGradient: 'from-amber-100 to-yellow-100',
  },
  autumn: {
    name: 'Automne',
    icon: Leaf,
    emoji: '🍂',
    gradient: 'from-orange-400 via-amber-500 to-red-400',
    bgGradient: 'from-orange-100 to-amber-100',
  },
  winter: {
    name: 'Hiver',
    icon: Snowflake,
    emoji: '❄️',
    gradient: 'from-blue-400 via-cyan-400 to-indigo-400',
    bgGradient: 'from-blue-100 to-indigo-100',
  },
};

export default function SeasonIndicator({ currentSeason, onSeasonChange }) {
  const season = seasons[currentSeason] || seasons.spring;
  const Icon = season.icon;

  const nextSeason = () => {
    const order = ['spring', 'summer', 'autumn', 'winter'];
    const currentIndex = order.indexOf(currentSeason);
    const nextIndex = (currentIndex + 1) % order.length;
    onSeasonChange(order[nextIndex]);
  };

  return (
    <motion.button
      onClick={nextSeason}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden
        flex items-center gap-3 px-6 py-3
        rounded-2xl
        bg-gradient-to-r ${season.gradient}
        text-white font-bold
        shadow-lg shadow-black/20
        border-2 border-white/30
      `}
    >
      {/* Fond animé */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        animate={{ rotate: currentSeason === 'winter' ? [0, 180, 360] : [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Icon className="w-6 h-6" />
      </motion.div>

      <span className="relative z-10">{season.name}</span>
      <span className="text-xl">{season.emoji}</span>

      {/* Particules saisonnières */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {currentSeason === 'winter' && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/60 text-xs"
                initial={{ y: -10, x: Math.random() * 100 }}
                animate={{ y: 60, x: Math.random() * 100 }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                ❄
              </motion.div>
            ))}
          </>
        )}
        {currentSeason === 'autumn' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-orange-200 text-xs"
                initial={{ y: -10, x: Math.random() * 100, rotate: 0 }}
                animate={{ y: 60, x: Math.random() * 100, rotate: 360 }}
                transition={{
                  duration: 3 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                🍃
              </motion.div>
            ))}
          </>
        )}
      </div>
    </motion.button>
  );
}