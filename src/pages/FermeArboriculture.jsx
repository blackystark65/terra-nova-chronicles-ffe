import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ARBRES = [
  { id: 'pommier', nom: 'Pommier', emoji: '🍎', fruit: '🍎', saison: 'automne', duree: 4 },
  { id: 'poirier', nom: 'Poirier', emoji: '🍐', fruit: '🍐', saison: 'automne', duree: 4 },
  { id: 'cerisier', nom: 'Cerisier', emoji: '🌸', fruit: '🍒', saison: 'ete', duree: 3 },
  { id: 'prunier', nom: 'Prunier', emoji: '🌳', fruit: '🟣', saison: 'ete', duree: 3 },
  { id: 'noyer', nom: 'Noyer', emoji: '🌳', fruit: '🥜', saison: 'automne', duree: 5 },
  { id: 'chataignier', nom: 'Châtaignier', emoji: '🌳', fruit: '🌰', saison: 'automne', duree: 5 }
];

const STAGES = ['jeune', 'croissance', 'adulte', 'production'];

export default function FermeArboriculture() {
  const [verger, setVerger] = useState(Array(12).fill(null));
  const [selectedArbre, setSelectedArbre] = useState(null);
  const [stades, setStades] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [tailles, setTailles] = useState(0);
  const [recoltesFruits, setRecoltesFruits] = useState(0);

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

  // Croissance automatique
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStades(prev => {
        const next = { ...prev };
        let anyChange = false;
        
        Object.keys(next).forEach(key => {
          if (next[key].niveau < 100) {
            next[key] = { ...next[key], niveau: Math.min(100, next[key].niveau + 1) };
            anyChange = true;
          }
        });
        
        return anyChange ? next : prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const planterArbre = (index) => {
    if (!selectedArbre || verger[index]) return;

    const newVerger = [...verger];
    newVerger[index] = { ...selectedArbre, plante_a: Date.now() };
    setVerger(newVerger);
    
    setStades(prev => ({ ...prev, [index]: { stade: 0, niveau: 0 } }));
    setSelectedArbre(null);
    
    setFeedback({ type: 'success', message: `🌱 ${selectedArbre.nom} planté !` });
    setTimeout(() => setFeedback(null), 1500);
  };

  const taillerArbre = (index) => {
    const arbre = verger[index];
    const stade = stades[index];
    
    if (!arbre || !stade || stade.niveau < 30) return;

    setStades(prev => ({
      ...prev,
      [index]: { ...prev[index], niveau: Math.min(100, prev[index].niveau + 20) }
    }));
    
    setTailles(tailles + 1);
    
    // Payer pour la taille
    payerTravail(3, 'Arboriculture: taille d\'un arbre');
    
    setFeedback({ type: 'success', message: '✂️ Arbre taillé ! +3 crédits' });
    setTimeout(() => setFeedback(null), 1000);
  };

  const recolterFruits = (index) => {
    const arbre = verger[index];
    const stade = stades[index];
    
    if (!arbre || !stade || stade.stade !== 3 || stade.niveau < 100) return;

    setStades(prev => ({
      ...prev,
      [index]: { stade: 3, niveau: 0 }
    }));
    
    setRecoltesFruits(recoltesFruits + 5);
    
    // Payer pour la récolte de fruits
    payerTravail(4, 'Arboriculture: récolte de fruits');
    
    setFeedback({ type: 'success', message: `${arbre.fruit} Récolte ! +4 crédits` });
    setTimeout(() => setFeedback(null), 1500);
  };

  const evoluerArbre = (index) => {
    const stade = stades[index];
    if (!stade || stade.niveau < 100 || stade.stade >= 3) return;

    setStades(prev => ({
      ...prev,
      [index]: { stade: stade.stade + 1, niveau: 0 }
    }));
    
    setFeedback({ type: 'success', message: '🌳 Arbre a évolué !' });
    setTimeout(() => setFeedback(null), 1500);
  };

  const getArbreSize = (stade) => {
    if (!stade) return 'text-2xl';
    if (stade.stade === 0) return 'text-2xl';
    if (stade.stade === 1) return 'text-4xl';
    if (stade.stade === 2) return 'text-5xl';
    return 'text-6xl';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-green-950 to-emerald-950">
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
            🌳 Arboriculture - Verger
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/30 text-center">
              <span className="text-4xl block mb-2">🌳</span>
              <div className="text-green-300 text-2xl font-bold">{verger.filter(a => a).length}/12</div>
              <div className="text-green-300/70 text-xs">Arbres plantés</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/30 text-center">
              <Scissors className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-blue-300 text-2xl font-bold">{tailles}</div>
              <div className="text-blue-300/70 text-xs">Tailles effectuées</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/30 text-center">
              <span className="text-4xl block mb-2">🍎</span>
              <div className="text-orange-300 text-2xl font-bold">{recoltesFruits}</div>
              <div className="text-orange-300/70 text-xs">Fruits récoltés</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            {/* Palette d'arbres */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-green-300 text-center">Arbres fruitiers</h3>
              <div className="space-y-2">
                {ARBRES.map(arbre => (
                  <button
                    key={arbre.id}
                    onClick={() => setSelectedArbre(selectedArbre?.id === arbre.id ? null : arbre)}
                    className={`w-full p-3 rounded-xl border-2 text-center transition-all ${
                      selectedArbre?.id === arbre.id 
                        ? 'bg-green-500/40 border-green-300 ring-2 ring-green-400 shadow-lg' 
                        : 'bg-white/5 border-white/20 hover:bg-green-500/20'
                    }`}
                  >
                    <div className="text-3xl mb-1">{arbre.emoji}</div>
                    <div className="text-green-200 text-xs font-semibold">{arbre.nom}</div>
                    <div className="text-green-300/70 text-[10px]">{arbre.fruit} {arbre.saison}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Verger 3x4 */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-bold text-green-300 text-center mb-2">Verger (3×4)</h3>
              <div className="grid grid-cols-3 gap-4 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30">
                {verger.map((arbre, idx) => {
                  const stade = stades[idx];
                  const niveau = stade?.niveau || 0;
                  const isReady = niveau >= 100;
                  const canEvolve = isReady && stade.stade < 3;
                  const canHarvest = isReady && stade.stade === 3;
                  
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        if (!arbre && selectedArbre) {
                          planterArbre(idx);
                        } else if (arbre && stade) {
                          if (canHarvest) {
                            recolterFruits(idx);
                          } else if (canEvolve) {
                            evoluerArbre(idx);
                          } else if (niveau >= 30 && niveau < 100) {
                            taillerArbre(idx);
                          }
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden ${
                        !arbre 
                          ? selectedArbre 
                            ? 'bg-green-500/20 border-green-400 cursor-pointer hover:bg-green-500/30' 
                            : 'bg-white/5 border-white/20'
                          : canHarvest
                          ? 'bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border-orange-400 cursor-pointer animate-pulse'
                          : canEvolve
                          ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-green-400 cursor-pointer'
                          : 'bg-gradient-to-br from-green-800/50 to-emerald-800/50 border-green-500 cursor-pointer'
                      }`}
                    >
                      {arbre ? (
                        <>
                          <div className={`${getArbreSize(stade)} mb-2 z-10 transition-all duration-500`}>
                            {stade?.stade === 3 ? arbre.fruit : arbre.emoji}
                          </div>
                          <div className="text-[10px] text-green-300 z-10 mb-1">
                            {STAGES[stade?.stade || 0]}
                          </div>
                          
                          <div className="absolute bottom-0 left-0 w-full h-2 bg-white/20">
                            <motion.div 
                              className="h-full bg-green-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${niveau}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          
                          {canHarvest && (
                            <div className="absolute top-2 right-2 text-xl">🍎</div>
                          )}
                          {canEvolve && (
                            <div className="absolute top-2 right-2 text-xl">⬆️</div>
                          )}
                          {niveau >= 30 && niveau < 100 && !canEvolve && (
                            <div className="absolute top-2 right-2">
                              <Scissors className="w-5 h-5 text-blue-400" />
                            </div>
                          )}
                        </>
                      ) : selectedArbre ? (
                        <div className="text-green-300 text-xs">Planter ici</div>
                      ) : (
                        <div className="text-white/30 text-xs">Vide</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div className="text-xs text-green-300 text-center mt-3 space-y-1">
                <div>🌱 Jeune → 🌳 Croissance → 🌲 Adulte → 🍎 Production</div>
                <div>✂️ Taille disponible à partir de 30% de croissance</div>
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