import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Recycle, Map } from 'lucide-react';

const HOTEL_ZONES = [
  { id: 'kitchen', name: 'Cuisine', emoji: '👨‍🍳', position: { x: 20, y: 15 }, color: 'from-orange-500 to-red-500', page: 'RecyclageKitchen' },
  { id: 'restaurant', name: 'Restaurant', emoji: '🍽️', position: { x: 25, y: 45 }, color: 'from-yellow-500 to-orange-500', page: 'RecyclageRestaurant' },
  { id: 'reception', name: 'Réception', emoji: '🏨', position: { x: 78, y: 50 }, color: 'from-blue-500 to-purple-500', page: 'RecyclageReception' },
  { id: 'rooms', name: 'Chambres', emoji: '🛏️', position: { x: 50, y: 20 }, color: 'from-purple-500 to-pink-500', page: 'RecyclageRooms' },
  { id: 'pool', name: 'Piscine', emoji: '🏊', position: { x: 45, y: 55 }, color: 'from-cyan-500 to-blue-500', page: 'RecyclagePool' },
  { id: 'plage', name: 'Plage', emoji: '🏖️', position: { x: 50, y: 85 }, color: 'from-yellow-400 to-orange-500', page: 'RecyclagePlage' },
  { id: 'marina', name: 'Marina', emoji: '⛵', position: { x: 8, y: 50 }, color: 'from-blue-600 to-cyan-600', page: 'RecyclageMarina' },
  { id: 'parking', name: 'Parking', emoji: '🚗', position: { x: 85, y: 35 }, color: 'from-gray-600 to-slate-700', page: 'RecyclageParking' },
  { id: 'decheterie', name: 'Déchetterie', emoji: '🏭', position: { x: 90, y: 65 }, color: 'from-green-600 to-emerald-600', page: 'RecyclageDecheterie' },
];

export default function RecyclagePage() {
  const [hoveredZone, setHoveredZone] = useState(null);

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/349c14a99_digital-screen-with-environment-day.jpg)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/90 via-emerald-950/80 to-teal-950/90" />
      
      <BiolumiHeader currentPage="Recyclage" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/10 border border-green-400/20 mb-4">
              <Recycle className="w-6 h-6 text-green-400" />
              <span className="text-green-300 font-semibold">Jeu de Recyclage</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Hôtel Terra Nova - Mission Recyclage
            </h1>
            <p className="text-lg text-emerald-300/70 max-w-2xl mx-auto">
              Explore l'hôtel, collecte les déchets et trie-les dans les bonnes poubelles !
            </p>
          </motion.div>

          {/* Hotel Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden border-4 border-emerald-400/30 shadow-2xl mb-8"
          >
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/17ce4623e_PlanHotelTerraaNova.png"
              alt="Plan Hôtel Terra Nova"
              className="w-full h-auto"
            />
            
            {/* Clickable zones */}
            {HOTEL_ZONES.map((zone) => (
              <Link key={zone.id} to={createPageUrl(zone.page)}>
                <motion.div
                  className="absolute cursor-pointer"
                  style={{
                    left: `${zone.position.x}%`,
                    top: `${zone.position.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  whileHover={{ scale: 1.3 }}
                >
                  <motion.div
                    className={`absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br ${zone.color} opacity-40`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0, 0.4],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${zone.color} flex items-center justify-center shadow-lg border-2 border-white/50`}>
                    <span className="text-3xl">{zone.emoji}</span>
                  </div>

                  {hoveredZone === zone.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900/95 backdrop-blur-sm border border-emerald-400/30 whitespace-nowrap z-20"
                    >
                      <p className="text-sm font-semibold text-emerald-300">{zone.name}</p>
                      <p className="text-xs text-emerald-400/70">Cliquer pour entrer</p>
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            ))}
          </motion.div>

          <div className="text-center">
            <p className="text-emerald-300 text-lg mb-4">
              Clique sur les zones de l'hôtel pour collecter et trier les déchets
            </p>
            <Link to={createPageUrl('RecyclageDecheterie')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <Map className="w-6 h-6" />
                Voir la Déchetterie
              </motion.button>
            </Link>
          </div>
        </div>
      </main>


    </div>
  );
}