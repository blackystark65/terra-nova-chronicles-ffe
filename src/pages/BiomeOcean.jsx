import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { useBiomeExploration } from '@/hooks/useBiomeExploration';
import { ArrowLeft, Droplets, TrendingUp, AlertCircle, Waves } from 'lucide-react';

const marineLife = [
  { name: 'Corail', emoji: '🪸', role: 'Architecte des récifs', threat: 'Blanchissement' },
  { name: 'Diatomées', emoji: '🦠', role: 'Producteur d\'oxygène n°1', threat: 'Acidification' },
  { name: 'Tortue marine', emoji: '🐢', role: 'Herbivore migrat', threat: 'Plastique' },
  { name: 'Requin', emoji: '🦈', role: 'Prédateur apex', threat: 'Surpêche' },
  { name: 'Baleine', emoji: '🐋', role: 'Pompe à nutriments', threat: 'Collision navires' },
  { name: 'Poisson-clown', emoji: '🐠', role: 'Symbiose avec anémone', threat: 'Perte habitat' },
];

const oceanFacts = [
  {
    title: 'Producteur d\'oxygène n°1',
    description: 'Les diatomées (micro-algues) produisent 50-80% de l\'oxygène que nous respirons, plus que toutes les forêts combinées !',
    stat: '50-80%',
  },
  {
    title: 'Régulateur climatique',
    description: 'L\'océan absorbe 90% de la chaleur excédentaire du réchauffement climatique et 30% du CO2 émis.',
    stat: '90%',
  },
  {
    title: 'Température en hausse',
    description: 'Les océans se réchauffent : +0,6°C depuis 1970. Cela semble peu mais l\'impact est énorme.',
    stat: '+0,6°C',
  },
  {
    title: 'Acidification',
    description: 'Le pH des océans a baissé de 0,1 unité (30% plus acide) depuis l\'ère industrielle.',
    stat: '30%↑',
  },
];

export default function BiomeOceanPage() {
  useBiomeExploration('ocean');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-900 to-teal-950 relative overflow-hidden">
      {/* Vagues animées en arrière-plan */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-32 bg-cyan-500/5"
          style={{ top: `${i * 20}%` }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      <BiolumiHeader currentPage="Atlas" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <Link to={createPageUrl('Atlas')}>
              <button className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Retour à l'Atlas
              </button>
            </Link>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12 p-12 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-700 shadow-2xl"
          >
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                🌊
              </motion.div>
            ))}

            <div className="relative z-10 text-center text-white">
              <motion.div
                className="text-8xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🌊
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">Océans & Récifs Coralliens</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
                Le cœur bleu de notre planète
              </p>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                Les océans couvrent 71% de la Terre et contiennent 97% de toute l'eau. Ils régulent le climat, 
                produisent la majorité de notre oxygène et abritent une biodiversité incroyable.
              </p>
            </div>
          </motion.div>

          {/* Stats climatiques critiques */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">📊 Données en temps réel</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {oceanFacts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-400/20"
                >
                  <div className="text-5xl font-black text-cyan-300 mb-3">{fact.stat}</div>
                  <h3 className="text-lg font-bold text-cyan-200 mb-2">{fact.title}</h3>
                  <p className="text-sm text-cyan-300/70">{fact.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vie marine */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">🐠 Biodiversité marine</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {marineLife.map((species, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-blue-800/40 to-cyan-800/40 backdrop-blur-xl border border-cyan-400/20"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-3">{species.emoji}</div>
                    <h3 className="text-xl font-bold text-cyan-200 mb-2">{species.name}</h3>
                    <p className="text-sm text-cyan-300/70 mb-3">{species.role}</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4" />
                      {species.threat}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Les diatomées - focus spécial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-400/30"
          >
            <div className="flex items-start gap-6">
              <motion.div
                className="text-7xl"
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 10, repeat: Infinity }}
              >
                🦠
              </motion.div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-emerald-300 mb-3">
                  Les Diatomées : Héros invisibles
                </h3>
                <p className="text-emerald-200/80 leading-relaxed mb-4">
                  Ces micro-algues unicellulaires sont la base de la chaîne alimentaire marine. 
                  Par la photosynthèse, elles produisent plus d'oxygène que toutes les forêts de la planète réunies.
                  Sans elles, la vie sur Terre serait impossible.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
                    <p className="text-sm font-semibold text-emerald-300 mb-1">Production O2</p>
                    <p className="text-2xl font-bold text-emerald-200">50-80%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
                    <p className="text-sm font-semibold text-cyan-300 mb-1">Absorption CO2</p>
                    <p className="text-2xl font-bold text-cyan-200">~40%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Crises océaniques */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-red-400" />
              Crises en cours
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Réchauffement des océans',
                  description: 'Les vagues de chaleur marines provoquent le blanchissement massif des coraux. Les récifs, qui abritent 25% de la vie marine, sont en danger critique.',
                  impact: 'Catastrophique',
                },
                {
                  title: 'Acidification',
                  description: 'L\'absorption de CO2 rend l\'eau plus acide, dissolvant les coquilles et squelettes de milliers d\'espèces.',
                  impact: 'Critique',
                },
                {
                  title: 'Pollution plastique',
                  description: '8 millions de tonnes de plastique finissent dans les océans chaque année. Les micro-plastiques sont désormais dans toute la chaîne alimentaire.',
                  impact: 'Élevé',
                },
              ].map((crisis, i) => (
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
                        <h3 className="text-xl font-bold text-red-300">{crisis.title}</h3>
                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold border border-red-400/30">
                          {crisis.impact}
                        </span>
                      </div>
                      <p className="text-red-200/70">{crisis.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">🌊 Protège les océans</h3>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Découvre comment réduire ton empreinte sur les océans et comprends les enjeux critiques.
            </p>
            <Link to={createPageUrl('Missions')}>
              <button className="px-8 py-4 rounded-2xl bg-white text-cyan-600 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Missions océans →
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}