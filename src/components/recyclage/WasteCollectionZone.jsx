import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, CheckCircle, Trash2, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BIN_TYPES = {
  paper: { name: 'Papier', emoji: '📄', color: 'bg-blue-500', info: 'Journaux, cartons, magazines' },
  plastic: { name: 'Plastique', emoji: '🧴', color: 'bg-yellow-500', info: 'Bouteilles, emballages' },
  glass: { name: 'Verre', emoji: '🍾', color: 'bg-green-500', info: 'Bouteilles, bocaux' },
  organic: { name: 'Organique', emoji: '🥕', color: 'bg-amber-700', info: 'Déchets alimentaires et jardin' },
  metal: { name: 'Métal', emoji: '🥫', color: 'bg-gray-500', info: 'Canettes, conserves' },
  general: { name: 'Incinérable', emoji: '🗑️', color: 'bg-black', info: 'Déchets non recyclables' },
};

export default function WasteCollectionZone({ 
  zoneName, 
  zoneEmoji, 
  zoneColor, 
  wastes,
  backgroundImage 
}) {
  const [collectedWastes, setCollectedWastes] = useState([]);
  const [bins, setBins] = useState({
    paper: [], plastic: [], glass: [], organic: [], metal: [], general: []
  });
  const [feedback, setFeedback] = useState(null);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [slotIndex, setSlotIndex] = useState(null);
  const [score, setScore] = useState(0);

  // Check URL params for timer
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const duration = params.get('duration');
    const session = params.get('session_id');
    const slot = params.get('slot');
    
    if (duration) {
      setTimeLeft(parseInt(duration));
      setSessionId(session);
      setSlotIndex(slot);
    }
    
    const saved = localStorage.getItem(`recyclage_${zoneName}`);
    if (saved) {
      const data = JSON.parse(saved);
      setCollectedWastes(data.collectedWastes || []);
      setBins(data.bins || { paper: [], plastic: [], glass: [], organic: [], metal: [], general: [] });
    }
  }, [zoneName]);
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          completeActivity();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft]);
  
  const completeActivity = async () => {
    if (!sessionId) return;
    
    try {
      const session = await base44.entities.GameSession.filter({ id: sessionId });
      if (session.length > 0) {
        await base44.entities.GameSession.update(sessionId, {
          total_score: (session[0].total_score || 0) + score,
          wastes_sorted_today: (session[0].wastes_sorted_today || 0) + getTotalBinItems(),
          current_time_slot: parseInt(slotIndex) + 1,
        });
      }
      
      window.location.href = createPageUrl('RecyclageSchedule');
    } catch (error) {
      console.error('Error completing activity');
    }
  };

  // Save progress
  useEffect(() => {
    localStorage.setItem(`recyclage_${zoneName}`, JSON.stringify({ collectedWastes, bins }));
  }, [collectedWastes, bins, zoneName]);

  const handleCollectWaste = (waste) => {
    if (!collectedWastes.find(w => w.name === waste.name)) {
      setCollectedWastes([...collectedWastes, waste]);
      setFeedback({ type: 'collect', message: `${waste.emoji} ${waste.name} collecté !` });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleSortWaste = (waste, binType) => {
    if (waste.bin === binType) {
      setBins(prev => ({
        ...prev,
        [binType]: [...prev[binType], waste]
      }));
      setCollectedWastes(collectedWastes.filter(w => w !== waste));
      setFeedback({ type: 'success', message: `✅ Bien trié dans ${BIN_TYPES[binType].name} !` });
      setSelectedWaste(null);
      setScore(prev => prev + 10);
    } else {
      setFeedback({ type: 'error', message: `❌ Mauvaise poubelle ! Essaie ${BIN_TYPES[waste.bin].name}` });
      setScore(prev => Math.max(0, prev - 5));
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const getTotalBinItems = () => {
    return Object.values(bins).reduce((sum, bin) => sum + bin.length, 0);
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/349c14a99_digital-screen-with-environment-day.jpg)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/90 via-emerald-950/85 to-teal-950/90" />
      
      <BiolumiHeader currentPage="Recyclage" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to={timeLeft ? createPageUrl('RecyclageSchedule') : createPageUrl('Recyclage')}>
              <Button variant="outline" className="border-emerald-400 text-emerald-300">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {timeLeft ? 'Abandonner' : 'Retour au Plan'}
              </Button>
            </Link>
            <div className="flex gap-4">
              {timeLeft !== null && (
                <div className={`bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border-2 ${
                  timeLeft < 30 ? 'border-red-400 animate-pulse' : 'border-yellow-400'
                }`}>
                  <span className={timeLeft < 30 ? 'text-red-300 font-bold' : 'text-yellow-300'}>
                    ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
              {timeLeft !== null && (
                <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-purple-400/30">
                  <span className="text-purple-300 font-bold">
                    ⭐ {score} points
                  </span>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-emerald-400/30">
                <span className="text-emerald-300">
                  <Trash2 className="w-5 h-5 inline mr-2" />
                  Collectés: {collectedWastes.length}
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-green-400/30">
                <span className="text-green-300">
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Triés: {getTotalBinItems()}
                </span>
              </div>
            </div>
          </div>

          {/* Zone Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-gradient-to-r ${zoneColor} mb-4`}>
              <span className="text-6xl">{zoneEmoji}</span>
              <h1 className="text-4xl font-bold text-white">{zoneName}</h1>
            </div>
            <p className="text-emerald-300 text-lg">
              Collecte les déchets et trie-les dans les bonnes poubelles
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Wastes to collect */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-emerald-300 mb-4">
                Déchets à collecter
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {wastes.map((waste, i) => {
                  const isCollected = collectedWastes.find(w => w.name === waste.name);
                  const isSorted = Object.values(bins).flat().find(w => w.name === waste.name);
                  return (
                    <motion.button
                      key={i}
                      whileHover={!isCollected && !isSorted ? { scale: 1.05 } : {}}
                      whileTap={!isCollected && !isSorted ? { scale: 0.95 } : {}}
                      onClick={() => !isCollected && !isSorted && handleCollectWaste(waste)}
                      disabled={isCollected || isSorted}
                      className={`p-6 rounded-2xl transition-all ${
                        isSorted ? 'bg-green-500/30 border-2 border-green-400' :
                        isCollected ? 'bg-blue-500/30 border-2 border-blue-400' :
                        'bg-white/10 hover:bg-white/20 border-2 border-white/20'
                      }`}
                    >
                      <div className="text-5xl mb-2">{waste.emoji}</div>
                      <div className="text-sm font-semibold text-white">{waste.name}</div>
                      {isSorted && <div className="text-xs text-green-300 mt-2">✓ Trié</div>}
                      {isCollected && !isSorted && <div className="text-xs text-blue-300 mt-2">→ À trier</div>}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Bins */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-emerald-300 mb-4">
                Poubelles de tri
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(BIN_TYPES).map(([key, bin]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    className={`${bin.color} rounded-2xl p-4 text-white cursor-pointer`}
                    onClick={() => {
                      if (selectedWaste && collectedWastes.includes(selectedWaste)) {
                        handleSortWaste(selectedWaste, key);
                      }
                    }}
                  >
                    <div className="text-4xl mb-2">{bin.emoji}</div>
                    <div className="text-sm font-bold mb-1">{bin.name}</div>
                    <div className="text-xs opacity-80">{bins[key].length} déchets</div>
                    <div className="text-xs opacity-70 mt-1">{bin.info}</div>
                  </motion.div>
                ))}
              </div>

              {/* Collected wastes to sort */}
              {collectedWastes.length > 0 && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-emerald-400/30">
                  <h3 className="text-sm font-bold text-emerald-300 mb-3">
                    Clique sur un déchet puis sur une poubelle:
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {collectedWastes.map((waste, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedWaste(waste)}
                        className={`p-3 rounded-xl transition-all ${
                          selectedWaste === waste ? 
                          'bg-emerald-500/50 border-2 border-emerald-300' : 
                          'bg-white/20 hover:bg-white/30 border-2 border-white/20'
                        }`}
                      >
                        <div className="text-3xl">{waste.emoji}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Link to Decheterie */}
              {getTotalBinItems() > 0 && (
                <Link to={createPageUrl('RecyclageDecheterie')}>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-6">
                    <Recycle className="w-5 h-5 mr-2" />
                    Vider dans la Déchetterie ({getTotalBinItems()} déchets)
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`px-8 py-4 rounded-2xl shadow-2xl border-4 text-white text-xl font-bold ${
              feedback.type === 'success' ? 'bg-green-500 border-green-300' :
              feedback.type === 'error' ? 'bg-red-500 border-red-300' :
              'bg-blue-500 border-blue-300'
            }`}>
              {feedback.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}