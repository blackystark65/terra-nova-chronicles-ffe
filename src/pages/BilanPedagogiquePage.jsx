import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { BookOpen, Star, CheckCircle2, Loader2, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BiolumiHeader from '@/components/shared/BiolumiHeader';

const OBJECTIFS_DEFAULT = [
  "Identifier les principaux composants d'un écosystème local",
  "Comprendre l'impact de l'homme sur la biodiversité",
  "Associer les ressources naturelles aux enjeux du développement durable",
  "Développer le sens de l'observation et le respect du vivant",
];

export default function BilanPedagogiquePage() {
  const [form, setForm] = useState({
    nom_ecole: '', nom_enseignant: '', classe_niveau: '', date_atelier: '',
    lieu_activite: '', structure_partenaire: '',
    objectifs_apprentissage: [...OBJECTIFS_DEFAULT],
    objectif_custom: '',
    activites_observation: '', activites_experimentation: '', activites_debat: '',
    competences_acquises: '', notions_comprises: '', points_a_approfondir: '',
    changements_attitude: '', prolongements_classe: '',
    duree_atelier: 'adaptee', securite_deplacements: '', qualite_animation: '',
    difficultes_rencontrees: '', impressions_globales: '',
    recommandation_annee_suivante: true, note_globale: 4,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleObjectif = (obj) => {
    const list = form.objectifs_apprentissage;
    if (list.includes(obj)) {
      update('objectifs_apprentissage', list.filter(o => o !== obj));
    } else {
      update('objectifs_apprentissage', [...list, obj]);
    }
  };

  const addObjectifCustom = () => {
    if (form.objectif_custom.trim()) {
      update('objectifs_apprentissage', [...form.objectifs_apprentissage, form.objectif_custom.trim()]);
      update('objectif_custom', '');
    }
  };

  const handleSubmit = async (e, statut) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await base44.entities.BilanPedagogique.create({
        ...form,
        statut,
        objectif_custom: undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    setLoading(false);
  };

  const Section = ({ title, emoji, children }) => (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
      <h3 className="text-white font-bold text-lg">{emoji} {title}</h3>
      {children}
    </div>
  );

  const Field = ({ label, children }) => (
    <div>
      <label className="text-white/50 text-xs mb-1 block">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 text-sm";
  const textareaCls = inputCls + " resize-none";

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950">
        <BiolumiHeader currentPage="BilanPedagogique" />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-center p-12 rounded-3xl bg-white/5 border border-emerald-400/20 max-w-lg mx-4">
            <div className="text-6xl mb-4">📋</div>
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-3">Bilan enregistré !</h2>
            <p className="text-white/60 mb-6">Votre bilan pédagogique a bien été sauvegardé.</p>
            <Button onClick={() => setSuccess(false)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-8">
              Nouveau bilan
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950">
      <BiolumiHeader currentPage="BilanPedagogique" />
      <main className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-500/10 border border-teal-400/20 mb-4">
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span className="text-teal-300 font-semibold text-sm">Bilan pédagogique post-atelier</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Dossier <span className="text-teal-400">d'Évaluation</span></h1>
          <p className="text-white/50 max-w-xl mx-auto">Complétez ce bilan après votre sortie ou atelier en nature pour documenter votre expérience.</p>
        </motion.div>

        <form className="space-y-6">
          {/* Identification */}
          <Section title="Fiche d'identification" emoji="📌">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nom de l'école *">
                <input required value={form.nom_ecole} onChange={e => update('nom_ecole', e.target.value)} placeholder="École des Pins" className={inputCls} />
              </Field>
              <Field label="Nom de l'enseignant *">
                <input required value={form.nom_enseignant} onChange={e => update('nom_enseignant', e.target.value)} placeholder="Marie Dupont" className={inputCls} />
              </Field>
              <Field label="Classe et niveau *">
                <input required value={form.classe_niveau} onChange={e => update('classe_niveau', e.target.value)} placeholder="CM2 / Harmo 7e" className={inputCls} />
              </Field>
              <Field label="Date de l'atelier *">
                <input required type="date" value={form.date_atelier} onChange={e => update('date_atelier', e.target.value)} className={inputCls + " [color-scheme:dark]"} />
              </Field>
              <Field label="Lieu de l'activité">
                <input value={form.lieu_activite} onChange={e => update('lieu_activite', e.target.value)} placeholder="Forêt communale, mare..." className={inputCls} />
              </Field>
              <Field label="Structure partenaire">
                <input value={form.structure_partenaire} onChange={e => update('structure_partenaire', e.target.value)} placeholder="Nom de l'association" className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* Objectifs */}
          <Section title="Objectifs d'apprentissage visés" emoji="🎯">
            <div className="space-y-2">
              {OBJECTIFS_DEFAULT.map((obj, i) => (
                <button key={i} type="button" onClick={() => toggleObjectif(obj)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm flex items-center gap-3 ${form.objectifs_apprentissage.includes(obj) ? 'border-teal-400/50 bg-teal-500/10 text-teal-200' : 'border-white/10 bg-white/5 text-white/50'}`}>
                  <span>{form.objectifs_apprentissage.includes(obj) ? '✅' : '⬜'}</span>
                  {obj}
                </button>
              ))}
              <div className="flex gap-2 mt-3">
                <input value={form.objectif_custom} onChange={e => update('objectif_custom', e.target.value)}
                  placeholder="Ajouter un objectif personnalisé..." className={inputCls + " flex-1"} />
                <Button type="button" onClick={addObjectifCustom} variant="outline" className="border-teal-400/30 text-teal-300 hover:bg-teal-500/10">+</Button>
              </div>
              {form.objectifs_apprentissage.filter(o => !OBJECTIFS_DEFAULT.includes(o)).map((obj, i) => (
                <div key={i} className="px-4 py-3 rounded-xl border border-teal-400/30 bg-teal-500/10 text-teal-200 text-sm flex items-center justify-between">
                  <span>✅ {obj}</span>
                  <button type="button" onClick={() => toggleObjectif(obj)} className="text-red-400 text-xs">✕</button>
                </div>
              ))}
            </div>
          </Section>

          {/* Activités */}
          <Section title="Activités réalisées" emoji="🌿">
            <Field label="Observation (inventaire faune, reconnaissance arbres...)">
              <textarea value={form.activites_observation} onChange={e => update('activites_observation', e.target.value)} rows={2} placeholder="Ex: Inventaire de la faune du sol, reconnaissance des arbres..." className={textareaCls} />
            </Field>
            <Field label="Expérimentation (mesures, chaîne alimentaire...)">
              <textarea value={form.activites_experimentation} onChange={e => update('activites_experimentation', e.target.value)} rows={2} placeholder="Ex: Mesure de la qualité de l'eau..." className={textareaCls} />
            </Field>
            <Field label="Débat / Réflexion">
              <textarea value={form.activites_debat} onChange={e => update('activites_debat', e.target.value)} rows={2} placeholder="Ex: Discussion sur la gestion des déchets..." className={textareaCls} />
            </Field>
          </Section>

          {/* Évaluation des acquis */}
          <Section title="Évaluation des acquis des élèves" emoji="📊">
            <Field label="Compétences acquises">
              <textarea value={form.competences_acquises} onChange={e => update('competences_acquises', e.target.value)} rows={2} placeholder="Ex: Utilisation correcte d'une clé de détermination..." className={textareaCls} />
            </Field>
            <Field label="Notions comprises">
              <textarea value={form.notions_comprises} onChange={e => update('notions_comprises', e.target.value)} rows={2} placeholder="Ex: Définition de la biodiversité, rôle des décomposeurs..." className={textareaCls} />
            </Field>
            <Field label="Points à approfondir en classe">
              <textarea value={form.points_a_approfondir} onChange={e => update('points_a_approfondir', e.target.value)} rows={2} placeholder="Ex: Le cycle de l'eau, le tri des déchets..." className={textareaCls} />
            </Field>
          </Section>

          {/* EDD */}
          <Section title="Éducation au Développement Durable" emoji="🌲">
            <Field label="Changements d'attitude observés chez les élèves">
              <textarea value={form.changements_attitude} onChange={e => update('changements_attitude', e.target.value)} rows={3} placeholder="Ex: Plus grand respect de l'environnement, curiosité accrue..." className={textareaCls} />
            </Field>
            <Field label="Prolongements prévus en classe">
              <textarea value={form.prolongements_classe} onChange={e => update('prolongements_classe', e.target.value)} rows={3} placeholder="Ex: Création d'un herbier, rédaction d'une charte biodiversité..." className={textareaCls} />
            </Field>
          </Section>

          {/* Logistique */}
          <Section title="Aspects logistiques et organisation" emoji="⚙️">
            <Field label="Durée de l'atelier">
              <div className="flex gap-3">
                {[{ v: 'adaptee', l: '✅ Adaptée' }, { v: 'trop_courte', l: '⏱️ Trop courte' }, { v: 'trop_longue', l: '⏳ Trop longue' }].map(opt => (
                  <button key={opt.v} type="button" onClick={() => update('duree_atelier', opt.v)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${form.duree_atelier === opt.v ? 'border-teal-400/50 bg-teal-500/10 text-teal-200' : 'border-white/10 bg-white/5 text-white/40'}`}>
                    {opt.l}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Sécurité et déplacements">
              <textarea value={form.securite_deplacements} onChange={e => update('securite_deplacements', e.target.value)} rows={2} placeholder="Ex: Rassemblements fluides, météo clémente..." className={textareaCls} />
            </Field>
            <Field label="Qualité de l'animation">
              <textarea value={form.qualite_animation} onChange={e => update('qualite_animation', e.target.value)} rows={2} placeholder="Ex: Guide très pédagogue, matériel fourni de qualité..." className={textareaCls} />
            </Field>
            <Field label="Difficultés rencontrées">
              <textarea value={form.difficultes_rencontrees} onChange={e => update('difficultes_rencontrees', e.target.value)} rows={2} placeholder="Ex: Terrain boueux, concentration difficile en fin de parcours..." className={textareaCls} />
            </Field>
          </Section>

          {/* Conclusion */}
          <Section title="Conclusion et remarques générales" emoji="💬">
            <Field label="Impressions globales">
              <textarea value={form.impressions_globales} onChange={e => update('impressions_globales', e.target.value)} rows={3} placeholder="Ex: Atelier très enrichissant qui donne du sens aux cours de sciences..." className={textareaCls} />
            </Field>
            <Field label="Note globale">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => update('note_globale', n)}
                    className={`text-2xl transition-transform hover:scale-110 ${n <= form.note_globale ? 'opacity-100' : 'opacity-30'}`}>
                    ⭐
                  </button>
                ))}
                <span className="text-white/40 text-sm self-center ml-2">{form.note_globale}/5</span>
              </div>
            </Field>
            <Field label="Recommandez-vous cet atelier pour l'année prochaine ?">
              <div className="flex gap-3">
                <button type="button" onClick={() => update('recommandation_annee_suivante', true)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${form.recommandation_annee_suivante ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-white/5 text-white/40'}`}>
                  👍 Oui
                </button>
                <button type="button" onClick={() => update('recommandation_annee_suivante', false)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${!form.recommandation_annee_suivante ? 'border-red-400/50 bg-red-500/10 text-red-200' : 'border-white/10 bg-white/5 text-white/40'}`}>
                  👎 Non
                </button>
              </div>
            </Field>
          </Section>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            <Button type="button" onClick={(e) => handleSubmit(e, 'brouillon')} disabled={loading} variant="outline"
              className="flex-1 border-white/20 text-white/60 hover:bg-white/5 py-6 rounded-2xl">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '💾 Sauvegarder brouillon'}
            </Button>
            <Button type="button" onClick={(e) => handleSubmit(e, 'soumis')} disabled={loading}
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white py-6 rounded-2xl shadow-xl">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…</> : <><CheckCircle2 className="w-5 h-5 mr-2" /> Soumettre le bilan</>}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}