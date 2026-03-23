import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Scissors } from 'lucide-react';
import { computeRewards } from '@/lib/rewardPlayer';
import { Button } from '@/components/ui/button';

const ARBRES = [
  { id: 'pommier', nom: 'Pommier', emoji: '🌳', fruit: '🍎', fruitsNom: 'Pommes', saison: 'automne', desc: 'Fruits en automne' },
  { id: 'poirier', nom: 'Poirier', emoji: '🌳', fruit: '🍐', fruitsNom: 'Poires', saison: 'automne', desc: 'Fruits en automne' },
  { id: 'cerisier', nom: 'Cerisier', emoji: '🌸', fruit: '🍒', fruitsNom: 'Cerises', saison: 'ete', desc: 'Fruits en été' },
  { id: 'prunier', nom: 'Prunier', emoji: '🌳', fruit: '🟣', fruitsNom: 'Prunes', saison: 'ete', desc: 'Fruits en été' },
  { id: 'noyer', nom: 'Noyer', emoji: '🌳', fruit: '🥜', fruitsNom: 'Noix', saison: 'automne', desc: 'Fruits en automne' },
  { id: 'chataignier', nom: 'Châtaignier', emoji: '🌳', fruit: '🌰', fruitsNom: 'Châtaignes', saison: 'automne', desc: 'Fruits en automne' }
];

const STAGES = ['🌱 Jeune plant', '🌿 Croissance', '🌲 Adulte', '🍎 Production'];
// Nombre de tailles requises pour passer au stade suivant
const TAILLES_REQUISES = [3, 3, 2]; // stade 0→1: 3 tailles, stade 1→2: 3 tailles, stade 2→3: 2 tailles

