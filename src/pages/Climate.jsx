import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Thermometer, Cloud, Droplets, Wind, TrendingUp, AlertTriangle, Loader2, Clock, Sun, Zap, Globe, RefreshCw, Eye, Gauge } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const WORLD_CITIES = [
  { city: 'Paris', country: 'France', continent: 'Europe', timezone: 'Europe/Paris', emoji: '🇫🇷' },
  { city: 'London', country: 'UK', continent: 'Europe', timezone: 'Europe/London', emoji: '🇬🇧' },
  { city: 'New York', country: 'USA', continent: 'Amérique', timezone: 'America/New_York', emoji: '🇺🇸' },
  { city: 'Los Angeles', country: 'USA', continent: 'Amérique', timezone: 'America/Los_Angeles', emoji: '🇺🇸' },
  { city: 'São Paulo', country: 'Brésil', continent: 'Amérique', timezone: 'America/Sao_Paulo', emoji: '🇧🇷' },
  { city: 'Tokyo', country: 'Japon', continent: 'Asie', timezone: 'Asia/Tokyo', emoji: '🇯🇵' },
  { city: 'Dubai', country: 'EAU', continent: 'Asie', timezone: 'Asia/Dubai', emoji: '🇦🇪' },
  { city: 'Shanghai', country: 'Chine', continent: 'Asie', timezone: 'Asia/Shanghai', emoji: '🇨🇳' },
  { city: 'Mumbai', country: 'Inde', continent: 'Asie', timezone: 'Asia/Kolkata', emoji: '🇮🇳' },
  { city: 'Cairo', country: 'Égypte', continent: 'Afrique', timezone: 'Africa/Cairo', emoji: '🇪🇬' },
  { city: 'Lagos', country: 'Nigeria', continent: 'Afrique', timezone: 'Africa/Lagos', emoji: '🇳🇬' },
  { city: 'Nairobi', country: 'Kenya', continent: 'Afrique', timezone: 'Africa/Nairobi', emoji: '🇰🇪' },
  { city: 'Sydney', country: 'Australie', continent: 'Océanie', timezone: 'Australia/Sydney', emoji: '🇦🇺' },
  { city: 'Auckland', country: 'N.-Zélande', continent: 'Océanie', timezone: 'Pacific/Auckland', emoji: '🇳🇿' },
  { city: 'Moscow', country: 'Russie', continent: 'Europe', timezone: 'Europe/Moscow', emoji: '🇷🇺' },
  { city: 'Mexico City', country: 'Mexique', continent: 'Amérique', timezone: 'America/Mexico_City', emoji: '🇲🇽' },
];

