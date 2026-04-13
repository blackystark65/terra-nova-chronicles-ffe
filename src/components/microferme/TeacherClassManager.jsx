import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Users, GraduationCap, Edit2, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NIVEAUX = [
  { id: 'juniors', name: 'Juniors - Découverte', description: 'CM2 et équivalent', emoji: '🎒' },
  { id: 'cadets', name: 'Cadets - Environnement', description: '5ème et équivalent', emoji: '🎓' },
  { id: 'seniors', name: 'Seniors - Sciences naturelles', description: '6ème et équivalent', emoji: '🎯' },
];

export default function TeacherClassManager({ user }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [form, setForm] = useState({
    nom_classe: '',
    code_classe: '',
    niveau: 'juniors',
    enseignant: user?.full_name || '',
    nombre_eleves: 0,
    annee_scolaire: '2025-2026',
    description: '',
  });
  const [feedback, setFeedback] = useState(null);

  const { data: myClasses = [] } = useQuery({
    queryKey: ['myClasses', user?.email],
    queryFn: () => base44.entities.ClasseFerme.filter({ created_by: user.email }),
    enabled: !!user,
  });

  const { data: allRoles = [] } = useQuery({
    queryKey: ['allRoleFerme'],
    queryFn: () => base44.entities.RoleFerme.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ClasseFerme.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['myClasses']);
      queryClient.invalidateQueries(['classeFerme']);
      resetForm();
      showMsg('success', '✅ Classe créée avec succès !');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ClasseFerme.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['myClasses']);
      queryClient.invalidateQueries(['classeFerme']);
      resetForm();
      showMsg('success', '✅ Classe mise à jour !');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ClasseFerme.update(id, { is_active: false }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myClasses']);
      queryClient.invalidateQueries(['classeFerme']);
      showMsg('success', '🗑️ Classe archivée');
    },
  });

  const showMsg = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingClass(null);
    setForm({ nom_classe: '', code_classe: '', niveau: 'juniors', enseignant: user?.full_name || '', nombre_eleves: 0, annee_scolaire: '2025-2026', description: '' });
  };

  const startEdit = (classe) => {
    setEditingClass(classe);
    setForm({
      nom_classe: classe.nom_classe,
      code_classe: classe.code_classe,
      niveau: classe.niveau,
      enseignant: classe.enseignant,
      nombre_eleves: classe.nombre_eleves || 0,
      annee_scolaire: classe.annee_scolaire || '2025-2026',
      description: classe.description || '',
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.nom_classe || !form.code_classe) {
      showMsg('error', '❌ Nom et code obligatoires');
      return;
    }
    const data = { ...form, nombre_eleves: Number(form.nombre_eleves), is_active: true };
    if (editingClass) {
      updateMutation.mutate({ id: editingClass.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getClassStats = (classeId) => {
    const roles = allRoles.filter(r => r.classe_id === classeId && r.is_active);
    return roles.length;
  };

  return (
    <div className="space-y-6">
      {/* Header enseignant */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-indigo-300">Gestion de mes Classes</h2>
        </div>
        <p className="text-indigo-200/70 text-sm">
          Créez vos classes, partagez le code avec vos élèves. Ils pourront rejoindre votre classe et choisir leur poste dans la micro-ferme.
        </p>
      </div>

      {/* Bouton créer */}
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 py-4"
        >
          <Plus className="w-5 h-5 mr-2" /> Créer une nouvelle classe
        </Button>
      )}

      {/* Formulaire */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-2xl bg-white/5 border border-indigo-400/30 space-y-4">
              <h3 className="text-lg font-bold text-indigo-300">
                {editingClass ? '✏️ Modifier la classe' : '➕ Nouvelle classe'}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-indigo-300/70 mb-1 block">Nom de la classe *</label>
                  <Input
                    value={form.nom_classe}
                    onChange={e => setForm(f => ({ ...f, nom_classe: e.target.value }))}
                    placeholder="Ex: 6ème A, CM2 Verts..."
                    className="bg-white/10 border-indigo-400/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-indigo-300/70 mb-1 block">Code d'accès * (partagez-le avec vos élèves)</label>
                  <Input
                    value={form.code_classe}
                    onChange={e => setForm(f => ({ ...f, code_classe: e.target.value.toUpperCase() }))}
                    placeholder="Ex: CM2A2025"
                    className="bg-white/10 border-indigo-400/30 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm text-indigo-300/70 mb-1 block">Niveau</label>
                  <select
                    value={form.niveau}
                    onChange={e => setForm(f => ({ ...f, niveau: e.target.value }))}
                    className="w-full bg-white/10 border border-indigo-400/30 rounded-xl px-3 py-2 text-white text-sm outline-none"
                  >
                    {NIVEAUX.map(n => (
                      <option key={n.id} value={n.id} className="bg-slate-800">{n.emoji} {n.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-indigo-300/70 mb-1 block">Nombre d'élèves</label>
                  <Input
                    type="number"
                    value={form.nombre_eleves}
                    onChange={e => setForm(f => ({ ...f, nombre_eleves: e.target.value }))}
                    min={0}
                    className="bg-white/10 border-indigo-400/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-indigo-300/70 mb-1 block">Année scolaire</label>
                  <Input
                    value={form.annee_scolaire}
                    onChange={e => setForm(f => ({ ...f, annee_scolaire: e.target.value }))}
                    placeholder="2025-2026"
                    className="bg-white/10 border-indigo-400/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-indigo-300/70 mb-1 block">Matière / Description</label>
                  <Input
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Ex: SVT, Géographie, Éducation citoyenne..."
                    className="bg-white/10 border-indigo-400/30 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {editingClass ? 'Mettre à jour' : 'Créer la classe'}
                </Button>
                <Button onClick={resetForm} variant="outline" className="border-indigo-400/30 text-indigo-300">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des classes */}
      <div className="space-y-3">
        <h3 className="text-indigo-300 font-semibold flex items-center gap-2">
          <Users className="w-4 h-4" /> Mes classes ({myClasses.filter(c => c.is_active !== false).length})
        </h3>
        {myClasses.filter(c => c.is_active !== false).length === 0 ? (
          <div className="text-center py-8 text-indigo-300/40 bg-white/5 rounded-2xl border border-indigo-400/10">
            Aucune classe créée pour l'instant
          </div>
        ) : (
          myClasses.filter(c => c.is_active !== false).map(classe => {
            const niveau = NIVEAUX.find(n => n.id === classe.niveau);
            const nbInscrits = getClassStats(classe.id);
            return (
              <motion.div
                key={classe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-white/5 border border-indigo-400/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{niveau?.emoji}</span>
                      <h4 className="text-white font-bold text-lg">{classe.nom_classe}</h4>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-indigo-300/70">
                      <span>📚 {niveau?.name}</span>
                      <span>👥 {nbInscrits} élève{nbInscrits !== 1 ? 's' : ''} inscrit{nbInscrits !== 1 ? 's' : ''}</span>
                      <span>🗓️ {classe.annee_scolaire}</span>
                      {classe.description && <span>🎓 {classe.description}</span>}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-lg px-3 py-1">
                      <span className="text-indigo-300/60 text-xs">Code d'accès :</span>
                      <span className="text-indigo-200 font-mono font-bold tracking-wider">{classe.code_classe}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(classe)}
                      className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(classe.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Feedback toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`px-6 py-3 rounded-xl shadow-2xl border-2 text-white font-bold ${
              feedback.type === 'success' ? 'bg-emerald-600 border-emerald-300' : 'bg-red-600 border-red-300'
            }`}>
              {feedback.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}