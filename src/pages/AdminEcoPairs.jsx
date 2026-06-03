import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Search, ChevronDown, ChevronUp, Image, Check, X } from 'lucide-react';
import { ECO_PAIRS_ALL, SECTEURS } from '../data/ecoPairsData';

const SECTEUR_COLORS = {
  maraichage:    'from-green-900 to-emerald-900',
  arboriculture: 'from-red-900 to-orange-900',
  viticulture:   'from-purple-900 to-violet-900',
  pepiniere:     'from-teal-900 to-cyan-900',
};

// Charge les URLs sauvegardées dans localStorage
function loadSavedPhotos() {
  try {
    return JSON.parse(localStorage.getItem('ecoPairsPhotos') || '{}');
  } catch {
    return {};
  }
}

function savePhotos(photos) {
  localStorage.setItem('ecoPairsPhotos', JSON.stringify(photos));
}

// Génère une clé unique pour chaque photo
function photoKey(pairId, role) {
  return `${pairId}__${role}`;
}

// Composant prévisualisation d'image avec gestion d'erreur
function PhotoPreview({ url, fallbackEmoji, label }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [url]);

  if (!url) {
    return (
      <div className="w-20 h-20 rounded-xl bg-slate-700 flex flex-col items-center justify-center border border-white/10">
        <span className="text-2xl">{fallbackEmoji}</span>
        <span className="text-white/30 text-[9px] mt-1">Sans photo</span>
      </div>
    );
  }

  return (
    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-slate-700">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}
      {!error ? (
        <img
          src={url}
          alt={label}
          className={`w-full h-full object-cover transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <span className="text-2xl">{fallbackEmoji}</span>
          <span className="text-red-400 text-[9px] mt-1">URL invalide</span>
        </div>
      )}
      {loaded && !error && (
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
}

function PairEditor({ pair, photos, onPhotoChange }) {
  const [open, setOpen] = useState(false);
  const [ravUrl, setRavUrl] = useState(photos[photoKey(pair.id, 'ravageur')] || '');
  const [predUrl, setPredUrl] = useState(photos[photoKey(pair.id, 'predateur')] || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onPhotoChange(pair.id, 'ravageur', ravUrl.trim());
    onPhotoChange(pair.id, 'predateur', predUrl.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasPhoto = photos[photoKey(pair.id, 'ravageur')] || photos[photoKey(pair.id, 'predateur')];

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <PhotoPreview url={photos[photoKey(pair.id, 'ravageur')]} fallbackEmoji={pair.ravageur.emoji} label={pair.ravageur.nom} />
            <PhotoPreview url={photos[photoKey(pair.id, 'predateur')]} fallbackEmoji={pair.predateur.emoji} label={pair.predateur.nom} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold">{pair.ravageur.nom}</span>
              <span className="text-white/30">→</span>
              <span className="text-emerald-300 text-sm font-bold">{pair.predateur.nom}</span>
            </div>
            <div className="text-white/40 text-xs italic">{pair.ravageur.nomLatin} / {pair.predateur.nomLatin}</div>
            {hasPhoto && <span className="text-green-400 text-[10px]">✅ Photos ajoutées</span>}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-black/20 space-y-4 border-t border-white/5">
              {/* Ravageur */}
              <div>
                <label className="text-red-300 text-xs font-bold mb-2 block flex items-center gap-1">
                  <Image className="w-3 h-3" /> Photo du ravageur — {pair.ravageur.nom}
                </label>
                <div className="flex gap-3 items-start">
                  <PhotoPreview url={ravUrl} fallbackEmoji={pair.ravageur.emoji} label={pair.ravageur.nom} />
                  <div className="flex-1">
                    <input
                      type="url"
                      value={ravUrl}
                      onChange={e => setRavUrl(e.target.value)}
                      placeholder="https://... (URL de l'image)"
                      className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2 text-xs placeholder:text-white/30 focus:outline-none focus:border-red-400/50"
                    />
                    <p className="text-white/30 text-[10px] mt-1">{pair.ravageur.description}</p>
                  </div>
                </div>
              </div>

              {/* Prédateur / auxiliaire */}
              <div>
                <label className="text-emerald-300 text-xs font-bold mb-2 block flex items-center gap-1">
                  <Image className="w-3 h-3" /> Photo de l'auxiliaire — {pair.predateur.nom}
                </label>
                <div className="flex gap-3 items-start">
                  <PhotoPreview url={predUrl} fallbackEmoji={pair.predateur.emoji} label={pair.predateur.nom} />
                  <div className="flex-1">
                    <input
                      type="url"
                      value={predUrl}
                      onChange={e => setPredUrl(e.target.value)}
                      placeholder="https://... (URL de l'image)"
                      className="w-full rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2 text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50"
                    />
                    <p className="text-white/30 text-[10px] mt-1">{pair.predateur.description}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  saved
                    ? 'bg-green-500/30 text-green-300 border border-green-400/30'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
                }`}
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {saved ? 'Sauvegardé !' : 'Sauvegarder les photos'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminEcoPairsPage() {
  const [photos, setPhotos] = useState(loadSavedPhotos());
  const [search, setSearch] = useState('');
  const [selectedSecteur, setSelectedSecteur] = useState('all');

  const handlePhotoChange = (pairId, role, url) => {
    const key = photoKey(pairId, role);
    const newPhotos = { ...photos, [key]: url };
    setPhotos(newPhotos);
    savePhotos(newPhotos);
  };

  const filtered = ECO_PAIRS_ALL.filter(pair => {
    const matchSecteur = selectedSecteur === 'all' || pair.secteur === selectedSecteur;
    const matchSearch = !search.trim() ||
      pair.ravageur.nom.toLowerCase().includes(search.toLowerCase()) ||
      pair.predateur.nom.toLowerCase().includes(search.toLowerCase()) ||
      pair.ravageur.nomLatin.toLowerCase().includes(search.toLowerCase()) ||
      pair.predateur.nomLatin.toLowerCase().includes(search.toLowerCase());
    return matchSecteur && matchSearch;
  });

  const totalPhotos = Object.values(photos).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">🖼️ Admin — Photos Éco-Pairs</h1>
            <p className="text-white/50 text-sm">{totalPhotos} photo{totalPhotos !== 1 ? 's' : ''} ajoutée{totalPhotos !== 1 ? 's' : ''} sur {ECO_PAIRS_ALL.length * 2} possible{ECO_PAIRS_ALL.length * 2 !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Info */}
        <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
          💡 Les photos sont stockées localement dans ce navigateur. Utilise des URLs d'images publiques (Unsplash, Wikipedia, etc.) pour illustrer chaque espèce.
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une espèce..."
              className="w-full rounded-xl bg-black/30 border border-white/20 text-white pl-8 pr-3 py-2 text-xs placeholder:text-white/30 focus:outline-none"
            />
          </div>
          <select
            value={selectedSecteur}
            onChange={e => setSelectedSecteur(e.target.value)}
            className="rounded-xl bg-black/30 border border-white/20 text-white px-3 py-2 text-xs focus:outline-none"
          >
            <option value="all">Tous les secteurs</option>
            {Object.values(SECTEURS).map(s => (
              <option key={s.id} value={s.id}>{s.emoji} {s.nom}</option>
            ))}
          </select>
        </div>

        {/* Liste des paires */}
        <div className="space-y-2">
          {Object.values(SECTEURS).map(secteur => {
            const secteurPairs = filtered.filter(p => p.secteur === secteur.id);
            if (secteurPairs.length === 0) return null;
            return (
              <div key={secteur.id}>
                <div className={`px-3 py-2 rounded-xl bg-gradient-to-r ${SECTEUR_COLORS[secteur.id]} mb-2`}>
                  <span className="text-white font-bold text-sm">{secteur.emoji} {secteur.nom}</span>
                  <span className="text-white/50 text-xs ml-2">({secteurPairs.length} paire{secteurPairs.length !== 1 ? 's' : ''})</span>
                </div>
                <div className="space-y-1 ml-2">
                  {secteurPairs.map(pair => (
                    <PairEditor
                      key={pair.id}
                      pair={pair}
                      photos={photos}
                      onPhotoChange={handlePhotoChange}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}