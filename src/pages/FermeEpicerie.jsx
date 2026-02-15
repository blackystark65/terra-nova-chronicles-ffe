import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, ShoppingCart, Coins, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RAYONS = {
  serre: {
    nom: 'Serre & Pépinière',
    emoji: '🌱',
    color: 'from-green-600 to-emerald-700',
    produits: [
      { id: 'plants_tomate', nom: 'Plant Tomate', emoji: '🌱', prix: 8 },
      { id: 'plants_salade', nom: 'Plant Salade', emoji: '🌿', prix: 6 },
      { id: 'micropousses', nom: 'Micro-pousses', emoji: '🌾', prix: 12 },
      { id: 'fleurs_comestibles', nom: 'Fleurs Comestibles', emoji: '🌸', prix: 10 },
      { id: 'plantes_aromatiques', nom: 'Plantes Aromatiques', emoji: '🪴', prix: 15 }
    ]
  },
  maraichage: {
    nom: 'Fruits & Légumes',
    emoji: '🥕',
    color: 'from-orange-600 to-red-700',
    produits: [
      { id: 'tomates', nom: 'Tomates', emoji: '🍅', prix: 15 },
      { id: 'carottes', nom: 'Carottes', emoji: '🥕', prix: 10 },
      { id: 'salades', nom: 'Salades', emoji: '🥬', prix: 12 },
      { id: 'pommes', nom: 'Pommes', emoji: '🍎', prix: 18 },
      { id: 'fraises', nom: 'Fraises', emoji: '🍓', prix: 20 }
    ]
  },
  boulangerie: {
    nom: 'Boulangerie',
    emoji: '🥖',
    color: 'from-amber-600 to-yellow-700',
    produits: [
      { id: 'pain_complet', nom: 'Pain Complet', emoji: '🥖', prix: 20 },
      { id: 'pain_seigle', nom: 'Pain Seigle', emoji: '🍞', prix: 25 }
    ]
  },
  ferme: {
    nom: 'Produits Laitiers',
    emoji: '🥛',
    color: 'from-blue-600 to-cyan-700',
    produits: [
      { id: 'lait', nom: 'Lait Frais', emoji: '🥛', prix: 18 },
      { id: 'beurre', nom: 'Beurre', emoji: '🧈', prix: 22 },
      { id: 'fromage', nom: 'Fromage', emoji: '🧀', prix: 28 }
    ]
  },
  compost: {
    nom: 'Compost & Terreau',
    emoji: '♻️',
    color: 'from-brown-600 to-stone-700',
    produits: [
      { id: 'compost', nom: 'Sac Compost', emoji: '♻️', prix: 14 },
      { id: 'terreau', nom: 'Sac Terreau', emoji: '🪴', prix: 16 }
    ]
  },
  fleurs: {
    nom: 'Bouquets',
    emoji: '💐',
    color: 'from-pink-600 to-rose-700',
    produits: [
      { id: 'bouquet_champetre', nom: 'Bouquet Champêtre', emoji: '💐', prix: 25 },
      { id: 'bouquet_roses', nom: 'Bouquet Roses', emoji: '🌹', prix: 30 }
    ]
  }
};

