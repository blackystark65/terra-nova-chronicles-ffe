import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function BinWithLevel({ binType, binInfo, level, onDrop, canEmpty }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const isFull = level >= 100;
  const isAlmostFull = level >= 80;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(binType)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative ${binInfo.color} rounded-2xl p-4 text-white cursor-pointer
        transition-all ${isFull ? 'opacity-60 cursor-not-allowed' : ''}
      `}
    >
      {isFull && (
        <div className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 z-10">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className="text-4xl mb-2">{binInfo.emoji}</div>
      <div className="text-sm font-bold mb-1">{binInfo.name}</div>
      
      {/* Jauge de remplissage */}
      <div className="bg-black/30 rounded-full h-3 overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          className={`h-full ${
            isFull ? 'bg-red-500' :
            isAlmostFull ? 'bg-orange-400' :
            'bg-green-400'
          }`}
        />
      </div>
      
      <div className="text-xs opacity-80 text-center">
        {isFull ? '🚫 PLEINE!' : isAlmostFull ? '⚠️ Presque pleine' : `${Math.round(level)}%`}
      </div>
      
      {isFull && canEmpty && isHovered && (
        <div className="absolute inset-0 bg-emerald-600 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm font-bold">Cliquer pour vider</div>
          </div>
        </div>
      )}
    </motion.div>
  );
}