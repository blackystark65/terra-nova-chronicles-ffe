import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, TreeDeciduous, Bug, Droplets, AlertTriangle, Info, Leaf } from 'lucide-react';
import { useBiomeExploration } from '@/hooks/useBiomeExploration';

const species = [
  { name: 'Jaguar', emoji: '🐆', status: 'Vulnérable', role: 'Prédateur apex' },
  { name: 'Toucan', emoji: '🦜', status: 'Préoccupation mineure', role: 'Disperseur de graines' },
  { name: 'Paresseux', emoji: '🦥', status: 'Vulnérable', role: 'Herbivore arboricole' },
  { name: 'Morpho Bleu', emoji: '🦋', status: 'Stable', role: 'Pollinisateur' },
  { name: 'Anaconda', emoji: '🐍', status: 'Stable', role: 'Prédateur aquatique' },
  { name: 'Capybara', emoji: '🦫', status: 'Stable', role: 'Herbivore semi-aquatique' },
];

const facts = [
  {
    title: 'Poumon de la Terre',
    description: 'Les forêts tropicales produisent 20% de l\'oxygène mondial et absorbent d\'énormes quantités de CO2.',
    icon: Leaf,
  },
  {
    title: 'Biodiversité explosive',
    description: '50% de toutes les espèces terrestres vivent dans seulement 6% de la surface de la planète.',
    icon: Bug,
  },
  {
    title: 'Le cycle de l\'eau',
    description: 'L\'Amazonie génère ses propres précipitations : les arbres recyclent l\'eau par évapotranspiration.',
    icon: Droplets,
  },
  {
    title: 'Pharmacie naturelle',
    description: '25% de nos médicaments modernes proviennent de plantes des forêts tropicales.',
    icon: TreeDeciduous,
  },
];

const threats = [
  {
    title: 'Déforestation massive',
    impact: 'Critique',
    description: 'L\'équivalent d\'un terrain de football est détruit toutes les 6 secondes pour l\'élevage et l\'agriculture.',
  },
  {
    title: 'Exploitation illégale',
    impact: 'Élevé',
    description: 'Le bois tropical rare est surexploité, détruisant l\'habitat de milliers d\'espèces.',
  },
  {
    title: 'Réchauffement climatique',
    impact: 'Élevé',
    description: 'Les sécheresses intensifiées augmentent les risques d\'incendies catastrophiques.',
  },
];

export default function BiomeRainforestPage() {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  useBiomeExploration('rainforest');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950">
      <BiolumiHeader currentPage="Atlas" />

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header avec retour */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to={createPageUrl('Atlas')}>
              <button className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Retour à l'Atlas
              </button>
            </Link>
          </motion.div>

          {/* Hero du biome */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12 p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 shadow-2xl"
          >
            {/* Effet de canopée animée */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-6xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  🌿
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 text-center text-white">
              <motion.div
                className="text-8xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🌳
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">Forêts Primaires</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
                Amazonie · Congo · Bornéo
              </p>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                Les forêts tropicales humides sont les écosystèmes les plus anciens et les plus riches de la planète. 
                Elles hébergent une biodiversité exceptionnelle et jouent un rôle crucial dans la régulation du climat mondial.
              </p>
            </div>
          </motion.div>

          {/* Faits clés */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-300 mb-6">🔬 Comprendre l'écosystème</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {facts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-emerald-400/20 hover:border-emerald-400/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500">
                      <fact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-300 mb-2">{fact.title}</h3>
                      <p className="text-emerald-200/70">{fact.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Espèces emblématiques */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-300 mb-6">🦜 Espèces emblématiques</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {species.map((sp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedSpecies(sp)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-green-800/40 to-emerald-800/40 backdrop-blur-xl border border-emerald-400/20 cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-3">{sp.emoji}</div>
                    <h3 className="text-xl font-bold text-emerald-200 mb-2">{sp.name}</h3>
                    <p className="text-sm text-emerald-300/70 mb-2">{sp.role}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                      sp.status === 'Vulnérable' 
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                        : 'bg-green-500/20 text-green-300 border border-green-400/30'
                    }`}>
                      {sp.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Menaces */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-300 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              Menaces critiques
            </h2>
            <div className="space-y-4">
              {threats.map((threat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-red-900/20 backdrop-blur-xl border border-red-400/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-red-300">{threat.title}</h3>
                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold border border-red-400/30">
                          Impact {threat.impact}
                        </span>
                      </div>
                      <p className="text-red-200/70">{threat.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">💚 Agis pour protéger les forêts</h3>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Complète des missions pour en apprendre plus et découvre comment ton quotidien peut avoir un impact positif sur les forêts tropicales.
            </p>
            <Link to={createPageUrl('Missions')}>
              <button className="px-8 py-4 rounded-2xl bg-white text-emerald-600 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Voir les missions →
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}