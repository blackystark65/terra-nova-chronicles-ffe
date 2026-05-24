import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Globe, Leaf, BookOpen, Trophy, User, Flame, X, LogOut, Calendar, Users } from 'lucide-react';

export default function BiolumiHeader({ currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Atlas', icon: Globe, path: 'Atlas' },
    { name: 'Encyclopédie', icon: BookOpen, path: 'Encyclopedia' },
    { name: 'Permaculture', icon: Leaf, path: null, externalUrl: 'https://www.permaculturedurosey.org' },
    { name: 'Quiz', icon: Trophy, path: 'Quiz' },
    { name: 'Jeux', icon: Flame, path: 'Jeux' },
    { name: 'Puzzle', icon: Trophy, path: 'Puzzle' },
    { name: 'Recyclage', icon: Leaf, path: 'RecyclageRoleSelection' },
    { name: 'Micro-ferme', icon: Leaf, path: 'MicroFerme' },
    { name: 'Missions', icon: Flame, path: 'Missions' },
    { name: 'Climat', icon: Leaf, path: 'Climate' },
    { name: 'Biodiversité', icon: Leaf, path: 'Biodiversite' },
    { name: 'Pollinisation', icon: Leaf, path: 'Pollinisation' },
    { name: 'Écosphère', icon: BookOpen, path: 'Ecosphere' },
    { name: '🔬 Bio-Focus', icon: Flame, path: 'BioFocus' },
    { name: '📊 Présentation', icon: BookOpen, path: 'Presentation' },
    { name: '🔑 Abonnement', icon: Globe, path: 'Abonnement' },
    { name: '📅 RDV', icon: Calendar, path: 'Agenda' },
    { name: '📋 Bilan', icon: BookOpen, path: 'BilanPedagogique' },
    { name: '👥 Élèves', icon: Users, path: 'GestionEleves' }];

  const handleLogout = () => {
    base44.auth.redirectToLogin();
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Fond bleu Institut du Rosey */}
      <div className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: 'rgba(10, 30, 80, 0.95)' }} />
      
      {/* Reflet doré subtil */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 via-transparent to-yellow-600/5" />
      
      <nav className="relative max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo Institut du Rosey + Terra Nova */}
          <div className="flex items-center gap-3">
            <a href="https://www.rosey.ch" target="_blank" rel="noopener noreferrer">
              <motion.img
                whileHover={{ scale: 1.08 }}
                src="https://media.base44.com/images/public/6959886137576a65dcfe1370/386bb9e92_Institut_Le_Rosey_logo.png"
                alt="Institut du Rosey"
                className="h-9 w-auto drop-shadow-lg"
                title="Institut du Rosey"
              />
            </a>
            <div className="h-6 w-px bg-white/20" />
            <Link to={createPageUrl('Home')}>
            <motion.div
              className="flex items-center gap-2 group cursor-pointer"
              whileHover={{ scale: 1.05 }}>

              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative w-8 h-8 rounded-full overflow-hidden shadow-lg shadow-emerald-500/50">

                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/af6a6b206_green-earth-globe-with-continents-oceans.png"
                  alt="Planète Terre"
                  className="w-full h-full object-cover"
                />

                {/* Anneau bioluminescent */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }} />

              </motion.div>
            </motion.div>
            </Link>
          </div>

          {/* Navigation avec effet membrane */}
          <div className="hidden md:flex items-center gap-1 flex-wrap">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-2 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-300"
            >
              <div className="relative flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-medium text-red-300">Déconnexion</span>
              </div>
            </motion.button>
            
            {navItems.map((item) => {
              const isActive = currentPage === item.path;
              const Icon = item.icon;

              if (item.externalUrl) {
                return (
                  <a key={item.name} href={item.externalUrl}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="relative flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-emerald-400/70" />
                        <span className="text-xs font-medium text-emerald-300/70">{item.name}</span>
                      </div>
                    </motion.div>
                  </a>
                );
              }

              return (
                <Link key={item.path} to={createPageUrl(item.path)}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative px-2 py-1.5 rounded-xl
                      transition-all duration-300
                      ${isActive ?
                    'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 shadow-lg shadow-emerald-500/20' :
                    'bg-white/5 hover:bg-white/10'}
                    `
                    }>

                    {/* Effet de membrane nervurée */}
                    {isActive &&
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-emerald-400/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }} />

                    }
                    
                    <div className="relative flex items-center gap-1.5">
                      <Icon className={`w-3 h-3 ${isActive ? 'text-emerald-300' : 'text-emerald-400/70'}`} />
                      <span className={`text-xs font-medium ${isActive ? 'text-emerald-200' : 'text-emerald-300/70'}`}>
                        {item.name}
                      </span>
                    </div>

                    {/* Particule bioluminescente */}
                    {isActive &&
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }} />

                    }
                  </motion.div>
                </Link>);

            })}
            
          {/* Photo de profil */}
            <Link to={createPageUrl('Profile')}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg border-2 border-emerald-400/50 cursor-pointer"
              >
                <User className="w-5 h-5 text-white" />
              </motion.div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link to={createPageUrl('Profile')}>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg border-2 border-emerald-400/50 touch-manipulation active:scale-95 transition-transform">
                <User className="w-5 h-5 text-white pointer-events-none" />
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-sm touch-manipulation active:scale-95 transition-transform border border-white/20"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-emerald-300 pointer-events-none" />
              ) : (
                <>
                  <div className="w-5 h-0.5 bg-emerald-300 pointer-events-none" />
                  <div className="w-5 h-0.5 bg-emerald-300 pointer-events-none" />
                  <div className="w-5 h-0.5 bg-emerald-300 pointer-events-none" />
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Ligne de séparation organique */}
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2 backdrop-blur-xl overflow-y-auto max-h-[80vh]" style={{ backgroundColor: 'rgba(10, 30, 80, 0.98)' }}>
              <Link to={createPageUrl('Profile')} onClick={() => setMobileMenuOpen(false)}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 transition-all duration-300"
                >
                  <User className="w-5 h-5 text-emerald-400" />
                  <span className="text-base font-medium text-emerald-300">Profil</span>
                </motion.div>
              </Link>
              
              <motion.button
                onClick={handleLogout}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-300"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-base font-medium text-red-300">Déconnexion</span>
              </motion.button>
              {navItems.map((item) => {
                const isActive = currentPage === item.path;
                const Icon = item.icon;

                if (item.externalUrl) {
                  return (
                    <a 
                      key={item.name}
                      href={item.externalUrl}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                      >
                        <Icon className="w-5 h-5 text-emerald-400/70" />
                        <span className="text-base font-medium text-emerald-300/70">{item.name}</span>
                      </motion.div>
                    </a>
                  );
                }

                return (
                  <Link 
                    key={item.path} 
                    to={createPageUrl(item.path)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        transition-all duration-300
                        ${isActive ?
                          'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 shadow-lg' :
                          'bg-white/5 hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-300' : 'text-emerald-400/70'}`} />
                      <span className={`text-base font-medium ${isActive ? 'text-emerald-200' : 'text-emerald-300/70'}`}>
                        {item.name}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        </header>
        );
        }