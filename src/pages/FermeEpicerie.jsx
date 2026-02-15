import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, ShoppingCart, Coins, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRODUITS_EPICERIE = [
  { id: 'pain_complet', nom: 'Pain Complet', emoji: '🥖', prix: 20, type: 'boulangerie', description: 'Pain artisanal bio' },
  { id: 'pain_seigle', nom: 'Pain de Seigle', emoji: '🍞', prix: 25, type: 'boulangerie', description: 'Pain de seigle traditionnel' },
  { id: 'tomates', nom: 'Tomates Bio', emoji: '🍅', prix: 15, type: 'maraichage', description: 'Tomates fraîches du jardin' },
  { id: 'carottes', nom: 'Carottes', emoji: '🥕', prix: 10, type: 'maraichage', description: 'Carottes croquantes' },
  { id: 'salades', nom: 'Salades', emoji: '🥬', prix: 12, type: 'maraichage', description: 'Salades vertes fraîches' },
  { id: 'pommes', nom: 'Pommes', emoji: '🍎', prix: 18, type: 'verger', description: 'Pommes du verger' },
  { id: 'oeufs', nom: 'Œufs Frais', emoji: '🥚', prix: 22, type: 'elevage', description: 'Œufs de poules élevées en plein air' },
  { id: 'miel', nom: 'Miel Local', emoji: '🍯', prix: 30, type: 'apiculture', description: 'Miel artisanal' },
  { id: 'plants_tomate', nom: 'Plants de Tomate', emoji: '🌱', prix: 8, type: 'pepiniere', description: 'Plants prêts à planter' },
  { id: 'plants_salade', nom: 'Plants de Salade', emoji: '🌿', prix: 6, type: 'pepiniere', description: 'Plants de salade' }
];

export default function FermeEpicerie() {
  const [panier, setPanier] = useState([]);
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

  const ajouterAuPanier = (produit) => {
    const existant = panier.find(p => p.id === produit.id);
    if (existant) {
      setPanier(panier.map(p => 
        p.id === produit.id ? { ...p, quantite: p.quantite + 1 } : p
      ));
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }
    setFeedback({ type: 'success', message: `${produit.nom} ajouté au panier` });
    setTimeout(() => setFeedback(null), 1500);
  };

  const retirerDuPanier = (produitId) => {
    const existant = panier.find(p => p.id === produitId);
    if (existant && existant.quantite > 1) {
      setPanier(panier.map(p => 
        p.id === produitId ? { ...p, quantite: p.quantite - 1 } : p
      ));
    } else {
      setPanier(panier.filter(p => p.id !== produitId));
    }
  };

  const totalPanier = panier.reduce((acc, p) => acc + (p.prix * p.quantite), 0);
  const creditsDisponibles = profile?.credits || 0;

  const validerAchat = () => {
    if (totalPanier > creditsDisponibles) {
      setFeedback({ type: 'error', message: '❌ Crédits insuffisants !' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    if (panier.length === 0) {
      setFeedback({ type: 'error', message: '❌ Panier vide !' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    updateProfileMutation.mutate({
      id: profile.id,
      data: {
        credits: creditsDisponibles - totalPanier
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

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-emerald-300 mb-4">
              🏪 Épicerie de la Ferme
            </h1>
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-emerald-400/30">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-300 text-xl font-bold">{creditsDisponibles} crédits</span>
              </div>
              <div className="h-6 w-px bg-emerald-400/30" />
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-300 text-xl font-bold">{panier.length} articles</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Produits */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-emerald-300 mb-4">Produits disponibles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {PRODUITS_EPICERIE.map((produit) => (
                  <motion.div
                    key={produit.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20 hover:border-emerald-400/40 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-6xl">{produit.emoji}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-emerald-300">{produit.nom}</h3>
                        <p className="text-emerald-200/70 text-sm mb-3">{produit.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-300 font-bold text-xl">{produit.prix}</span>
                          </div>
                          <Button
                            onClick={() => ajouterAuPanier(produit)}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                            size="sm"
                          >
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Panier */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30 sticky top-24">
                <h2 className="text-2xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  Panier
                </h2>

                {panier.length === 0 ? (
                  <div className="text-center py-8 text-emerald-300/50">
                    <Package className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p>Panier vide</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                      {panier.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{item.emoji}</span>
                            <div>
                              <div className="text-emerald-200 font-semibold text-sm">{item.nom}</div>
                              <div className="text-yellow-300 text-xs flex items-center gap-1">
                                <Coins className="w-3 h-3" />
                                {item.prix} × {item.quantite}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => retirerDuPanier(item.id)}
                              className="w-6 h-6 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-emerald-300 font-bold">{item.quantite}</span>
                            <button
                              onClick={() => ajouterAuPanier(item)}
                              className="w-6 h-6 rounded bg-green-500/20 hover:bg-green-500/40 text-green-300 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-emerald-400/30 pt-4 mb-4">
                      <div className="flex justify-between items-center text-lg mb-2">
                        <span className="text-emerald-300">Total:</span>
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-300 font-bold">{totalPanier}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-emerald-300/70">Reste:</span>
                        <span className={`font-bold ${creditsDisponibles - totalPanier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {creditsDisponibles - totalPanier} crédits
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={validerAchat}
                      disabled={totalPanier > creditsDisponibles || panier.length === 0}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50"
                    >
                      Valider l'achat
                    </Button>
                  </>
                )}
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