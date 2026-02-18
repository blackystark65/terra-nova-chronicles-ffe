import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function FermePepiniere() {
  const [workStation, setWorkStation] = useState([]);
  const [completedPots, setCompletedPots] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [waterLevel, setWaterLevel] = useState(100);
  const [wateredPots, setWateredPots] = useState([]);
  const [serreStateId, setSerreStateId] = useState(null);
  const [roleFermeId, setRoleFermeId] = useState(null);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.EcoProfile.list()
  });

  const profile = profiles?.[0];

  const { data: caisses } = useQuery({
    queryKey: ['caisseFerme'],
    queryFn: () => base44.entities.CaisseFerme.list(),
  });

  const caisse = caisses?.[0];

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EcoProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['profiles']),
  });

  const updateCaisseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CaisseFerme.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['caisseFerme']),
  });

  const payerTravail = (montant, description) => {
    if (profile && caisse && caisse.total_credits >= montant) {
      const nouvelleTransaction = {
        type: 'salaire',
        montant: montant,
        eleve_email: user?.email || 'inconnu',
        description: description,
        date: new Date().toISOString()
      };

      updateProfileMutation.mutate({
        id: profile.id,
        data: {
          credits: (profile.credits || 0) + montant
        }
      });

      updateCaisseMutation.mutate({
        id: caisse.id,
        data: {
          total_credits: caisse.total_credits - montant,
          salaires_verses: (caisse.salaires_verses || 0) + montant,
          derniere_transaction: new Date().toISOString(),
          historique_transactions: [...(caisse.historique_transactions || []), nouvelleTransaction]
        }
      });
    }
  };

  const { data: graines = [] } = useQuery({
    queryKey: ['graines'],
    queryFn: () => base44.entities.Graine.list(),
  });

  // Récupérer le rôle de l'horticulteur
  const { data: roleFerme } = useQuery({
    queryKey: ['roleFerme', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const roles = await base44.entities.RoleFerme.filter({ created_by: user.email, role: 'horticulteur' });
      return roles[0] || null;
    },
    enabled: !!user?.email,
  });

  // Charger l'état de la serre
  const { data: serreState } = useQuery({
    queryKey: ['serreState', roleFerme?.id],
    queryFn: async () => {
      if (!roleFerme?.id) return null;
      const states = await base44.entities.SerreState.filter({ role_ferme_id: roleFerme.id });
      return states[0] || null;
    },
    enabled: !!roleFerme?.id,
  });

  // Mutation pour créer/mettre à jour l'état de la serre
  const saveSerreMutation = useMutation({
    mutationFn: async (data) => {
      if (serreStateId) {
        return await base44.entities.SerreState.update(serreStateId, data);
      } else {
        return await base44.entities.SerreState.create(data);
      }
    },
    onSuccess: (data) => {
      if (!serreStateId) {
        setSerreStateId(data.id);
      }
      queryClient.invalidateQueries(['serreState']);
    },
  });

  // Charger l'état sauvegardé au démarrage
  React.useEffect(() => {
    if (serreState) {
      setSerreStateId(serreState.id);
      setCompletedPots(serreState.completed_pots || []);
      setWateredPots(serreState.watered_pots || []);
      
      // Calculer le niveau d'eau en fonction du temps écoulé
      if (serreState.last_watered_time) {
        const lastTime = new Date(serreState.last_watered_time).getTime();
        const now = Date.now();
        const elapsedSeconds = (now - lastTime) / 1000;
        const waterLost = (elapsedSeconds / 3600) * 100; // 100% en 3600 secondes
        setWaterLevel(Math.max(0, serreState.water_level - waterLost));
      } else {
        setWaterLevel(serreState.water_level || 100);
      }
    }
  }, [serreState]);

  React.useEffect(() => {
    if (roleFerme?.id) {
      setRoleFermeId(roleFerme.id);
    }
  }, [roleFerme]);

  // Sauvegarder automatiquement l'état
  const saveState = React.useCallback(() => {
    if (!roleFermeId) return;
    
    saveSerreMutation.mutate({
      role_ferme_id: roleFermeId,
      completed_pots: completedPots,
      water_level: waterLevel,
      watered_pots: wateredPots,
      last_watered_time: new Date().toISOString(),
    });
  }, [roleFermeId, completedPots, waterLevel, wateredPots]);

  // Sauvegarder quand les pots ou l'eau changent
  React.useEffect(() => {
    if (roleFermeId && completedPots.length > 0) {
      const timer = setTimeout(() => saveState(), 1000);
      return () => clearTimeout(timer);
    }
  }, [completedPots, waterLevel, wateredPots, roleFermeId, saveState]);

  // Timer pour vider la barre d'eau progressivement
  React.useEffect(() => {
    const interval = setInterval(() => {
      setWaterLevel((prev) => {
        if (prev <= 0) return 0;
        return prev - (100 / 3600);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const [cardType, cardId] = draggableId.split('-');

    // Glisser vers la table de rempotage
    if (destination.droppableId === 'workstation' && cardType !== 'completepot' && cardType !== 'water') {
      if (cardType === 'pot' && workStation.length === 0) {
        setWorkStation([{ type: 'pot', emoji: '⚱️', name: 'Pot' }]);
        setFeedback({ type: 'success', message: '✅ Pot ajouté !' });
      } else if (cardType === 'bois' && workStation.length === 1) {
        setWorkStation([...workStation, { type: 'bois', emoji: '🌳', name: 'Bois broyé' }]);
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

    // Glisser la pile complète vers la serre
    if (cardType === 'completepot' && destination.droppableId.startsWith('serre-')) {
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
        
        // Payer pour le rempotage
        payerTravail(3, 'Horticulteur: pot complété et rangé');
        
        setFeedback({ type: 'success', message: '🌱 Pot rangé ! +3 crédits' });
        setTimeout(() => setFeedback(null), 2000);
      }
    }

    // Glisser l'eau sur un pot de la serre
    if (cardType === 'water' && destination.droppableId.startsWith('serre-')) {
      const slotIndex = parseInt(destination.droppableId.split('-')[1]);
      const pot = completedPots.find(p => p.slotIndex === slotIndex);
      
      if (pot && waterLevel < 100) {
        // Arroser ce pot
        if (!wateredPots.includes(slotIndex)) {
          setWateredPots([...wateredPots, slotIndex]);
          setWaterLevel((prev) => Math.min(100, prev + (100 / completedPots.length)));
          
          // Payer pour arroser
          payerTravail(1, 'Horticulteur: arrosage d\'un pot');
          
          setFeedback({ type: 'success', message: '💧 Pot arrosé ! +1 crédit' });
          setTimeout(() => setFeedback(null), 1000);
        }
      } else if (waterLevel >= 100) {
        setFeedback({ type: 'error', message: '✅ Tous les pots sont déjà arrosés !' });
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  // Réinitialiser les pots arrosés quand la barre atteint 0
  React.useEffect(() => {
    if (waterLevel <= 0) {
      setWateredPots([]);
    }
  }, [waterLevel]);

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
                            className={`aspect-square rounded-lg bg-gradient-to-br from-amber-600 to-orange-700 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-70' : ''}`}
                            style={{ 
                              ...provided.draggableProps.style,
                              zIndex: snapshot.isDragging ? 9999 : 'auto',
                              position: snapshot.isDragging ? 'fixed' : 'relative'
                            }}
                          >
                            <span className="text-3xl">⚱️</span>
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
                            className={`aspect-square rounded-lg bg-gradient-to-br from-orange-800 to-amber-900 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-70' : ''}`}
                            style={{ 
                              ...provided.draggableProps.style,
                              zIndex: snapshot.isDragging ? 9999 : 'auto',
                              position: snapshot.isDragging ? 'fixed' : 'relative'
                            }}
                          >
                            <span className="text-3xl">🌳</span>
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
                            className={`aspect-square rounded-lg bg-gradient-to-br from-green-700 to-emerald-800 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-70' : ''}`}
                            style={{ 
                              ...provided.draggableProps.style,
                              zIndex: snapshot.isDragging ? 9999 : 'auto',
                              position: snapshot.isDragging ? 'fixed' : 'relative'
                            }}
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
                                className={`aspect-square rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-70' : ''}`}
                                style={{ 
                                  ...provided.draggableProps.style,
                                  zIndex: snapshot.isDragging ? 9999 : 'auto',
                                  position: snapshot.isDragging ? 'fixed' : 'relative'
                                }}
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

              {/* Table de rempotage + Arrosage */}
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
                      ) : workStation.length === 4 ? (
                        <Draggable draggableId="completepot-ready" index={0}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative w-32 cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'opacity-70' : ''}`}
                              style={{ 
                                ...provided.draggableProps.style,
                                zIndex: snapshot.isDragging ? 9999 : 'auto',
                                position: snapshot.isDragging ? 'fixed' : 'relative'
                              }}
                            >
                              {workStation.map((layer, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ y: -50, opacity: 0 }}
                                  animate={{ y: i * 12, opacity: 1 }}
                                  className="absolute top-0 left-0 w-full aspect-square rounded-lg bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 shadow-2xl flex flex-col items-center justify-center"
                                  style={{ zIndex: i }}
                                >
                                  <span className="text-3xl">{layer.emoji}</span>
                                  <div className="text-white text-[10px] mt-1">{layer.name}</div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </Draggable>
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

                {/* Carte Eau */}
                <div className="mt-4">
                  <Droppable droppableId="water-deck" isDropDisabled={true}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <Draggable draggableId="water-card" index={0}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing mx-auto ${snapshot.isDragging ? 'opacity-70' : ''}`}
                              style={{ 
                                ...provided.draggableProps.style,
                                zIndex: snapshot.isDragging ? 9999 : 'auto',
                                position: snapshot.isDragging ? 'fixed' : 'relative'
                              }}
                            >
                              <span className="text-3xl">💧</span>
                              <div className="text-white text-[10px] font-bold">Eau</div>
                            </div>
                          )}
                        </Draggable>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Barre d'arrosage */}
                <div className="mt-3 bg-white/10 rounded-lg p-3 border border-cyan-400/30">
                  <div className="text-cyan-300 text-xs font-bold mb-2 text-center">
                    💧 Niveau d'eau
                  </div>
                  <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden relative">
                    <motion.div
                      className={`h-full rounded-full transition-all ${
                        waterLevel > 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                        waterLevel > 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                        'bg-gradient-to-r from-red-500 to-orange-500'
                      }`}
                      style={{ width: `${waterLevel}%` }}
                      animate={waterLevel <= 20 ? { opacity: [1, 0.5, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                      {Math.round(waterLevel)}%
                    </div>
                  </div>
                  <div className="text-cyan-400/70 text-[10px] text-center mt-1">
                    {waterLevel <= 20 ? '⚠️ Arrose tes plantes !' : 'Glisse l\'eau sur les pots'}
                  </div>
                  <div className="text-cyan-400/50 text-[9px] text-center mt-1">
                    Arrosés: {wateredPots.length}/{completedPots.length}
                  </div>
                </div>
              </div>

              {/* Serre - Grande carte verticale */}
              <div className="lg:col-span-2 space-y-2">
                <h2 className="text-lg font-bold text-cyan-300 text-center">
                  🏡 Serre ({completedPots.length}/{graines.length})
                </h2>
                <div className="bg-white/5 backdrop-blur-xl rounded-lg p-2 border border-cyan-400/30 relative z-0">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: graines.length }).map((_, index) => {
                      const pot = completedPots.find(p => p.slotIndex === index);
                      return (
                        <Droppable key={index} droppableId={`serre-${index}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`aspect-square rounded border flex items-center justify-center transition-all relative z-0 ${
                                pot
                                  ? wateredPots.includes(index)
                                    ? 'bg-blue-500/40 border-blue-400 shadow-lg shadow-blue-500/50'
                                    : 'bg-green-500/30 border-green-400'
                                  : snapshot.isDraggingOver
                                  ? 'bg-cyan-500/30 border-cyan-400'
                                  : 'bg-white/5 border-white/20'
                              }`}
                            >
                              {pot ? (
                                <div className="text-center relative">
                                  <div className="text-lg">{pot.graine.emoji || '🌱'}</div>
                                  {wateredPots.includes(index) && (
                                    <div className="absolute -top-1 -right-1 text-xs">💧</div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-white/30 text-[8px]">{index + 1}</div>
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