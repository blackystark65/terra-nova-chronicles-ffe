import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Bouteilles plastique', emoji: '🍼', bin: 'plastic', recycled: 'Bateaux recyclés' },
  { name: 'Canettes boissons', emoji: '🥫', bin: 'metal', recycled: 'Trottinettes' },
  { name: 'Papiers mouchoirs', emoji: '🧻', bin: 'organic', recycled: 'Compost' },
  { name: 'Bouteilles verre', emoji: '🍾', bin: 'glass', recycled: 'Vaisselle en verre' },
  { name: 'Emballages snacks', emoji: '🍿', bin: 'plastic', recycled: 'Sacs plastique' },
  { name: 'Gobelets', emoji: '🥤', bin: 'plastic', recycled: 'Mobilier plage' },
];

export default function RecyclagePlage() {
  return (
    <WasteCollectionZone
      zoneName="Plage Privée"
      zoneEmoji="🏖️"
      zoneColor="from-yellow-400 to-orange-500"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/4af8e88fb_plage.png"
    />
  );
}