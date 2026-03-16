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

// Déchets par zone - TRÈS VARIÉS
export const SWISS_WASTE_ITEMS = {
  kitchen: [
    // Organic
    { name: 'Épluchures de pommes de terre', emoji: '🥔', bin: 'organic' },
    { name: 'Restes de légumes', emoji: '🥬', bin: 'organic' },
    { name: 'Marc de café', emoji: '☕', bin: 'organic' },
    { name: 'Coquilles d\'œufs', emoji: '🥚', bin: 'organic' },
    { name: 'Pelures d\'oranges', emoji: '🍊', bin: 'organic' },
    { name: 'Restes de fruits', emoji: '🍎', bin: 'organic' },
    { name: 'Sachets de thé usés', emoji: '🍵', bin: 'organic' },
    { name: 'Noyaux d\'avocat', emoji: '🥑', bin: 'organic' },
    { name: 'Épluchures de carottes', emoji: '🥕', bin: 'organic' },
    { name: 'Fanes de légumes', emoji: '🌿', bin: 'organic' },
    { name: 'Restes de pain', emoji: '🍞', bin: 'organic' },
    { name: 'Coquilles de moules', emoji: '🦪', bin: 'organic' },
    // Paper
    { name: 'Cartons de livraison', emoji: '📦', bin: 'paper' },
    { name: 'Emballages carton céréales', emoji: '🥣', bin: 'paper' },
    { name: 'Sacs en papier kraft', emoji: '🛍️', bin: 'paper' },
    { name: 'Rouleaux essuie-tout', emoji: '🧻', bin: 'paper' },
    { name: 'Emballage carton œufs', emoji: '🥚', bin: 'paper' },
    // Plastic
    { name: 'Films plastiques alimentaires', emoji: '🎁', bin: 'plastic' },
    { name: 'Bouteilles PET', emoji: '🧴', bin: 'plastic' },
    { name: 'Sachets plastiques', emoji: '👜', bin: 'plastic' },
    { name: 'Barquettes plastique viande', emoji: '🥩', bin: 'plastic' },
    { name: 'Pots de crème fraîche', emoji: '🥛', bin: 'plastic' },
    { name: 'Couvercles plastique', emoji: '🔴', bin: 'plastic' },
    { name: 'Filet à légumes plastique', emoji: '🧅', bin: 'plastic' },
    // Glass
    { name: 'Bouteilles en verre', emoji: '🍾', bin: 'glass' },
    { name: 'Bocaux en verre confiture', emoji: '🫙', bin: 'glass' },
    { name: 'Bouteille d\'huile d\'olive vide', emoji: '🫒', bin: 'glass' },
    { name: 'Bocal cornichons vide', emoji: '🥒', bin: 'glass' },
    { name: 'Carafe en verre cassée', emoji: '🏺', bin: 'glass' },
    // Aluminum
    { name: 'Canettes aluminium', emoji: '🥫', bin: 'aluminum' },
    { name: 'Barquettes aluminium', emoji: '🥘', bin: 'aluminum' },
    { name: 'Boîtes conserves', emoji: '🥫', bin: 'aluminum' },
    { name: 'Capsules de café aluminium', emoji: '☕', bin: 'aluminum' },
    { name: 'Papier aluminium froissé', emoji: '🥈', bin: 'aluminum' },
    { name: 'Canette de jus de fruit', emoji: '🍹', bin: 'aluminum' },
    // Oils
    { name: 'Huile de friture usée', emoji: '🛢️', bin: 'oils' },
    { name: 'Huile d\'olive périmée', emoji: '🫒', bin: 'oils' },
    { name: 'Graisse de cuisson', emoji: '🧈', bin: 'oils' },
    // Batteries
    { name: 'Piles de balance cuisine', emoji: '🔋', bin: 'batteries' },
    { name: 'Piles de minuterie', emoji: '⏱️', bin: 'batteries' },
  ],
  
  restaurant: [
    // Glass
    { name: 'Bouteilles de vin rouge', emoji: '🍷', bin: 'glass' },
    { name: 'Bouteilles de vin blanc', emoji: '🥂', bin: 'glass' },
    { name: 'Bouteilles de champagne', emoji: '🍾', bin: 'glass' },
    { name: 'Bouteilles d\'eau minérale', emoji: '🫗', bin: 'glass' },
    { name: 'Bocaux de condiments vides', emoji: '🫙', bin: 'glass' },
    { name: 'Bouteilles de sauce verre', emoji: '🍶', bin: 'glass' },
    // Aluminum
    { name: 'Canettes de soda', emoji: '🥤', bin: 'aluminum' },
    { name: 'Capsules café', emoji: '☕', bin: 'aluminum' },
    { name: 'Canettes bière', emoji: '🍺', bin: 'aluminum' },
    { name: 'Boîtes de conserve sauce', emoji: '🥫', bin: 'aluminum' },
    { name: 'Canette de cidre', emoji: '🍏', bin: 'aluminum' },
    { name: 'Barquettes traiteur aluminium', emoji: '🥘', bin: 'aluminum' },
    // Paper
    { name: 'Serviettes en papier', emoji: '🧻', bin: 'paper' },
    { name: 'Nappes papier', emoji: '🧻', bin: 'paper' },
    { name: 'Sets de table papier', emoji: '📄', bin: 'paper' },
    { name: 'Emballages carton livraison', emoji: '📦', bin: 'paper' },
    { name: 'Menus papier usés', emoji: '📋', bin: 'paper' },
    { name: 'Boîtes pizza carton', emoji: '🍕', bin: 'paper' },
    { name: 'Sachets papier pain', emoji: '🥖', bin: 'paper' },
    // Organic
    { name: 'Restes de repas', emoji: '🍽️', bin: 'organic' },
    { name: 'Pain rassis', emoji: '🍞', bin: 'organic' },
    { name: 'Épluchures de fruits', emoji: '🍊', bin: 'organic' },
    { name: 'Restes de salade', emoji: '🥗', bin: 'organic' },
    { name: 'Marc de café restaurant', emoji: '☕', bin: 'organic' },
    { name: 'Coquilles d\'huîtres', emoji: '🦪', bin: 'organic' },
    { name: 'Sachets de thé', emoji: '🍵', bin: 'organic' },
    // Plastic
    { name: 'Bouteilles eau PET', emoji: '💧', bin: 'plastic' },
    { name: 'Pots de yaourt', emoji: '🥛', bin: 'plastic' },
    { name: 'Couvercles plastique', emoji: '🔴', bin: 'plastic' },
    { name: 'Pailles plastique', emoji: '🥤', bin: 'plastic' },
    { name: 'Sachets condiments plastique', emoji: '🟡', bin: 'plastic' },
    { name: 'Emballage film alimentaire', emoji: '🎁', bin: 'plastic' },
    // Oils
    { name: 'Huile friture restaurant', emoji: '🛢️', bin: 'oils' },
    { name: 'Graisse de viande', emoji: '🥩', bin: 'oils' },
  ],
  
  rooms: [
    // Plastic
    { name: 'Bouteilles d\'eau PET', emoji: '💧', bin: 'plastic' },
    { name: 'Emballages snacks', emoji: '🍿', bin: 'plastic' },
    { name: 'Emballages biscuits', emoji: '🍪', bin: 'plastic' },
    { name: 'Flacons shampoing vides', emoji: '🧴', bin: 'plastic' },
    { name: 'Flacon gel douche vide', emoji: '🚿', bin: 'plastic' },
    { name: 'Emballage masque beauté', emoji: '💆', bin: 'plastic' },
    { name: 'Pot de crème vide', emoji: '🧴', bin: 'plastic' },
    { name: 'Bouteille de soda minibar', emoji: '🥤', bin: 'plastic' },
    { name: 'Emballage plastique chips', emoji: '🥔', bin: 'plastic' },
    // Paper
    { name: 'Journaux', emoji: '📰', bin: 'paper' },
    { name: 'Brochures touristiques', emoji: '📖', bin: 'paper' },
    { name: 'Magazines', emoji: '📚', bin: 'paper' },
    { name: 'Mouchoirs en papier', emoji: '🧻', bin: 'paper' },
    { name: 'Emballage carton minibar', emoji: '📦', bin: 'paper' },
    { name: 'Papiers d\'emballage cadeaux', emoji: '🎁', bin: 'paper' },
    { name: 'Enveloppes de correspondance', emoji: '✉️', bin: 'paper' },
    { name: 'Tickets de caisse', emoji: '🧾', bin: 'paper' },
    // Batteries
    { name: 'Piles télécommande', emoji: '🔋', bin: 'batteries' },
    { name: 'Piles réveil', emoji: '⏰', bin: 'batteries' },
    { name: 'Piles manette jeu vidéo', emoji: '🎮', bin: 'batteries' },
    { name: 'Pile de balance', emoji: '⚖️', bin: 'batteries' },
    { name: 'Piles de lampe de poche', emoji: '🔦', bin: 'batteries' },
    // Bulbs
    { name: 'Ampoule grillée', emoji: '💡', bin: 'bulbs' },
    { name: 'Ampoule LED défectueuse', emoji: '💡', bin: 'bulbs' },
    { name: 'Tube néon de salle de bain', emoji: '🔆', bin: 'bulbs' },
    // Glass
    { name: 'Bouteilles minibar verre', emoji: '🍾', bin: 'glass' },
    { name: 'Verre cassé', emoji: '🥃', bin: 'glass' },
    { name: 'Bouteille de parfum vide', emoji: '🧴', bin: 'glass' },
    // Aluminum
    { name: 'Canettes minibar', emoji: '🥫', bin: 'aluminum' },
    { name: 'Canette énergisant', emoji: '⚡', bin: 'aluminum' },
    // Organic
    { name: 'Sachets thé', emoji: '🍵', bin: 'organic' },
    { name: 'Restes de fruits chambre', emoji: '🍎', bin: 'organic' },
    { name: 'Capsules café usées (compostables)', emoji: '☕', bin: 'organic' },
    // General
    { name: 'Emballage plastique chips métallisé', emoji: '🍿', bin: 'general' },
    { name: 'Coton-tiges', emoji: '🩺', bin: 'general' },
    { name: 'Rasoir jetable usé', emoji: '🪒', bin: 'general' },
  ],
  
  pool: [
    // Plastic
    { name: 'Bouteilles crème solaire', emoji: '🧴', bin: 'plastic' },
    { name: 'Gobelets en plastique', emoji: '🥤', bin: 'plastic' },
    { name: 'Emballages glaces', emoji: '🍦', bin: 'plastic' },
    { name: 'Bouteilles eau PET', emoji: '💧', bin: 'plastic' },
    { name: 'Pailles plastique', emoji: '🥤', bin: 'plastic' },
    { name: 'Emballage barres énergétiques', emoji: '🍫', bin: 'plastic' },
    { name: 'Bouchons plastique', emoji: '🔵', bin: 'plastic' },
    { name: 'Pot de crème après-soleil', emoji: '🧴', bin: 'plastic' },
    { name: 'Emballage gel hydroalcoolique', emoji: '💊', bin: 'plastic' },
    { name: 'Bouteille shampoing piscine', emoji: '🚿', bin: 'plastic' },
    // Aluminum
    { name: 'Canettes de boisson', emoji: '🥤', bin: 'aluminum' },
    { name: 'Capsules café bar piscine', emoji: '☕', bin: 'aluminum' },
    { name: 'Canettes jus de fruit', emoji: '🍹', bin: 'aluminum' },
    { name: 'Canettes bière pression', emoji: '🍺', bin: 'aluminum' },
    // Paper
    { name: 'Serviettes en papier bar', emoji: '🧻', bin: 'paper' },
    { name: 'Menus plastifiés déchirés', emoji: '📋', bin: 'paper' },
    { name: 'Journaux mouillés', emoji: '📰', bin: 'paper' },
    // Organic
    { name: 'Restes de fruits tropicaux', emoji: '🍉', bin: 'organic' },
    { name: 'Noyaux d\'olive', emoji: '🫒', bin: 'organic' },
    { name: 'Épluchures de citron', emoji: '🍋', bin: 'organic' },
    // Glass
    { name: 'Bouteilles de cocktail verre', emoji: '🍸', bin: 'glass' },
    { name: 'Verre à cocktail brisé', emoji: '🥃', bin: 'glass' },
    // Batteries
    { name: 'Piles enceinte bluetooth', emoji: '🔋', bin: 'batteries' },
    { name: 'Batterie montre connectée', emoji: '⌚', bin: 'batteries' },
    // Bulbs
    { name: 'Ampoule guirlande grillée', emoji: '💡', bin: 'bulbs' },
    // General
    { name: 'Élastiques cheveux', emoji: '💊', bin: 'general' },
    { name: 'Pansements usés', emoji: '🩹', bin: 'general' },
  ],
  
  beach: [
    // Plastic
    { name: 'Bouteilles plastique', emoji: '🧴', bin: 'plastic' },
    { name: 'Filet de pêche usé', emoji: '🎣', bin: 'plastic' },
    { name: 'Emballages snacks', emoji: '🍿', bin: 'plastic' },
    { name: 'Bouchons plastique', emoji: '🔴', bin: 'plastic' },
    { name: 'Pailles plastique', emoji: '🥤', bin: 'plastic' },
    { name: 'Sac plastique', emoji: '👜', bin: 'plastic' },
    { name: 'Jouet plastique cassé', emoji: '🧸', bin: 'plastic' },
    { name: 'Bouée plastique trouée', emoji: '🛟', bin: 'plastic' },
    { name: 'Flotteur de pêche plastique', emoji: '🎣', bin: 'plastic' },
    { name: 'Emballage crème solaire', emoji: '☀️', bin: 'plastic' },
    // Aluminum
    { name: 'Canettes aluminium', emoji: '🥫', bin: 'aluminum' },
    { name: 'Canettes bière plage', emoji: '🍺', bin: 'aluminum' },
    { name: 'Canettes jus plage', emoji: '🍹', bin: 'aluminum' },
    // Glass
    { name: 'Bouteilles verre', emoji: '🍾', bin: 'glass' },
    { name: 'Bouteilles bière verre', emoji: '🍻', bin: 'glass' },
    { name: 'Tesson de verre', emoji: '🏺', bin: 'glass' },
    // Paper
    { name: 'Journaux mouillés', emoji: '📰', bin: 'paper' },
    { name: 'Cartons boisson ramollis', emoji: '📦', bin: 'paper' },
    { name: 'Gobelets carton', emoji: '☕', bin: 'paper' },
    // Organic
    { name: 'Débris algues', emoji: '🌿', bin: 'organic' },
    { name: 'Restes de repas plage', emoji: '🥪', bin: 'organic' },
    { name: 'Noyaux de pêche', emoji: '🍑', bin: 'organic' },
    // Batteries
    { name: 'Piles radio plage', emoji: '🔋', bin: 'batteries' },
    { name: 'Batterie appareil photo', emoji: '📷', bin: 'batteries' },
    // Bulbs
    { name: 'Ampoule guirlande plage', emoji: '💡', bin: 'bulbs' },
    // General
    { name: 'Mégots de cigarette', emoji: '🚬', bin: 'general' },
    { name: 'Coton-tiges plastique', emoji: '🩺', bin: 'general' },
  ],
  
  shop: [
    // Paper
    { name: 'Cartons livraison', emoji: '📦', bin: 'paper' },
    { name: 'Prospectus publicitaires', emoji: '📄', bin: 'paper' },
    { name: 'Sachets papier', emoji: '🛍️', bin: 'paper' },
    { name: 'Étiquettes papier', emoji: '🏷️', bin: 'paper' },
    { name: 'Journaux invendus', emoji: '📰', bin: 'paper' },
    { name: 'Emballages carton produits', emoji: '🎁', bin: 'paper' },
    { name: 'Catalogues périmés', emoji: '📚', bin: 'paper' },
    // Plastic
    { name: 'Films plastiques emballage', emoji: '🎁', bin: 'plastic' },
    { name: 'Emballages souvenirs', emoji: '🧸', bin: 'plastic' },
    { name: 'Bouteilles eau vendues', emoji: '💧', bin: 'plastic' },
    { name: 'Sacs plastique transparents', emoji: '👜', bin: 'plastic' },
    { name: 'Blister plastique produits', emoji: '💊', bin: 'plastic' },
    // Batteries
    { name: 'Piles retournées/défectueuses', emoji: '🔋', bin: 'batteries' },
    { name: 'Batterie jouet défectueuse', emoji: '🎮', bin: 'batteries' },
    { name: 'Piles invendables', emoji: '🔌', bin: 'batteries' },
    // Bulbs
    { name: 'Ampoules cassées', emoji: '💡', bin: 'bulbs' },
    { name: 'Néon de vitrine grillé', emoji: '🔆', bin: 'bulbs' },
    { name: 'Ampoule LED retournée', emoji: '💡', bin: 'bulbs' },
    // Aluminum
    { name: 'Canettes boissons', emoji: '🥤', bin: 'aluminum' },
    { name: 'Capsules café machine', emoji: '☕', bin: 'aluminum' },
    { name: 'Boîtes conserves périmées', emoji: '🥫', bin: 'aluminum' },
    // Glass
    { name: 'Bocaux verre', emoji: '🫙', bin: 'glass' },
    { name: 'Bouteille parfum cassée', emoji: '🧴', bin: 'glass' },
    { name: 'Bouteilles boissons verre', emoji: '🍾', bin: 'glass' },
    // Organic
    { name: 'Fruits périmés invendus', emoji: '🍎', bin: 'organic' },
    { name: 'Fleurs fanées bouquet', emoji: '🌸', bin: 'organic' },
    // General
    { name: 'Stylos vides', emoji: '🖊️', bin: 'general' },
    { name: 'Ruban adhésif usé', emoji: '📎', bin: 'general' },
  ],
  
  marina: [
    // Plastic
    { name: 'Cordages usés', emoji: '🪢', bin: 'plastic' },
    { name: 'Filets de pêche', emoji: '🎣', bin: 'plastic' },
    { name: 'Bouées plastique cassées', emoji: '🛟', bin: 'plastic' },
    { name: 'Bidons plastique vides', emoji: '🧴', bin: 'plastic' },
    { name: 'Tuyaux plastique usés', emoji: '🔵', bin: 'plastic' },
    { name: 'Emballages matériel nautique', emoji: '⚓', bin: 'plastic' },
    // Oils
    { name: 'Huile moteur bateau usée', emoji: '🛢️', bin: 'oils' },
    { name: 'Liquide refroidissement usé', emoji: '🌡️', bin: 'oils' },
    { name: 'Graisse de winch', emoji: '⚙️', bin: 'oils' },
    { name: 'Huile hydraulique', emoji: '🔧', bin: 'oils' },
    // Batteries
    { name: 'Batteries usagées bateau', emoji: '🔋', bin: 'batteries' },
    { name: 'Batterie de démarrage', emoji: '⚡', bin: 'batteries' },
    { name: 'Piles GPS nautique', emoji: '🧭', bin: 'batteries' },
    // Aluminum
    { name: 'Canettes aluminium', emoji: '🥫', bin: 'aluminum' },
    { name: 'Pièces aluminium bateau', emoji: '⚓', bin: 'aluminum' },
    { name: 'Canettes bière équipage', emoji: '🍺', bin: 'aluminum' },
    // Glass
    { name: 'Bouteilles verre', emoji: '🍾', bin: 'glass' },
    { name: 'Instruments verre cassés', emoji: '🏺', bin: 'glass' },
    { name: 'Hublot verre cassé', emoji: '🔵', bin: 'glass' },
    // Paper
    { name: 'Cartes marines périmées', emoji: '🗺️', bin: 'paper' },
    { name: 'Journaux bord', emoji: '📰', bin: 'paper' },
    { name: 'Emballages carton pièces', emoji: '📦', bin: 'paper' },
    // General
    { name: 'Câbles électriques usés', emoji: '🔌', bin: 'general' },
    { name: 'Joints caoutchouc usés', emoji: '🔧', bin: 'general' },
    // Bulbs
    { name: 'Ampoule feu de navigation', emoji: '💡', bin: 'bulbs' },
    { name: 'Lampe projecteur bateau', emoji: '🔆', bin: 'bulbs' },
    // Organic
    { name: 'Restes repas équipage', emoji: '🍽️', bin: 'organic' },
    { name: 'Épluchures cuisine du bord', emoji: '🥕', bin: 'organic' },
  ],
  
  parking: [
    // Plastic
    { name: 'Bouteilles eau', emoji: '💧', bin: 'plastic' },
    { name: 'Gobelets café plastique', emoji: '☕', bin: 'plastic' },
    { name: 'Sacs plastique', emoji: '👜', bin: 'plastic' },
    { name: 'Emballages fast-food plastique', emoji: '🍟', bin: 'plastic' },
    // Paper
    { name: 'Journaux', emoji: '📰', bin: 'paper' },
    { name: 'Cartons', emoji: '📦', bin: 'paper' },
    { name: 'Tickets de parking', emoji: '🧾', bin: 'paper' },
    { name: 'Emballages fast-food carton', emoji: '🍔', bin: 'paper' },
    { name: 'Serviettes papier', emoji: '🧻', bin: 'paper' },
    // Aluminum
    { name: 'Canettes boissons', emoji: '🥤', bin: 'aluminum' },
    { name: 'Canettes bière', emoji: '🍺', bin: 'aluminum' },
    { name: 'Canettes énergisants', emoji: '⚡', bin: 'aluminum' },
    // Batteries
    { name: 'Piles usagées', emoji: '🔋', bin: 'batteries' },
    { name: 'Batterie téléphone usée', emoji: '📱', bin: 'batteries' },
    { name: 'Batterie véhicule électrique', emoji: '🚗', bin: 'batteries' },
    // Oils
    { name: 'Huile moteur vidange', emoji: '🛢️', bin: 'oils' },
    { name: 'Liquide lave-glace périmé', emoji: '🌊', bin: 'oils' },
    { name: 'Antigel usé', emoji: '❄️', bin: 'oils' },
    // Bulbs
    { name: 'Ampoules voiture grillées', emoji: '💡', bin: 'bulbs' },
    { name: 'LED phare défectueuse', emoji: '🔆', bin: 'bulbs' },
    // Glass
    { name: 'Bouteilles verre abandonnées', emoji: '🍾', bin: 'glass' },
    { name: 'Glace voiture cassée', emoji: '🏺', bin: 'glass' },
    // Organic
    { name: 'Restes repas voiture', emoji: '🥪', bin: 'organic' },
    { name: 'Pelures banane', emoji: '🍌', bin: 'organic' },
    // General
    { name: 'Mégots de cigarette', emoji: '🚬', bin: 'general' },
    { name: 'Masques jetables', emoji: '😷', bin: 'general' },
  ],
  
  reception: [
    // Paper
    { name: 'Papiers bureau imprimés', emoji: '📄', bin: 'paper' },
    { name: 'Enveloppes', emoji: '✉️', bin: 'paper' },
    { name: 'Cartons colis reçus', emoji: '📦', bin: 'paper' },
    { name: 'Magazines salle attente', emoji: '📚', bin: 'paper' },
    { name: 'Prospectus touristiques', emoji: '📋', bin: 'paper' },
    { name: 'Journaux du matin', emoji: '📰', bin: 'paper' },
    { name: 'Post-its usés', emoji: '🟨', bin: 'paper' },
    { name: 'Cahier de brouillon plein', emoji: '📓', bin: 'paper' },
    // Batteries
    { name: 'Piles calculatrices', emoji: '🔋', bin: 'batteries' },
    { name: 'Piles clavier sans fil', emoji: '⌨️', bin: 'batteries' },
    { name: 'Piles souris sans fil', emoji: '🖱️', bin: 'batteries' },
    { name: 'Batterie téléphone de bureau', emoji: '📞', bin: 'batteries' },
    // Bulbs
    { name: 'Ampoules bureau grillées', emoji: '💡', bin: 'bulbs' },
    { name: 'Néon plafonnier grillé', emoji: '🔆', bin: 'bulbs' },
    // Plastic
    { name: 'Bouteilles eau accueil', emoji: '💧', bin: 'plastic' },
    { name: 'Stylos plastique usés', emoji: '🖊️', bin: 'plastic' },
    { name: 'Emballages cadeaux plastique', emoji: '🎁', bin: 'plastic' },
    { name: 'Gobelets distributeur eau', emoji: '🥤', bin: 'plastic' },
    // Aluminum
    { name: 'Capsules café', emoji: '☕', bin: 'aluminum' },
    { name: 'Canettes machine à café', emoji: '🥤', bin: 'aluminum' },
    // Glass
    { name: 'Bouteilles eau minérale verre', emoji: '💧', bin: 'glass' },
    { name: 'Verre décoratif cassé', emoji: '🏺', bin: 'glass' },
    // Organic
    { name: 'Fleurs fanées réception', emoji: '🌷', bin: 'organic' },
    { name: 'Sachets thé machine', emoji: '🍵', bin: 'organic' },
    { name: 'Marc de café', emoji: '☕', bin: 'organic' },
    // Oils
    { name: 'Huile diffuseur ambiance', emoji: '🕯️', bin: 'oils' },
    // General
    { name: 'Stylos à bille vides', emoji: '🖋️', bin: 'general' },
    { name: 'Ruban adhésif rouleau vide', emoji: '📎', bin: 'general' },
    { name: 'Trombones rouillés', emoji: '📎', bin: 'general' },
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