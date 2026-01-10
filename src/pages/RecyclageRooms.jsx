import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Magazines', emoji: '📰', bin: 'paper', recycled: 'Papier toilette' },
  { name: 'Bouteilles shampoing', emoji: '🧴', bin: 'plastic', recycled: 'Jouets en plastique' },
  { name: 'Canettes soda', emoji: '🥤', bin: 'metal', recycled: 'Pièces vélo' },
  { name: 'Emballages snacks', emoji: '🍿', bin: 'plastic', recycled: 'Sacs poubelle' },
  { name: 'Papiers mouchoirs', emoji: '🧻', bin: 'organic', recycled: 'Compost' },
  { name: 'Cartons pizza', emoji: '📦', bin: 'paper', recycled: 'Boîtes à œufs' },
];

export default function RecyclageRooms() {
  return (
    <WasteCollectionZone
      zoneName="Chambres"
      zoneEmoji="🛏️"
      zoneColor="from-purple-500 to-pink-500"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/d13fa3ffa_chambre.png"
    />
  );
}