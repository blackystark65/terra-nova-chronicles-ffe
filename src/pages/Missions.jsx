import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Flame, CheckCircle, Lock, Star, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";

const MissionCard = ({ mission, profile, onStart }) => {
  const isCompleted = profile?.missions_completed >= 0 && mission.completed_by?.includes(profile.id);
  const canStart = !isCompleted;

  const difficultyColors = {
    debutant: 'from-green-400 to-emerald-500',
    intermediaire: 'from-yellow-400 to-orange-500',
    avance: 'from-orange-500 to-red-500',
    expert: 'from-red-500 to-purple-600'
  };

  return (
    <motion.div
      whileHover={canStart ? { scale: 1.02, y: -5 } : {}}
      className={`
        relative p-6 rounded-2xl backdrop-blur-xl border
        ${isCompleted ?
      'bg-emerald-900/20 border-emerald-400/30' :
      'bg-white/5 border-emerald-400/20 hover:border-emerald-400/40'}
        ${
      !canStart ? 'opacity-60' : ''}
      `}>

      {isCompleted &&
      <div className="absolute top-4 right-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
      }

      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${difficultyColors[mission.difficulty]} text-white mb-3`}>
        {mission.difficulty}
      </div>

      <h3 className="text-xl font-bold text-emerald-300 mb-2">{mission.title}</h3>
      <p className="text-emerald-200/70 mb-4">{mission.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Star className="w-4 h-4" />
          <span>+{mission.xp_reward} XP</span>
        </div>

        <Button
          onClick={() => canStart && onStart(mission)}
          disabled={!canStart}
          className={`
            ${isCompleted ?
          'bg-emerald-600 hover:bg-emerald-700' :
          'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'}
          `
          }>

          {isCompleted ? 'Terminé' : 'Commencer'}
        </Button>
      </div>
    </motion.div>);

};

const QuizModal = ({ mission, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const question = mission.questions?.[currentQuestion];
  const isLastQuestion = currentQuestion === (mission.questions?.length || 0) - 1;

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(score);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (!question) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}>

        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-400/30 shadow-2xl">

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-400" />
                <span className="text-emerald-300">Question {currentQuestion + 1}/{mission.questions.length}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white">

                ✕
              </button>
            </div>

            <h3 className="text-2xl font-bold text-emerald-300 mb-6">{question.question}</h3>

            <div className="space-y-3 mb-6">
              {question.options?.map((option, index) =>
              <motion.button
                key={index}
                onClick={() => !showExplanation && handleAnswer(index)}
                disabled={showExplanation}
                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                whileTap={!showExplanation ? { scale: 0.98 } : {}}
                className={`
                    w-full p-4 rounded-xl text-left transition-all
                    ${selectedAnswer === index ?
                index === question.correct_answer ?
                'bg-green-500/20 border-2 border-green-400' :
                'bg-red-500/20 border-2 border-red-400' :
                'bg-white/5 hover:bg-white/10 border-2 border-transparent'}
                    ${
                showExplanation && index === question.correct_answer ? 'bg-green-500/20 border-2 border-green-400' : ''}
                  `}>

                  <span className="text-emerald-200">{option}</span>
                </motion.button>
              )}
            </div>

            {showExplanation &&
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 mb-6">

                <p className="text-emerald-200">{question.explanation}</p>
              </motion.div>
            }

            {showExplanation &&
            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">

                {isLastQuestion ? 'Terminer la mission' : 'Question suivante →'}
              </Button>
            }
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>);

};

export default function MissionsPage() {
  const queryClient = useQueryClient();
  const [selectedMission, setSelectedMission] = useState(null);
  const [filterBiome, setFilterBiome] = useState('all');

  const { data: missions } = useQuery({
    queryKey: ['missions'],
    queryFn: () => base44.entities.Mission.list()
  });

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.EcoProfile.list()
  });

  const profile = profiles?.[0];

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EcoProfile.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['profiles'])
  });

  const updateMissionMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Mission.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['missions'])
  });

  const handleCompleteMission = (score) => {
    if (profile && selectedMission) {
      const totalQuestions = selectedMission.questions?.length || 0;
      const xpEarned = Math.floor(score / totalQuestions * selectedMission.xp_reward);

      updateProfileMutation.mutate({
        id: profile.id,
        data: {
          experience_points: profile.experience_points + xpEarned,
          missions_completed: profile.missions_completed + 1
        }
      });

      updateMissionMutation.mutate({
        id: selectedMission.id,
        data: {
          completed_by: [...(selectedMission.completed_by || []), profile.id]
        }
      });

      setSelectedMission(null);
    }
  };

  const filteredMissions = missions?.filter(
    (m) => filterBiome === 'all' || m.biome === filterBiome
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950">
      <BiolumiHeader currentPage="Missions" />

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12">

            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-orange-500/10 border border-orange-400/20 mb-6">
              <Flame className="w-6 h-6 text-orange-400" />
              <span className="text-orange-300 font-semibold">Missions Actives</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Tes Missions Éco-Citoyen

            </h1>
            <p className="text-lg text-emerald-300/70 max-w-2xl mx-auto">
              Complète des missions pour gagner de l'expérience et débloquer de nouveaux badges
            </p>
          </motion.div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['all', 'rainforest', 'ocean', 'savanna', 'arctic'].map((biome) =>
            <button
              key={biome}
              onClick={() => setFilterBiome(biome)}
              className={`
                  px-4 py-2 rounded-xl transition-all
                  ${filterBiome === biome ?
              'bg-emerald-500 text-white' :
              'bg-white/5 text-emerald-300 hover:bg-white/10'}
                `
              }>

                {biome === 'all' ? 'Tous' : biome}
              </button>
            )}
          </div>

          {/* Liste des missions */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredMissions.map((mission, i) =>
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>

                <MissionCard
                mission={mission}
                profile={profile}
                onStart={setSelectedMission} />

              </motion.div>
            )}
          </div>
        </div>
      </main>

      {selectedMission &&
      <QuizModal
        mission={selectedMission}
        onComplete={handleCompleteMission}
        onClose={() => setSelectedMission(null)} />

      }
    </div>);

}