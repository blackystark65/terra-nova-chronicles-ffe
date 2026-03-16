import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { useBiomeExploration } from '@/hooks/useBiomeExploration';
import { ArrowLeft, AlertTriangle, Sun, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';

const species = [
  { emoji: '🐪', name: 'Dromadaire', status: 'common', role: 'Survivant du désert' },
  { emoji: '🦎', name: 'Lézard du Désert', status: 'common', role: 'Prédateur d\'insectes' },
  { emoji: '🦂', name: 'Scorpion', status: 'common', role: 'Chasseur nocturne' },
  { emoji: '🦅', name: 'Aigle du Désert', status: 'common', role: 'Prédateur aérien' },
  { emoji: '🦊', name: 'Fennec', status: 'common', role: 'Petit carnivore nocturne' },
  { emoji: '🐍', name: 'Serpent des Sables', status: 'common', role: 'Reptile adapté' }
];

const facts = [
  { icon: Sun, title: 'Chaleur extrême', description: 'Températures pouvant dépasser 50°C le jour, proches de 0°C la nuit' },
  { icon: Droplets, title: 'Manque d\'eau', description: 'Moins de 250mm de pluie par an, adaptations uniques pour économiser l\'eau' },
  { icon: AlertTriangle, title: 'Désertification', description: 'Expansion des déserts due au changement climatique' }
];

const threats = [
  { name: 'Désertification accélérée', impact: 'critique', description: 'Le changement climatique transforme terres agricoles en déserts' },
  { name: 'Surpâturage', impact: 'élevé', description: 'Destruction de la végétation fragile par le bétail' },
  { name: 'Exploitation minière', impact: 'élevé', description: 'Extraction de ressources détruit les habitats' }
];

export default function BiomeDesertPage() {
  useBiomeExploration('desert');
  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1600)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/70 via-orange-900/60 to-yellow-900/70" />
      
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
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
              🏜️ Déserts
            </h1>
            <p className="text-2xl text-amber-200/90 max-w-3xl mx-auto leading-relaxed">
              Terres arides où la vie s'adapte aux conditions les plus extrêmes
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
            <h2 className="text-3xl font-bold text-amber-300 mb-6">Animaux du Désert</h2>
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
                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                    Abondant
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
              <Button className="px-8 py-6 text-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                <Sun className="w-6 h-6 mr-2" />
                Protéger les Déserts
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}