import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Bouteille shampoing', emoji: '🧴', bin: 'plastic', recycled: 'Nouveaux flacons' },
  { name: 'Bouteille eau', emoji: '💧', bin: 'plastic', recycled: 'Plastique recyclé' },
  { name: 'Sac plastique', emoji: '🛍️', bin: 'plastic', recycled: 'Sacs neufs' },
  { name: 'Tube dentifrice', emoji: '🪥', bin: 'plastic', recycled: 'Plastique' },
  { name: 'Flacon gel douche', emoji: '🧴', bin: 'plastic', recycled: 'Emballages' },
  { name: 'Journal', emoji: '📰', bin: 'paper', recycled: 'Papier recyclé' },
  { name: 'Magazine', emoji: '📖', bin: 'paper', recycled: 'Papier neuf' },
  { name: 'Boîte carton', emoji: '📦', bin: 'paper', recycled: 'Carton recyclé' },
  { name: 'Prospectus', emoji: '📄', bin: 'paper', recycled: 'Papier' },
  { name: 'Canette vide', emoji: '🥫', bin: 'metal', recycled: 'Métal recyclé' },
  { name: 'Capsule café', emoji: '☕', bin: 'metal', recycled: 'Aluminium' },
  { name: 'Pile usagée', emoji: '🔋', bin: 'metal', recycled: 'Métal précieux' },
  { name: 'Mouchoirs usagés', emoji: '🧻', bin: 'general', recycled: 'Incinération' },
  { name: 'Coton-tige', emoji: '🪥', bin: 'general', recycled: 'Incinération' },
  { name: 'Rasoir jetable', emoji: '🪒', bin: 'general', recycled: 'Incinération' },
  { name: 'Emballage cadeau', emoji: '🎁', bin: 'paper', recycled: 'Carton recyclé' },
  { name: 'Flacon parfum', emoji: '🍾', bin: 'glass', recycled: 'Verre recyclé' },
  { name: 'Ampoule cassée', emoji: '💡', bin: 'glass', recycled: 'Verre' },
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