import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import XPBar from '@/components/shared/XPBar';
import BadgeDisplay, { badgeIcons } from '@/components/shared/BadgeDisplay';
import { User, Trophy, Map, Target, Camera, Edit2, Save, X, Recycle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const syncedSessionRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.EcoProfile.list(),
  });

  const { data: gameSession } = useQuery({
    queryKey: ['gameSession', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const sessions = await base44.entities.GameSession.filter({ 
        created_by: user.email,
        is_active: true 
      });
      return sessions[0] || null;
    },
    enabled: !!user,
  });

  const profile = profiles?.[0];

  const createProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.EcoProfile.create(data),
    onSuccess: () => queryClient.invalidateQueries(['profiles']),
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EcoProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['profiles']),
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      setIsEditingName(false);
    },
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
        recycling_stats: {
          total_wastes_sorted: 0,
          perfect_sorts: 0,
          bins_emptied: 0,
          total_score: 0,
        },
      });
    }
  }, [user, profile]);

  // Sync recycling stats and unlock badges
  useEffect(() => {
    if (profile && gameSession) {
      const needsUpdate = 
        profile.recycling_stats?.total_wastes_sorted !== gameSession.wastes_sorted_today ||
        profile.recycling_stats?.total_score !== gameSession.total_score;

      if (needsUpdate) {
        const updatedStats = {
          total_wastes_sorted: (profile.recycling_stats?.total_wastes_sorted || 0) + (gameSession.wastes_sorted_today || 0),
          perfect_sorts: (profile.recycling_stats?.perfect_sorts || 0) + (gameSession.perfect_sorts || 0),
          bins_emptied: (profile.recycling_stats?.bins_emptied || 0) + (gameSession.bins_emptied || 0),
          total_score: gameSession.total_score || 0,
        };

        // Check for badge unlocks
        const newBadges = [...(profile.badges || [])];
        const hasBadge = (id) => newBadges.some(b => b.badge_id === id);

        // Recycling badges
        if (updatedStats.total_wastes_sorted >= 10 && !hasBadge('recycling_beginner')) {
          newBadges.push({ badge_id: 'recycling_beginner', name: 'Recycleur Débutant', unlocked_at: new Date().toISOString() });
        }
        if (updatedStats.total_wastes_sorted >= 50 && !hasBadge('recycling_expert')) {
          newBadges.push({ badge_id: 'recycling_expert', name: 'Expert du Tri', unlocked_at: new Date().toISOString() });
        }
        if (updatedStats.perfect_sorts >= 5 && !hasBadge('perfect_sorter')) {
          newBadges.push({ badge_id: 'perfect_sorter', name: 'Tri Parfait', unlocked_at: new Date().toISOString() });
        }
        if (updatedStats.total_score >= 500 && !hasBadge('eco_warrior')) {
          newBadges.push({ badge_id: 'eco_warrior', name: 'Guerrier Éco', unlocked_at: new Date().toISOString() });
        }

        // Calculate XP gain
        const xpGain = Math.floor((gameSession.wastes_sorted_today || 0) * 5 + (gameSession.perfect_sorts || 0) * 20);
        const newXP = (profile.experience_points || 0) + xpGain;
        const nextLevelXP = profile.eco_level * 200;
        const newLevel = profile.eco_level + Math.floor(newXP / nextLevelXP);

        updateProfileMutation.mutate({
          id: profile.id,
          data: {
            recycling_stats: updatedStats,
            badges: newBadges,
            experience_points: newXP,
            eco_level: newLevel,
            total_impact_score: (profile.total_impact_score || 0) + (gameSession.total_score || 0),
          },
        });
      }
    }
  }, [profile, gameSession]);

  const handleSaveName = () => {
    if (newName.trim()) {
      updateUserMutation.mutate({ display_name: newName.trim() });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.auth.updateMe({ profile_picture: file_url });
      queryClient.invalidateQueries(['user']);
    } catch (error) {
      console.error('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

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
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Photo de profil */}
              <div className="relative">
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg overflow-hidden"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(16, 185, 129, 0.5)',
                      '0 0 40px rgba(16, 185, 129, 0.8)',
                      '0 0 20px rgba(16, 185, 129, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {user?.profile_picture ? (
                    <img 
                      src={user.profile_picture} 
                      alt="Profil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </motion.div>
                
                <label 
                  htmlFor="profile-picture-upload" 
                  className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-3 cursor-pointer hover:bg-emerald-600 transition-colors active:scale-95 shadow-lg z-10"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input 
                    id="profile-picture-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                    capture="environment"
                  />
                </label>
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs">📤</div>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full">
                {/* Nom éditable */}
                {isEditingName ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Votre nom"
                      className="bg-white/10 border-emerald-400/30 text-white flex-1 min-h-[44px] text-base"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveName}
                        disabled={updateUserMutation.isPending}
                        className="bg-emerald-500 hover:bg-emerald-600 flex-1 sm:flex-none active:scale-95 min-h-[44px]"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {updateUserMutation.isPending ? '💾' : <Save className="w-5 h-5" />}
                      </Button>
                      <Button
                        onClick={() => setIsEditingName(false)}
                        variant="outline"
                        className="border-emerald-400/30 text-emerald-300 flex-1 sm:flex-none active:scale-95 min-h-[44px]"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-emerald-300 text-center md:text-left">
                      {user?.display_name || user?.full_name || 'Éco-Sentinelle'}
                    </h1>
                    <Button
                      onClick={() => {
                        setNewName(user?.display_name || user?.full_name || '');
                        setIsEditingName(true);
                      }}
                      size="icon"
                      variant="ghost"
                      className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 active:scale-95"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Edit2 className="w-5 h-5" />
                    </Button>
                  </div>
                )}
                
                <XPBar
                  level={profile.eco_level}
                  currentXP={profile.experience_points % nextLevelXP}
                  nextLevelXP={nextLevelXP}
                />
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Trophy, label: 'Missions', value: profile.missions_completed, color: 'from-amber-400 to-orange-500' },
              { icon: Map, label: 'Biomes explorés', value: profile.biomes_explored?.length || 0, color: 'from-emerald-400 to-teal-500' },
              { icon: Recycle, label: 'Déchets triés', value: profile.recycling_stats?.total_wastes_sorted || 0, color: 'from-green-400 to-emerald-500' },
              { icon: Star, label: 'Score Recyclage', value: profile.recycling_stats?.total_score || 0, color: 'from-purple-400 to-pink-500' },
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