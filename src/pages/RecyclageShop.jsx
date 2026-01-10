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
      backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
    />
  );
}