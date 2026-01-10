import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Épluchures', emoji: '🥕', bin: 'organic', recycled: 'Compost pour jardin' },
  { name: 'Boîtes carton', emoji: '📦', bin: 'paper', recycled: 'Nouveau carton' },
  { name: 'Bouteilles plastique', emoji: '🧴', bin: 'plastic', recycled: 'Vêtements polaires' },
  { name: 'Canettes alu', emoji: '🥫', bin: 'metal', recycled: 'Nouvelles canettes' },
  { name: 'Pots en verre', emoji: '🫙', bin: 'glass', recycled: 'Nouveaux bocaux' },
  { name: 'Emballages', emoji: '📋', bin: 'paper', recycled: 'Papier recyclé' },
];

export default function RecyclageKitchen() {
  return (
    <WasteCollectionZone
      zoneName="Cuisine"
      zoneEmoji="👨‍🍳"
      zoneColor="from-orange-500 to-red-500"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/42f687342_cuisine.png"
    />
  );
}