import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { TEAMS_CONFIG } from './BioFocusData';

export default function StudentJoin({ sessions, user, onJoined }) {
  const qc = useQueryClient();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setError('');
    setLoading(true);
    const codeUp = code.toUpperCase().trim();

    // Trouver la session correspondante
    let foundSession = null;
    let foundTeam = null;

    for (const session of sessions) {
      if (session.status !== 'en_cours') continue;
      if (session.code_team1 === codeUp) { foundSession = session; foundTeam = 'team1'; break; }
      if (session.code_team2 === codeUp) { foundSession = session; foundTeam = 'team2'; break; }
    }

    if (!foundSession || !foundTeam) {
      setError('Code invalide ou session déjà terminée.');
      setLoading(false);
      return;
    }

    // Vérifier si déjà inscrit
    const allMembers = [...(foundSession.members_team1 || []), ...(foundSession.members_team2 || [])];
    if (allMembers.some(m => m.user_email === user.email)) {
      setError('Vous êtes déjà inscrit dans cette session.');
      setLoading(false);
      return;
    }

    // Vérifier équilibre des équipes (max +1 d'écart)
    const m1 = (foundSession.members_team1 || []).length;
    const m2 = (foundSession.members_team2 || []).length;
    if (foundTeam === 'team1' && m1 >= m2 + 1) {
      setError("L'équipe 1 est complète ! Rejoignez l'équipe 2 (les Mycorhizes).");
      setLoading(false);
      return;
    }
    if (foundTeam === 'team2' && m2 >= m1 + 1) {
      setError("L'équipe 2 est complète ! Rejoignez l'équipe 1 (les Fouisseurs).");
      setLoading(false);
      return;
    }

    // Récupérer l'EcoProfile pour stocker son ID
    const profiles = await base44.entities.EcoProfile.filter({ created_by: user.email });
    const profileId = profiles[0]?.id || '';

    const newMember = { user_email: user.email, user_name: user.full_name || user.email, eco_profile_id: profileId };
    const updatedMembers = [...(foundSession[`members_${foundTeam}`] || []), newMember];
    await base44.entities.BioFocusSession.update(foundSession.id, { [`members_${foundTeam}`]: updatedMembers });

    qc.invalidateQueries(['biofocus-sessions']);
    onJoined?.({ session: foundSession, team: foundTeam });
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔬</div>
        <h2 className="text-2xl font-black text-white mb-2">Rejoindre une session</h2>
        <p className="text-white/60 text-sm">Entrez le code équipe fourni par votre enseignant(e)</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <div className="mb-4">
          <label className="text-white/70 text-sm font-semibold mb-2 block">Code équipe</label>
          <input
            type="text"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
            placeholder="EX: ABC123"
            maxLength={6}
            className="w-full text-center text-2xl font-black tracking-widest rounded-xl bg-black/30 border border-white/20 text-white px-4 py-4 focus:outline-none focus:border-emerald-400/50"
          />
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm text-center">
            ⚠️ {error}
          </div>
        )}
        <button
          onClick={handleJoin}
          disabled={code.length < 4 || loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-base hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 transition-all"
        >
          {loading ? '⏳ Vérification…' : '✅ Rejoindre'}
        </button>
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-200/70 text-xs space-y-1">
        <p>📋 Le code équipe vous est donné par votre enseignant(e).</p>
        <p>⚖️ Les équipes sont rééquilibrées automatiquement — si une équipe est pleine, vous serez redirigé(e) vers l'autre.</p>
      </div>

      <div className="mt-4">
        <h3 className="text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Les 2 équipes</h3>
        <div className="grid grid-cols-2 gap-3">
          {TEAMS_CONFIG.map(team => (
            <div key={team.id} className={`p-3 rounded-xl border ${team.border} ${team.bg} text-center`}>
              <div className="text-2xl mb-1">{team.emoji}</div>
              <div className="text-white/80 text-xs font-bold">{team.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}