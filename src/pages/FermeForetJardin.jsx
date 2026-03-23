import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { computeRewards } from '@/lib/rewardPlayer';

const STRATES = [
  { 
    id: 'canopee', nom: 'Canopée', emoji: '🌳', niveau: 5,
    plantes: [
      { id: 'chene', nom: 'Chêne', emoji: '🌳' },
      { id: 'hetre', nom: 'Hêtre', emoji: '🌳' },
      { id: 'noyer', nom: 'Noyer', emoji: '🌳' }
    ]
  },
  { 
    id: 'arbres', nom: 'Arbres', emoji: '🌲', niveau: 4,
    plantes: [
      { id: 'pommier', nom: 'Pommier', emoji: '🍎' },
      { id: 'cerisier', nom: 'Cerisier', emoji: '🍒' },
      { id: 'prunier', nom: 'Prunier', emoji: '🟣' }
    ]
  },
  { 
    id: 'arbustes', nom: 'Arbustes', emoji: '🌿', niveau: 3,
    plantes: [
      { id: 'noisetier', nom: 'Noisetier', emoji: '🌰' },
      { id: 'groseillier', nom: 'Groseillier', emoji: '🔴' },
      { id: 'framboisier', nom: 'Framboisier', emoji: '🍇' }
    ]
  },
  { 
    id: 'herbacees', nom: 'Herbacées', emoji: '🌾', niveau: 2,
    plantes: [
      { id: 'consoude', nom: 'Consoude', emoji: '🌿' },
      { id: 'ortie', nom: 'Ortie', emoji: '🌿' },
      { id: 'rhubarbe', nom: 'Rhubarbe', emoji: '🥬' }
    ]
  },
  { 
    id: 'couvre_sol', nom: 'Couvre-sol', emoji: '🍓', niveau: 1,
    plantes: [
      { id: 'fraisier', nom: 'Fraisier', emoji: '🍓' },
      { id: 'trefle', nom: 'Trèfle', emoji: '🍀' },
      { id: 'lierre', nom: 'Lierre', emoji: '🌿' }
    ]
  }
];

