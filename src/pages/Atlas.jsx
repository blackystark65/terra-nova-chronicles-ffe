import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Map, Info, Lock, CheckCircle } from 'lucide-react';

const biomes = [
  {
    id: 'rainforest',
    name: 'Forêts Primaires',
    region: 'Amazonie, Congo, Bornéo',
    emoji: '🌳',
    color: 'from-green-500 to-emerald-600',
    description: 'Poumon de la Terre, biodiversité explosive',
    threats: ['Déforestation', 'Exploitation illégale'],
    species: 180,
    path: 'BiomeRainforest',
    position: { x: 30, y: 45 },
  },
  {
    id: 'ocean',
    name: 'Océans & Récifs',
    region: 'Grande Barrière, Maldives',
    emoji: '🌊',
    color: 'from-blue-500 to-cyan-600',
    description: 'Producteur d\'oxygène, régulateur climatique',
    threats: ['Acidification', 'Température', 'Surpêche'],
    species: 250,
    path: 'BiomeOcean',
    position: { x: 70, y: 50 },
  },
  {
    id: 'savanna',
    name: 'Savanes Africaines',
    region: 'Serengeti, Kruger',
    emoji: '🦁',
    color: 'from-amber-500 to-orange-600',
    description: 'Équilibre prédateurs-proies unique',
    threats: ['Braconnage', 'Sécheresse'],
    species: 120,
    path: 'BiomeSavanna',
    position: { x: 52, y: 55 },
  },
  {
    id: 'arctic',
    name: 'Arctique',
    region: 'Pôle Nord, Groenland',
    emoji: '❄️',
    color: 'from-slate-400 to-blue-600',
    description: 'Sentinelle du réchauffement climatique',
    threats: ['Fonte des glaces', 'Perte d\'habitat'],
    species: 45,
    path: 'BiomeArctic',
    position: { x: 50, y: 15 },
  },
  {
    id: 'desert',
    name: 'Déserts',
    region: 'Sahara, Mojave',
    emoji: '🏜️',
    color: 'from-yellow-600 to-red-700',
    description: 'Adaptation extrême à la survie',
    threats: ['Désertification', 'Extraction minière'],
    species: 60,
    path: 'BiomeDesert',
    position: { x: 45, y: 40 },
  },
  {
    id: 'temperate',
    name: 'Forêts Tempérées',
    region: 'Europe, Amérique du Nord',
    emoji: '🍂',
    color: 'from-orange-500 to-red-600',
    description: 'Cycles saisonniers riches',
    threats: ['Urbanisation', 'Fragmentation'],
    species: 90,
    path: 'BiomeTemperateForest',
    position: { x: 35, y: 30 },
  },
  {
    id: 'wetlands',
    name: 'Zones Humides',
    region: 'Everglades, Pantanal',
    emoji: '🦆',
    color: 'from-teal-500 to-green-600',
    description: 'Filtres naturels, nurseries',
    threats: ['Drainage', 'Pollution'],
    species: 110,
    path: 'BiomeWetlands',
    position: { x: 25, y: 50 },
  },
  {
    id: 'mountains',
    name: 'Montagnes',
    region: 'Himalaya, Andes, Alpes',
    emoji: '🏔️',
    color: 'from-gray-500 to-slate-700',
    description: 'Châteaux d\'eau de la planète',
    threats: ['Fonte des glaciers', 'Tourisme'],
    species: 75,
    path: 'BiomeMountains',
    position: { x: 60, y: 35 },
  },
  {
    id: 'biofocus',
    name: 'Bio-Focus : L\'Humus',
    region: 'Terrain de Permaculture — Terra Nova',
    emoji: '🔬',
    color: 'from-amber-600 to-green-700',
    description: 'Enquêteurs de l\'humus — Photographie ×1000',
    threats: ['Perte de biodiversité', 'Pesticides'],
    species: 12,
    path: 'BioFocus',
    position: { x: 48, y: 62 },
  },
];