export default function FermeEpicerie() {
  const [chariot, setChariot] = useState([]);
  const [feedback, setFeedback] = useState(null);
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

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EcoProfile.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles']);
      setFeedback({ type: 'success', message: '✅ Achat effectué avec succès !' });
      setPanier([]);
      setTimeout(() => setFeedback(null), 3000);
    },
  });

  const totalChariot = chariot.reduce((acc, item) => acc + item.prix, 0);
  const creditsDisponibles = profile?.credits || 0;
  const peutAjouterArticle = (prix) => {
    return (totalChariot + prix) <= creditsDisponibles;
  };

  const ajouterAuChariot = (produit) => {
    if (peutAjouterArticle(produit.prix)) {
      setChariot([...chariot, { ...produit, uniqueId: Date.now() }]);
      setFeedback({ type: 'success', message: `${produit.nom} ajouté !` });
      setTimeout(() => setFeedback(null), 1000);
    } else {
      setFeedback({ type: 'error', message: '❌ Budget insuffisant !' });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const retirerDuChariot = (uniqueId) => {
    setChariot(chariot.filter(item => item.uniqueId !== uniqueId));
  };

  const validerAchat = () => {
    if (chariot.length === 0) {
      setFeedback({ type: 'error', message: '❌ Chariot vide !' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    updateProfileMutation.mutate({
      id: profile.id,
      data: {
        credits: creditsDisponibles - totalChariot
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950">
        <BiolumiHeader currentPage="MicroFerme" />

        <main className="pt-20 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link to={createPageUrl('MicroFerme')}>
              <Button variant="outline" className="mb-4 border-emerald-400 text-emerald-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>

            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-emerald-300 mb-4">
                🏪 Épicerie de la Ferme
              </h1>
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-emerald-400/30">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-300 text-xl font-bold">{creditsDisponibles} crédits</span>
                </div>
              </div>
            </div>

            {/* Rayons */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {Object.entries(RAYONS).map(([rayonId, rayon]) => (
                <div key={rayonId} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-emerald-400/20">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${rayon.color} mb-3`}>
                    <span className="text-2xl">{rayon.emoji}</span>
                    <span className="text-white font-bold">{rayon.nom}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {rayon.produits.map((produit) => {
                      const canAdd = peutAjouterArticle(produit.prix);
                      return (
                        <motion.button
                          key={produit.id}
                          onClick={() => canAdd && ajouterAuChariot(produit)}
                          disabled={!canAdd}
                          whileHover={canAdd ? { scale: 1.05 } : {}}
                          whileTap={canAdd ? { scale: 0.95 } : {}}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            !canAdd 
                              ? 'bg-gray-900/50 border-gray-600 opacity-40 cursor-not-allowed' 
                              : 'bg-white/5 border-white/20 hover:bg-emerald-500/20 hover:border-emerald-400 cursor-pointer'
                          }`}
                        >
                          <div className="text-3xl mb-1">{produit.emoji}</div>
                          <div className="text-emerald-200 text-xs font-semibold mb-1">{produit.nom}</div>
                          <div className="flex items-center justify-center gap-1">
                            <Coins className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-300 text-xs font-bold">{produit.prix}</span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Chariot Central + Caisse */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-4 border-emerald-400/30 min-h-[300px]">
                  <div className="flex items-center gap-3 mb-6">
                    <ShoppingCart className="w-8 h-8 text-emerald-400" />
                    <h2 className="text-3xl font-bold text-emerald-300">Chariot</h2>
                    <span className="text-emerald-300/70">({chariot.length} articles)</span>
                  </div>

                  {chariot.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingCart className="w-24 h-24 mx-auto mb-4 text-emerald-400/30" />
                      <p className="text-emerald-300/50 text-xl">Clique sur les articles pour les ajouter</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                      {chariot.map((item) => (
                        <motion.div
                          key={item.uniqueId}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative p-3 rounded-xl bg-emerald-500/20 border-2 border-emerald-400/50 text-center group"
                        >
                          <button
                            onClick={() => retirerDuChariot(item.uniqueId)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                          <div className="text-4xl mb-1">{item.emoji}</div>
                          <div className="text-yellow-300 text-xs font-bold">{item.prix}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Caisse */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-yellow-400/30 sticky top-24">
                  <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">💰 Caisse</h2>

                  <div className="space-y-4 mb-6">
                    <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                      <div className="text-yellow-300/70 text-sm mb-1">Articles:</div>
                      <div className="text-yellow-200 text-2xl font-bold">{chariot.length}</div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                      <div className="text-yellow-300/70 text-sm mb-1">Total:</div>
                      <div className="flex items-center gap-2">
                        <Coins className="w-6 h-6 text-yellow-400" />
                        <span className="text-yellow-300 text-3xl font-bold">{totalChariot}</span>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                      <div className="text-yellow-300/70 text-sm mb-1">Reste:</div>
                      <span className={`text-2xl font-bold ${
                        creditsDisponibles - totalChariot >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {creditsDisponibles - totalChariot}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={validerAchat}
                    disabled={chariot.length === 0}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 py-6 text-lg disabled:opacity-50"
                  >
                    {chariot.length === 0 ? '🛒 Chariot vide' : '✅ Payer'}
                  </Button>
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
          );
          }