import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { useBiomeExploration } from '@/hooks/useBiomeExploration';
import { ArrowLeft, AlertTriangle, Flame, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';

const species = [
  { emoji: '🦁', name: 'Lion', status: 'vulnerable', role: 'Prédateur apex' },
  { emoji: '🐘', name: 'Éléphant d\'Afrique', status: 'endangered', role: 'Jardinier de l\'écosystème' },
  { emoji: '🦒', name: 'Girafe', status: 'vulnerable', role: 'Disperseur de graines' },
  { emoji: '🦓', name: 'Zèbre', status: 'common', role: 'Herbivore migratoire' },
  { emoji: '🦏', name: 'Rhinocéros', status: 'critically-endangered', role: 'Mégaherbivore' },
  { emoji: '🐆', name: 'Guépard', status: 'vulnerable', role: 'Prédateur rapide' }
];

const facts = [
  { icon: Flame, title: 'Saison sèche', description: 'Les savanes alternent entre saisons sèches et humides, créant un cycle vital unique' },
  { icon: Droplets, title: 'Grandes migrations', description: 'Les herbivores migrent sur des milliers de kilomètres pour suivre les pluies' },
  { icon: AlertTriangle, title: 'Feux naturels', description: 'Les incendies naturels régénèrent la végétation et maintiennent l\'écosystème' }
];

const threats = [
  { name: 'Braconnage', impact: 'critique', description: 'Commerce illégal d\'ivoire et de cornes' },
  { name: 'Conflits humains-animaux', impact: 'élevé', description: 'Expansion agricole dans les habitats naturels' },
  { name: 'Changement climatique', impact: 'élevé', description: 'Sécheresses prolongées et imprévisibles' }
];

export default function BiomeSavannaPage() {
  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/abaf3de69_pexels-pixabay-68550.jpg)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-950/70 via-orange-950/60 to-yellow-950/70" />
      
      <BiolumiHeader currentPage="Atlas" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to={createPageUrl('Atlas')}>
            <Button variant="outline" className="mb-6 border-amber-400 text-amber-300 hover:bg-amber-400/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'Atlas
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              🦁 Savane Africaine
            </h1>
            <p className="text-2xl text-amber-200/90 max-w-3xl mx-auto leading-relaxed">
              Les grandes plaines herbeuses où paissent les troupeaux et règnent les grands prédateurs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {facts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-amber-400/30"
              >
                <fact.icon className="w-12 h-12 text-amber-400 mb-3" />
                <h3 className="text-xl font-bold text-amber-300 mb-2">{fact.title}</h3>
                <p className="text-amber-200/80">{fact.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-amber-300 mb-6">Animaux Iconiques</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {species.map((animal, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-amber-400/30"
                >
                  <div className="text-6xl mb-3">{animal.emoji}</div>
                  <h3 className="text-xl font-bold text-amber-300 mb-2">{animal.name}</h3>
                  <p className="text-sm text-amber-200/70 mb-2">{animal.role}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    animal.status === 'critically-endangered' ? 'bg-red-500/20 text-red-300' :
                    animal.status === 'endangered' ? 'bg-orange-500/20 text-orange-300' :
                    animal.status === 'vulnerable' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {animal.status === 'critically-endangered' ? 'Gravement menacé' :
                     animal.status === 'endangered' ? 'En danger' :
                     animal.status === 'vulnerable' ? 'Vulnérable' : 'Abondant'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-amber-300 mb-6">Menaces Critiques</h2>
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
              <Button className="px-8 py-6 text-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                <Flame className="w-6 h-6 mr-2" />
                Protéger la Savane
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}