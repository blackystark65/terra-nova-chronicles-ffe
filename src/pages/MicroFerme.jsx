import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ZONES_FERME } from '@/components/microferme/FermeData';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MicroFerme() {
  const zones = [
    { id: 'milpa', x: '25%', y: '30%' },
    { id: 'jouale', x: '55%', y: '35%' },
    { id: 'bocage', x: '75%', y: '45%' },
    { id: 'foret_jardin', x: '20%', y: '60%' },
    { id: 'boulangerie', x: '45%', y: '65%' },
    { id: 'epicerie', x: '65%', y: '70%' },
    { id: 'ferme_pedagogique', x: '35%', y: '80%' },
    { id: 'compost', x: '80%', y: '75%' }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-green-950/85 via-emerald-950/80 to-teal-950/85" />
      
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              🌱 Micro-Ferme Communautaire
            </h1>
            <p className="text-emerald-200 text-xl max-w-3xl mx-auto mb-6">
              Cultive, transforme et partage dans un écosystème agricole vivant
            </p>
            
            <Link to={createPageUrl('FermeRoleSelection')}>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg py-6 px-8">
                <Users className="w-6 h-6 mr-3" />
                Choisir ton Rôle et Commencer
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </motion.div>

          {/* Carte interactive */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-emerald-400/30 mb-8"
          >
            <h2 className="text-2xl font-bold text-emerald-300 mb-6 text-center">
              Plan de la Ferme
            </h2>
            
            <div className="relative w-full h-[600px] bg-green-900/20 rounded-2xl overflow-hidden">
              {/* Zones cliquables */}
              {zones.map((zone) => {
                const zoneData = ZONES_FERME[zone.id];
                return (
                  <motion.div
                    key={zone.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute group"
                    style={{ left: zone.x, top: zone.y, transform: 'translate(-50%, -50%)' }}
                  >
                    <Link to={createPageUrl('FermeRoleSelection')}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${zoneData.color} 
                          flex items-center justify-center cursor-pointer shadow-xl
                          border-4 border-white/30 transition-all`}
                      >
                        <span className="text-5xl">{zoneData.emoji}</span>
                      </motion.div>
                    </Link>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 
                      opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-slate-900/95 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap shadow-xl">
                        {zoneData.name}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Légende des zones */}
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(ZONES_FERME).map(([key, zone]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-emerald-400/20"
              >
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${zone.color} mb-2`}>
                  <span className="text-2xl">{zone.emoji}</span>
                  <span className="text-white font-bold text-sm">{zone.name}</span>
                </div>
                <p className="text-emerald-300 text-xs">{zone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}