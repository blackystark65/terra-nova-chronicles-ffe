import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import {
  ChevronLeft, ChevronRight, Globe, BookOpen, Leaf, Trophy, Flame,
  Recycle, Map, Music, Puzzle, Users, GraduationCap, Star, Zap,
  TreeDeciduous, Bug, Droplets, Mountain, ArrowRight, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  // ── SLIDE 0 : Couverture ──
  {
    id: 'cover',
    bg: 'from-emerald-950 via-teal-950 to-slate-950',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32 rounded-full overflow-hidden shadow-2xl shadow-emerald-500/50 mb-8"
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/af6a6b206_green-earth-globe-with-continents-oceans.png"
            alt="Terre"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent mb-4">
          Chroniques de Terra Nova
        </h1>
        <p className="text-xl md:text-2xl text-emerald-300/80 mb-6 max-w-2xl">
          La plateforme éducative pour explorer, comprendre et protéger notre planète
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Enseignants', 'Élèves', 'Familles', 'Curieux'].map(p => (
            <span key={p} className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold">
              {p}
            </span>
          ))}
        </div>
        <p className="text-emerald-400/50 text-sm italic">Utilisez les flèches pour naviguer dans cette présentation →</p>
      </div>
    ),
  },

  // ── SLIDE 1 : C'est quoi ? ──
  {
    id: 'intro',
    bg: 'from-slate-950 via-emerald-950 to-teal-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
            <Globe className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Qu'est-ce que Terra Nova ?</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-3xl bg-white/5 border border-emerald-400/20">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-emerald-300 mb-2">Une plateforme éducative immersive</h3>
            <p className="text-emerald-200/70">
              Terra Nova est un espace numérique qui mêle jeux, quiz, exploration et simulation pour sensibiliser les jeunes à la biodiversité, à l'écologie et au développement durable.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-teal-400/20">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-teal-300 mb-2">Apprendre en jouant</h3>
            <p className="text-teal-200/70">
              Chaque module est conçu pour être ludique et pédagogique : les élèves progressent, gagnent des points, débloquent des badges et explorent des contenus réels.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-cyan-400/20">
            <div className="text-4xl mb-4">👩‍🏫</div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">Pour les enseignants</h3>
            <p className="text-cyan-200/70">
              La plateforme s'intègre facilement en cours de SVT, géographie, éducation citoyenne. Les élèves travaillent en autonomie ou en classe.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-purple-400/20">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-purple-300 mb-2">Progression et récompenses</h3>
            <p className="text-purple-200/70">
              Chaque action rapporte des points XP, des crédits et des badges. Un profil personnalisé suit la progression de chaque élève.
            </p>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 2 : Pour les enseignants ──
  {
    id: 'teachers',
    bg: 'from-blue-950 via-indigo-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30">
            <GraduationCap className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Pour les <span className="text-blue-300">Enseignants</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {[
            { emoji: '📚', title: 'Intégration pédagogique', desc: 'Compatible avec les programmes SVT, géographie et éducation citoyenne de l\'école primaire au lycée.' },
            { emoji: '👥', title: 'Gestion par classes', desc: 'Créez des classes (ClasseFerme), assignez des rôles aux élèves et suivez leur progression en temps réel.' },
            { emoji: '🎯', title: 'Missions ciblées', desc: 'Définissez des missions spécifiques par biome ou thème : quiz, observation, recherche, défi.' },
            { emoji: '📊', title: 'Suivi des élèves', desc: 'Chaque élève dispose d\'un profil EcoSentinelle avec ses points XP, badges et statistiques.' },
            { emoji: '🔧', title: 'Personnalisation', desc: 'Ajoutez vos propres missions et quiz directement depuis l\'interface administrateur.' },
            { emoji: '🌱', title: 'Micro-ferme collaborative', desc: 'Le module Micro-ferme simule une exploitation agricole où chaque élève joue un rôle précis.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl bg-white/5 border border-blue-400/20">
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="text-base font-bold text-blue-300 mb-2">{item.title}</h3>
              <p className="text-blue-200/60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-200 text-sm">
          💡 <strong>Conseil :</strong> Commencez par créer une classe dans "Micro-ferme", assignez des rôles à vos élèves, puis lancez une session de jeu collective !
        </div>
      </div>
    ),
  },

  // ── SLIDE 3 : Pour les élèves ──
  {
    id: 'students',
    bg: 'from-orange-950 via-amber-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30">
            <Star className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">Pour les <span className="text-orange-300">Élèves</span></h2>
        </div>
        <p className="text-orange-200/70 text-lg mb-8 max-w-2xl">
          Tu deviens un <strong className="text-orange-300">Éco-Sentinelle</strong> : un gardien de la planète qui explore, apprend et agit pour protéger les écosystèmes !
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { emoji: '🌍', title: 'Explore 8 biomes', desc: 'Forêts tropicales, océans, savanes, arctique, zones humides, déserts, montagnes et forêts tempérées.' },
            { emoji: '🦅', title: 'Découvre des espèces', desc: '80+ espèces à identifier grâce à leurs photos et leurs chants (mode son pour les oiseaux !).' },
            { emoji: '♻️', title: 'Trie des déchets', desc: 'Dans le jeu de recyclage, tu tris les déchets de l\'hôtel Terra Nova dans les bonnes poubelles.' },
            { emoji: '🌱', title: 'Cultive ta ferme', desc: 'Plante, arrose, récolte et transforme des produits dans la micro-ferme communautaire.' },
            { emoji: '🧠', title: 'Réponds aux quiz', desc: 'Des centaines de questions sur la permaculture, les forêts, l\'eau, le climat et l\'agroécologie.' },
            { emoji: '🏅', title: 'Gagne des badges', desc: 'Recycle Débutant, Expert en Biodiversité, Explorateur de Biomes... Débloque-les tous !' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-orange-400/20">
              <span className="text-3xl flex-shrink-0">{item.emoji}</span>
              <div>
                <h3 className="text-base font-bold text-orange-300 mb-1">{item.title}</h3>
                <p className="text-orange-200/60 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },

  // ── SLIDE 4 : Atlas & Biomes ──
  {
    id: 'atlas',
    bg: 'from-emerald-950 via-green-950 to-teal-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
            <Map className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Atlas des Biomes</h2>
            <p className="text-emerald-400/60 text-sm">Module : Exploration géographique</p>
          </div>
        </div>
        <p className="text-emerald-200/70 mb-6">
          L'Atlas est le point de départ de la plateforme. Il présente une carte interactive du monde avec <strong className="text-emerald-300">8 grands biomes</strong>. Chaque biome dispose d'une page détaillée avec des espèces emblématiques, des faits scientifiques et les menaces qui pèsent sur lui.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { emoji: '🌴', name: 'Forêts tropicales', color: 'from-green-600 to-emerald-700' },
            { emoji: '🌊', name: 'Océans & Récifs', color: 'from-blue-600 to-cyan-700' },
            { emoji: '🦁', name: 'Savanes', color: 'from-amber-600 to-orange-700' },
            { emoji: '❄️', name: 'Arctique', color: 'from-slate-500 to-blue-700' },
            { emoji: '🌵', name: 'Déserts', color: 'from-yellow-600 to-amber-700' },
            { emoji: '🌿', name: 'Zones humides', color: 'from-teal-600 to-cyan-700' },
            { emoji: '🏔️', name: 'Montagnes', color: 'from-slate-600 to-stone-700' },
            { emoji: '🌲', name: 'Forêts tempérées', color: 'from-lime-600 to-green-700' },
          ].map((b, i) => (
            <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${b.color} text-center border border-white/10`}>
              <div className="text-3xl mb-2">{b.emoji}</div>
              <div className="text-white text-xs font-bold">{b.name}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-sm text-emerald-200/80">
          🎓 <strong>Usage pédagogique :</strong> Idéal pour des cours de géographie et SVT. Les élèves peuvent explorer chaque biome, lire les fiches espèces et compléter des missions associées.
        </div>
      </div>
    ),
  },

  // ── SLIDE 5 : Biodiversité ──
  {
    id: 'biodiversite',
    bg: 'from-teal-950 via-emerald-950 to-green-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-400/30">
            <Bug className="w-8 h-8 text-teal-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Jeu Biodiversité</h2>
            <p className="text-teal-400/60 text-sm">Module : Identification des espèces</p>
          </div>
        </div>
        <p className="text-teal-200/70 mb-6">
          Un jeu de cartes pour identifier <strong className="text-teal-300">80+ espèces européennes</strong> : oiseaux, mammifères, reptiles, insectes, fleurs, arbres et plantes aromatiques.
        </p>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {[
            { emoji: '👁️', title: 'Mode Image', desc: 'Identifie l\'espèce à partir de sa photo. Description et indices disponibles.' },
            { emoji: '🎵', title: 'Mode Son', desc: 'Reconnais l\'oiseau uniquement à partir de son chant. 34 espèces avec audio réel !' },
            { emoji: '🌿', title: 'Mode Mixte', desc: 'Mélange sons pour les oiseaux et images pour les autres espèces.' },
          ].map((m, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-teal-400/20 text-center">
              <div className="text-4xl mb-3">{m.emoji}</div>
              <h3 className="font-bold text-teal-300 mb-2">{m.title}</h3>
              <p className="text-teal-200/60 text-sm">{m.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          {['🐦 34 Oiseaux', '🦊 7 Mammifères', '🐸 5 Batraciens', '🦎 5 Reptiles', '🐝 6 Insectes'].map((cat, i) => (
            <div key={i} className="p-3 rounded-xl bg-teal-500/10 border border-teal-400/20 text-center text-teal-300 text-xs font-bold">{cat}</div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/20 text-sm text-teal-200/80">
          🎓 <strong>Usage pédagogique :</strong> Parfait pour les cours de sciences naturelles. Le système de points motive les élèves à mémoriser et reconnaître les espèces locales.
        </div>
      </div>
    ),
  },

  // ── SLIDE 6 : Recyclage ──
  {
    id: 'recyclage',
    bg: 'from-green-950 via-emerald-950 to-lime-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-green-500/20 border border-green-400/30">
            <Recycle className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Jeu de Recyclage</h2>
            <p className="text-green-400/60 text-sm">Module : Tri et gestion des déchets</p>
          </div>
        </div>
        <p className="text-green-200/70 mb-6">
          Dans l'hôtel <strong className="text-green-300">Terra Nova</strong>, les déchets s'accumulent dans différentes zones. Les joueurs choisissent un rôle et trient les déchets dans les bonnes poubelles avant qu'elles ne débordent !
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-green-400/20">
            <h3 className="font-bold text-green-300 mb-3">🏨 10 zones de jeu</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Cuisine', 'Restaurant', 'Réception', 'Chambres', 'Piscine', 'Plage', 'Marina', 'Parking', 'Déchetterie', 'Boutique'].map(z => (
                <span key={z} className="text-xs text-green-200/60 bg-green-500/10 px-2 py-1 rounded-lg">{z}</span>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-green-400/20">
            <h3 className="font-bold text-green-300 mb-3">👷 10 rôles disponibles</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Client', 'Réceptionniste', 'Nettoyeur', 'Cuisinier', 'Serveur', 'Jardinier', 'Chauffeur', 'Maître nageur', 'Port', 'Épicier'].map(r => (
                <span key={r} className="text-xs text-green-200/60 bg-green-500/10 px-2 py-1 rounded-lg">{r}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { emoji: '📦', label: '6 types de poubelles', sub: 'Papier, Plastique, Verre, Organique, Métal, Général' },
            { emoji: '⏱️', label: 'Temps réel', sub: 'Les poubelles se remplissent et débordent si on ne les vide pas' },
            { emoji: '🚛', label: 'Animation camion', sub: 'Animation quand tu vides une poubelle pleine' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-green-500/10 border border-green-400/20 text-center">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <div className="text-green-300 text-xs font-bold mb-1">{item.label}</div>
              <div className="text-green-200/50 text-xs">{item.sub}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-400/20 text-sm text-green-200/80">
          🎓 <strong>Usage pédagogique :</strong> Enseigne les règles du tri sélectif suisses/européennes. Chaque déchet mal trié entraîne des pénalités pédagogiques.
        </div>
      </div>
    ),
  },

  // ── SLIDE 7 : Micro-ferme ──
  {
    id: 'microferme',
    bg: 'from-lime-950 via-green-950 to-emerald-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-lime-500/20 border border-lime-400/30">
            <Leaf className="w-8 h-8 text-lime-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Micro-Ferme Communautaire</h2>
            <p className="text-lime-400/60 text-sm">Module : Agriculture & permaculture</p>
          </div>
        </div>
        <p className="text-lime-200/70 mb-6">
          Une simulation complète d'une micro-ferme où chaque élève joue un <strong className="text-lime-300">rôle spécialisé</strong>. Ensemble, ils font fonctionner l'exploitation : de la graine à la vente !
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div>
            <h3 className="font-bold text-lime-300 mb-3">🌾 Les 7 rôles de la ferme</h3>
            <div className="space-y-2">
              {[
                { r: '🥕 Maraîcher', d: 'Cultive le potager, plante et récolte légumes' },
                { r: '🍎 Arboriste', d: 'Entretient les arbres fruitiers' },
                { r: '🍞 Boulanger', d: 'Transforme la farine en pain pour l\'épicerie' },
                { r: '🐄 Éleveur', d: 'S\'occupe des animaux de la ferme' },
                { r: '🛒 Épicier', d: 'Gère les stocks et vend les produits' },
                { r: '🌳 Jardinier forêt', d: 'Cultive la forêt-jardin' },
                { r: '🌸 Horticulteur', d: 'Gère la serre et les semis' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-xl bg-white/5 border border-lime-400/10">
                  <span className="text-sm font-bold text-lime-300 w-32 flex-shrink-0">{item.r}</span>
                  <span className="text-lime-200/60 text-sm">{item.d}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lime-300 mb-3">🗺️ Les zones de la ferme</h3>
            <div className="grid grid-cols-2 gap-2">
              {['🏫 Centre de formation', '🌽 Champ Milpa', '🌿 Permaculture', '🌱 Pépinière/Serre', '🌳 Forêt-jardin', '🐔 Ferme pédagogique', '🍞 Boulangerie', '🛒 Épicerie', '♻️ Compost', '🌾 Bocage'].map((z, i) => (
                <span key={i} className="text-xs text-lime-200/60 bg-lime-500/10 px-2 py-1.5 rounded-lg">{z}</span>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-2xl bg-lime-500/10 border border-lime-400/20">
              <div className="text-lime-300 text-sm font-bold mb-1">💰 Économie interne</div>
              <p className="text-lime-200/60 text-xs">Les produits vendus à l'épicerie génèrent des crédits. La caisse centrale redistribue les salaires aux élèves selon leur activité.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 8 : Quiz & Missions ──
  {
    id: 'quiz-missions',
    bg: 'from-purple-950 via-indigo-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quiz */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-400/30">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Quiz</h2>
                <p className="text-purple-400/60 text-xs">Module : Évaluation des connaissances</p>
              </div>
            </div>
            <p className="text-purple-200/70 mb-5 text-sm">
              Des centaines de questions organisées par thème. Chaque bonne réponse rapporte des XP et des crédits.
            </p>
            <div className="space-y-3">
              {[
                { emoji: '🌱', cat: 'Permaculture', desc: 'Principes de design écologique' },
                { emoji: '🌳', cat: 'Forêt', desc: 'Écosystèmes forestiers' },
                { emoji: '🚜', cat: 'Agroécologie', desc: 'Agriculture durable' },
                { emoji: '💧', cat: 'Eau', desc: 'Cycle et gestion de l\'eau' },
                { emoji: '🌡️', cat: 'Climat', desc: 'Changement climatique' },
              ].map((q, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
                  <span className="text-xl">{q.emoji}</span>
                  <div>
                    <div className="text-purple-300 text-sm font-bold">{q.cat}</div>
                    <div className="text-purple-200/50 text-xs">{q.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Missions */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Missions</h2>
                <p className="text-orange-400/60 text-xs">Module : Défis éco-citoyens</p>
              </div>
            </div>
            <p className="text-orange-200/70 mb-5 text-sm">
              Des missions actives à compléter, classées par biome et difficulté. Elles combinent quiz, observation et recherche.
            </p>
            <div className="space-y-3">
              {[
                { emoji: '🌿', label: 'Débutant', desc: 'Missions d\'introduction accessibles à tous' },
                { emoji: '🔬', label: 'Intermédiaire', desc: 'Nécessite quelques connaissances préalables' },
                { emoji: '🧬', label: 'Avancé', desc: 'Missions approfondies pour les passionnés' },
                { emoji: '⚡', label: 'Expert', desc: 'Défis pour les vrais Éco-Sentinelles' },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-400/20">
                  <span className="text-xl">{d.emoji}</span>
                  <div>
                    <div className="text-orange-300 text-sm font-bold">{d.label}</div>
                    <div className="text-orange-200/50 text-xs">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 9 : Profil & Progression ──
  {
    id: 'profil',
    bg: 'from-amber-950 via-orange-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Profil & Progression</h2>
            <p className="text-amber-400/60 text-sm">Module : Suivi de l'élève</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-amber-300 mb-4">🎮 Système de progression</h3>
            <div className="space-y-4">
              {[
                { emoji: '⚡', label: 'Points XP', desc: 'Gagnés en complétant missions, quiz et activités de jeu. Permettent de monter de niveau.' },
                { emoji: '💰', label: 'Crédits', desc: 'Monnaie virtuelle pour acheter à l\'épicerie. Gagnés via les jeux et missions.' },
                { emoji: '🌍', label: 'Niveau Éco-Sentinelle', desc: 'De 1 à ∞, monte avec les XP accumulés. Chaque niveau débloque de nouveaux contenus.' },
                { emoji: '📍', label: 'Score d\'impact', desc: 'Mesure l\'impact total du joueur sur la planète. Combine toutes les activités.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="text-amber-300 text-sm font-bold">{item.label}</div>
                    <div className="text-amber-200/60 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-300 mb-4">🏅 Badges à débloquer</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🌏', name: 'Explorateur', desc: 'Explorer tous les biomes' },
                { emoji: '♻️', name: 'Recycleur', desc: 'Trier 10+ déchets' },
                { emoji: '🔬', name: 'Scientifique', desc: 'Compléter 5 quiz' },
                { emoji: '🌱', name: 'Agriculteur', desc: 'Récolter à la ferme' },
                { emoji: '🦉', name: 'Naturaliste', desc: 'Identifier 20 espèces' },
                { emoji: '⚡', name: 'Éco-Warrior', desc: 'Score recyclage 500+' },
              ].map((badge, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-center">
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <div className="text-amber-300 text-xs font-bold">{badge.name}</div>
                  <div className="text-amber-200/40 text-xs">{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 10 : Encyclopédie & Climat ──
  {
    id: 'autres',
    bg: 'from-cyan-950 via-teal-950 to-slate-950',
    content: (
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-white mb-6">Autres modules</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-cyan-400/20">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-cyan-300">Encyclopédie</h3>
            </div>
            <p className="text-cyan-200/70 text-sm mb-3">
              Un agent IA conversationnel spécialisé en biodiversité et écologie. Pose tes questions librement et obtiens des réponses détaillées avec des sources fiables.
            </p>
            <div className="space-y-1">
              {['💬 Chat en langage naturel', '🌿 Spécialisé en écologie', '📚 Réponses sourcées', '🔍 Recherche web intégrée'].map(f => (
                <div key={f} className="text-xs text-cyan-200/60">{f}</div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-blue-400/20">
            <div className="flex items-center gap-3 mb-3">
              <Droplets className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-blue-300">Tableau de bord Climat</h3>
            </div>
            <p className="text-blue-200/70 text-sm mb-3">
              Données climatiques en temps réel de plusieurs villes mondiales. Température, qualité de l'air, humidité, et tendances historiques visualisées en graphiques.
            </p>
            <div className="space-y-1">
              {['🌡️ Météo en temps réel', '🏙️ Villes mondiales', '📊 Graphiques interactifs', '🌍 Données scientifiques'].map(f => (
                <div key={f} className="text-xs text-blue-200/60">{f}</div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-emerald-400/20">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-emerald-300">L'Écosphère</h3>
            </div>
            <p className="text-emerald-200/70 text-sm">
              Un livre illustré de planches dessinées sur l'agroécologie, la biodiversité et les techniques de vie durable. Organisé en 11 chapitres : climat, eau, permaculture, agroforesterie, semences, sol et bien plus.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-yellow-400/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">🐝</span>
              <h3 className="text-lg font-bold text-yellow-300">Pollinisation</h3>
            </div>
            <p className="text-yellow-200/70 text-sm">
              Un module interactif en diapositives pour comprendre la pollinisation : son importance mondiale, les abeilles sauvages, les papillons, les menaces et comment agir. Inclut des photos et ressources de terrain de Terra Nova.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-violet-400/20">
            <div className="flex items-center gap-3 mb-3">
              <Puzzle className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-bold text-violet-300">Puzzle</h3>
            </div>
            <p className="text-violet-200/70 text-sm">
              Des puzzles interactifs sur des images de la nature et des écosystèmes. Un moment de détente éducatif pour consolider les apprentissages visuels.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-rose-400/20">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold text-rose-300">Jeux libres</h3>
            </div>
            <p className="text-rose-200/70 text-sm">
              Une sélection de mini-jeux éducatifs pour s'amuser tout en apprenant. Idéal en fin de cours ou comme récompense.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-amber-400/20 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">🔬</span>
              <h3 className="text-lg font-bold text-amber-300">Bio-Focus : Les Enquêteurs de l'Humus</h3>
            </div>
            <p className="text-amber-200/70 text-sm">
              Un jeu de terrain ludo-éducatif en 2 équipes. Les joueurs photographient les acteurs de la décomposition (macrofaune, mésofaune, champignons) avec un appareil grossissant ×1000, puis completent leur tableau d'écosystème. Bonus chaîne trophique, défis Expert et bonus biodiversité !
            </p>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 10c : Bio-Focus détail ──
  {
    id: 'biofocus',
    bg: 'from-slate-950 via-green-950 to-emerald-950',
    content: (
      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-3xl">🔬</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Bio-Focus</h2>
            <p className="text-emerald-400/60 text-sm">Les Enquêteurs de l'Humus — Jeu de terrain en 2 équipes</p>
          </div>
        </div>
        <p className="text-emerald-200/70 text-base mb-6 leading-relaxed">
          Un jeu ludo-éducatif combinant <strong className="text-emerald-300">exploration en plein air</strong>, science participative et photographie ×1000. Les joueurs incarnent des <em>"inspecteurs du sol"</em> partis à la recherche des héros invisibles de la décomposition.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-5">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <div className="text-2xl mb-2">🪱</div>
            <h3 className="font-black text-amber-300 text-sm mb-1">Transformateurs</h3>
            <p className="text-amber-200/60 text-xs mb-2">Macrofaune — Broyeurs — 10 pts/espèce</p>
            <ul className="text-xs text-amber-200/70 space-y-0.5">
              <li>🪱 Lombric</li><li>🦗 Cloporte</li><li>🐛 Diplopode</li><li>🐌 Limace</li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-400/30">
            <div className="text-2xl mb-2">🦂</div>
            <h3 className="font-black text-red-300 text-sm mb-1">Prédateurs</h3>
            <p className="text-red-200/60 text-xs mb-2">Mésofaune & Macrofaune — 20 pts/espèce</p>
            <ul className="text-xs text-red-200/70 space-y-0.5">
              <li>🪲 Carabe doré</li><li>🪲 Staphylin</li><li>🕷️ Araignée</li><li>🦂 Pseudoscorpion ⭐</li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/30">
            <div className="text-2xl mb-2">🍄</div>
            <h3 className="font-black text-teal-300 text-sm mb-1">Nettoyeurs</h3>
            <p className="text-teal-200/60 text-xs mb-2">Microfaune & Champignons — 15 pts/espèce</p>
            <ul className="text-xs text-teal-200/70 space-y-0.5">
              <li>🍄 Champignon / Mycélium</li><li>🦟 Collembole ⭐ (×1000)</li>
            </ul>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mb-5">
          {[
            { emoji: '⭐', title: 'Défi Expert', desc: 'Photographier un pseudoscorpion ou collembole : +30 pts !', color: 'purple' },
            { emoji: '🔗', title: 'Chaîne trophique', desc: 'Capturer un prédateur ET sa proie dans le même milieu : +50 pts !', color: 'blue' },
            { emoji: '🌿', title: 'Bonus biodiversité', desc: 'Couvrir les 3 groupes (Transformateurs, Prédateurs, Nettoyeurs) : +100 pts !', color: 'green' },
          ].map((b, i) => (
            <div key={i} className={`p-3 rounded-xl bg-${b.color}-500/10 border border-${b.color}-400/30`}>
              <div className="text-xl mb-1">{b.emoji}</div>
              <div className={`font-bold text-${b.color}-300 text-xs mb-1`}>{b.title}</div>
              <div className={`text-${b.color}-200/60 text-xs`}>{b.desc}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-bold text-white text-sm mb-2">⚙️ Les 3 phases de jeu</h3>
            <ol className="list-decimal list-inside space-y-1 text-white/60 text-xs">
              <li><strong className="text-white/80">La Quête :</strong> Souches en décomposition, litières de feuilles, compost.</li>
              <li><strong className="text-white/80">La Capture :</strong> Photo in situ. Appareil ×1000 disponible pour la microfaune.</li>
              <li><strong className="text-white/80">L'Intégration :</strong> Upload des photos + association au rôle dans l'écosystème.</li>
            </ol>
          </div>
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-400/20">
            <h3 className="font-bold text-green-300 text-sm mb-2">🌿 Règle d'or — Éco-responsabilité</h3>
            <p className="text-green-200/60 text-xs leading-relaxed">
              <strong className="text-green-300">Zéro perturbation !</strong> Tous les animaux sont photographiés dans leur habitat naturel, sans être déplacés ni blessés. Le jeu enseigne le respect de la biodiversité du sol.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">🦔 Équipe Les Fouisseurs</span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/20">🍄 Équipe Les Mycorhizes</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // ── SLIDE 10b : Agenda Terrain & Rapports ──
  {
    id: 'agenda-rapports',
    bg: 'from-orange-950 via-amber-950 to-yellow-950',
    content: (
      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-orange-500/20 border border-orange-400/30 text-3xl">🗓️</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Agenda & Bilans Pédagogiques</h2>
            <p className="text-orange-400/60 text-sm">Réservation d'ateliers — Dossier d'évaluation post-terrain</p>
          </div>
        </div>
        <p className="text-orange-200/70 text-base mb-6 leading-relaxed">
          Un système intégré permettant aux enseignants de <strong className="text-orange-300">réserver des ateliers pédagogiques</strong> sur le terrain de permaculture et de remplir un <strong className="text-yellow-300">bilan d'évaluation complet</strong> après chaque sortie.
        </p>
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {/* Agenda */}
          <div className="p-5 rounded-2xl bg-white/5 border border-orange-400/20 space-y-3">
            <h3 className="font-bold text-orange-300 text-base">📅 Prise de rendez-vous en ligne</h3>
            <ul className="text-orange-200/70 space-y-1.5 text-sm list-disc list-inside">
              <li>Formulaire simplifié pour l'enseignant</li>
              <li>Choix du type d'atelier : Biodiversité, Bio-Focus, Permaculture, Recyclage</li>
              <li>Date souhaitée + date alternative</li>
              <li>Confirmation automatique par email (enseignant + organisateur)</li>
              <li>Notification immédiate à l'équipe Terra Nova</li>
            </ul>
            <Link to={createPageUrl('Agenda')}>
              <button className="mt-2 w-full py-2 rounded-xl bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-bold hover:bg-orange-500/30 transition-all">
                📅 Accéder à l'Agenda →
              </button>
            </Link>
          </div>
          {/* Bilan */}
          <div className="p-5 rounded-2xl bg-white/5 border border-yellow-400/20 space-y-3">
            <h3 className="font-bold text-yellow-300 text-base">📋 Bilan pédagogique post-atelier</h3>
            <ul className="text-yellow-200/70 space-y-1.5 text-sm list-disc list-inside">
              <li>Identification de la classe et de la sortie</li>
              <li>Objectifs d'apprentissage cochés</li>
              <li>Activités réalisées : observation, expérimentation, débat</li>
              <li>Évaluation des acquis et compétences</li>
              <li>Volet EDD : changements d'attitude et prolongements</li>
              <li>Aspects logistiques, note globale ⭐ et recommandation</li>
            </ul>
            <Link to={createPageUrl('BilanPedagogique')}>
              <button className="mt-2 w-full py-2 rounded-xl bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 text-sm font-bold hover:bg-yellow-500/30 transition-all">
                📋 Accéder au Bilan →
              </button>
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {[
            { emoji: '🏫', label: 'Nom de l\'école', sub: 'Enseignant, classe, niveau' },
            { emoji: '🎯', label: 'Objectifs EDD', sub: 'Cochez les objectifs visés' },
            { emoji: '⭐', label: 'Note & Recommandation', sub: 'Évaluation sur 5 étoiles' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-center">
              <div className="text-xl mb-1">{item.emoji}</div>
              <div className="text-amber-300 text-xs font-bold mb-0.5">{item.label}</div>
              <div className="text-amber-200/50 text-xs">{item.sub}</div>
            </div>
          ))}
        </div>
        {/* Système code bilan */}
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/30 mb-4">
          <h3 className="text-teal-300 font-bold text-sm mb-3">🔑 Comment accéder à votre dossier de bilan ?</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-teal-400/20 text-center">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-teal-300 font-bold text-xs mb-1">1. Faites votre demande de RDV</div>
              <div className="text-white/50 text-xs">Remplissez le formulaire dans <strong className="text-white">📅 RDV</strong> depuis la navigation.</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-teal-400/20 text-center">
              <div className="text-2xl mb-2">📧</div>
              <div className="text-teal-300 font-bold text-xs mb-1">2. Recevez votre code personnel</div>
              <div className="text-white/50 text-xs">Un email de confirmation vous envoie un code confidentiel unique, ex : <span className="font-mono text-yellow-300">TN-A3F7-K9QP</span></div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-teal-400/20 text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-teal-300 font-bold text-xs mb-1">3. Ouvrez votre dossier</div>
              <div className="text-white/50 text-xs">Rendez-vous dans <strong className="text-white">📋 Bilan</strong>, saisissez votre code pour accéder à votre dossier privé.</div>
            </div>
          </div>
        </div>

        {/* Mockup code gate */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 mb-4">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">🔒 Page Bilan — Accès sécurisé</div>
          </div>
          <div className="max-w-xs mx-auto p-4 rounded-2xl bg-white/5 border border-teal-400/20 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-white font-bold text-sm mb-1">Saisissez votre code</div>
            <div className="text-white/40 text-xs mb-3">Reçu dans votre email de confirmation</div>
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 font-mono text-yellow-300 text-center text-sm tracking-widest mb-3">TN-A3F7-K9QP</div>
            <div className="py-2 rounded-xl bg-teal-500/30 border border-teal-400/30 text-teal-200 text-xs font-bold">🔑 Accéder au dossier →</div>
          </div>
          <p className="text-white/40 text-xs text-center mt-3">Le dossier est strictement privé — seul vous possédez ce code.</p>
        </div>

        {/* Rouvrir son dossier */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 mb-4">
          <h3 className="text-amber-300 font-bold text-sm mb-2">🔄 Rouvrir votre dossier plus tard</h3>
          <div className="flex items-start gap-3 text-sm text-amber-200/70">
            <div className="text-amber-400 font-bold flex-shrink-0 mt-0.5">→</div>
            <div>Votre code est <strong className="text-white">permanent</strong> : conservez l'email de confirmation. À tout moment, retournez sur <strong className="text-white">📋 Bilan</strong> et ressaisissez votre code pour retrouver, modifier ou compléter votre dossier.</div>
          </div>
          <div className="flex items-start gap-3 text-sm text-amber-200/70 mt-2">
            <div className="text-amber-400 font-bold flex-shrink-0 mt-0.5">→</div>
            <div>Vous pouvez <strong className="text-white">sauvegarder en brouillon</strong> et revenir plus tard pour finaliser avant de soumettre.</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200/80 text-xs text-center font-semibold">
          🌿 Votre dossier est privé et lié à votre RDV — non visible par les élèves ni le public.
        </div>
      </div>
    ),
  },

  // ── SLIDE 11 : Bio-Focus ──
  {
    id: 'biofocus',
    bg: 'from-slate-950 via-green-950 to-emerald-950',
    content: (
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-3xl">🔬</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Bio-Focus</h2>
            <p className="text-emerald-400/60 text-sm">Les Enquêteurs de l'Humus — Jeu de terrain collaboratif</p>
          </div>
        </div>

        {/* Présentation */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 mb-4">
          <p className="text-amber-200/80 text-sm leading-relaxed">
            <strong className="text-amber-300">Bio-Focus</strong> est un jeu ludo-éducatif de terrain dans lequel deux équipes s'affrontent pour photographier et identifier les organismes décomposeurs du sol (macrofaune, mésofaune, champignons). L'équipe qui construit l'écosystème le plus riche et équilibré gagne !
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Côté enseignant */}
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/20">
            <h3 className="font-bold text-sky-300 mb-3">👩‍🏫 Pour l'enseignant</h3>
            <ol className="space-y-2 text-sky-200/70 text-sm">
              <li className="flex gap-2"><span className="text-sky-400 font-bold flex-shrink-0">1.</span><span>Se rendre dans <strong className="text-white">🔬 Bio-Focus</strong> depuis la navigation.</span></li>
              <li className="flex gap-2"><span className="text-sky-400 font-bold flex-shrink-0">2.</span><span>Créer une session : saisir le <strong className="text-white">nom de la classe</strong> et le <strong className="text-white">degré scolaire</strong> librement (tout barème accepté — public, privé, suisse, français, international…).</span></li>
              <li className="flex gap-2"><span className="text-sky-400 font-bold flex-shrink-0">3.</span><span>Deux <strong className="text-white">codes uniques</strong> sont générés : un pour les <span className="text-blue-300">🦔 Fouisseurs</span>, un pour les <span className="text-purple-300">🍄 Mycorhizes</span>.</span></li>
              <li className="flex gap-2"><span className="text-sky-400 font-bold flex-shrink-0">4.</span><span>Distribuer les codes selon sa propre répartition pédagogique des élèves.</span></li>
              <li className="flex gap-2"><span className="text-sky-400 font-bold flex-shrink-0">5.</span><span>En fin de séance, <strong className="text-white">clôturer la session</strong> pour calculer les scores et distribuer les récompenses.</span></li>
            </ol>
          </div>

          {/* Côté élèves */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20">
            <h3 className="font-bold text-emerald-300 mb-3">🎒 Pour les élèves</h3>
            <ol className="space-y-2 text-emerald-200/70 text-sm">
              <li className="flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">1.</span><span>Entrer le code équipe reçu de l'enseignant pour <strong className="text-white">rejoindre sa team</strong>.</span></li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">2.</span><span>Sur le terrain : chercher les organismes dans litières, souches, compost.</span></li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">3.</span><span>Photographier avec l'appareil disponible (voir ci-dessous) <strong className="text-white">sans perturber</strong> le milieu.</span></li>
              <li className="flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">4.</span><span><strong className="text-white">Uploader la photo en temps réel</strong> directement dans l'app — le score de l'équipe se met à jour instantanément pour tous les membres.</span></li>
            </ol>
          </div>
        </div>

        {/* Appareils */}
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-400/20 mb-4">
          <h3 className="font-bold text-teal-300 mb-3">📷 Appareils compatibles pour la capture</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '🔬', name: 'Kideo ×1000', desc: 'Grossissement ×1000 — idéal pour collemboles, pseudoscorpions et mycélium invisible à l\'œil nu.' },
              { emoji: '📱', name: 'Smartphone', desc: 'Mode macro ou caméra standard — parfait pour lombrics, cloportes, carabes, champignons.' },
              { emoji: '📟', name: 'Tablette', desc: 'Grand écran facilitant la prise de vue et l\'identification des espèces sur place.' },
            ].map((a, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-teal-400/20 text-center">
                <div className="text-3xl mb-1">{a.emoji}</div>
                <div className="font-bold text-teal-300 text-xs mb-1">{a.name}</div>
                <p className="text-white/50 text-xs">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bonus */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20 text-center">
            <div className="font-bold text-purple-300 text-xs mb-1">⭐ Défi Expert</div>
            <div className="text-xs text-white/50">Pseudoscorpion ou Collembole : +30 pts</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-center">
            <div className="font-bold text-blue-300 text-xs mb-1">🔗 Chaîne trophique</div>
            <div className="text-xs text-white/50">Prédateur + proie : +50 pts</div>
          </div>
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-400/20 text-center">
            <div className="font-bold text-green-300 text-xs mb-1">🌿 Biodiversité</div>
            <div className="text-xs text-white/50">3 groupes couverts : +100 pts</div>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-green-500/10 border border-green-400/20 text-green-200 text-center text-xs font-semibold">
          🌿 Règle d'or : Zéro perturbation — photos in situ uniquement. Ne blessez ni ne déplacez aucun animal.
        </div>
      </div>
    ),
  },

  // ── SLIDE 12 : Commencer ──
  {
    id: 'start',
    bg: 'from-emerald-950 via-teal-950 to-cyan-950',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
        <div className="text-7xl mb-6">🚀</div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Prêt à commencer ?</h2>
        <p className="text-emerald-200/70 text-lg mb-10 max-w-2xl">
          Rejoins des milliers d'Éco-Sentinelles qui explorent et protègent la planète avec Terra Nova Chronicles.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-10 w-full max-w-2xl">
          {[
            { emoji: '1️⃣', title: 'Connecte-toi', desc: 'Crée ton compte ou connecte-toi avec les identifiants fournis par ton enseignant.' },
            { emoji: '2️⃣', title: 'Explore', desc: 'Commence par l\'Atlas pour découvrir les biomes, puis plonge dans les activités.' },
            { emoji: '3️⃣', title: 'Progresse', desc: 'Accumule des XP, débloque des badges et monte en niveau d\'Éco-Sentinelle !' },
          ].map((step, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-emerald-400/20 text-center">
              <div className="text-3xl mb-3">{step.emoji}</div>
              <h3 className="text-emerald-300 font-bold mb-2">{step.title}</h3>
              <p className="text-emerald-200/60 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
        <Link to={createPageUrl('Home')}>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-emerald-500/30">
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    ),
  },
];

export default function GuidePage() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(SLIDES.length - 1, c + 1));

  const slide = SLIDES[current];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
      <BiolumiHeader currentPage="Guide" />

      <main className="pt-16 h-screen flex flex-col">
        {/* Slide */}
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="min-h-full"
            >
              {slide.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barre de navigation */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-t border-white/10">
          {/* Prev */}
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Précédent</span>
          </button>

          {/* Indicateurs */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            disabled={current === SLIDES.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
          >
            <span className="hidden sm:inline text-sm">Suivant</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}