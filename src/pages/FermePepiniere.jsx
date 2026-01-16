import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Sprout, Package, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FermePepiniere() {
  const [workStation, setWorkStation] = useState(null); // pot en cours de préparation
  const [completedPots, setCompletedPots] = useState([]); // pots terminés dans la serre
  const [selectedCard, setSelectedCard] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { data: graines = [] } = useQuery({
    queryKey: ['graines'],
    queryFn: () => base44.entities.Graine.list(),
  });

  // Cartes de base (toujours disponibles)
  const baseCards = [
    { id: 'pot', type: 'pot', name: 'Pot de rempotage', emoji: '🪴', order: 1 },
    { id: 'bois', type: 'bois', name: 'Bois broyé', emoji: '🪵', order: 2 },
    { id: 'compost', type: 'compost', name: 'Compost', emoji: '♻️', order: 3 },
  ];

  // Initialiser la station de travail
  useEffect(() => {
    if (!workStation) {
      setWorkStation({ layers: [] });
    }
  }, []);

  const handleCardClick = (card) => {
    if (!workStation) return;

    // Si c'est une graine et qu'on n'a pas encore les 3 couches de base
    if (card.type === 'graine' && workStation.layers.length < 3) {
      setFeedback({ type: 'error', message: '❌ Il faut d\'abord préparer le pot avec bois broyé et compost !' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    // Si c'est une carte de base
    if (card.type !== 'graine') {
      const expectedOrder = workStation.layers.length + 1;
      if (card.order !== expectedOrder) {
        setFeedback({ type: 'error', message: `❌ Mauvais ordre ! Place d'abord: ${baseCards.find(c => c.order === expectedOrder)?.name}` });
        setTimeout(() => setFeedback(null), 2000);
        return;
      }
      
      setWorkStation({
        ...workStation,
        layers: [...workStation.layers, card]
      });
      setFeedback({ type: 'success', message: `✅ ${card.name} ajouté !` });
      setTimeout(() => setFeedback(null), 1500);
    } 
    // Si c'est une graine et que les 3 couches sont prêtes
    else if (workStation.layers.length === 3) {
      const newPot = {
        id: Date.now(),
        graine: card,
        layers: workStation.layers,
      };
      setCompletedPots([...completedPots, newPot]);
      setWorkStation({ layers: [] }); // Réinitialiser
      setFeedback({ type: 'success', message: `🌱 Semis de ${card.nom} prêt pour la serre !` });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleReset = () => {
    setWorkStation({ layers: [] });
  };

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
            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4">
              <Sprout className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-cyan-300 mb-2">
              🌱 Pépinière / Serre - Horticulteur
            </h1>
            <p className="text-cyan-200/70 text-lg">
              Prépare tes semis en empilant les cartes dans le bon ordre : Pot → Bois broyé → Compost → Graine
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cartes de base */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Matériel de base
              </h2>
              <div className="space-y-3">
                {baseCards.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCardClick(card)}
                    className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-cyan-400/30 cursor-pointer hover:bg-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{card.emoji}</span>
                      <div>
                        <div className="text-white font-semibold">{card.name}</div>
                        <div className="text-cyan-300/70 text-xs">Étape {card.order}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Station de travail */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-cyan-400/30">
                <h3 className="text-lg font-bold text-cyan-300 mb-3">📦 Pot en préparation</h3>
                {workStation && workStation.layers.length === 0 ? (
                  <div className="text-center py-8 text-cyan-400/50 text-sm">
                    Commence par le pot de rempotage
                  </div>
                ) : (
                  <div className="space-y-2">
                    {workStation?.layers.map((layer, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-cyan-500/20 rounded-lg p-3 border border-cyan-400/30"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{layer.emoji}</span>
                          <span className="text-white text-sm">{layer.name}</span>
                        </div>
                      </motion.div>
                    ))}
                    {workStation?.layers.length === 3 && (
                      <div className="text-center text-green-300 text-sm font-semibold mt-2">
                        ✅ Prêt ! Choisis une graine →
                      </div>
                    )}
                  </div>
                )}
                {workStation?.layers.length > 0 && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full mt-3 border-red-400 text-red-300 hover:bg-red-500/20"
                    size="sm"
                  >
                    🔄 Recommencer
                  </Button>
                )}
              </div>
            </div>

            {/* Graines disponibles */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-cyan-300">
                🌾 Graines à semer ({graines.length} variétés)
              </h2>
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-cyan-400/30 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {graines.map((graine) => {
                    const alreadySown = completedPots.some(pot => pot.graine.id === graine.id);
                    return (
                      <motion.div
                        key={graine.id}
                        whileHover={{ scale: alreadySown ? 1 : 1.05 }}
                        whileTap={{ scale: alreadySown ? 1 : 0.95 }}
                        onClick={() => !alreadySown && handleCardClick({ ...graine, type: 'graine' })}
                        className={`rounded-xl p-3 border transition-all ${
                          alreadySown
                            ? 'bg-green-500/20 border-green-400/50 opacity-50 cursor-not-allowed'
                            : 'bg-white/10 border-cyan-400/30 cursor-pointer hover:bg-white/20'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-1">{graine.emoji || '🌱'}</div>
                          <div className="text-white text-xs font-semibold">{graine.nom}</div>
                          {alreadySown && (
                            <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Serre avec emplacements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
              🏡 Serre - Plateaux de semis ({completedPots.length}/{graines.length})
            </h2>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-cyan-400/30">
              {completedPots.length === 0 ? (
                <div className="text-center py-12 text-cyan-400/50">
                  La serre est vide. Prépare tes premiers semis !
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {completedPots.map((pot) => (
                    <motion.div
                      key={pot.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="aspect-square bg-green-500/20 rounded-lg border-2 border-green-400/40 p-2 flex flex-col items-center justify-center"
                    >
                      <span className="text-2xl">{pot.graine.emoji || '🌱'}</span>
                      <span className="text-[8px] text-white text-center mt-1 line-clamp-2">{pot.graine.nom}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
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