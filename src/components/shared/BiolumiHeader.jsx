import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Globe, Leaf, BookOpen, Trophy, User, Flame } from 'lucide-react';

export default function BiolumiHeader({ currentPage }) {
  const navItems = [
    { name: 'Atlas', icon: Globe, path: 'Atlas' },
    { name: 'Encyclopédie', icon: BookOpen, path: 'Encyclopedia' },
    { name: 'Missions', icon: Flame, path: 'Missions' },
    { name: 'Climat', icon: Leaf, path: 'Climate' },
    { name: 'Profil', icon: User, path: 'Profile' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Effet de verre dépoli biomimétique */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-teal-950/70 to-transparent backdrop-blur-xl" />
      
      {/* Bioluminescence subtile */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-teal-500/10 animate-pulse" />
      
      <nav className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Terra Nova */}
          <Link to={createPageUrl('Home')}>
            <motion.div 
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                {/* Anneau bioluminescent */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                  Terra Nova
                </h1>
                <p className="text-xs text-emerald-300/70">Chronicles of Gaia</p>
              </div>
            </motion.div>
          </Link>

          {/* Navigation avec effet membrane */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={createPageUrl(item.path)}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative px-4 py-2 rounded-xl
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 shadow-lg shadow-emerald-500/20' 
                        : 'bg-white/5 hover:bg-white/10'
                      }
                    `}
                  >
                    {/* Effet de membrane nervurée */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border border-emerald-400/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    
                    <div className="relative flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-400/70'}`} />
                      <span className={`text-sm font-medium ${isActive ? 'text-emerald-200' : 'text-emerald-300/70'}`}>
                        {item.name}
                      </span>
                    </div>

                    {/* Particule bioluminescente */}
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400"
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu - version simplifiée */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <div className="w-6 h-0.5 bg-emerald-300 mb-1" />
              <div className="w-6 h-0.5 bg-emerald-300 mb-1" />
              <div className="w-6 h-0.5 bg-emerald-300" />
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
    </header>
  );
}