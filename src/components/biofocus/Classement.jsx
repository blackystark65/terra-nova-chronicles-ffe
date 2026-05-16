import React, { useState } from 'react';
import { Trophy, Users } from 'lucide-react';
import { TEAMS_CONFIG, calcScore } from './BioFocusData';

function ScoreBar({ value, max, color }) {
  return (
    <div className="w-full bg-black/30 rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, transition: 'width 0.5s' }} />
    </div>
  );
}

export default function Classement({ sessions }) {
  const [view, setView] = useState('classes'); // 'classes' | 'profils'

  // Calcul classement par classes
  const classeMap = {};
  sessions.forEach(session => {
    if (!classeMap[session.nom_classe]) classeMap[session.nom_classe] = { nom: session.nom_classe, sessions: 0, totalScore: 0, wins: 0 };
    const s1 = calcScore(session.captures_team1 || {}).score;
    const s2 = calcScore(session.captures_team2 || {}).score;
    classeMap[session.nom_classe].sessions++;
    classeMap[session.nom_classe].totalScore += s1 + s2;
    if (session.winner_team === 'team1' || session.winner_team === 'team2') classeMap[session.nom_classe].wins++;
  });
  const classesRanked = Object.values(classeMap).sort((a, b) => b.totalScore - a.totalScore);
  const maxClasseScore = classesRanked[0]?.totalScore || 1;

  // Classement par profil (membres)
  const profilMap = {};
  sessions.forEach(session => {
    TEAMS_CONFIG.forEach(team => {
      const members = session[team.membersKey] || [];
      const captures = session[team.capturesKey] || {};
      const score = calcScore(captures).score;
      const isWinner = session.winner_team === team.id;
      members.forEach(m => {
        if (!profilMap[m.user_email]) profilMap[m.user_email] = { name: m.user_name, email: m.user_email, sessions: 0, wins: 0, totalScore: 0 };
        profilMap[m.user_email].sessions++;
        profilMap[m.user_email].totalScore += score;
        if (isWinner) profilMap[m.user_email].wins++;
      });
    });
  });
  const profilsRanked = Object.values(profilMap).sort((a, b) => b.totalScore - a.totalScore);
  const maxProfilScore = profilsRanked[0]?.totalScore || 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Classement</h2>
        <div className="flex gap-2">
          <button onClick={() => setView('classes')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${view === 'classes' ? 'bg-amber-500/30 text-amber-300 border border-amber-400/30' : 'bg-white/5 text-white/50 border border-white/10'}`}>
            Par classe
          </button>
          <button onClick={() => setView('profils')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${view === 'profils' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30' : 'bg-white/5 text-white/50 border border-white/10'}`}>
            Par élève
          </button>
        </div>
      </div>

      {view === 'classes' && (
        <div className="space-y-3">
          {classesRanked.length === 0 && <p className="text-white/40 text-sm text-center py-8">Aucune session terminée.</p>}
          {classesRanked.map((c, i) => (
            <div key={c.nom} className={`p-4 rounded-2xl border ${i === 0 ? 'bg-amber-500/10 border-amber-400/30' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white/70 w-6">{i + 1}</span>
                  {i === 0 && <span>🏆</span>}
                  <span className="font-black text-white">{c.nom}</span>
                </div>
                <span className="text-xl font-black text-white">{c.totalScore} pts</span>
              </div>
              <ScoreBar value={c.totalScore} max={maxClasseScore} color={i === 0 ? 'bg-amber-400' : 'bg-white/30'} />
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-white/50">{c.sessions} session{c.sessions > 1 ? 's' : ''}</span>
                <span className="text-xs text-white/50">{c.wins} victoire{c.wins > 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'profils' && (
        <div className="space-y-3">
          {profilsRanked.length === 0 && <p className="text-white/40 text-sm text-center py-8">Aucun participant enregistré.</p>}
          {profilsRanked.map((p, i) => (
            <div key={p.email} className={`p-4 rounded-2xl border ${i === 0 ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white/70 w-6">{i + 1}</span>
                  {i === 0 && <span>🌟</span>}
                  <span className="font-black text-white truncate max-w-[150px]">{p.name}</span>
                </div>
                <span className="text-xl font-black text-white">{p.totalScore} pts</span>
              </div>
              <ScoreBar value={p.totalScore} max={maxProfilScore} color={i === 0 ? 'bg-emerald-400' : 'bg-white/30'} />
              <div className="flex gap-3 mt-2">
                <span className="text-xs text-white/50">{p.sessions} session{p.sessions > 1 ? 's' : ''}</span>
                <span className="text-xs text-white/50 text-amber-300/70">{p.wins} 🏆 victoire{p.wins > 1 ? 's' : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}