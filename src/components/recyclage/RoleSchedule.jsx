// Plannings journaliers pour chaque rôle
// Chaque créneau dure un certain temps en secondes

export const ROLE_SCHEDULES = {
  client: [
    { hour: 8, zone: 'reception', duration: 120, label: 'Arrivée / Check-in' },
    { hour: 9, zone: 'rooms', duration: 180, label: 'Installation chambre' },
    { hour: 12, zone: 'restaurant', duration: 240, label: 'Déjeuner' },
    { hour: 14, zone: 'rooms', duration: 120, label: 'Repos' },
    { hour: 15, zone: 'beach', duration: 180, label: 'Plage' },
    { hour: 17, zone: 'pool', duration: 120, label: 'Piscine' },
    { hour: 18, zone: 'rooms', duration: 120, label: 'Retour chambre' },
    { hour: 19, zone: 'restaurant', duration: 240, label: 'Dîner' },
    { hour: 21, zone: 'rooms', duration: 180, label: 'Soirée chambre' },
  ],
  
  cook: [
    { hour: 6, zone: 'kitchen', duration: 180, label: 'Petit-déjeuner' },
    { hour: 9, zone: 'rooms', duration: 120, label: 'Repos chambre' },
    { hour: 11, zone: 'kitchen', duration: 240, label: 'Préparation déjeuner' },
    { hour: 14, zone: 'beach', duration: 120, label: 'Pause plage' },
    { hour: 16, zone: 'shop', duration: 60, label: 'Courses boutique' },
    { hour: 17, zone: 'kitchen', duration: 240, label: 'Préparation dîner' },
    { hour: 21, zone: 'rooms', duration: 120, label: 'Repos' },
  ],
  
  waiter: [
    { hour: 7, zone: 'restaurant', duration: 180, label: 'Service petit-déj' },
    { hour: 10, zone: 'rooms', duration: 120, label: 'Pause' },
    { hour: 12, zone: 'restaurant', duration: 240, label: 'Service déjeuner' },
    { hour: 15, zone: 'pool', duration: 120, label: 'Pause piscine' },
    { hour: 18, zone: 'restaurant', duration: 240, label: 'Service dîner' },
    { hour: 22, zone: 'rooms', duration: 120, label: 'Repos' },
  ],
  
  receptionist: [
    { hour: 7, zone: 'reception', duration: 240, label: 'Accueil matin' },
    { hour: 11, zone: 'rooms', duration: 120, label: 'Pause' },
    { hour: 13, zone: 'reception', duration: 300, label: 'Accueil après-midi' },
    { hour: 18, zone: 'rooms', duration: 120, label: 'Repos' },
    { hour: 20, zone: 'reception', duration: 180, label: 'Service soir' },
  ],
  
  cleaner: [
    { hour: 7, zone: 'rooms', duration: 240, label: 'Nettoyage chambres' },
    { hour: 11, zone: 'restaurant', duration: 120, label: 'Nettoyage restaurant' },
    { hour: 13, zone: 'reception', duration: 120, label: 'Nettoyage réception' },
    { hour: 15, zone: 'pool', duration: 120, label: 'Nettoyage piscine' },
    { hour: 17, zone: 'beach', duration: 120, label: 'Nettoyage plage' },
    { hour: 19, zone: 'decheterie', duration: 180, label: 'Vidage déchetterie' },
    { hour: 22, zone: 'rooms', duration: 120, label: 'Repos' },
  ],
  
  gardener: [
    { hour: 7, zone: 'beach', duration: 180, label: 'Entretien plage' },
    { hour: 10, zone: 'pool', duration: 120, label: 'Entretien piscine' },
    { hour: 12, zone: 'rooms', duration: 120, label: 'Pause déjeuner' },
    { hour: 14, zone: 'parking', duration: 120, label: 'Entretien parking' },
    { hour: 16, zone: 'beach', duration: 180, label: 'Entretien espaces verts' },
    { hour: 19, zone: 'rooms', duration: 120, label: 'Repos' },
  ],
  
  driver: [
    { hour: 7, zone: 'parking', duration: 180, label: 'Transferts matin' },
    { hour: 10, zone: 'marina', duration: 120, label: 'Navettes marina' },
    { hour: 12, zone: 'rooms', duration: 120, label: 'Pause' },
    { hour: 14, zone: 'parking', duration: 180, label: 'Transferts après-midi' },
    { hour: 17, zone: 'marina', duration: 120, label: 'Navettes soir' },
    { hour: 19, zone: 'decheterie', duration: 180, label: 'Transport déchets' },
    { hour: 22, zone: 'rooms', duration: 120, label: 'Repos' },
  ],
  
  pool_guard: [
    { hour: 8, zone: 'pool', duration: 240, label: 'Surveillance matin' },
    { hour: 12, zone: 'rooms', duration: 120, label: 'Pause déjeuner' },
    { hour: 14, zone: 'pool', duration: 300, label: 'Surveillance après-midi' },
    { hour: 19, zone: 'rooms', duration: 120, label: 'Repos' },
  ],
  
  port_guard: [
    { hour: 7, zone: 'marina', duration: 240, label: 'Surveillance matin' },
    { hour: 11, zone: 'rooms', duration: 120, label: 'Pause' },
    { hour: 13, zone: 'marina', duration: 300, label: 'Surveillance après-midi' },
    { hour: 18, zone: 'rooms', duration: 120, label: 'Repos' },
  ],
  
  shopkeeper: [
    { hour: 8, zone: 'shop', duration: 240, label: 'Ouverture boutique' },
    { hour: 12, zone: 'rooms', duration: 120, label: 'Pause déjeuner' },
    { hour: 14, zone: 'shop', duration: 300, label: 'Service après-midi' },
    { hour: 19, zone: 'shop', duration: 120, label: 'Fermeture' },
    { hour: 21, zone: 'rooms', duration: 120, label: 'Repos' },
  ],
};

export const ZONE_NAMES = {
  kitchen: 'Cuisine',
  restaurant: 'Restaurant',
  reception: 'Réception',
  rooms: 'Chambres',
  pool: 'Piscine',
  beach: 'Plage',
  marina: 'Marina',
  parking: 'Parking',
  shop: 'Boutique',
  decheterie: 'Déchetterie',
};

export const ZONE_PAGES = {
  kitchen: 'RecyclageKitchen',
  restaurant: 'RecyclageRestaurant',
  reception: 'RecyclageReception',
  rooms: 'RecyclageRooms',
  pool: 'RecyclagePool',
  beach: 'RecyclagePlage',
  marina: 'RecyclageMarina',
  parking: 'RecyclageParking',
  shop: 'RecyclageShop',
  decheterie: 'RecyclageDecheterie',
};