export default function AtlasPage() {
  const [selectedBiome, setSelectedBiome] = useState(null);
  const [hoveredBiome, setHoveredBiome] = useState(null);

  return (
    <div className="min-h-screen relative">
      {/* Image de fond avec les couches de la Terre */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/085ed7580_earths-hemisphere-detailed-view-image-photo-planet-earth-space.jpg)',
        }}
      />
      {/* Overlay gradient pour meilleure lisibilité */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/70 via-emerald-950/60 to-teal-950/70" />
      
      {/* Tornade verte lumineuse animée */}
      <motion.div
        className="fixed inset-0 opacity-30 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(20, 184, 166, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />

      <BiolumiHeader currentPage="Atlas" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 mb-6">
              <Map className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Atlas Interactif</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Explore les Biomes du Monde
            </h1>
            <p className="text-lg text-emerald-300/70 max-w-2xl mx-auto">
              Chaque biome est un écosystème unique avec sa propre faune, flore et défis environnementaux. 
              Clique sur un point pour découvrir ses secrets.
            </p>
          </motion.div>

          {/* Carte interactive avec la planète */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-3xl overflow-hidden border border-emerald-400/20 backdrop-blur-xl mb-8"
          >
            {/* Image de la planète avec continents en relief */}
            <div className="absolute inset-0">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/1fba6efa7_earths-surface-features-details-image-photo-planet-earth-space.png"
                alt="Carte de la Terre"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Effet tornade néon par-dessus */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            {/* Points des biomes */}
            {biomes.map((biome) => (
              <motion.div
                key={biome.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${biome.position.x}%`,
                  top: `${biome.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setHoveredBiome(biome.id)}
                onMouseLeave={() => setHoveredBiome(null)}
                onClick={() => setSelectedBiome(biome)}
                whileHover={{ scale: 1.2 }}
              >
                {/* Pulse bioluminescent */}
                <motion.div
                  className={`absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-br ${biome.color} opacity-30`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Point central */}
                <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${biome.color} flex items-center justify-center shadow-lg border-2 border-white/30`}>
                  <span className="text-2xl">{biome.emoji}</span>
                </div>

                {/* Label au survol */}
                {hoveredBiome === biome.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-emerald-400/30 whitespace-nowrap"
                  >
                    <p className="text-sm font-semibold text-emerald-300">{biome.name}</p>
                    <p className="text-xs text-emerald-400/70">{biome.species}+ espèces</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Liste des biomes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {biomes.map((biome, i) => (
              <motion.div
                key={biome.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={createPageUrl(biome.path)}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`
                      relative p-6 rounded-3xl overflow-hidden cursor-pointer
                      bg-gradient-to-br ${biome.color} opacity-90
                      shadow-xl hover:shadow-2xl transition-all duration-300
                      border border-white/10
                    `}
                  >
                    {/* Membrane translucide */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-5xl">{biome.emoji}</span>
                        <div className="text-white/80">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{biome.name}</h3>
                      <p className="text-sm text-white/80 mb-3">{biome.region}</p>
                      <p className="text-xs text-white/70 mb-4">{biome.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/90 font-semibold">{biome.species}+ espèces</span>
                        <span className="px-2 py-1 rounded-full bg-white/20 text-white/90">
                          Explorer →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Modal de détails */}
          <AnimatePresence>
            {selectedBiome && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelectedBiome(null)}
              >
                <motion.div
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 50 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-br ${selectedBiome.color} shadow-2xl`}
                >
                  <div className="p-8 text-white">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <span className="text-6xl">{selectedBiome.emoji}</span>
                        <div>
                          <h2 className="text-3xl font-bold">{selectedBiome.name}</h2>
                          <p className="text-white/80">{selectedBiome.region}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedBiome(null)}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-lg mb-6">{selectedBiome.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                        <p className="text-sm text-white/70 mb-1">Espèces documentées</p>
                        <p className="text-2xl font-bold">{selectedBiome.species}+</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                        <p className="text-sm text-white/70 mb-1">Menaces actives</p>
                        <p className="text-2xl font-bold">{selectedBiome.threats.length}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-semibold mb-2">⚠️ Menaces principales :</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedBiome.threats.map((threat, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-red-500/20 text-sm border border-red-400/30">
                            {threat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link to={createPageUrl(selectedBiome.path)}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        Explorer ce biome →
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}