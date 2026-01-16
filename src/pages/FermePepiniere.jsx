import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Sprout, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function FermePepiniere() {
  const [workStation, setWorkStation] = useState([]); // cartes sur la table de rempotage
  const [completedPots, setCompletedPots] = useState([]); // pots dans la serre
  const [feedback, setFeedback] = useState(null);
  const [cardCounts, setCardCounts] = useState({
    pot: 79,
    bois: 79,
    compost: 79
  });

  const { data: graines = [] } = useQuery({
    queryKey: ['graines'],
    queryFn: () => base44.entities.Graine.list(),
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Si on dépose sur la table de rempotage
    if (destination.droppableId === 'workstation') {
      const draggedType = result.draggableId.split('-')[0];
      
      // Vérifier l'ordre
      if (draggedType === 'pot' && workStation.length === 0) {
        setWorkStation([{ type: 'pot', emoji: '🪴', name: 'Pot' }]);
        setCardCounts({ ...cardCounts, pot: cardCounts.pot - 1 });
        setFeedback({ type: 'success', message: '✅ Pot ajouté !' });
        setTimeout(() => setFeedback(null), 1500);
      } else if (draggedType === 'bois' && workStation.length === 1) {
        setWorkStation([...workStation, { type: 'bois', emoji: '🪵', name: 'Bois broyé' }]);
        setCardCounts({ ...cardCounts, bois: cardCounts.bois - 1 });
        setFeedback({ type: 'success', message: '✅ Bois broyé ajouté !' });
        setTimeout(() => setFeedback(null), 1500);
      } else if (draggedType === 'compost' && workStation.length === 2) {
        setWorkStation([...workStation, { type: 'compost', emoji: '♻️', name: 'Compost' }]);
        setCardCounts({ ...cardCounts, compost: cardCounts.compost - 1 });
        setFeedback({ type: 'success', message: '✅ Compost ajouté !' });
        setTimeout(() => setFeedback(null), 1500);
      } else if (draggedType === 'graine' && workStation.length === 3) {
        const graineId = result.draggableId.split('-')[1];
        const graine = graines.find(g => g.id === graineId);
        if (graine && !completedPots.some(p => p.graine.id === graine.id)) {
          setWorkStation([...workStation, { type: 'graine', emoji: graine.emoji, name: graine.nom, graineData: graine }]);
          setFeedback({ type: 'success', message: `✅ ${graine.nom} ajouté !` });
          setTimeout(() => setFeedback(null), 1500);
        }
      } else {
        setFeedback({ type: 'error', message: '❌ Mauvais ordre ! Respecte : Pot → Bois → Compost → Graine' });
        setTimeout(() => setFeedback(null), 2000);
      }
    }
    
    // Si on dépose dans la serre
    if (destination.droppableId.startsWith('serre-') && workStation.length === 4) {
      const slotIndex = parseInt(destination.droppableId.split('-')[1]);
      if (!completedPots.find(p => p.slotIndex === slotIndex)) {
        const newPot = {
          id: Date.now(),
          slotIndex,
          layers: workStation,
          graine: workStation[3].graineData
        };
        setCompletedPots([...completedPots, newPot]);
        setWorkStation([]);
        setFeedback({ type: 'success', message: `🌱 Semis rangé dans la serre !` });
        setTimeout(() => setFeedback(null), 2000);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                Glisse les cartes sur la table dans le bon ordre : Pot → Bois → Compost → Graine, puis dans la serre
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-6">
              {/* Paquets de cartes */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold text-cyan-300">📚 Paquets de cartes</h2>
                
                {/* Pot */}
                <Droppable droppableId="deck-pot" isDropDisabled={true}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable draggableId="pot-deck" index={0} isDragDisabled={cardCounts.pot === 0}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-amber-500/20 border-2 border-amber-400 rounded-xl p-4 ${cardCounts.pot === 0 ? 'opacity-30' : 'cursor-grab active:cursor-grabbing'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-5xl">🪴</span>
                                <div>
                                  <div className="text-white font-bold">Pots de rempotage</div>
                                  <div className="text-amber-300 text-sm">{cardCounts.pot} restants</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Bois */}
                <Droppable droppableId="deck-bois" isDropDisabled={true}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable draggableId="bois-deck" index={0} isDragDisabled={cardCounts.bois === 0}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-orange-700/20 border-2 border-orange-600 rounded-xl p-4 ${cardCounts.bois === 0 ? 'opacity-30' : 'cursor-grab active:cursor-grabbing'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-5xl">🪵</span>
                                <div>
                                  <div className="text-white font-bold">Bois broyé</div>
                                  <div className="text-orange-300 text-sm">{cardCounts.bois} restants</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Compost */}
                <Droppable droppableId="deck-compost" isDropDisabled={true}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable draggableId="compost-deck" index={0} isDragDisabled={cardCounts.compost === 0}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-green-700/20 border-2 border-green-600 rounded-xl p-4 ${cardCounts.compost === 0 ? 'opacity-30' : 'cursor-grab active:cursor-grabbing'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-5xl">♻️</span>
                                <div>
                                  <div className="text-white font-bold">Compost</div>
                                  <div className="text-green-300 text-sm">{cardCounts.compost} restants</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Graines */}
                <div className="bg-white/5 border-2 border-cyan-400/30 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                  <h3 className="text-white font-bold mb-3">🌾 Graines ({graines.length - completedPots.length} disponibles)</h3>
                  <Droppable droppableId="deck-graines" isDropDisabled={true}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                        {graines.filter(g => !completedPots.some(p => p.graine.id === g.id)).map((graine, index) => (
                          <Draggable key={graine.id} draggableId={`graine-${graine.id}`} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-2 cursor-grab active:cursor-grabbing flex items-center gap-2"
                              >
                                <span className="text-2xl">{graine.emoji || '🌱'}</span>
                                <span className="text-white text-sm">{graine.nom}</span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>

              {/* Table de rempotage */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-cyan-300">🛠️ Table de rempotage</h2>
                <Droppable droppableId="workstation">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[400px] bg-white/5 backdrop-blur-xl rounded-xl p-6 border-2 transition-all ${
                        snapshot.isDraggingOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-400/30'
                      }`}
                    >
                      {workStation.length === 0 ? (
                        <div className="text-center py-20 text-cyan-400/50">
                          Glisse ici le pot pour commencer
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {workStation.map((layer, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="bg-cyan-500/20 rounded-lg p-3 border border-cyan-400/30"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-3xl">{layer.emoji}</span>
                                <span className="text-white font-semibold">{layer.name}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                      {workStation.length === 4 && (
                        <div className="text-center mt-4 text-green-300 font-bold">
                          ✅ Pot prêt ! Glisse-le dans la serre →
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
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
                        <Droppable key={index} droppableId={`serre-${index}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                                pot 
                                  ? 'bg-green-500/20 border-green-400/50'
                                  : snapshot.isDraggingOver
                                  ? 'bg-cyan-500/20 border-cyan-400'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              {pot ? (
                                <div className="text-center">
                                  <div className="text-2xl">{pot.graine.emoji || '🌱'}</div>
                                  <div className="text-[8px] text-white mt-1">{pot.graine.nom}</div>
                                </div>
                              ) : (
                                <div className="text-white/20 text-xs">{index + 1}</div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
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
    </DragDropContext>
  );
}