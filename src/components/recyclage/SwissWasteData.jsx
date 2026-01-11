// Données de recyclage conformes aux normes suisses (OLED)

export const SWISS_BIN_TYPES = {
  paper: { 
    name: 'Papier/Carton', 
    emoji: '📄', 
    color: 'bg-blue-500', 
    info: 'Papier, carton propre',
    recycled: 'Nouveaux papiers, cartons, emballages'
  },
  plastic: { 
    name: 'Plastique/PET', 
    emoji: '♻️', 
    color: 'bg-yellow-500', 
    info: 'Plastiques, PET, cordages, filets',
    recycled: 'T-shirts, sacs, porte-monnaies, fibres, palettes'
  },
  glass: { 
    name: 'Verre', 
    emoji: '🍾', 
    color: 'bg-green-500', 
    info: 'Bouteilles, bocaux en verre',
    recycled: 'Nouvelles bouteilles et bocaux'
  },
  organic: { 
    name: 'Biodéchets', 
    emoji: '🥕', 
    color: 'bg-amber-700', 
    info: 'Déchets organiques, épluchures',
    recycled: 'Biogaz, compost, engrais'
  },
  aluminum: { 
    name: 'Aluminium', 
    emoji: '🥫', 
    color: 'bg-red-500', 
    info: 'Canettes, aluminium',
    recycled: 'Aluminium secondaire, vélos, pièces auto'
  },
  oils: { 
    name: 'Huiles', 
    emoji: '🛢️', 
    color: 'bg-orange-600', 
    info: 'Huiles alimentaires, de friture',
    recycled: 'Biodiesel, carburant'
  },
  batteries: { 
    name: 'Piles/Batteries', 
    emoji: '🔋', 
    color: 'bg-purple-600', 
    info: 'Piles, batteries',
    recycled: 'Neutralisation, récupération métaux'
  },
  bulbs: { 
    name: 'Ampoules', 
    emoji: '💡', 
    color: 'bg-yellow-600', 
    info: 'Ampoules, néons',
    recycled: 'Récupération métaux, verre'
  },
  general: { 
    name: 'Incinérable', 
    emoji: '🗑️', 
    color: 'bg-black', 
    info: 'Déchets non recyclables',
    recycled: 'Valorisation énergétique'
  },
};

