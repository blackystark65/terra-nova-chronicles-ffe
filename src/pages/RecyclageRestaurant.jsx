import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Assiette en carton', emoji: '🍽️', bin: 'paper', recycled: 'Carton recyclé' },
  { name: 'Serviette en papier', emoji: '🧻', bin: 'paper', recycled: 'Papier recyclé' },
  { name: 'Menu papier', emoji: '📋', bin: 'paper', recycled: 'Papier neuf' },
  { name: 'Boîte pizza', emoji: '📦', bin: 'paper', recycled: 'Carton' },
  { name: 'Sachet thé', emoji: '🍵', bin: 'organic', recycled: 'Compost' },
  { name: 'Restes alimentaires', emoji: '🥗', bin: 'organic', recycled: 'Compost' },
  { name: 'Épluchures fruits', emoji: '🍎', bin: 'organic', recycled: 'Compost' },
  { name: 'Pain rassis', emoji: '🥖', bin: 'organic', recycled: 'Compost' },
  { name: 'Noyau avocat', emoji: '🥑', bin: 'organic', recycled: 'Compost' },
  { name: 'Canette soda', emoji: '🥤', bin: 'metal', recycled: 'Nouvelles canettes' },
  { name: 'Capsule bouteille', emoji: '🔘', bin: 'metal', recycled: 'Métal recyclé' },
  { name: 'Couverts plastique', emoji: '🍴', bin: 'plastic', recycled: 'Plastique recyclé' },
  { name: 'Gobelet plastique', emoji: '🥤', bin: 'plastic', recycled: 'Nouveaux gobelets' },
  { name: 'Paille plastique', emoji: '🥤', bin: 'plastic', recycled: 'Plastique' },
  { name: 'Bouteille en verre', emoji: '🍾', bin: 'glass', recycled: 'Nouveau verre' },
  { name: 'Pot en verre', emoji: '🫙', bin: 'glass', recycled: 'Verre recyclé' },
  { name: 'Verre à boire', emoji: '🥃', bin: 'glass', recycled: 'Nouveau verre' },
  { name: 'Emballage sale', emoji: '🗑️', bin: 'general', recycled: 'Incinération' },
  { name: 'Mouchoir usagé', emoji: '🧻', bin: 'general', recycled: 'Incinération' },
];

export default function RecyclageRestaurant() {
  return (
    <WasteCollectionZone
      zoneName="Restaurant"
      zoneEmoji="🍽️"
      zoneColor="from-yellow-500 to-orange-500"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/75190a64a_restaurant.png"
    />
  );
}