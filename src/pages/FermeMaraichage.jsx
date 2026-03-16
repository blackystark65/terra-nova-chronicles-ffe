import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Droplet, Sun, Scissors } from 'lucide-react';
import { computeRewards } from '@/lib/rewardPlayer';
import { Button } from '@/components/ui/button';

const LEGUMES = [
  { id: 'tomate', nom: 'Tomate', emoji: '🍅', type: 'fruit', compagnons: ['basilic', 'carotte'], duree: 3 },
  { id: 'carotte', nom: 'Carotte', emoji: '🥕', type: 'racine', compagnons: ['tomate', 'poireau'], duree: 2 },
  { id: 'salade', nom: 'Salade', emoji: '🥬', type: 'feuille', compagnons: ['radis', 'fraise'], duree: 1 },
  { id: 'radis', nom: 'Radis', emoji: '🌱', type: 'racine', compagnons: ['salade', 'carotte'], duree: 1 },
  { id: 'courgette', nom: 'Courgette', emoji: '🥒', type: 'fruit', compagnons: ['basilic', 'mais'], duree: 2 },
  { id: 'poireau', nom: 'Poireau', emoji: '🧅', type: 'bulbe', compagnons: ['carotte', 'celeri'], duree: 3 },
  { id: 'basilic', nom: 'Basilic', emoji: '🌿', type: 'aromate', compagnons: ['tomate', 'courgette'], duree: 2 },
  { id: 'mais', nom: 'Maïs', emoji: '🌽', type: 'cereale', compagnons: ['haricot', 'courge'], duree: 3 },
  { id: 'haricot', nom: 'Haricot', emoji: '🫘', type: 'legumineuse', compagnons: ['mais', 'courge'], duree: 2 },
  { id: 'courge', nom: 'Courge', emoji: '🎃', type: 'fruit', compagnons: ['mais', 'haricot'], duree: 3 }
];

const OUTILS = [
  { id: 'planter', label: 'Planter', emoji: '🌱', desc: 'Sélectionne un légume puis une parcelle' },
  { id: 'arroser', label: 'Arroser', emoji: '💧', desc: 'Clique sur une parcelle pour l\'arroser' },
  { id: 'recolter', label: 'Récolter', emoji: '🧺', desc: 'Clique sur une parcelle prête (✅)' },
  { id: 'arracher', label: 'Arracher', emoji: '🗑️', desc: 'Retire une plante de la parcelle' },
];

