import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Clock, MapPin, ArrowRight, Calendar, Trophy, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROLE_SCHEDULES, ZONE_NAMES, ZONE_PAGES } from '@/components/recyclage/RoleSchedule';

export default function RecyclageSchedule() {
  const [playerRole, setPlayerRole] = useState(null);
  const [gameSession, setGameSession] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = async () => {
    try {
      const user = await base44.auth.me();
      const roles = await base44.entities.PlayerRole.filter({ created_by: user.email });
      
      if (roles.length > 0) {
        const role = roles[0];
        setPlayerRole(role);
        setSchedule(ROLE_SCHEDULES[role.role] || []);
        
        // Load or create game session
        const sessions = await base44.entities.GameSession.filter({ 
          created_by: user.email,
          is_active: true 
        });
        
        if (sessions.length > 0) {
          setGameSession(sessions[0]);
          setCurrentSlot(sessions[0].current_time_slot || 0);
        } else {
          // Create new session
          const newSession = await base44.entities.GameSession.create({
            player_role_id: role.id,
            current_zone: ROLE_SCHEDULES[role.role]?.[0]?.zone || 'reception',
            current_time_slot: 0,
            total_score: 0,
            current_day: 1,
          });
          setGameSession(newSession);
        }
      }
    } catch (error) {
      console.error('Error loading player data');
    } finally {
      setLoading(false);
    }
  };

  const startActivity = async (slotIndex) => {
    if (!schedule[slotIndex] || !gameSession) return;
    
    const slot = schedule[slotIndex];
    
    // Update session
    await base44.entities.GameSession.update(gameSession.id, {
      current_zone: slot.zone,
      current_time_slot: slotIndex,
    });
    
    // Navigate to zone with timer info
    const zonePage = ZONE_PAGES[slot.zone];
    if (zonePage) {
      window.location.href = createPageUrl(zonePage) + 
        `?duration=${slot.duration}&session_id=${gameSession.id}&slot=${slotIndex}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 to-teal-950">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!playerRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 to-teal-950">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Aucun rôle sélectionné</p>
          <Link to={createPageUrl('RecyclageRoleSelection')}>
            <Button className="bg-emerald-500">Choisir un rôle</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedSlots = gameSession?.current_time_slot || 0;
  const progress = (completedSlots / schedule.length) * 100;

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/17ce4623e_PlanHotelTerraaNova.png)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/40 via-emerald-950/30 to-teal-950/40" />
      <BiolumiHeader currentPage="Recyclage" />
      
      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 mb-4">
              <Calendar className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">
                Jour {gameSession?.current_day || 1} - {playerRole.role_name}
              </span>
            </div>
            
            <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Emploi du Temps
            </h1>
            <p className="text-emerald-200 text-lg">
              Suis ton planning et trie des déchets pour gagner des points !
            </p>
          </motion.div>

          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/30 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-white">
                  {gameSession?.total_score || 0} points
                </span>
              </div>
              <div className="text-emerald-300 text-sm">
                {gameSession?.wastes_sorted_today || 0} déchets triés aujourd'hui
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center text-emerald-400 text-sm mt-2">
              {completedSlots} / {schedule.length} activités complétées
            </div>
          </motion.div>

          {/* Schedule Timeline */}
          <div className="space-y-4">
            {schedule.map((slot, index) => {
              const isCompleted = index < completedSlots;
              const isCurrent = index === completedSlots;
              const isLocked = index > completedSlots;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2
                    ${isCurrent ? 'border-emerald-400 shadow-lg shadow-emerald-500/20' : 
                      isCompleted ? 'border-green-600/50' : 'border-slate-700'}
                    ${isLocked ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Time */}
                      <div className="text-center">
                        <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                        <div className="text-white font-bold">{slot.hour}h00</div>
                        <div className="text-emerald-400 text-xs">{slot.duration}s</div>
                      </div>
                      
                      {/* Zone */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-5 h-5 text-teal-400" />
                          <span className="text-xl font-bold text-white">
                            {ZONE_NAMES[slot.zone]}
                          </span>
                        </div>
                        <p className="text-emerald-300 text-sm">{slot.label}</p>
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <div>
                      {isCompleted && (
                        <div className="flex items-center gap-2 text-green-400">
                          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                            ✓
                          </div>
                          <span className="font-semibold">Terminé</span>
                        </div>
                      )}
                      
                      {isCurrent && (
                        <Button
                          onClick={() => startActivity(index)}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Commencer
                        </Button>
                      )}
                      
                      {isLocked && (
                        <div className="text-slate-500 flex items-center gap-2">
                          <div className="text-2xl">🔒</div>
                          <span>Verrouillé</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Link to leaderboard */}
          <div className="mt-8 text-center">
            <Link to={createPageUrl('RecyclageLeaderboard')}>
              <Button variant="outline" className="border-emerald-400 text-emerald-300">
                <Trophy className="w-5 h-5 mr-2" />
                Voir le Classement
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}