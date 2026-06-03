import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Lightbulb, Shuffle, BookOpen } from 'lucide-react';
import { SECTEURS, ECO_PAIRS_ALL, getPairsBySecteur } from '../data/ecoPairsData';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Grille simple en rangées : toutes les tuiles sont sur le même layer (layer=0)
function buildLevel(pairs) {
  // On prend jusqu'à 8 paires (16 tuiles ravageur+prédateur = 16 cases)
  const selected = shuffle([...pairs]).slice(0, 8);

  // Liste de tiles : pour chaque paire, 1 ravageur + 1 prédateur
  const pairTiles = [];
  selected.forEach(pair => {
    pairTiles.push({ pairId: pair.id, type: 'ravageur', data: pair.ravageur });
    pairTiles.push({ pairId: pair.id, type: 'predateur', data: pair.predateur });
  });

  // Mélanger puis placer en grille 4 colonnes × N rangées, layer=0
  const shuffled = shuffle(pairTiles);

  // 4 colonnes, chaque tuile accessible (pas de layer au dessus)
  const COLS = 4;
  return shuffled.map((tile, index) => ({
    ...tile,
    id: `tile-${index}`,
    col: index % COLS,
    row: Math.floor(index / COLS),
    layer: 0,
    matched: false,
    selected: false,
  }));
}

function isFree(tile, tiles) {
  // Dans ce layout simple, toutes les tuiles sont libres (pas de blocage)
  return !tile.matched;
}

const SECTEUR_COLORS = {
  maraichage:    { bg: 'from-green-900 to-emerald-900',   border: 'border-green-500/50',  badge: 'bg-green-500/20 text-green-300' },
  arboriculture: { bg: 'from-red-900 to-orange-900',      border: 'border-red-500/50',    badge: 'bg-red-500/20 text-red-300' },
  viticulture:   { bg: 'from-purple-900 to-violet-900',   border: 'border-purple-500/50', badge: 'bg-purple-500/20 text-purple-300' },
  pepiniere:     { bg: 'from-teal-900 to-cyan-900',       border: 'border-teal-500/50',   badge: 'bg-teal-500/20 text-teal-300' },
};

