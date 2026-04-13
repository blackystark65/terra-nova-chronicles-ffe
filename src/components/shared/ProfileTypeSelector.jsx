import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GraduationCap, BookOpen, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PROFILE_TYPES = [
  {
    id: 'eleve',
    label: 'Élève / Étudiant',
    description: 'J\'utilise la plateforme pour apprendre, jouer et explorer',
    emoji: '🎒',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'enseignant',
    label: 'Enseignant / Éducateur',
    description: 'Je gère une classe et j\'accompagne mes élèves sur la plateforme',
    emoji: '👩‍🏫',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'public',
    label: 'Grand public / Famille',
    description: 'J\'explore la plateforme en dehors du cadre scolaire',
    emoji: '🌍',
    color: 'from-emerald-500 to-teal-600',
  },
];

export default function ProfileTypeSelector({ user, onClose }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(user?.profile_type || null);
  const [matiere, setMatiere] = useState(user?.matiere || '');
  const [etablissement, setEtablissement] = useState(user?.etablissement || '');

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      onClose?.();
    },
  });

  const handleSave = () => {
    if (!selected) return;
    const data = { profile_type: selected };
    if (selected === 'enseignant') {
      data.matiere = matiere;
      data.etablissement = etablissement;
    }
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white mb-2">Qui êtes-vous ?</h2>
        <p className="text-white/60 text-sm">Choisissez votre profil pour personnaliser votre expérience</p>
      </div>

      <div className="grid gap-3">
        {PROFILE_TYPES.map(pt => (
          <motion.div
            key={pt.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(pt.id)}
            className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${
              selected === pt.id
                ? `bg-gradient-to-r ${pt.color} border-white/50`
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{pt.emoji}</span>
              <div className="flex-1">
                <div className="text-white font-bold">{pt.label}</div>
                <div className="text-white/60 text-sm">{pt.description}</div>
              </div>
              {selected === pt.id && <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Champs supplémentaires pour les enseignants */}
      {selected === 'enseignant' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 bg-indigo-500/10 border border-indigo-400/30 rounded-2xl p-4"
        >
          <p className="text-indigo-300 font-semibold text-sm">👩‍🏫 Informations enseignant</p>
          <div>
            <label className="text-xs text-indigo-300/70 mb-1 block">Matière enseignée</label>
            <Input
              value={matiere}
              onChange={e => setMatiere(e.target.value)}
              placeholder="Ex: SVT, Géographie, Éducation citoyenne..."
              className="bg-white/10 border-indigo-400/30 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-indigo-300/70 mb-1 block">Établissement scolaire</label>
            <Input
              value={etablissement}
              onChange={e => setEtablissement(e.target.value)}
              placeholder="Nom de votre école / collège / lycée"
              className="bg-white/10 border-indigo-400/30 text-white"
            />
          </div>
        </motion.div>
      )}

      <Button
        onClick={handleSave}
        disabled={!selected || updateMutation.isPending}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 py-4 text-base"
      >
        {updateMutation.isPending ? '⏳ Enregistrement...' : '✅ Enregistrer mon profil'}
      </Button>
    </div>
  );
}