import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Upload, CheckCircle, Copy, Check, Trash2, ArrowLeft, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CHAPTERS = [
  { id: 'climat',               name: 'Climat',                          emoji: '🌡️' },
  { id: 'eau',                  name: 'Eau',                             emoji: '💧' },
  { id: 'permaculture',         name: 'Permaculture',                    emoji: '🌿' },
  { id: 'agroecologie',         name: 'Agroécologie',                    emoji: '🌾' },
  { id: 'agroforesterie',       name: 'Agroforesterie',                  emoji: '🌳' },
  { id: 'biodiversite_animale', name: 'Biodiversité — Espèces animales', emoji: '🦋' },
  { id: 'biodiversite_vegetale',name: 'Biodiversité — Espèces végétales',emoji: '🌺' },
  { id: 'energie_renouvelable', name: 'Énergie renouvelable',            emoji: '☀️' },
  { id: 'techniques_cultures',  name: 'Techniques de cultures écologiques', emoji: '🪴' },
  { id: 'sol_compostage',       name: 'Sol & Compostage',                emoji: '🪱' },
  { id: 'semences_graines',     name: 'Semences & Graines',              emoji: '🌱' },
];

export default function AdminEcospherePage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [form, setForm] = useState({ chapter: 'climat', title: '', description: '', order: 0 });
  const [activeChapterFilter, setActiveChapterFilter] = useState('all');
  const [feedback, setFeedback] = useState(null);

  const queryClient = useQueryClient();

  const { data: slides = [] } = useQuery({
    queryKey: ['ecosphere-slides'],
    queryFn: () => base44.entities.EcosphereSlide.list('order', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.EcosphereSlide.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['ecosphere-slides']);
      setUploadedUrl('');
      setForm({ chapter: 'climat', title: '', description: '', order: 0 });
      showFeedback('success', '✅ Planche ajoutée !');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.EcosphereSlide.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['ecosphere-slides']);
      showFeedback('success', '🗑️ Planche supprimée');
    },
  });

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploadedUrl(file_url);
    setUploading(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSave = () => {
    if (!uploadedUrl) { showFeedback('error', '❌ Upload une image d\'abord'); return; }
    createMutation.mutate({ ...form, image_url: uploadedUrl, order: Number(form.order) });
  };

  const filteredSlides = activeChapterFilter === 'all'
    ? slides
    : slides.filter(s => s.chapter === activeChapterFilter);

  const chapter = CHAPTERS.find(c => c.id === form.chapter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950">
      <BiolumiHeader currentPage="AdminEcosphere" />

      <main className="pt-24 px-4 pb-16">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link to={createPageUrl('Ecosphere')}>
              <Button variant="outline" className="mb-4 border-emerald-400 text-emerald-300">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voir l'Écosphère
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-black text-white">Admin — Écosphère</h1>
                <p className="text-emerald-300/70 text-sm">Dépose tes planches dessinées dans les chapitres</p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            {/* Formulaire d'ajout */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30"
            >
              <h2 className="text-xl font-bold text-emerald-300 mb-5 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Ajouter une planche
              </h2>

              {/* Upload image */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">1. Uploader l'image</label>
                <label className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  uploading ? 'border-white/20 opacity-50 cursor-wait' : 'border-emerald-400/40 hover:border-emerald-400 hover:bg-emerald-500/10'
                }`}>
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-emerald-300 text-sm font-semibold">
                    {uploading ? 'Upload en cours...' : 'Choisir une image (JPG, PNG, WEBP)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => handleUpload(e.target.files[0])}
                  />
                </label>

                {uploadedUrl && (
                  <div className="mt-3 space-y-2">
                    <img src={uploadedUrl} alt="Aperçu" className="w-full max-h-40 object-contain rounded-xl border border-emerald-400/20" />
                    <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-emerald-300 text-xs truncate flex-1">{uploadedUrl.slice(0, 50)}...</span>
                      <button onClick={copyUrl} className="text-cyan-400 hover:text-cyan-300 flex-shrink-0">
                        {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chapitre */}
              <div className="mb-3">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">2. Chapitre</label>
                <select
                  value={form.chapter}
                  onChange={(e) => setForm(f => ({ ...f, chapter: e.target.value }))}
                  className="w-full bg-white/10 border border-emerald-400/30 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-emerald-400"
                >
                  {CHAPTERS.map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-800">{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Titre */}
              <div className="mb-3">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">3. Titre (optionnel)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: Le cycle de l'eau"
                  className="w-full bg-white/10 border border-emerald-400/30 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 outline-none focus:border-emerald-400"
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">Légende (optionnel)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description ou légende de la planche..."
                  rows={2}
                  className="w-full bg-white/10 border border-emerald-400/30 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              {/* Ordre */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">Ordre dans le chapitre</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm(f => ({ ...f, order: e.target.value }))}
                  min={0}
                  className="w-32 bg-white/10 border border-emerald-400/30 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={!uploadedUrl || createMutation.isPending}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40"
              >
                {createMutation.isPending ? 'Enregistrement...' : `Ajouter dans "${chapter?.name}"`}
              </Button>
            </motion.div>

            {/* Stats par chapitre */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30"
            >
              <h2 className="text-xl font-bold text-emerald-300 mb-5">📚 État des chapitres</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {CHAPTERS.map(ch => {
                  const count = slides.filter(s => s.chapter === ch.id).length;
                  return (
                    <div key={ch.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{ch.emoji}</span>
                        <span className="text-white/80 text-sm">{ch.name}</span>
                      </div>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                        count > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/30'
                      }`}>
                        {count} planche{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 text-center text-emerald-300/60 text-sm">
                Total : {slides.length} planche{slides.length !== 1 ? 's' : ''}
              </div>
            </motion.div>
          </div>

          {/* Liste des planches existantes */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-emerald-300">🖼️ Planches enregistrées</h2>
              <select
                value={activeChapterFilter}
                onChange={(e) => setActiveChapterFilter(e.target.value)}
                className="bg-white/10 border border-emerald-400/30 rounded-xl px-3 py-1.5 text-white text-sm outline-none focus:border-emerald-400"
              >
                <option value="all" className="bg-slate-800">Tous les chapitres</option>
                {CHAPTERS.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-800">{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>

            {filteredSlides.length === 0 ? (
              <div className="text-center py-12 text-white/30">
                <div className="text-4xl mb-2">📋</div>
                <p>Aucune planche dans ce chapitre</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredSlides
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map(slide => {
                    const ch = CHAPTERS.find(c => c.id === slide.chapter);
                    return (
                      <div key={slide.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/20">
                        <img
                          src={slide.image_url}
                          alt={slide.title || 'Planche'}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                          <div className="text-xs text-white font-bold truncate">{slide.title || 'Sans titre'}</div>
                          <div className="text-[10px] text-white/60">{ch?.emoji} {ch?.name}</div>
                          <div className="text-[10px] text-white/50">Ordre: {slide.order}</div>
                        </div>
                        <button
                          onClick={() => deleteMutation.mutate(slide.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white/70">
                          #{slide.order}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
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