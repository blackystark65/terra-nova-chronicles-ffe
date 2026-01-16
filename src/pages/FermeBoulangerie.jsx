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
    if (cardType === 'wood' && destination.droppableId.startsWith('oven-')) {
      const slotIndex = parseInt(destination.droppableId.split('-')[1]);
      if (!ovenSlots[slotIndex] && currentStage === 'heating' && woodCardsPlaced < 20) {
        const newOven = [...ovenSlots];
        newOven[slotIndex] = { type: 'wood' };
        setOvenSlots(newOven);
        setWoodCardsPlaced(woodCardsPlaced + 1);
        
        if (woodCardsPlaced + 1 === 20) {
          setFeedback({ type: 'success', message: '🔥 Four en chauffe !' });
        } else {
          setFeedback({ type: 'success', message: `🪵 Bois placé (${woodCardsPlaced + 1}/20)` });
        }
      }
      setTimeout(() => setFeedback(null), 1000);
    }

    // Ajouter les pains au four
    if (cardType === 'proofed' && destination.droppableId.startsWith('oven-')) {
      const slotIndex = parseInt(destination.droppableId.split('-')[1]);
      const batchStart = currentBatch === 1 ? 0 : 20;
      
      if (!ovenSlots[slotIndex] && currentStage === 'baking') {
        const proofedIndex = parseInt(source.droppableId.split('-')[1]);
        const newProofing = [...proofingTable];
        const bread = newProofing[proofedIndex];
        newProofing[proofedIndex] = null;
        setProofingTable(newProofing);

        const newOven = [...ovenSlots];
        newOven[slotIndex] = { type: 'bread', flour: bread.flour };
        setOvenSlots(newOven);
        
        setFeedback({ type: 'success', message: '🥖 Pain en cuisson !' });
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
          <div className="max-w-7xl mx-auto">
            <Link to={createPageUrl('MicroFerme')}>
              <Button variant="outline" className="mb-4 border-orange-400 text-orange-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>

            <h1 className="text-3xl font-bold text-orange-300 mb-6 text-center">
              🥖 Boulangerie - Fournée {currentBatch}
            </h1>

            <div className="grid lg:grid-cols-5 gap-4">
              {/* Paquets de cartes - Farines */}
              <div className="lg:col-span-1 space-y-2">
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

              {/* Cartes Eau, Levain, Sel */}
              <div className="lg:col-span-1 space-y-2">
                <h3 className="text-sm font-bold text-orange-300 text-center">Ingrédients</h3>
                <div className="space-y-2">
                  {/* Eau */}
                  <Droppable droppableId="deck-water" isDropDisabled={true}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <Draggable draggableId="water-0" index={0}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`aspect-square rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'z-[9999] opacity-50' : ''}`}
                              style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                            >
                              <span className="text-3xl">💧</span>
                              <div className="text-white font-bold text-[8px]">Eau</div>
                              <div className="absolute top-1 right-1 bg-black/50 px-1 rounded text-white text-[8px]">40</div>
                            </div>
                          )}
                        </Draggable>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Levain */}
                  <Droppable droppableId="deck-leaven" isDropDisabled={true}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <Draggable draggableId="leaven-0" index={0}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`aspect-square rounded-lg bg-gradient-to-br from-red-500 to-orange-600 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'z-[9999] opacity-50' : ''}`}
                              style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                            >
                              <span className="text-3xl">🫧</span>
                              <div className="text-white font-bold text-[8px]">Levain</div>
                              <div className="absolute top-1 right-1 bg-black/50 px-1 rounded text-white text-[8px]">40</div>
                            </div>
                          )}
                        </Draggable>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Sel */}
                  <Droppable droppableId="deck-salt" isDropDisabled={true}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <Draggable draggableId="salt-0" index={0}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`aspect-square rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'z-[9999] opacity-50' : ''}`}
                              style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                            >
                              <span className="text-3xl">🧂</span>
                              <div className="text-white font-bold text-[8px]">Sel</div>
                              <div className="absolute top-1 right-1 bg-black/50 px-1 rounded text-white text-[8px]">40</div>
                            </div>
                          )}
                        </Draggable>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>

              {/* Table de pétrissage */}
              <div className="lg:col-span-1 space-y-2">
                <h3 className="text-sm font-bold text-orange-300 text-center">🛠️ Pétrissage</h3>
                <Droppable droppableId="workstation">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-white/10 backdrop-blur-xl rounded-lg p-3 border-2 min-h-[300px] flex items-center justify-center ${
                        snapshot.isDraggingOver ? 'border-orange-400 bg-orange-500/10' : 'border-orange-400/30'
                      }`}
                    >
                      {workStation.length === 0 ? (
                        <div className="text-center text-orange-400/50 text-xs">Glisse la farine ici</div>
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
              </div>

              {/* Bois pour le four */}
              <div className="lg:col-span-1 space-y-2">
                <h3 className="text-sm font-bold text-orange-300 text-center">Bois (x2)</h3>
                <Droppable droppableId="deck-wood" isDropDisabled={true}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable draggableId="wood-0" index={0}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`aspect-square rounded-lg bg-gradient-to-br from-orange-800 to-red-900 border-2 border-white/30 shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'z-[9999] opacity-50' : ''}`}
                            style={{ zIndex: snapshot.isDragging ? 9999 : 'auto' }}
                          >
                            <span className="text-3xl">🪵</span>
                            <div className="text-white font-bold text-[8px]">Bois</div>
                            <div className="absolute top-1 right-1 bg-black/50 px-1 rounded text-white text-[8px]">80</div>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Four */}
              <div className="lg:col-span-1 space-y-2">
                <h3 className="text-sm font-bold text-orange-300 text-center">🔥 Four (20)</h3>
                <div className="bg-white/5 backdrop-blur-xl rounded-lg p-2 border border-orange-400/30">
                  <div className="grid grid-cols-5 gap-1 h-[300px]">
                    {ovenSlots.map((slot, index) => (
                      <Droppable key={index} droppableId={`oven-${index}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`aspect-square rounded border flex items-center justify-center transition-all relative z-0 ${
                              slot
                                ? slot.type === 'wood'
                                  ? 'bg-red-900/50 border-red-500'
                                  : 'bg-orange-600/40 border-orange-400'
                                : snapshot.isDraggingOver
                                ? 'bg-orange-500/30 border-orange-400'
                                : 'bg-white/5 border-white/20'
                            }`}
                          >
                            {slot && (
                              <span className="text-lg">{slot.type === 'wood' ? '🪵' : '🥖'}</span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Table de pousse */}
            <div className="mt-6 space-y-2">
              <h2 className="text-xl font-bold text-orange-300 text-center">
                📍 Table de Pousse ({batchRange.start + 1}-{batchRange.end}) - {currentStage === 'proofing' ? `${Math.round(stageProgress)}% 📈` : 'Prête'}
              </h2>
              <div className="bg-white/5 backdrop-blur-xl rounded-lg p-3 border border-orange-400/30">
                <div className="grid grid-cols-10 gap-1">
                  {proofingTable.map((slot, index) => {
                    const inCurrentBatch = index >= batchRange.start && index < batchRange.end;
                    return inCurrentBatch ? (
                      <Droppable key={index} droppableId={`proofing-${index}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`aspect-square rounded border flex items-center justify-center transition-all relative z-0 ${
                              slot
                                ? 'bg-green-500/30 border-green-400'
                                : snapshot.isDraggingOver
                                ? 'bg-orange-500/30 border-orange-400'
                                : 'bg-white/5 border-white/20'
                            }`}
                          >
                            {slot && (
                              <div className="text-center">
                                <span className="text-lg">🍞</span>
                              </div>
                            )}
                            <div className="text-white/30 text-[8px]">{index + 1}</div>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ) : (
                      <div key={index} className="aspect-square rounded border border-gray-500/30 bg-gray-800/20 flex items-center justify-center text-gray-500/30 text-[8px]">
                        {index + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Barre de progression */}
              {currentStage !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 bg-white/10 rounded-lg p-4 border border-orange-400/30"
                >
                  <div className="text-orange-300 text-sm font-bold mb-2 text-center">
                    {currentStage === 'proofing' && '🍞 Les pains lèvent...'}
                    {currentStage === 'heating' && '🔥 Le four chauffe...'}
                    {currentStage === 'baking' && '🥖 Les pains cuisent...'}
                  </div>
                  <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden relative">
                    <motion.div
                      className={`h-full rounded-full transition-all ${
                        currentStage === 'proofing' ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                        currentStage === 'heating' ? 'bg-gradient-to-r from-red-500 to-orange-400' :
                        'bg-gradient-to-r from-orange-500 to-yellow-400'
                      }`}
                      style={{ width: `${stageProgress}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                      {Math.round(stageProgress)}%
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bouton pour passer à la 2ème fournée */}
              {currentStage === 'idle' && currentBatch === 1 && proofingTable.some(p => p) && (
                <Button
                  onClick={startSecondBatch}
                  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  🔄 Préparer la 2ème fournée (20 pains)
                </Button>
              )}
            </div>

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