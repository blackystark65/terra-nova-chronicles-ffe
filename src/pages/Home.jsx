import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Leaf, TreeDeciduous, Bug, Droplets, Sparkles, Play, BookOpen, Trophy } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative overflow-hidden p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${color} opacity-10 -translate-y-1/2 translate-x-1/2`} />
    <div className={`inline-flex p-3 rounded-2xl ${color} mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 overflow-hidden">
      {/* Éléments décoratifs animés */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 text-6xl opacity-30"
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
        >
          🌿
        </motion.div>
        <motion.div
          className="absolute top-40 right-32 text-5xl opacity-30"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🦋
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-1/4 text-4xl opacity-30"
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          🐝
        </motion.div>
        <motion.div
          className="absolute bottom-48 right-1/4 text-5xl opacity-30"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🌻
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-2 mb-8 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-slate-700">Jeu éducatif pour les 6-12 ans</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <motion.span
              className="text-7xl md:text-9xl inline-block"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🌍
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              Écosystème
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Titan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Deviens un <strong className="text-emerald-600">Gardien de la Terre</strong> et apprends les secrets 
            de la permaculture, l'agroforesterie et l'écologie en t'amusant !
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={createPageUrl('Game')}>
              <Button
                size="lg"
                className="gap-3 px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl shadow-emerald-500/30 border-0"
              >
                <Play className="w-6 h-6" />
                Commencer l'aventure
              </Button>
            </Link>

            <Link to={createPageUrl('Learn')}>
              <Button
                variant="outline"
                size="lg"
                className="gap-3 px-8 py-6 text-lg rounded-2xl bg-white/60 backdrop-blur-md border-white/50 hover:bg-white/80"
              >
                <BookOpen className="w-6 h-6" />
                En savoir plus
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Apprends en jouant 🎮
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Découvre les merveilles de l'écologie à travers un jeu interactif et passionnant
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Leaf}
              title="Permaculture"
              description="Apprends à cultiver en harmonie avec la nature, sans produits chimiques"
              color="bg-gradient-to-br from-emerald-400 to-green-500"
              delay={0.5}
            />
            <FeatureCard
              icon={TreeDeciduous}
              title="Agroforesterie"
              description="Découvre comment les arbres aident les cultures à pousser"
              color="bg-gradient-to-br from-teal-400 to-cyan-500"
              delay={0.6}
            />
            <FeatureCard
              icon={Bug}
              title="Biodiversité"
              description="Attire les abeilles, papillons et autres amis du jardin"
              color="bg-gradient-to-br from-amber-400 to-orange-500"
              delay={0.7}
            />
            <FeatureCard
              icon={Droplets}
              title="Écologie"
              description="Comprends l'importance de l'eau et de la santé du sol"
              color="bg-gradient-to-br from-blue-400 to-indigo-500"
              delay={0.8}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-2xl shadow-emerald-500/30"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-8xl"
            >
              🏆
            </motion.div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Prêt à devenir un héros de la planète ?
              </h3>
              <p className="text-lg text-white/90 mb-6">
                Gagne des points biodiversité, débloque des succès et apprends les secrets de la nature !
              </p>
              <Link to={createPageUrl('Game')}>
                <Button
                  size="lg"
                  className="gap-2 px-8 py-6 rounded-2xl bg-white text-emerald-600 hover:bg-white/90 font-bold shadow-xl"
                >
                  <Trophy className="w-5 h-5" />
                  Jouer maintenant
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 text-center">
        <p className="text-slate-500 text-sm">
          🌱 Écosystème Titan - Apprendre l'écologie en s'amusant
        </p>
      </footer>
    </div>
  );
}