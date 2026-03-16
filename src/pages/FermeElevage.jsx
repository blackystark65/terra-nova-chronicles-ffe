import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Heart } from 'lucide-react';
import { computeRewards } from '@/lib/rewardPlayer';
import { Button } from '@/components/ui/button';

const ANIMAUX = [
  { id: 'poule', nom: 'Poule', emoji: '🐔', produit: '🥚', produitNom: 'Œuf', besoin: 'grain', duree: 2 },
  { id: 'vache', nom: 'Vache', emoji: '🐄', produit: '🥛', produitNom: 'Lait', besoin: 'herbe', duree: 3 },
  { id: 'mouton', nom: 'Mouton', emoji: '🐑', produit: '☁️', produitNom: 'Laine', besoin: 'herbe', duree: 4 },
  { id: 'chevre', nom: 'Chèvre', emoji: '🐐', produit: '🍕', produitNom: 'Fromage', besoin: 'herbe', duree: 3 },
  { id: 'cochon', nom: 'Cochon', emoji: '🐷', produit: '🍖', produitNom: 'Viande', besoin: 'legumes', duree: 5 },
  { id: 'lapin', nom: 'Lapin', emoji: '🐰', produit: '🥕', produitNom: 'Fumier', besoin: 'legumes', duree: 2 }
];

const NOURRITURES = [
  { id: 'grain', nom: 'Grain', emoji: '🌾' },
  { id: 'herbe', nom: 'Herbe', emoji: '🌿' },
  { id: 'legumes', nom: 'Légumes', emoji: '🥕' },
  { id: 'eau', nom: 'Eau', emoji: '💧' }
];

