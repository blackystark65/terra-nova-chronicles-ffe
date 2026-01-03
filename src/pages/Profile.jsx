import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import XPBar from '@/components/shared/XPBar';
import BadgeDisplay, { badgeIcons } from '@/components/shared/BadgeDisplay';
import { User, Trophy, Map, Target } from 'lucide-react';

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.EcoProfile.list(),
  });

  const profile = profiles?.[0];

  const createProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.EcoProfile.create(data),
    onSuccess: () => queryClient.invalidateQueries(['profiles']),
  });

  useEffect(() => {
    if (user && !profile) {
      createProfileMutation.mutate({
        eco_level: 1,
        experience_points: 0,
        badges: [],
        biomes_explored: [],
        species_discovered: [],
        missions_completed: 0,
        total_impact_score: 0,
      });
    }
  }, [user, profile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 flex items-center justify-center">
        <div className="text-emerald-300">Chargement...</div>
      </div>
    );
  }

  const nextLevelXP = profile.eco_level * 200;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950">
      <BiolumiHeader currentPage="Profile" />

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Carte profil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-emerald-400/20"
          >
            <div className="flex items-start gap-6">
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(16, 185, 129, 0.5)',
                    '0 0 40px rgba(16, 185, 129, 0.8)',
                    '0 0 20px rgba(16, 185, 129, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <User className="w-12 h-12 text-white" />
              </motion.div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-emerald-300 mb-2">{user?.full_name || 'Éco-Sentinelle'}</h1>
                <p className="text-emerald-400/70 mb-4">{user?.email}</p>
                
                <XPBar
                  level={profile.eco_level}
                  currentXP={profile.experience_points % nextLevelXP}
                  nextLevelXP={nextLevelXP}
                />
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Trophy, label: 'Missions', value: profile.missions_completed, color: 'from-amber-400 to-orange-500' },
              { icon: Map, label: 'Biomes explorés', value: profile.biomes_explored?.length || 0, color: 'from-emerald-400 to-teal-500' },
              { icon: Target, label: 'Impact Total', value: profile.total_impact_score, color: 'from-cyan-400 to-blue-500' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-emerald-400/20"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-emerald-400/70 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-emerald-300">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-emerald-400/20"
          >
            <h2 className="text-2xl font-bold text-emerald-300 mb-6">🏆 Mes Badges</h2>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {Object.keys(badgeIcons).map((badgeId) => {
                const hasBadge = profile.badges?.some(b => b.badge_id === badgeId);
                return (
                  <BadgeDisplay
                    key={badgeId}
                    badge={badgeId}
                    size="lg"
                    showName
                    locked={!hasBadge}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}