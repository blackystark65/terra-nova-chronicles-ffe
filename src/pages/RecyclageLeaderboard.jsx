import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Trophy, Medal, Star, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RecyclageLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
      
      // Get all active game sessions
      const sessions = await base44.entities.GameSession.filter({ is_active: true });
      
      // Get player roles for each session
      const leaderboardData = await Promise.all(
        sessions.map(async (session) => {
          try {
            const role = await base44.entities.PlayerRole.filter({ id: session.player_role_id });
            return {
              ...session,
              role: role[0],
            };
          } catch {
            return null;
          }
        })
      );
      
      // Sort by score and filter nulls
      const sortedData = leaderboardData
        .filter(item => item !== null)
        .sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
      
      setLeaderboard(sortedData);
    } catch (error) {
      console.error('Error loading leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank) => {
    if (rank === 0) return 'from-yellow-400 to-yellow-600';
    if (rank === 1) return 'from-gray-300 to-gray-500';
    if (rank === 2) return 'from-orange-400 to-orange-600';
    return 'from-slate-600 to-slate-800';
  };

  const getMedalEmoji = (rank) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return '🏅';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 to-teal-950">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/95 via-purple-950/90 to-blue-950/95" />
      <BiolumiHeader currentPage="Recyclage" />
      
      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to={createPageUrl('RecyclageSchedule')}>
              <Button variant="outline" className="border-purple-400 text-purple-300">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
              Classement Général
            </h1>
            <p className="text-purple-200 text-lg">
              Les meilleurs recycleurs de l'Hôtel Terra Nova
            </p>
          </motion.div>

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-12">
              {/* 2nd place */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center pt-12"
              >
                <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl p-6 mb-4">
                  <div className="text-6xl mb-3">🥈</div>
                  <div className="text-white font-bold text-lg mb-2">
                    {leaderboard[1].role?.role_name}
                  </div>
                  <div className="text-3xl font-black text-white">
                    {leaderboard[1].total_score}
                  </div>
                  <div className="text-gray-200 text-sm">points</div>
                </div>
                <div className="bg-gray-600 h-24 rounded-t-xl" />
              </motion.div>

              {/* 1st place */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 mb-4 relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className="bg-yellow-500 rounded-full p-3">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-6xl mb-3 mt-4">🥇</div>
                  <div className="text-white font-bold text-xl mb-2">
                    {leaderboard[0].role?.role_name}
                  </div>
                  <div className="text-4xl font-black text-white">
                    {leaderboard[0].total_score}
                  </div>
                  <div className="text-yellow-100 text-sm">points</div>
                </div>
                <div className="bg-yellow-600 h-32 rounded-t-xl" />
              </motion.div>

              {/* 3rd place */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center pt-16"
              >
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 mb-4">
                  <div className="text-6xl mb-3">🥉</div>
                  <div className="text-white font-bold text-lg mb-2">
                    {leaderboard[2].role?.role_name}
                  </div>
                  <div className="text-3xl font-black text-white">
                    {leaderboard[2].total_score}
                  </div>
                  <div className="text-orange-200 text-sm">points</div>
                </div>
                <div className="bg-orange-600 h-20 rounded-t-xl" />
              </motion.div>
            </div>
          )}

          {/* Full Leaderboard */}
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.created_by === currentUser?.email;
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    bg-white/10 backdrop-blur-xl rounded-2xl p-4 border-2 transition-all
                    ${isCurrentUser ? 'border-emerald-400 shadow-lg shadow-emerald-500/20' : 'border-white/10'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-3xl
                        bg-gradient-to-br ${getMedalColor(index)}
                      `}>
                        {index < 3 ? getMedalEmoji(index) : index + 1}
                      </div>
                      
                      {/* Info */}
                      <div>
                        <div className="text-xl font-bold text-white flex items-center gap-2">
                          {entry.role?.role_name}
                          {isCurrentUser && (
                            <span className="text-xs bg-emerald-500 px-2 py-1 rounded">Vous</span>
                          )}
                        </div>
                        <div className="text-sm text-purple-300">
                          Jour {entry.current_day} • {entry.wastes_sorted_today || 0} déchets triés
                        </div>
                      </div>
                    </div>
                    
                    {/* Score */}
                    <div className="text-right">
                      <div className="text-3xl font-black text-white">
                        {entry.total_score || 0}
                      </div>
                      <div className="text-sm text-purple-300">points</div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-emerald-400 text-lg font-bold">
                        {entry.perfect_sorts || 0}
                      </div>
                      <div className="text-xs text-gray-400">Tris parfaits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 text-lg font-bold">
                        {entry.bins_emptied || 0}
                      </div>
                      <div className="text-xs text-gray-400">Poubelles vidées</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 text-lg font-bold">
                        {entry.trucks_sent || 0}
                      </div>
                      <div className="text-xs text-gray-400">Camions envoyés</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {leaderboard.length === 0 && (
            <div className="text-center py-20">
              <Trophy className="w-24 h-24 text-purple-400/30 mx-auto mb-6" />
              <p className="text-purple-300 text-xl">Aucun joueur pour le moment</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}