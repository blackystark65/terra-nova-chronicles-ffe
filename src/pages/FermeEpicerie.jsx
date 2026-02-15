import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, ShoppingCart, Coins, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FICHES_PEDAGOGIQUES = {
  fleurs_comestibles: {
    titre: 'Fleurs Comestibles',
    emoji: '🌸',
    sections: [
      {
        titre: 'Quand semer ?',
        contenu: 'Printemps (mars-mai) pour la plupart. Certaines variétés en automne (septembre-octobre).'
      },
      {
        titre: 'Comment obtenir les graines ?',
        contenu: 'Récolter les graines matures en fin de saison. Laisser sécher les fleurs fanées. Extraire les graines et les conserver au sec.'
      },
      {
        titre: 'Comment les produire ?',
        contenu: 'Semer en godets à la serre. Repiquer en pleine terre après les gelées. Arroser régulièrement. Éclaircir si nécessaire.'
      },
      {
        titre: 'Comment les récolter ?',
        contenu: 'Cueillir le matin après la rosée. Choisir les fleurs épanouies. Éviter celles traitées aux pesticides.'
      },
      {
        titre: 'Fleurs comestibles courantes',
        liste: ['Capucine (goût poivré)', 'Pensée (douce)', 'Bourrache (goût concombre)', 'Calendula (légèrement épicé)', 'Lavande (parfumée)', 'Rose (sucrée)', 'Violette (délicate)', 'Souci (piquante)']
      }
    ]
  },
  tomates: {
    titre: 'Tomates Bio',
    emoji: '🍅',
    sections: [
      {
        titre: 'Quand semer ?',
        contenu: 'Février-mars en serre chauffée. Avril-mai en pleine terre après les gelées.'
      },
      {
        titre: 'Comment obtenir les graines ?',
        contenu: 'Choisir une tomate bien mûre. Extraire les graines. Les faire fermenter 2-3 jours dans l\'eau. Rincer et sécher.'
      },
      {
        titre: 'Culture',
        contenu: 'Planter profond pour favoriser les racines. Tuteurer les plants. Arroser au pied. Pailler le sol. Tailler les gourmands.'
      },
      {
        titre: 'Récolte',
        contenu: 'Juillet à octobre. Cueillir quand bien colorées. Récolter régulièrement pour stimuler la production.'
      },
      {
        titre: 'Variétés populaires',
        liste: ['Cœur de bœuf (grosse)', 'Cerise (petite)', 'Roma (allongée)', 'Noire de Crimée (pourpre)', 'Ananas (jaune)', 'Green Zebra (rayée)']
      }
    ]
  },
  compost: {
    titre: 'Compost Bio',
    emoji: '♻️',
    sections: [
      {
        titre: 'Qu\'est-ce que le compost ?',
        contenu: 'Matière organique décomposée naturellement. Riche en nutriments pour les plantes. Améliore la structure du sol.'
      },
      {
        titre: 'Comment le fabriquer ?',
        contenu: 'Alterner couches vertes (déchets cuisine, herbe) et brunes (feuilles sèches, carton). Maintenir l\'humidité. Aérer régulièrement. Compter 6-12 mois de maturation.'
      },
      {
        titre: 'Ingrédients à composter',
        liste: ['Épluchures de fruits et légumes', 'Marc de café', 'Coquilles d\'œufs', 'Feuilles mortes', 'Tontes de gazon', 'Cartons non imprimés', 'Branchages broyés']
      },
      {
        titre: 'À éviter',
        liste: ['Viande et poisson', 'Produits laitiers', 'Plantes malades', 'Mauvaises herbes en graines']
      },
      {
        titre: 'Utilisation',
        contenu: 'Le compost est prêt quand il est brun foncé, friable et sent la terre. L\'incorporer au sol ou l\'utiliser en paillage.'
      }
    ]
  },
  terreau: {
    titre: 'Terreau Bio',
    emoji: '🪴',
    sections: [
      {
        titre: 'Composition',
        contenu: 'Mélange de compost mûr, tourbe, sable et matières organiques. pH équilibré pour la croissance des plantes.'
      },
      {
        titre: 'Fabrication maison',
        contenu: 'Mélanger 1/3 compost, 1/3 terre de jardin, 1/3 sable. Tamiser pour obtenir une texture fine. Laisser reposer 2 semaines.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Semis et boutures. Rempotage des plantes. Plantation en pots. Amélioration du sol du jardin.'
      },
      {
        titre: 'Conservation',
        contenu: 'Stocker au sec dans un endroit aéré. Utiliser dans l\'année pour garder ses propriétés nutritives.'
      }
    ]
  },
  micropousses: {
    titre: 'Micro-pousses',
    emoji: '🌾',
    sections: [
      {
        titre: 'Qu\'est-ce que c\'est ?',
        contenu: 'Jeunes pousses de légumes et herbes récoltées après 7-21 jours. Concentrées en nutriments et saveurs.'
      },
      {
        titre: 'Comment semer ?',
        contenu: 'Utiliser des plateaux peu profonds. Étaler du terreau humide. Semer dense. Couvrir légèrement. Vaporiser d\'eau. Placer à la lumière.'
      },
      {
        titre: 'Comment récolter ?',
        contenu: 'Couper avec des ciseaux propres juste au-dessus du terreau quand les premières vraies feuilles apparaissent.'
      },
      {
        titre: 'Comment consommer ?',
        contenu: 'Rincer délicatement à l\'eau froide. Utiliser fraîches en salades, sandwichs, smoothies. Ne pas cuire pour garder les nutriments.'
      },
      {
        titre: 'Variétés populaires',
        liste: ['Radis (piquant)', 'Roquette (poivré)', 'Moutarde (fort)', 'Basilic (aromatique)', 'Pois (sucré)', 'Tournesol (croquant)', 'Betterave (terreux)']
      }
    ]
  },
  pain_complet: {
    titre: 'Pain Complet',
    emoji: '🥖',
    sections: [
      {
        titre: 'Ingrédients',
        contenu: 'Farine complète bio (blé, seigle, épeautre). Eau. Levain naturel. Sel.'
      },
      {
        titre: 'Production du levain',
        contenu: 'Mélanger farine et eau à parts égales. Laisser fermenter 5-7 jours en nourrissant quotidiennement. Le levain est prêt quand il double de volume.'
      },
      {
        titre: 'Fabrication du pain',
        contenu: 'Pétrir la pâte 10-15 min. Laisser lever 2-4h. Façonner. Laisser pousser 1-2h. Cuire à 240°C pendant 30-40 min.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Riche en fibres. Meilleure digestion. Index glycémique plus bas. Plus de vitamines et minéraux que le pain blanc.'
      }
    ]
  },
  lait: {
    titre: 'Lait Frais de la Ferme',
    emoji: '🥛',
    sections: [
      {
        titre: 'Production',
        contenu: 'Traite manuelle ou mécanique des vaches, chèvres ou brebis. Deux traites par jour (matin et soir).'
      },
      {
        titre: 'Processus',
        contenu: 'Nettoyage des mamelles. Traite dans des conditions d\'hygiène strictes. Filtrage immédiat. Refroidissement rapide à 4°C.'
      },
      {
        titre: 'Conservation',
        contenu: 'À consommer dans les 3-4 jours. Garder au réfrigérateur. Ne pas rompre la chaîne du froid.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Riche en calcium et protéines. Vitamines A, D et B12. Lait cru: contient des enzymes et probiotiques bénéfiques.'
      }
    ]
  },
  plants_tomate: {
    titre: 'Plants de Tomate',
    emoji: '🌱',
    sections: [
      {
        titre: 'Production en pépinière',
        contenu: 'Semis en godets février-mars. Température 20-25°C. Repiquage après 3-4 semaines. Plants prêts en 6-8 semaines.'
      },
      {
        titre: 'Plantation',
        contenu: 'Attendre fin des gelées (mi-mai). Espacer de 50-70cm. Planter profond. Tuteurer dès la plantation.'
      },
      {
        titre: 'Entretien',
        contenu: 'Arroser régulièrement au pied. Pailler pour garder l\'humidité. Tailler les gourmands. Fertiliser avec du compost.'
      }
    ]
  }
};

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
  const [ficheOuverte, setFicheOuverte] = useState(null);
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
      setChariot([]);
      setTimeout(() => setFeedback(null), 3000);
    },
  });

  // Charger les articles depuis le profil
  React.useEffect(() => {
    if (profile?.articles_achetes && profile.articles_achetes.length > 0) {
      setChariot(profile.articles_achetes.map(article => ({
        ...article,
        uniqueId: article.id + '_' + article.date_achat
      })));
    }
  }, [profile]);

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

    // Préparer les articles avec la date d'achat
    const articlesAvecDate = chariot.map(item => ({
      id: item.id,
      nom: item.nom,
      emoji: item.emoji,
      prix: item.prix,
      date_achat: new Date().toISOString()
    }));

    updateProfileMutation.mutate({
      id: profile.id,
      data: {
        credits: creditsDisponibles - totalChariot,
        articles_achetes: articlesAvecDate
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
                      const dejaAchete = chariot.some(item => item.id === produit.id);
                      const canAdd = peutAjouterArticle(produit.prix) && !dejaAchete;
                      return (
                        <motion.button
                          key={produit.id}
                          onClick={() => canAdd && ajouterAuChariot(produit)}
                          disabled={!canAdd}
                          whileHover={canAdd ? { scale: 1.05 } : {}}
                          whileTap={canAdd ? { scale: 0.95 } : {}}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            dejaAchete
                              ? 'bg-emerald-900/50 border-emerald-500 opacity-60 cursor-not-allowed'
                              : !canAdd 
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
                          {dejaAchete && (
                            <div className="text-emerald-400 text-[10px] mt-1">✓ Acheté</div>
                          )}
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
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                          <button
                            onClick={() => setFicheOuverte(item.id)}
                            className="w-full h-full"
                          >
                            <div className="text-4xl mb-1">{item.emoji}</div>
                            <div className="text-yellow-300 text-xs font-bold">{item.prix}</div>
                            <div className="text-emerald-300 text-[10px] mt-1 opacity-0 group-hover:opacity-100">ℹ️ Info</div>
                          </button>
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

          {/* Modale Fiche Pédagogique */}
          <AnimatePresence>
          {ficheOuverte && FICHES_PEDAGOGIQUES[ficheOuverte] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFicheOuverte(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-emerald-900 to-green-950 rounded-3xl p-8 max-w-3xl max-h-[90vh] overflow-y-auto border-4 border-emerald-400/50 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">{FICHES_PEDAGOGIQUES[ficheOuverte].emoji}</span>
                    <h2 className="text-4xl font-bold text-emerald-300">{FICHES_PEDAGOGIQUES[ficheOuverte].titre}</h2>
                  </div>
                  <button
                    onClick={() => setFicheOuverte(null)}
                    className="text-emerald-400 hover:text-emerald-300 text-4xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {FICHES_PEDAGOGIQUES[ficheOuverte].sections.map((section, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30"
                    >
                      <h3 className="text-2xl font-bold text-emerald-300 mb-3 flex items-center gap-2">
                        📚 {section.titre}
                      </h3>
                      {section.contenu && (
                        <p className="text-emerald-200 leading-relaxed text-lg">{section.contenu}</p>
                      )}
                      {section.liste && (
                        <ul className="space-y-2 mt-3">
                          {section.liste.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-emerald-200 text-lg">
                              <span className="text-emerald-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => setFicheOuverte(null)}
                  className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 py-6 text-lg"
                >
                  Fermer
                </Button>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>
          </div>
          );
          }