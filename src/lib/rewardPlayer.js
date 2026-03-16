/**
 * Utilitaire centralisé pour attribuer XP, crédits et badges aux élèves.
 * Utiliser dans toutes les pages de jeu/quiz/missions.
 */

// Seuils de badges
const BADGE_RULES = [
  // Recyclage
  { id: 'recycling_beginner', check: (p) => (p.recycling_stats?.total_wastes_sorted || 0) >= 10 },
  { id: 'recycling_expert',   check: (p) => (p.recycling_stats?.total_wastes_sorted || 0) >= 50 },
  { id: 'perfect_sorter',     check: (p) => (p.recycling_stats?.perfect_sorts || 0) >= 5 },
  { id: 'eco_warrior',        check: (p) => (p.total_impact_score || 0) >= 500 },
  // Atlas / Biomes
  { id: 'first_explorer',     check: (p) => (p.biomes_explored?.length || 0) >= 1 },
  { id: 'ocean_guardian',     check: (p) => p.biomes_explored?.includes('ocean') },
  { id: 'forest_protector',   check: (p) => p.biomes_explored?.includes('rainforest') },
  { id: 'mountain_explorer',  check: (p) => p.biomes_explored?.includes('mountains') },
  // Quiz / Missions
  { id: 'biodiversity_expert',check: (p) => (p.missions_completed || 0) >= 3 },
  { id: 'climate_warrior',    check: (p) => (p.experience_points || 0) >= 500 },
  // Ferme
  { id: 'farmer_apprentice',  check: (p) => (p.ferme_actions || 0) >= 5 },
  { id: 'master_farmer',      check: (p) => (p.ferme_actions || 0) >= 20 },
  // Quiz
  { id: 'quiz_champion',      check: (p) => (p.quizzes_completed || 0) >= 5 },
];

/**
 * Calcule et retourne le nouveau profil avec XP, niveau, crédits et badges mis à jour.
 * @param {object} profile - Profil actuel de l'élève
 * @param {object} rewards - { xp, credits, recycling_stats, biome, ferme_action, quiz_completed }
 * @returns {object} Les champs à mettre à jour dans EcoProfile
 */
export function computeRewards(profile, rewards = {}) {
  const {
    xp = 0,
    credits = 0,
    recycling_stats = null,
    biome = null,
    ferme_action = false,
    quiz_completed = false,
    impact_score = 0,
  } = rewards;

  // XP et niveau
  const newXP = (profile.experience_points || 0) + xp;
  const xpPerLevel = 200;
  const newLevel = Math.max(1, Math.floor(newXP / xpPerLevel) + 1);

  // Crédits
  const newCredits = (profile.credits || 0) + credits;

  // Score d'impact
  const newImpact = (profile.total_impact_score || 0) + impact_score;

  // Biomes explorés
  let newBiomes = [...(profile.biomes_explored || [])];
  if (biome && !newBiomes.includes(biome)) {
    newBiomes.push(biome);
  }

  // Stats recyclage
  let newRecycling = { ...(profile.recycling_stats || {}) };
  if (recycling_stats) {
    newRecycling = {
      total_wastes_sorted: (newRecycling.total_wastes_sorted || 0) + (recycling_stats.wastes_sorted || 0),
      perfect_sorts: (newRecycling.perfect_sorts || 0) + (recycling_stats.perfect_sorts || 0),
      bins_emptied: (newRecycling.bins_emptied || 0) + (recycling_stats.bins_emptied || 0),
      total_score: (newRecycling.total_score || 0) + (recycling_stats.score || 0),
    };
  }

  // Compteurs divers
  const newFermeActions = (profile.ferme_actions || 0) + (ferme_action ? 1 : 0);
  const newQuizzesCompleted = (profile.quizzes_completed || 0) + (quiz_completed ? 1 : 0);

  // Profil temporaire pour calculer les badges
  const tempProfile = {
    ...profile,
    experience_points: newXP,
    eco_level: newLevel,
    credits: newCredits,
    total_impact_score: newImpact,
    biomes_explored: newBiomes,
    recycling_stats: newRecycling,
    ferme_actions: newFermeActions,
    quizzes_completed: newQuizzesCompleted,
  };

  // Badges
  const currentBadges = [...(profile.badges || [])];
  const hasBadge = (id) => currentBadges.some(b => b.badge_id === id);

  BADGE_RULES.forEach(rule => {
    if (!hasBadge(rule.id) && rule.check(tempProfile)) {
      currentBadges.push({
        badge_id: rule.id,
        name: rule.id,
        unlocked_at: new Date().toISOString(),
      });
    }
  });

  return {
    experience_points: newXP,
    eco_level: newLevel,
    credits: newCredits,
    total_impact_score: newImpact,
    biomes_explored: newBiomes,
    recycling_stats: newRecycling,
    badges: currentBadges,
    ferme_actions: newFermeActions,
    quizzes_completed: newQuizzesCompleted,
  };
}