export default function FermeArboriculture() {
  const [verger, setVerger] = useState(Array(12).fill(null));
  const [selectedArbre, setSelectedArbre] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [stades, setStades] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [tailles, setTailles] = useState(0);
  const [recoltesFruits, setRecoltesFruits] = useState(0);

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

  const showFeedback = (type, message) => { setFeedback({ type, message }); setTimeout(() => setFeedback(null), 2000); };

  // Croissance automatique
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStades(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(key => {
          if (next[key].niveau < 100) { next[key] = { ...next[key], niveau: Math.min(100, next[key].niveau + 1) }; changed = true; }
        });
        return changed ? next : prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const planterArbre = (index) => {
    if (!selectedArbre || verger[index]) return;
    const newVerger = [...verger];
    newVerger[index] = { ...selectedArbre, plante_a: Date.now() };
    setVerger(newVerger);
    setStades(prev => ({ ...prev, [index]: { stade: 0, niveau: 0, taillesStade: 0 } }));
    setSelectedArbre(null);
    setSelectedSlot(null);
    showFeedback('success', `🌱 ${selectedArbre.nom} planté ! Il va grandir avec le temps.`);
  };

  const taillerArbre = (index) => {
    const stade = stades[index];
    if (!stade || stade.niveau < 30) { showFeedback('error', '⏳ L\'arbre doit avoir au moins 30% de croissance'); return; }
    if (stade.stade >= 3) { showFeedback('error', '❌ Un arbre en production ne se taille plus'); return; }
    const taillesStade = (stade.taillesStade || 0) + 1;
    const requises = TAILLES_REQUISES[stade.stade];
    setStades(prev => ({ ...prev, [index]: { ...prev[index], niveau: Math.min(100, prev[index].niveau + 20), taillesStade } }));
    setTailles(t => t + 1);
    payerTravail(3, `Arboriculture: taille ${verger[index]?.nom}`);
    showFeedback('success', `✂️ Taillé ! (${taillesStade}/${requises} tailles pour évoluer) +3 crédits`);
    setSelectedSlot(null);
  };

  const evoluerArbre = (index) => {
    const stade = stades[index];
    if (!stade || stade.niveau < 100 || stade.stade >= 3) return;
    const taillesStade = stade.taillesStade || 0;
    const requises = TAILLES_REQUISES[stade.stade];
    if (taillesStade < requises) {
      showFeedback('error', `✂️ Il faut ${requises} tailles pour évoluer (${taillesStade}/${requises})`);
      return;
    }
    setStades(prev => ({ ...prev, [index]: { stade: stade.stade + 1, niveau: 0, taillesStade: 0 } }));
    showFeedback('success', `🌳 ${verger[index]?.nom} a évolué → ${STAGES[stade.stade + 1]}`);
    setSelectedSlot(null);
  };

  const recolterFruits = (index) => {
    const arbre = verger[index];
    const stade = stades[index];
    if (!arbre || !stade || stade.stade !== 3 || stade.niveau < 100) { showFeedback('error', '⏳ L\'arbre doit être au stade Production avec 100%'); return; }
    setStades(prev => ({ ...prev, [index]: { stade: 3, niveau: 0 } }));
    setRecoltesFruits(r => r + 5);
    payerTravail(4, `Récolte: ${arbre.fruitsNom}`);
    showFeedback('success', `${arbre.fruit} ${arbre.fruitsNom} récoltées ! +5 paniers • +4 crédits`);
    setSelectedSlot(null);
  };

  const getArbreSize = (stade) => {
    if (!stade) return 'text-2xl';
    return ['text-2xl', 'text-4xl', 'text-5xl', 'text-5xl'][stade.stade] || 'text-2xl';
  };

  const arbreSelectionne = selectedSlot !== null ? verger[selectedSlot] : null;
  const stadeSelectionne = selectedSlot !== null ? stades[selectedSlot] : null;

  // Actions disponibles pour l'arbre sélectionné
  const canTailler = stadeSelectionne && stadeSelectionne.niveau >= 30 && stadeSelectionne.stade < 3;
  const taillesEffectuees = stadeSelectionne?.taillesStade || 0;
  const taillesRequises = stadeSelectionne ? (TAILLES_REQUISES[stadeSelectionne.stade] || 0) : 0;
  const taillesSuffisantes = taillesEffectuees >= taillesRequises;
  const canEvoluer = stadeSelectionne && stadeSelectionne.niveau >= 100 && stadeSelectionne.stade < 3 && taillesSuffisantes;
  const canRecolter = stadeSelectionne && stadeSelectionne.stade === 3 && stadeSelectionne.niveau >= 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-green-950 to-emerald-950">
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to={createPageUrl('MicroFerme')}>
            <Button variant="outline" className="mb-4 border-green-400 text-green-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-green-300 mb-4 text-center">🌳 Arboriculture - Verger</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <span className="text-3xl">🌳</span>
              <div className="text-green-300 text-xl font-bold">{verger.filter(a => a).length}/12</div>
              <div className="text-green-300/70 text-xs">Arbres plantés</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <Scissors className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <div className="text-blue-300 text-xl font-bold">{tailles}</div>
              <div className="text-blue-300/70 text-xs">Tailles effectuées</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <span className="text-3xl">🍎</span>
              <div className="text-orange-300 text-xl font-bold">{recoltesFruits}</div>
              <div className="text-orange-300/70 text-xs">Paniers récoltés</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            {/* Palette d'arbres */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-green-300 text-center">Arbres fruitiers</h3>
              <div className="space-y-2">
                {ARBRES.map(arbre => (
                  <button key={arbre.id}
                    onClick={() => { setSelectedArbre(selectedArbre?.id === arbre.id ? null : arbre); setSelectedSlot(null); }}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                      selectedArbre?.id === arbre.id
                        ? 'bg-green-500/40 border-green-200 ring-2 ring-green-300 shadow-lg'
                        : 'bg-white/5 border-white/20 hover:bg-green-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{arbre.emoji}</span>
                      <div>
                        <div className="text-green-200 text-xs font-bold">{arbre.nom}</div>
                        <div className="text-green-300/60 text-[9px]">{arbre.fruit} {arbre.fruitsNom}</div>
                        <div className="text-green-400/50 text-[9px]">{arbre.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {selectedArbre && (
                <div className="text-xs text-green-300 p-2 bg-green-900/30 rounded-lg border border-green-400/30 text-center">
                  👆 Clique sur un emplacement vide du verger
                </div>
              )}
            </div>

            {/* Verger */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold text-green-300 text-center mb-2">
                {selectedArbre ? `👆 Clique pour planter ${selectedArbre.emoji}` : selectedSlot !== null ? `🎯 ${arbreSelectionne?.nom} sélectionné — choisis une action` : 'Verger (3×4) — Clique sur un arbre pour agir'}
              </h3>

              <div className="grid grid-cols-3 gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-green-400/30 mb-4">
                {verger.map((arbre, idx) => {
                  const stade = stades[idx];
                  const niveau = stade?.niveau || 0;
                  const isReady = niveau >= 100;
                  const canEvolveThis = isReady && stade?.stade < 3;
                  const canHarvestThis = isReady && stade?.stade === 3;
                  const canTailleThis = niveau >= 30 && stade?.stade < 3;
                  const taillesThis = stade?.taillesStade || 0;
                  const taillesReqThis = stade ? (TAILLES_REQUISES[stade.stade] || 0) : 0;
                  const isSelected = selectedSlot === idx;

                  return (
                    <motion.button key={idx}
                      onClick={() => {
                        if (!arbre && selectedArbre) { planterArbre(idx); return; }
                        if (arbre) setSelectedSlot(isSelected ? null : idx);
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                        isSelected ? 'border-white shadow-xl shadow-white/20'
                        : !arbre
                        ? selectedArbre ? 'bg-green-500/15 border-green-400/40 hover:bg-green-500/25 cursor-pointer' : 'bg-white/5 border-white/20'
                        : canHarvestThis ? 'bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border-orange-300 animate-pulse'
                        : canEvolveThis ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-300'
                        : 'bg-gradient-to-br from-green-800/40 to-emerald-800/40 border-green-500/60'
                      }`}
                    >
                      {arbre ? (
                        <>
                          <div className={`${getArbreSize(stade)} mb-1 z-10 transition-all duration-500`}>
                            {stade?.stade === 3 ? arbre.fruit : arbre.emoji}
                          </div>
                          <div className="text-[9px] text-green-300/70 z-10">{STAGES[stade?.stade || 0].split(' ').slice(1).join(' ')}</div>
                          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
                            <div className={`h-full transition-all ${canHarvestThis ? 'bg-orange-400' : canEvolveThis ? 'bg-green-300' : 'bg-green-500'}`} style={{ width: `${niveau}%` }} />
                          </div>
                          {canHarvestThis && <div className="absolute top-1.5 right-1.5 text-base">🍎</div>}
                          {canEvolveThis && <div className="absolute top-1.5 right-1.5 text-base">⬆️</div>}
                          {canTailleThis && <div className="absolute top-1.5 left-1.5"><Scissors className="w-3.5 h-3.5 text-blue-400" /></div>}
                          {isSelected && <div className="absolute inset-0 bg-white/10 rounded-2xl border-2 border-white pointer-events-none" />}
                        </>
                      ) : selectedArbre ? (
                        <div className="text-center">
                          <div className="text-2xl opacity-40">{selectedArbre.emoji}</div>
                          <div className="text-green-300/60 text-[9px]">Planter ici</div>
                        </div>
                      ) : (
                        <div className="text-white/20 text-2xl">🟫</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Panneau d'actions */}
              <AnimatePresence>
                {selectedSlot !== null && arbreSelectionne && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="bg-green-900/40 backdrop-blur-xl rounded-2xl p-4 border-2 border-green-400/40">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{stadeSelectionne?.stade === 3 ? arbreSelectionne.fruit : arbreSelectionne.emoji}</span>
                      <div>
                        <div className="font-bold text-green-200 text-lg">{arbreSelectionne.nom}</div>
                        <div className="text-xs text-green-300/70">
                          {STAGES[stadeSelectionne?.stade || 0]} &nbsp;•&nbsp; Croissance : {Math.round(stadeSelectionne?.niveau || 0)}%
                        </div>
                      </div>
                      <button onClick={() => setSelectedSlot(null)} className="ml-auto text-green-300/50 hover:text-green-300 text-xl">✕</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => taillerArbre(selectedSlot)} disabled={!canTailler}
                        className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/40 border border-blue-400/40 text-center disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <div className="text-2xl mb-1">✂️</div>
                        <div className="text-blue-300 text-xs font-bold">Tailler</div>
                        <div className={`text-[10px] font-bold ${taillesSuffisantes ? 'text-green-400' : 'text-orange-300'}`}>
                          {taillesEffectuees}/{taillesRequises} tailles
                        </div>
                        <div className="text-yellow-300/70 text-[9px]">+3 crédits</div>
                      </button>
                      <button onClick={() => evoluerArbre(selectedSlot)} disabled={!canEvoluer}
                        className={`p-3 rounded-xl border text-center disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
                          canEvoluer ? 'bg-emerald-500/40 hover:bg-emerald-500/60 border-emerald-300 animate-pulse' : 'bg-emerald-500/20 border-emerald-400/40'
                        }`}>
                        <div className="text-2xl mb-1">⬆️</div>
                        <div className="text-emerald-300 text-xs font-bold">Faire évoluer</div>
                        <div className="text-emerald-300/60 text-[9px]">
                          {stadeSelectionne?.niveau >= 100 && !taillesSuffisantes
                            ? `Taille encore (${taillesEffectuees}/${taillesRequises})`
                            : '100% + tailles ok'}
                        </div>
                        <div className="text-yellow-300/70 text-[9px]">Gratuit</div>
                      </button>
                      <button onClick={() => recolterFruits(selectedSlot)} disabled={!canRecolter}
                        className="p-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/40 border border-orange-400/40 text-center disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <div className="text-2xl mb-1">{arbreSelectionne.fruit}</div>
                        <div className="text-orange-300 text-xs font-bold">Récolter</div>
                        <div className="text-orange-300/60 text-[9px]">{arbreSelectionne.fruitsNom}</div>
                        <div className="text-yellow-300/70 text-[9px]">+4 crédits</div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Légende */}
              <div className="mt-3 flex flex-wrap gap-2 justify-center text-[10px] text-green-300/50">
                <span>🌱 Jeune → 🌿 Croissance → 🌲 Adulte → 🍎 Production</span>
              </div>
            </div>
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