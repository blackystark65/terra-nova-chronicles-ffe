import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ZONES_FERME, ZONE_PAGES } from '@/components/microferme/FermeData';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MicroFerme() {
  const zones = [
    { id: 'centre_formation', x: '30%', y: '35%' }, // Centre de Formation (dessus ferme péda, droite parking)
    { id: 'milpa', x: '85%', y: '22%' }, // Champs Milpa/Bocage (haut droite)
    { id: 'permaculture', x: '85%', y: '75%' }, // Permaculture (bas droite)
    { id: 'pepiniere', x: '52%', y: '20%' }, // Pépinière/Serre (haut centre)
    { id: 'jouale', x: '85%', y: '55%' }, // Agroforesterie (droite centre)
    { id: 'bocage', x: '85%', y: '22%' }, // Champs en bocage (haut droite)
    { id: 'foret_jardin', x: '73%', y: '25%' }, // Forêt-jardin (haut droite)
    { id: 'boulangerie', x: '15%', y: '75%' }, // Boulangerie (bas gauche)
    { id: 'epicerie', x: '30%', y: '65%' }, // Épicerie (centre gauche)
    { id: 'ferme_pedagogique', x: '52%', y: '62%' }, // Ferme pédagogique (centre)
    { id: 'compost', x: '78%', y: '62%' } // Compost (droite centre)
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/82112f183_Micro-fermeTerraNova.png)',
        }}
      />
      <div className="fixed inset-0 bg-slate-950/20" />
      
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
            className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-8 border border-emerald-400/30 mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-300 mb-4 sm:mb-6 text-center">
              Plan de la Ferme
            </h2>
            
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[500px] sm:max-h-[700px] rounded-2xl overflow-hidden">
              {/* Image de la ferme */}
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/82112f183_Micro-fermeTerraNova.png"
                alt="Plan de la Micro-Ferme Terra Nova"
                className="w-full h-full object-contain"
              />
              
              {/* Zones cliquables */}
              {zones.map((zone) => {
                const zoneData = ZONES_FERME[zone.id];
                // Utilise ZONE_PAGES pour avoir la bonne page pour chaque zone
                const pageLink = ZONE_PAGES[zone.id] || 'FermeRoleSelection';
                
                return (
                  <motion.div
                    key={zone.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute group"
                    style={{ left: zone.x, top: zone.y, transform: 'translate(-50%, -50%)' }}
                  >
                    <Link to={createPageUrl(pageLink)}>
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${zoneData.color} 
                          flex items-center justify-center cursor-pointer shadow-2xl
                          border-2 sm:border-3 border-white/60 transition-all backdrop-blur-sm`}
                      >
                        <span className="text-2xl sm:text-3xl md:text-4xl">{zoneData.emoji}</span>
                      </motion.div>
                    </Link>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 sm:mb-3 
                      opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      <div className="bg-slate-900/95 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap shadow-xl border border-emerald-400/50">
                        <div className="font-bold">{zoneData.name}</div>
                        <div className="text-xs text-emerald-300 hidden sm:block">{zoneData.description}</div>
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