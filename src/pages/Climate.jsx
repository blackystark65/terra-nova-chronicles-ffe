import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Thermometer, Cloud, Droplets, Wind, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Données historiques CO2 (simulées - à remplacer par vraies données)
const co2HistoricalData = [
  { year: 2000, ppm: 369 },
  { year: 2005, ppm: 379 },
  { year: 2010, ppm: 389 },
  { year: 2015, ppm: 400 },
  { year: 2020, ppm: 414 },
  { year: 2025, ppm: 424 },
];

const tempHistoricalData = [
  { year: 2000, temp: 14.4 },
  { year: 2005, temp: 14.6 },
  { year: 2010, temp: 14.7 },
  { year: 2015, temp: 15.0 },
  { year: 2020, temp: 15.2 },
  { year: 2025, temp: 15.5 },
];

export default function ClimatePage() {
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClimateData();
  }, []);

  const fetchClimateData = async () => {
    try {
      setLoading(true);
      const { data } = await base44.functions.invoke('getClimateData', {});
      setClimateData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      // Données de secours
      setClimateData({
        global_temp: 15.3,
        co2_level: 424,
        arctic_ice_loss: 13.2,
        sea_level_rise: 102.5,
        recent_events: [
          { event: "Canicule extrême", location: "Europe du Sud", date: "Été 2025" },
          { event: "Fonte record des glaciers", location: "Groenland", date: "Septembre 2025" },
          { event: "Ouragans intensifiés", location: "Atlantique", date: "Octobre 2025" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const climateMetrics = [
    {
      icon: Thermometer,
      label: "Température Globale",
      value: climateData?.global_temp ? `${climateData.global_temp}°C` : "...",
      trend: "+1.1°C depuis 1880",
      color: "from-red-500 to-orange-600",
      status: "critical"
    },
    {
      icon: Cloud,
      label: "Niveau CO₂",
      value: climateData?.co2_level ? `${climateData.co2_level} ppm` : "...",
      trend: "+50% depuis 1960",
      color: "from-gray-600 to-slate-700",
      status: "critical"
    },
    {
      icon: Droplets,
      label: "Niveau des Océans",
      value: climateData?.sea_level_rise ? `+${climateData.sea_level_rise}mm` : "...",
      trend: "Depuis 1993",
      color: "from-blue-500 to-cyan-600",
      status: "warning"
    },
    {
      icon: Wind,
      label: "Fonte Arctique",
      value: climateData?.arctic_ice_loss ? `-${climateData.arctic_ice_loss}%` : "...",
      trend: "Par décennie",
      color: "from-cyan-400 to-blue-500",
      status: "critical"
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Fond avec effet atmosphérique */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
      
      {/* Effet nuages animés */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-32 rounded-full bg-white/5 blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <BiolumiHeader currentPage="Climate" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-400/20 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <span className="text-red-300 font-semibold">Données en Temps Réel</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              État du Climat Mondial
            </h1>
            <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
              Surveille les indicateurs clés du changement climatique avec des données actualisées quotidiennement
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Métriques principales */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {climateMetrics.map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-10 blur-2xl`} />
                    
                    <div className="relative">
                      <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${metric.color} mb-4`}>
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>

                      <p className="text-sm text-blue-300/70 mb-2">{metric.label}</p>
                      <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                      <p className="text-xs text-blue-400/60">{metric.trend}</p>

                      {metric.status === 'critical' && (
                        <div className="absolute top-4 right-4">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-3 h-3 rounded-full bg-red-500"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Graphiques */}
              <div className="grid lg:grid-cols-2 gap-6 mb-12">
                {/* Évolution CO2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Cloud className="w-6 h-6 text-gray-400" />
                    Évolution du CO₂
                  </h3>
                  
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={co2HistoricalData}>
                      <defs>
                        <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#64748b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="year" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                        labelStyle={{ color: '#cbd5e1' }}
                      />
                      <Area type="monotone" dataKey="ppm" stroke="#64748b" fillOpacity={1} fill="url(#colorCO2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Évolution Température */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Thermometer className="w-6 h-6 text-red-400" />
                    Température Moyenne Globale
                  </h3>
                  
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={tempHistoricalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="year" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" domain={[14, 16]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                        labelStyle={{ color: '#cbd5e1' }}
                      />
                      <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Événements climatiques récents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-gradient-to-br from-red-950/30 to-orange-950/30 backdrop-blur-xl border border-red-400/20"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                  Événements Climatiques Récents
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  {climateData?.recent_events?.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className={`p-4 rounded-2xl border ${
                        event.severity === 'critical' 
                          ? 'bg-red-500/10 border-red-400/30' 
                          : 'bg-orange-500/10 border-orange-400/30'
                      }`}
                    >
                      <p className="font-semibold text-red-200 mb-2">{event.event}</p>
                      <p className="text-sm text-red-300/70 mb-1">📍 {event.location}</p>
                      <p className="text-xs text-red-400/60">🗓️ {event.date}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Températures mondiales en temps réel */}
              {climateData?.cities_data && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Thermometer className="w-7 h-7 text-orange-400" />
                    Températures Mondiales Actuelles
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {climateData.cities_data.map((city, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * i }}
                        className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-orange-500/10 border border-blue-400/20"
                      >
                        <p className="text-sm text-blue-200/70 mb-1">{city.city}</p>
                        <p className="text-2xl font-bold text-white">{Math.round(city.temp)}°C</p>
                        <p className="text-xs text-blue-300/60 capitalize">{city.conditions}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Points d'action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-emerald-950/30 to-teal-950/30 backdrop-blur-xl border border-emerald-400/20"
              >
                <h3 className="text-2xl font-bold text-emerald-300 mb-4">
                  💚 Agir pour le Climat
                </h3>
                <p className="text-emerald-200/70 mb-6">
                  Chaque action compte. Découvre comment tu peux contribuer à ralentir le changement climatique.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: '🌱', action: 'Réduis ta consommation', impact: 'Moins de CO₂' },
                    { icon: '♻️', action: 'Recycle et réutilise', impact: 'Moins de déchets' },
                    { icon: '🚴', action: 'Mobilité douce', impact: 'Moins de pollution' }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30">
                      <p className="text-3xl mb-2">{item.icon}</p>
                      <p className="font-semibold text-emerald-200 mb-1">{item.action}</p>
                      <p className="text-xs text-emerald-400/70">{item.impact}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}