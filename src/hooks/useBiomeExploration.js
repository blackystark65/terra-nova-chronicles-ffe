import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { computeRewards } from '@/lib/rewardPlayer';

/**
 * Hook qui récompense l'élève quand il visite un biome pour la première fois.
 * @param {string} biomeId - identifiant du biome (ex: 'ocean', 'rainforest')
 */
export function useBiomeExploration(biomeId) {
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.EcoProfile.list(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EcoProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['profiles']),
  });

  useEffect(() => {
    const profile = profiles?.[0];
    if (!profile || !biomeId) return;

    const alreadyExplored = profile.biomes_explored?.includes(biomeId);
    if (alreadyExplored) return;

    // Premier visite : +30 XP, +10 crédits
    const updates = computeRewards(profile, {
      xp: 30,
      credits: 10,
      biome: biomeId,
    });
    updateProfileMutation.mutate({ id: profile.id, data: updates });
  }, [profiles, biomeId]);
}