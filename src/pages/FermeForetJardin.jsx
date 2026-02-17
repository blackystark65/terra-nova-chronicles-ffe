import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STRATES = [
  { 
    id: 'canopee', 
    nom: 'Canopée', 
    emoji: '🌳', 
    niveau: 5,
    plantes: [
      { id: 'chene', nom: 'Chêne', emoji: '🌳' },
      { id: 'hetre', nom: 'Hêtre', emoji: '🌳' },
      { id: 'noyer', nom: 'Noyer', emoji: '🌳' }
    ]
  },
  { 
    id: 'arbres', 
    nom: 'Arbres', 
    emoji: '🌲', 
    niveau: 4,
    plantes: [
      { id: 'pommier', nom: 'Pommier', emoji: '🍎' },
      { id: 'cerisier', nom: 'Cerisier', emoji: '🍒' },
      { id: 'prunier', nom: 'Prunier', emoji: '🟣' }
    ]
  },
  { 
    id: 'arbustes', 
    nom: 'Arbustes', 
    emoji: '🌿', 
    niveau: 3,
    plantes: [
      { id: 'noisetier', nom: 'Noisetier', emoji: '🌰' },
      { id: 'groseillier', nom: 'Groseillier', emoji: '🔴' },
      { id: 'framboisier', nom: 'Framboisier', emoji: '🍇' }
    ]
  },
  { 
    id: 'herbacees', 
    nom: 'Herbacées', 
    emoji: '🌾', 
    niveau: 2,
    plantes: [
      { id: 'consoude', nom: 'Consoude', emoji: '🌿' },
      { id: 'ortie', nom: 'Ortie', emoji: '🌿' },
      { id: 'rhubarbe', nom: 'Rhubarbe', emoji: '🥬' }
    ]
  },
  { 
    id: 'couvre_sol', 
    nom: 'Couvre-sol', 
    emoji: '🍓', 
    niveau: 1,
    plantes: [
      { id: 'fraisier', nom: 'Fraisier', emoji: '🍓' },
      { id: 'trefle', nom: 'Trèfle', emoji: '🍀' },
      { id: 'lierre', nom: 'Lierre', emoji: '🌿' }
    ]
  }
];

