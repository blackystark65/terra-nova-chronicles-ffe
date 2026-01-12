import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, GraduationCap, Users, CheckCircle, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROLES_FERME } from '@/components/microferme/FermeData';

export default function FermeCentreFormation() {
  const queryClient = useQueryClient();
  const [classCode, setClassCode] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
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
    },
  });

  useEffect(() => {
    if (existingRoles && existingRoles.length > 0) {
      setIsRegistered(true);
      setSelectedRole(existingRoles[0].role);
    }
  }, [existingRoles]);

  const handleRegister = () => {
    if (!selectedRole || !classCode.trim()) return;
    
    const roleData = ROLES_FERME[selectedRole];
    createRoleMutation.mutate({
      role: selectedRole,
      role_name: roleData.name,
      zone_principale: roleData.zone,
      total_actions: 0,
      is_active: true,
    });
  };

  const handleContinueToFarm = () => {
    window.location.href = createPageUrl('FermeSchedule');
  };

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

          {!isRegistered ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                {/* Code de classe */}
                <div className="bg-white/5 p-6 rounded-2xl border border-indigo-400/20">
                  <label className="flex items-center gap-2 text-indigo-300 font-semibold mb-3">
                    <Users className="w-5 h-5" />
                    Code de classe fourni par l'enseignant
                  </label>
                  <Input
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="Ex: FERME2026-A"
                    className="bg-white/10 border-indigo-400/30 text-white text-lg"
                  />
                </div>

                {/* Choix du poste */}
                <div className="bg-white/5 p-6 rounded-2xl border border-indigo-400/20">
                  <label className="flex items-center gap-2 text-indigo-300 font-semibold mb-4">
                    <Briefcase className="w-5 h-5" />
                    Choisis ton poste de travail
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(ROLES_FERME).map(([key, role]) => (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole(key)}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          selectedRole === key
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-300'
                            : 'bg-white/10 border border-indigo-400/20 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-3xl ${role.color}`}>{role.emoji}</span>
                          <div>
                            <div className="text-white font-semibold">{role.name}</div>
                            <div className="text-xs text-indigo-200/70">{role.zone}</div>
                          </div>
                        </div>
                        {selectedRole === key && (
                          <CheckCircle className="w-5 h-5 text-white ml-auto mt-2" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={!selectedRole || !classCode.trim() || createRoleMutation.isPending}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 py-6 text-lg"
                >
                  {createRoleMutation.isPending ? '⏳ Inscription en cours...' : '✅ S\'inscrire et rejoindre la ferme'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-green-400/20 text-center"
            >
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                🎉 Inscription réussie !
              </h2>
              <p className="text-green-200/70 text-lg mb-6">
                Tu es maintenant inscrit comme <strong>{ROLES_FERME[selectedRole]?.name}</strong>
              </p>
              <p className="text-indigo-200/70 mb-8">
                Ton enseignant va lancer la session de classe. Prépare-toi à gérer la micro-ferme !
              </p>
              <Button
                onClick={handleContinueToFarm}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-6 text-lg"
              >
                Continuer vers mon poste de travail →
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}