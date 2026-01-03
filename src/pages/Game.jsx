import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { HelpCircle, Settings, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';

import GardenGrid from '@/components/game/GardenGrid';
import PlantPalette from '@/components/game/PlantPalette';
import EcosystemStats from '@/components/game/EcosystemStats';
import SeasonIndicator from '@/components/game/SeasonIndicator';
import TutorialModal from '@/components/game/TutorialModal';
import AchievementPopup from '@/components/game/AchievementPopup';
import WeatherEvent from '@/components/game/WeatherEvent';

export default function GamePage() {
  const queryClient = useQueryClient();
  const [draggingPlant, setDraggingPlant] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Charger ou créer le jardin
  const { data: gardens, isLoading } = useQuery({
    queryKey: ['gardens'],
    queryFn: () => base44.entities.Garden.list(),
  });

  const garden = gardens?.[0];

  const createGardenMutation = useMutation({
    mutationFn: (data) => base44.entities.Garden.create(data),
    onSuccess: () => queryClient.invalidateQueries(['gardens']),
  });

  const updateGardenMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Garden.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['gardens']),
  });

  // Créer un jardin initial si nécessaire
  useEffect(() => {
    if (!isLoading && !garden) {
      createGardenMutation.mutate({
        name: 'Mon Premier Jardin',
        level: 1,
        biodiversity_points: 0,
        soil_health: 50,
        water_level: 50,
        plants: [],
        animals: [],
        achievements: [],
        current_season: 'spring',
      });
      setShowTutorial(true);
    }
  }, [isLoading, garden]);

  // Événements aléatoires
  useEffect(() => {
    if (garden && garden.plants?.length > 3) {
      const eventTimer = setTimeout(() => {
        const events = ['drought', 'storm', 'pests'];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        if (Math.random() > 0.7) {
          setCurrentEvent(randomEvent);
        }
      }, 30000);

      return () => clearTimeout(eventTimer);
    }
  }, [garden?.plants?.length]);

  const handleDragStart = (e, plantType) => {
    e.dataTransfer.setData('plantType', plantType);
    setDraggingPlant(plantType);
  };

  const handlePlantDrop = (plantType, x, y) => {
    if (!garden) return;

    // Vérifier si la cellule est déjà occupée
    const existingPlant = garden.plants?.find(p => p.x === x && p.y === y);
    if (existingPlant) return;

    const newPlant = {
      id: `plant-${Date.now()}`,
      type: plantType,
      x,
      y,
      growth: 0,
      planted_at: new Date().toISOString(),
    };

    const updatedPlants = [...(garden.plants || []), newPlant];

    // Calculer les nouveaux points
    let newBiodiversityPoints = garden.biodiversity_points + 10;
    let newSoilHealth = Math.min(100, garden.soil_health + 2);
    let newAnimals = [...(garden.animals || [])];
    let newAchievements = [...(garden.achievements || [])];

    // Vérifier les succès
    if (updatedPlants.length === 1 && !newAchievements.includes('first_plant')) {
      newAchievements.push('first_plant');
      setCurrentAchievement('first_plant');
      newBiodiversityPoints += 50;
    }

    // Vérifier les trois sœurs
    const hasCorn = updatedPlants.some(p => p.type === 'corn');
    const hasBean = updatedPlants.some(p => p.type === 'bean');
    const hasSquash = updatedPlants.some(p => p.type === 'squash');
    if (hasCorn && hasBean && hasSquash && !newAchievements.includes('three_sisters')) {
      newAchievements.push('three_sisters');
      setTimeout(() => setCurrentAchievement('three_sisters'), 1500);
      newBiodiversityPoints += 100;
    }

    // Attirer des animaux
    const sunflowers = updatedPlants.filter(p => p.type === 'sunflower').length;
    if (sunflowers >= 1 && !newAnimals.some(a => a.type === 'bee')) {
      newAnimals.push({ type: 'bee', unlocked_at: new Date().toISOString() });
      if (!newAchievements.includes('bee_friend')) {
        newAchievements.push('bee_friend');
        setTimeout(() => setCurrentAchievement('bee_friend'), 3000);
        newBiodiversityPoints += 75;
      }
    }

    const lavenders = updatedPlants.filter(p => p.type === 'lavender').length;
    if (lavenders >= 2 && !newAnimals.some(a => a.type === 'butterfly')) {
      newAnimals.push({ type: 'butterfly', unlocked_at: new Date().toISOString() });
    }

    const trees = updatedPlants.filter(p => p.type === 'tree').length;
    if (trees >= 3 && !newAnimals.some(a => a.type === 'bird')) {
      newAnimals.push({ type: 'bird', unlocked_at: new Date().toISOString() });
    }

    if (trees >= 5 && !newAchievements.includes('forest_guardian')) {
      newAchievements.push('forest_guardian');
      setTimeout(() => setCurrentAchievement('forest_guardian'), 4500);
      newBiodiversityPoints += 150;
    }

    // Calculer le niveau
    const newLevel = Math.floor(newBiodiversityPoints / 100) + 1;

    updateGardenMutation.mutate({
      id: garden.id,
      data: {
        plants: updatedPlants,
        biodiversity_points: newBiodiversityPoints,
        soil_health: newSoilHealth,
        animals: newAnimals,
        achievements: newAchievements,
        level: newLevel,
      },
    });

    setDraggingPlant(null);
  };

  const handleSeasonChange = (newSeason) => {
    if (garden) {
      updateGardenMutation.mutate({
        id: garden.id,
        data: { current_season: newSeason },
      });
    }
  };

  const handleEventSolve = (solutionId) => {
    setCurrentEvent(null);
    if (garden) {
      let bonus = 0;
      if (solutionId === 'mulch' || solutionId === 'trees' || solutionId === 'hedge') {
        bonus = 30;
      } else if (solutionId === 'ladybugs' || solutionId === 'companions') {
        bonus = 25;
      }
      
      updateGardenMutation.mutate({
        id: garden.id,
        data: {
          biodiversity_points: garden.biodiversity_points + bonus,
          soil_health: Math.min(100, garden.soil_health + 10),
        },
      });
    }
  };

  const handleReset = () => {
    if (garden && window.confirm('Es-tu sûr de vouloir recommencer ton jardin ?')) {
      updateGardenMutation.mutate({
        id: garden.id,
        data: {
          plants: [],
          animals: [],
          biodiversity_points: 0,
          soil_health: 50,
          water_level: 50,
          level: 1,
          achievements: [],
        },
      });
    }
  };

  const seasonBg = {
    spring: 'from-green-100 via-emerald-50 to-teal-100',
    summer: 'from-amber-100 via-yellow-50 to-orange-100',
    autumn: 'from-orange-100 via-amber-50 to-red-100',
    winter: 'from-blue-100 via-slate-50 to-indigo-100',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🌱
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${seasonBg[garden?.current_season || 'spring']} transition-all duration-1000`}>
      {/* Éléments décoratifs de fond */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🌿
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-3xl opacity-20"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          🍃
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-3xl opacity-20"
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          🌸
        </motion.div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.span
              className="text-4xl md:text-5xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🌍
            </motion.span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Écosystème Titan
              </h1>
              <p className="text-sm text-slate-600">Gardien de la Terre - Niveau {garden?.level || 1}</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2 md:gap-4">
            <SeasonIndicator
              currentSeason={garden?.current_season || 'spring'}
              onSeasonChange={handleSeasonChange}
            />

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowTutorial(true)}
              className="rounded-full bg-white/50 backdrop-blur-sm border-white/50 hover:bg-white/70"
            >
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="rounded-full bg-white/50 backdrop-blur-sm border-white/50 hover:bg-white/70"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-slate-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-600" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="rounded-full bg-white/50 backdrop-blur-sm border-white/50 hover:bg-white/70"
            >
              <RotateCcw className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Palette de plantes (sidebar gauche) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <PlantPalette
              onDragStart={handleDragStart}
              draggingPlant={draggingPlant}
            />
          </motion.div>

          {/* Grille de jardin (centre) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-6"
          >
            <GardenGrid
              plants={garden?.plants || []}
              onPlantDrop={handlePlantDrop}
              season={garden?.current_season || 'spring'}
            />
          </motion.div>

          {/* Statistiques (sidebar droite) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <EcosystemStats garden={garden} />
          </motion.div>
        </div>
      </main>

      {/* Modals */}
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      
      <AchievementPopup
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />

      <WeatherEvent
        event={currentEvent}
        onSolve={handleEventSolve}
        onClose={() => setCurrentEvent(null)}
      />
    </div>
  );
}