import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, TreeDeciduous, Bug, Droplets, AlertTriangle, Leaf } from 'lucide-react';

const species = [
  { name: 'Héron cendré', emoji: '🦢', status: 'Stable', role: 'Prédateur piscivore' },
  { name: 'Loutre de rivière', emoji: '🦦', status: 'Préoccupation mineure', role: 'Prédateur aquatique' },
  { name: 'Grenouille verte', emoji: '🐸', status: 'Stable', role: 'Bioindicateur' },
  { name: 'Castor', emoji: '🦫', status: 'Stable', role: 'Ingénieur de l\'écosystème' },
  { name: 'Cigogne blanche', emoji: '🦩', status: 'Stable', role: 'Migrateur régulateur' },
  { name: 'Libellule', emoji: '🐛', status: 'Stable', role: 'Régulateur d\'insectes' },
];

const facts = [
  {
    title: 'Reins de la planète',
    description: 'Les zones humides filtrent naturellement l\'eau : une hectare de marais peut traiter autant de pollution qu\'une station d\'épuration.',
    icon: Droplets,
  },
  {
    title: 'Éponge anti-crues',
    description: 'Les tourbières et marais absorbent l\'excès d\'eau lors des crues, protégeant des millions de personnes vivant en aval.',
    icon: Leaf,
  },
  {
    title: 'Carbone fossilisé',
    description: 'Les tourbières couvrent 3% des terres mais stockent le double du carbone de toutes les forêts mondiales réunies.',
    icon: TreeDeciduous,
  },
  {
    title: 'Pépinière de vie',
    description: '40% de toutes les espèces du monde vivent ou se reproduisent dans les zones humides, qui couvrent moins de 6% des terres.',
    icon: Bug,
  },
];

const threats = [
  {
    title: 'Drainage agricole',
    impact: 'Critique',
    description: '35% des zones humides mondiales ont disparu depuis 1970, principalement pour créer des terres agricoles.',
  },
  {
    title: 'Pollution aux nitrates',
    impact: 'Élevé',
    description: 'Les engrais agricoles créent des algues toxiques qui asphyxient la vie aquatique dans les marais et estuaires.',
  },
  {
    title: 'Espèces envahissantes',
    impact: 'Élevé',
    description: 'La jussie ou le ragondin détruisent la végétation native et déséquilibrent les zones humides européennes.',
  },
];

export default function BiomeWetlandsPage() {
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-cyan-900 to-blue-950">
      <BiolumiHeader currentPage="Atlas" />

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to={createPageUrl('Atlas')}>
              <button className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Retour à l'Atlas
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12 p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-teal-600 to-cyan-700 shadow-2xl"
          >
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-5xl"
                  style={{ left: `${(i * 41) % 100}%`, top: `${(i * 59) % 100}%` }}
                  animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.15 }}
                >
                  💧
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 text-center text-white">
              <motion.div className="text-8xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                🌊
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">Zones Humides</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
                Marais · Tourbières · Mangroves · Estuaires
              </p>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                Les zones humides sont parmi les écosystèmes les plus productifs de la planète. 
                Elles filtrent l'eau, stockent le carbone, régulent les crues et abritent une biodiversité extraordinaire à l'interface de la terre et de l'eau.
              </p>
            </div>
          </motion.div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">🔬 Comprendre l'écosystème</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {facts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500">
                      <fact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-cyan-300 mb-2">{fact.title}</h3>
                      <p className="text-cyan-200/70">{fact.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">🦢 Espèces emblématiques</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {species.map((sp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedSpecies(sp)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-teal-800/40 to-cyan-800/40 backdrop-blur-xl border border-cyan-400/20 cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-3">{sp.emoji}</div>
                    <h3 className="text-xl font-bold text-cyan-200 mb-2">{sp.name}</h3>
                    <p className="text-sm text-cyan-300/70 mb-2">{sp.role}</p>
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
            <h2 className="text-3xl font-bold text-cyan-300 mb-6 flex items-center gap-3">
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
            className="p-8 rounded-3xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">💧 Protège les zones humides</h3>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Découvre comment agir pour préserver ces écosystèmes vitaux et la qualité de l'eau dans ton environnement.
            </p>
            <Link to={createPageUrl('Missions')}>
              <button className="px-8 py-4 rounded-2xl bg-white text-teal-600 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Voir les missions →
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}