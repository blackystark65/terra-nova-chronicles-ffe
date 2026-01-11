import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';
import { SWISS_WASTE_ITEMS } from '@/components/recyclage/SwissWasteData';

const wastes = SWISS_WASTE_ITEMS.rooms;

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