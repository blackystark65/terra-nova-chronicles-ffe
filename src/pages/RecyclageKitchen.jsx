import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';
import { SWISS_WASTE_ITEMS } from '@/components/recyclage/SwissWasteData';

const wastes = SWISS_WASTE_ITEMS.kitchen;

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