import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Trash2, CheckCircle, ArrowRight, Recycle, Factory, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HOTEL_ZONES = [
  {
    id: 'kitchen',
    name: 'Cuisine',
    emoji: '👨‍🍳',
    position: { x: 20, y: 15 },
    color: 'from-orange-500 to-red-500',
    wastes: [
      { name: 'Épluchures', emoji: '🥕', bin: 'organic', recycled: 'Compost pour jardin' },
      { name: 'Boîtes carton', emoji: '📦', bin: 'paper', recycled: 'Nouveau carton' },
      { name: 'Bouteilles plastique', emoji: '🧴', bin: 'plastic', recycled: 'Vêtements polaires' },
      { name: 'Canettes alu', emoji: '🥫', bin: 'metal', recycled: 'Nouvelles canettes' },
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    emoji: '🍽️',
    position: { x: 25, y: 45 },
    color: 'from-yellow-500 to-orange-500',
    wastes: [
      { name: 'Restes de repas', emoji: '🍝', bin: 'organic', recycled: 'Biogaz et compost' },
      { name: 'Bouteilles verre', emoji: '🍾', bin: 'glass', recycled: 'Nouveau verre' },
      { name: 'Serviettes papier', emoji: '🧻', bin: 'paper', recycled: 'Papier recyclé' },
      { name: 'Emballages plastique', emoji: '🥡', bin: 'plastic', recycled: 'Bancs publics' },
    ]
  },
  {
    id: 'reception',
    name: 'Réception',
    emoji: '🏨',
    position: { x: 78, y: 50 },
    color: 'from-blue-500 to-purple-500',
    wastes: [
      { name: 'Papiers bureau', emoji: '📄', bin: 'paper', recycled: 'Cahiers et livres' },
      { name: 'Cartouches encre', emoji: '🖨️', bin: 'general', recycled: 'Recyclage spécial' },
      { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic', recycled: 'Textiles techniques' },
    ]
  },
  {
    id: 'rooms',
    name: 'Chambres',
    emoji: '🛏️',
    position: { x: 50, y: 20 },
    color: 'from-purple-500 to-pink-500',
    wastes: [
      { name: 'Magazines', emoji: '📰', bin: 'paper', recycled: 'Papier toilette' },
      { name: 'Bouteilles shampoing', emoji: '🧴', bin: 'plastic', recycled: 'Jouets en plastique' },
      { name: 'Canettes soda', emoji: '🥤', bin: 'metal', recycled: 'Pièces vélo' },
    ]
  },
  {
    id: 'pool',
    name: 'Piscine',
    emoji: '🏊',
    position: { x: 45, y: 55 },
    color: 'from-cyan-500 to-blue-500',
    wastes: [
      { name: 'Bouteilles crème solaire', emoji: '🧴', bin: 'plastic', recycled: 'Tuyaux d\'arrosage' },
      { name: 'Cannettes', emoji: '🥫', bin: 'metal', recycled: 'Cadres de vélo' },
      { name: 'Serviettes usées', emoji: '🧺', bin: 'general', recycled: 'Isolation thermique' },
    ]
  },
  {
    id: 'beach',
    name: 'Plage Privée',
    emoji: '🏖️',
    position: { x: 50, y: 85 },
    color: 'from-yellow-400 to-orange-500',
    wastes: [
      { name: 'Bouteilles plastique', emoji: '🍼', bin: 'plastic', recycled: 'Bateaux recyclés' },
      { name: 'Canettes boissons', emoji: '🥫', bin: 'metal', recycled: 'Trottinettes' },
      { name: 'Papiers mouchoirs', emoji: '🧻', bin: 'organic', recycled: 'Compost' },
      { name: 'Bouteilles verre', emoji: '🍾', bin: 'glass', recycled: 'Vaisselle en verre' },
    ]
  },
];

const BIN_TYPES = {
  paper: { name: 'Papier', emoji: '📄', color: 'bg-blue-500', info: 'Journaux, cartons, magazines' },
  plastic: { name: 'Plastique', emoji: '🧴', color: 'bg-yellow-500', info: 'Bouteilles, emballages' },
  glass: { name: 'Verre', emoji: '🍾', color: 'bg-green-500', info: 'Bouteilles, bocaux' },
  organic: { name: 'Organique', emoji: '🥕', color: 'bg-amber-600', info: 'Restes alimentaires' },
  metal: { name: 'Métal', emoji: '🥫', color: 'bg-gray-500', info: 'Canettes, conserves' },
  general: { name: 'Tout-venant', emoji: '🗑️', color: 'bg-slate-700', info: 'Autres déchets' },
};

export default function RecyclagePage() {
  const [selectedZone, setSelectedZone] = useState(null);
  const [collectedWastes, setCollectedWastes] = useState({});
  const [bins, setBins] = useState({
    paper: [], plastic: [], glass: [], organic: [], metal: [], general: []
  });
  const [gamePhase, setGamePhase] = useState('collection'); // collection, sorting, depot, transport, recycling
  const [hoveredZone, setHoveredZone] = useState(null);

  const handleCollectWaste = (zoneId, waste) => {
    setCollectedWastes(prev => ({
      ...prev,
      [zoneId]: [...(prev[zoneId] || []), waste]
    }));
  };

  const handleSortWaste = (waste, binType) => {
    if (waste.bin === binType) {
      setBins(prev => ({
        ...prev,
        [binType]: [...prev[binType], waste]
      }));
      return true;
    }
    return false;
  };

  const getTotalCollected = () => {
    return Object.values(collectedWastes).reduce((sum, wastes) => sum + wastes.length, 0);
  };

  const getTotalSorted = () => {
    return Object.values(bins).reduce((sum, bin) => sum + bin.length, 0);
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/349c14a99_digital-screen-with-environment-day.jpg)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/90 via-emerald-950/80 to-teal-950/90" />
      
      <BiolumiHeader currentPage="Recyclage" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/10 border border-green-400/20 mb-4">
              <Recycle className="w-6 h-6 text-green-400" />
              <span className="text-green-300 font-semibold">Jeu de Recyclage</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Hôtel Terra Nova - Mission Recyclage
            </h1>
            <p className="text-lg text-emerald-300/70 max-w-2xl mx-auto">
              Explore l'hôtel, collecte les déchets et trie-les dans les bonnes poubelles !
            </p>
          </motion.div>

          {/* Progress */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-emerald-400/30">
              <span className="text-emerald-300">
                <Trash2 className="w-5 h-5 inline mr-2" />
                Collectés: {getTotalCollected()}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-green-400/30">
              <span className="text-green-300">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Triés: {getTotalSorted()}
              </span>
            </div>
          </div>

          {gamePhase === 'collection' && (
            <>
              {/* Hotel Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-3xl overflow-hidden border-4 border-emerald-400/30 shadow-2xl mb-8"
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/17ce4623e_PlanHotelTerraaNova.png"
                  alt="Plan Hôtel Terra Nova"
                  className="w-full h-auto"
                />
                
                {/* Clickable zones */}
                {HOTEL_ZONES.map((zone) => (
                  <motion.div
                    key={zone.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${zone.position.x}%`,
                      top: `${zone.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onMouseEnter={() => setHoveredZone(zone.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                    onClick={() => setSelectedZone(zone)}
                    whileHover={{ scale: 1.3 }}
                  >
                    <motion.div
                      className={`absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br ${zone.color} opacity-40`}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${zone.color} flex items-center justify-center shadow-lg border-2 border-white/50`}>
                      <span className="text-3xl">{zone.emoji}</span>
                      {collectedWastes[zone.id]?.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {hoveredZone === zone.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900/95 backdrop-blur-sm border border-emerald-400/30 whitespace-nowrap z-20"
                      >
                        <p className="text-sm font-semibold text-emerald-300">{zone.name}</p>
                        <p className="text-xs text-emerald-400/70">
                          {collectedWastes[zone.id]?.length || 0}/{zone.wastes.length} déchets
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              <div className="text-center">
                <Button
                  onClick={() => setGamePhase('sorting')}
                  disabled={getTotalCollected() === 0}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-6 text-lg"
                >
                  Passer au Tri <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </>
          )}

          {gamePhase === 'sorting' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-emerald-300 mb-4">
                  Trie tes déchets collectés
                </h2>
                <p className="text-emerald-400/70">Glisse chaque déchet dans la bonne poubelle</p>
              </div>

              {/* Bins */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {Object.entries(BIN_TYPES).map(([key, bin]) => (
                  <div key={key} className={`${bin.color} rounded-2xl p-4 text-center text-white`}>
                    <div className="text-4xl mb-2">{bin.emoji}</div>
                    <div className="text-sm font-bold mb-1">{bin.name}</div>
                    <div className="text-xs opacity-80">{bins[key].length} déchets</div>
                  </div>
                ))}
              </div>

              {/* Collected wastes to sort */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/30">
                <h3 className="text-xl font-bold text-emerald-300 mb-4">Déchets à trier:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.values(collectedWastes).flat().map((waste, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/20"
                      onClick={() => {
                        const bins = Object.keys(BIN_TYPES);
                        const randomBin = bins[Math.floor(Math.random() * bins.length)];
                        if (handleSortWaste(waste, randomBin)) {
                          // Remove from collected
                          const newCollected = {...collectedWastes};
                          Object.keys(newCollected).forEach(zone => {
                            newCollected[zone] = newCollected[zone].filter(w => w !== waste);
                          });
                          setCollectedWastes(newCollected);
                        }
                      }}
                    >
                      <div className="text-3xl text-center mb-2">{waste.emoji}</div>
                      <div className="text-sm text-emerald-300 text-center">{waste.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setGamePhase('depot')}
                  disabled={getTotalSorted() === 0}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-6 text-lg"
                >
                  Déchetterie de l'Hôtel <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {gamePhase === 'depot' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-12">
                <Trash2 className="w-24 h-24 text-white mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-white mb-4">
                  Déchetterie de l'Hôtel
                </h2>
                <p className="text-white/90 text-lg">
                  Bravo ! Tous les déchets sont collectés et triés.
                </p>
              </div>

              <Button
                onClick={() => setGamePhase('transport')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6 text-lg"
              >
                Transport vers centres de recyclage <Truck className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {gamePhase === 'transport' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="text-center">
                <Truck className="w-24 h-24 text-blue-400 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-emerald-300 mb-4">
                  Transport vers les Centres de Recyclage
                </h2>
                <p className="text-emerald-400/70 text-lg">
                  Les déchets triés sont maintenant transportés vers les centres spécialisés
                </p>
              </div>

              <Button
                onClick={() => setGamePhase('recycling')}
                className="mx-auto block bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6 text-lg"
              >
                Voir ce qu'on peut créer <Factory className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {gamePhase === 'recycling' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <Factory className="w-24 h-24 text-purple-400 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-emerald-300 mb-4">
                  Centres de Recyclage
                </h2>
                <p className="text-emerald-400/70 text-lg">
                  Découvre ce que deviennent tes déchets recyclés !
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(bins).map(([binType, wastes]) => {
                  if (wastes.length === 0) return null;
                  const bin = BIN_TYPES[binType];
                  return (
                    <motion.div
                      key={binType}
                      whileHover={{ scale: 1.02 }}
                      className={`${bin.color} rounded-3xl p-6 text-white`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl">{bin.emoji}</div>
                        <div>
                          <h3 className="text-2xl font-bold">{bin.name}</h3>
                          <p className="text-sm opacity-90">{wastes.length} déchets recyclés</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/20 rounded-2xl p-4 mb-4">
                        <h4 className="font-semibold mb-2">Ces déchets deviennent:</h4>
                        <ul className="space-y-1 text-sm">
                          {[...new Set(wastes.map(w => w.recycled))].map((recycled, i) => (
                            <li key={i}>✓ {recycled}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center">
                <Button
                  onClick={() => {
                    setGamePhase('collection');
                    setCollectedWastes({});
                    setBins({ paper: [], plastic: [], glass: [], organic: [], metal: [], general: [] });
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-6 text-lg"
                >
                  Recommencer le jeu
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Zone collection modal */}
      <AnimatePresence>
        {selectedZone && gamePhase === 'collection' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedZone(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-br ${selectedZone.color} shadow-2xl`}
            >
              <div className="p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">{selectedZone.emoji}</span>
                    <div>
                      <h2 className="text-3xl font-bold">{selectedZone.name}</h2>
                      <p className="text-white/80">Collecte les déchets</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedZone.wastes.map((waste, i) => {
                    const isCollected = collectedWastes[selectedZone.id]?.some(w => w.name === waste.name);
                    return (
                      <motion.button
                        key={i}
                        whileHover={!isCollected ? { scale: 1.05 } : {}}
                        whileTap={!isCollected ? { scale: 0.95 } : {}}
                        onClick={() => !isCollected && handleCollectWaste(selectedZone.id, waste)}
                        disabled={isCollected}
                        className={`p-6 rounded-2xl ${isCollected ? 'bg-green-500/30' : 'bg-white/20 hover:bg-white/30'} transition-all`}
                      >
                        <div className="text-4xl mb-2">{waste.emoji}</div>
                        <div className="font-semibold mb-1">{waste.name}</div>
                        {isCollected && (
                          <CheckCircle className="w-5 h-5 mx-auto text-green-300" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => setSelectedZone(null)}
                  className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold"
                >
                  Fermer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}