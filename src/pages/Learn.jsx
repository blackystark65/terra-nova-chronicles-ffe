import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, ChevronLeft, ArrowLeft, 
  Leaf, TreeDeciduous, Bug, Droplets, Flower2,
  BookOpen, Sparkles
} from 'lucide-react';

const topics = [
  {
    id: 'permaculture',
    title: 'La Permaculture 🌱',
    icon: Leaf,
    color: 'from-emerald-400 to-green-500',
    content: [
      {
        title: "Qu'est-ce que la permaculture ?",
        text: "La permaculture, c'est l'art de cultiver en imitant la nature ! Imagine un jardin où chaque plante aide les autres : les haricots donnent de l'azote au sol, les tournesols attirent les abeilles, et les courges couvrent le sol pour garder l'humidité.",
        emoji: "🌿",
      },
      {
        title: "Les Trois Sœurs",
        text: "Les Amérindiens cultivaient ensemble le maïs, le haricot et la courge. Le maïs sert de tuteur au haricot qui grimpe, le haricot enrichit le sol en azote, et la courge avec ses grandes feuilles garde le sol humide et empêche les mauvaises herbes de pousser !",
        emoji: "👩‍👩‍👧",
      },
      {
        title: "Pas de produits chimiques",
        text: "En permaculture, on n'utilise pas de pesticides ni d'engrais chimiques. On préfère les solutions naturelles : les coccinelles mangent les pucerons, le compost nourrit le sol, et les plantes aromatiques repoussent les insectes nuisibles.",
        emoji: "🚫",
      },
    ],
  },
  {
    id: 'agroforestry',
    title: 'L\'Agroforesterie 🌳',
    icon: TreeDeciduous,
    color: 'from-teal-400 to-cyan-500',
    content: [
      {
        title: "Des arbres au milieu des cultures",
        text: "L'agroforesterie, c'est planter des arbres au milieu des champs et des jardins. Les arbres donnent de l'ombre aux cultures sensibles au soleil, protègent du vent, et leurs feuilles mortes nourrissent le sol !",
        emoji: "🌲",
      },
      {
        title: "Un refuge pour les animaux",
        text: "Les arbres et les haies offrent un abri aux oiseaux, aux hérissons et aux insectes utiles. Ces animaux aident ensuite le jardin en mangeant les parasites et en pollinisant les fleurs.",
        emoji: "🐦",
      },
      {
        title: "Des fruits toute l'année",
        text: "En plantant différents arbres fruitiers, tu peux avoir des fruits de saison toute l'année : des cerises au printemps, des pommes en automne, et des noix en hiver !",
        emoji: "🍎",
      },
    ],
  },
  {
    id: 'biodiversity',
    title: 'La Biodiversité 🦋',
    icon: Bug,
    color: 'from-amber-400 to-orange-500',
    content: [
      {
        title: "Un jardin plein de vie",
        text: "La biodiversité, c'est la variété de toutes les formes de vie : plantes, animaux, insectes, champignons... Plus il y a de variété dans ton jardin, plus il est en bonne santé !",
        emoji: "🌈",
      },
      {
        title: "Les super-héros du jardin",
        text: "Les abeilles pollinisent les fleurs pour qu'elles donnent des fruits. Les vers de terre aèrent le sol. Les coccinelles mangent les pucerons. Chaque animal a un rôle important !",
        emoji: "🦸",
      },
      {
        title: "Comment attirer la biodiversité",
        text: "Plante des fleurs de différentes couleurs, laisse un coin de jardin sauvage, installe un petit point d'eau, et évite les pesticides. Tu verras bientôt plein de petits visiteurs !",
        emoji: "🌸",
      },
    ],
  },
  {
    id: 'ecology',
    title: 'L\'Écologie 🌍',
    icon: Droplets,
    color: 'from-blue-400 to-indigo-500',
    content: [
      {
        title: "Prendre soin de la Terre",
        text: "L'écologie, c'est comprendre comment tous les êtres vivants sont connectés et dépendent les uns des autres. Si on abîme une partie de la nature, tout l'ensemble en souffre.",
        emoji: "🌏",
      },
      {
        title: "L'eau, c'est la vie",
        text: "L'eau est précieuse ! En permaculture, on apprend à récupérer l'eau de pluie, à pailler le sol pour garder l'humidité, et à planter des arbres qui attirent la pluie.",
        emoji: "💧",
      },
      {
        title: "Le sol, un trésor vivant",
        text: "Sous tes pieds, le sol est plein de vie : des millions de micro-organismes, de champignons et de vers de terre travaillent ensemble pour nourrir les plantes. Prends-en soin !",
        emoji: "🪱",
      },
    ],
  },
];

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const topic = topics.find(t => t.id === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-5 h-5" />
              Retour
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <h1 className="text-xl font-bold text-slate-800">Apprendre</h1>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedTopic ? (
              /* Liste des sujets */
              <motion.div
                key="topics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl mb-4"
                  >
                    📚
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                    Qu'est-ce que tu veux apprendre ?
                  </h2>
                  <p className="text-lg text-slate-600">
                    Choisis un sujet pour découvrir les secrets de la nature !
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {topics.map((topic, index) => (
                    <motion.button
                      key={topic.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setSelectedTopic(topic.id);
                        setCurrentSlide(0);
                      }}
                      className={`
                        relative overflow-hidden p-8 rounded-3xl text-left
                        bg-white/60 backdrop-blur-xl border border-white/50
                        shadow-xl hover:shadow-2xl
                        transition-all duration-300
                        group
                      `}
                    >
                      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br ${topic.color} opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-500`} />
                      
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${topic.color} mb-4`}>
                        <topic.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:translate-x-2 transition-transform">
                        {topic.title}
                      </h3>
                      <p className="text-slate-600">
                        {topic.content.length} leçons à découvrir
                      </p>

                      <ChevronRight className="absolute bottom-8 right-8 w-6 h-6 text-slate-400 group-hover:translate-x-2 group-hover:text-slate-600 transition-all" />
                    </motion.button>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-12"
                >
                  <Link to={createPageUrl('Game')}>
                    <Button
                      size="lg"
                      className="gap-3 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl"
                    >
                      <Sparkles className="w-5 h-5" />
                      Mettre en pratique dans le jeu
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              /* Contenu du sujet */
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="max-w-3xl mx-auto"
              >
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="flex items-center gap-2 mb-8 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Retour aux sujets
                </button>

                {/* Header du sujet */}
                <div className={`p-8 rounded-3xl bg-gradient-to-r ${topic?.color} text-white mb-8`}>
                  <div className="flex items-center gap-4 mb-4">
                    {topic && <topic.icon className="w-10 h-10" />}
                    <h2 className="text-3xl font-bold">{topic?.title}</h2>
                  </div>
                  <p className="text-white/90">
                    Leçon {currentSlide + 1} sur {topic?.content.length}
                  </p>
                </div>

                {/* Slide actuel */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl"
                  >
                    <div className="text-center mb-6">
                      <motion.span
                        className="text-7xl inline-block"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {topic?.content[currentSlide].emoji}
                      </motion.span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                      {topic?.content[currentSlide].title}
                    </h3>

                    <p className="text-lg text-slate-600 leading-relaxed text-center">
                      {topic?.content[currentSlide].text}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSlide(prev => prev - 1)}
                    disabled={currentSlide === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Précédent
                  </Button>

                  {/* Indicateurs */}
                  <div className="flex gap-2">
                    {topic?.content.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentSlide
                            ? `bg-gradient-to-r ${topic?.color} w-8`
                            : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  {currentSlide < (topic?.content.length || 0) - 1 ? (
                    <Button
                      onClick={() => setCurrentSlide(prev => prev + 1)}
                      className={`gap-2 bg-gradient-to-r ${topic?.color} text-white border-0`}
                    >
                      Suivant
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Link to={createPageUrl('Game')}>
                      <Button
                        className={`gap-2 bg-gradient-to-r ${topic?.color} text-white border-0`}
                      >
                        Jouer !
                        <Sparkles className="w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}