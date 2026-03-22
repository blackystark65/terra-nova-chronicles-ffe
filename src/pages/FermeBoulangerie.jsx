import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Flame, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { computeRewards } from '@/lib/rewardPlayer';

const FLOURS = [
  { id: 'ble', name: 'Blé', emoji: '🌾', color: 'from-yellow-600 to-amber-700' },
  { id: 'seigle', name: 'Seigle', emoji: '🌾', color: 'from-amber-700 to-orange-800' },
  { id: 'orge', name: 'Orge', emoji: '🌾', color: 'from-yellow-700 to-yellow-800' },
  { id: 'mais', name: 'Maïs', emoji: '🌽', color: 'from-yellow-500 to-yellow-600' },
  { id: 'avoine', name: 'Avoine', emoji: '🌾', color: 'from-amber-600 to-amber-700' },
  { id: 'sarrasin', name: 'Sarrasin', emoji: '🌾', color: 'from-gray-700 to-gray-800' },
  { id: 'epautre', name: 'Épeautre', emoji: '🌾', color: 'from-yellow-800 to-orange-700' },
  { id: 'chataigne', name: 'Châtaigne', emoji: '🌰', color: 'from-amber-800 to-orange-900' },
  { id: 'riz', name: 'Riz', emoji: '🍚', color: 'from-slate-400 to-yellow-200' },
  { id: 'complete', name: 'Complète', emoji: '🌾', color: 'from-orange-900 to-amber-950' }
];

const INGREDIENTS_ORDER = [
  { id: 'flour', label: 'Farine', emoji: '🌾', hint: 'Choisis une farine' },
  { id: 'water', label: 'Eau', emoji: '💧', hint: 'Ajoute l\'eau' },
  { id: 'leaven', label: 'Levain', emoji: '🫧', hint: 'Ajoute le levain' },
  { id: 'salt', label: 'Sel', emoji: '🧂', hint: 'Ajoute le sel' },
];

