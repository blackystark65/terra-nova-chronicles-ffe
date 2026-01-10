import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Bouteilles plastique', emoji: '🧴', bin: 'plastic', recycled: 'Pare-chocs auto' },
  { name: 'Canettes', emoji: '🥫', bin: 'metal', recycled: 'Pièces automobiles' },
  { name: 'Papiers tickets', emoji: '🎫', bin: 'paper', recycled: 'Carton recyclé' },
  { name: 'Emballages fast-food', emoji: '🍔', bin: 'general', recycled: 'Valorisation énergétique' },
  { name: 'Pneus usés', emoji: '🛞', bin: 'general', recycled: 'Revêtements sportifs' },
];

export default function RecyclageParking() {
  return (
    <WasteCollectionZone
      zoneName="Parking"
      zoneEmoji="🚗"
      zoneColor="from-gray-600 to-slate-700"
      wastes={wastes}
    />
  );
}