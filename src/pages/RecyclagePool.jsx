import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Bouteilles crème solaire', emoji: '🧴', bin: 'plastic', recycled: 'Tuyaux d\'arrosage' },
  { name: 'Canettes', emoji: '🥫', bin: 'metal', recycled: 'Cadres de vélo' },
  { name: 'Serviettes usées', emoji: '🧺', bin: 'general', recycled: 'Isolation thermique' },
  { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic', recycled: 'Fibres textiles' },
  { name: 'Gobelets', emoji: '🥤', bin: 'plastic', recycled: 'Pots de fleurs' },
];

export default function RecyclagePool() {
  return (
    <WasteCollectionZone
      zoneName="Piscine"
      zoneEmoji="🏊"
      zoneColor="from-cyan-500 to-blue-500"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/720931344_piscine.png"
    />
  );
}