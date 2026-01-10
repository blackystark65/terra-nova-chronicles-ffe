import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Bouteilles plastique', emoji: '🍼', bin: 'plastic', recycled: 'Cordages marins' },
  { name: 'Canettes boissons', emoji: '🥫', bin: 'metal', recycled: 'Équipements nautiques' },
  { name: 'Filets de pêche', emoji: '🎣', bin: 'general', recycled: 'Recyclage spécial' },
  { name: 'Bidons huile', emoji: '🛢️', bin: 'general', recycled: 'Traitement spécialisé' },
  { name: 'Papiers gras', emoji: '📋', bin: 'general', recycled: 'Compostage industriel' },
];

export default function RecyclageMarina() {
  return (
    <WasteCollectionZone
      zoneName="Marina"
      zoneEmoji="⛵"
      zoneColor="from-blue-600 to-cyan-600"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/5fd2b43f1_marina.png"
    />
  );
}