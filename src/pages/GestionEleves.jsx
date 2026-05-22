import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Users, Plus, Trash2, Download, Upload, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

function genNumero(index, genre) {
  const prefix = genre === 'fille' ? 'F' : 'G';
  return `TN-${prefix}${String(index).padStart(3, '0')}`;
}

export default function GestionElevesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterClasse, setFilterClasse] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkClasse, setBulkClasse] = useState('');
  const [bulkGenre, setBulkGenre] = useState('garcon');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const [showBulk, setShowBulk] = useState(false);
  const [singleForm, setSingleForm] = useState({ prenom: '', nom: '', genre: 'garcon', classe: '' });
  const [annee] = useState('2025-2026');

  const { data: eleves = [], isLoading } = useQuery({
    queryKey: ['eleves'],
    queryFn: () => base44.entities.Eleve.list('-created_date', 500),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Eleve.delete(id),
    onSuccess: () => qc.invalidateQueries(['eleves']),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Eleve.create(data),
    onSuccess: () => { qc.invalidateQueries(['eleves']); setSingleForm({ prenom: '', nom: '', genre: 'garcon', classe: '' }); },
  });

  // Calcule le prochain numéro disponible
  const getNextNumero = (genre) => {
    const prefix = genre === 'fille' ? 'F' : 'G';
    const existing = eleves
      .filter(e => e.numero?.startsWith(`TN-${prefix}`))
      .map(e => parseInt(e.numero?.replace(`TN-${prefix}`, '') || '0'))
      .filter(n => !isNaN(n));
    const max = existing.length > 0 ? Math.max(...existing) : 0;
    return `TN-${prefix}${String(max + 1).padStart(3, '0')}`;
  };

  const handleSingleAdd = () => {
    if (!singleForm.prenom.trim() || !singleForm.nom.trim()) return;
    const numero = getNextNumero(singleForm.genre);
    createMutation.mutate({ ...singleForm, numero, annee_scolaire: annee, is_active: true });
  };

  const handleBulkImport = async () => {
    const lines = bulkText.trim().split('\n').filter(l => l.trim());
    if (!lines.length) return;
    setBulkLoading(true);
    setBulkResult(null);

    const toCreate = [];
    // Calcule les numéros de départ pour ce genre
    const prefix = bulkGenre === 'fille' ? 'F' : 'G';
    const existing = eleves
      .filter(e => e.numero?.startsWith(`TN-${prefix}`))
      .map(e => parseInt(e.numero?.replace(`TN-${prefix}`, '') || '0'))
      .filter(n => !isNaN(n));
    let counter = existing.length > 0 ? Math.max(...existing) + 1 : 1;

    for (const line of lines) {
      const parts = line.trim().split(/[\s,;]+/);
      if (parts.length < 2) continue;
      const [prenom, ...rest] = parts;
      const nom = rest.join(' ');
      toCreate.push({
        prenom: prenom.trim(),
        nom: nom.trim(),
        genre: bulkGenre,
        classe: bulkClasse.trim() || 'Non définie',
        numero: `TN-${prefix}${String(counter).padStart(3, '0')}`,
        annee_scolaire: annee,
        is_active: true,
      });
      counter++;
    }

    let created = 0;
    for (const e of toCreate) {
      await base44.entities.Eleve.create(e);
      created++;
    }
    qc.invalidateQueries(['eleves']);
    setBulkResult({ created, total: lines.length });
    setBulkText('');
    setBulkLoading(false);
    setShowBulk(false);
  };

  const handleExportCSV = () => {
    const rows = [['Numéro', 'Prénom', 'Nom', 'Genre', 'Classe', 'Année']];
    eleves.forEach(e => rows.push([e.numero, e.prenom, e.nom, e.genre, e.classe, e.annee_scolaire]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'eleves-terra-nova.csv'; a.click();
  };

  const classes = [...new Set(eleves.map(e => e.classe).filter(Boolean))].sort();
  const filtered = eleves.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.prenom?.toLowerCase().includes(q) || e.nom?.toLowerCase().includes(q) || e.numero?.toLowerCase().includes(q);
    const matchClasse = !filterClasse || e.classe === filterClasse;
    return matchSearch && matchClasse;
  });

  const garcons = eleves.filter(e => e.genre === 'garcon').length;
  const filles = eleves.filter(e => e.genre === 'fille').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <BiolumiHeader currentPage="GestionEleves" />
      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30">
              <Users className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Registre des Élèves</h1>
              <p className="text-blue-300/60 text-sm">Gestion des inscriptions Terra Nova — {annee}</p>
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-4 mt-4">
            {[
              { label: 'Total', val: eleves.length, color: 'blue' },
              { label: 'Garçons', val: garcons, color: 'sky' },
              { label: 'Filles', val: filles, color: 'pink' },
              { label: 'Classes', val: classes.length, color: 'indigo' },
            ].map(s => (
              <div key={s.label} className={`px-4 py-2 rounded-xl bg-${s.color}-500/10 border border-${s.color}-400/20 text-center`}>
                <div className={`text-2xl font-black text-${s.color}-300`}>{s.val}</div>
                <div className="text-white/40 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne gauche : formulaires */}
          <div className="space-y-4">
            {/* Ajout individuel */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-400" /> Ajouter un élève</h2>
              <div className="space-y-3">
                <input value={singleForm.prenom} onChange={e => setSingleForm(f => ({ ...f, prenom: e.target.value }))}
                  placeholder="Prénom *" className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-400/50" />
                <input value={singleForm.nom} onChange={e => setSingleForm(f => ({ ...f, nom: e.target.value }))}
                  placeholder="Nom *" className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-400/50" />
                <input value={singleForm.classe} onChange={e => setSingleForm(f => ({ ...f, classe: e.target.value }))}
                  placeholder="Classe (ex: 6A, CM2...)" className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-400/50" />
                <div className="flex gap-2">
                  <button onClick={() => setSingleForm(f => ({ ...f, genre: 'garcon' }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${singleForm.genre === 'garcon' ? 'bg-sky-500/20 border-sky-400/50 text-sky-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    👦 Garçon
                  </button>
                  <button onClick={() => setSingleForm(f => ({ ...f, genre: 'fille' }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${singleForm.genre === 'fille' ? 'bg-pink-500/20 border-pink-400/50 text-pink-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    👧 Fille
                  </button>
                </div>
                <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-mono">
                  Numéro → {getNextNumero(singleForm.genre)}
                </div>
                <Button onClick={handleSingleAdd} disabled={createMutation.isPending || !singleForm.prenom || !singleForm.nom}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                  {createMutation.isPending ? '⏳…' : '✅ Ajouter'}
                </Button>
              </div>
            </div>

            {/* Import en masse */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <button onClick={() => setShowBulk(!showBulk)} className="w-full flex items-center justify-between text-white font-bold mb-1">
                <span className="flex items-center gap-2"><Upload className="w-4 h-4 text-amber-400" /> Import en masse</span>
                <span className="text-white/40 text-xs">{showBulk ? '▲' : '▼'}</span>
              </button>
              <AnimatePresence>
                {showBulk && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-3 space-y-3">
                      <p className="text-white/40 text-xs">Un élève par ligne : <code className="text-amber-300">Prénom Nom</code></p>
                      <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={8}
                        placeholder={"Alice Dupont\nBob Martin\nChloé Bernard\n..."}
                        className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-amber-400/50 resize-none" />
                      <input value={bulkClasse} onChange={e => setBulkClasse(e.target.value)}
                        placeholder="Classe commune (facultatif)" className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none" />
                      <div className="flex gap-2">
                        <button onClick={() => setBulkGenre('garcon')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${bulkGenre === 'garcon' ? 'bg-sky-500/20 border-sky-400/50 text-sky-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
                          👦 Garçons
                        </button>
                        <button onClick={() => setBulkGenre('fille')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${bulkGenre === 'fille' ? 'bg-pink-500/20 border-pink-400/50 text-pink-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
                          👧 Filles
                        </button>
                      </div>
                      <Button onClick={handleBulkImport} disabled={bulkLoading || !bulkText.trim()}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white">
                        {bulkLoading ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Import en cours…</> : `📥 Importer ${bulkText.trim().split('\n').filter(l => l.trim()).length} élèves`}
                      </Button>
                      {bulkResult && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-sm text-center">
                          ✅ {bulkResult.created} élèves importés avec succès !
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Export */}
            <Button onClick={handleExportCSV} variant="outline" className="w-full border-white/20 text-white/60 hover:bg-white/5 gap-2">
              <Download className="w-4 h-4" /> Exporter la liste (CSV)
            </Button>
          </div>

          {/* Colonne droite : liste */}
          <div className="lg:col-span-2">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              {/* Filtres */}
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher par nom, prénom ou numéro…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-400/50" />
                </div>
                <select value={filterClasse} onChange={e => setFilterClasse(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm focus:outline-none [color-scheme:dark]">
                  <option value="">Toutes classes</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-white/40">Chargement…</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm">Aucun élève trouvé</div>
              ) : (
                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                  {filtered.map(eleve => (
                    <motion.div key={eleve.id} layout
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 group transition-all">
                      <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg flex-shrink-0 ${eleve.genre === 'fille' ? 'bg-pink-500/20 text-pink-300' : 'bg-sky-500/20 text-sky-300'}`}>
                        {eleve.numero}
                      </span>
                      <span className="text-white font-semibold text-sm flex-1">{eleve.prenom} {eleve.nom}</span>
                      {eleve.classe && <span className="text-white/30 text-xs">{eleve.classe}</span>}
                      <button onClick={() => deleteMutation.mutate(eleve.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
              <div className="mt-3 text-white/30 text-xs text-right">{filtered.length} élève{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>

        {/* Instructions d'utilisation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-8 p-5 rounded-2xl bg-teal-500/10 border border-teal-400/20">
          <h3 className="text-teal-300 font-bold mb-3">💡 Comment ça fonctionne ?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-teal-200/70">
            <div><strong className="text-white">1. Inscrire les élèves</strong><br />Importez en masse par nom/prénom ou ajoutez un à un. Chaque élève reçoit un numéro unique (ex: TN-G042 pour un garçon, TN-F017 pour une fille).</div>
            <div><strong className="text-white">2. Distribuer les numéros</strong><br />Imprimez ou notez les numéros. Lors d'une session Bio-Focus ou autre activité, les élèves s'identifient avec leur numéro ou leur prénom+nom.</div>
            <div><strong className="text-white">3. Rejoindre une session</strong><br />Sur la page Bio-Focus, l'élève entre son code équipe + son numéro (ou prénom/nom) — sans besoin de compte, email ni mot de passe.</div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}