function TileCard({ tile, isSelected, onSelect, photos }) {
  const colors = SECTEUR_COLORS[tile.data?.secteur] || SECTEUR_COLORS.maraichage;
  const photoUrl = photos?.[`${tile.pairId}__${tile.type}`];

  return (
    <motion.button
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: tile.matched ? 0 : 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => !tile.matched && onSelect(tile.id)}
      disabled={tile.matched}
      className={`relative w-full aspect-[3/4] rounded-2xl border-2 transition-all
        ${isSelected
          ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] bg-gradient-to-br from-amber-900 to-yellow-900'
          : `bg-gradient-to-br ${SECTEUR_COLORS[tile.data?.secteur]?.bg || 'from-slate-800 to-slate-900'} ${SECTEUR_COLORS[tile.data?.secteur]?.border || 'border-white/10'}`
        }
        ${tile.matched ? 'pointer-events-none opacity-0' : ''}
      `}
    >
      <div className="flex flex-col items-center justify-center h-full p-2 gap-1">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={tile.data?.nom}
            className="w-14 h-14 object-cover rounded-xl mb-1 border border-white/20"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span className="text-3xl mb-1">{tile.data?.emoji}</span>
        )}
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${SECTEUR_COLORS[tile.data?.secteur]?.badge || 'bg-white/10 text-white/60'}`}>
          {tile.type === 'ravageur' ? '🦟 Ravageur' : '🌿 Auxiliaire'}
        </span>
        <span className="text-white text-[10px] font-semibold text-center leading-tight mt-0.5 px-1">
          {tile.data?.nom}
        </span>
        <span className="text-white/40 text-[8px] italic text-center leading-tight">
          {tile.data?.nomLatin}
        </span>
      </div>
    </motion.button>
  );
}

function MatchModal({ pair, onClose }) {
  if (!pair) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.7, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="bg-gradient-to-br from-emerald-900 to-teal-900 border border-emerald-400/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
      >
        <div className="text-center mb-4">
          <span className="text-4xl">🎯</span>
          <h3 className="text-white font-black text-xl mt-2">Paire trouvée !</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-500/20 rounded-2xl p-3 border border-red-400/30">
            <p className="text-red-300 text-xs font-bold mb-1">🦟 Ravageur</p>
            <p className="text-white font-bold text-sm">{pair.ravageur.nom}</p>
            <p className="text-white/50 text-xs italic">{pair.ravageur.nomLatin}</p>
            <p className="text-white/70 text-xs mt-2">{pair.ravageur.description}</p>
          </div>
          <div className="bg-green-500/20 rounded-2xl p-3 border border-green-400/30">
            <p className="text-green-300 text-xs font-bold mb-1">🌿 Auxiliaire</p>
            <p className="text-white font-bold text-sm">{pair.predateur.nom}</p>
            <p className="text-white/50 text-xs italic">{pair.predateur.nomLatin}</p>
            <p className="text-white/70 text-xs mt-2">{pair.predateur.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50 text-white font-bold text-sm transition-all"
        >
          Continuer →
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function MahjongEcoPage() {
  const [secteur, setSecteur] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matchedPair, setMatchedPair] = useState(null);
  const [gameWon, setGameWon] = useState(false);
  const [hint, setHint] = useState(null);
  const [photos, setPhotos] = useState({});

  // Charger les photos depuis localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ecoPairsPhotos') || '{}');
      setPhotos(saved);
    } catch {
      setPhotos({});
    }
  }, []);

  const pairs = useMemo(() => secteur ? getPairsBySecteur(secteur) : [], [secteur]);
  const total = Math.min(pairs.length, 8);

  const startGame = (secteurId) => {
    setSecteur(secteurId);
    const pairsForSecteur = getPairsBySecteur(secteurId);
    setTiles(buildLevel(pairsForSecteur));
    setSelected([]);
    setMatched(0);
    setMoves(0);
    setGameWon(false);
    setHint(null);
  };

  const handleSelect = (tileId) => {
    const tile = tiles.find(t => t.id === tileId);
    if (!tile || tile.matched) return;
    if (selected.includes(tileId)) {
      setSelected([]);
      return;
    }
    if (selected.length === 0) {
      setSelected([tileId]);
      return;
    }
    // 2e sélection
    const first = tiles.find(t => t.id === selected[0]);
    const second = tile;
    setMoves(m => m + 1);
    setSelected([]);

    if (first.pairId === second.pairId && first.type !== second.type) {
      // Match !
      const pair = ECO_PAIRS_ALL.find(p => p.id === first.pairId);
      setMatchedPair(pair);
      setTiles(prev => prev.map(t =>
        t.id === first.id || t.id === second.id ? { ...t, matched: true } : t
      ));
      const newMatched = matched + 1;
      setMatched(newMatched);
      if (newMatched >= total) {
        setTimeout(() => setGameWon(true), 800);
      }
    }
  };

  const handleHint = () => {
    // Trouve la première paire non matchée
    const active = tiles.filter(t => !t.matched);
    const pairIds = [...new Set(active.map(t => t.pairId))];
    if (pairIds.length === 0) return;
    const hintPairId = pairIds[0];
    const hintTiles = active.filter(t => t.pairId === hintPairId).map(t => t.id);
    setHint(hintTiles);
    setTimeout(() => setHint(null), 2000);
  };

  const activeTiles = tiles.filter(t => !t.matched);

  if (!secteur) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/Jeux" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">🀄 Éco-Mahjong</h1>
              <p className="text-white/50 text-sm">Associe chaque ravageur à son auxiliaire naturel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(SECTEURS).map(s => {
              const colors = SECTEUR_COLORS[s.id];
              const count = getPairsBySecteur(s.id).length;
              return (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startGame(s.id)}
                  className={`p-6 rounded-3xl border-2 bg-gradient-to-br ${colors.bg} ${colors.border} text-left transition-all`}
                >
                  <span className="text-5xl block mb-3">{s.emoji}</span>
                  <h3 className="text-white font-black text-xl mb-1">{s.nom}</h3>
                  <p className="text-white/60 text-sm mb-3">{s.description}</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                    {count} paires à trouver
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Comment jouer ?</h3>
            <ul className="text-white/60 text-sm space-y-1">
              <li>• Clique sur un ravageur (🦟) puis sur son auxiliaire naturel (🌿)</li>
              <li>• Si c'est la bonne paire, les tuiles disparaissent</li>
              <li>• Utilise l'indice si tu bloques !</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 p-3 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setSecteur(null)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-white font-black text-lg">{SECTEURS[secteur]?.emoji} {SECTEURS[secteur]?.nom}</h2>
              <p className="text-white/40 text-xs">{matched}/{total} paires trouvées • {moves} coups</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleHint}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition-all"
              title="Indice"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
            <button
              onClick={() => startGame(secteur)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Recommencer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            animate={{ width: `${(matched / total) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>

        {/* Grille */}
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          <AnimatePresence>
            {tiles.map(tile => (
              !tile.matched && (
                <TileCard
                  key={tile.id}
                  tile={tile}
                  isSelected={selected.includes(tile.id) || hint?.includes(tile.id)}
                  onSelect={handleSelect}
                  photos={photos}
                />
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Victoire */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.7, y: 40 }} animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-emerald-900 to-teal-900 border border-emerald-400/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              >
                <span className="text-6xl block mb-4">🏆</span>
                <h3 className="text-white font-black text-2xl mb-2">Bravo !</h3>
                <p className="text-white/70 mb-1">Tu as trouvé toutes les paires en</p>
                <p className="text-emerald-300 font-black text-3xl mb-6">{moves} coups</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => startGame(secteur)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Shuffle className="w-4 h-4" /> Rejouer
                  </button>
                  <button
                    onClick={() => setSecteur(null)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all"
                  >
                    Changer de secteur
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal match */}
        <AnimatePresence>
          {matchedPair && (
            <MatchModal pair={matchedPair} onClose={() => setMatchedPair(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}