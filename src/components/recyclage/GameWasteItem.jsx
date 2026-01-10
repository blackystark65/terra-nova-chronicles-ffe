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
        scale: isDragging ? 1.2 : 1, 
        rotate: 0,
        y: urgencyLevel === 'critical' ? [0, -5, 0] : 0
      }}
      transition={{ 
        type: "spring",
        y: { duration: 0.5, repeat: urgencyLevel === 'critical' ? Infinity : 0 }
      }}
      drag
      dragSnapToOrigin
      dragElastic={0.1}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        // Detect drop on bin (will be handled by parent)
      }}
      style={{ zIndex: isDragging ? 9999 : 1 }}
      className={`
        relative cursor-grab active:cursor-grabbing
        bg-white rounded-2xl p-4 shadow-lg border-4
        ${urgencyLevel === 'critical' ? 'border-red-500 animate-pulse' : 
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
      
      {urgencyLevel !== 'normal' && (
        <div className="flex items-center justify-center gap-1 mt-2 text-xs text-red-600">
          <Clock className="w-3 h-3" />
          <span>Urgent!</span>
        </div>
      )}
    </motion.div>
  );
}