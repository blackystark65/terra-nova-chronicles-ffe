import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ROLES_FERME } from '@/components/microferme/FermeData';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FermeRoleSelection() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(null);
  const [confirming, setConfirming] = useState(false);

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
    mutationFn: (roleData) => base44.entities.RoleFerme.create(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries(['fermeRoles']);
      navigate(createPageUrl('FermeSchedule'));
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RoleFerme.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['fermeRoles']);
      navigate(createPageUrl('FermeSchedule'));
    },
  });

  useEffect(() => {
    if (existingRoles && existingRoles.length > 0) {
      const role = ROLES_FERME.find(r => r.id === existingRoles[0].role);
      setSelectedRole(role);
    }
  }, [existingRoles]);

  const handleConfirmRole = () => {
    if (!selectedRole) return;
    
    const roleData = {
      role: selectedRole.id,
      role_name: selectedRole.name,
      zone_principale: selectedRole.zones[0],
      is_active: true,
    };

    if (existingRoles && existingRoles.length > 0) {
      updateRoleMutation.mutate({ id: existingRoles[0].id, data: roleData });
    } else {
      createRoleMutation.mutate(roleData);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-green-950/90 via-emerald-950/85 to-teal-950/90" />
      
      <BiolumiHeader currentPage="MicroFerme" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-black mb-4 text-emerald-300">
              Choisis ton Rôle à la Ferme
            </h1>
            <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
              Chaque rôle contribue à l'équilibre de l'écosystème agricole
            </p>
          </motion.div>

          {/* Roles grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {ROLES_FERME.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedRole(role);
                  setConfirming(false);
                }}
                className={`
                  relative cursor-pointer rounded-2xl p-6 border-2 transition-all
                  ${selectedRole?.id === role.id ?
                    'border-emerald-400 bg-white/15 shadow-xl shadow-emerald-500/20' :
                    'border-white/20 bg-white/5 hover:bg-white/10'}
                `}
              >
                {selectedRole?.id === role.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                )}

                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${role.color} mb-4`}>
                  <span className="text-5xl">{role.emoji}</span>
                </div>

                <h3 className="text-xl font-bold text-emerald-300 mb-2">{role.name}</h3>
                <p className="text-emerald-200 text-sm mb-4">{role.description}</p>

                <div className="space-y-2">
                  <p className="text-xs text-emerald-400 font-semibold">Zones de travail:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.zones.map(zone => (
                      <span key={zone} className="text-xs px-2 py-1 rounded-lg bg-white/10 text-white">
                        {zone.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Confirmation */}
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500/20 backdrop-blur-xl rounded-2xl p-8 border border-emerald-400 text-center"
            >
              {!confirming ? (
                <>
                  <p className="text-emerald-200 text-lg mb-4">
                    Tu as choisi: <span className="font-bold text-emerald-300">{selectedRole.name}</span>
                  </p>
                  <Button
                    onClick={() => setConfirming(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    Confirmer mon rôle
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-emerald-200 text-lg mb-4">
                    🌱 Es-tu sûr·e de vouloir être <span className="font-bold">{selectedRole.name}</span> ?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={handleConfirmRole}
                      disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
                      className="bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Oui, commencer !
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button
                      onClick={() => setConfirming(false)}
                      variant="outline"
                      className="border-emerald-400/50 text-emerald-300"
                    >
                      Choisir un autre rôle
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}