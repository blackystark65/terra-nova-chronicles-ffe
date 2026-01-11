import React from 'react';
import WasteCollectionZone from '@/components/recyclage/WasteCollectionZone';
import { SWISS_WASTE_ITEMS } from '@/components/recyclage/SwissWasteData';

const wastes = SWISS_WASTE_ITEMS.parking;

export default function RecyclageParking() {
  return (
    <WasteCollectionZone 
      zoneName="Parking"
      zoneEmoji="🚗"
      zoneColor="from-gray-600 to-slate-700"
      wastes={wastes}
      backgroundImage="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/349c14a99_digital-screen-with-environment-day.jpg"
    />
  );
}