function CityClockCard({ city }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('fr-FR', { timeZone: city.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('fr-FR', { timeZone: city.timezone, weekday: 'short', day: 'numeric', month: 'short' });
      setTime(timeStr);
      setDate(dateStr);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [city.timezone]);

  const weather = city.weather;
  const tempColor = weather?.temp > 30 ? 'text-red-400' : weather?.temp > 20 ? 'text-orange-400' : weather?.temp > 10 ? 'text-yellow-400' : weather?.temp > 0 ? 'text-blue-300' : 'text-cyan-300';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-400/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{city.emoji}</span>
            <div>
              <p className="font-bold text-white text-sm">{city.city}</p>
              <p className="text-xs text-blue-300/50">{city.continent}</p>
            </div>
          </div>
        </div>
        {weather?.icon && <span className="text-2xl">{weather.icon}</span>}
      </div>

      <div className="font-mono text-2xl font-bold text-cyan-300 mb-1">{time}</div>
      <div className="text-xs text-blue-300/60 mb-3 capitalize">{date}</div>

      {weather ? (
        <div className="space-y-1">
          <div className={`text-xl font-bold ${tempColor}`}>{weather.temp}°C</div>
          <div className="text-xs text-blue-200/70">{weather.description}</div>
          <div className="flex gap-2 mt-2">
            <span className="text-xs text-blue-300/50 flex items-center gap-1">
              <Droplets className="w-3 h-3" /> {weather.humidity}%
            </span>
            <span className="text-xs text-blue-300/50 flex items-center gap-1">
              <Wind className="w-3 h-3" /> {weather.wind} km/h
            </span>
          </div>
          {weather.uv !== undefined && (
            <div className="text-xs text-yellow-400/70 flex items-center gap-1">
              <Sun className="w-3 h-3" /> UV: {weather.uv} · AQI: {weather.aqi}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-blue-300/40 text-xs">
          <Loader2 className="w-3 h-3 animate-spin" /> Chargement météo...
        </div>
      )}
    </motion.div>
  );
}

export default function ClimatePage() {
  const [citiesWithWeather, setCitiesWithWeather] = useState(WORLD_CITIES);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherLastUpdated, setWeatherLastUpdated] = useState(null);
  const [selectedContinent, setSelectedContinent] = useState('Tous');
  const [climateData] = useState({
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
  const [funFacts, setFunFacts] = useState([]);
  const [factsLoading, setFactsLoading] = useState(true);

  const fetchWeatherData = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un service météo mondial. Pour chacune des villes suivantes, donne-moi la météo actuelle en date du ${new Date().toLocaleDateString('fr-FR')} (heure actuelle UTC: ${new Date().toUTCString()}).
        
Villes: Paris, London, New York, Los Angeles, São Paulo, Tokyo, Dubai, Shanghai, Mumbai, Cairo, Lagos, Nairobi, Sydney, Auckland, Moscow, Mexico City.

Retourne un JSON avec pour chaque ville:
- city: nom exact comme fourni
- temp: température en °C (entier réaliste pour la saison et la ville)
- description: description courte en français (ex: "Ensoleillé", "Nuageux", "Pluie légère", "Neige", "Orageux", "Brume")
- icon: emoji météo approprié (☀️🌤️⛅🌥️☁️🌦️🌧️⛈️🌩️❄️🌨️🌫️🌬️)
- humidity: humidité en % (entier)
- wind: vitesse du vent en km/h (entier)
- uv: indice UV (0-11, entier)
- aqi: qualité de l'air AQI simplifié de 1 (Bon) à 5 (Très mauvais)
- feels_like: ressenti thermique en °C

Assure-toi que les températures soient réalistes pour la saison actuelle (mars 2026) et le climat de chaque ville.`,
        response_json_schema: {
          type: "object",
          properties: {
            cities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  city: { type: "string" },
                  temp: { type: "number" },
                  description: { type: "string" },
                  icon: { type: "string" },
                  humidity: { type: "number" },
                  wind: { type: "number" },
                  uv: { type: "number" },
                  aqi: { type: "number" },
                  feels_like: { type: "number" }
                }
              }
            }
          }
        }
      });

      if (result?.cities) {
        const weatherMap = {};
        result.cities.forEach(w => { weatherMap[w.city] = w; });
        setCitiesWithWeather(WORLD_CITIES.map(c => ({
          ...c,
          weather: weatherMap[c.city] || null
        })));
        setWeatherLastUpdated(new Date());
      }
    } catch (e) {
      console.error('Erreur météo:', e);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const fetchFunFacts = useCallback(async () => {
    setFactsLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Donne-moi 6 faits scientifiques récents et surprenants sur le changement climatique et l'état de la planète en 2025-2026. Chaque fait doit être court (1-2 phrases), précis avec des chiffres, et avoir un emoji pertinent. Varie les sujets: océans, forêts, espèces, glaces, énergie, populations.`,
        response_json_schema: {
          type: "object",
          properties: {
            facts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  emoji: { type: "string" },
                  fact: { type: "string" },
                  source: { type: "string" }
                }
              }
            }
          }
        }
      });
      if (result?.facts) setFunFacts(result.facts);
    } catch (e) {
      console.error('Erreur facts:', e);
    } finally {
      setFactsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData();
    fetchFunFacts();
  }, []);

  const continents = ['Tous', ...Array.from(new Set(WORLD_CITIES.map(c => c.continent)))];
  const filteredCities = selectedContinent === 'Tous'
    ? citiesWithWeather
    : citiesWithWeather.filter(c => c.continent === selectedContinent);

  const climateMetrics = [
    { icon: Thermometer, label: "Température Globale", value: `${climateData.global_temp}°C`, trend: "+1.1°C depuis 1880", color: "from-red-500 to-orange-600", status: "critical" },
    { icon: Cloud, label: "Niveau CO₂", value: `${climateData.co2_level} ppm`, trend: "+50% depuis 1960", color: "from-gray-600 to-slate-700", status: "critical" },
    { icon: Droplets, label: "Niveau des Océans", value: `+${climateData.sea_level_rise}mm`, trend: "Depuis 1993", color: "from-blue-500 to-cyan-600", status: "warning" },
    { icon: Wind, label: "Fonte Arctique", value: `-${climateData.arctic_ice_loss}%`, trend: "Par décennie", color: "from-cyan-400 to-blue-500", status: "critical" }
  ];

  const avgTemp = citiesWithWeather.filter(c => c.weather).length > 0
    ? Math.round(citiesWithWeather.filter(c => c.weather).reduce((s, c) => s + c.weather.temp, 0) / citiesWithWeather.filter(c => c.weather).length)
    : null;

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/78976de35_blue-wave-crashes-african-coastline-sunset-generated-by-ai.jpg)' }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/75 via-blue-950/65 to-slate-900/75" />

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="absolute w-64 h-32 rounded-full bg-white/5 blur-3xl"
            style={{ left: `${i * 20}%`, top: `${i * 15 + 10}%` }}
            animate={{ x: [0, 80, 0], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, delay: i * 2 }}
          />
        ))}
      </div>

      <BiolumiHeader currentPage="Climate" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-400/20 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <span className="text-red-300 font-semibold">Données en Temps Réel</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              État du Climat Mondial
            </h1>
            <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
              Météo mondiale, indicateurs climatiques et données environnementales en temps réel
            </p>
          </motion.div>

          {/* Métriques climatiques */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {climateMetrics.map((metric, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
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
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-red-500" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* === SECTION HORLOGES MONDIALES + MÉTÉO === */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-blue-400/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Horloges & Météo Mondiales</h3>
                  {weatherLastUpdated && (
                    <p className="text-xs text-blue-300/50">
                      Mis à jour à {weatherLastUpdated.toLocaleTimeString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {avgTemp !== null && (
                  <div className="px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-400/30 text-sm text-orange-300">
                    🌍 Moy. mondiale : <strong>{avgTemp}°C</strong>
                  </div>
                )}
                <button onClick={fetchWeatherData} disabled={weatherLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 text-sm transition-all">
                  <RefreshCw className={`w-4 h-4 ${weatherLoading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>
            </div>

            {/* Filtres par continent */}
            <div className="flex flex-wrap gap-2 mb-5">
              {continents.map(cont => (
                <button key={cont} onClick={() => setSelectedContinent(cont)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedContinent === cont
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-blue-300 hover:bg-white/10'
                  }`}>
                  {cont}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
              {filteredCities.map((city, i) => (
                <CityClockCard key={city.city} city={city} />
              ))}
            </div>
          </motion.div>

          {/* Graphiques CO2 + Température */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Cloud className="w-6 h-6 text-gray-400" /> Évolution du CO₂ atmosphérique
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={co2HistoricalData}>
                  <defs>
                    <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="ppm" stroke="#64748b" fillOpacity={1} fill="url(#colorCO2)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Thermometer className="w-6 h-6 text-red-400" /> Température Moyenne Globale
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={tempHistoricalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[14, 16]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* === LE SAVIEZ-VOUS ? Faits scientifiques IA === */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-teal-950/40 backdrop-blur-xl border border-emerald-400/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Le saviez-vous ? Faits scientifiques 2025-2026</h3>
            </div>
            {factsLoading ? (
              <div className="flex items-center gap-3 text-emerald-300/50 py-4">
                <Loader2 className="w-5 h-5 animate-spin" /> Chargement des faits scientifiques...
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {funFacts.map((fact, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl bg-white/5 border border-emerald-400/20 hover:border-emerald-400/40 transition-all">
                    <div className="text-3xl mb-2">{fact.emoji}</div>
                    <p className="text-sm text-emerald-200/90 leading-relaxed">{fact.fact}</p>
                    {fact.source && <p className="text-xs text-emerald-400/50 mt-2">— {fact.source}</p>}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Événements climatiques récents + Légende AQI */}
          <div className="grid lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-red-950/30 to-orange-950/30 backdrop-blur-xl border border-red-400/20">
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" /> Événements Climatiques Récents
              </h3>
              <div className="space-y-3">
                {climateData.recent_events.map((event, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-400/20">
                    <span className="text-red-400 mt-0.5">⚠️</span>
                    <div>
                      <p className="font-semibold text-red-200 text-sm">{event.event}</p>
                      <p className="text-xs text-red-300/60">📍 {event.location} · 🗓️ {event.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Légende qualité de l'air */}
            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-400" /> Qualité de l'air (AQI)
              </h3>
              <div className="space-y-2">
                {[
                  { level: 1, label: 'Excellent', color: 'bg-green-500', desc: 'Air pur, idéal' },
                  { level: 2, label: 'Bon', color: 'bg-lime-500', desc: 'Risque faible' },
                  { level: 3, label: 'Modéré', color: 'bg-yellow-500', desc: 'Groupes sensibles' },
                  { level: 4, label: 'Mauvais', color: 'bg-orange-500', desc: 'Éviter l\'effort' },
                  { level: 5, label: 'Très mauvais', color: 'bg-red-600', desc: 'Rester à l\'intérieur' },
                ].map(item => (
                  <div key={item.level} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {item.level}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-blue-300/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-400/20">
                <p className="text-xs text-yellow-300/80">☀️ <strong>Indice UV :</strong> 0-2 faible · 3-5 modéré · 6-7 élevé · 8-10 très élevé · 11+ extrême</p>
              </div>
            </div>
          </div>

          {/* Actions pour le climat */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/30 to-teal-950/30 backdrop-blur-xl border border-emerald-400/20">
            <h3 className="text-2xl font-bold text-emerald-300 mb-4">💚 Agir pour le Climat</h3>
            <p className="text-emerald-200/70 mb-6">Chaque action compte. Voici comment contribuer dès aujourd'hui.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: '🌱', action: 'Réduis ta consommation', impact: 'Moins de CO₂ émis' },
                { icon: '♻️', action: 'Recycle et réutilise', impact: 'Moins de déchets en décharge' },
                { icon: '🚴', action: 'Mobilité douce', impact: 'Zéro émission locale' }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 hover:border-emerald-400/60 transition-all">
                  <p className="text-3xl mb-2">{item.icon}</p>
                  <p className="font-semibold text-emerald-200 mb-1">{item.action}</p>
                  <p className="text-xs text-emerald-400/70">{item.impact}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}