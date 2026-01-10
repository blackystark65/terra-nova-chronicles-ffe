import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Épluchures de légumes', emoji: '🥕', bin: 'organic', recycled: 'Compost' },
  { name: 'Restes de repas', emoji: '🍽️', bin: 'organic', recycled: 'Compost' },
  { name: 'Marc de café', emoji: '☕', bin: 'organic', recycled: 'Compost' },
  { name: 'Coquilles d\'œufs', emoji: '🥚', bin: 'organic', recycled: 'Compost' },
  { name: 'Peau de banane', emoji: '🍌', bin: 'organic', recycled: 'Compost' },
  { name: 'Bouteille plastique', emoji: '🧴', bin: 'plastic', recycled: 'Nouvelles bouteilles' },
  { name: 'Sac plastique', emoji: '🛍️', bin: 'plastic', recycled: 'Sacs recyclés' },
  { name: 'Barquette plastique', emoji: '📦', bin: 'plastic', recycled: 'Emballages' },
  { name: 'Film alimentaire', emoji: '📋', bin: 'plastic', recycled: 'Plastique recyclé' },
  { name: 'Conserve métallique', emoji: '🥫', bin: 'metal', recycled: 'Nouveaux emballages' },
  { name: 'Canette aluminium', emoji: '🥤', bin: 'metal', recycled: 'Canettes neuves' },
  { name: 'Papier aluminium', emoji: '📄', bin: 'metal', recycled: 'Aluminium recyclé' },
  { name: 'Couvercle métal', emoji: '🔘', bin: 'metal', recycled: 'Métal recyclé' },
  { name: 'Carton d\'emballage', emoji: '📦', bin: 'paper', recycled: 'Carton recyclé' },
  { name: 'Journal', emoji: '📰', bin: 'paper', recycled: 'Papier neuf' },
  { name: 'Boîte œufs', emoji: '🥚', bin: 'paper', recycled: 'Carton' },
  { name: 'Bouteille en verre', emoji: '🍾', bin: 'glass', recycled: 'Nouveau verre' },
  { name: 'Pot confiture', emoji: '🫙', bin: 'glass', recycled: 'Verre recyclé' },
  { name: 'Film plastique sale', emoji: '🎁', bin: 'general', recycled: 'Incinération' },
  { name: 'Éponge usée', emoji: '🧽', bin: 'general', recycled: 'Incinération' },
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