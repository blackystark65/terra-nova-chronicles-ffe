import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Volume2, VolumeX, Eye, Trophy, Star, X, RotateCcw, Leaf, Bird } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────
// BASE DE DONNÉES BIODIVERSITÉ FORÊT EUROPÉENNE
// ─────────────────────────────────────────────
const CARTES = [
  // OISEAUX
  { id: 'rouge_gorge', nom: 'Rouge-gorge', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-orange-500 to-red-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Erithacus_rubecula_with_cocked_head.jpg/320px-Erithacus_rubecula_with_cocked_head.jpg',
    son: 'https://www.xeno-canto.org/sounds/uploaded/ZWAQHOJFLZ/XC798512-Robin%20210218%20Blackstock%20Farm%20Stansted.mp3',
    description: 'Petit oiseau au ventre orange caractéristique. Chant mélodieux et flûté.', points: 10 },
  { id: 'merle', nom: 'Merle noir', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-slate-700 to-slate-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Turdus-merula-002.jpg/320px-Turdus-merula-002.jpg',
    son: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Turdus_merula_-_Amsel.ogg',
    description: 'Plumage noir et bec jaune chez le mâle. Chant riche et mélodieux.', points: 10 },
  { id: 'pic_epeiche', nom: 'Pic épeiche', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-red-600 to-rose-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Dendrocopos_major_-_01.jpg/320px-Dendrocopos_major_-_01.jpg',
    son: null,
    description: 'Oiseau grimpeur noir et blanc. Tam-bour sur les arbres pour communiquer.', points: 15 },
  { id: 'chouette', nom: 'Chouette hulotte', categorie: 'Oiseau', emoji: '🦉', couleur: 'from-amber-700 to-yellow-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Strix_aluco_-_01.jpg/320px-Strix_aluco_-01.jpg',
    son: null,
    description: 'Rapace nocturne au "hou-hou" caractéristique. Chasseuse silencieuse.', points: 15 },
  { id: 'mesange', nom: 'Mésange bleue', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-blue-500 to-cyan-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Cyanistes_caeruleus_-_Parc_naturel_regional_du_Perche_-_02.jpg/320px-Cyanistes_caeruleus_-_Parc_naturel_regional_du_Perche_-_02.jpg',
    son: null,
    description: 'Petit oiseau bleu et jaune très actif. Aime les mangeoires en hiver.', points: 10 },
  { id: 'fauvette', nom: 'Fauvette à tête noire', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-gray-600 to-slate-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Sylvia_atricapilla_-_01.jpg/320px-Sylvia_atricapilla_-_01.jpg',
    son: null,
    description: 'Chant puissant et varié. Le mâle a une calotte noire caractéristique.', points: 12 },

  // MAMMIFÈRES
  { id: 'renard', nom: 'Renard roux', categorie: 'Mammifère', emoji: '🦊', couleur: 'from-orange-600 to-red-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rotfuchs_2.jpg/320px-Rotfuchs_2.jpg',
    son: null,
    description: 'Canidé roux agile et intelligent. Cri : glapissement caractéristique.', points: 10 },
  { id: 'chevreuil', nom: 'Chevreuil', categorie: 'Mammifère', emoji: '🦌', couleur: 'from-amber-600 to-orange-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Capreolus_capreolus_2_%28Kees_Vegelin%29.jpg/320px-Capreolus_capreolus_2_%28Kees_Vegelin%29.jpg',
    son: null,
    description: 'Petit cervidé des forêts européennes. Aboiement bref et puissant.', points: 12 },
  { id: 'herisson', nom: 'Hérisson', categorie: 'Mammifère', emoji: '🦔', couleur: 'from-yellow-700 to-amber-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Erinaceus_europaeus_LC0119.jpg/320px-Erinaceus_europaeus_LC0119.jpg',
    son: null,
    description: 'Mammifère couvert de piquants. Insectivore nocturne très utile au jardin.', points: 10 },
  { id: 'blaireau', nom: 'Blaireau', categorie: 'Mammifère', emoji: '🦡', couleur: 'from-gray-600 to-zinc-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/European_badger.jpg/320px-European_badger.jpg',
    son: null,
    description: 'Mustélidé fouisseur nocturne. Bandes blanches et noires sur la tête.', points: 15 },

  // BATRACIENS
  { id: 'grenouille', nom: 'Grenouille verte', categorie: 'Batracien', emoji: '🐸', couleur: 'from-green-500 to-emerald-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Rana_esculenta_-_Naaldwijk.jpg/320px-Rana_esculenta_-_Naaldwijk.jpg',
    son: null,
    description: 'Amphibien des mares et étangs. Croassement typique des zones humides.', points: 10 },
  { id: 'salamandre', nom: 'Salamandre tachetée', categorie: 'Batracien', emoji: '🦎', couleur: 'from-yellow-500 to-black',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Salamandra_salamandra_Luc_Viatour.jpg/320px-Salamandra_salamandra_Luc_Viatour.jpg',
    son: null,
    description: 'Amphibien noir et jaune des sous-bois humides. Peau toxique.', points: 20 },
  { id: 'triton', nom: 'Triton alpestre', categorie: 'Batracien', emoji: '🦎', couleur: 'from-blue-600 to-indigo-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ichthyosaura_alpestris_male_%28Luc_Viatour%29.jpg/320px-Ichthyosaura_alpestris_male_%28Luc_Viatour%29.jpg',
    son: null,
    description: 'Petit urodèle aux couleurs vives. Ventre orange et dos bleuté en saison.', points: 20 },

  // REPTILES
  { id: 'lezard', nom: 'Lézard vert', categorie: 'Reptile', emoji: '🦎', couleur: 'from-lime-500 to-green-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Lacerta_viridis_male_%28Luc_Viatour%29.jpg/320px-Lacerta_viridis_male_%28Luc_Viatour%29.jpg',
    son: null,
    description: 'Grand lézard vert brillant des lisières ensoleillées.', points: 12 },
  { id: 'orvet', nom: 'Orvet fragile', categorie: 'Reptile', emoji: '🐍', couleur: 'from-amber-500 to-yellow-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Anguis_fragilis.jpg/320px-Anguis_fragilis.jpg',
    son: null,
    description: 'Lézard sans pattes souvent confondu avec un serpent. Inoffensif.', points: 15 },

  // INSECTES POLLINISATEURS
  { id: 'abeille', nom: 'Abeille mellifère', categorie: 'Insecte', emoji: '🐝', couleur: 'from-yellow-400 to-amber-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_flying.jpg/320px-Apis_mellifera_flying.jpg',
    son: null,
    description: 'Pollinisatrice essentielle. Produit le miel et la cire.', points: 10 },
  { id: 'bourdon', nom: 'Bourdon des prés', categorie: 'Insecte', emoji: '🐝', couleur: 'from-yellow-500 to-orange-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Bombus_pascuorum_Niels_Elzenga.jpg/320px-Bombus_pascuorum_Niels_Elzenga.jpg',
    son: null,
    description: 'Gros pollinisateur velu. Bourdonnement caractéristique dans les fleurs.', points: 10 },
  { id: 'papillon_paon', nom: 'Paon du jour', categorie: 'Insecte', emoji: '🦋', couleur: 'from-red-600 to-purple-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Aglais_io_top.jpg/320px-Aglais_io_top.jpg',
    son: null,
    description: 'Papillon aux ailes ornées d\'ocelles ressemblant à des yeux de paon.', points: 12 },
  { id: 'coccinelle', nom: 'Coccinelle à 7 points', categorie: 'Insecte', emoji: '🐞', couleur: 'from-red-500 to-red-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Coccinella_septempunctata01.jpg/320px-Coccinella_septempunctata01.jpg',
    son: null,
    description: 'Coléoptère rouge à 7 points noirs. Prédateur des pucerons.', points: 10 },

  // FLEURS SAUVAGES ET COMESTIBLES
  { id: 'coquelicot', nom: 'Coquelicot', categorie: 'Fleur', emoji: '🌺', couleur: 'from-red-500 to-rose-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg',
    son: null,
    description: 'Fleur rouge des champs. Pétales fragiles, symbole des victimes de guerre.', points: 8 },
  { id: 'pissenlit', nom: 'Pissenlit', categorie: 'Fleur', emoji: '🌼', couleur: 'from-yellow-400 to-yellow-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Taraxacum_officinale_-_Koeh-183.jpg/320px-Taraxacum_officinale_-_Koeh-183.jpg',
    son: null,
    description: 'Plante comestible très commune. Feuilles en salade, fleurs en sirop.', points: 8 },
  { id: 'sureau', nom: 'Sureau noir', categorie: 'Fleur', emoji: '🌸', couleur: 'from-purple-600 to-indigo-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Sambucus_nigra_003.jpg/320px-Sambucus_nigra_003.jpg',
    son: null,
    description: 'Arbuste aux fleurs blanches comestibles. Baies noires pour sirops et gelées.', points: 12 },
  { id: 'primevere', nom: 'Primevère officinale', categorie: 'Fleur', emoji: '🌼', couleur: 'from-yellow-400 to-amber-500',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Primula_veris_flowers.jpg/320px-Primula_veris_flowers.jpg',
    son: null,
    description: 'Première fleur du printemps. Fleurs et feuilles comestibles, médicinales.', points: 12 },

  // PLANTES AROMATIQUES SAUVAGES
  { id: 'menthe', nom: 'Menthe sauvage', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-green-400 to-teal-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Minze.jpg/320px-Minze.jpg',
    son: null,
    description: 'Plante aromatique aux bords des ruisseaux. Odeur intense et fraîche.', points: 10 },
  { id: 'thym', nom: 'Thym serpolet', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-pink-400 to-purple-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Thymus_serpyllum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-275.jpg/320px-Thymus_serpyllum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-275.jpg',
    son: null,
    description: 'Thym sauvage des pelouses sèches. Fleurs roses et odeur puissante.', points: 10 },
  { id: 'ortie', nom: 'Ortie dioïque', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-green-600 to-emerald-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Urtica_dioica_7.jpg/320px-Urtica_dioica_7.jpg',
    son: null,
    description: 'Plante urticante très nutritive. Soupe, pesto, thé — une alliée !', points: 10 },

  // CÉRÉALES / GRAMINÉES SAUVAGES
  { id: 'froment', nom: 'Froment sauvage', categorie: 'Céréale', emoji: '🌾', couleur: 'from-yellow-600 to-amber-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Aegilops_tauschii.jpg/320px-Aegilops_tauschii.jpg',
    son: null,
    description: 'Ancêtre sauvage du blé. Pousse dans les champs et les lisières.', points: 15 },
  { id: 'seigle', nom: 'Seigle des prés', categorie: 'Céréale', emoji: '🌾', couleur: 'from-amber-500 to-yellow-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Secale_cereale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-256.jpg/320px-Secale_cereale_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-256.jpg',
    son: null,
    description: 'Graminée rustique aux épis fins et allongés. Très résistante au froid.', points: 15 },
];

