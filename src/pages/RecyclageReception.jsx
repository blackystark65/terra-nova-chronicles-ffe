import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';
import { SWISS_WASTE_ITEMS } from '@/components/recyclage/SwissWasteData';

const wastes = SWISS_WASTE_ITEMS.reception;

export default function RecyclageReception() {
  return (
    <WasteCollectionZone 
      zoneName="Réception"
      zoneEmoji="🏨"
      zoneColor="from-blue-500 to-purple-500"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/349c14a99_digital-screen-with-environment-day.jpg"
    />
  );
}