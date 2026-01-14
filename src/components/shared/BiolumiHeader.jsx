import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Globe, Leaf, BookOpen, Trophy, User, Flame, X, LogOut } from 'lucide-react';

export default function BiolumiHeader({ currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Atlas', icon: Globe, path: 'Atlas' },
    { name: 'Encyclopédie', icon: BookOpen, path: 'Encyclopedia' },
    { name: 'Quiz', icon: Trophy, path: 'Quiz' },
    { name: 'Jeux', icon: Flame, path: 'Jeux' },
    { name: 'Puzzle', icon: Trophy, path: 'Puzzle' },
    { name: 'Recyclage', icon: Leaf, path: 'RecyclageRoleSelection' },
    { name: 'Micro-ferme', icon: Leaf, path: 'MicroFerme' },
    { name: 'Missions', icon: Flame, path: 'Missions' },
    { name: 'Climat', icon: Leaf, path: 'Climate' },
    { name: 'Profil', icon: User, path: 'Profile' }];

  const handleLogout = () => {
    base44.auth.redirectToLogin();
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Effet de verre dépoli biomimétique */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-teal-950/70 to-transparent backdrop-blur-xl" />
      
      {/* Bioluminescence subtile */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-teal-500/10 animate-pulse" />
      
      <nav className="relative max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo Terra Nova avec planète tournante */}
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

              <div>
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/9e8d7687f_BandeauTerraNovaChronicles.png"
                  alt="Terra Nova Chronicles"
                  className="h-10 w-auto"
                />
              </div>
            </motion.div>
          </Link>

          {/* Navigation avec effet membrane */}
          <div className="hidden md:flex items-center gap-2">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-300 mr-2"
            >
              <div className="relative flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-medium text-red-300">Déconnexion</span>
              </div>
            </motion.button>
            {navItems.map((item) => {
              const isActive = currentPage === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} to={createPageUrl(item.path)}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative px-3 py-1.5 rounded-xl
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
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-emerald-400/70'}`} />
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-sm"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-emerald-300" />
              ) : (
                <>
                  <div className="w-6 h-0.5 bg-emerald-300 mb-1" />
                  <div className="w-6 h-0.5 bg-emerald-300 mb-1" />
                  <div className="w-6 h-0.5 bg-emerald-300" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Ligne de séparation organique */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2 bg-emerald-950/95 backdrop-blur-xl">
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
      </header>);

}