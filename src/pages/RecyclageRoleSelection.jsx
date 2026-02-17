import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Button } from '@/components/ui/button';
import { User, CheckCircle, ArrowRight } from 'lucide-react';

const ROLES = [
  { id: 'client', name: 'Client en Vacances', emoji: '🏖️', description: 'Profite de l\'hôtel, génère des déchets quotidiens', zones: ['rooms', 'restaurant', 'pool', 'beach', 'shop'] },
  { id: 'receptionist', name: 'Réceptionniste', emoji: '🏨', description: 'Accueille les clients, gère la réception', zones: ['reception'] },
  { id: 'cleaner', name: 'Service de Nettoyage', emoji: '🧹', description: 'Nettoie les chambres et espaces communs', zones: ['rooms', 'restaurant', 'reception'] },
  { id: 'cook', name: 'Cuisinier', emoji: '👨‍🍳', description: 'Prépare les repas en cuisine', zones: ['kitchen'] },
  { id: 'waiter', name: 'Serveur', emoji: '🍽️', description: 'Sert les clients au restaurant', zones: ['restaurant'] },
  { id: 'gardener', name: 'Jardinier', emoji: '🌱', description: 'Entretient les espaces verts', zones: ['pool', 'beach'] },
  { id: 'driver', name: 'Chauffeur de Tri', emoji: '🚛', description: 'Transporte les déchets vers les centres', zones: ['decheterie'] },
  { id: 'pool_guard', name: 'Gardien de Piscine', emoji: '🏊', description: 'Surveille la piscine et la plage', zones: ['pool', 'beach'] },
  { id: 'port_guard', name: 'Surveillant de Port', emoji: '⚓', description: 'Gère la marina et les bateaux', zones: ['marina'] },
  { id: 'shopkeeper', name: 'Vendeur Boutique', emoji: '🛍️', description: 'Vend souvenirs, nourriture et boissons', zones: ['shop'] },
];

export default function RecyclageRoleSelection() {
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('User not authenticated');
      }
    };
    fetchUser();
  }, []);

  const { data: existingRole } = useQuery({
    queryKey: ['playerRole', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const roles = await base44.entities.PlayerRole.filter({ created_by: user.email });
      return roles.length > 0 ? roles[0] : null;
    },
    enabled: !!user?.id
  });

  const createRoleMutation = useMutation({
    mutationFn: async (roleData) => {
      if (existingRole) {
        return await base44.entities.PlayerRole.update(existingRole.id, roleData);
      }
      return await base44.entities.PlayerRole.create(roleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerRole'] });
      window.location.href = createPageUrl('RecyclageSchedule');
    }
  });

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (selectedRole && user) {
      createRoleMutation.mutate({
        role: selectedRole.id,
        role_name: selectedRole.name,
        zone_assigned: selectedRole.zones[0],
        is_active: true,
        last_activity: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/17ce4623e_PlanHotelTerraaNova.png)',
        }}
      />
      <div className="fixed inset-0 bg-slate-950/40" />
      <BiolumiHeader currentPage="Recyclage" />
      
      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 mb-6">
              <User className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Bienvenue {user?.display_name || user?.full_name || 'Joueur'}</span>
            </div>
            
            <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Choisis ton Rôle à l'Hôtel Terra Nova
            </h1>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
              {existingRole ? 
                `Tu es actuellement ${existingRole.role_name}. Tu peux changer de rôle à tout moment.` :
                'Sélectionne ton rôle pour commencer à jouer. Chaque rôle a ses propres responsabilités et génère des déchets différents.'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {ROLES.map((role, i) => (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handleSelectRole(role)}
                className={`
                  relative rounded-3xl p-6 text-left transition-all
                  ${selectedRole?.id === role.id ?
                    'bg-gradient-to-br from-emerald-600 to-teal-600 border-4 border-emerald-300 shadow-2xl' :
                    'bg-white/10 backdrop-blur-xl border-2 border-emerald-400/30 hover:border-emerald-400/60'
                  }
                `}
              >
                {selectedRole?.id === role.id && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
                
                <div className="text-6xl mb-4">{role.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{role.name}</h3>
                <p className="text-emerald-200 text-sm mb-4">{role.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {role.zones.map(zone => (
                    <span key={zone} className="px-2 py-1 bg-white/20 rounded-lg text-xs text-white">
                      {zone}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>

          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20 text-center"
            >
              <Button
                onClick={handleConfirm}
                disabled={createRoleMutation.isPending}
                className="relative z-20 px-12 py-6 text-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 cursor-pointer"
              >
                {createRoleMutation.isPending ? 'Enregistrement...' : (
                  <>
                    Confirmer le rôle: {selectedRole.name}
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}