// Calcule l'impact écologique d'une guilde selon ses plantes
const computeEcoInfo = (guilde) => {
  const niveaux = new Set(guilde.filter(Boolean).map(p => p.niveau));
  const plantes = guilde.filter(Boolean);
  const planteIds = new Set(plantes.map(p => p.id));

  let insectes = 0, oiseaux = 0, batraciens = 0, animaux = 0;
  const fonctions = [];
  const faune = [];

  // Canopée (5) → oiseaux nicheurs, mammifères
  if (niveaux.has(5)) {
    oiseaux += 35; animaux += 20;
    faune.push('🦅 Rapaces et grands oiseaux (nidification dans les hautes branches)');
    faune.push('🦇 Chauves-souris (gîtes dans les fissures d\'écorce)');
    faune.push('🐿️ Écureuils (réserves de glands/faînes)');
    fonctions.push({ emoji: '🪺', titre: 'Nidification haute', desc: 'Les grands arbres offrent des sites de nidification sécurisés pour rapaces et corvidés.' });
    if (planteIds.has('chene')) fonctions.push({ emoji: '🌰', titre: 'Production de glands', desc: 'Le chêne produit des glands nourrissant geais, écureuils et sangliers. Les glands non mangés germent et renouvellent la forêt.' });
    if (planteIds.has('noyer')) fonctions.push({ emoji: '🥜', titre: 'Noix et huiles', desc: 'Les feuilles de noyer sont allélopathiques (inhibent certaines mauvaises herbes). Les noix attirent geais des chênes et blaireaux.' });
  }

  // Arbres fruitiers (4) → oiseaux frugivores, insectes pollinisateurs
  if (niveaux.has(4)) {
    insectes += 40; oiseaux += 25;
    faune.push('🐝 Abeilles et bourdons (pollinisation des fleurs de printemps)');
    faune.push('🐦 Merles, grives, étourneaux (consommation des fruits)');
    faune.push('🦋 Papillons frugivores (nectar et fruits tombés)');
    fonctions.push({ emoji: '🌸', titre: 'Pollinisation printanière', desc: 'Les fleurs des arbres fruitiers sont parmi les premières ressources mellifères, cruciales pour les colonies d\'abeilles au sortir de l\'hiver.' });
    fonctions.push({ emoji: '🍎', titre: 'Fruits nourrissants', desc: 'Les fruits tombés nourrissent renards, hérissons et nombreux insectes. Leur fermentation attire des espèces rares de lépidoptères.' });
  }

  // Arbustes (3) → insectes, petits mammifères
  if (niveaux.has(3)) {
    insectes += 30; animaux += 15; oiseaux += 15;
    faune.push('🐞 Coccinelles (prédation des pucerons sur arbustes)');
    faune.push('🦔 Hérissons (abri sous les buissons denses)');
    faune.push('🐦 Fauvette, merle (nidification dans les fourrés)');
    fonctions.push({ emoji: '🏠', titre: 'Habitat et abri', desc: 'Les arbustes denses forment des refuges protégés du vent et des prédateurs pour la nidification à mi-hauteur.' });
    if (planteIds.has('noisetier')) fonctions.push({ emoji: '🌰', titre: 'Noisettes & pollinisation', desc: 'Le noisetier fleurit en janvier-février, première ressource pollinifère de l\'année. Ses noisettes nourrissent écureuils et geais.' });
    if (planteIds.has('groseillier') || planteIds.has('framboisier')) fonctions.push({ emoji: '🫐', titre: 'Petits fruits & oiseaux', desc: 'Groseilles et framboises sont essentielles aux oiseaux migrateurs qui ont besoin de se constituer des réserves énergétiques en automne.' });
  }

  // Herbacées (2) → insectes pollinisateurs, batraciens
  if (niveaux.has(2)) {
    insectes += 25; batraciens += 30; animaux += 10;
    faune.push('🐸 Grenouilles et crapauds (chasse des insectes dans les herbacées)');
    faune.push('🐛 Chenilles et larves (plantes hôtes indispensables)');
    faune.push('🐝 Syrphes et guêpes parasitoïdes (régulation naturelle)');
    fonctions.push({ emoji: '♻️', titre: 'Décomposition & fertilité', desc: 'Les feuilles des herbacées mortes sont décomposées par champignons et vers de terre, libérant azote, potassium et phosphore directement dans le sol de la guilde.' });
    if (planteIds.has('consoude')) fonctions.push({ emoji: '🌿', titre: 'Consoude : pompe à nutriments', desc: 'Ses racines profondes (2m+) remontent le calcium, le potassium et le bore des couches profondes. Ses feuilles mortes forment un mulch fertilisant exceptionnel.' });
    if (planteIds.has('ortie')) fonctions.push({ emoji: '🌱', titre: 'Ortie : super-plante', desc: 'L\'ortie héberge 40+ espèces de papillons. Son purin fertilise et renforce les défenses immunitaires des plantes voisines.' });
  }

  // Couvre-sol (1) → batraciens, vers de terre, humidité
  if (niveaux.has(1)) {
    batraciens += 25; insectes += 15; animaux += 10;
    faune.push('🪱 Vers de terre (sol humide maintenu par le couvre-sol)');
    faune.push('🦎 Lézards et orvets (chasse dans la litière)');
    faune.push('🐜 Fourmis (nidification sous les plantes rampantes)');
    fonctions.push({ emoji: '💧', titre: 'Rétention d\'eau', desc: 'Le couvre-sol réduit l\'évaporation de 60-80%, maintient la fraîcheur du sol et prévient l\'érosion lors des pluies.' });
    fonctions.push({ emoji: '🌍', titre: 'Vie du sol', desc: 'Le sol vivant et humide abrite bactéries, champignons mycorhiziens, cloportes et mille-pattes qui décomposent la litière et libèrent des nutriments assimilables.' });
    if (planteIds.has('trefle')) fonctions.push({ emoji: '🍀', titre: 'Trèfle : fixateur d\'azote', desc: 'Ses nodules racinaires abritent des bactéries (Rhizobium) qui fixent l\'azote atmosphérique — jusqu\'à 200kg/ha/an — offert gratuitement aux plantes voisines.' });
  }

  // Synergie 5 strates = bonus
  const nbStrates = niveaux.size;
  if (nbStrates === 5) {
    fonctions.push({ emoji: '🌳', titre: 'Synergie complète des 5 strates', desc: 'Une guilde avec 5 strates reproduit une lisière forestière naturelle : chaque espèce occupe sa niche, les ressources sont utilisées à 100%, les parasites et maladies sont naturellement régulés.' });
    insectes = Math.min(100, insectes + 10);
    oiseaux = Math.min(100, oiseaux + 10);
    batraciens = Math.min(100, batraciens + 10);
    animaux = Math.min(100, animaux + 10);
  }

  // Normaliser à max 100
  const total = insectes + oiseaux + batraciens + animaux || 1;
  const normalize = v => Math.min(100, Math.round(v));

  return {
    insectes: normalize(insectes),
    oiseaux: normalize(oiseaux),
    batraciens: normalize(batraciens),
    animaux: normalize(animaux),
    fonctions,
    faune,
    nbStrates,
    biodiversiteScore: nbStrates * 10 + (nbStrates === 5 ? 50 : 0)
  };
};

