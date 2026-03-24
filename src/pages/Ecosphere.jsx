import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ChevronLeft, ChevronRight, BookOpen, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CHAPTERS = [
  { id: 'climat',              name: 'Climat',                         emoji: '🌡️', color: 'from-sky-500 to-blue-700' },
  { id: 'eau',                 name: 'Eau',                            emoji: '💧', color: 'from-cyan-500 to-teal-700' },
  { id: 'permaculture',        name: 'Permaculture',                   emoji: '🌿', color: 'from-lime-500 to-green-700' },
  { id: 'agroecologie',        name: 'Agroécologie',                   emoji: '🌾', color: 'from-amber-500 to-yellow-700' },
  { id: 'agroforesterie',      name: 'Agroforesterie',                 emoji: '🌳', color: 'from-emerald-500 to-green-800' },
  { id: 'biodiversite_animale',name: 'Biodiversité — Espèces animales',emoji: '🦋', color: 'from-orange-500 to-amber-700' },
  { id: 'biodiversite_vegetale',name:'Biodiversité — Espèces végétales',emoji:'🌺', color: 'from-pink-500 to-rose-700' },
  { id: 'energie_renouvelable',name: 'Énergie renouvelable',           emoji: '☀️', color: 'from-yellow-400 to-orange-600' },
  { id: 'techniques_cultures', name: 'Techniques de cultures écologiques', emoji: '🪴', color: 'from-green-500 to-teal-700' },
  { id: 'sol_compostage',      name: 'Sol & Compostage',               emoji: '🪱', color: 'from-amber-700 to-stone-800' },
  { id: 'semences_graines',    name: 'Semences & Graines',             emoji: '🌱', color: 'from-lime-600 to-emerald-800' },
];

export default function EcospherePage() {
  const [activeChapter, setActiveChapter] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const { data: allSlides = [] } = useQuery({
    queryKey: ['ecosphere-slides'],
    queryFn: () => base44.entities.EcosphereSlide.list('order', 200),
  });

  const chapterData = activeChapter
    ? allSlides
        .filter(s => s.chapter === activeChapter)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    : [];

  const chapter = CHAPTERS.find(c => c.id === activeChapter);

  const openChapter = (id) => {
    setActiveChapter(id);
    setSlideIndex(0);
  };

  const closeChapter = () => {
    setActiveChapter(null);
    setSlideIndex(0);
  };

  const prev = () => setSlideIndex(i => Math.max(0, i - 1));
  const next = () => setSlideIndex(i => Math.min(chapterData.length - 1, i + 1));

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600)' }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/85 via-teal-950/80 to-slate-950/85" />

      <BiolumiHeader currentPage="Ecosphere" />

      <main className="relative z-10 pt-24 px-4 pb-16">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 mb-5">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Livre de l'Écosphère</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              L'Écosphère
            </h1>
            <p className="text-emerald-300/70 text-lg max-w-2xl mx-auto">
              Un livre illustré de planches dessinées sur l'agroécologie, la biodiversité et les techniques de vie durable.
            </p>
          </motion.div>

          {/* Grille des chapitres */}
          <AnimatePresence>
            {!activeChapter && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {CHAPTERS.map((ch, i) => {
                  const count = allSlides.filter(s => s.chapter === ch.id).length;
                  return (
                    <motion.div
                      key={ch.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openChapter(ch.id)}
                      className={`cursor-pointer rounded-2xl bg-gradient-to-br ${ch.color} p-5 border border-white/20 shadow-xl text-center relative overflow-hidden`}
                    >
                      <div className="text-4xl mb-2">{ch.emoji}</div>
                      <div className="text-white font-bold text-sm leading-tight">{ch.name}</div>
                      <div className="text-white/60 text-xs mt-1">{count} planche{count !== 1 ? 's' : ''}</div>
                      {count === 0 && (
                        <div className="absolute top-2 right-2 text-[10px] bg-black/30 rounded px-1 text-white/50">À venir</div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lecteur de chapitre */}
          <AnimatePresence>
            {activeChapter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                {/* Barre de navigation chapitre */}
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={closeChapter}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Sommaire</span>
                  </button>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${chapter.color} border border-white/20`}>
                    <span className="text-xl">{chapter.emoji}</span>
                    <span className="text-white font-bold">{chapter.name}</span>
                  </div>
                  <div className="ml-auto text-white/50 text-sm">
                    {chapterData.length > 0 ? `${slideIndex + 1} / ${chapterData.length}` : ''}
                  </div>
                </div>

                {chapterData.length === 0 ? (
                  <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10">
                    <div className="text-6xl mb-4">{chapter.emoji}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Chapitre en préparation</h3>
                    <p className="text-white/50">Les planches de ce chapitre seront ajoutées prochainement.</p>
                    <Link to="/AdminEcosphere" className="inline-block mt-6">
                      <Button className="bg-emerald-600 hover:bg-emerald-500">Ajouter des planches →</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Slide principale */}
                    <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl mb-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={slideIndex}
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={chapterData[slideIndex].image_url}
                            alt={chapterData[slideIndex].title || `Planche ${slideIndex + 1}`}
                            className="w-full object-contain max-h-[65vh]"
                          />
                          {(chapterData[slideIndex].title || chapterData[slideIndex].description) && (
                            <div className="p-4 border-t border-white/10">
                              {chapterData[slideIndex].title && (
                                <h3 className="text-white font-bold text-lg">{chapterData[slideIndex].title}</h3>
                              )}
                              {chapterData[slideIndex].description && (
                                <p className="text-white/60 text-sm mt-1">{chapterData[slideIndex].description}</p>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Navigation flèches */}
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={prev}
                        disabled={slideIndex === 0}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white border border-white/20 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Précédent
                      </button>

                      {/* Miniatures */}
                      <div className="flex gap-1.5 overflow-x-auto py-1">
                        {chapterData.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSlideIndex(idx)}
                            className={`flex-shrink-0 w-2.5 h-2.5 rounded-full transition-all ${
                              idx === slideIndex ? 'bg-emerald-400 scale-125' : 'bg-white/30 hover:bg-white/50'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={next}
                        disabled={slideIndex === chapterData.length - 1}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white border border-white/20 transition-all"
                      >
                        Suivant
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}