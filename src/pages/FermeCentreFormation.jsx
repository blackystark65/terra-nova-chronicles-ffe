import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, GraduationCap, Users, CheckCircle, Briefcase, BookOpen, Target, School } from 'lucide-react';
import TeacherClassManager from '@/components/microferme/TeacherClassManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLES_FERME } from '@/components/microferme/FermeData';
import { ROLE_DESCRIPTIONS } from '@/components/microferme/RoleDescriptions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FermeCentreFormation() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [viewMode, setViewMode] = useState('inscription');
  const [teacherTab, setTeacherTab] = useState('classes'); // 'classes' ou 'formation'

  const categories = [
    { id: 'juniors', name: 'Juniors - Découverte', description: 'CM2', emoji: '🎒', color: 'from-blue-500 to-cyan-600' },
    { id: 'cadets', name: 'Cadets - Environnement', description: '5ème', emoji: '🎓', color: 'from-purple-500 to-pink-600' },
    { id: 'seniors', name: 'Seniors - Sciences naturelles', description: '6ème', emoji: '🎯', color: 'from-orange-500 to-red-600' }
  ];

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: classes } = useQuery({
    queryKey: ['classeFerme'],
    queryFn: () => base44.entities.ClasseFerme.filter({ is_active: true }),
  });

  const { data: existingRoles } = useQuery({
    queryKey: ['fermeRoles', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.RoleFerme.filter({ created_by: user.email });
    },
    enabled: !!user,
  });

  const createRoleMutation = useMutation({
    mutationFn: (data) => base44.entities.RoleFerme.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fermeRoles']);
      setIsRegistered(true);
      setViewMode('formation');
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId) => base44.entities.RoleFerme.delete(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries(['fermeRoles']);
      setIsRegistered(false);
      setSelectedRole(null);
      setSelectedClasse(null);
      setViewMode('inscription');
    },
  });

  useEffect(() => {
    if (existingRoles && existingRoles.length > 0) {
      setIsRegistered(true);
      setSelectedRole(existingRoles[0].role);
      setViewMode('formation');
    }
  }, [existingRoles]);

  const handleRegister = () => {
    if (!selectedRole || !selectedClasse) return;
    
    const roleData = ROLES_FERME.find(r => r.id === selectedRole);
    if (!roleData) return;
    
    createRoleMutation.mutate({
      role: selectedRole,
      role_name: roleData.name,
      zone_principale: roleData.zones[0],
      total_actions: 0,
      is_active: true,
      classe_id: selectedClasse.id,
    });
  };

  const handleContinueToFarm = () => {
    // Redirection vers la page spécifique du poste
    const rolePageMap = {
      'horticulteur': 'FermePepiniere',
      'maraicher': 'FermeMaraichage',
      'arboriste': 'FermeArboriculture',
      'boulanger': 'FermeBoulangerie',
      'eleveur': 'FermeElevage',
      'epicier': 'FermeEpicerie',
      'jardinier_foret': 'FermeForetJardin'
    };
    
    const targetPage = rolePageMap[selectedRole] || 'MicroFerme';
    window.location.href = createPageUrl(targetPage);
  };

  const handleUnregister = () => {
    if (existingRoles && existingRoles.length > 0) {
      deleteRoleMutation.mutate(existingRoles[0].id);
    }
  };

  // Vue ENSEIGNANT
  if (user?.profile_type === 'enseignant') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <BiolumiHeader currentPage="MicroFerme" />
        <main className="pt-24 px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <Link to={createPageUrl('MicroFerme')}>
              <Button variant="outline" className="mb-6 border-indigo-400 text-indigo-300">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour au Plan
              </Button>
            </Link>

            {/* Header enseignant */}
            <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/30">
                  <School className="w-8 h-8 text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-indigo-300">Espace Enseignant — Centre de Formation</h1>
                  <p className="text-indigo-200/60 text-sm">
                    {user?.full_name} {user?.matiere ? `· ${user.matiere}` : ''} {user?.etablissement ? `· ${user.etablissement}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Onglets enseignant */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setTeacherTab('classes')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all border ${
                  teacherTab === 'classes'
                    ? 'bg-indigo-500/30 border-indigo-400/60 text-indigo-200'
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />Mes Classes
              </button>
              <button
                onClick={() => setTeacherTab('poste')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all border ${
                  teacherTab === 'poste'
                    ? 'bg-green-500/30 border-green-400/60 text-green-200'
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                }`}
              >
                <Briefcase className="w-4 h-4 inline mr-2" />Mon Poste
              </button>
              <button
                onClick={() => setTeacherTab('formation')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all border ${
                  teacherTab === 'formation'
                    ? 'bg-emerald-500/30 border-emerald-400/60 text-emerald-200'
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />Fiches de Formation
              </button>
            </div>

            {teacherTab === 'classes' && <TeacherClassManager user={user} />}

            {/* Onglet Mon Poste — même flow que les élèves */}
            {teacherTab === 'poste' && (
              <AnimatePresence mode="wait">
                {!isRegistered ? (
                  <motion.div key="teacher-inscription" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-green-400/20">
                    <div className="text-center mb-6">
                      <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                        <Briefcase className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-2xl font-black text-green-300 mb-1">Choisir mon poste</h2>
                      <p className="text-green-200/60 text-sm">Participez à la micro-ferme en tant que membre actif, tout en gérant vos classes.</p>
                    </div>
                    <div className="space-y-6">
                      {/* Choix de la classe */}
                      <div className="bg-white/5 p-6 rounded-2xl border border-green-400/20">
                        <label className="flex items-center gap-2 text-green-300 font-semibold mb-3">
                          <Users className="w-5 h-5" /> Rejoindre une classe
                        </label>
                        {classes && classes.length > 0 ? (
                          <div className="grid gap-3">
                            {classes.map(classe => (
                              <motion.div key={classe.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedClasse(classe)}
                                className={`p-4 rounded-xl cursor-pointer transition-all ${
                                  selectedClasse?.id === classe.id
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300'
                                    : 'bg-white/10 border border-green-400/20 hover:bg-white/20'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-white font-bold">{classe.nom_classe}</div>
                                    <div className="text-green-200/70 text-sm">👨‍🏫 {classe.enseignant} • {classe.description}</div>
                                  </div>
                                  {selectedClasse?.id === classe.id && <CheckCircle className="w-5 h-5 text-white" />}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-green-300/40">Aucune classe disponible — créez d'abord une classe dans l'onglet "Mes Classes"</div>
                        )}
                      </div>
                      {/* Choix du poste */}
                      <div className="bg-white/5 p-6 rounded-2xl border border-green-400/20">
                        <label className="flex items-center gap-2 text-green-300 font-semibold mb-3">
                          <Briefcase className="w-5 h-5" /> Choisir mon poste
                        </label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {ROLES_FERME.map(role => (
                            <motion.div key={role.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedRole(role.id)}
                              className={`p-4 rounded-xl cursor-pointer transition-all ${
                                selectedRole === role.id
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-green-300'
                                  : 'bg-white/10 border border-green-400/20 hover:bg-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{role.emoji}</span>
                                <div>
                                  <div className="text-white font-semibold">{role.name}</div>
                                  <div className="text-xs text-green-200/70">{role.description}</div>
                                </div>
                              </div>
                              {selectedRole === role.id && <CheckCircle className="w-5 h-5 text-white ml-auto mt-2" />}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleRegister}
                        disabled={!selectedRole || !selectedClasse || createRoleMutation.isPending}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-5 text-lg">
                        {createRoleMutation.isPending ? '⏳ Inscription...' : '✅ Rejoindre la ferme avec ce poste'}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="teacher-poste-actif" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-green-400/20 text-center">
                    <div className="text-6xl mb-4">
                      {ROLES_FERME.find(r => r.id === selectedRole)?.emoji || '🌱'}
                    </div>
                    <h2 className="text-2xl font-black text-green-300 mb-2">
                      Poste actif : {ROLES_FERME.find(r => r.id === selectedRole)?.name}
                    </h2>
                    <p className="text-green-200/60 mb-6">Vous participez à la micro-ferme dans ce poste.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={handleContinueToFarm}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 py-4 px-8 text-lg">
                        🚀 Aller à mon poste
                      </Button>
                      <Button onClick={handleUnregister} disabled={deleteRoleMutation.isPending}
                        variant="outline" className="border-red-400 text-red-300 hover:bg-red-500/20 py-4 px-8">
                        {deleteRoleMutation.isPending ? '⏳...' : '🔄 Changer de poste'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {teacherTab === 'formation' && (
              <Tabs defaultValue="maraicher" className="w-full">
                <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-white/5 p-4 rounded-xl mb-16 flex-wrap">
                  {ROLES_FERME.map((role) => (
                    <TabsTrigger
                      key={role.id}
                      value={role.id}
                      className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 text-xs p-2 rounded-lg"
                    >
                      <span className="text-lg sm:text-2xl">{role.emoji}</span>
                      <span className="text-xs font-semibold leading-tight text-center">{role.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                {ROLES_FERME.map((role) => {
                  const roleDesc = ROLE_DESCRIPTIONS[role.id];
                  return (
                    <TabsContent key={role.id} value={role.id} className="space-y-6 pt-8">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-400/30 mt-8">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-6xl">{roleDesc.emoji}</div>
                          <div className="flex-1">
                            <h2 className="text-3xl font-bold text-emerald-300 mb-2">{roleDesc.title}</h2>
                            <p className="text-emerald-200/70 text-lg mb-3">{roleDesc.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {roleDesc.zones.map((zone, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-sm">📍 {zone}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20">
                        <h3 className="text-2xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                          <Target className="w-6 h-6" /> Missions du poste
                        </h3>
                        <div className="space-y-4">
                          {roleDesc.tasks.map((task, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-emerald-400/20">
                              <div className="flex items-start gap-3">
                                <div className="text-3xl">{task.icon}</div>
                                <div>
                                  <h4 className="text-lg font-semibold text-emerald-200 mb-1">{task.title}</h4>
                                  <p className="text-emerald-300/70">{task.details}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <Link to={createPageUrl('MicroFerme')}>
            <Button variant="outline" className="mb-6 border-indigo-400 text-indigo-300">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au Plan
            </Button>
          </Link>

          <AnimatePresence mode="wait">
            {viewMode === 'inscription' && !isRegistered && (
              <motion.div
                key="inscription"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-indigo-400/20"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
                    <GraduationCap className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-indigo-300 mb-2">
                    🎓 Centre de Formation Pédagogique
                  </h1>
                  <p className="text-indigo-200/70 text-lg">
                    Bienvenue dans la Micro-Ferme Terra Nova !
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Choix de la catégorie */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-indigo-400/20">
                    <label className="flex items-center gap-2 text-indigo-300 font-semibold mb-4">
                      <GraduationCap className="w-5 h-5" />
                      Choisis ta catégorie
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <motion.div
                          key={category.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-300'
                              : 'bg-white/10 border border-indigo-400/20 hover:bg-white/20'
                          }`}
                        >
                          <div className="text-center">
                            <span className="text-4xl mb-2 block">{category.emoji}</span>
                            <div className="text-white font-bold">{category.name}</div>
                            <div className="text-xs text-indigo-200/70">{category.description}</div>
                          </div>
                          {selectedCategory === category.id && (
                            <CheckCircle className="w-5 h-5 text-white mx-auto mt-2" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Choix de la classe */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-indigo-400/20">
                    <label className="flex items-center gap-2 text-indigo-300 font-semibold mb-4">
                      <Users className="w-5 h-5" />
                      Rejoindre une classe
                    </label>
                    <p className="text-indigo-300/50 text-xs mb-3">Demande le code de classe à ton enseignant, puis sélectionne ta classe ci-dessous.</p>
                    {classes && classes.length > 0 ? (
                      <div className="grid gap-3">
                        {classes
                          .filter(classe => !selectedCategory || classe.niveau === selectedCategory)
                          .map((classe) => (
                          <motion.div
                            key={classe.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedClasse(classe)}
                            className={`p-4 rounded-xl cursor-pointer transition-all ${
                              selectedClasse?.id === classe.id
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-2 border-indigo-300'
                                : 'bg-white/10 border border-indigo-400/20 hover:bg-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-white font-bold text-lg">{classe.nom_classe}</div>
                                <div className="text-indigo-200/70 text-sm">
                                  👨‍🏫 {classe.enseignant} • 👥 {classe.nombre_eleves} élèves
                                </div>
                                {classe.description && (
                                  <div className="text-indigo-300/60 text-xs mt-1">{classe.description}</div>
                                )}
                              </div>
                              {selectedClasse?.id === classe.id && (
                                <CheckCircle className="w-6 h-6 text-white" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : selectedCategory ? (
                      <div className="text-center py-8 text-indigo-300/50">
                        Aucune classe disponible pour cette catégorie
                      </div>
                    ) : (
                      <div className="text-center py-8 text-indigo-300/50">
                        Aucune classe disponible pour le moment
                      </div>
                    )}
                  </div>

                  {/* Choix du poste */}
                  <div className="bg-white/5 p-6 rounded-2xl border border-indigo-400/20">
                    <label className="flex items-center gap-2 text-indigo-300 font-semibold mb-4">
                      <Briefcase className="w-5 h-5" />
                      Choisis ton poste de travail
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {ROLES_FERME.map((role) => (
                        <motion.div
                          key={role.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRole(role.id)}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedRole === role.id
                              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-300'
                              : 'bg-white/10 border border-indigo-400/20 hover:bg-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{role.emoji}</span>
                            <div>
                              <div className="text-white font-semibold">{role.name}</div>
                              <div className="text-xs text-indigo-200/70">{role.description}</div>
                            </div>
                          </div>
                          {selectedRole === role.id && (
                            <CheckCircle className="w-5 h-5 text-white ml-auto mt-2" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleRegister}
                    disabled={!selectedRole || !selectedClasse || !selectedCategory || createRoleMutation.isPending}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 py-6 text-lg"
                  >
                    {createRoleMutation.isPending ? '⏳ Inscription en cours...' : '✅ S\'inscrire et accéder à la formation'}
                  </Button>
                </div>
              </motion.div>
            )}

            {viewMode === 'formation' && isRegistered && (
              <motion.div
                key="formation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* En-tête formation */}
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-emerald-300 mb-2">
                    📚 Formation des Postes
                  </h1>
                  <p className="text-emerald-200/70 text-lg">
                    Découvre les missions et responsabilités de chaque poste de la micro-ferme
                  </p>
                </div>

                {/* Onglets des postes */}
                <Tabs defaultValue={selectedRole || 'maraicher'} className="w-full">
                  <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-white/5 p-4 rounded-xl mb-16 flex-wrap">
                    {ROLES_FERME.map((role) => (
                        <TabsTrigger
                          key={role.id}
                          value={role.id}
                          className="flex flex-col items-center gap-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 text-xs p-2 rounded-lg"
                        >
                          <span className="text-lg sm:text-2xl">{role.emoji}</span>
                          <span className="text-xs font-semibold leading-tight text-center">{role.name}</span>
                        </TabsTrigger>
                      ))}
                  </TabsList>

                  {ROLES_FERME.map((role) => {
                    const roleDesc = ROLE_DESCRIPTIONS[role.id];
                    return (
                      <TabsContent key={role.id} value={role.id} className="space-y-6 pt-8">
                        {/* Carte de présentation du poste */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-400/30 mt-8"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="text-6xl">{roleDesc.emoji}</div>
                            <div className="flex-1">
                              <h2 className="text-3xl font-bold text-emerald-300 mb-2">{roleDesc.title}</h2>
                              <p className="text-emerald-200/70 text-lg mb-3">{roleDesc.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {roleDesc.zones.map((zone, i) => (
                                  <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-sm">
                                    📍 {zone}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Cahier des charges - Tâches */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20">
                          <h3 className="text-2xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                            <Target className="w-6 h-6" />
                            Cahier des charges - Tes missions
                          </h3>
                          <div className="space-y-4">
                            {roleDesc.tasks.map((task, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 rounded-xl bg-white/5 border border-emerald-400/20 hover:bg-white/10 transition-all"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="text-3xl">{task.icon}</div>
                                  <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-emerald-200 mb-2">{task.title}</h4>
                                    <p className="text-emerald-300/70">{task.details}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Compétences à développer */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20">
                          <h3 className="text-xl font-bold text-emerald-300 mb-4">
                            💡 Compétences à développer
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {roleDesc.competences.map((comp, i) => (
                              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <span className="text-emerald-200">{comp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>

                {/* Boutons d'action */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    onClick={handleContinueToFarm}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-6 px-8 text-lg"
                  >
                    🚀 Commencer
                  </Button>
                  <Button
                    onClick={handleUnregister}
                    disabled={deleteRoleMutation.isPending}
                    variant="outline"
                    className="border-red-400 text-red-300 hover:bg-red-500/20 py-6 px-8 text-lg"
                  >
                    {deleteRoleMutation.isPending ? '⏳ Désinscription...' : '🔄 Me désinscrire et changer de poste'}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}