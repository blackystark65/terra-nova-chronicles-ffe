import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function XPBar({ level, currentXP, nextLevelXP }) {
  const percentage = currentXP / nextLevelXP * 100;

  return (
    <div className="relative">
      {/* Jauge inspirée d'une tige de plante */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"
            animate={{
              boxShadow: [
              '0 0 20px rgba(16, 185, 129, 0.5)',
              '0 0 30px rgba(16, 185, 129, 0.8)',
              '0 0 20px rgba(16, 185, 129, 0.5)']

            }}
            transition={{ duration: 2, repeat: Infinity }}>

            <span className="text-white font-bold text-sm">{level}</span>
          </motion.div>
          
          {/* Particules autour du niveau */}
          {[...Array(3)].map((_, i) =>
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-300"
            style={{
              top: '50%',
              left: '50%'
            }}
            animate={{
              x: [0, (i - 1) * 15],
              y: [0, -15 + i * 5],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }} />

          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-emerald-300">Éco-Citoyen</span>
            <span className="text-xs text-emerald-400/70">{currentXP}/{nextLevelXP} XP</span>
          </div>
          
          {/* Barre de progression organique */}
          <div className="h-2 rounded-full bg-emerald-950/50 overflow-hidden border border-emerald-700/30">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 relative"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}>

              {/* Effet de flux lumineux */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />

            </motion.div>
          </div>
        </div>

        {percentage >= 95 &&
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 0.5 }}
          className="text-yellow-400">

            <Sparkles className="w-5 h-5" />
          </motion.div>
        }
      </div>
    </div>);

}