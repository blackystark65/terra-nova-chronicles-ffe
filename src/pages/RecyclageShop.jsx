import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';
import { SWISS_WASTE_ITEMS } from '@/components/recyclage/SwissWasteData';

const wastes = SWISS_WASTE_ITEMS.shop;

export default function RecyclageShop() {
  return (
    <WasteCollectionZone
      zoneName="Boutique de l'Hôtel"
      zoneEmoji="🛍️"
      zoneColor="from-pink-500 to-purple-500"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/940aecd07_Boutique.png"
    />
  );
}