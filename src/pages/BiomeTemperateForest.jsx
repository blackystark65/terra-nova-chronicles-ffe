import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, TreeDeciduous, Bug, Droplets, AlertTriangle, Leaf } from 'lucide-react';
import { useBiomeExploration } from '@/hooks/useBiomeExploration';

const species = [
  { name: 'Cerf élaphe', emoji: '🦌', status: 'Stable', role: 'Herbivore régulateur' },
  { name: 'Loup gris', emoji: '🐺', status: 'Vulnérable', role: 'Prédateur apex' },
  { name: 'Renard roux', emoji: '🦊', status: 'Stable', role: 'Prédateur intermédiaire' },
  { name: 'Chouette hulotte', emoji: '🦉', status: 'Stable', role: 'Régulateur de rongeurs' },
  { name: 'Blaireau', emoji: '🦡', status: 'Stable', role: 'Fouisseur écosystémique' },
  { name: 'Hérisson', emoji: '🦔', status: 'Préoccupation mineure', role: 'Insectivore' },
];

const facts = [
  {
    title: 'Cycle des saisons',
    description: 'Les forêts tempérées vivent au rythme des 4 saisons, offrant des habitats changeants à une biodiversité remarquable.',
    icon: Leaf,
  },
  {
    title: 'Sol vivant',
    description: 'Un seul gramme de sol forestier contient des milliers d\'espèces de micro-organismes essentiels au cycle des nutriments.',
    icon: TreeDeciduous,
  },
  {
    title: 'Stockage carbone',
    description: 'Les forêts tempérées européennes stockent l\'équivalent de 5 ans d\'émissions de CO2 de l\'Union Européenne.',
    icon: Droplets,
  },
  {
    title: 'Réseau mycélien',
    description: 'Les champignons souterrains forment un "internet forestier" reliant les arbres entre eux pour échanger nutriments et signaux.',
    icon: Bug,
  },
];

const threats = [
  {
    title: 'Fragmentation des habitats',
    impact: 'Critique',
    description: 'Les routes et villes découpent les forêts en petits îlots isolés, empêchant la migration et la diversité génétique.',
  },
  {
    title: 'Espèces invasives',
    impact: 'Élevé',
    description: 'Des espèces comme le frelon asiatique ou le robinier perturbent les équilibres naturels des forêts tempérées.',
  },
  {
    title: 'Sécheresses prolongées',
    impact: 'Élevé',
    description: 'Le changement climatique provoque des sécheresses et ravageurs qui affaiblissent et détruisent des millions d\'arbres.',
  },
];

export default function BiomeTemperateForestPage() {
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-lime-900 to-emerald-950">
      <BiolumiHeader currentPage="Atlas" />

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to={createPageUrl('Atlas')}>
              <button className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Retour à l'Atlas
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12 p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-lime-600 to-green-700 shadow-2xl"
          >
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-6xl"
                  style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
                  animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
                >
                  🍂
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 text-center text-white">
              <motion.div className="text-8xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                🌲
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">Forêts Tempérées</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
                Europe · Amérique du Nord · Asie de l'Est
              </p>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                Les forêts tempérées couvrent les zones climatiques entre les tropiques et les régions polaires. 
                Elles abritent une biodiversité fascinante rythmée par les cycles saisonniers et jouent un rôle clé dans la régulation du climat européen.
              </p>
            </div>
          </motion.div>

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
                    <div className="p-3 rounded-xl bg-gradient-to-br from-lime-400 to-green-500">
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

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-300 mb-6">🦉 Espèces emblématiques</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {species.map((sp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedSpecies(sp)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-lime-800/40 to-green-800/40 backdrop-blur-xl border border-emerald-400/20 cursor-pointer"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-gradient-to-r from-lime-500 to-green-600 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">🌲 Protège les forêts tempérées</h3>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Découvre comment agir localement pour préserver les forêts qui t'entourent et leur biodiversité unique.
            </p>
            <Link to={createPageUrl('Missions')}>
              <button className="px-8 py-4 rounded-2xl bg-white text-green-600 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Voir les missions →
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}