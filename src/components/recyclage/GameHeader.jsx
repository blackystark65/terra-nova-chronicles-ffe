import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, XCircle, Flame, Trophy } from 'lucide-react';

export default function GameHeader({ score, mistakes, streak, timeRemaining }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <div>
              <div className="text-xs opacity-80">Score</div>
              <div className="text-lg font-black">{score}</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <div>
              <div className="text-xs opacity-80">Erreurs</div>
              <div className="text-lg font-black">{mistakes}</div>
            </div>
          </div>
        </motion.div>
        
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5" />
              <div>
                <div className="text-xs opacity-80">Série</div>
                <div className="text-lg font-black">{streak}x</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {timeRemaining !== undefined && (
        <motion.div
          animate={{
            scale: timeRemaining < 10 ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 1, repeat: timeRemaining < 10 ? Infinity : 0 }}
          className={`px-6 py-2 rounded-xl shadow-lg ${
            timeRemaining < 10 ? 'bg-red-600' : 'bg-blue-600'
          } text-white`}
        >
          <div className="text-xs opacity-80">Temps restant</div>
          <div className="text-2xl font-black">{timeRemaining}s</div>
        </motion.div>
      )}
    </div>
  );
}