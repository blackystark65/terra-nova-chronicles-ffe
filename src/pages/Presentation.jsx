import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ChevronLeft, ChevronRight, Maximize2, Minimize2, Download,
  Globe, BookOpen, Leaf, Trophy, Flame, Recycle, Bug, Droplets,
  GraduationCap, Star, Zap, Users, CreditCard, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  // 0 — Couverture
  {
    id: 'cover',
    bg: 'from-emerald-950 via-teal-950 to-slate-950',
    title: 'Couverture',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16 min-h-[70vh]">
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="w-28 h-28 rounded-full overflow-hidden shadow-2xl shadow-emerald-500/50 mb-8">
          <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/af6a6b206_green-earth-globe-with-continents-oceans.png"
            alt="Terre" className="w-full h-full object-cover" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-4">
          Chroniques de<br />Terra Nova
        </h1>
        <p className="text-2xl text-emerald-300/80 mb-8 max-w-2xl">
          La plateforme éducative pour explorer, comprendre et protéger notre planète
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {['Enseignants', 'Élèves', 'Familles', 'Établissements scolaires'].map(p => (
            <span key={p} className="px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-base font-semibold">{p}</span>
          ))}
        </div>
        <p className="text-emerald-400/40 text-sm italic">© 2025 Terra Nova — Plateforme ludo-éducative</p>
      </div>
    ),
  },

  // 1 — Problématique
  {
    id: 'probleme',
    bg: 'from-slate-950 via-red-950 to-slate-950',
    title: 'Le Défi',
    content: (
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 text-center">Pourquoi Terra Nova ?</h2>
        <p className="text-white/60 text-center text-lg mb-10">Les jeunes d'aujourd'hui héritent d'une planète en crise. L'éducation est la première réponse.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { emoji: '🌡️', stat: '1,5°C', label: 'Hausse de température déjà atteinte', color: 'red' },
            { emoji: '🦋', stat: '40%', label: 'des espèces d\'insectes en déclin', color: 'amber' },
            { emoji: '🌊', stat: '8M', label: 'tonnes de plastique dans les océans chaque année', color: 'blue' },
          ].map((s, i) => (
            <div key={i} className={`p-6 rounded-3xl bg-${s.color}-500/10 border border-${s.color}-400/20 text-center`}>
              <div className="text-5xl mb-3">{s.emoji}</div>
              <div className={`text-4xl font-black text-${s.color}-300 mb-2`}>{s.stat}</div>
              <p className={`text-${s.color}-200/70 text-sm`}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 rounded-3xl bg-emerald-500/10 border border-emerald-400/20 text-center">
          <p className="text-xl text-emerald-300 font-bold">
            🌱 Terra Nova transforme ces enjeux en apprentissages ludiques, engageants et mémorables pour les élèves.
          </p>
        </div>
      </div>
    ),
  },

  // 2 — C'est quoi
  {
    id: 'quoi',
    bg: 'from-slate-950 via-emerald-950 to-teal-950',
    title: "Qu'est-ce que c'est ?",
    content: (
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
            <Globe className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-black text-white">Une plateforme complète</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { emoji: '🎮', title: 'Ludique & Engageante', desc: 'Jeux interactifs, missions, quiz, simulations — les élèves apprennent en s\'amusant et reviennent d\'eux-mêmes.' },
            { emoji: '🔬', title: 'Scientifiquement Rigoureuse', desc: 'Données réelles, espèces authentiques, problématiques environnementales actuelles. Contenus validés et sourcés.' },
            { emoji: '👩‍🏫', title: 'Outil pour Enseignants', desc: 'Compatible avec les programmes SVT, géographie, éducation citoyenne. Gestion des classes et suivi des élèves intégrés.' },
            { emoji: '🏆', title: 'Système de Progression', desc: 'XP, crédits, badges, niveaux Éco-Sentinelle. Chaque action est valorisée et encourage la progression.' },
          ].map((c, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/5 border border-emerald-400/20 flex gap-4">
              <div className="text-4xl flex-shrink-0">{c.emoji}</div>
              <div>
                <h3 className="text-xl font-bold text-emerald-300 mb-2">{c.title}</h3>
                <p className="text-emerald-200/60 text-sm leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 3 — Modules
  {
    id: 'modules',
    bg: 'from-teal-950 via-cyan-950 to-slate-950',
    title: 'Les Modules',
    content: (
      <div className="px-8 py-10 max-w-5xl mx-auto">
        <h2 className="text-4xl font-black text-white mb-2 text-center">12 Modules Éducatifs</h2>
        <p className="text-cyan-300/60 text-center mb-8">Tous accessibles depuis une seule plateforme</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '🗺️', name: 'Atlas des Biomes', color: 'emerald', desc: '8 biomes détaillés' },
            { emoji: '🦅', name: 'Biodiversité', color: 'teal', desc: '80+ espèces à identifier' },
            { emoji: '♻️', name: 'Recyclage', color: 'green', desc: '10 zones, 10 rôles' },
            { emoji: '🌾', name: 'Micro-ferme', color: 'lime', desc: '7 rôles agricoles' },
            { emoji: '🧠', name: 'Quiz', color: 'purple', desc: '5 catégories thématiques' },
            { emoji: '🎯', name: 'Missions', color: 'orange', desc: '4 niveaux de difficulté' },
            { emoji: '📚', name: 'Encyclopédie IA', color: 'cyan', desc: 'Agent conversationnel' },
            { emoji: '🌡️', name: 'Tableau Climat', color: 'blue', desc: 'Données temps réel' },
            { emoji: '📖', name: 'Écosphère', color: 'emerald', desc: '11 chapitres illustrés' },
            { emoji: '🐝', name: 'Pollinisation', color: 'yellow', desc: 'Module interactif' },
            { emoji: '🔬', name: 'Bio-Focus', color: 'amber', desc: 'Jeu de terrain ×1000' },
            { emoji: '🧩', name: 'Puzzle & Jeux', color: 'rose', desc: 'Mini-jeux éducatifs' },
          ].map((m, i) => (
            <div key={i} className={`p-4 rounded-2xl bg-${m.color}-500/10 border border-${m.color}-400/20 text-center`}>
              <div className="text-3xl mb-2">{m.emoji}</div>
              <div className={`font-bold text-${m.color}-300 text-xs mb-1`}>{m.name}</div>
              <div className={`text-${m.color}-200/50 text-xs`}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 4 — Pour enseignants
  {
    id: 'enseignants',
    bg: 'from-blue-950 via-indigo-950 to-slate-950',
    title: 'Pour les Enseignants',
    content: (
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30">
            <GraduationCap className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl font-black text-white">Pour les <span className="text-blue-300">Enseignants</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {[
            { emoji: '📚', title: 'Intégration au programme', desc: 'Compatible SVT, géographie, éducation citoyenne — primaire au lycée.' },
            { emoji: '👥', title: 'Gestion des classes', desc: 'Créez vos classes, assignez des rôles et suivez la progression de chaque élève.' },
            { emoji: '🔬', title: 'Bio-Focus Terrain', desc: 'Organisez des sessions de terrain avec codes d\'accès par équipe et suivi en temps réel.' },
            { emoji: '📊', title: 'Suivi en temps réel', desc: 'Profil EcoSentinelle de chaque élève : XP, badges, missions complétées.' },
            { emoji: '🎯', title: 'Missions personnalisées', desc: 'Créez et assignez vos propres missions et quiz depuis l\'interface admin.' },
            { emoji: '🌱', title: 'Ferme collaborative', desc: 'Chaque élève joue un rôle unique dans la micro-ferme communautaire.' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-blue-400/20">
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="text-base font-bold text-blue-300 mb-2">{item.title}</h3>
              <p className="text-blue-200/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-blue-200 text-sm text-center">
          💡 <strong>Interface administrateur dédiée</strong> — tableau de bord, gestion des contenus, statistiques de classe
        </div>
      </div>
    ),
  },

  // 5 — Pour les élèves
  {
    id: 'eleves',
    bg: 'from-orange-950 via-amber-950 to-slate-950',
    title: 'Pour les Élèves',
    content: (
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30">
            <Star className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white">Pour les <span className="text-orange-300">Élèves</span></h2>
            <p className="text-orange-400/60">Deviens un Éco-Sentinelle !</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { emoji: '🌍', title: 'Explorer les biomes', desc: 'Forêts tropicales, océans, savanes, arctique… 8 univers à découvrir.' },
            { emoji: '🦅', title: 'Identifier les espèces', desc: '80+ espèces — reconnaître à la photo ET au chant pour les oiseaux.' },
            { emoji: '♻️', title: 'Trier des déchets', desc: 'Jeu de rôle dans un hôtel : trie les déchets dans les bonnes poubelles.' },
            { emoji: '🌾', title: 'Gérer la micro-ferme', desc: 'Plante, récolte, transforme et vend dans l\'épicerie coopérative.' },
            { emoji: '🔬', title: 'Enquêter le sol', desc: 'Bio-Focus : photographie les organismes du sol avec un appareil ×1000.' },
            { emoji: '🏅', title: 'Progresser & Gagner', desc: 'XP, crédits, badges, niveaux Éco-Sentinelle — chaque action compte.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-orange-400/20">
              <span className="text-3xl flex-shrink-0">{item.emoji}</span>
              <div>
                <h3 className="text-base font-bold text-orange-300 mb-1">{item.title}</h3>
                <p className="text-orange-200/60 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 6 — Bio-Focus focus
  {
    id: 'biofocus',
    bg: 'from-slate-950 via-green-950 to-emerald-950',
    title: '🔬 Bio-Focus',
    content: (
      <div className="px-8 py-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="text-5xl">🔬</div>
          <div>
            <h2 className="text-4xl font-black text-white">Bio-Focus</h2>
            <p className="text-emerald-400/60">Les Enquêteurs de l'Humus — Jeu de terrain unique</p>
          </div>
        </div>
        <p className="text-emerald-200/70 text-lg mb-6">
          Un jeu ludo-éducatif <strong className="text-emerald-300">sur le terrain</strong> : 2 équipes photographient les organismes décomposeurs du sol avec un appareil ×1000. Qui construit l'écosystème le plus riche ?
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-400/20">
            <h3 className="font-bold text-sky-300 mb-3">👩‍🏫 L'enseignant</h3>
            <ul className="space-y-2 text-sky-200/70 text-sm">
              <li>• Crée la session (nom de classe + degré scolaire libre)</li>
              <li>• Reçoit <strong className="text-white">2 codes uniques</strong> d'équipe</li>
              <li>• Répartit ses élèves selon ses critères pédagogiques</li>
              <li>• Clôture la session → récompenses automatiques</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20">
            <h3 className="font-bold text-emerald-300 mb-3">🎒 Les élèves</h3>
            <ul className="space-y-2 text-emerald-200/70 text-sm">
              <li>• Rejoignent leur équipe avec le code</li>
              <li>• Photographient les espèces in situ</li>
              <li>• Uploadent en temps réel depuis smartphone/tablette/<strong className="text-amber-300">Kideo ×1000</strong></li>
              <li>• Score mis à jour instantanément pour toute l'équipe</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-center">
            <div className="text-2xl mb-1">🪱</div>
            <div className="font-bold text-amber-300 text-xs">Transformateurs</div>
            <div className="text-amber-200/60 text-xs">10 pts/espèce</div>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/20 text-center">
            <div className="text-2xl mb-1">🦂</div>
            <div className="font-bold text-red-300 text-xs">Prédateurs</div>
            <div className="text-red-200/60 text-xs">20 pts/espèce</div>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-400/20 text-center">
            <div className="text-2xl mb-1">🍄</div>
            <div className="font-bold text-teal-300 text-xs">Nettoyeurs</div>
            <div className="text-teal-200/60 text-xs">15 pts/espèce</div>
          </div>
        </div>
      </div>
    ),
  },

  // 7 — Tarifs & Abonnement
  {
    id: 'tarifs',
    bg: 'from-violet-950 via-purple-950 to-slate-950',
    title: 'Tarifs & Abonnement',
    content: (
      <div className="px-8 py-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-violet-500/20 border border-violet-400/30">
            <CreditCard className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white">Accès par Établissement</h2>
            <p className="text-violet-400/60">Abonnement annuel — tous les élèves inclus</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {[
            {
              label: 'Établissement Standard',
              price: 'CHF 390',
              period: '/an',
              color: 'emerald',
              features: ['Jusqu\'à 150 élèves', 'Tous les modules inclus', '3 enseignants admin', 'Support email'],
              cta: 'Choisir ce plan',
            },
            {
              label: 'Établissement Premium',
              price: 'CHF 690',
              period: '/an',
              color: 'amber',
              badge: '⭐ Recommandé',
              features: ['Élèves illimités', 'Tous les modules inclus', 'Enseignants illimités', 'Bio-Focus terrain inclus', 'Support prioritaire', 'Personnalisation logo'],
              cta: 'Choisir ce plan',
            },
            {
              label: 'Réseau d\'écoles',
              price: 'Sur devis',
              period: '',
              color: 'blue',
              features: ['Plusieurs établissements', 'Dashboard centralisé', 'Formation enseignants', 'Accompagnement pédagogique', 'Intégration ENT'],
              cta: 'Nous contacter',
            },
          ].map((plan, i) => (
            <div key={i} className={`p-6 rounded-3xl bg-${plan.color}-500/10 border-2 border-${plan.color}-400/30 flex flex-col`}>
              {plan.badge && (
                <div className="text-xs font-bold text-amber-300 mb-2">{plan.badge}</div>
              )}
              <h3 className={`font-black text-${plan.color}-300 text-lg mb-1`}>{plan.label}</h3>
              <div className="flex items-end gap-1 mb-4">
                <span className={`text-4xl font-black text-${plan.color}-200`}>{plan.price}</span>
                <span className={`text-${plan.color}-400/60 mb-1`}>{plan.period}</span>
              </div>
              <ul className="space-y-2 flex-1 mb-4">
                {plan.features.map((f, j) => (
                  <li key={j} className={`text-sm text-${plan.color}-200/70 flex gap-2`}>
                    <span className={`text-${plan.color}-400 flex-shrink-0`}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to={createPageUrl('Abonnement')}>
                <button className={`w-full py-2 rounded-xl font-bold text-sm bg-${plan.color}-500/20 hover:bg-${plan.color}-500/30 text-${plan.color}-300 border border-${plan.color}-400/30 transition-all`}>
                  {plan.cta} →
                </button>
              </Link>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-white/50 text-sm">
          🔒 Paiement sécurisé via Stripe — Facture disponible — Résiliable chaque année
        </div>
      </div>
    ),
  },

  // 8 — Contact / Démarrage
  {
    id: 'contact',
    bg: 'from-emerald-950 via-teal-950 to-cyan-950',
    title: 'Commencer',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16 min-h-[70vh]">
        <div className="text-7xl mb-6">🚀</div>
        <h2 className="text-5xl font-black text-white mb-4">Prêt à démarrer ?</h2>
        <p className="text-emerald-200/70 text-xl mb-10 max-w-2xl">
          Offrez à vos élèves une expérience éducative unique. Rejoignez la communauté Terra Nova.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-10 w-full max-w-3xl">
          {[
            { emoji: '1️⃣', title: 'Souscrire', desc: 'Choisissez votre plan et réglez en ligne via Stripe sécurisé.' },
            { emoji: '2️⃣', title: 'Configurer', desc: 'Créez vos classes, invitez vos élèves, personnalisez vos modules.' },
            { emoji: '3️⃣', title: 'Explorer', desc: 'Vos élèves accèdent à tous les modules dès le premier jour !' },
          ].map((step, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-emerald-400/20">
              <div className="text-3xl mb-3">{step.emoji}</div>
              <h3 className="text-emerald-300 font-bold mb-2">{step.title}</h3>
              <p className="text-emerald-200/60 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to={createPageUrl('Abonnement')}>
            <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl">
              <CreditCard className="w-5 h-5 mr-2" />
              Souscrire un abonnement
            </Button>
          </Link>
          <Link to={createPageUrl('Home')}>
            <Button variant="outline" className="px-8 py-6 text-lg rounded-2xl bg-white/5 border-emerald-400/30 text-emerald-300 hover:bg-white/10">
              <Home className="w-5 h-5 mr-2" />
              Explorer la plateforme
            </Button>
          </Link>
        </div>
        <p className="text-white/30 text-sm mt-8">📧 contact@terra-nova.edu — 🌐 terra-nova.edu</p>
      </div>
    ),
  },
];

export default function PresentationPage() {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef(null);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(SLIDES.length - 1, c + 1));
  const slide = SLIDES[current];

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Keyboard nav
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
      if (e.key === 'f' || e.key === 'F') handleFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={containerRef} className={`min-h-screen bg-gradient-to-br ${slide.bg} transition-all duration-700 flex flex-col print:min-h-0`}>
      {/* Barre du haut */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-black/50 backdrop-blur-xl border-b border-white/10 print:hidden">
        <div className="flex items-center gap-3">
          <Link to={createPageUrl('Home')}>
            <span className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">← Accueil</span>
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white/60 text-sm font-semibold">{slide.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs">{current + 1} / {SLIDES.length}</span>
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all border border-emerald-400/20">
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={handleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <Link to={createPageUrl('Abonnement')}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs font-semibold transition-all border border-violet-400/20">
              <CreditCard className="w-3.5 h-3.5" /> S'abonner
            </button>
          </Link>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="min-h-full"
          >
            {slide.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Barre de navigation */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-xl border-t border-white/10 print:hidden">
        <button onClick={prev} disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all">
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Précédent</span>
        </button>

        <div className="flex items-center gap-1.5">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>

        <button onClick={next} disabled={current === SLIDES.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all">
          <span className="hidden sm:inline text-sm">Suivant</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Styles impression */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}