import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Camera, Trophy, Leaf, Bug, Microscope, Star, ChevronDown, ChevronUp, Upload, X, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── Données des espèces cibles ──
const ESPECES = {
  transformateurs: {
    label: 'Transformateurs — Macrofaune',
    emoji: '🪱',
    color: 'from-amber-600 to-orange-700',
    borderColor: 'border-amber-400/40',
    textColor: 'text-amber-300',
    bgColor: 'bg-amber-500/10',
    role: 'Broyeurs : ingèrent les débris végétaux grossiers et les transforment en déjections riches.',
    points: 10,
    especes: [
      { id: 'lombric', nom: 'Lombric (ver de terre)', emoji: '🪱', difficulte: 'facile', expert: false, description: 'Aère et enrichit le sol, roi de la décomposition.' },
      { id: 'cloporte', nom: 'Cloporte', emoji: '🦗', difficulte: 'facile', expert: false, description: 'Crustacé terrestre, mange les végétaux en décomposition.' },
      { id: 'diplopode', nom: 'Diplopode (mille-pattes)', emoji: '🐛', difficulte: 'moyen', expert: false, description: 'Broie les feuilles mortes, plusieurs centaines de pattes.' },
      { id: 'limace', nom: 'Limace', emoji: '🐌', difficulte: 'facile', expert: false, description: 'Décompose matières végétales humides.' },
    ]
  },
  predateurs: {
    label: 'Prédateurs — Mésofaune & Macrofaune',
    emoji: '🦂',
    color: 'from-red-700 to-rose-800',
    borderColor: 'border-red-400/40',
    textColor: 'text-red-300',
    bgColor: 'bg-red-500/10',
    role: 'Régulent la population de décomposeurs et aèrent le sol.',
    points: 20,
    especes: [
      { id: 'carabe', nom: 'Carabe doré', emoji: '🪲', difficulte: 'moyen', expert: false, description: 'Coléoptère prédateur à reflets métalliques dorés.' },
      { id: 'staphylin', nom: 'Staphylin', emoji: '🪲', difficulte: 'moyen', expert: false, description: 'Petit coléoptère chasseur, élytres très courts.' },
      { id: 'araignee', nom: 'Araignée', emoji: '🕷️', difficulte: 'facile', expert: false, description: 'Capture les insectes décomposeurs dans sa toile.' },
      { id: 'pseudoscorpion', nom: 'Pseudoscorpion', emoji: '🦂', difficulte: 'expert', expert: true, description: '⭐ Défi Expert : minuscule prédateur sans dard, rarissime !' },
    ]
  },
  nettoyeurs: {
    label: 'Nettoyeurs — Microfaune & Champignons',
    emoji: '🍄',
    color: 'from-emerald-700 to-teal-800',
    borderColor: 'border-emerald-400/40',
    textColor: 'text-emerald-300',
    bgColor: 'bg-emerald-500/10',
    role: 'Dégradation chimique des matières organiques à l\'échelle microscopique.',
    points: 15,
    especes: [
      { id: 'champignon', nom: 'Champignon / Mycélium', emoji: '🍄', difficulte: 'facile', expert: false, description: 'Photos de mycélium (filaments blancs) acceptées.' },
      { id: 'collembole', nom: 'Collembole', emoji: '🦟', difficulte: 'expert', expert: true, description: '⭐ Défi Expert : micro-arthropode sauteur, visible à 1000x.' },
    ]
  }
};

const DIFFICULTE_COLORS = {
  facile: 'bg-green-500/20 text-green-300 border-green-400/30',
  moyen: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  expert: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
};

