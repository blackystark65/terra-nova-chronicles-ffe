import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FLOURS = [
  { id: 'ble', name: 'Blé', emoji: '🌾', color: 'from-yellow-600 to-amber-700' },
  { id: 'seigle', name: 'Seigle', emoji: '🌾', color: 'from-amber-700 to-orange-800' },
  { id: 'orge', name: 'Orge', emoji: '🌾', color: 'from-yellow-700 to-yellow-800' },
  { id: 'mais', name: 'Maïs', emoji: '🌽', color: 'from-yellow-500 to-yellow-600' },
  { id: 'avoine', name: 'Avoine', emoji: '🌾', color: 'from-amber-600 to-amber-700' },
  { id: 'chataigne', name: 'Châtaigne', emoji: '🌰', color: 'from-amber-800 to-orange-900' },
  { id: 'sarrasin', name: 'Sarrasin', emoji: '🌾', color: 'from-gray-700 to-gray-800' },
  { id: 'epautre', name: 'Épautre', emoji: '🌾', color: 'from-yellow-800 to-orange-700' },
  { id: 'riz', name: 'Riz', emoji: '🍚', color: 'from-white to-yellow-100' },
  { id: 'complete', name: 'Complète', emoji: '🌾', color: 'from-orange-900 to-brown-950' }
];

