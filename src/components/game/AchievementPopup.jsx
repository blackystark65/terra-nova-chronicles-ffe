import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Leaf, Bug, TreeDeciduous, Droplets } from 'lucide-react';

const achievements = {
  first_plant: {
    title: "Premier Pas",
    description: "Tu as planté ta première graine !",
    icon: "🌱",
    color: "from-green-400 to-emerald-500",
  },
  three_sisters: {
    title: "Les Trois Sœurs",
    description: "Tu as découvert la synergie ancestrale !",
    icon: "👩‍👩‍👧",
    color: "from-amber-400 to-orange-500",
  },
  bee_friend: {
    title: "Ami des Abeilles",
    description: "Tu as attiré ta première abeille !",
    icon: "🐝",
    color: "from-yellow-400 to-amber-500",
  },
  forest_guardian: {
    title: "Gardien de la Forêt",
    description: "Tu as planté 5 arbres !",
    icon: "🌳",
    color: "from-emerald-500 to-green-600",
  },
  biodiversity_master: {
    title: "Maître de la Biodiversité",
    description: "Ton jardin déborde de vie !",
    icon: "🦋",
    color: "from-purple-400 to-pink-500",
  },
  soil_healer: {
    title: "Guérisseur du Sol",
    description: "La santé de ton sol est parfaite !",
    icon: "💚",
    color: "from-teal-400 to-cyan-500",
  },
};

export default function AchievementPopup({ achievement, onClose }) {
  if (!achievement) return null;

  const data = achievements[achievement] || {
    title: "Succès !",
    description: "Tu as accompli quelque chose d'incroyable !",
    icon: "🏆",
    color: "from-amber-400 to-yellow-500",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0, y: -100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: -100 }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
      >
        <motion.div
          className={`
            relative overflow-hidden
            px-8 py-6 rounded-3xl
            bg-gradient-to-r ${data.color}
            text-white
            shadow-2xl shadow-black/30
          `}
          animate={{
            boxShadow: [
              '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
              '0 25px 50px -12px rgba(255, 215, 0, 0.5)',
              '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Particules de célébration */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-200 pointer-events-none"
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 200 - 50}%`,
                y: `${Math.random() * 200 - 50}%`,
                scale: [0, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2,
                delay: i * 0.05,
                ease: 'easeOut',
              }}
            >
              ✨
            </motion.div>
          ))}

          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl"
            >
              {data.icon}
            </motion.div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-yellow-200" />
                <span className="text-sm font-medium text-white/80">NOUVEAU SUCCÈS !</span>
              </div>
              <h3 className="text-xl font-bold">{data.title}</h3>
              <p className="text-sm text-white/90">{data.description}</p>
            </div>
          </div>

          {/* Bouton fermer */}
          <motion.button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}