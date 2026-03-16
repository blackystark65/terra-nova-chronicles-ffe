import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import GameHeader from '@/components/recyclage/GameHeader';
import BinWithLevel from '@/components/recyclage/BinWithLevel';
import GameWasteItem from '@/components/recyclage/GameWasteItem';
import TruckAnimation from '@/components/recyclage/TruckAnimation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Trophy, Info } from 'lucide-react';
import { computeRewards } from '@/lib/rewardPlayer';

const ZONES = [
  { id: 'kitchen', name: 'Cuisine', emoji: '👨‍🍳', bg: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/42f687342_cuisine.png' },
  { id: 'restaurant', name: 'Restaurant', emoji: '🍽️', bg: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/75190a64a_restaurant.png' },
  { id: 'reception', name: 'Réception', emoji: '🏨', bg: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/3f8c44259_reception.png' },
  { id: 'rooms', name: 'Chambres', emoji: '🛏️', bg: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/d13fa3ffa_chambre.png' },
];

const BIN_TYPES = {
  paper: { name: 'Papier', emoji: '📄', color: 'bg-blue-500' },
  plastic: { name: 'Plastique', emoji: '🧴', color: 'bg-yellow-500' },
  glass: { name: 'Verre', emoji: '🍾', color: 'bg-green-500' },
  organic: { name: 'Organique', emoji: '🥕', color: 'bg-amber-700' },
  metal: { name: 'Métal', emoji: '🥫', color: 'bg-gray-500' },
  general: { name: 'Incinérable', emoji: '🗑️', color: 'bg-black' },
};

const WASTE_TYPES = {
  kitchen: [
    { name: 'Épluchures', emoji: '🥔', bin: 'organic' },
    { name: 'Bouteille verre', emoji: '🍾', bin: 'glass' },
    { name: 'Boîte conserve', emoji: '🥫', bin: 'metal' },
    { name: 'Carton pizza', emoji: '📦', bin: 'paper' },
    { name: 'Film plastique', emoji: '🧴', bin: 'plastic' },
  ],
  restaurant: [
    { name: 'Assiette jetable', emoji: '🍽️', bin: 'plastic' },
    { name: 'Serviettes papier', emoji: '🧻', bin: 'paper' },
    { name: 'Restes repas', emoji: '🍝', bin: 'organic' },
    { name: 'Canette soda', emoji: '🥫', bin: 'metal' },
  ],
  reception: [
    { name: 'Papiers bureau', emoji: '📄', bin: 'paper' },
    { name: 'Gobelets plastique', emoji: '🥤', bin: 'plastic' },
    { name: 'Enveloppes', emoji: '✉️', bin: 'paper' },
  ],
  rooms: [
    { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic' },
    { name: 'Journaux', emoji: '📰', bin: 'paper' },
    { name: 'Mouchoirs', emoji: '🧻', bin: 'general' },
  ],
};

export default function RecyclageGame() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showTruck, setShowTruck] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [user, setUser] = useState(null);
  const [playerRole, setPlayerRole] = useState(null);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const queryClient = useQueryClient();
  const sessionStats = useRef({ wastes_sorted: 0, perfect_sorts: 0, bins_emptied: 0, score: 0 });

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.EcoProfile.list(),
  });
  const profile = profiles?.[0];

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EcoProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['profiles']),
  });

  useEffect(() => {
    const fetchUserAndRole = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        const roles = await base44.entities.PlayerRole.filter({ created_by: currentUser.email });
        if (roles.length > 0) {
          setPlayerRole(roles[0]);
        }
      } catch (error) {
        console.error('Error fetching user data');
      }
    };
    fetchUserAndRole();
  }, []);

  // Sauvegarde des points toutes les 30 secondes et à la fin d'une session
  const saveProgress = () => {
    if (!profile || sessionStats.current.wastes_sorted === 0) return;
    const stats = sessionStats.current;
    const xp = stats.wastes_sorted * 5 + stats.perfect_sorts * 10 + stats.bins_emptied * 20;
    const credits = Math.floor(xp / 3);
    const updates = computeRewards(profile, {
      xp,
      credits,
      impact_score: stats.score,
      recycling_stats: {
        wastes_sorted: stats.wastes_sorted,
        perfect_sorts: stats.perfect_sorts,
        bins_emptied: stats.bins_emptied,
        score: stats.score,
      },
    });
    updateProfileMutation.mutate({ id: profile.id, data: updates });
    sessionStats.current = { wastes_sorted: 0, perfect_sorts: 0, bins_emptied: 0, score: 0 };
  };

  // Generate waste periodically
  useEffect(() => {
    if (!gameStarted || !selectedZone) return;
    
    const interval = setInterval(() => {
      generateNewWaste();
    }, 8000); // New waste every 8 seconds

    return () => clearInterval(interval);
  }, [gameStarted, selectedZone]);

  // Fill bins over time when wastes pending
  useEffect(() => {
    if (!gameStarted || !gameState) return;
    
    const interval = setInterval(() => {
      if (gameState.pending_wastes?.length > 5) {
        // Penalty: bins fill up if too many wastes pending
        setGameState(prev => ({
          ...prev,
          bin_levels: {
            ...prev.bin_levels,
            general: Math.min(100, (prev.bin_levels?.general || 0) + 2)
          }
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [gameStarted, gameState]);

  const generateNewWaste = () => {
    if (!selectedZone || !gameState) return;
    
    const zoneWastes = WASTE_TYPES[selectedZone.id] || [];
    const randomWaste = zoneWastes[Math.floor(Math.random() * zoneWastes.length)];
    
    const newWaste = {
      id: Date.now().toString(),
      ...randomWaste,
      correct_bin: randomWaste.bin,
      timestamp: new Date().toISOString()
    };
    
    setGameState(prev => ({
      ...prev,
      pending_wastes: [...(prev.pending_wastes || []), newWaste]
    }));
  };

  const handleSortWaste = (waste, binType) => {
    const isCorrect = waste.correct_bin === binType;
    
    if (isCorrect) {
      // Correct sort
      setScore(prev => prev + 10 + (streak * 5));
      setStreak(prev => prev + 1);
      
      // Add to bin level
      setGameState(prev => ({
        ...prev,
        pending_wastes: prev.pending_wastes.filter(w => w.id !== waste.id),
        bin_levels: {
          ...prev.bin_levels,
          [binType]: Math.min(100, (prev.bin_levels[binType] || 0) + 10)
        }
      }));
      setSelectedWaste(null);
    } else {
      // Wrong sort
      setMistakes(prev => prev + 1);
      setStreak(0);
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  const handleEmptyBin = (binType) => {
    if (gameState?.bin_levels?.[binType] >= 100) {
      setShowTruck(binType);
      setScore(prev => prev + 50);
    }
  };

  const completeTruckAnimation = () => {
    setGameState(prev => ({
      ...prev,
      bin_levels: {
        ...prev.bin_levels,
        [showTruck]: 0
      }
    }));
    setShowTruck(null);
  };

  const startGame = (zone) => {
    setSelectedZone(zone);
    setGameState({
      zone: zone.id,
      bin_levels: { paper: 0, plastic: 0, glass: 0, organic: 0, metal: 0, general: 0 },
      pending_wastes: [],
      score: 0,
      mistakes: 0
    });
    setScore(0);
    setMistakes(0);
    setStreak(0);
    setGameStarted(true);
    setShowTutorial(false);
    
    // Generate first wastes
    setTimeout(() => generateNewWaste(), 2000);
  };

  if (!selectedZone) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/95 via-teal-950/90 to-cyan-950/95" />
        <BiolumiHeader currentPage="Recyclage" />
        
        <main className="relative z-10 pt-24 px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 mb-6">
                <Trophy className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">
                  {playerRole ? `${playerRole.role_name} - Gestion du Recyclage` : 'Jeu de Gestion du Recyclage'}
                </span>
              </div>
              
              <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Gestion des Déchets - Hôtel Terra Nova
              </h1>
              <p className="text-xl text-emerald-200 max-w-3xl mx-auto mb-8">
                Les déchets s'accumulent dans l'hôtel ! Trie-les rapidement dans les bonnes poubelles avant qu'elles ne débordent.
                Appelle les camions quand c'est plein !
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {ZONES.map((zone, i) => (
                <motion.button
                  key={zone.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => startGame(zone)}
                  className="relative rounded-3xl overflow-hidden border-4 border-emerald-400/30 shadow-2xl group"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${zone.bg})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/70" />
                  
                  <div className="relative p-8 text-left">
                    <div className="text-6xl mb-4">{zone.emoji}</div>
                    <h3 className="text-3xl font-bold text-white mb-2">{zone.name}</h3>
                    <p className="text-emerald-300 text-sm mb-4">Cliquer pour jouer</p>
                    
                    <div className="flex items-center gap-2 text-white">
                      <Play className="w-5 h-5" />
                      <span className="font-semibold">Démarrer le jeu</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${selectedZone.bg})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/90 via-emerald-950/85 to-teal-950/90" />
      
      <BiolumiHeader currentPage="Recyclage" />
      
      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => {
                setSelectedZone(null);
                setGameStarted(false);
              }}
              variant="outline"
              className="border-emerald-400 text-emerald-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Changer de zone
            </Button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600">
                <span className="text-4xl">{selectedZone.emoji}</span>
                <h2 className="text-2xl font-bold text-white">{selectedZone.name}</h2>
              </div>
            </div>
            
            <div className="w-32" />
          </div>

          <GameHeader score={score} mistakes={mistakes} streak={streak} />

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Déchets en attente */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/30">
                <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Déchets à trier ({gameState?.pending_wastes?.length || 0})
                </h3>
                
                <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto relative">
                  <AnimatePresence>
                    {gameState?.pending_wastes?.map(waste => (
                      <div 
                        key={waste.id} 
                        className="relative cursor-pointer"
                        onClick={() => setSelectedWaste(waste)}
                      >
                        <GameWasteItem
                          waste={waste}
                          isSelected={selectedWaste?.id === waste.id}
                        />
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {(!gameState?.pending_wastes || gameState.pending_wastes.length === 0) && (
                  <div className="text-center py-12 text-emerald-400/50">
                    <p>En attente de déchets...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Poubelles */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/30">
                <h3 className="text-xl font-bold text-emerald-300 mb-4">
                  Poubelles de tri
                </h3>
                
                <div className="grid grid-cols-3 gap-4 relative z-10">
                  {Object.entries(BIN_TYPES).map(([key, bin]) => (
                    <div
                      key={key}
                      onClick={() => {
                        if (selectedWaste) {
                          handleSortWaste(selectedWaste, key);
                        } else if (gameState?.bin_levels?.[key] >= 100) {
                          handleEmptyBin(key);
                        }
                      }}
                      className="relative cursor-pointer"
                    >
                      <BinWithLevel
                        binType={key}
                        binInfo={bin}
                        level={gameState?.bin_levels?.[key] || 0}
                        canEmpty={true}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-emerald-900/30 rounded-xl p-4 border border-emerald-500/30">
                  <p className="text-sm text-emerald-300 text-center">
                    💡 <strong>Astuce:</strong> Clique sur un déchet puis sur une poubelle pour trier. 
                    Clique sur une poubelle pleine (100%) pour appeler le camion !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TruckAnimation 
        show={showTruck !== null}
        binType={showTruck}
        onComplete={completeTruckAnimation}
      />
    </div>
  );
}