// ── Composant carte d'espèce ──
function CarteEspece({ espece, captured, onCapture, teamColor }) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(captured?.photo || null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPhotoUrl(file_url);
      onCapture(espece.id, file_url);
    } finally {
      setUploading(false);
      setShowUpload(false);
    }
  };

  return (
    <motion.div
      layout
      className={`relative rounded-2xl border p-4 transition-all duration-300 ${
        captured
          ? `${teamColor.bg} ${teamColor.border} shadow-lg`
          : 'bg-white/5 border-white/10'
      }`}
    >
      {captured && (
        <div className={`absolute top-2 right-2 p-1 rounded-full ${teamColor.badge}`}>
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="flex items-start gap-3 mb-2">
        <span className="text-3xl flex-shrink-0">{espece.emoji}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm leading-tight">{espece.nom}</h4>
          <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{espece.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${DIFFICULTE_COLORS[espece.difficulte]}`}>
          {espece.difficulte}{espece.expert ? ' ⭐' : ''}
        </span>
        {captured && photoUrl ? (
          <button onClick={() => window.open(photoUrl, '_blank')} className="text-xs text-blue-300 hover:text-blue-200 underline">
            📸 Voir photo
          </button>
        ) : (
          <div>
            {showUpload ? (
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${teamColor.btn}`}>
                  {uploading ? '⏳ Upload…' : <><Upload className="w-3 h-3" />Photo</>}
                </span>
              </label>
            ) : (
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs transition-all"
              >
                <Camera className="w-3 h-3" /> Capturer
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Composant groupe d'espèces ──
function GroupeEspeces({ groupKey, groupe, captures, onCapture, teamColor }) {
  const [open, setOpen] = useState(true);
  const nbCaptures = groupe.especes.filter(e => captures[e.id]).length;

  return (
    <div className={`rounded-2xl border ${groupe.borderColor} overflow-hidden mb-4`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between p-4 ${groupe.bgColor} hover:bg-white/5 transition-all`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{groupe.emoji}</span>
          <div className="text-left">
            <h3 className={`font-black text-sm ${groupe.textColor}`}>{groupe.label}</h3>
            <p className="text-white/50 text-xs">{groupe.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${groupe.bgColor} ${groupe.textColor} border ${groupe.borderColor}`}>
            {nbCaptures}/{groupe.especes.length} • {groupe.points} pts/espèce
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 grid sm:grid-cols-2 gap-3">
              {groupe.especes.map(espece => (
                <CarteEspece
                  key={espece.id}
                  espece={espece}
                  captured={captures[espece.id]}
                  onCapture={onCapture}
                  teamColor={teamColor}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Calcul du score ──
function calcScore(captures) {
  let score = 0;
  let expertBonus = 0;
  let chainBonus = 0;

  Object.entries(ESPECES).forEach(([groupKey, groupe]) => {
    groupe.especes.forEach(espece => {
      if (captures[espece.id]) {
        score += groupe.points;
        if (espece.expert) expertBonus += 30;
      }
    });
  });

  // Bonus chaîne trophique : prédateur + proie capturés
  const hasPredateur = ['carabe', 'staphylin', 'araignee', 'pseudoscorpion'].some(id => captures[id]);
  const hasProie = ['lombric', 'cloporte', 'diplopode', 'collembole'].some(id => captures[id]);
  if (hasPredateur && hasProie) chainBonus = 50;

  // Bonus biodiversité : toutes les catégories représentées
  const allGroups = Object.values(ESPECES).every(g => g.especes.some(e => captures[e.id]));
  const biodiversiteBonus = allGroups ? 100 : 0;

  return { score: score + expertBonus + chainBonus + biodiversiteBonus, expertBonus, chainBonus, biodiversiteBonus };
}

// ── Composant panneau équipe ──
function PanneauEquipe({ team, captures, onCapture }) {
  const { score, expertBonus, chainBonus, biodiversiteBonus } = calcScore(captures);
  const totalEspeces = Object.values(ESPECES).reduce((acc, g) => acc + g.especes.length, 0);
  const totalCaptures = Object.keys(captures).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header équipe */}
      <div className={`p-4 rounded-2xl mb-4 bg-gradient-to-r ${team.gradient} border ${team.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{team.emoji}</span>
            <div>
              <h2 className="font-black text-white text-lg">{team.name}</h2>
              <p className="text-white/70 text-xs">{totalCaptures}/{totalEspeces} espèces capturées</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white">{score}</div>
            <div className="text-white/70 text-xs">points</div>
          </div>
        </div>
        {/* Bonus */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {expertBonus > 0 && <span className="px-2 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs">⭐ Expert +{expertBonus}</span>}
          {chainBonus > 0 && <span className="px-2 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs">🔗 Chaîne trophique +{chainBonus}</span>}
          {biodiversiteBonus > 0 && <span className="px-2 py-1 rounded-full bg-green-500/30 text-green-200 text-xs">🌿 Biodiversité +{biodiversiteBonus}</span>}
        </div>
        {/* Barre de progression */}
        <div className="mt-3 w-full bg-black/30 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-white/80"
            animate={{ width: `${(totalCaptures / totalEspeces) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Groupes d'espèces */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(ESPECES).map(([key, groupe]) => (
          <GroupeEspeces
            key={key}
            groupKey={key}
            groupe={groupe}
            captures={captures}
            onCapture={onCapture}
            teamColor={team}
          />
        ))}
      </div>
    </div>
  );
}

// ── Page principale ──
const TEAMS = [
  {
    id: 'team1',
    name: 'Équipe 1 — Les Fouisseurs',
    emoji: '🦔',
    gradient: 'from-blue-700/80 to-cyan-800/80',
    border: 'border-blue-400/40',
    bg: 'bg-blue-500/20',
    badge: 'bg-blue-500',
    btn: 'bg-blue-500/30 text-blue-200 hover:bg-blue-500/50',
  },
  {
    id: 'team2',
    name: 'Équipe 2 — Les Mycorhizes',
    emoji: '🍄',
    gradient: 'from-purple-700/80 to-pink-800/80',
    border: 'border-purple-400/40',
    bg: 'bg-purple-500/20',
    badge: 'bg-purple-500',
    btn: 'bg-purple-500/30 text-purple-200 hover:bg-purple-500/50',
  },
];

export default function BioFocusPage() {
  const [activeTeam, setActiveTeam] = useState(0);
  const [captures, setCaptures] = useState({ team1: {}, team2: {} });
  const [showRules, setShowRules] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleCapture = (teamId, especeId, photoUrl) => {
    setCaptures(prev => ({
      ...prev,
      [teamId]: { ...prev[teamId], [especeId]: { photo: photoUrl, timestamp: new Date().toISOString() } }
    }));
  };

  const team1Score = calcScore(captures.team1);
  const team2Score = calcScore(captures.team2);
  const winner = team1Score.score > team2Score.score ? TEAMS[0] : team2Score.score > team1Score.score ? TEAMS[1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-emerald-950">
      <BiolumiHeader currentPage="BioFocus" />

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 mb-4">
            <Microscope className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-300 font-semibold text-sm">Jeu de Terrain — Photographie ×1000</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-300 via-green-300 to-emerald-300 bg-clip-text text-transparent mb-2">
            🔬 Bio-Focus
          </h1>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Les Enquêteurs de l'Humus — Photographiez les acteurs invisibles de la décomposition
          </p>
          <div className="flex gap-3 justify-center mt-4 flex-wrap">
            <button
              onClick={() => setShowRules(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-sm border border-white/10 transition-all"
            >
              📋 Règles du jeu
            </button>
            <button
              onClick={() => setShowResult(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm border border-amber-400/30 transition-all"
            >
              <Trophy className="w-4 h-4" /> Scores
            </button>
          </div>
        </motion.div>

        {/* Onglets équipes */}
        <div className="flex gap-3 mb-6 justify-center">
          {TEAMS.map((team, i) => (
            <button
              key={team.id}
              onClick={() => setActiveTeam(i)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${
                activeTeam === i
                  ? `bg-gradient-to-r ${team.gradient} ${team.border} text-white shadow-lg`
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              <span>{team.emoji}</span>
              <span className="hidden sm:inline">{team.name}</span>
              <span className="sm:hidden">Équipe {i + 1}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${activeTeam === i ? 'bg-white/20' : 'bg-white/10'}`}>
                {calcScore(captures[team.id]).score} pts
              </span>
            </button>
          ))}
        </div>

        {/* Panneau actif */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTeam}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <PanneauEquipe
              team={TEAMS[activeTeam]}
              captures={captures[TEAMS[activeTeam].id]}
              onCapture={(especeId, photoUrl) => handleCapture(TEAMS[activeTeam].id, especeId, photoUrl)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Règle d'or */}
        <div className="mt-6 p-4 rounded-2xl bg-green-500/10 border border-green-400/20 text-center text-green-200 text-sm">
          🌿 <strong className="text-green-300">Règle d'or :</strong> Zéro perturbation — Photos in situ uniquement. Ne blessez ni ne déplacez aucun animal.
        </div>
      </main>

      {/* Modal Règles */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowRules(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-emerald-400/20 overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-black text-white">📋 Règles — Bio-Focus</h2>
                  <button onClick={() => setShowRules(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4 text-sm text-white/80 leading-relaxed">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20">
                    <h3 className="font-bold text-amber-300 mb-2">🎯 Objectif</h3>
                    <p>Compléter le tableau des acteurs de la décomposition le plus diversifié. Le gagnant n'est pas celui qui photographie le plus, mais celui qui construit l'écosystème le plus équilibré.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="font-bold text-white mb-2">⚙️ Les 3 phases</h3>
                    <ol className="list-decimal list-inside space-y-1 text-white/70">
                      <li><strong className="text-white">La Quête :</strong> Cherchez dans souches en décomposition, litières de feuilles, tas de compost.</li>
                      <li><strong className="text-white">La Capture :</strong> Photographiez à l'appareil ×1000 ou smartphone. Zéro perturbation !</li>
                      <li><strong className="text-white">L'Intégration :</strong> Uploadez vos photos dans l'application et associez chaque animal à son rôle.</li>
                    </ol>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20">
                      <h4 className="font-bold text-purple-300 text-xs mb-1">⭐ Défi Expert</h4>
                      <p className="text-xs text-white/60">Photographier un Pseudoscorpion ou un Collembole : +30 pts chacun !</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/20">
                      <h4 className="font-bold text-blue-300 text-xs mb-1">🔗 Chaîne trophique</h4>
                      <p className="text-xs text-white/60">Photographier un prédateur ET sa proie dans le même milieu : +50 pts !</p>
                    </div>
                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-400/20">
                      <h4 className="font-bold text-green-300 text-xs mb-1">🌿 Biodiversité</h4>
                      <p className="text-xs text-white/60">Couvrir les 3 groupes (Transformateurs, Prédateurs, Nettoyeurs) : +100 pts !</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/20">
                      <h4 className="font-bold text-amber-300 text-xs mb-1">📷 Équipement</h4>
                      <p className="text-xs text-white/60">Appareil grossissant ×1000 disponible pour la microfaune.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Scores */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 rounded-3xl border border-amber-400/20 overflow-hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2"><Trophy className="w-6 h-6 text-amber-400" /> Tableau des scores</h2>
                  <button onClick={() => setShowResult(false)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-4">
                  {TEAMS.map((team, i) => {
                    const { score, expertBonus, chainBonus, biodiversiteBonus } = calcScore(captures[team.id]);
                    const nbCaptures = Object.keys(captures[team.id]).length;
                    const isWinner = winner?.id === team.id;
                    return (
                      <div key={team.id} className={`p-4 rounded-2xl border ${isWinner ? `bg-gradient-to-r ${team.gradient} ${team.border}` : 'bg-white/5 border-white/10'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {isWinner && <span className="text-2xl">🏆</span>}
                            <span className="text-xl">{team.emoji}</span>
                            <span className="font-black text-white">{team.name}</span>
                          </div>
                          <span className="text-2xl font-black text-white">{score} pts</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-white/10 text-white/70">📸 {nbCaptures} espèces</span>
                          {expertBonus > 0 && <span className="px-2 py-1 rounded-full bg-purple-500/30 text-purple-200">⭐ Expert +{expertBonus}</span>}
                          {chainBonus > 0 && <span className="px-2 py-1 rounded-full bg-blue-500/30 text-blue-200">🔗 Chaîne +{chainBonus}</span>}
                          {biodiversiteBonus > 0 && <span className="px-2 py-1 rounded-full bg-green-500/30 text-green-200">🌿 Biodiversité +{biodiversiteBonus}</span>}
                        </div>
                      </div>
                    );
                  })}
                  {!winner && team1Score.score > 0 && (
                    <div className="text-center p-3 rounded-2xl bg-yellow-500/10 border border-yellow-400/20 text-yellow-300 font-bold">
                      🤝 Égalité parfaite !
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}