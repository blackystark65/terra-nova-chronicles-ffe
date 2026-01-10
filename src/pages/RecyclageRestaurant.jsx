import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';

const wastes = [
  { name: 'Restes de repas', emoji: '🍝', bin: 'organic', recycled: 'Biogaz et compost' },
  { name: 'Bouteilles verre', emoji: '🍾', bin: 'glass', recycled: 'Nouveau verre' },
  { name: 'Serviettes papier', emoji: '🧻', bin: 'paper', recycled: 'Papier recyclé' },
  { name: 'Emballages plastique', emoji: '🥡', bin: 'plastic', recycled: 'Bancs publics' },
  { name: 'Couverts jetables', emoji: '🍴', bin: 'general', recycled: 'Incinération énergie' },
  { name: 'Canettes', emoji: '🥫', bin: 'metal', recycled: 'Pièces vélo' },
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