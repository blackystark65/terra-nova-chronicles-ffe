import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Volume2, Star, X, RotateCcw, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CARTES, CATEGORIES, CAT_COLORS } from '@/components/biodiversite/CartesData';

// ──────────────────────────────
// COMPOSANT : Carte de jeu
// ──────────────────────────────
// Sons Wikimedia Commons — URLs .ogg vérifiées (pages wiki confirmées)
const SONS_OISEAUX = {
  'rouge_gorge':       'https://s17.aconvert.com/convert/p3r68-cdx67/nj6nw-fymv7.mp3',
  'merle':             'https://s31.aconvert.com/convert/p3r68-cdx67/6bp9l-w9fjw.mp3',
  'pic_epeiche':       'https://s17.aconvert.com/convert/p3r68-cdx67/blcj4-6574o.mp3',
  'chouette':          'https://s19.aconvert.com/convert/p3r68-cdx67/f16j0-p2snp.mp3',
  'mesange':           'https://s19.aconvert.com/convert/p3r68-cdx67/fifik-w5txm.mp3',
  'fauvette':          'https://s17.aconvert.com/convert/p3r68-cdx67/ukme3-yq3oe.mp3',
  'hirondelle':        'https://upload.wikimedia.org/wikipedia/commons/4/40/Delichon_urbicum_-_Common_House_Martin_XC125791.ogg',
  'cigogne':           'https://upload.wikimedia.org/wikipedia/commons/a/a1/Ciconia_ciconia.ogg',
  'martin_pecheur':    'https://s19.aconvert.com/convert/p3r68-cdx67/ycmkp-quj9c.mp3',
  'faucon_crecerelle': 'https://s19.aconvert.com/convert/p3r68-cdx67/8uci4-eor6p.mp3',
  'milan_noir':        'https://upload.wikimedia.org/wikipedia/commons/a/ab/Milvus_migrans_-_Black_Kite_XC125790.ogg',
  'buse':              'https://s31.aconvert.com/convert/p3r68-cdx67/9aiae-qbova.mp3',
  'pic_vert':          'https://upload.wikimedia.org/wikipedia/commons/b/b1/Picus_viridis_%28call%29.ogg',
  'roitelet':          'https://upload.wikimedia.org/wikipedia/commons/f/f3/Regulus_regulus.ogg',
  'tourterelle':       'https://upload.wikimedia.org/wikipedia/commons/8/8b/Streptopelia_turtur.ogg',
  'bergeronnette':     'https://upload.wikimedia.org/wikipedia/commons/2/2e/Motacilla_alba.ogg',
};

function CarteJeu({ carte, mode, onReponse }) {
  const [inputVal, setInputVal] = useState('');
  const [etat, setEtat] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingSon, setLoadingSon] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setInputVal('');
    setEtat(null);
    setIsPlaying(false);
    setLoadingSon(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
  }, [carte.id]);

  const sonUrl = SONS_OISEAUX[carte.id] || null;
  const hasSon = carte.categorie === 'Oiseau' && !!sonUrl;

  const jouerSon = () => {
    const audio = audioRef.current;
    if (!audio || !sonUrl) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    if (!audio.src || audio.src === window.location.href) {
      audio.src = sonUrl;
      audio.load();
    }

    setLoadingSon(true);
    audio.play()
      .then(() => { setIsPlaying(true); setLoadingSon(false); })
      .catch((e) => { console.error('Audio error:', e); setIsPlaying(false); setLoadingSon(false); });
  };

  const normalise = (str) =>
    str.trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
      .replace(/[^a-z0-9\s]/g, '');

  const valider = () => {
    const rep = normalise(inputVal);
    if (rep.length < 2) return;
    const nomFR = normalise(carte.nom);
    const nomEN = normalise(carte.nom_en || '');
    // Accepte si la réponse est contenue dans le nom FR ou EN (au moins 3 lettres)
    const isOk = rep.length >= 3 && (nomFR.includes(rep) || nomEN.includes(rep));
    setEtat(isOk ? 'correct' : 'faux');
    setTimeout(() => onReponse(isOk, carte.points), 900);
  };

  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Élément audio HTML natif — géré par le navigateur directement */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => { setIsPlaying(false); setLoadingSon(false); }}
        preload="none"
      />
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
              key={carte.id}
              src={carte.image}
              alt="?"
              className="w-full h-48 object-cover rounded-2xl border-2 border-white/20 shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{ display: 'none' }}
              className="w-full h-48 rounded-2xl border-2 border-white/20 shadow-lg items-center justify-center text-8xl">
              {carte.emoji}
            </div>
          </div>
        )}

        {/* Mode SON */}
        {mode === 'son' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            {hasSon ? (
              <>
                <motion.button
                  onClick={jouerSon}
                  disabled={loadingSon}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isPlaying ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className={`w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-xl transition-all ${
                    isPlaying ? 'bg-white/40 border-white/80' : 'bg-white/20 hover:bg-white/30 border-white/50'
                  }`}
                >
                  {loadingSon ? (
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Volume2 className="w-10 h-10 text-white" />
                  )}
                </motion.button>
                <p className="text-white/70 text-sm">
                  {loadingSon ? '⏳ Chargement...' : isPlaying ? '🔊 En cours...' : '▶ Écoute et devine !'}
                </p>
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
              placeholder="Tape le nom en français ou anglais..."
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
                {etat === 'correct'
                  ? `✅ Bravo ! ${carte.nom} · ${carte.nom_en} (+${carte.points} pts)`
                  : `❌ C'était : ${carte.nom} · ${carte.nom_en} (-3 pts)`}
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
    if (modeJeu === 'mixte') return carte.categorie === 'Oiseau' ? 'son' : 'image';
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
              80+ espèces d'Europe. Oiseaux, mammifères, batraciens, reptiles, insectes, fleurs sauvages, arbustes, arbres fruitiers et plantes aromatiques.
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
                  <div className="text-cyan-300/80 text-[10px] italic">{carte.nom_en}</div>
                  {carte.categorie === 'Oiseau' && <Volume2 className="w-3 h-3 text-cyan-400 mt-1" />}
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
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
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