export default function FermeElevage() {
  const [enclos, setEnclos] = useState(Array(12).fill(null));
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [etats, setEtats] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [nourritures, setNourritures] = useState({ grain: 10, herbe: 10, legumes: 10, eau: 20 });
  const [productions, setProductions] = useState({});

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

      const updates = computeRewards(profile, { xp: montant, credits: montant, ferme_action: true });
      updateProfileMutation.mutate({
        id: profile.id,
        data: updates
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

      setFeedback({ type: 'success', message: `💰 +${montant} crédits gagnés !` });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  // Production automatique
  React.useEffect(() => {
    const interval = setInterval(() => {
      setEtats(prev => {
        const next = { ...prev };
        let anyChange = false;
        
        Object.keys(next).forEach(key => {
          if (next[key].production < 100 && next[key].bienEtre >= 50) {
            next[key] = { ...next[key], production: Math.min(100, next[key].production + 2) };
            anyChange = true;
          }
          if (next[key].bienEtre > 0) {
            next[key] = { ...next[key], bienEtre: Math.max(0, next[key].bienEtre - 0.5) };
            anyChange = true;
          }
        });
        
        return anyChange ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const placerAnimal = (index) => {
    if (!selectedAnimal || enclos[index]) return;

    const newEnclos = [...enclos];
    newEnclos[index] = { ...selectedAnimal, arrive_a: Date.now() };
    setEnclos(newEnclos);
    
    setEtats(prev => ({ ...prev, [index]: { bienEtre: 100, production: 0 } }));
    setSelectedAnimal(null);
    
    setFeedback({ type: 'success', message: `${selectedAnimal.emoji} ${selectedAnimal.nom} ajouté !` });
    setTimeout(() => setFeedback(null), 1500);
  };

  const nourrir = (index) => {
    const animal = enclos[index];
    if (!animal || !nourritures[animal.besoin] || nourritures[animal.besoin] < 1) return;

    setNourritures(prev => ({ ...prev, [animal.besoin]: prev[animal.besoin] - 1 }));
    setEtats(prev => ({
      ...prev,
      [index]: { ...prev[index], bienEtre: Math.min(100, prev[index].bienEtre + 20) }
    }));
    
    payerTravail(3, `Soin animal: ${animal.nom} nourri`);
  };

  const donnerEau = (index) => {
    if (!enclos[index] || nourritures.eau < 1) return;

    setNourritures(prev => ({ ...prev, eau: prev.eau - 1 }));
    setEtats(prev => ({
      ...prev,
      [index]: { ...prev[index], bienEtre: Math.min(100, prev[index].bienEtre + 10) }
    }));
    
    payerTravail(2, `Soin animal: abreuvé`);
  };

  const recolterProduit = (index) => {
    const animal = enclos[index];
    const etat = etats[index];
    
    if (!animal || !etat || etat.production < 100) return;

    setEtats(prev => ({
      ...prev,
      [index]: { ...prev[index], production: 0 }
    }));
    
    setProductions(prev => ({
      ...prev,
      [animal.id]: (prev[animal.id] || 0) + 1
    }));
    
    payerTravail(5, `Récolte: ${animal.produitNom}`);
  };

  const totalProductions = Object.values(productions).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-yellow-950">
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
            🐄 Élevage - Ferme Pédagogique
          </h1>

          {/* Stats Nourritures */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {NOURRITURES.map(nourriture => (
              <div key={nourriture.id} className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-orange-400/30 text-center">
                <div className="text-3xl mb-1">{nourriture.emoji}</div>
                <div className="text-orange-300 text-xl font-bold">{nourritures[nourriture.id]}</div>
                <div className="text-orange-300/70 text-[10px]">{nourriture.nom}</div>
              </div>
            ))}
          </div>

          {/* Stats Productions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-orange-400/30 text-center">
              <span className="text-4xl block mb-2">🐄</span>
              <div className="text-orange-300 text-2xl font-bold">{enclos.filter(a => a).length}/12</div>
              <div className="text-orange-300/70 text-xs">Animaux</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-orange-400/30 text-center">
              <span className="text-4xl block mb-2">🥚</span>
              <div className="text-yellow-300 text-2xl font-bold">{totalProductions}</div>
              <div className="text-yellow-300/70 text-xs">Produits récoltés</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            {/* Palette animaux */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-orange-300 text-center">Animaux</h3>
              <div className="space-y-2">
                {ANIMAUX.map(animal => (
                  <button
                    key={animal.id}
                    onClick={() => setSelectedAnimal(selectedAnimal?.id === animal.id ? null : animal)}
                    className={`w-full p-3 rounded-xl border-2 text-center transition-all ${
                      selectedAnimal?.id === animal.id 
                        ? 'bg-orange-500/40 border-orange-300 ring-2 ring-orange-400 shadow-lg' 
                        : 'bg-white/5 border-white/20 hover:bg-orange-500/20'
                    }`}
                  >
                    <div className="text-3xl mb-1">{animal.emoji}</div>
                    <div className="text-orange-200 text-xs font-semibold">{animal.nom}</div>
                    <div className="text-orange-300/70 text-[10px]">{animal.produit} {animal.produitNom}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enclos 3x4 */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold text-orange-300 text-center mb-2">Enclos (3×4)</h3>
              <div className="grid grid-cols-3 gap-4 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-orange-400/30">
                {enclos.map((animal, idx) => {
                  const etat = etats[idx];
                  const bienEtre = etat?.bienEtre || 0;
                  const production = etat?.production || 0;
                  const canHarvest = production >= 100;
                  const needsCare = bienEtre < 50;
                  
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        if (!animal && selectedAnimal) {
                          placerAnimal(idx);
                        } else if (animal && etat) {
                          if (canHarvest) {
                            recolterProduit(idx);
                          } else if (needsCare) {
                            nourrir(idx);
                          }
                        }
                      }}
                      onDoubleClick={() => animal && donnerEau(idx)}
                      whileHover={{ scale: 1.05 }}
                      className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden ${
                        !animal 
                          ? selectedAnimal 
                            ? 'bg-orange-500/20 border-orange-400 cursor-pointer hover:bg-orange-500/30' 
                            : 'bg-white/5 border-white/20'
                          : canHarvest
                          ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-400 cursor-pointer animate-pulse'
                          : needsCare
                          ? 'bg-gradient-to-br from-red-500/30 to-orange-500/30 border-red-400 cursor-pointer'
                          : 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400'
                      }`}
                    >
                      {animal ? (
                        <>
                          <div className="text-5xl mb-2 z-10">{animal.emoji}</div>
                          
                          {/* Barre bien-être */}
                          <div className="w-full px-2 mb-1 z-10">
                            <div className="flex items-center gap-1 mb-1">
                              <Heart className="w-3 h-3 text-red-400" />
                              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                                <motion.div 
                                  className={`h-full ${bienEtre > 50 ? 'bg-green-400' : 'bg-red-400'}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${bienEtre}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Barre production */}
                          <div className="absolute bottom-0 left-0 w-full h-2 bg-white/20">
                            <motion.div 
                              className="h-full bg-yellow-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${production}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          
                          {canHarvest && (
                            <div className="absolute top-2 right-2 text-2xl">{animal.produit}</div>
                          )}
                          {needsCare && (
                            <div className="absolute top-2 left-2 text-xl">❗</div>
                          )}
                        </>
                      ) : selectedAnimal ? (
                        <div className="text-orange-300 text-xs">Placer ici</div>
                      ) : (
                        <div className="text-white/30 text-xs">Vide</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="text-xs text-orange-300 text-center mt-3 space-y-1">
                <div>💚 Bien-être &gt; 50% = production active</div>
                <div>🍽️ Clic = Nourrir | 💧 Double-clic = Abreuver</div>
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