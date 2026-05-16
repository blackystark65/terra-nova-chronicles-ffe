import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Microscope, Trophy, Users, BookOpen, X } from 'lucide-react';
import TeacherPanel from '@/components/biofocus/TeacherPanel';
import StudentJoin from '@/components/biofocus/StudentJoin';
import GamePanel from '@/components/biofocus/GamePanel';
import Classement from '@/components/biofocus/Classement';
import { calcScore, TEAMS_CONFIG } from '@/components/biofocus/BioFocusData';

const TABS = [
  { id: 'jeu', label: 'Jeu', icon: '🎮' },
  { id: 'classement', label: 'Classement', icon: '🏆' },
  { id: 'regles', label: 'Règles', icon: '📋' },
];

function ReglesModal({ onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-emerald-400/20 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-black text-white">📋 Règles — Bio-Focus</h2>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4 text-sm text-white/80">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20">
              <h3 className="font-bold text-amber-300 mb-2">🎯 Objectif</h3>
              <p>Compléter le tableau des acteurs de la décomposition le plus diversifié et équilibré. Le gagnant n'est pas celui qui photographie le plus, mais celui qui construit l'écosystème le plus riche.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-bold text-white mb-2">⚙️ Les 3 phases</h3>
              <ol className="list-decimal list-inside space-y-1 text-white/70">
                <li><strong className="text-white">La Quête :</strong> Souches en décomposition, litières de feuilles, tas de compost.</li>
                <li><strong className="text-white">La Capture :</strong> Photo in situ avec smartphone ou appareil ×1000. Zéro perturbation !</li>
                <li><strong className="text-white">L'Intégration :</strong> Upload des photos dans l'app + association à son rôle.</li>
              </ol>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { color: 'amber', title: '🪱 Transformateurs', pts: '10 pts/espèce', items: ['Lombric', 'Cloporte', 'Diplopode', 'Limace'] },
                { color: 'red', title: '🦂 Prédateurs', pts: '20 pts/espèce', items: ['Carabe doré', 'Staphylin', 'Araignée', 'Pseudoscorpion ⭐'] },
                { color: 'emerald', title: '🍄 Nettoyeurs', pts: '15 pts/espèce', items: ['Champignon/Mycélium', 'Collembole ⭐'] },
                { color: 'purple', title: '🎁 Récompenses', pts: 'Équipe gagnante', items: ['+200 XP', '+150 crédits', 'Badge Enquêteur'] },
              ].map((g, i) => (
                <div key={i} className={`p-3 rounded-xl bg-${g.color}-500/10 border border-${g.color}-400/20`}>
                  <h4 className={`font-bold text-${g.color}-300 text-xs mb-1`}>{g.title} — {g.pts}</h4>
                  <ul className="text-xs text-white/60 space-y-0.5">{g.items.map((it, j) => <li key={j}>• {it}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-400/20 text-center">
                <div className="font-bold text-purple-300 text-xs mb-1">⭐ Défi Expert</div>
                <div className="text-xs text-white/60">Pseudoscorpion ou Collembole : +30 pts !</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-center">
                <div className="font-bold text-blue-300 text-xs mb-1">🔗 Chaîne trophique</div>
                <div className="text-xs text-white/60">Prédateur + proie capturés : +50 pts !</div>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-400/20 text-center">
                <div className="font-bold text-green-300 text-xs mb-1">🌿 Biodiversité</div>
                <div className="text-xs text-white/60">Les 3 groupes couverts : +100 pts !</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-400/20 text-green-200 text-center font-semibold">
              🌿 Règle d'or : Zéro perturbation — photos in situ uniquement !
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BioFocusPage() {
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [activeTab, setActiveTab] = useState('jeu');
  const [showRules, setShowRules] = useState(false);
  const [mySession, setMySession] = useState(null); // session où l'élève est inscrit
  const [myTeam, setMyTeam] = useState(null); // 'team1' ou 'team2'

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setIsTeacher(u?.role === 'admin');
    });
  }, []);

  const { data: sessions = [], refetch } = useQuery({
    queryKey: ['biofocus-sessions'],
    queryFn: () => base44.entities.BioFocusSession.list('-created_date', 100),
    enabled: !!user,
  });

  // Détecter si l'élève est déjà dans une session
  useEffect(() => {
    if (!user || isTeacher) return;
    for (const session of sessions) {
      for (const team of TEAMS_CONFIG) {
        const members = session[team.membersKey] || [];
        if (members.some(m => m.user_email === user.email)) {
          setMySession(session);
          setMyTeam(team.id);
          return;
        }
      }
    }
    setMySession(null);
    setMyTeam(null);
  }, [sessions, user, isTeacher]);

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-emerald-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  // Récupérer la session à jour depuis le tableau
  const currentSession = mySession ? sessions.find(s => s.id === mySession.id) || mySession : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-emerald-950">
      <BiolumiHeader currentPage="BioFocus" />

      <main className="pt-20 pb-10 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 mb-3">
            <Microscope className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-semibold text-sm">Jeu de Terrain — Photographie ×1000</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-300 via-green-300 to-emerald-300 bg-clip-text text-transparent mb-2">
            🔬 Bio-Focus
          </h1>
          <p className="text-white/50 text-sm">Les Enquêteurs de l'Humus</p>
        </motion.div>

        {/* Onglets */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => tab.id === 'regles' ? setShowRules(true) : setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                activeTab === tab.id && tab.id !== 'regles'
                  ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu onglet Jeu */}
        {activeTab === 'jeu' && (
          <div>
            {/* VUE ENSEIGNANT */}
            {isTeacher && (
              <TeacherPanel sessions={sessions} user={user} onSessionCreated={refetch} />
            )}

            {/* VUE ÉLÈVE */}
            {!isTeacher && (
              <>
                {currentSession && myTeam ? (
                  <GamePanel session={currentSession} userTeam={myTeam} user={user} />
                ) : (
                  <StudentJoin
                    sessions={sessions}
                    user={user}
                    onJoined={({ session, team }) => { setMySession(session); setMyTeam(team); refetch(); }}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Contenu onglet Classement */}
        {activeTab === 'classement' && (
          <Classement sessions={sessions} />
        )}

        {/* Règle d'or */}
        <div className="mt-6 p-3 rounded-2xl bg-green-500/10 border border-green-400/20 text-center text-green-200/70 text-xs">
          🌿 <strong className="text-green-300">Règle d'or :</strong> Zéro perturbation — Photos in situ uniquement. Ne blessez ni ne déplacez aucun animal.
        </div>
      </main>

      <AnimatePresence>
        {showRules && <ReglesModal onClose={() => setShowRules(false)} />}
      </AnimatePresence>
    </div>
  );
}