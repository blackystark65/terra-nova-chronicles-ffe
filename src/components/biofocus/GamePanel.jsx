import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Camera, Upload, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ESPECES, DIFFICULTE_COLORS, TEAMS_CONFIG, calcScore } from './BioFocusData';

function CarteEspece({ espece, captured, onCapture, teamColor, readOnly }) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onCapture(espece.id, file_url);
    setUploading(false);
    setShowUpload(false);
  };

  return (
    <motion.div layout className={`relative rounded-2xl border p-3 transition-all ${captured ? `${teamColor.bg} ${teamColor.border}` : 'bg-white/5 border-white/10'}`}>
      {captured && <div className={`absolute top-2 right-2 p-1 rounded-full ${teamColor.badge}`}><CheckCircle className="w-3 h-3 text-white" /></div>}
      <div className="flex items-start gap-2 mb-2">
        <span className="text-2xl flex-shrink-0">{espece.emoji}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-xs leading-tight">{espece.nom}</h4>
          <p className="text-white/40 text-xs mt-0.5">{espece.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded-full border text-xs ${DIFFICULTE_COLORS[espece.difficulte]}`}>{espece.difficulte}{espece.expert ? ' ⭐' : ''}</span>
        {!readOnly && (
          captured ? (
            captured.photo && <button onClick={() => window.open(captured.photo, '_blank')} className="text-xs text-blue-300 underline">📸 Photo</button>
          ) : showUpload ? (
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${teamColor.btn}`}>
                {uploading ? '⏳' : <><Upload className="w-3 h-3" />Upload</>}
              </span>
            </label>
          ) : (
            <button onClick={() => setShowUpload(true)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs transition-all">
              <Camera className="w-3 h-3" /> Capturer
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}

function GroupeEspeces({ groupe, captures, onCapture, teamColor, readOnly }) {
  const [open, setOpen] = useState(true);
  const nb = groupe.especes.filter(e => captures[e.id]).length;

  return (
    <div className={`rounded-2xl border ${groupe.borderColor} overflow-hidden mb-3`}>
      <button onClick={() => setOpen(o => !o)} className={`w-full flex items-center justify-between p-3 ${groupe.bgColor} hover:bg-white/5 transition-all`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{groupe.emoji}</span>
          <div className="text-left">
            <h3 className={`font-black text-xs ${groupe.textColor}`}>{groupe.label}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${groupe.textColor}`}>{nb}/{groupe.especes.length} · {groupe.points}pts</span>
          {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="p-3 grid sm:grid-cols-2 gap-2">
              {groupe.especes.map(e => (
                <CarteEspece key={e.id} espece={e} captured={captures[e.id]} onCapture={onCapture} teamColor={teamColor} readOnly={readOnly} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GamePanel({ session, userTeam, user }) {
  const qc = useQueryClient();
  const teamConfig = TEAMS_CONFIG.find(t => t.id === userTeam);
  const captures = session[teamConfig.capturesKey] || {};
  const { score, expertBonus, chainBonus, biodiversiteBonus } = calcScore(captures);
  const totalEspeces = Object.values(ESPECES).reduce((acc, g) => acc + g.especes.length, 0);
  const totalCaptures = Object.keys(captures).length;

  // Peut-on capturer ? Uniquement si session en cours
  const canCapture = session.status === 'en_cours';

  const handleCapture = async (especeId, photoUrl) => {
    const newCaptures = { ...captures, [especeId]: { photo: photoUrl, timestamp: new Date().toISOString() } };
    const newScore = calcScore(newCaptures).score;
    await base44.entities.BioFocusSession.update(session.id, {
      [teamConfig.capturesKey]: newCaptures,
      [teamConfig.scoreKey]: newScore,
    });
    qc.invalidateQueries(['biofocus-sessions']);
  };

  return (
    <div>
      {/* Header équipe */}
      <div className={`p-4 rounded-2xl mb-4 bg-gradient-to-r ${teamConfig.gradient} border ${teamConfig.border}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{teamConfig.emoji}</span>
            <div>
              <h2 className="font-black text-white">{teamConfig.name}</h2>
              <p className="text-white/70 text-xs">{totalCaptures}/{totalEspeces} espèces · {session.nom_classe}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white">{score}</div>
            <div className="text-white/70 text-xs">points</div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {expertBonus > 0 && <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-xs">⭐ Expert +{expertBonus}</span>}
          {chainBonus > 0 && <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs">🔗 Chaîne +{chainBonus}</span>}
          {biodiversiteBonus > 0 && <span className="px-2 py-0.5 rounded-full bg-green-500/30 text-green-200 text-xs">🌿 Biodiversité +{biodiversiteBonus}</span>}
        </div>
        <div className="mt-2 w-full bg-black/30 rounded-full h-1.5">
          <motion.div className="h-1.5 rounded-full bg-white/70" animate={{ width: `${(totalCaptures / totalEspeces) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {!canCapture && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-300 text-sm text-center">
          🏁 Session terminée — captures en lecture seule
        </div>
      )}

      {/* Groupes */}
      {Object.entries(ESPECES).map(([key, groupe]) => (
        <GroupeEspeces key={key} groupe={groupe} captures={captures} onCapture={handleCapture} teamColor={teamConfig} readOnly={!canCapture} />
      ))}
    </div>
  );
}