export default function FermeMaraichage() {
  const [parcelles, setParcelles] = useState(Array(16).fill(null));
  const [selectedLegume, setSelectedLegume] = useState(null);
  const [outilActif, setOutilActif] = useState('planter');
  const [croissance, setCroissance] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [waterLevel, setWaterLevel] = useState(100);
  const [recoltes, setRecoltes] = useState(0);

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

  // Croissance automatique toutes les secondes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCroissance(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(key => {
          if (next[key] < 100) { next[key] = Math.min(100, next[key] + 2); changed = true; }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getVoisins = (index) => {
    const voisins = [];
    const row = Math.floor(index / 4), col = index % 4;
    if (col > 0) voisins.push(index - 1);
    if (col < 3) voisins.push(index + 1);
    if (row > 0) voisins.push(index - 4);
    if (row < 3) voisins.push(index + 4);
    return voisins;
  };

  const handleParcelleClick = (idx) => {
    const parcelle = parcelles[idx];
    const progress = croissance[idx] || 0;

    if (outilActif === 'planter') {
      if (!parcelle && selectedLegume) {
        const newParcelles = [...parcelles];
        newParcelles[idx] = { ...selectedLegume, plante_a: Date.now() };
        setParcelles(newParcelles);
        setCroissance(prev => ({ ...prev, [idx]: 0 }));
        const voisins = getVoisins(idx);
        const bonus = voisins.some(v => parcelles[v] && selectedLegume.compagnons.includes(parcelles[v].id));
        showFeedback('success', bonus ? `✅ Bon compagnonnage ! ${selectedLegume.nom} planté` : `✅ ${selectedLegume.nom} planté !`);
      } else if (!selectedLegume) {
        showFeedback('error', '👆 Sélectionne d\'abord un légume dans la liste');
      } else {
        showFeedback('error', '❌ Cette parcelle est déjà occupée');
      }
    } else if (outilActif === 'arroser') {
      if (!parcelle) { showFeedback('error', '❌ Pas de plante ici'); return; }
      if (waterLevel < 5) { showFeedback('error', '💧 Plus d\'eau !'); return; }
      setWaterLevel(w => w - 5);
      setCroissance(prev => ({ ...prev, [idx]: Math.min(100, (prev[idx] || 0) + 15) }));
      showFeedback('success', '💧 Parcelle arrosée ! +15% de croissance');
    } else if (outilActif === 'recolter') {
      if (!parcelle) { showFeedback('error', '❌ Pas de plante ici'); return; }
      if (progress < 100) { showFeedback('error', `⏳ Pas encore prête (${progress}%)`); return; }
      const newParcelles = [...parcelles];
      newParcelles[idx] = null;
      setParcelles(newParcelles);
      setCroissance(prev => { const n = { ...prev }; delete n[idx]; return n; });
      setRecoltes(r => r + 1);
      payerTravail(2, `Maraîchage: récolte ${parcelle.nom}`);
      showFeedback('success', `🧺 ${parcelle.emoji} ${parcelle.nom} récolté ! +2 crédits`);
    } else if (outilActif === 'arracher') {
      if (!parcelle) { showFeedback('error', '❌ Pas de plante ici'); return; }
      const newParcelles = [...parcelles];
      newParcelles[idx] = null;
      setParcelles(newParcelles);
      setCroissance(prev => { const n = { ...prev }; delete n[idx]; return n; });
      showFeedback('success', `🗑️ ${parcelle.nom} arraché`);
    }
  };

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 2000);
  };

  const outilInfo = OUTILS.find(o => o.id === outilActif);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-lime-950">
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to={createPageUrl('MicroFerme')}>
            <Button variant="outline" className="mb-4 border-green-400 text-green-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-green-300 mb-4 text-center">👨‍🌾 Maraîchage - Milpa & Jouale</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <Droplet className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <div className={`text-xl font-bold ${waterLevel < 20 ? 'text-red-400' : 'text-blue-300'}`}>{Math.round(waterLevel)}%</div>
              <div className="text-blue-300/70 text-xs">Réserve d'eau</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <div className="text-yellow-300 text-xl font-bold">{parcelles.filter(p => p).length}/16</div>
              <div className="text-yellow-300/70 text-xs">Parcelles cultivées</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <span className="text-3xl">🧺</span>
              <div className="text-green-300 text-xl font-bold">{recoltes}</div>
              <div className="text-green-300/70 text-xs">Récoltes</div>
            </div>
          </div>

          {/* Barre d'outils claire */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-green-400/20 mb-5">
            <div className="text-xs text-green-300/70 mb-3 text-center font-semibold">🛠️ CHOISIR UN OUTIL</div>
            <div className="grid grid-cols-4 gap-2">
              {OUTILS.map(outil => (
                <button
                  key={outil.id}
                  onClick={() => { setOutilActif(outil.id); if (outil.id !== 'planter') setSelectedLegume(null); }}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    outilActif === outil.id
                      ? 'bg-green-500/40 border-green-300 shadow-lg shadow-green-500/30'
                      : 'bg-white/5 border-white/20 hover:bg-green-500/20 hover:border-green-400/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{outil.emoji}</div>
                  <div className="text-green-200 text-xs font-semibold">{outil.label}</div>
                </button>
              ))}
            </div>
            <div className="mt-3 text-center text-xs text-green-300/80 bg-green-900/30 rounded-lg p-2">
              <span className="font-bold">{outilInfo?.emoji} {outilInfo?.label} :</span> {outilInfo?.desc}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            {/* Palette de légumes — visible seulement en mode planter */}
            <div className={`space-y-2 transition-opacity ${outilActif !== 'planter' ? 'opacity-40 pointer-events-none' : ''}`}>
              <h3 className="text-sm font-bold text-green-300 text-center">Légumes à planter</h3>
              <div className="grid grid-cols-2 gap-2">
                {LEGUMES.map(legume => (
                  <button
                    key={legume.id}
                    onClick={() => setSelectedLegume(selectedLegume?.id === legume.id ? null : legume)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedLegume?.id === legume.id
                        ? 'bg-green-500/50 border-green-200 ring-2 ring-green-300 shadow-lg shadow-green-500/50 scale-105'
                        : 'bg-white/5 border-white/20 hover:bg-green-500/20'
                    }`}
                  >
                    <div className="text-3xl mb-1">{legume.emoji}</div>
                    <div className="text-green-200 text-[10px] font-semibold">{legume.nom}</div>
                  </button>
                ))}
              </div>
              {selectedLegume && (
                <div className="text-xs text-green-300 p-2 bg-green-900/30 rounded-lg border border-green-400/30">
                  <div className="font-bold">🤝 Compagnons :</div>
                  <div>{selectedLegume.compagnons.join(', ')}</div>
                </div>
              )}
              {outilActif === 'planter' && !selectedLegume && (
                <div className="text-xs text-green-400/60 text-center p-2">👆 Sélectionne un légume</div>
              )}
            </div>

            {/* Parcelles 4x4 */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold text-green-300 text-center mb-2">
                Parcelles — {outilActif === 'planter' ? '🌱 Clique pour planter' : outilActif === 'arroser' ? '💧 Clique pour arroser' : outilActif === 'recolter' ? '🧺 Clique sur les ✅ pour récolter' : '🗑️ Clique pour arracher'}
              </h3>
              <div className="grid grid-cols-4 gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-green-400/30">
                {parcelles.map((parcelle, idx) => {
                  const progress = croissance[idx] || 0;
                  const isReady = progress >= 100;
                  const isWatered = progress > 0 && progress < 100;

                  let borderClass = 'border-white/20';
                  let bgClass = 'bg-white/5';
                  let cursor = 'cursor-default';

                  if (!parcelle) {
                    if (outilActif === 'planter' && selectedLegume) { bgClass = 'bg-green-500/15 hover:bg-green-500/30'; borderClass = 'border-green-400/50 hover:border-green-300'; cursor = 'cursor-pointer'; }
                  } else {
                    if (isReady) { bgClass = 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30'; borderClass = 'border-yellow-300'; cursor = 'cursor-pointer'; }
                    else { bgClass = 'bg-gradient-to-br from-green-800/40 to-emerald-800/40'; borderClass = 'border-green-500/60'; cursor = 'cursor-pointer'; }
                    if (outilActif === 'arroser' && parcelle) { borderClass = 'border-blue-400 hover:border-blue-200'; }
                    if (outilActif === 'arracher' && parcelle) { borderClass = 'border-red-400/60 hover:border-red-300'; }
                  }

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleParcelleClick(idx)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all ${bgClass} ${borderClass} ${cursor}`}
                    >
                      {parcelle ? (
                        <>
                          <div className="text-3xl z-10">{parcelle.emoji}</div>
                          <div className="text-[9px] text-green-300/70 z-10">{parcelle.nom}</div>
                          {/* Barre de croissance */}
                          <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
                            <motion.div
                              className={`h-full ${isReady ? 'bg-yellow-400' : 'bg-green-400'}`}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          {isReady && <div className="absolute top-1 right-1 text-sm">✅</div>}
                          {outilActif === 'arroser' && !isReady && (
                            <div className="absolute inset-0 bg-blue-500/10 flex items-end justify-center pb-3">
                              <span className="text-[10px] text-blue-300">{progress}%</span>
                            </div>
                          )}
                        </>
                      ) : outilActif === 'planter' && selectedLegume ? (
                        <div className="text-center">
                          <div className="text-2xl opacity-40">{selectedLegume.emoji}</div>
                          <div className="text-green-300/60 text-[9px]">Planter ici</div>
                        </div>
                      ) : (
                        <div className="text-white/20 text-2xl">🟫</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Bouton arroser tout */}
              {outilActif === 'arroser' && parcelles.some(p => p) && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    if (waterLevel < 20) { showFeedback('error', '💧 Pas assez d\'eau pour arroser tout !'); return; }
                    const newCroissance = { ...croissance };
                    parcelles.forEach((p, idx) => { if (p && (newCroissance[idx] || 0) < 100) newCroissance[idx] = Math.min(100, (newCroissance[idx] || 0) + 10); });
                    setCroissance(newCroissance);
                    setWaterLevel(w => Math.max(0, w - 20));
                    showFeedback('success', '💧 Toutes les parcelles arrosées ! (-20% eau)');
                  }}
                  className="mt-3 w-full py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-300 text-sm font-bold transition-all"
                >
                  💧 Arroser toutes les parcelles (-20% eau)
                </motion.button>
              )}

              {/* Bouton récolter tout */}
              {outilActif === 'recolter' && parcelles.some((p, idx) => p && (croissance[idx] || 0) >= 100) && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    let count = 0;
                    const newParcelles = [...parcelles];
                    const newCroissance = { ...croissance };
                    parcelles.forEach((p, idx) => {
                      if (p && (croissance[idx] || 0) >= 100) {
                        newParcelles[idx] = null;
                        delete newCroissance[idx];
                        count++;
                      }
                    });
                    setParcelles(newParcelles);
                    setCroissance(newCroissance);
                    setRecoltes(r => r + count);
                    payerTravail(count * 2, `Maraîchage: récolte de ${count} légumes`);
                    showFeedback('success', `🧺 ${count} légumes récoltés ! +${count * 2} crédits`);
                  }}
                  className="mt-3 w-full py-3 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/40 text-yellow-300 text-sm font-bold transition-all"
                >
                  🧺 Récolter tous les légumes prêts
                </motion.button>
              )}
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