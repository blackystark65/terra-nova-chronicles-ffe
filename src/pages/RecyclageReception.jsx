import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Papiers bureau', emoji: '📄', bin: 'paper', recycled: 'Cahiers et livres' },
  { name: 'Cartouches encre', emoji: '🖨️', bin: 'general', recycled: 'Recyclage spécial' },
  { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic', recycled: 'Textiles techniques' },
  { name: 'Magazines', emoji: '📰', bin: 'paper', recycled: 'Papier toilette' },
  { name: 'Gobelets plastique', emoji: '🥤', bin: 'plastic', recycled: 'Mobilier urbain' },
];

export default function RecyclageReception() {
  return (
    <WasteCollectionZone
      zoneName="Réception"
      zoneEmoji="🏨"
      zoneColor="from-blue-500 to-purple-500"
      wastes={wastes}
    />
  );
}