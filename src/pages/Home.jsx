import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Globe, Compass, BookOpen, Flame, Leaf, Droplets, Wind, Mountain } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 overflow-hidden relative">
      {/* Particules flottantes biomimétiques */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) =>
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }} />

        )}
      </div>

      {/* Gradient lumineux animé en arrière-plan */}
      <motion.div
        className="fixed inset-0 opacity-30"
        animate={{
          background: [
          'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 50%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)',
          'radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)']

        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />


      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo Terra Nova avec effet holographique */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
              className="mb-8">

              <motion.div
                className="relative inline-block"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>

                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                  <Globe className="w-16 h-16 md:w-24 md:h-24 text-white" />
                </div>
                
                {/* Anneaux orbitaux bioluminescents */}
                {[1, 2, 3].map((ring) =>
                <motion.div
                  key={ring}
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                  animate={{
                    scale: [1, 1.2 + ring * 0.1, 1],
                    opacity: [0.5, 0, 0.5],
                    rotate: ring % 2 === 0 ? [0, 360] : [360, 0]
                  }}
                  transition={{
                    duration: 3 + ring,
                    repeat: Infinity,
                    delay: ring * 0.3
                  }} />

                )}
              </motion.div>
            </motion.div>

            {/* Titre avec effet typographique organique */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4">
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent inline-block">
                  Terra Nova
                </span>
              </h1>
              <motion.p className="text-2xl md:text-3xl font-bold text-emerald-400/80 mb-6"

              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}>CHRONICLES


              </motion.p>
            </motion.div>

            {/* Description avec membrane translucide */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative max-w-3xl mx-auto mb-12">

              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
              <div className="relative px-8 py-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-emerald-400/20">
                <p className="text-lg md:text-xl text-emerald-200/90 leading-relaxed">Rejoins les Éco-Citoyens et explore les biomes de la Terre. Découvre la biodiversité, comprends les crises climatiques et agis pour protéger notre planète. Chaque mission compte. Chaque découverte change le monde.



                </p>
              </div>
            </motion.div>

            {/* Boutons d'action avec effet nervuré */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">

              <Link to={createPageUrl('Atlas')}>
                <Button
                  size="lg"
                  className="group relative px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-2xl shadow-emerald-500/50 border-0 overflow-hidden">

                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

                  <span className="relative flex items-center gap-3">
                    <Compass className="w-6 h-6" />
                    Explorer l'Atlas
                  </span>
                </Button>
              </Link>

              <Link to={createPageUrl('Missions')}>
                <Button
                  variant="outline"
                  size="lg"
                  className="group px-8 py-6 text-lg rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-emerald-400/30 hover:bg-white/10 hover:border-emerald-400/50 text-emerald-300">

                  <span className="flex items-center gap-3">
                    <Flame className="w-6 h-6" />
                    Mes Missions
                  </span>
                </Button>
              </Link>
            </motion.div>

            {/* Stats globales */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">

              {[
              { icon: Globe, label: '8 Biomes', color: 'from-emerald-400 to-teal-500' },
              { icon: BookOpen, label: '200+ Espèces', color: 'from-cyan-400 to-blue-500' },
              { icon: Flame, label: '50+ Missions', color: 'from-orange-400 to-red-500' },
              { icon: Leaf, label: 'Données Réelles', color: 'from-green-400 to-emerald-500' }].
              map((stat, i) =>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">

                  <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.color} mb-2`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-emerald-300/70">{stat.label}</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Section Biomes Preview */}
        <section className="px-4 py-16 relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">

              Explore les Biomes de la Terre
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
              { name: 'Forêts Primaires', icon: '🌳', color: 'from-green-600 to-emerald-700', path: 'BiomeRainforest' },
              { name: 'Océans & Récifs', icon: '🌊', color: 'from-blue-600 to-cyan-700', path: 'BiomeOcean' },
              { name: 'Savanes', icon: '🦁', color: 'from-amber-600 to-orange-700', path: 'BiomeSavanna' },
              { name: 'Arctique', icon: '❄️', color: 'from-slate-600 to-blue-700', path: 'BiomeArctic' }].
              map((biome, i) =>
              <Link key={i} to={createPageUrl(biome.path)}>
                  <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`
                      relative p-6 rounded-3xl overflow-hidden cursor-pointer
                      bg-gradient-to-br ${biome.color}
                      shadow-xl hover:shadow-2xl transition-all duration-300
                    `}>

                    <motion.div
                    className="absolute inset-0 bg-white/10"
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }} />

                    
                    <div className="relative z-10 text-center">
                      <motion.div
                      className="text-6xl mb-3"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}>

                        {biome.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-white">{biome.name}</h3>
                    </div>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 text-center border-t border-emerald-800/30">
          <p className="text-emerald-400/50 text-sm">
            🌍 Terra Nova - Protégeons ensemble notre planète
          </p>
        </footer>
      </div>
    </div>);

}