export default function FermeForetJardin() {
  const [guildes, setGuildes] = useState(Array(6).fill(null).map(() => Array(5).fill(null)));
  const [selectedPlante, setSelectedPlante] = useState(null);
  const [selectedStrate, setSelectedStrate] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [biodiversite, setBiodiversite] = useState(0);

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

  React.useEffect(() => {
    // Calculer la biodiversité basée sur la diversité des guildes
    let score = 0;
    guildes.forEach(guilde => {
      const stratesPresentes = new Set(guilde.filter(p => p).map(p => p.niveau));
      score += stratesPresentes.size * 5;
    });
    setBiodiversite(score);
  }, [guildes]);

  const planterDansGuilde = (guildeIndex, strateIndex) => {
    if (!selectedPlante || guildes[guildeIndex][strateIndex]) return;

    // Vérifier que c'est la bonne strate
    if (selectedPlante.niveau !== STRATES[strateIndex].niveau) {
      setFeedback({ type: 'error', message: `❌ Cette plante va dans la strate: ${STRATES.find(s => s.niveau === selectedPlante.niveau).nom}` });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    const newGuildes = [...guildes];
    newGuildes[guildeIndex][strateIndex] = selectedPlante;
    setGuildes(newGuildes);
    
    setSelectedPlante(null);
    
    // Bonus si la guilde est complète
    const guildeComplete = newGuildes[guildeIndex].every(p => p !== null);
    setFeedback({ 
      type: 'success', 
      message: guildeComplete ? '🎉 Guilde complète ! +50 biodiversité' : `${selectedPlante.emoji} Planté !`
    });
    setTimeout(() => setFeedback(null), 1500);
  };

  const retirerPlante = (guildeIndex, strateIndex) => {
    if (!guildes[guildeIndex][strateIndex]) return;

    const newGuildes = [...guildes];
    newGuildes[guildeIndex][strateIndex] = null;
    setGuildes(newGuildes);
    
    setFeedback({ type: 'success', message: '🗑️ Plante retirée' });
    setTimeout(() => setFeedback(null), 1000);
  };

  const totalPlantes = guildes.flat().filter(p => p).length;
  const guildesCompletes = guildes.filter(g => g.every(p => p !== null)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950">
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <Link to={createPageUrl('MicroFerme')}>
            <Button variant="outline" className="mb-4 border-green-400 text-green-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-green-300 mb-6 text-center">
            🌳 Forêt-Jardin - Guildes Végétales
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/30 text-center">
              <span className="text-4xl block mb-2">🌱</span>
              <div className="text-green-300 text-2xl font-bold">{totalPlantes}/30</div>
              <div className="text-green-300/70 text-xs">Plantes installées</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/30 text-center">
              <span className="text-4xl block mb-2">🎯</span>
              <div className="text-emerald-300 text-2xl font-bold">{guildesCompletes}/6</div>
              <div className="text-emerald-300/70 text-xs">Guildes complètes</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/30 text-center">
              <span className="text-4xl block mb-2">🦋</span>
              <div className="text-teal-300 text-2xl font-bold">{biodiversite}</div>
              <div className="text-teal-300/70 text-xs">Score biodiversité</div>
            </div>
          </div>

          {/* Palette de strates et plantes */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-green-400/30 mb-6">
            <h3 className="text-sm font-bold text-green-300 mb-3 text-center">Sélectionne une plante</h3>
            <div className="space-y-3">
              {STRATES.map((strate, idx) => (
                <div key={strate.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{strate.emoji}</span>
                    <span className="text-green-300 text-xs font-bold">{strate.nom}</span>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                    {strate.plantes.map(plante => (
                      <button
                        key={plante.id}
                        onClick={() => setSelectedPlante(selectedPlante?.id === plante.id ? null : { ...plante, niveau: strate.niveau })}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                          selectedPlante?.id === plante.id 
                            ? 'bg-green-500/40 border-green-300 ring-2 ring-green-400 shadow-lg scale-110' 
                            : 'bg-white/5 border-white/20 hover:bg-green-500/20'
                        }`}
                      >
                        <span className="text-2xl">{plante.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guildes 6x5 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30">
            <h3 className="text-lg font-bold text-green-300 mb-4 text-center">
              6 Guildes - 5 Strates chacune
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {guildes.map((guilde, guildeIdx) => {
                const isComplete = guilde.every(p => p !== null);
                return (
                  <motion.div
                    key={guildeIdx}
                    className={`bg-gradient-to-br ${
                      isComplete 
                        ? 'from-green-500/30 to-emerald-500/30 border-green-400' 
                        : 'from-green-900/30 to-emerald-900/30 border-green-600/50'
                    } border-2 rounded-xl p-4 relative`}
                  >
                    <div className="text-green-300 text-sm font-bold mb-3 text-center">
                      Guilde {guildeIdx + 1}
                      {isComplete && <span className="ml-2">✅</span>}
                    </div>
                    <div className="space-y-2">
                      {STRATES.map((strate, strateIdx) => {
                        const plante = guilde[strateIdx];
                        return (
                          <motion.button
                            key={strateIdx}
                            onClick={() => {
                              if (plante) {
                                retirerPlante(guildeIdx, strateIdx);
                              } else if (selectedPlante) {
                                planterDansGuilde(guildeIdx, strateIdx);
                              }
                            }}
                            whileHover={{ scale: 1.05 }}
                            className={`w-full h-12 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                              plante
                                ? 'bg-green-500/30 border-green-400 cursor-pointer hover:bg-red-500/30'
                                : selectedPlante && selectedPlante.niveau === strate.niveau
                                ? 'bg-green-500/20 border-green-400 cursor-pointer hover:bg-green-500/40 animate-pulse'
                                : 'bg-white/5 border-white/20'
                            }`}
                          >
                            <span className="text-xl">{strate.emoji}</span>
                            {plante ? (
                              <>
                                <span className="text-2xl">{plante.emoji}</span>
                                <span className="text-[10px] text-green-300">{plante.nom}</span>
                              </>
                            ) : (
                              <span className="text-[10px] text-white/40">{strate.nom}</span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-green-300 text-center mt-4 space-y-1">
            <div>🌳 Forêt-Jardin : 5 strates végétales en synergie</div>
            <div>💡 Chaque guilde complète crée un mini-écosystème autonome</div>
          </div>
        </div>
      </main>

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