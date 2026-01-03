import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X, Sparkles, Leaf, TreeDeciduous, Bug } from 'lucide-react';

const tutorialSteps = [
  {
    title: "Bienvenue, Gardien de la Terre ! 🌍",
    content: "Tu vas apprendre à créer un jardin magique en utilisant les secrets de la nature. Prêt pour l'aventure ?",
    icon: "🌱",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    title: "La Permaculture",
    content: "C'est l'art de cultiver en imitant la nature ! Au lieu de lutter contre elle, on travaille AVEC elle. Les plantes s'aident entre elles !",
    icon: "🌸",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    title: "L'Agroforesterie",
    content: "Imagine un jardin avec des arbres au milieu des légumes ! Les arbres donnent de l'ombre, protègent du vent et attirent les oiseaux.",
    icon: "🌳",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "Les Trois Sœurs",
    content: "Le maïs, le haricot et la courge sont les meilleures amies ! Le maïs sert de tuteur, le haricot enrichit le sol, et la courge le protège.",
    icon: "👩‍👩‍👧",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "Attire la biodiversité !",
    content: "Plus tu plantes intelligemment, plus tu attires d'animaux utiles : abeilles, papillons, coccinelles... Ils aident ton jardin à prospérer !",
    icon: "🦋",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    title: "À toi de jouer !",
    content: "Glisse les plantes sur la grille pour créer ton écosystème. Découvre les synergies et gagne des points biodiversité ! 🌟",
    icon: "🎮",
    gradient: "from-blue-400 to-indigo-500",
  },
];

export default function TutorialModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header avec gradient */}
          <div className={`bg-gradient-to-r ${step.gradient} p-8 text-white`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              key={currentStep}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-7xl text-center mb-4"
            >
              {step.icon}
            </motion.div>

            <motion.h2
              key={`title-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-center"
            >
              {step.title}
            </motion.h2>
          </div>

          {/* Contenu */}
          <div className="p-8">
            <motion.p
              key={`content-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-600 text-center text-lg leading-relaxed"
            >
              {step.content}
            </motion.p>

            {/* Indicateurs de progression */}
            <div className="flex justify-center gap-2 mt-6">
              {tutorialSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'w-8 bg-gradient-to-r ' + step.gradient 
                      : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Boutons de navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isFirstStep}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </Button>

              {isLastStep ? (
                <Button
                  onClick={onClose}
                  className={`gap-2 bg-gradient-to-r ${step.gradient} text-white border-0 hover:opacity-90`}
                >
                  <Sparkles className="w-4 h-4" />
                  Commencer !
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className={`gap-2 bg-gradient-to-r ${step.gradient} text-white border-0 hover:opacity-90`}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}