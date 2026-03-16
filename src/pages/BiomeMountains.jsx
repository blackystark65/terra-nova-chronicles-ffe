import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, TreeDeciduous, Bug, Droplets, AlertTriangle, Leaf } from 'lucide-react';

const species = [
  { name: 'Aigle royal', emoji: '🦅', status: 'Stable', role: 'Prédateur apex aérien' },
  { name: 'Bouquetin des Alpes', emoji: '🐐', status: 'Stable', role: 'Herbivore rocheux' },
  { name: 'Marmotte', emoji: '🐿️', status: 'Stable', role: 'Hibernant fouisseur' },
  { name: 'Lynx boréal', emoji: '🐱', status: 'Vulnérable', role: 'Prédateur félin' },
  { name: 'Gypaète barbu', emoji: '🦅', status: 'Vulnérable', role: 'Nécrophage ossifère' },
  { name: 'Ours brun', emoji: '🐻', status: 'Vulnérable', role: 'Omnivore régulateur' },
];

const facts = [
  {
    title: 'Châteaux d\'eau',
    description: 'Les montagnes approvisionnent en eau douce plus de la moitié de l\'humanité, grâce aux glaciers et aux neiges éternelles.',
    icon: Droplets,
  },
  {
    title: 'Gradients de vie',
    description: 'En montant de 1000m d\'altitude, le climat change autant qu\'en parcourant 1000km vers les pôles, créant des étages de biodiversité uniques.',
    icon: Leaf,
  },
  {
    title: 'Glaciers en péril',
    description: 'Les Alpes ont perdu 50% de la surface glaciaire depuis 1900. Ces réservoirs d\'eau douce fondent à une vitesse alarmante.',
    icon: TreeDeciduous,
  },
  {
    title: 'Biodiversité isolée',
    description: 'L\'isolement des sommets a créé des espèces endémiques uniques, introuvables ailleurs dans le monde, adaptées aux conditions extrêmes.',
    icon: Bug,
  },
];

const threats = [
  {
    title: 'Fonte des glaciers',
    impact: 'Critique',
    description: 'Le réchauffement climatique fait fondre les glaciers 6 fois plus vite qu\'au siècle dernier, menaçant les réserves en eau de millions de personnes.',
  },
  {
    title: 'Tourisme intensif',
    impact: 'Élevé',
    description: 'Les stations de ski et le tourisme de masse détruisent les habitats alpins fragiles et perturbent la faune sauvage.',
  },
  {
    title: 'Remontée des espèces',
    impact: 'Élevé',
    description: 'Le réchauffement pousse les espèces à coloniser des altitudes plus hautes, compressant les habitats des espèces alpines jusqu\'à leur disparition.',
  },
];

export default function BiomeMountainsPage() {
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-stone-900 to-gray-950">
      <BiolumiHeader currentPage="Atlas" />

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to={createPageUrl('Atlas')}>
              <button className="flex items-center gap-2 text-slate-300 hover:text-slate-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Retour à l'Atlas
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12 p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-600 to-stone-700 shadow-2xl"
          >
            <div className="absolute inset-0 opacity-20">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-5xl"
                  style={{ left: `${(i * 43) % 100}%`, top: `${(i * 61) % 100}%` }}
                  animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
                >
                  ❄️
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 text-center text-white">
              <motion.div className="text-8xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>
                🏔️
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">Montagnes</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
                Alpes · Himalaya · Andes · Rocheuses
              </p>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                Les écosystèmes de montagne couvrent 25% des terres émergées et fournissent de l'eau douce à plus de la moitié de l'humanité. 
                Leurs habitats uniques abritent des espèces endémiques remarquables adaptées aux conditions les plus extrêmes.
              </p>
            </div>
          </motion.div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-300 mb-6">🔬 Comprendre l'écosystème</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {facts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-slate-400/20 hover:border-slate-400/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-400 to-stone-500">
                      <fact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-300 mb-2">{fact.title}</h3>
                      <p className="text-slate-200/70">{fact.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-300 mb-6">🦅 Espèces emblématiques</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {species.map((sp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedSpecies(sp)}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 to-stone-800/40 backdrop-blur-xl border border-slate-400/20 cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-3">{sp.emoji}</div>
                    <h3 className="text-xl font-bold text-slate-200 mb-2">{sp.name}</h3>
                    <p className="text-sm text-slate-300/70 mb-2">{sp.role}</p>
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
            <h2 className="text-3xl font-bold text-slate-300 mb-6 flex items-center gap-3">
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
            className="p-8 rounded-3xl bg-gradient-to-r from-slate-500 to-stone-600 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">🏔️ Protège les montagnes</h3>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Découvre comment préserver les écosystèmes alpins et les glaciers essentiels à notre approvisionnement en eau douce.
            </p>
            <Link to={createPageUrl('Missions')}>
              <button className="px-8 py-4 rounded-2xl bg-white text-slate-600 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Voir les missions →
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}