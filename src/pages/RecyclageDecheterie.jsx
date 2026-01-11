import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, Truck, Factory, Recycle, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { SWISS_BIN_TYPES, SPECIAL_WASTE_CENTERS } from '@/components/recyclage/SwissWasteData';

const BIN_TYPES = SWISS_BIN_TYPES;
const RECYCLING_CENTERS = SPECIAL_WASTE_CENTERS;

export default function RecyclageDecheterie() {
  const [totalBins, setTotalBins] = useState({
    paper: 0, plastic: 0, glass: 0, organic: 0, aluminum: 0, oils: 0, batteries: 0, bulbs: 0, general: 0
  });
  const [showTransport, setShowTransport] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    // Aggregate all bins from all zones
    const zones = ['Kitchen', 'Restaurant', 'Reception', 'Rooms', 'Pool', 'Plage Privée', 'Marina', 'Parking'];
    const aggregated = { paper: 0, plastic: 0, glass: 0, organic: 0, aluminum: 0, oils: 0, batteries: 0, bulbs: 0, general: 0 };
    
    zones.forEach(zone => {
      const saved = localStorage.getItem(`recyclage_${zone}`);
      if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data.bins || {}).forEach(binType => {
          aggregated[binType] += (data.bins[binType] || []).length;
        });
      }
    });
    
    setTotalBins(aggregated);
  }, []);

  const getTotalWastes = () => {
    return Object.values(totalBins).reduce((sum, count) => sum + count, 0);
  };

  const handleEmptyBins = () => {
    setShowTransport(true);
  };

  const handleResetGame = () => {
    const zones = ['Kitchen', 'Restaurant', 'Reception', 'Rooms', 'Pool', 'Plage Privée', 'Marina', 'Parking'];
    zones.forEach(zone => {
      localStorage.removeItem(`recyclage_${zone}`);
    });
    setTotalBins({ paper: 0, plastic: 0, glass: 0, organic: 0, aluminum: 0, oils: 0, batteries: 0, bulbs: 0, general: 0 });
    setShowTransport(false);
    setSelectedCenter(null);
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/8164e7ea3_decheterie.png)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/85 via-green-950/80 to-emerald-950/85" />
      
      <BiolumiHeader currentPage="Recyclage" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to={createPageUrl('Recyclage')}>
              <Button variant="outline" className="border-emerald-400 text-emerald-300">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour au Plan
              </Button>
            </Link>
          </div>

          {!showTransport ? (
            <>
              {/* Decheterie Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
                  <span className="text-6xl">🏭</span>
                  <h1 className="text-4xl font-bold text-white">Déchetterie de l'Hôtel</h1>
                </div>
                <p className="text-emerald-300 text-lg">
                  {getTotalWastes()} déchets collectés et triés de toutes les zones
                </p>
              </motion.div>

              {/* Bins summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {Object.entries(BIN_TYPES).map(([key, bin]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    className={`${bin.color} rounded-2xl p-6 text-white text-center`}
                  >
                    <div className="text-5xl mb-3">{bin.emoji}</div>
                    <div className="text-lg font-bold mb-1">{bin.name}</div>
                    <div className="text-2xl font-black">{totalBins[key]}</div>
                    <div className="text-xs opacity-80 mt-2">déchets</div>
                  </motion.div>
                ))}
              </div>

              {getTotalWastes() > 0 ? (
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block"
                  >
                    <Button
                      onClick={handleEmptyBins}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-12 py-8 text-2xl"
                    >
                      <Truck className="w-8 h-8 mr-3" />
                      Transporter vers les Centres de Recyclage
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <Trash2 className="w-32 h-32 text-emerald-400/30 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-emerald-300 mb-4">
                    La déchetterie est vide
                  </h3>
                  <p className="text-emerald-400/70 mb-8">
                    Collecte et trie des déchets dans les différentes zones de l'hôtel
                  </p>
                  <Link to={createPageUrl('Recyclage')}>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-500">
                      Retour au Plan de l'Hôtel
                    </Button>
                  </Link>
                </motion.div>
              )}
            </>
          ) : !selectedCenter ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="text-center">
                <Truck className="w-32 h-32 text-blue-400 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-emerald-300 mb-4">
                  Transport vers les Centres de Recyclage
                </h2>
                <p className="text-emerald-400/70 text-lg">
                  Chaque type de déchet est transporté vers un centre spécialisé
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {RECYCLING_CENTERS.map((center, i) => {
                  const count = totalBins[center.type];
                  if (count === 0) return null;
                  
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedCenter(center)}
                      className={`${BIN_TYPES[center.type].color} rounded-3xl p-6 text-white text-left`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{center.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold">{center.name}</h3>
                          <p className="text-sm opacity-80">{center.location}</p>
                        </div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-3">
                        <p className="text-2xl font-black">{count} déchets</p>
                        <p className="text-xs opacity-80 mt-1">{center.location}</p>
                        <p className="text-xs opacity-60 mt-1">Cliquer pour détails</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <button
                onClick={() => setSelectedCenter(null)}
                className="text-emerald-300 hover:text-emerald-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour aux centres
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`inline-flex items-center gap-4 px-8 py-4 rounded-3xl ${BIN_TYPES[selectedCenter.type].color} mb-6`}
                >
                  <span className="text-6xl">{selectedCenter.icon}</span>
                  <div className="text-left text-white">
                    <h2 className="text-3xl font-bold">{selectedCenter.name}</h2>
                    <p className="text-lg opacity-90">{selectedCenter.location}</p>
                  </div>
                </motion.div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-emerald-400/30">
                <div className="flex items-center gap-4 mb-6">
                  <Factory className="w-16 h-16 text-emerald-400" />
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-300">Processus de Recyclage</h3>
                    <p className="text-emerald-400/70">Ce que deviennent vos déchets</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border-2 border-green-400/30 mb-4">
                  <Sparkles className="w-12 h-12 text-yellow-400 mb-4" />
                  <h4 className="text-xl font-bold text-white mb-3">Processus de recyclage:</h4>
                  <p className="text-sm text-emerald-300 mb-2">{selectedCenter.description}</p>
                  <h5 className="text-lg font-bold text-white mt-4 mb-2">Produits créés:</h5>
                  <p className="text-lg text-emerald-200">{selectedCenter.products}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-emerald-400 text-sm mb-1">Quantité recyclée</p>
                    <p className="text-3xl font-bold text-white">{totalBins[selectedCenter.type]}</p>
                    <p className="text-emerald-300 text-xs">déchets transformés</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-emerald-400 text-sm mb-1">Impact écologique</p>
                    <p className="text-2xl font-bold text-green-400">+{totalBins[selectedCenter.type] * 10}</p>
                    <p className="text-emerald-300 text-xs">points environnement</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleResetGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-12 py-6 text-xl"
                >
                  <Recycle className="w-6 h-6 mr-3" />
                  Nouveau Cycle de Recyclage
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}