import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { CARTES } from '@/components/biodiversite/CartesData';
import { Upload, CheckCircle, Music, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminAudioPage() {
  const [uploading, setUploading] = useState(null); // id de la carte en cours
  const [uploadedUrls, setUploadedUrls] = useState({}); // { id: url }
  const [copiedId, setCopiedId] = useState(null);

  // Filtrer uniquement les oiseaux (qui ont des sons)
  const oiseaux = CARTES.filter(c => c.categorie === 'Oiseau');

  const handleFileUpload = async (carte, file) => {
    if (!file) return;
    setUploading(carte.id);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedUrls(prev => ({ ...prev, [carte.id]: file_url }));
    } catch (e) {
      alert('Erreur lors de l\'upload : ' + e.message);
    } finally {
      setUploading(null);
    }
  };

  const copyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950">
      <BiolumiHeader currentPage="AdminAudio" />

      <main className="pt-24 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-purple-500/10 border border-purple-400/20 mb-6">
              <Music className="w-6 h-6 text-purple-400" />
              <span className="text-purple-300 font-semibold">Administration — Bandes Son</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Upload des Sons d'Oiseaux</h1>
            <p className="text-emerald-300/70">
              Uploadez vos fichiers MP3 pour chaque oiseau. Copiez ensuite l'URL générée et collez-la dans <code className="bg-white/10 px-2 py-0.5 rounded text-cyan-300">CartesData.js</code> dans le champ <code className="bg-white/10 px-2 py-0.5 rounded text-cyan-300">son_url</code>.
            </p>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-sm"
          >
            <p className="font-bold mb-2">📋 Comment ça marche :</p>
            <ol className="list-decimal list-inside space-y-1 text-amber-300/80">
              <li>Cliquez sur "Choisir un MP3" à côté de l'oiseau correspondant</li>
              <li>L'URL du fichier s'affiche automatiquement après l'upload</li>
              <li>Copiez cette URL avec le bouton copier</li>
              <li>Collez-la dans <code className="bg-black/20 px-1 rounded">CartesData.js</code> dans le champ <code className="bg-black/20 px-1 rounded">son_url</code> de l'oiseau</li>
            </ol>
          </motion.div>

          {/* Liste des oiseaux */}
          <div className="space-y-3">
            {oiseaux.map((carte, i) => {
              const url = uploadedUrls[carte.id];
              const isUploading = uploading === carte.id;

              return (
                <motion.div
                  key={carte.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border transition-all ${
                    url
                      ? 'bg-emerald-500/10 border-emerald-400/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {/* Info oiseau */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl">{carte.emoji}</span>
                    <div>
                      <div className="text-white font-semibold text-sm">{carte.nom}</div>
                      <div className="text-emerald-400/60 text-xs italic">{carte.nom_en}</div>
                      <div className="text-white/30 text-xs font-mono">id: {carte.id}</div>
                    </div>
                  </div>

                  {/* Upload + URL */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                    {/* Bouton upload */}
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border text-sm font-semibold transition-all ${
                      isUploading
                        ? 'bg-white/10 border-white/20 text-white/50 cursor-wait'
                        : 'bg-purple-500/20 border-purple-400/40 text-purple-300 hover:bg-purple-500/30'
                    }`}>
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {isUploading ? 'Upload...' : 'Choisir MP3'}
                      <input
                        type="file"
                        accept="audio/mp3,audio/mpeg,audio/*"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => handleFileUpload(carte, e.target.files[0])}
                      />
                    </label>

                    {/* URL générée */}
                    {url && (
                      <div className="flex items-center gap-2 bg-black/30 rounded-xl px-3 py-2 max-w-xs">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-emerald-300 text-xs truncate flex-1">{url.slice(0, 40)}...</span>
                        <button
                          onClick={() => copyUrl(carte.id, url)}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors flex-shrink-0"
                          title="Copier l'URL"
                        >
                          {copiedId === carte.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Récap des URLs copiées */}
          {Object.keys(uploadedUrls).length > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-10 p-6 rounded-2xl bg-slate-900/80 border border-slate-600/40"
            >
              <h2 className="text-white font-bold mb-4">📎 Récapitulatif des URLs uploadées</h2>
              <div className="space-y-2">
                {Object.entries(uploadedUrls).map(([id, url]) => {
                  const carte = CARTES.find(c => c.id === id);
                  return (
                    <div key={id} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono text-xs mt-0.5">'{id}':</span>
                      <span className="text-cyan-300 text-xs break-all">'{url}',</span>
                      <button onClick={() => copyUrl(id + '_recap', url)} className="text-white/40 hover:text-white/80">
                        {copiedId === id + '_recap' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-white/40 text-xs mt-4">Copiez ces lignes et collez-les dans le champ <code>son_url</code> de chaque oiseau dans CartesData.js</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}