export default function FermeBoulangerie() {
  const [recette, setRecette] = useState([]); // ingrédients ajoutés à la recette
  const [selectedFlour, setSelectedFlour] = useState(null);
  const [proofingTable, setProofingTable] = useState(Array(20).fill(null));
  const [ovenSlots, setOvenSlots] = useState(Array(20).fill(null));
  const [feedback, setFeedback] = useState(null);
  const [currentStage, setCurrentStage] = useState('idle'); // idle, proofing, heating, baking, done
  const [stageProgress, setStageProgress] = useState(0);
  const [woodPlaced, setWoodPlaced] = useState(0);
  const [completedLoaves, setCompletedLoaves] = useState(0);

  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ['user'], queryFn: () => base44.auth.me() });
  const { data: profiles } = useQuery({ queryKey: ['profiles'], queryFn: () => base44.entities.EcoProfile.list() });
  const profile = profiles?.[0];
  const { data: caisses } = useQuery({ queryKey: ['caisseFerme'], queryFn: () => base44.entities.CaisseFerme.list() });
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
      const updates = computeRewards(profile, { xp: montant, credits: montant, ferme_action: true });
      updateProfileMutation.mutate({ id: profile.id, data: updates });
      updateCaisseMutation.mutate({
        id: caisse.id,
        data: {
          total_credits: caisse.total_credits - montant,
          salaires_verses: (caisse.salaires_verses || 0) + montant,
          derniere_transaction: new Date().toISOString(),
          historique_transactions: [...(caisse.historique_transactions || []), { type: 'salaire', montant, eleve_email: user?.email || 'inconnu', description, date: new Date().toISOString() }]
        }
      });
    }
  };

  const showFeedback = (type, message) => { setFeedback({ type, message }); setTimeout(() => setFeedback(null), 2500); };

  // Timer progression
  React.useEffect(() => {
    if (currentStage === 'idle' || currentStage === 'done') return;
    const interval = setInterval(() => {
      setStageProgress(prev => {
        if (prev >= 100) {
          if (currentStage === 'proofing') {
            setCurrentStage('heating');
            showFeedback('success', '✅ Levée terminée ! Chauffe le four avec le bois');
            return 0;
          } else if (currentStage === 'heating') {
            setCurrentStage('baking');
            showFeedback('success', '🔥 Four chaud ! Enfourne les pains de la table');
            return 0;
          } else if (currentStage === 'baking') {
            const newOven = Array(20).fill(null);
            setOvenSlots(newOven);
            setCompletedLoaves(c => c + 20);
            setCurrentStage('done');
            payerTravail(40, 'Boulangerie: 20 pains cuits');
            showFeedback('success', '🥖 20 pains cuits ! +40 crédits');
            return 100;
          }
          return prev;
        }
        return prev + (100 / 60);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStage]);

  // ---- Étape 1 : Recette ----
  const nextIngredient = INGREDIENTS_ORDER[recette.length];

  const addIngredient = (type, extraData = {}) => {
    const expected = INGREDIENTS_ORDER[recette.length];
    if (!expected || expected.id !== type) {
      showFeedback('error', `❌ Ordre: Farine → Eau → Levain → Sel`);
      return;
    }
    setRecette(prev => [...prev, { type, ...extraData }]);
    if (type !== 'flour') showFeedback('success', `✅ ${INGREDIENTS_ORDER[recette.length].label} ajouté${type === 'salt' ? ' — Pâte prête !' : ''}`);
  };

  const resetRecette = () => { setRecette([]); setSelectedFlour(null); };

  // ---- Étape 2 : Placer pains sur table de pousse ----
  const placerPain = (idx) => {
    if (recette.length < 4) { showFeedback('error', '❌ Complète la recette d\'abord !'); return; }
    if (proofingTable[idx]) { showFeedback('error', '❌ Case déjà occupée'); return; }
    if (currentStage !== 'idle') { showFeedback('error', '❌ La levée est déjà en cours'); return; }

    const newTable = [...proofingTable];
    newTable[idx] = { flour: recette[0].flourId || 'ble' };
    setProofingTable(newTable);
    resetRecette();

    const filled = newTable.filter(Boolean).length;
    if (filled === 20) {
      setCurrentStage('proofing');
      setStageProgress(0);
      showFeedback('success', '🍞 20 pains mis à lever ! (60 sec)');
    } else {
      showFeedback('success', `📍 Pain placé (${filled}/20) — Prépare le suivant`);
    }
  };

  const placerTousPains = () => {
    if (recette.length < 4) { showFeedback('error', '❌ Complète la recette d\'abord !'); return; }
    if (currentStage !== 'idle') { showFeedback('error', '❌ La levée est déjà en cours'); return; }
    const flourId = recette[0].flourId || 'ble';
    const newTable = Array(20).fill({ flour: flourId });
    setProofingTable(newTable);
    resetRecette();
    setCurrentStage('proofing');
    setStageProgress(0);
    showFeedback('success', '🍞 20 pains mis à lever en une fois !');
  };

  // ---- Étape 3 : Chauffer le four ----
  const ajouterBois = () => {
    if (currentStage !== 'heating') { showFeedback('error', '⏳ Attends la fin de la levée'); return; }
    if (woodPlaced >= 20) { showFeedback('error', '✅ Four déjà rempli de bois'); return; }
    const newVal = Math.min(20, woodPlaced + 5);
    setWoodPlaced(newVal);
    if (newVal >= 20) showFeedback('success', '🔥 Four rempli ! En chauffe...');
    else showFeedback('success', `🪵 Bois ajouté (${newVal}/20)`);
  };

  const ajouterToutLeBois = () => {
    if (currentStage !== 'heating') return;
    setWoodPlaced(20);
    showFeedback('success', '🔥 Four rempli de bois !');
  };

  // ---- Étape 4 : Enfourner les pains ----
  const enfournerTout = () => {
    if (currentStage !== 'baking') { showFeedback('error', '⏳ Attends que le four soit chaud'); return; }
    const newOven = proofingTable.map(slot => slot ? { type: 'bread', flour: slot.flour } : null);
    setOvenSlots(newOven);
    setProofingTable(Array(20).fill(null));
    setCurrentStage('baking');
    showFeedback('success', '🥖 20 pains enfournés ! Cuisson en cours...');
  };

  // ---- Recommencer ----
  const recommencer = () => {
    setProofingTable(Array(20).fill(null));
    setOvenSlots(Array(20).fill(null));
    setCurrentStage('idle');
    setStageProgress(0);
    setWoodPlaced(0);
    setRecette([]);
    setSelectedFlour(null);
    showFeedback('success', '🔄 Nouvelle fournée !');
  };

  // Étapes visuelles
  const etapes = [
    { id: 'recipe', label: 'Préparer la pâte', done: currentStage !== 'idle' || proofingTable.some(Boolean), active: currentStage === 'idle' && !proofingTable.some(Boolean) },
    { id: 'proof', label: 'Levée (pousse)', done: ['heating', 'baking', 'done'].includes(currentStage), active: currentStage === 'proofing' },
    { id: 'heat', label: 'Chauffer le four', done: ['baking', 'done'].includes(currentStage), active: currentStage === 'heating' },
    { id: 'bake', label: 'Cuisson', done: currentStage === 'done', active: currentStage === 'baking' },
  ];

  const stageColors = {
    idle: 'bg-gray-600',
    proofing: 'bg-gradient-to-r from-green-500 to-emerald-400',
    heating: 'bg-gradient-to-r from-red-600 to-orange-400',
    baking: 'bg-gradient-to-r from-orange-500 to-yellow-400',
    done: 'bg-gradient-to-r from-yellow-400 to-amber-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-red-950">
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="pt-20 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <Link to={createPageUrl('MicroFerme')}>
            <Button variant="outline" className="mb-4 border-orange-400 text-orange-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-orange-300 mb-4 text-center">🥖 Boulangerie — Fournée</h1>

          {/* Progression globale */}
          <div className="mb-5 bg-orange-900/40 rounded-2xl p-4 border border-orange-400/30">
            <div className="flex justify-between mb-2">
              {etapes.map((e, i) => (
                <div key={e.id} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                    e.done ? 'bg-green-500 border-green-300 text-white' : e.active ? 'bg-orange-500 border-orange-200 text-white animate-pulse' : 'bg-white/10 border-white/20 text-white/40'
                  }`}>
                    {e.done ? '✓' : i + 1}
                  </div>
                  <div className={`text-[9px] text-center ${e.active ? 'text-orange-200' : e.done ? 'text-green-300' : 'text-white/30'}`}>{e.label}</div>
                </div>
              ))}
            </div>
            {currentStage !== 'idle' && currentStage !== 'done' && (
              <div className="mt-2">
                <div className="w-full h-6 bg-gray-900 rounded-full overflow-hidden border border-orange-500/50">
                  <motion.div className={`h-full rounded-full ${stageColors[currentStage]}`}
                    style={{ width: `${stageProgress}%` }} transition={{ duration: 0.5 }} />
                </div>
                <div className="text-center text-orange-300/70 text-xs mt-1">{Math.round(stageProgress)}% — environ {Math.round((100 - stageProgress) * 0.6)} sec</div>
              </div>
            )}
          </div>

          {/* ===== ÉTAPE 1 : RECETTE ===== */}
          {currentStage === 'idle' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-amber-900/30 rounded-2xl p-5 border border-amber-400/30 mb-5">
              <h3 className="text-lg font-bold text-amber-300 mb-4">🍞 Étape 1 — Préparer la pâte</h3>

              {/* Indicateur de progression de recette */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-black/20 rounded-xl">
                {INGREDIENTS_ORDER.map((ing, i) => {
                  const added = recette[i];
                  const isNext = i === recette.length;
                  return (
                    <React.Fragment key={ing.id}>
                      <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                        added ? 'bg-green-500/20 border-green-400' : isNext ? 'bg-orange-500/20 border-orange-300 animate-pulse' : 'bg-white/5 border-white/10 opacity-40'
                      }`}>
                        <span className="text-xl">{added ? '✅' : ing.emoji}</span>
                        <span className="text-[9px] text-orange-200">{ing.label}</span>
                      </div>
                      {i < 3 && <span className="text-orange-400/50 text-lg">→</span>}
                    </React.Fragment>
                  );
                })}
              </div>

              {nextIngredient?.id === 'flour' ? (
                <div>
                  <p className="text-amber-300/80 text-sm mb-3">👆 Choisis une farine :</p>
                  <div className="grid grid-cols-5 gap-2">
                    {FLOURS.map(flour => (
                      <button key={flour.id} onClick={() => { addIngredient('flour', { flourId: flour.id }); showFeedback('success', `✅ ${flour.name} ajoutée !`); }}
                        className={`p-2 rounded-xl bg-gradient-to-br ${flour.color} border-2 border-white/30 hover:scale-105 transition-all text-center`}>
                        <span className="text-xl block">{flour.emoji}</span>
                        <span className="text-white text-[9px] font-bold">{flour.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : nextIngredient ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-amber-300/80 text-sm">Ajoute maintenant : <strong className="text-white">{nextIngredient.emoji} {nextIngredient.label}</strong></p>
                  <div className="flex gap-4">
                    <button onClick={() => addIngredient(nextIngredient.id)}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 border-2 border-white/30 text-white font-bold text-lg shadow-xl hover:scale-105 transition-all">
                      {nextIngredient.emoji} Ajouter {nextIngredient.label}
                    </button>
                    <button onClick={resetRecette} className="px-4 py-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 text-sm">
                      🔄 Reset
                    </button>
                  </div>
                </div>
              ) : (
                // Recette complète — placer les pains
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🥣</div>
                    <p className="text-green-300 font-bold">Pâte prête ! Farine: {recette[0]?.flourId}</p>
                  </div>
                  <div className="flex gap-3 flex-col items-center">
                    <p className="text-amber-300/60 text-xs italic">
                      Tu peux choisir une farine différente pour chaque pain ! ({proofingTable.filter(Boolean).length}/20 posés)
                    </p>
                    <button onClick={() => { const idx = proofingTable.findIndex(s => !s); if (idx !== -1) placerPain(idx); }}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 border-2 border-white/30 text-white font-bold text-lg shadow-xl hover:scale-105 transition-all">
                      📍 Poser ce pain sur la table ({proofingTable.filter(Boolean).length + 1}/20)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ===== ÉTAPE 2 : TABLE DE POUSSE ===== */}
          {(currentStage === 'proofing' || (currentStage === 'idle' && proofingTable.some(Boolean))) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/30 rounded-2xl p-5 border border-green-400/30 mb-5">
              <h3 className="text-lg font-bold text-green-300 mb-3">
                🍞 Table de pousse — {proofingTable.filter(Boolean).length}/20 pains
                {currentStage === 'idle' && (
                  <span className="ml-3 text-sm text-amber-300/70 font-normal">
                    ← Prépare un nouveau pain ci-dessus et place-le ici
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-10 gap-1.5 mb-3">
                {proofingTable.map((slot, idx) => (
                  <motion.div key={idx} animate={slot && currentStage === 'proofing' ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
                    className={`h-10 w-full rounded-lg flex items-center justify-center text-lg border ${
                      slot ? 'bg-green-500/30 border-green-400' : currentStage === 'idle' && recette.length === 4 ? 'bg-orange-500/10 border-orange-400/40 cursor-pointer hover:bg-orange-500/20' : 'bg-white/5 border-white/10'
                    }`}
                    onClick={() => currentStage === 'idle' && recette.length === 4 && !slot && placerPain(idx)}
                  >
                    {slot ? '🍞' : currentStage === 'idle' && recette.length === 4 ? <span className="text-xs text-orange-400/60">+</span> : null}
                  </motion.div>
                ))}
              </div>
              {currentStage === 'proofing' && (
                <div className="text-green-300/70 text-sm text-center">⏳ Levée en cours... {Math.round(stageProgress)}%</div>
              )}
              {currentStage === 'idle' && proofingTable.filter(Boolean).length === 20 && (
                <div className="text-center mt-3">
                  <button onClick={() => { setCurrentStage('proofing'); setStageProgress(0); showFeedback('success', '🍞 20 pains mis à lever ! (60 sec)'); }}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 hover:scale-105 border-2 border-white/30 text-white font-bold text-lg shadow-xl transition-all">
                    ✅ Lancer la levée (20/20 pains prêts) !
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ===== ÉTAPE 3 : CHAUFFER LE FOUR ===== */}
          {currentStage === 'heating' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/30 rounded-2xl p-5 border border-red-400/30 mb-5">
              <h3 className="text-lg font-bold text-red-300 mb-3">🔥 Étape 3 — Chauffer le four avec du bois</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-6 bg-gray-900 rounded-full overflow-hidden border border-red-500/50">
                  <motion.div className="h-full bg-gradient-to-r from-orange-600 to-red-500 rounded-full"
                    animate={{ width: `${(woodPlaced / 20) * 100}%` }} transition={{ duration: 0.5 }} />
                </div>
                <span className="text-red-300 font-bold text-sm">{woodPlaced}/20 🪵</span>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={ajouterBois}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 border-2 border-white/30 text-white font-bold text-lg shadow-xl hover:scale-105 transition-all">
                  🪵 Ajouter du bois (+5)
                </button>
                <button onClick={ajouterToutLeBois}
                  className="px-6 py-4 rounded-2xl bg-red-500/20 hover:bg-red-500/40 border border-red-300 text-red-200 font-bold transition-all">
                  🔥 Tout remplir
                </button>
              </div>
            </motion.div>
          )}

          {/* ===== ÉTAPE 4 : ENFOURNER ===== */}
          {currentStage === 'baking' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-orange-900/30 rounded-2xl p-5 border border-orange-400/30 mb-5">
              <h3 className="text-lg font-bold text-orange-300 mb-3">🥖 Étape 4 — Enfourner les pains</h3>
              {!ovenSlots.some(Boolean) ? (
                <div className="text-center">
                  <button onClick={enfournerTout}
                    className="px-10 py-5 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 border-2 border-white/30 text-white font-bold text-xl shadow-2xl hover:scale-105 transition-all">
                    🥖 Enfourner les 20 pains !
                  </button>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-10 gap-1.5 mb-3">
                    {ovenSlots.map((slot, idx) => (
                      <motion.div key={idx} animate={slot ? { scale: [1, 1.08, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.05 }}
                        className={`h-10 w-full rounded-lg flex items-center justify-center text-lg border ${slot ? 'bg-orange-500/30 border-orange-400' : 'bg-white/5 border-white/10'}`}>
                        {slot ? '🥖' : null}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-orange-300/70 text-sm text-center">🔥 Cuisson en cours... {Math.round(stageProgress)}%</div>
                </div>
              )}
            </motion.div>
          )}

          {/* ===== TERMINÉ ===== */}
          {currentStage === 'done' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-900/30 rounded-2xl p-8 border-2 border-yellow-400/50 mb-5 text-center">
              <div className="text-7xl mb-4">🥖</div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-2">Fournée terminée !</h3>
              <p className="text-yellow-200/70 mb-2">20 pains cuits et envoyés à l'épicerie</p>
              <p className="text-green-300 font-bold text-lg mb-6">Total : {completedLoaves} pains • +40 crédits gagnés</p>
              <button onClick={recommencer}
                className="px-10 py-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 hover:scale-105 border-2 border-white/30 text-white font-bold text-lg shadow-xl transition-all">
                🔄 Nouvelle fournée
              </button>
            </motion.div>
          )}

          {/* Compteur */}
          <div className="text-center">
            <span className="inline-block bg-white/10 backdrop-blur-xl rounded-xl px-6 py-3 border border-orange-400/30 text-orange-300 font-bold">
              🥖 Pains cuits ce jour : {completedLoaves}
            </span>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className={`px-6 py-3 rounded-xl shadow-2xl border-2 text-white font-bold ${feedback.type === 'success' ? 'bg-green-600 border-green-300' : 'bg-red-600 border-red-300'}`}>
              {feedback.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}