export default function FermeForetJardin() {
  const [guildes, setGuildes] = useState(Array(6).fill(null).map(() => Array(5).fill(null)));
  const [selectedPlante, setSelectedPlante] = useState(null);
  const [selectedGuilde, setSelectedGuilde] = useState(null); // index guilde pour le panneau info
  const [feedback, setFeedback] = useState(null);
  const [biodiversite, setBiodiversite] = useState(0);
  const [recoltesFaites, setRecoltesFaites] = useState(0);

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

  React.useEffect(() => {
    let score = 0;
    guildes.forEach(guilde => {
      const stratesPresentes = new Set(guilde.filter(p => p).map(p => p.niveau));
      score += stratesPresentes.size * 10;
      if (stratesPresentes.size === 5) score += 50;
    });
    setBiodiversite(score);
  }, [guildes]);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 2000);
  };

  const planterDansGuilde = (guildeIndex, strateIndex) => {
    if (!selectedPlante || guildes[guildeIndex][strateIndex]) return;
    if (selectedPlante.niveau !== STRATES[strateIndex].niveau) {
      showFeedback('error', `❌ Cette plante va dans la strate : ${STRATES.find(s => s.niveau === selectedPlante.niveau)?.nom}`);
      return;
    }
    const newGuildes = guildes.map(g => [...g]);
    newGuildes[guildeIndex][strateIndex] = selectedPlante;
    setGuildes(newGuildes);
    setSelectedPlante(null);
    const guildeComplete = newGuildes[guildeIndex].every(p => p !== null);
    showFeedback('success', guildeComplete ? '🎉 Guilde complète ! Clique sur ✅ pour récolter.' : `${selectedPlante.emoji} ${selectedPlante.nom} planté !`);
  };

  const retirerPlante = (guildeIndex, strateIndex) => {
    if (!guildes[guildeIndex][strateIndex]) return;
    const newGuildes = guildes.map(g => [...g]);
    newGuildes[guildeIndex][strateIndex] = null;
    setGuildes(newGuildes);
    showFeedback('success', '🗑️ Plante retirée');
  };

  const recolterGuilde = (guildeIndex) => {
    const guilde = guildes[guildeIndex];
    if (!guilde.every(p => p !== null)) {
      showFeedback('error', '❌ La guilde doit être complète (5 strates) pour être récoltée');
      return;
    }
    const ecoInfo = computeEcoInfo(guilde);
    payerTravail(10, `Récolte guilde ${guildeIndex + 1} (${ecoInfo.nbStrates} strates, +${ecoInfo.biodiversiteScore} biodiversité)`);
    const newGuildes = guildes.map(g => [...g]);
    newGuildes[guildeIndex] = Array(5).fill(null);
    setGuildes(newGuildes);
    setRecoltesFaites(r => r + 1);
    setSelectedGuilde(null);
    showFeedback('success', `🌿 Guilde ${guildeIndex + 1} récoltée ! +10 crédits · +${ecoInfo.biodiversiteScore} biodiversité`);
  };

  const totalPlantes = guildes.flat().filter(p => p).length;
  const guildesCompletes = guildes.filter(g => g.every(p => p !== null)).length;

  const panelGuilde = selectedGuilde !== null ? guildes[selectedGuilde] : null;
  const ecoInfo = panelGuilde && panelGuilde.some(Boolean) ? computeEcoInfo(panelGuilde) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950">
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <Link to={createPageUrl('MicroFerme')}>
            <Button variant="outline" className="mb-4 border-green-400 text-green-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-green-300 mb-6 text-center">🌳 Forêt-Jardin — Guildes Végétales</h1>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <span className="text-3xl block mb-1">🌱</span>
              <div className="text-green-300 text-xl font-bold">{totalPlantes}/30</div>
              <div className="text-green-300/70 text-xs">Plantes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <span className="text-3xl block mb-1">🎯</span>
              <div className="text-emerald-300 text-xl font-bold">{guildesCompletes}/6</div>
              <div className="text-emerald-300/70 text-xs">Guildes complètes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <span className="text-3xl block mb-1">🦋</span>
              <div className="text-teal-300 text-xl font-bold">{biodiversite}</div>
              <div className="text-teal-300/70 text-xs">Biodiversité</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-green-400/30 text-center">
              <span className="text-3xl block mb-1">🧺</span>
              <div className="text-yellow-300 text-xl font-bold">{recoltesFaites}</div>
              <div className="text-yellow-300/70 text-xs">Récoltes</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-5">

            {/* Palette strates */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-green-400/30">
              <h3 className="text-sm font-bold text-green-300 mb-3 text-center">🌱 Sélectionne une plante</h3>
              <div className="space-y-4">
                {STRATES.map((strate) => (
                  <div key={strate.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{strate.emoji}</span>
                      <span className="text-green-300 text-xs font-bold">{strate.nom}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {strate.plantes.map(plante => (
                        <button key={plante.id}
                          onClick={() => setSelectedPlante(selectedPlante?.id === plante.id ? null : { ...plante, niveau: strate.niveau })}
                          className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 transition-all ${
                            selectedPlante?.id === plante.id
                              ? 'bg-green-500/40 border-green-300 ring-2 ring-green-400 shadow-lg scale-110'
                              : 'bg-white/5 border-white/20 hover:bg-green-500/20'
                          }`}
                          title={plante.nom}
                        >
                          <span className="text-xl">{plante.emoji}</span>
                          <span className="text-[8px] text-green-300/70 leading-tight text-center">{plante.nom}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {selectedPlante && (
                <div className="mt-3 text-xs text-green-300 p-2 bg-green-900/30 rounded-lg border border-green-400/30 text-center">
                  👆 Clique sur l'emplacement de strate dans une guilde
                </div>
              )}
            </div>

            {/* Guildes + panneau info */}
            <div className="lg:col-span-3 space-y-4">

              {/* Panneau infos éco d'une guilde */}
              <AnimatePresence>
                {selectedGuilde !== null && ecoInfo && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="bg-emerald-900/60 backdrop-blur-xl rounded-2xl p-5 border-2 border-emerald-400/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-emerald-300 font-bold text-lg">🔬 Guilde {selectedGuilde + 1} — Impact écologique</h3>
                      <button onClick={() => setSelectedGuilde(null)} className="text-emerald-300/50 hover:text-emerald-300"><X className="w-5 h-5" /></button>
                    </div>

                    {/* Jauges faune attirée */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: '🐝 Insectes', val: ecoInfo.insectes, color: 'bg-yellow-400' },
                        { label: '🐦 Oiseaux', val: ecoInfo.oiseaux, color: 'bg-blue-400' },
                        { label: '🐸 Batraciens', val: ecoInfo.batraciens, color: 'bg-green-400' },
                        { label: '🦔 Animaux utiles', val: ecoInfo.animaux, color: 'bg-orange-400' },
                      ].map(item => (
                        <div key={item.label} className="bg-black/20 rounded-xl p-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/80">{item.label}</span>
                            <span className="text-white font-bold">{item.val}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Faune attirée */}
                    {ecoInfo.faune.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs font-bold text-emerald-300 mb-2">🌿 Faune attirée par cette guilde :</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {ecoInfo.faune.map((f, i) => (
                            <div key={i} className="text-xs text-emerald-200/80 bg-black/20 rounded-lg px-2 py-1">{f}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fonctions écosystémiques */}
                    {ecoInfo.fonctions.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs font-bold text-emerald-300 mb-2">⚙️ Fonctions écosystémiques :</div>
                        <div className="space-y-2">
                          {ecoInfo.fonctions.map((f, i) => (
                            <div key={i} className="flex gap-2 p-2 bg-black/20 rounded-xl">
                              <span className="text-xl flex-shrink-0">{f.emoji}</span>
                              <div>
                                <div className="text-emerald-300 text-xs font-bold">{f.titre}</div>
                                <div className="text-emerald-200/70 text-xs">{f.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bouton récolter */}
                    {guildes[selectedGuilde]?.every(p => p !== null) && (
                      <button
                        onClick={() => recolterGuilde(selectedGuilde)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 border-2 border-yellow-300 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all"
                      >
                        🧺 Récolter la guilde {selectedGuilde + 1} (+10 crédits · +{ecoInfo.biodiversiteScore} biodiversité)
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grille des 6 guildes */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-green-400/30">
                <h3 className="text-sm font-bold text-green-300 mb-3 text-center">
                  6 Guildes — 5 strates chacune
                  {guildesCompletes > 0 && <span className="ml-2 text-yellow-300">· {guildesCompletes} prête{guildesCompletes > 1 ? 's' : ''} à récolter !</span>}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {guildes.map((guilde, guildeIdx) => {
                    const isComplete = guilde.every(p => p !== null);
                    const isSelected = selectedGuilde === guildeIdx;
                    const filled = guilde.filter(Boolean).length;
                    return (
                      <motion.div key={guildeIdx}
                        className={`rounded-xl p-3 border-2 transition-all ${
                          isSelected ? 'border-white bg-white/10 shadow-xl'
                          : isComplete ? 'border-yellow-400 bg-gradient-to-br from-yellow-500/20 to-green-500/20'
                          : 'border-green-600/50 bg-green-900/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-green-300 text-xs font-bold">Guilde {guildeIdx + 1}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-green-300/60">{filled}/5</span>
                            {isComplete && <span className="text-sm">✅</span>}
                          </div>
                        </div>

                        {/* Strates */}
                        <div className="space-y-1 mb-2">
                          {STRATES.map((strate, strateIdx) => {
                            const plante = guilde[strateIdx];
                            const canPlace = selectedPlante && selectedPlante.niveau === strate.niveau && !plante;
                            return (
                              <button key={strateIdx}
                                onClick={() => {
                                  if (plante) retirerPlante(guildeIdx, strateIdx);
                                  else if (selectedPlante) planterDansGuilde(guildeIdx, strateIdx);
                                }}
                                className={`w-full h-9 rounded-lg border flex items-center gap-2 px-2 transition-all ${
                                  plante ? 'bg-green-500/30 border-green-400 hover:bg-red-500/20'
                                  : canPlace ? 'bg-green-500/15 border-green-400/60 animate-pulse cursor-pointer'
                                  : 'bg-white/5 border-white/10'
                                }`}
                              >
                                <span className="text-sm">{strate.emoji}</span>
                                {plante ? (
                                  <>
                                    <span className="text-base">{plante.emoji}</span>
                                    <span className="text-[9px] text-green-300">{plante.nom}</span>
                                  </>
                                ) : (
                                  <span className="text-[9px] text-white/30">{strate.nom}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Actions guilde */}
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setSelectedGuilde(isSelected ? null : guildeIdx)}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold transition-all"
                          >
                            🔬 Info éco
                          </button>
                          {isComplete && (
                            <button
                              onClick={() => recolterGuilde(guildeIdx)}
                              className="flex-1 py-1.5 rounded-lg bg-yellow-500/30 hover:bg-yellow-500/50 border border-yellow-400/60 text-yellow-300 text-[10px] font-bold transition-all animate-pulse"
                            >
                              🧺 Récolter
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-green-300/50 text-center space-y-0.5">
                <div>🌳 5 strates = mini-écosystème autonome · Récolte = remise à zéro pour replanter</div>
                <div>💡 Clique sur "Info éco" pour voir l'impact sur la biodiversité</div>
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