import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, CheckCircle } from 'lucide-react';

export default function TruckAnimation({ show, binType, onComplete }) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md"
          >
            <motion.div
              animate={{
                x: [-100, 0],
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Truck className="w-32 h-32 text-blue-500 mx-auto mb-4" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Poubelle vidée !
              </h3>
              <p className="text-gray-600">
                Le camion a emporté vos déchets <span className="font-bold">{binType}</span> vers le centre de recyclage
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}