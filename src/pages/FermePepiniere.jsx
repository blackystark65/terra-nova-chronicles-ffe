import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FermePepiniere() {
  const [workStation, setWorkStation] = useState([]); // cartes empilées sur la table
  const [completedPots, setCompletedPots] = useState([]); // pots dans la serre
  const [feedback, setFeedback] = useState(null);

  const { data: graines = [] } = useQuery({
    queryKey: ['graines'],
    queryFn: () => base44.entities.Graine.list(),
  });

  const handleCardClick = (type, data = null) => {
    // Si on clique sur pot et qu'il n'y a rien
    if (type === 'pot' && workStation.length === 0) {
      setWorkStation([{ type: 'pot', emoji: '🪴', name: 'Pot' }]);
      setFeedback({ type: 'success', message: '✅ Pot ajouté !' });
      setTimeout(() => setFeedback(null), 1500);
    }
    // Si on clique sur bois et qu'il y a 1 carte
    else if (type === 'bois' && workStation.length === 1) {
      setWorkStation([...workStation, { type: 'bois', emoji: '🪵', name: 'Bois broyé' }]);
      setFeedback({ type: 'success', message: '✅ Bois broyé ajouté !' });
      setTimeout(() => setFeedback(null), 1500);
    }
    // Si on clique sur compost et qu'il y a 2 cartes
    else if (type === 'compost' && workStation.length === 2) {
      setWorkStation([...workStation, { type: 'compost', emoji: '♻️', name: 'Compost' }]);
      setFeedback({ type: 'success', message: '✅ Compost ajouté !' });
      setTimeout(() => setFeedback(null), 1500);
    }
    // Si on clique sur une graine et qu'il y a 3 cartes
    else if (type === 'graine' && workStation.length === 3 && data && !completedPots.some(p => p.graine.id === data.id)) {
      setWorkStation([...workStation, { type: 'graine', emoji: data.emoji, name: data.nom, graineData: data }]);
      setFeedback({ type: 'success', message: `✅ ${data.nom} ajouté !` });
      setTimeout(() => setFeedback(null), 1500);
    }
    else {
      setFeedback({ type: 'error', message: '❌ Respecte l\'ordre : Pot → Bois → Compost → Graine' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handlePlaceInSerre = () => {
    if (workStation.length !== 4) return;
    
    const newPot = {
      id: Date.now(),
      slotIndex: completedPots.length,
      layers: workStation,
      graine: workStation[3].graineData
    };
    setCompletedPots([...completedPots, newPot]);
    setWorkStation([]);
    setFeedback({ type: 'success', message: `🌱 Semis rangé dans la serre !` });
    setTimeout(() => setFeedback(null), 2000);
  };

  const availableGraines = graines.filter(g => !completedPots.some(p => p.graine.id === g.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950">
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <Link to={createPageUrl('MicroFerme')}>
            <Button variant="outline" className="mb-6 border-cyan-400 text-cyan-300">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour à la Ferme
            </Button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-cyan-300 mb-2">
              🌱 Pépinière / Serre - Horticulteur
            </h1>
            <p className="text-cyan-200/70">
              Clique sur les cartes pour créer ton pot, puis place-le dans la serre
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Paquets de cartes */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {/* Paquet Pot */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick('pot')}
                className="cursor-pointer"
              >
                <div className="w-full aspect-[2/3] rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 border-4 border-white/30 shadow-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <span className="text-6xl mb-2">🪴</span>
                  <div className="text-white font-bold text-center text-sm">Pot</div>
                  <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-lg text-white text-xs font-bold">
                    79
                  </div>
                </div>
              </motion.div>

              {/* Paquet Bois */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick('bois')}
                className="cursor-pointer"
              >
                <div className="w-full aspect-[2/3] rounded-2xl bg-gradient-to-br from-orange-800 to-amber-900 border-4 border-white/30 shadow-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <span className="text-6xl mb-2">🪵</span>
                  <div className="text-white font-bold text-center text-sm">Bois broyé</div>
                  <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-lg text-white text-xs font-bold">
                    79
                  </div>
                </div>
              </motion.div>

              {/* Paquet Compost */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick('compost')}
                className="cursor-pointer"
              >
                <div className="w-full aspect-[2/3] rounded-2xl bg-gradient-to-br from-green-700 to-emerald-800 border-4 border-white/30 shadow-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <span className="text-6xl mb-2">♻️</span>
                  <div className="text-white font-bold text-center text-sm">Compost</div>
                  <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-lg text-white text-xs font-bold">
                    79
                  </div>
                </div>
              </motion.div>

              {/* Paquet Graines */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer relative"
              >
                <div className="w-full aspect-[2/3] rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 border-4 border-white/30 shadow-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <span className="text-6xl mb-2">🌾</span>
                  <div className="text-white font-bold text-center text-sm">Graines</div>
                  <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-lg text-white text-xs font-bold">
                    {availableGraines.length}
                  </div>
                </div>
                {/* Liste déroulante des graines */}
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl rounded-xl border-2 border-cyan-400/50 p-3 max-h-[300px] overflow-y-auto z-10 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="space-y-2">
                    {availableGraines.map((graine) => (
                      <motion.div
                        key={graine.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleCardClick('graine', graine)}
                        className="bg-cyan-500/20 rounded-lg p-2 flex items-center gap-2 cursor-pointer hover:bg-cyan-500/30"
                      >
                        <span className="text-2xl">{graine.emoji || '🌱'}</span>
                        <span className="text-white text-xs">{graine.nom}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Table de rempotage */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-300 text-center">🛠️ Table</h2>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-400/30 min-h-[400px] flex flex-col items-center justify-center">
                {workStation.length === 0 ? (
                  <div className="text-center text-cyan-400/50">
                    Clique sur le pot pour commencer
                  </div>
                ) : (
                  <div className="relative">
                    {/* Empilement des cartes */}
                    <div className="relative w-48 h-72">
                      {workStation.map((layer, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: -100, opacity: 0 }}
                          animate={{ y: i * 15, opacity: 1 }}
                          className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border-4 border-white/30 shadow-2xl flex flex-col items-center justify-center"
                          style={{ zIndex: i }}
                        >
                          <span className="text-5xl">{layer.emoji}</span>
                          <div className="text-white font-bold text-sm mt-2">{layer.name}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {workStation.length === 4 && (
                  <Button
                    onClick={handlePlaceInSerre}
                    className="mt-8 bg-green-600 hover:bg-green-700 text-white"
                  >
                    ✅ Placer dans la serre
                  </Button>
                )}
              </div>
            </div>

            {/* Serre */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-cyan-300">
                🏡 Serre ({completedPots.length}/{graines.length})
              </h2>
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-cyan-400/30 max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: graines.length }).map((_, index) => {
                    const pot = completedPots.find(p => p.slotIndex === index);
                    return (
                      <div
                        key={index}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                          pot 
                            ? 'bg-green-500/20 border-green-400/50'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        {pot ? (
                          <div className="text-center">
                            <div className="text-2xl">{pot.graine.emoji || '🌱'}</div>
                            <div className="text-[8px] text-white mt-1 line-clamp-1">{pot.graine.nom}</div>
                          </div>
                        ) : (
                          <div className="text-white/20 text-xs">{index + 1}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`px-6 py-3 rounded-xl shadow-2xl border-2 text-white font-bold ${
              feedback.type === 'success' ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300'
            }`}>
              {feedback.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}