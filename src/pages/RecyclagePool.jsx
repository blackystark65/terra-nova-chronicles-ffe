import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';
import { SWISS_WASTE_ITEMS } from '@/components/recyclage/SwissWasteData';

const wastes = SWISS_WASTE_ITEMS.pool;

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