import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, AlertTriangle, Snowflake, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const species = [
  { emoji: '🐻‍❄️', name: 'Ours Polaire', status: 'vulnerable', role: 'Prédateur apex des glaces' },
  { emoji: '🦭', name: 'Phoque Annelé', status: 'common', role: 'Proie principale des ours' },
  { emoji: '🐧', name: 'Manchot Empereur', status: 'common', role: 'Emblème antarctique' },
  { emoji: '🦌', name: 'Caribou', status: 'vulnerable', role: 'Migrateur arctique' },
  { emoji: '🦊', name: 'Renard Arctique', status: 'common', role: 'Prédateur adapté au froid' },
  { emoji: '🐋', name: 'Narval', status: 'vulnerable', role: 'Licorne des mers' }
];

const facts = [
  { icon: Snowflake, title: 'Températures extrêmes', description: 'Jusqu\'à -60°C en hiver, adaptations uniques nécessaires' },
  { icon: Thermometer, title: 'Réchauffement 3x plus rapide', description: 'L\'Arctique se réchauffe trois fois plus vite que le reste de la planète' },
  { icon: AlertTriangle, title: 'Fonte des glaces', description: '13% de glace de mer disparaît chaque décennie' }
];

const threats = [
  { name: 'Fonte de la banquise', impact: 'critique', description: 'Perte d\'habitat pour les espèces dépendantes de la glace' },
  { name: 'Pollution plastique', impact: 'élevé', description: 'Les courants océaniques accumulent les déchets dans l\'Arctique' },
  { name: 'Exploitation pétrolière', impact: 'critique', description: 'Forages en eaux profondes menacent l\'écosystème fragile' }
];

export default function BiomeArcticPage() {
  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/5ea2a6e26_2728.jpg)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-cyan-950/80 via-blue-950/70 to-slate-950/80" />
      
      <BiolumiHeader currentPage="Atlas" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to={createPageUrl('Atlas')}>
            <Button variant="outline" className="mb-6 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'Atlas
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              ❄️ Arctique & Antarctique
            </h1>
            <p className="text-2xl text-cyan-200/90 max-w-3xl mx-auto leading-relaxed">
              Les régions polaires, royaumes de glace et sentinelles du climat mondial
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {facts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-cyan-400/30"
              >
                <fact.icon className="w-12 h-12 text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold text-cyan-300 mb-2">{fact.title}</h3>
                <p className="text-cyan-200/80">{fact.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">Animaux Polaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {species.map((animal, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-cyan-400/30"
                >
                  <div className="text-6xl mb-3">{animal.emoji}</div>
                  <h3 className="text-xl font-bold text-cyan-300 mb-2">{animal.name}</h3>
                  <p className="text-sm text-cyan-200/70 mb-2">{animal.role}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    animal.status === 'vulnerable' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {animal.status === 'vulnerable' ? 'Vulnérable' : 'Abondant'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">Menaces Critiques</h2>
            <div className="space-y-4">
              {threats.map((threat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="p-6 rounded-2xl bg-red-900/20 backdrop-blur-xl border border-red-400/30"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-red-300 mb-2">{threat.name}</h3>
                      <p className="text-red-200/80">{threat.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      threat.impact === 'critique' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      {threat.impact}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <Link to={createPageUrl('Missions')}>
              <Button className="px-8 py-6 text-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                <Snowflake className="w-6 h-6 mr-2" />
                Protéger les Pôles
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}