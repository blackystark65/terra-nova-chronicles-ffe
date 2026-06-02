import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { GitPullRequest, Bug, AlertCircle, CheckCircle2, Circle, RefreshCw, ExternalLink, Tag } from 'lucide-react';
import BiolumiHeader from '@/components/shared/BiolumiHeader';

const LABEL_COLORS = {
  bug: 'bg-red-500/20 text-red-300 border-red-400/30',
  enhancement: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  documentation: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  question: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  'good first issue': 'bg-green-500/20 text-green-300 border-green-400/30',
};

function getLabelStyle(name) {
  return LABEL_COLORS[name.toLowerCase()] || 'bg-white/10 text-white/60 border-white/20';
}

function IssueCard({ issue }) {
  const isOpen = issue.state === 'open';
  const isPR = !!issue.pull_request;

  return (
    <motion.a
      href={issue.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="block p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isPR ? (
            <GitPullRequest className={`w-5 h-5 ${isOpen ? 'text-emerald-400' : 'text-purple-400'}`} />
          ) : isOpen ? (
            <Circle className="w-5 h-5 text-emerald-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-emerald-300 transition-colors">
              {issue.title}
            </h3>
            <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 flex-shrink-0 mt-0.5 transition-colors" />
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-white/40 text-xs">#{issue.number}</span>
            {issue.labels?.map(label => (
              <span key={label.id} className={`px-2 py-0.5 rounded-full text-xs border ${getLabelStyle(label.name)}`}>
                {label.name}
              </span>
            ))}
            {issue.assignee && (
              <span className="text-white/40 text-xs flex items-center gap-1">
                <img src={issue.assignee.avatar_url} alt="" className="w-4 h-4 rounded-full" />
                {issue.assignee.login}
              </span>
            )}
          </div>
          <p className="text-white/30 text-xs mt-1">
            {isOpen ? 'Ouvert' : 'Fermé'} · mis à jour {new Date(issue.updated_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

export default function GithubIssuesPage() {
  const [filter, setFilter] = useState('open'); // 'open' | 'closed' | 'all'
  const [labelFilter, setLabelFilter] = useState('');

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['github-issues'],
    queryFn: async () => {
      const res = await base44.functions.invoke('getGithubIssues', {});
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const issues = data?.issues || [];

  const allLabels = [...new Set(issues.flatMap(i => i.labels?.map(l => l.name) || []))];

  const filtered = issues.filter(issue => {
    const stateMatch = filter === 'all' || issue.state === filter;
    const labelMatch = !labelFilter || issue.labels?.some(l => l.name === labelFilter);
    return stateMatch && labelMatch;
  });

  const openCount = issues.filter(i => i.state === 'open').length;
  const closedCount = issues.filter(i => i.state === 'closed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950">
      <BiolumiHeader currentPage="GithubIssues" />

      <main className="pt-24 px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-emerald-400" />
                Suivi Projet — Issues GitHub
              </h1>
              <p className="text-white/40 text-sm mt-1">terra-nova-chronicles-Base</p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stats */}
          {!isLoading && !error && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Total', value: issues.length, color: 'text-white' },
                { label: 'Ouvertes', value: openCount, color: 'text-emerald-400' },
                { label: 'Fermées', value: closedCount, color: 'text-purple-400' },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['open', 'closed', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${filter === f ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
              >
                {f === 'open' ? '🟢 Ouvertes' : f === 'closed' ? '✅ Fermées' : '📋 Toutes'}
              </button>
            ))}
            {allLabels.length > 0 && (
              <select
                value={labelFilter}
                onChange={e => setLabelFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-white/5 text-white/60 border-white/10 focus:outline-none focus:border-emerald-400/40"
              >
                <option value="">🏷️ Tous les labels</option>
                {allLabels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            )}
          </div>

          {/* Contenu */}
          {isLoading && (
            <div className="text-center py-16 text-white/40">
              <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
              Chargement des issues…
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-400/20 text-red-300 text-sm text-center">
              ⚠️ Erreur lors du chargement. Vérifiez que le repo est correct dans la fonction backend.
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-16 text-white/30 text-sm">Aucune issue trouvée.</div>
          )}

          <div className="space-y-2">
            {filtered.map(issue => <IssueCard key={issue.id} issue={issue} />)}
          </div>
        </div>
      </main>
    </div>
  );
}