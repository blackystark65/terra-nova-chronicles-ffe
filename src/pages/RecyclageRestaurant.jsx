import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';
import { SWISS_WASTE_ITEMS } from '@/components/recyclage/SwissWasteData';

const wastes = SWISS_WASTE_ITEMS.restaurant;

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