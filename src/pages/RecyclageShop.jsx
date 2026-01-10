import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Sacs plastique', emoji: '🛍️', bin: 'plastic', recycled: 'Nouveaux sacs' },
  { name: 'Boîtes carton', emoji: '📦', bin: 'paper', recycled: 'Emballages recyclés' },
  { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic', recycled: 'Nouvelles bouteilles' },
  { name: 'Canettes soda', emoji: '🥫', bin: 'metal', recycled: 'Aluminium recyclé' },
  { name: 'Emballages snacks', emoji: '🍿', bin: 'plastic', recycled: 'Plastique recyclé' },
  { name: 'Reçus papier', emoji: '🧾', bin: 'paper', recycled: 'Papier recyclé' },
];

export default function RecyclageShop() {
  return (
    <WasteCollectionZone
      zoneName="Boutique de l'Hôtel"
      zoneEmoji="🛍️"
      zoneColor="from-pink-500 to-purple-500"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/940aecd07_Boutique.png"
    />
  );
}