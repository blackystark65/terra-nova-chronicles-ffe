import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function FermePepiniere() {
  const [workStation, setWorkStation] = useState([]);
  const [completedPots, setCompletedPots] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const { data: graines = [] } = useQuery({
    queryKey: ['graines'],
    queryFn: () => base44.entities.Graine.list(),
  });

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const [cardType, cardId] = draggableId.split('-');

    // Glisser vers la table de rempotage
    if (destination.droppableId === 'workstation') {
      if (cardType === 'pot' && workStation.length === 0) {
        setWorkStation([{ type: 'pot', emoji: '🪴', name: 'Pot' }]);
        setFeedback({ type: 'success', message: '✅ Pot ajouté !' });
      } else if (cardType === 'bois' && workStation.length === 1) {
        setWorkStation([...workStation, { type: 'bois', emoji: '🪵', name: 'Bois broyé' }]);
        setFeedback({ type: 'success', message: '✅ Bois broyé ajouté !' });
      } else if (cardType === 'compost' && workStation.length === 2) {
        setWorkStation([...workStation, { type: 'compost', emoji: '♻️', name: 'Compost' }]);
        setFeedback({ type: 'success', message: '✅ Compost ajouté !' });
      } else if (cardType === 'graine' && workStation.length === 3) {
        const graine = graines.find(g => g.id === cardId);
        if (graine && !completedPots.some(p => p.graine.id === graine.id)) {
          setWorkStation([...workStation, { type: 'graine', emoji: graine.emoji, name: graine.nom, graineData: graine }]);
          setFeedback({ type: 'success', message: `✅ ${graine.nom} ajouté !` });
        }
      } else {
        setFeedback({ type: 'error', message: '❌ Ordre: Pot → Bois → Compost → Graine' });
      }
      setTimeout(() => setFeedback(null), 1500);
    }

    // Glisser vers la serre
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
        setFeedback({ type: 'success', message: '🌱 Pot rangé dans la serre !' });
        setTimeout(() => setFeedback(null), 2000);
      }
    }
  };

  const availableGraines = graines.filter(g => !completedPots.some(p => p.graine.id === g.id));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950">
        <BiolumiHeader currentPage="MicroFerme" />

        <main className="pt-20 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link to={createPageUrl('MicroFerme')}>
              <Button variant="outline" className="mb-4 border-cyan-400 text-cyan-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>

            <h1 className="text-3xl font-bold text-cyan-300 mb-6 text-center">
              🌱 Pépinière / Serre - Horticulteur
            </h1>

            <div className="grid lg:grid-cols-5 gap-4">
              {/* Paquets de cartes */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                {/* Pot */}
                <Droppable droppableId="deck-pot" isDropDisabled={true}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable draggableId="pot-0" index={0}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`aspect-square rounded-lg bg-gradient-to-br from-amber-600 to-orange-700 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-50' : ''}`}
                          >
                            <span className="text-3xl">🪴</span>
                            <div className="text-white font-bold text-xs mt-1">Pot</div>
                            <div className="absolute top-1 right-1 bg-black/50 px-1.5 py-0.5 rounded text-white text-[10px] font-bold">79</div>
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
                      <Draggable draggableId="bois-0" index={0}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`aspect-square rounded-lg bg-gradient-to-br from-orange-800 to-amber-900 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-50' : ''}`}
                          >
                            <span className="text-3xl">🪵</span>
                            <div className="text-white font-bold text-xs mt-1">Bois</div>
                            <div className="absolute top-1 right-1 bg-black/50 px-1.5 py-0.5 rounded text-white text-[10px] font-bold">79</div>
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
                      <Draggable draggableId="compost-0" index={0}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`aspect-square rounded-lg bg-gradient-to-br from-green-700 to-emerald-800 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-50' : ''}`}
                          >
                            <span className="text-3xl">♻️</span>
                            <div className="text-white font-bold text-xs mt-1">Compost</div>
                            <div className="absolute top-1 right-1 bg-black/50 px-1.5 py-0.5 rounded text-white text-[10px] font-bold">79</div>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Graines - toutes les cartes affichées */}
                <div className="col-span-2 bg-white/5 rounded-lg border border-cyan-400/30 p-3 max-h-[400px] overflow-y-auto">
                  <div className="text-cyan-300 font-bold text-sm mb-2">Graines ({availableGraines.length})</div>
                  <Droppable droppableId="deck-graines" isDropDisabled={true}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-4 gap-2">
                        {availableGraines.map((graine, index) => (
                          <Draggable key={graine.id} draggableId={`graine-${graine.id}`} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`aspect-square rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-50' : ''}`}
                              >
                                <span className="text-2xl">{graine.emoji || '🌱'}</span>
                                <div className="text-white text-[8px] text-center mt-1 line-clamp-2 px-1">{graine.nom}</div>
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
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-cyan-300 text-center">🛠️ Table</h2>
                <Droppable droppableId="workstation">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-white/10 backdrop-blur-xl rounded-lg p-4 border-2 min-h-[450px] flex items-center justify-center ${
                        snapshot.isDraggingOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-400/30'
                      }`}
                    >
                      {workStation.length === 0 ? (
                        <div className="text-center text-cyan-400/50 text-sm">Glisse le pot ici</div>
                      ) : (
                        <div className="relative w-32">
                          {workStation.map((layer, i) => (
                            <motion.div
                              key={i}
                              initial={{ y: -50, opacity: 0 }}
                              animate={{ y: i * 12, opacity: 1 }}
                              className="absolute top-0 left-0 w-full aspect-square rounded-lg bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center"
                              style={{ zIndex: i }}
                            >
                              <span className="text-3xl">{layer.emoji}</span>
                              <div className="text-white text-[10px] mt-1">{layer.name}</div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Serre */}
              <div className="lg:col-span-2 space-y-2">
                <h2 className="text-lg font-bold text-cyan-300">
                  🏡 Serre ({completedPots.length}/{graines.length})
                </h2>
                <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 border border-cyan-400/30 max-h-[500px] overflow-y-auto">
                  <div className="grid grid-cols-6 gap-2">
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
                                  <div className="text-xl">{pot.graine.emoji || '🌱'}</div>
                                  <div className="text-[7px] text-white mt-0.5 line-clamp-1">{pot.graine.nom}</div>
                                </div>
                              ) : (
                                <div className="text-white/20 text-[10px]">{index + 1}</div>
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