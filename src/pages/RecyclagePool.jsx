import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Tube crème solaire', emoji: '🧴', bin: 'plastic', recycled: 'Plastique recyclé' },
  { name: 'Bouteille eau', emoji: '💧', bin: 'plastic', recycled: 'Nouvelles bouteilles' },
  { name: 'Lunettes plastique', emoji: '🕶️', bin: 'plastic', recycled: 'Plastique' },
  { name: 'Bouée gonflable', emoji: '🏊', bin: 'plastic', recycled: 'Plastique recyclé' },
  { name: 'Sac étanche', emoji: '🎒', bin: 'plastic', recycled: 'Plastique' },
  { name: 'Gobelet plastique', emoji: '🥤', bin: 'plastic', recycled: 'Gobelets neufs' },
  { name: 'Canette boisson', emoji: '🥤', bin: 'metal', recycled: 'Canettes neuves' },
  { name: 'Capsule bouteille', emoji: '🔘', bin: 'metal', recycled: 'Métal recyclé' },
  { name: 'Canette soda', emoji: '🥫', bin: 'metal', recycled: 'Aluminium' },
  { name: 'Serviette papier', emoji: '🧻', bin: 'paper', recycled: 'Papier recyclé' },
  { name: 'Magazine plage', emoji: '📖', bin: 'paper', recycled: 'Papier neuf' },
  { name: 'Journal', emoji: '📰', bin: 'paper', recycled: 'Papier' },
  { name: 'Bouteille verre', emoji: '🍾', bin: 'glass', recycled: 'Verre recyclé' },
  { name: 'Paille plastique', emoji: '🥤', bin: 'general', recycled: 'Incinération' },
  { name: 'Emballage snack', emoji: '🍿', bin: 'general', recycled: 'Incinération' },
  { name: 'Chewing-gum', emoji: '🍬', bin: 'general', recycled: 'Incinération' },
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