// Déchets par zone - BEAUCOUP PLUS VARIÉS
export const SWISS_WASTE_ITEMS = {
  kitchen: [
    { name: 'Épluchures de pommes de terre', emoji: '🥔', bin: 'organic' },
    { name: 'Cartons de livraison', emoji: '📦', bin: 'paper' },
    { name: 'Films plastiques alimentaires', emoji: '🎁', bin: 'plastic' },
    { name: 'Bouteilles en verre', emoji: '🍾', bin: 'glass' },
    { name: 'Canettes aluminium', emoji: '🥫', bin: 'aluminum' },
    { name: 'Restes de légumes', emoji: '🥬', bin: 'organic' },
    { name: 'Emballages carton', emoji: '📦', bin: 'paper' },
    { name: 'Bouteilles PET', emoji: '🧴', bin: 'plastic' },
    { name: 'Marc de café', emoji: '☕', bin: 'organic' },
    { name: 'Huile de friture', emoji: '🛢️', bin: 'oils' },
    { name: 'Bocaux en verre', emoji: '🫙', bin: 'glass' },
    { name: 'Barquettes aluminium', emoji: '🥘', bin: 'aluminum' },
    { name: 'Sachets plastiques', emoji: '👜', bin: 'plastic' },
    { name: 'Coquilles d\'œufs', emoji: '🥚', bin: 'organic' },
    { name: 'Boîtes conserves', emoji: '🥫', bin: 'aluminum' },
  ],
  
  restaurant: [
    { name: 'Bouteilles de vin', emoji: '🍷', bin: 'glass' },
    { name: 'Canettes de soda', emoji: '🥤', bin: 'aluminum' },
    { name: 'Serviettes en papier', emoji: '🧻', bin: 'paper' },
    { name: 'Restes de repas', emoji: '🍽️', bin: 'organic' },
    { name: 'Bouteilles eau PET', emoji: '💧', bin: 'plastic' },
    { name: 'Emballages carton', emoji: '📦', bin: 'paper' },
    { name: 'Capsules café', emoji: '☕', bin: 'aluminum' },
    { name: 'Nappes papier', emoji: '🧻', bin: 'paper' },
    { name: 'Pots de yaourt', emoji: '🥛', bin: 'plastic' },
    { name: 'Bouteilles champagne', emoji: '🍾', bin: 'glass' },
    { name: 'Canettes bière', emoji: '🍺', bin: 'aluminum' },
    { name: 'Pain rassis', emoji: '🍞', bin: 'organic' },
    { name: 'Couvercles plastique', emoji: '🔴', bin: 'plastic' },
    { name: 'Sets de table papier', emoji: '📄', bin: 'paper' },
  ],
  
  rooms: [
    { name: 'Bouteilles d\'eau PET', emoji: '💧', bin: 'plastic' },
    { name: 'Journaux', emoji: '📰', bin: 'paper' },
    { name: 'Emballages snacks', emoji: '🍿', bin: 'general' },
    { name: 'Piles télécommande', emoji: '🔋', bin: 'batteries' },
    { name: 'Ampoules grillées', emoji: '💡', bin: 'bulbs' },
    { name: 'Brochures touristiques', emoji: '📖', bin: 'paper' },
    { name: 'Bouteilles minibar', emoji: '🍾', bin: 'glass' },
    { name: 'Canettes minibar', emoji: '🥫', bin: 'aluminum' },
    { name: 'Mouchoirs en papier', emoji: '🧻', bin: 'paper' },
    { name: 'Sachets thé', emoji: '🍵', bin: 'organic' },
    { name: 'Emballages biscuits', emoji: '🍪', bin: 'plastic' },
    { name: 'Magazines', emoji: '📚', bin: 'paper' },
    { name: 'Flacons shampoing vides', emoji: '🧴', bin: 'plastic' },
  ],
  
  pool: [
    { name: 'Bouteilles crème solaire', emoji: '🧴', bin: 'plastic' },
    { name: 'Canettes de boisson', emoji: '🥤', bin: 'aluminum' },
    { name: 'Gobelets en plastique', emoji: '🥤', bin: 'plastic' },
    { name: 'Serviettes en papier', emoji: '🧻', bin: 'paper' },
    { name: 'Emballages glaces', emoji: '🍦', bin: 'plastic' },
    { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic' },
    { name: 'Pailles plastique', emoji: '🥤', bin: 'plastic' },
    { name: 'Capsules café', emoji: '☕', bin: 'aluminum' },
  ],
  
  beach: [
    { name: 'Bouteilles plastique', emoji: '🧴', bin: 'plastic' },
    { name: 'Canettes aluminium', emoji: '🥫', bin: 'aluminum' },
    { name: 'Filet de pêche usé', emoji: '🎣', bin: 'plastic' },
    { name: 'Emballages snacks', emoji: '🍿', bin: 'plastic' },
    { name: 'Bouteilles verre', emoji: '🍾', bin: 'glass' },
    { name: 'Journaux mouillés', emoji: '📰', bin: 'paper' },
    { name: 'Bouchons plastique', emoji: '🔴', bin: 'plastic' },
    { name: 'Débris algues', emoji: '🌿', bin: 'organic' },
  ],
  
  shop: [
    { name: 'Cartons livraison', emoji: '📦', bin: 'paper' },
    { name: 'Films plastiques', emoji: '🎁', bin: 'plastic' },
    { name: 'Emballages souvenirs', emoji: '🎁', bin: 'plastic' },
    { name: 'Piles vendues', emoji: '🔋', bin: 'batteries' },
    { name: 'Ampoules cassées', emoji: '💡', bin: 'bulbs' },
    { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic' },
    { name: 'Canettes boissons', emoji: '🥤', bin: 'aluminum' },
    { name: 'Prospectus', emoji: '📄', bin: 'paper' },
    { name: 'Sachets papier', emoji: '👜', bin: 'paper' },
    { name: 'Bocaux verre', emoji: '🫙', bin: 'glass' },
  ],
  
  marina: [
    { name: 'Cordages usés', emoji: '🪢', bin: 'plastic' },
    { name: 'Filets de pêche', emoji: '🎣', bin: 'plastic' },
    { name: 'Bouées plastique cassées', emoji: '🛟', bin: 'plastic' },
    { name: 'Huile moteur usée', emoji: '🛢️', bin: 'oils' },
    { name: 'Canettes aluminium', emoji: '🥫', bin: 'aluminum' },
    { name: 'Bouteilles verre', emoji: '🍾', bin: 'glass' },
    { name: 'Câbles électriques', emoji: '🔌', bin: 'general' },
    { name: 'Batteries usagées', emoji: '🔋', bin: 'batteries' },
    { name: 'Bidons plastique', emoji: '🧴', bin: 'plastic' },
  ],
  
  parking: [
    { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic' },
    { name: 'Journaux', emoji: '📰', bin: 'paper' },
    { name: 'Canettes boissons', emoji: '🥤', bin: 'aluminum' },
    { name: 'Emballages fast-food', emoji: '🍔', bin: 'general' },
    { name: 'Piles usagées', emoji: '🔋', bin: 'batteries' },
    { name: 'Huile moteur', emoji: '🛢️', bin: 'oils' },
    { name: 'Ampoules voiture', emoji: '💡', bin: 'bulbs' },
    { name: 'Cartons', emoji: '📦', bin: 'paper' },
  ],
  
  reception: [
    { name: 'Papiers bureau', emoji: '📄', bin: 'paper' },
    { name: 'Enveloppes', emoji: '✉️', bin: 'paper' },
    { name: 'Cartons colis', emoji: '📦', bin: 'paper' },
    { name: 'Piles calculatrices', emoji: '🔋', bin: 'batteries' },
    { name: 'Ampoules bureau', emoji: '💡', bin: 'bulbs' },
    { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic' },
    { name: 'Capsules café', emoji: '☕', bin: 'aluminum' },
    { name: 'Magazines', emoji: '📚', bin: 'paper' },
  ],
};

export const SPECIAL_WASTE_CENTERS = [
  { 
    name: 'Centre Plastiques & PET', 
    type: 'plastic', 
    icon: '♻️', 
    location: 'Parc éco-industriel',
    description: 'Recyclage des plastiques, cordages, filets de pêche',
    products: 'T-shirts, sacs, porte-monnaies, fibres textiles, palettes'
  },
  { 
    name: 'Centre Papier-Carton', 
    type: 'paper', 
    icon: '📄', 
    location: 'Zone industrielle Nord',
    description: 'Papeteries suisses',
    products: 'Papier graphique, nouveaux cartons et emballages'
  },
  { 
    name: 'Verrerie de recyclage', 
    type: 'glass', 
    icon: '🏭', 
    location: 'Zone artisanale Sud',
    description: 'Verreries suisses',
    products: 'Nouvelles bouteilles et bocaux en verre'
  },
  { 
    name: 'Centre de compostage', 
    type: 'organic', 
    icon: '🌱', 
    location: 'Ferme bio régionale',
    description: 'Méthanisation et compostage communal',
    products: 'Biogaz pour chauffage, compost, engrais naturel'
  },
  { 
    name: 'Fonderie IGORA', 
    type: 'aluminum', 
    icon: '🔥', 
    location: 'Zone industrielle Est',
    description: 'Recyclage aluminium et fer blanc',
    products: 'Aluminium secondaire, vélos, canettes, pièces automobiles'
  },
  { 
    name: 'Centre Biodiesel', 
    type: 'oils', 
    icon: '⚡', 
    location: 'Centre énergétique',
    description: 'Transformation huiles en biocarburant',
    products: 'Biodiesel pour véhicules et chauffage'
  },
  { 
    name: 'Centre Piles & Batteries', 
    type: 'batteries', 
    icon: '🔋', 
    location: 'Centre cantonal agréé',
    description: 'Traitement sécurisé des piles et batteries',
    products: 'Récupération métaux précieux, neutralisation'
  },
  { 
    name: 'Centre Ampoules & Néons', 
    type: 'bulbs', 
    icon: '💡', 
    location: 'Centre cantonal agréé',
    description: 'Recyclage ampoules et tubes fluorescents',
    products: 'Récupération verre et métaux, neutralisation mercure'
  },
  { 
    name: 'Incinérateur valorisation', 
    type: 'general', 
    icon: '⚡', 
    location: 'Centre énergétique',
    description: 'Valorisation énergétique des déchets',
    products: 'Électricité et chauffage urbain'
  },
];