const CATEGORIES = ['Tout', 'Oiseau', 'Mammifère', 'Batracien', 'Reptile', 'Insecte', 'Fleur', 'Aromatique', 'Céréale'];

const CAT_COLORS = {
  'Oiseau':     'from-blue-500 to-cyan-600',
  'Mammifère':  'from-orange-500 to-amber-700',
  'Batracien':  'from-green-500 to-teal-700',
  'Reptile':    'from-lime-500 to-green-700',
  'Insecte':    'from-yellow-400 to-orange-600',
  'Fleur':      'from-pink-500 to-rose-700',
  'Aromatique': 'from-emerald-400 to-green-700',
  'Céréale':    'from-amber-500 to-yellow-700',
};

// ──────────────────────────────
// COMPOSANT : Carte de jeu
// ──────────────────────────────
function CarteJeu({ carte, mode, onReponse, estRetournee }) {
  const [inputVal, setInputVal] = useState('');
  const [etat, setEtat] = useState(null); // 'correct' | 'faux'
  const audioRef = useRef(null);

  useEffect(() => { setInputVal(''); setEtat(null); }, [carte.id]);

  const jouerSon = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const valider = () => {
    const rep = inputVal.trim().toLowerCase();
    const correct = carte.nom.toLowerCase();
    const isOk = correct.includes(rep) && rep.length >= 3;
    setEtat(isOk ? 'correct' : 'faux');
    setTimeout(() => onReponse(isOk, carte.points), 800);
  };

  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className={`rounded-3xl overflow-hidden bg-gradient-to-br ${carte.couleur} shadow-2xl border-2 border-white/20`}>
        {/* Badge catégorie */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-white/80 text-xs font-bold uppercase tracking-widest">{carte.categorie}</span>
          <span className="text-2xl">{carte.emoji}</span>
        </div>

        {/* Mode IMAGE */}
        {mode === 'image' && (
          <div className="px-4">
            <img
              src={carte.image}
              alt="?"
              className="w-full h-48 object-cover rounded-2xl border-2 border-white/20 shadow-lg"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'; }}
            />
          </div>
        )}

        {/* Mode SON */}
        {mode === 'son' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            {carte.son ? (
              <>
                <motion.button
                  onClick={jouerSon}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 rounded-full bg-white/20 hover:bg-white/30 border-4 border-white/50 flex items-center justify-center shadow-xl transition-all"
                >
                  <Volume2 className="w-10 h-10 text-white" />
                </motion.button>
                <p className="text-white/70 text-sm">▶ Écoute et devine !</p>
                <audio ref={audioRef} src={carte.son} preload="auto" />
              </>
            ) : (
              <>
                <div className="text-8xl mb-2">{carte.emoji}</div>
                <p className="text-white/60 text-sm italic">Pas de son disponible — utilise l'indice visuel</p>
              </>
            )}
          </div>
        )}

        {/* Description / indice */}
        <div className="px-5 py-3">
          <p className="text-white/80 text-sm italic">💡 {carte.description}</p>
        </div>

        {/* Input réponse */}
        <div className="px-5 pb-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && inputVal.length >= 2 && valider()}
              placeholder={`Quel est ce ${carte.categorie.toLowerCase()} ?`}
              disabled={etat !== null}
              className={`flex-1 px-4 py-3 rounded-xl bg-white/20 border-2 text-white placeholder-white/50 outline-none text-sm font-medium transition-all ${
                etat === 'correct' ? 'border-green-300 bg-green-500/30' :
                etat === 'faux'    ? 'border-red-300 bg-red-500/30' :
                'border-white/30 focus:border-white/60'
              }`}
            />
            <motion.button
              onClick={valider}
              disabled={inputVal.length < 2 || etat !== null}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 rounded-xl bg-white/30 hover:bg-white/40 disabled:opacity-40 text-white font-bold border-2 border-white/30 transition-all"
            >
              ✓
            </motion.button>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {etat && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 p-3 rounded-xl text-center font-bold text-sm ${
                  etat === 'correct' ? 'bg-green-500/30 text-green-100 border border-green-400/50' : 'bg-red-500/30 text-red-100 border border-red-400/50'
                }`}
              >
                {etat === 'correct' ? `✅ Bravo ! C'est bien : ${carte.nom} (+${carte.points} pts)` : `❌ Dommage… C'était : ${carte.nom} (-3 pts)`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────
// COMPOSANT : Score flottant
// ──────────────────────────────
function ScoreBar({ score, correct, faux, total, actuelle }) {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 py-2">
      <div className="max-w-2xl mx-auto bg-black/60 backdrop-blur-xl rounded-2xl px-5 py-3 border border-emerald-400/30 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-300 font-bold text-lg">{score}</span>
        </div>
        <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">✅ {correct}</div>
        <div className="flex items-center gap-1 text-red-400 text-sm font-semibold">❌ {faux}</div>
        <div className="ml-auto text-white/60 text-sm">{actuelle}/{total} cartes</div>
      </div>
    </div>
  );
}

// ──────────────────────────────
// PAGE PRINCIPALE
// ──────────────────────────────
export default function BiodiversitePage() {
  const [categorieFiltree, setCategorieFiltree] = useState('Tout');
  const [modeJeu, setModeJeu] = useState(null); // null = accueil, 'image' | 'son' | 'mixte'
  const [cartesCourantes, setCartesCourantes] = useState([]);
  const [indexCarte, setIndexCarte] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [faux, setFaux] = useState(0);
  const [jeuTermine, setJeuTermine] = useState(false);

  const carteFiltrees = categorieFiltree === 'Tout'
    ? CARTES
    : CARTES.filter(c => c.categorie === categorieFiltree);

  const demarrerJeu = (mode) => {
    const melangees = [...carteFiltrees].sort(() => Math.random() - 0.5);
    setCartesCourantes(melangees);
    setIndexCarte(0);
    setScore(0);
    setCorrect(0);
    setFaux(0);
    setJeuTermine(false);
    setModeJeu(mode);
  };

  const handleReponse = (isCorrect, pts) => {
    if (isCorrect) {
      setScore(s => s + pts);
      setCorrect(c => c + 1);
    } else {
      setScore(s => Math.max(0, s - 3));
      setFaux(f => f + 1);
    }

    // Carte suivante
    setTimeout(() => {
      if (indexCarte + 1 >= cartesCourantes.length) {
        setJeuTermine(true);
      } else {
        setIndexCarte(i => i + 1);
      }
    }, 1200);
  };

  const getModeEffectif = (carte) => {
    if (modeJeu === 'mixte') return carte.son ? 'son' : 'image';
    return modeJeu;
  };

  // ── ÉCRAN FIN DE JEU ──
  if (jeuTermine) {
    const taux = Math.round((correct / cartesCourantes.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950">
        <BiolumiHeader currentPage="Biodiversite" />
        <main className="pt-24 px-4 pb-12 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-emerald-400/40 text-center shadow-2xl"
          >
            <div className="text-7xl mb-4">{taux >= 80 ? '🏆' : taux >= 50 ? '🌿' : '🌱'}</div>
            <h2 className="text-3xl font-black text-emerald-300 mb-2">Partie terminée !</h2>
            <div className="text-6xl font-black text-yellow-300 my-4">{score} pts</div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-2xl p-4 border border-green-400/40">
                <div className="text-2xl font-bold text-green-300">✅ {correct}</div>
                <div className="text-green-300/70 text-sm">Bonnes réponses</div>
              </div>
              <div className="bg-red-500/20 rounded-2xl p-4 border border-red-400/40">
                <div className="text-2xl font-bold text-red-300">❌ {faux}</div>
                <div className="text-red-300/70 text-sm">Erreurs</div>
              </div>
            </div>
            <div className={`text-lg font-semibold mb-6 p-3 rounded-xl ${
              taux >= 80 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
              taux >= 50 ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
              'bg-blue-500/20 text-blue-300 border border-blue-400/30'
            }`}>
              {taux >= 80 ? '🏆 Expert en biodiversité !' : taux >= 50 ? '🌿 Bon naturaliste !' : '🌱 Continue à apprendre !'}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => demarrerJeu(modeJeu)} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer
              </Button>
              <Button onClick={() => setModeJeu(null)} variant="outline" className="flex-1 border-emerald-400 text-emerald-300">
                Menu
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── JEU EN COURS ──
  if (modeJeu && cartesCourantes.length > 0) {
    const carteCourante = cartesCourantes[indexCarte];
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950">
        <BiolumiHeader currentPage="Biodiversite" />
        <ScoreBar score={score} correct={correct} faux={faux} total={cartesCourantes.length} actuelle={indexCarte + 1} />

        <main className="pt-28 px-4 pb-12">
          <div className="max-w-lg mx-auto">
            {/* Barre de progression */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-emerald-300/70 mb-1">
                <span>Carte {indexCarte + 1} / {cartesCourantes.length}</span>
                <button onClick={() => setModeJeu(null)} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  <X className="w-3 h-3" /> Quitter
                </button>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  animate={{ width: `${((indexCarte + 1) / cartesCourantes.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <CarteJeu
                key={carteCourante.id}
                carte={carteCourante}
                mode={getModeEffectif(carteCourante)}
                onReponse={handleReponse}
              />
            </AnimatePresence>
          </div>
        </main>
      </div>
    );
  }

  // ── MENU D'ACCUEIL ──
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600)' }} />
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/80 via-green-950/70 to-teal-950/80" />

      <BiolumiHeader currentPage="Biodiversite" />

      <main className="relative z-10 pt-24 px-4 pb-16">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 mb-6">
              <Leaf className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Jeu de Cartes Biodiversité</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
              Forêt Européenne
            </h1>
            <p className="text-emerald-300/70 text-lg max-w-2xl mx-auto">
              Reconnais les espèces par leurs sons ou leur apparence. Oiseaux, mammifères, batraciens, insectes, fleurs et plantes sauvages.
            </p>
          </motion.div>

          {/* Filtre par catégorie */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat}
                onClick={() => setCategorieFiltree(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  categorieFiltree === cat
                    ? 'bg-emerald-500 text-white border-emerald-300 shadow-lg shadow-emerald-500/30'
                    : 'bg-white/10 text-emerald-300 border-white/20 hover:bg-white/20'
                }`}
              >
                {cat} {cat !== 'Tout' && `(${CARTES.filter(c => c.categorie === cat).length})`}
              </button>
            ))}
          </motion.div>

          {/* Cartes aperçu */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
            {carteFiltrees.slice(0, 8).map((carte, i) => (
              <motion.div key={carte.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${carte.couleur} border border-white/20 shadow-lg aspect-[3/4]`}
              >
                <img src={carte.image} alt={carte.nom}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                  onError={(e) => { e.target.style.display = 'none'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-white text-xs font-bold">{carte.nom}</div>
                  <div className="text-white/60 text-[10px]">{carte.categorie}</div>
                  {carte.son && <Volume2 className="w-3 h-3 text-cyan-400 mt-1" />}
                </div>
                <div className="absolute top-2 right-2 text-lg">{carte.emoji}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Modes de jeu */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-5 mb-6">
            {[
              { mode: 'image', titre: 'Mode Image', desc: 'Identifie l\'espèce par sa photo', emoji: '👁️', couleur: 'from-blue-600 to-cyan-700' },
              { mode: 'son',   titre: 'Mode Son',   desc: 'Reconnais l\'espèce par son son', emoji: '🎵', couleur: 'from-purple-600 to-indigo-700' },
              { mode: 'mixte', titre: 'Mode Mixte', desc: 'Son + Image selon les espèces',  emoji: '🌿', couleur: 'from-emerald-600 to-teal-700' },
            ].map(({ mode, titre, desc, emoji, couleur }) => (
              <motion.button key={mode}
                onClick={() => demarrerJeu(mode)}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                className={`p-6 rounded-3xl bg-gradient-to-br ${couleur} border-2 border-white/20 text-left shadow-xl hover:shadow-2xl transition-all`}
              >
                <div className="text-5xl mb-3">{emoji}</div>
                <h3 className="text-xl font-black text-white mb-1">{titre}</h3>
                <p className="text-white/70 text-sm mb-4">{desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">{carteFiltrees.length} cartes</span>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">Jouer →</span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(CAT_COLORS).map(([cat, couleur]) => {
              const count = CARTES.filter(c => c.categorie === cat).length;
              return (
                <motion.div key={cat}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => setCategorieFiltree(cat)}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${couleur} cursor-pointer border border-white/20 shadow-lg text-center`}
                >
                  <div className="text-2xl font-black text-white">{count}</div>
                  <div className="text-white/80 text-xs">{cat}s</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}