import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Droplet, Sun } from 'lucide-react';
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

export default function FermeMaraichage() {
  const [parcelles, setParcelles] = useState(Array(16).fill(null));
  const [selectedLegume, setSelectedLegume] = useState(null);
  const [croissance, setCroissance] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [waterLevel, setWaterLevel] = useState(100);
  const [recoltes, setRecoltes] = useState(0);

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

  // Faire pousser automatiquement
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCroissance(prev => {
        const next = { ...prev };
        let anyChange = false;
        
        Object.keys(next).forEach(key => {
          if (next[key] < 100) {
            next[key] = Math.min(100, next[key] + 2);
            anyChange = true;
          }
        });
        
        return anyChange ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const planterLegume = (parcelleIndex) => {
    if (!selectedLegume || parcelles[parcelleIndex]) return;

    const newParcelles = [...parcelles];
    newParcelles[parcelleIndex] = { ...selectedLegume, plante_a: Date.now() };
    setParcelles(newParcelles);
    
    setCroissance(prev => ({ ...prev, [parcelleIndex]: 0 }));
    setSelectedLegume(null);
    
    // Bonus de compagnonnage
    const voisins = getVoisins(parcelleIndex);
    const bonus = voisins.some(v => parcelles[v] && selectedLegume.compagnons.includes(parcelles[v].id));
    
    setFeedback({ 
      type: 'success', 
      message: bonus ? '✅ Bon compagnonnage ! +10% croissance' : '✅ Légume planté !' 
    });
    setTimeout(() => setFeedback(null), 1500);
  };

  const arroser = (parcelleIndex) => {
    if (!parcelles[parcelleIndex] || waterLevel < 5) return;
    
    setWaterLevel(waterLevel - 5);
    setCroissance(prev => ({ ...prev, [parcelleIndex]: Math.min(100, prev[parcelleIndex] + 10) }));
    
    setFeedback({ type: 'success', message: '💧 Arrosé !' });
    setTimeout(() => setFeedback(null), 1000);
  };

  const recolter = (parcelleIndex) => {
    if (!parcelles[parcelleIndex] || croissance[parcelleIndex] < 100) return;

    const newParcelles = [...parcelles];
    newParcelles[parcelleIndex] = null;
    setParcelles(newParcelles);
    
    setCroissance(prev => {
      const next = { ...prev };
      delete next[parcelleIndex];
      return next;
    });
    
    setRecoltes(recoltes + 1);
    
    // Payer pour la récolte
    payerTravail(2, 'Maraîchage: récolte d\'un légume');
    
    setFeedback({ type: 'success', message: '🥬 Récolté ! +2 crédits' });
    setTimeout(() => setFeedback(null), 1000);
  };

  const getVoisins = (index) => {
    const voisins = [];
    const row = Math.floor(index / 4);
    const col = index % 4;
    
    if (col > 0) voisins.push(index - 1);
    if (col < 3) voisins.push(index + 1);
    if (row > 0) voisins.push(index - 4);
    if (row < 3) voisins.push(index + 4);
    
    return voisins;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-lime-950">
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link to={createPageUrl('MicroFerme')}>
            <Button variant="outline" className="mb-4 border-green-400 text-green-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-green-300 mb-6 text-center">
            👨‍🌾 Maraîchage - Milpa & Jouale
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/30 text-center">
              <Droplet className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-blue-300 text-2xl font-bold">{waterLevel}%</div>
              <div className="text-blue-300/70 text-xs">Eau disponible</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/30 text-center">
              <Sun className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-yellow-300 text-2xl font-bold">{parcelles.filter(p => p).length}/16</div>
              <div className="text-yellow-300/70 text-xs">Parcelles cultivées</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/30 text-center">
              <span className="text-4xl">🥬</span>
              <div className="text-green-300 text-2xl font-bold">{recoltes}</div>
              <div className="text-green-300/70 text-xs">Récoltes</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            {/* Palette de légumes */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-green-300 text-center">Légumes</h3>
              <div className="grid grid-cols-2 gap-2">
                {LEGUMES.map(legume => (
                  <button
                    key={legume.id}
                    onClick={() => setSelectedLegume(selectedLegume?.id === legume.id ? null : legume)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedLegume?.id === legume.id 
                        ? 'bg-green-500/40 border-green-300 ring-2 ring-green-400 shadow-lg' 
                        : 'bg-white/5 border-white/20 hover:bg-green-500/20'
                    }`}
                  >
                    <div className="text-3xl mb-1">{legume.emoji}</div>
                    <div className="text-green-200 text-[10px] font-semibold">{legume.nom}</div>
                  </button>
                ))}
              </div>
              {selectedLegume && (
                <div className="text-xs text-green-300 mt-2 p-2 bg-green-900/30 rounded-lg">
                  <div className="font-bold">Compagnons:</div>
                  <div>{selectedLegume.compagnons.join(', ')}</div>
                </div>
              )}
            </div>

            {/* Parcelles 4x4 */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold text-green-300 text-center mb-2">Parcelles (4×4)</h3>
              <div className="grid grid-cols-4 gap-3 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-green-400/30">
                {parcelles.map((parcelle, idx) => {
                  const progress = croissance[idx] || 0;
                  const isReady = progress >= 100;
                  
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        if (!parcelle && selectedLegume) {
                          planterLegume(idx);
                        } else if (parcelle && progress < 100) {
                          arroser(idx);
                        } else if (isReady) {
                          recolter(idx);
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center relative overflow-hidden ${
                        !parcelle 
                          ? selectedLegume 
                            ? 'bg-green-500/20 border-green-400 cursor-pointer hover:bg-green-500/30' 
                            : 'bg-white/5 border-white/20'
                          : isReady
                          ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-400 cursor-pointer animate-pulse'
                          : 'bg-gradient-to-br from-green-800/50 to-emerald-800/50 border-green-500 cursor-pointer'
                      }`}
                    >
                      {parcelle ? (
                        <>
                          <div className="text-4xl mb-1 z-10">{parcelle.emoji}</div>
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                            <motion.div 
                              className="h-full bg-green-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          {isReady && (
                            <div className="absolute top-1 right-1 text-xs">✅</div>
                          )}
                        </>
                      ) : selectedLegume ? (
                        <div className="text-green-300 text-xs">Planter ici</div>
                      ) : (
                        <div className="text-white/30 text-xs">Vide</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="text-xs text-green-300 text-center mt-3">
                💡 Clique sur un légume puis sur une parcelle vide pour planter
              </div>
            </div>
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