export default function FermeBoulangerie() {
  const [workStation, setWorkStation] = useState([]);
  const [proofingTable, setProofingTable] = useState(Array(40).fill(null));
  const [ovenSlots, setOvenSlots] = useState(Array(20).fill(null));
  const [feedback, setFeedback] = useState(null);
  const [currentBatch, setCurrentBatch] = useState(1); // 1 ou 2
  const [stageProgress, setStageProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('idle'); // idle, proofing, heating, baking
  const [woodCardsPlaced, setWoodCardsPlaced] = useState(0);
  const [completedLoaves, setCompletedLoaves] = useState(0);
  const [boulangeriStateId, setBoulangeriStateId] = useState(null);
  const [roleFermeId, setRoleFermeId] = useState(null);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  // Récupérer le rôle du boulanger
  const { data: roleFerme } = useQuery({
    queryKey: ['roleFerme', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const roles = await base44.entities.RoleFerme.filter({ created_by: user.email, role: 'boulanger' });
      return roles[0] || null;
    },
    enabled: !!user?.email,
  });

  // Charger l'état de la boulangerie
  const { data: boulangeriState } = useQuery({
    queryKey: ['boulangeriState', roleFerme?.id],
    queryFn: async () => {
      if (!roleFerme?.id) return null;
      const states = await base44.entities.BoulangeriState.filter({ role_ferme_id: roleFerme.id });
      return states[0] || null;
    },
    enabled: !!roleFerme?.id,
  });

  // Mutation pour sauvegarder
  const saveBoulangerieMutation = useMutation({
    mutationFn: async (data) => {
      if (boulangeriStateId) {
        return await base44.entities.BoulangeriState.update(boulangeriStateId, data);
      } else {
        return await base44.entities.BoulangeriState.create(data);
      }
    },
    onSuccess: (data) => {
      if (!boulangeriStateId) {
        setBoulangeriStateId(data.id);
      }
      queryClient.invalidateQueries(['boulangeriState']);
    },
  });

  // Charger l'état sauvegardé
  React.useEffect(() => {
    if (boulangeriState) {
      setBoulangeriStateId(boulangeriState.id);
      setProofingTable(boulangeriState.proofing_table || Array(40).fill(null));
      setOvenSlots(boulangeriState.oven || Array(20).fill(null));
      setCurrentStage(boulangeriState.current_stage || 'idle');
      setStageProgress(boulangeriState.stage_progress || 0);
      setCompletedLoaves(boulangeriState.completed_loaves || 0);
      setCurrentBatch(boulangeriState.batch_number || 1);
    }
  }, [boulangeriState]);

  React.useEffect(() => {
    if (roleFerme?.id) {
      setRoleFermeId(roleFerme.id);
    }
  }, [roleFerme]);

  // Sauvegarder automatiquement
  const saveState = React.useCallback(() => {
    if (!roleFermeId) return;
    saveBoulangerieMutation.mutate({
      role_ferme_id: roleFermeId,
      proofing_table: proofingTable,
      oven: ovenSlots,
      current_stage: currentStage,
      stage_progress: stageProgress,
      batch_number: currentBatch,
      completed_loaves: completedLoaves,
      last_updated: new Date().toISOString(),
    });
  }, [roleFermeId, proofingTable, ovenSlots, currentStage, stageProgress, currentBatch, completedLoaves]);

  React.useEffect(() => {
    if (roleFermeId && (proofingTable.some(p => p) || ovenSlots.some(o => o))) {
      const timer = setTimeout(() => saveState(), 1000);
      return () => clearTimeout(timer);
    }
  }, [proofingTable, ovenSlots, currentStage, stageProgress, completedLoaves, roleFermeId, saveState]);

  // Timer pour les étapes
  React.useEffect(() => {
    if (currentStage === 'idle') return;

    const interval = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 100) {
          // Progression vers l'étape suivante
          if (currentStage === 'proofing') {
            setCurrentStage('heating');
            setWoodCardsPlaced(0);
            setFeedback({ type: 'success', message: '✅ Pousse terminée ! Mets le bois dans le four' });
            return 0;
          } else if (currentStage === 'heating' && woodCardsPlaced === 20) {
            setCurrentStage('baking');
            setWoodCardsPlaced(0);
            setFeedback({ type: 'success', message: '🔥 Four préchauffé ! Mets les pains' });
            return 0;
          } else if (currentStage === 'baking') {
            // Pains cuits
            const newOvenSlots = ovenSlots.map(slot => null);
            setOvenSlots(newOvenSlots);
            setCompletedLoaves(completedLoaves + 20);
            
            // Passage à la fournée suivante ou fin
            if (currentBatch === 1) {
              setCurrentBatch(2);
              setCurrentStage('idle');
              setProofingTable(Array(40).fill(null));
              setFeedback({ type: 'success', message: '🥖 20 pains cuits et envoyés ! Prépare la 2ème fournée' });
            } else {
              setCurrentStage('idle');
              setProofingTable(Array(40).fill(null));
              setFeedback({ type: 'success', message: '🥖 40 pains complétés ! Recommence si tu veux' });
            }
            return 0;
          }
          return prev;
        }
        return prev + (100 / 60); // 60 secondes pour 100%
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStage, woodCardsPlaced, currentBatch, ovenSlots, completedLoaves]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const [cardType, cardId] = draggableId.split('-');

    // Ajouter à la table de pétrissage
    if (destination.droppableId === 'workstation' && cardType !== 'dough') {
      if (cardType === 'flour' && workStation.length === 0) {
        const flour = FLOURS.find(f => f.id === cardId);
        setWorkStation([{ type: 'flour', emoji: flour.emoji, name: flour.name, flourId: flour.id }]);
        setFeedback({ type: 'success', message: `✅ ${flour.name} ajoutée !` });
      } else if (cardType === 'water' && workStation.length === 1) {
        setWorkStation([...workStation, { type: 'water', emoji: '💧', name: 'Eau' }]);
        setFeedback({ type: 'success', message: '✅ Eau ajoutée !' });
      } else if (cardType === 'leaven' && workStation.length === 2) {
        setWorkStation([...workStation, { type: 'leaven', emoji: '🫧', name: 'Levain' }]);
        setFeedback({ type: 'success', message: '✅ Levain ajouté !' });
      } else if (cardType === 'salt' && workStation.length === 3) {
        setWorkStation([...workStation, { type: 'salt', emoji: '🧂', name: 'Sel' }]);
        setFeedback({ type: 'success', message: '✅ Sel ajouté ! Pâte prête' });
      } else {
        setFeedback({ type: 'error', message: '❌ Ordre: Farine → Eau → Levain → Sel' });
      }
      setTimeout(() => setFeedback(null), 1500);
    }

    // Glisser la pâte vers la table de pousse
    if (cardType === 'dough' && destination.droppableId.startsWith('proofing-')) {
      const slotIndex = parseInt(destination.droppableId.split('-')[1]);
      const batchStart = currentBatch === 1 ? 0 : 20;
      
      if (slotIndex >= batchStart && slotIndex < batchStart + 20) {
        if (!proofingTable[slotIndex]) {
          const newTable = [...proofingTable];
          newTable[slotIndex] = { id: Date.now(), flour: workStation[0].flourId };
          setProofingTable(newTable);
          setWorkStation([]);
          
          // Vérifier si 20 pains sont placés
          const filledSlots = newTable.filter((_, i) => i >= batchStart && i < batchStart + 20 && newTable[i]).length;
          if (filledSlots === 20) {
            setCurrentStage('proofing');
            setStageProgress(0);
            setFeedback({ type: 'success', message: '🍞 20 pains mis à lever !' });
          } else {
            setFeedback({ type: 'success', message: `📍 Pain placé (${filledSlots}/20)` });
          }
        }
      }
      setTimeout(() => setFeedback(null), 1500);
    }

    // Ajouter le bois au four
    if (cardType === 'wood' && destination.droppableId === 'oven-container') {
      if (currentStage === 'heating' && woodCardsPlaced < 20) {
        // Trouver le premier emplacement vide
        const emptySlot = ovenSlots.findIndex(slot => !slot);
        if (emptySlot !== -1) {
          const newOven = [...ovenSlots];
          newOven[emptySlot] = { type: 'wood' };
          setOvenSlots(newOven);
          setWoodCardsPlaced(woodCardsPlaced + 1);
          
          if (woodCardsPlaced + 1 === 20) {
            setFeedback({ type: 'success', message: '🔥 Four en chauffe !' });
          } else {
            setFeedback({ type: 'success', message: `🪵 Bois placé (${woodCardsPlaced + 1}/20)` });
          }
        }
      }
      setTimeout(() => setFeedback(null), 1000);
    }

    // Ajouter les pains au four
    if (cardType === 'proofed' && destination.droppableId === 'oven-container') {
      if (currentStage === 'baking') {
        const proofedIndex = parseInt(source.droppableId.split('-')[1]);
        const newProofing = [...proofingTable];
        const bread = newProofing[proofedIndex];
        if (bread) {
          newProofing[proofedIndex] = null;
          setProofingTable(newProofing);

          // Trouver le premier emplacement vide (après le bois)
          const emptySlot = ovenSlots.findIndex((slot, idx) => !slot && idx < 20);
          if (emptySlot !== -1) {
            const newOven = [...ovenSlots];
            newOven[emptySlot] = { type: 'bread', flour: bread.flour };
            setOvenSlots(newOven);
            setFeedback({ type: 'success', message: '🥖 Pain en cuisson !' });
          }
        }
      }
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const startSecondBatch = () => {
    if (currentBatch === 1) {
      setCurrentBatch(2);
      setProofingTable(Array(40).fill(null));
      setOvenSlots(Array(20).fill(null));
      setCurrentStage('idle');
      setFeedback({ type: 'success', message: '🥖 Prêt pour la 2ème fournée !' });
    }
  };

  const getBatchRange = () => {
    if (currentBatch === 1) return { start: 0, end: 20 };
    return { start: 20, end: 40 };
  };

  const batchRange = getBatchRange();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-red-950">
        <BiolumiHeader currentPage="MicroFerme" />

        <main className="pt-20 px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <Link to={createPageUrl('MicroFerme')}>
              <Button variant="outline" className="mb-4 border-orange-400 text-orange-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>

            <h1 className="text-3xl font-bold text-orange-300 mb-6 text-center">
              🥖 Boulangerie - Fournée {currentBatch}
            </h1>

            {/* Barre de progression principale - TOUJOURS VISIBLE */}
            <div className="mb-6 bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-6 border-2 border-orange-400/50 shadow-2xl">
              <div className="text-orange-200 text-lg font-bold mb-4 text-center">
                {currentStage === 'idle' && '⏸️ En attente'}
                {currentStage === 'proofing' && '🍞 Les pains lèvent...'}
                {currentStage === 'heating' && '🔥 Le four chauffe...'}
                {currentStage === 'baking' && '🥖 Les pains cuisent...'}
              </div>
              <div className="w-full h-12 bg-gray-900 rounded-full overflow-hidden relative border-2 border-orange-500">
                <motion.div
                  className={`h-full rounded-full transition-all ${
                    currentStage === 'idle' ? 'bg-gray-600' :
                    currentStage === 'proofing' ? 'bg-gradient-to-r from-green-500 via-green-400 to-emerald-300' :
                    currentStage === 'heating' ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400' :
                    'bg-gradient-to-r from-orange-600 via-yellow-500 to-yellow-300'
                  }`}
                  style={{ width: `${stageProgress}%` }}
                  animate={currentStage !== 'idle' ? { boxShadow: `0 0 20px ${
                    currentStage === 'proofing' ? 'rgb(34, 197, 94)' :
                    currentStage === 'heating' ? 'rgb(239, 68, 68)' :
                    'rgb(249, 115, 22)'
                  }` } : {}}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold drop-shadow-lg">
                  {Math.round(stageProgress)}%
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-3">
              {/* COL 1: Farines */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-orange-300 text-center">Farines</h3>
                <Droppable droppableId="deck-flours" isDropDisabled={true}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 gap-2">
                      {FLOURS.map((flour, index) => (
                        <Draggable key={flour.id} draggableId={`flour-${flour.id}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`aspect-square rounded-lg bg-gradient-to-br ${flour.color} border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-[10px] ${snapshot.isDragging ? 'z-[9999] opacity-50' : ''}`}
                              style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                            >
                              <span className="text-xl">{flour.emoji}</span>
                              <div className="text-white font-bold text-[8px] mt-0.5 text-center line-clamp-1">{flour.name}</div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* COL 2: Ingrédients */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-orange-300 text-center">Ingrédients</h3>
                <Droppable droppableId="deck-ingredients" isDropDisabled={true}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-3 gap-2">
                      {/* Eau */}
                      <Draggable draggableId="water-0" index={0}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`aspect-square rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-[10px] ${snapshot.isDragging ? 'z-[9999] opacity-50' : ''}`}
                            style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                          >
                            <span className="text-xl">💧</span>
                            <div className="text-white font-bold text-[7px]">Eau</div>
                          </div>
                        )}
                      </Draggable>

                      {/* Levain */}
                      <Draggable draggableId="leaven-0" index={1}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`aspect-square rounded-lg bg-gradient-to-br from-red-500 to-orange-600 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-[10px] ${snapshot.isDragging ? 'z-[9999] opacity-50' : ''}`}
                            style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                          >
                            <span className="text-xl">🫧</span>
                            <div className="text-white font-bold text-[7px]">Levain</div>
                          </div>
                        )}
                      </Draggable>

                      {/* Sel */}
                      <Draggable draggableId="salt-0" index={2}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`aspect-square rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-[10px] ${snapshot.isDragging ? 'z-[9999] opacity-50' : ''}`}
                            style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                          >
                            <span className="text-xl">🧂</span>
                            <div className="text-white font-bold text-[7px]">Sel</div>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* COL 3: Pétrissage + Table de Pousse */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-orange-300 text-center">🛠️ Pétrissage</h3>
                <Droppable droppableId="workstation">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-white/10 backdrop-blur-xl rounded-lg p-3 border-2 min-h-[180px] flex items-center justify-center ${
                        snapshot.isDraggingOver ? 'border-orange-400 bg-orange-500/10' : 'border-orange-400/30'
                      }`}
                    >
                      {workStation.length === 0 ? (
                        <div className="text-center text-orange-400/50 text-[11px]">Glisse la farine</div>
                      ) : workStation.length === 4 ? (
                        <Draggable draggableId="dough-ready" index={0}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative w-24 cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'z-[9999]' : ''}`}
                              style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                            >
                              {workStation.map((layer, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ y: -30, opacity: 0 }}
                                  animate={{ y: i * 10, opacity: 1 }}
                                  className="absolute top-0 left-0 w-full aspect-square rounded-lg bg-gradient-to-br from-amber-200 to-yellow-300 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center"
                                  style={{ zIndex: i }}
                                >
                                  <span className="text-2xl">{layer.emoji}</span>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </Draggable>
                      ) : (
                        <div className="relative w-24">
                          {workStation.map((layer, i) => (
                            <motion.div
                              key={i}
                              initial={{ y: -30, opacity: 0 }}
                              animate={{ y: i * 10, opacity: 1 }}
                              className="absolute top-0 left-0 w-full aspect-square rounded-lg bg-gradient-to-br from-amber-200 to-yellow-300 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center"
                              style={{ zIndex: i }}
                            >
                              <span className="text-2xl">{layer.emoji}</span>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <h3 className="text-sm font-bold text-orange-300 text-center mt-2">📍 Pousse</h3>
                <div className="bg-white/5 backdrop-blur-xl rounded-lg p-1 border border-orange-400/30">
                  <div className="grid grid-cols-10 gap-0.5">
                    {proofingTable.slice(batchRange.start, batchRange.end).map((slot, idx) => {
                      const index = batchRange.start + idx;
                      return (
                        <Droppable key={index} droppableId={`proofing-${index}`} type="proofing">
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`h-6 w-6 rounded border flex items-center justify-center text-[10px] transition-all ${
                                slot
                                  ? 'bg-green-500/30 border-green-400'
                                  : snapshot.isDraggingOver
                                  ? 'bg-orange-500/30 border-orange-400'
                                  : 'bg-white/5 border-white/20'
                              }`}
                            >
                              {slot && <span>🍞</span>}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* COL 4: Bois + Four */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-orange-300 text-center">Bois (40)</h3>
                <Droppable droppableId="deck-wood" isDropDisabled={true}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable draggableId="wood-0" index={0}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`aspect-square rounded-lg bg-gradient-to-br from-orange-800 to-red-900 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing text-[10px] ${snapshot.isDragging ? 'z-[9999] opacity-50' : ''}`}
                            style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                          >
                            <span className="text-2xl">🪵</span>
                            <div className="text-white font-bold text-[7px]">Bois</div>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

                <h3 className="text-sm font-bold text-orange-300 text-center mt-2">🔥 Four</h3>
                <Droppable droppableId="oven-container" type="oven">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-white/5 backdrop-blur-xl rounded-lg p-1 border border-orange-400/30"
                    >
                      <div className="grid grid-cols-5 gap-0.5">
                        {ovenSlots.map((slot, index) => (
                          <div
                            key={index}
                            className={`h-8 w-8 rounded border flex items-center justify-center transition-all text-sm ${
                              slot
                                ? slot.type === 'wood'
                                  ? 'bg-red-900/50 border-red-500'
                                  : 'bg-orange-600/40 border-orange-400'
                                : 'bg-white/5 border-white/20'
                            }`}
                          >
                            {slot && (
                              <span>{slot.type === 'wood' ? '🪵' : '🥖'}</span>
                            )}
                          </div>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            </div>

               {/* Bouton pour passer à la 2ème fournée */}
               {currentStage === 'idle' && currentBatch === 1 && proofingTable.some(p => p) && (
                 <Button
                   onClick={startSecondBatch}
                   className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                 >
                   🔄 Préparer la 2ème fournée
                 </Button>
               )}

               {/* Compteur final */}
            <div className="mt-6 text-center">
              <div className="inline-block bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-orange-400/30">
                <div className="text-orange-300 font-bold text-lg">
                  🥖 Pains complétés: {completedLoaves}/40
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