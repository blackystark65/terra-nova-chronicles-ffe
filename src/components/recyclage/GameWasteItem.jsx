import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

export default function GameWasteItem({ waste, onSort, isUrgent }) {
  const [isDragging, setIsDragging] = React.useState(false);
  
  const timeElapsed = Date.now() - new Date(waste.timestamp).getTime();
  const urgencyLevel = timeElapsed > 30000 ? 'critical' : timeElapsed > 15000 ? 'warning' : 'normal';
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: isSelected ? 1.15 : 1, 
        rotate: 0,
        y: urgencyLevel === 'critical' ? [0, -5, 0] : 0
      }}
      transition={{ 
        type: "spring",
        y: { duration: 0.5, repeat: urgencyLevel === 'critical' ? Infinity : 0 }
      }}
      whileHover={{ scale: 1.05 }}
      className={`
        relative cursor-pointer
        bg-white rounded-2xl p-4 shadow-lg border-4 transition-all
        ${isSelected ? 'border-cyan-500 shadow-2xl shadow-cyan-500/50' :
          urgencyLevel === 'critical' ? 'border-red-500 animate-pulse' : 
          urgencyLevel === 'warning' ? 'border-orange-400' : 
          'border-emerald-400/30'}
      `}
    >
      {urgencyLevel !== 'normal' && (
        <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="text-5xl mb-2 text-center">{waste.emoji}</div>
      <div className="text-sm font-bold text-gray-800 text-center">{waste.name}</div>
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold animate-pulse">
          ✓
        </div>
      )}
      
      {urgencyLevel !== 'normal' && (
        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-red-600">
          <Clock className="w-3 h-3" />
          <span>Urgent!</span>
        </div>
      )}
    </motion.div>
  );
}