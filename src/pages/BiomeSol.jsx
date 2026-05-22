import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft } from 'lucide-react';

const species = [
  { emoji: '🪱', name: 'Lombric', role: 'Ingénieur du sol', status: 'Abondant', desc: 'Aère et fertilise le sol en creusant des galeries et en décomposant la matière organique.' },
  { emoji: '🦗', name: 'Cloporte', role: 'Décomposeur', status: 'Commun', desc: 'Broie les feuilles mortes et les débris végétaux, accélérant leur transformation en humus.' },
  { emoji: '🐛', name: 'Diplopode (Mille-pattes)', role: 'Transformateur', status: 'Commun', desc: 'Fragmente la matière organique, essentiel dans les premières étapes de décomposition.' },
  { emoji: '🕷️', name: 'Araignée du sol', role: 'Prédateur', status: 'Commun', desc: 'Régule les populations d\'insectes et maintient l\'équilibre de la chaîne trophique souterraine.' },
  { emoji: '🪲', name: 'Carabe doré', role: 'Prédateur', status: 'En déclin', desc: 'Beetle prédateur des limaces et larves nuisibles, indicateur de la santé du sol.' },
  { emoji: '🍄', name: 'Mycélium fongique', role: 'Réseau nutritif', status: 'Invisible', desc: 'Le "wood wide web" : réseau souterrain qui relie les plantes et redistribue nutriments et eau.' },
  { emoji: '🦟', name: 'Collembole', role: 'Micro-décomposeur', status: 'Microscopique', desc: 'Parmi les animaux les plus abondants sur Terre. Régule les bactéries et champignons du sol.' },
  { emoji: '🦂', name: 'Pseudoscorpion', role: 'Prédateur apex', status: 'Rare', desc: 'Petit prédateur arachnide, indicateur d\'un sol de qualité exceptionnelle. Très rare à observer.' },
];

const facts = [
  { emoji: '🌍', title: '25% de la biodiversité', desc: 'Un quart de toutes les espèces vivantes sur Terre vit dans le sol.' },
  { emoji: '🔬', title: '1 cuillère de sol', desc: 'Contient plus de micro-organismes que d\'êtres humains sur Terre.' },
  { emoji: '🌱', title: 'Formation lente', desc: 'Il faut 1 000 ans pour former 1 cm d\'humus fertile.' },
  { emoji: '💨', title: 'Carbone stocké', desc: 'Les sols stockent 3× plus de carbone que l\'atmosphère terrestre.' },
];

const threats = [
  { emoji: '☠️', threat: 'Pesticides & herbicides', detail: 'Éliminent les micro-organismes bénéfiques et perturbent la chaîne alimentaire souterraine.' },
  { emoji: '🏗️', threat: 'Imperméabilisation', detail: 'L\'asphalte et le béton détruisent définitivement l\'écosystème du sol sous les villes.' },
  { emoji: '🚜', threat: 'Tassement agricole', detail: 'Les engins lourds compactent le sol, détruisant les galeries et asphyxiant les organismes.' },
  { emoji: '🌡️', threat: 'Réchauffement climatique', detail: 'Accélère la décomposition de l\'humus et libère massivement du CO₂ stocké.' },
];

export default function BiomeSolPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-950 to-emerald-950">
      <BiolumiHeader currentPage="BiomeSol" />

      <main className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        {/* Retour */}
        <Link to={createPageUrl('Atlas')}>
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-amber-300/70 hover:text-amber-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour à l'Atlas</span>
          </motion.button>
        </Link>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="text-8xl mb-4">🌱</div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3">
            Le Sol & l'<span className="text-amber-400">Humus</span>
          </h1>
          <p className="text-amber-300/60 text-lg max-w-2xl mx-auto">
            Biome invisible sous nos pieds — l'écosystème le plus dense et le moins connu de la planète
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm font-semibold">🌍 Partout sur Terre</span>
            <span className="px-4 py-2 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-sm font-semibold">⚠️ En danger critique</span>
            <span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold">🔬 Étudié par Bio-Focus</span>
          </div>
        </motion.div>

        {/* Faits clés */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">
          {facts.map((fact, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-amber-400/20 text-center">
              <div className="text-3xl mb-2">{fact.emoji}</div>
              <div className="text-amber-300 font-bold text-sm mb-1">{fact.title}</div>
              <div className="text-amber-200/60 text-xs">{fact.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Couches du sol */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-3xl bg-white/5 border border-amber-400/20 mb-10">
          <h2 className="text-2xl font-black text-white mb-5">🏗️ Les couches du sol</h2>
          <div className="space-y-3">
            {[
              { layer: 'Litière (O)', color: 'from-yellow-600 to-amber-700', desc: 'Feuilles mortes, branches, débris végétaux — habitat de la macrofaune.', depth: '0–5 cm' },
              { layer: 'Humus (A)', color: 'from-amber-800 to-stone-800', desc: 'Sol noir riche en matière organique décomposée — cœur de vie du biome.', depth: '5–30 cm' },
              { layer: 'Sous-sol (B)', color: 'from-stone-700 to-stone-900', desc: 'Argiles et minéraux lessivés — traversé par les racines et le mycélium.', depth: '30–100 cm' },
              { layer: 'Roche mère (C)', color: 'from-slate-700 to-slate-900', desc: 'Roche en cours d\'altération — source des minéraux remontés par les plantes.', depth: '> 100 cm' },
            ].map((l, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${l.color} bg-opacity-20 border border-white/10`}>
                <div className="text-white/40 text-xs font-mono w-20 flex-shrink-0">{l.depth}</div>
                <div className="font-bold text-white text-sm w-28 flex-shrink-0">{l.layer}</div>
                <div className="text-white/70 text-sm">{l.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Espèces */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-10">
          <h2 className="text-2xl font-black text-white mb-5">🦠 Les habitants du sol</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {species.map((sp, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
                className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-amber-400/15 hover:border-amber-400/40 transition-all">
                <span className="text-3xl flex-shrink-0">{sp.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-sm">{sp.name}</span>
                    <span className="text-amber-400/60 text-xs">— {sp.role}</span>
                  </div>
                  <p className="text-white/50 text-xs">{sp.desc}</p>
                  <span className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300">{sp.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Menaces */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-10">
          <h2 className="text-2xl font-black text-white mb-5">⚠️ Menaces principales</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {threats.map((t, i) => (
              <div key={i} className="p-4 rounded-2xl bg-red-500/10 border border-red-400/20 flex gap-3">
                <span className="text-2xl flex-shrink-0">{t.emoji}</span>
                <div>
                  <div className="text-red-300 font-bold text-sm mb-1">{t.threat}</div>
                  <div className="text-red-200/60 text-xs">{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lien Bio-Focus */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/30 text-center">
          <div className="text-4xl mb-3">🔬</div>
          <h3 className="text-xl font-black text-white mb-2">Explorez ce biome en vrai !</h3>
          <p className="text-emerald-200/70 text-sm mb-5 max-w-lg mx-auto">
            Sur le terrain de permaculture Terra Nova, le jeu <strong className="text-emerald-300">Bio-Focus</strong> vous invite à photographier et identifier les habitants de ce biome avec un appareil grossissant ×1000.
          </p>
          <Link to={createPageUrl('BioFocus')}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg">
              🔬 Lancer Bio-Focus →
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}