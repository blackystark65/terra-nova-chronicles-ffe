// Données de la micro-ferme

export const ZONES_FERME = {
  milpa: {
    name: 'Champ Milpa',
    emoji: '🌽',
    description: 'Association maïs, haricot, courge',
    color: 'from-amber-500 to-orange-500',
    actions: ['semer', 'arroser', 'recolter', 'observer'],
    plantes_principales: ['Maïs', 'Haricot grimpant', 'Courge']
  },
  permaculture: {
    name: 'Permaculture',
    emoji: '🌿',
    description: 'Design permaculturel et mandala',
    color: 'from-lime-500 to-green-600',
    actions: ['designer', 'planter', 'observer', 'recolter'],
    plantes_principales: ['Légumes perpétuels', 'Aromatiques', 'Fleurs']
  },
  pepiniere: {
    name: 'Pépinière / Serre',
    emoji: '🌱',
    description: 'Serre pour semis et plantons',
    color: 'from-cyan-500 to-blue-500',
    actions: ['semer', 'repiquer', 'arroser', 'surveiller'],
    plantes_principales: ['Semis', 'Plantons', 'Jeunes plants']
  },
  centre_formation: {
    name: 'Centre de Formation',
    emoji: '🎓',
    description: 'Inscription et formation des élèves',
    color: 'from-indigo-500 to-purple-600',
    actions: ['inscrire', 'former', 'choisir_poste', 'rejoindre_classe'],
    plantes_principales: []
  },
  jouale: {
    name: 'Jouale',
    emoji: '🍇',
    description: 'Arbres fruitiers, vignes, maraîchage',
    color: 'from-purple-500 to-pink-500',
    actions: ['tailler', 'guider_vigne', 'planter_legumes', 'recolter'],
    plantes_principales: ['Vigne', 'Pommier', 'Poirier', 'Laitue', 'Tomate']
  },
  bocage: {
    name: 'Bocage',
    emoji: '🌳',
    description: 'Haies champêtres et biodiversité',
    color: 'from-green-600 to-emerald-600',
    actions: ['planter_haie', 'recolter_baies', 'observer_faune', 'couper_bois'],
    plantes_principales: ['Noisetier', 'Sureau', 'Aubépine', 'Cornouiller']
  },
  foret_jardin: {
    name: 'Forêt-Jardin',
    emoji: '🌲',
    description: 'Écosystème forestier comestible',
    color: 'from-green-700 to-teal-700',
    actions: ['planter_etages', 'recolter_fruits', 'observer', 'mulcher'],
    plantes_principales: ['Châtaignier', 'Noisetier', 'Framboisier', 'Oseille', 'Champignons']
  },
  boulangerie: {
    name: 'Boulangerie',
    emoji: '🥖',
    description: 'Transformation du blé en pain',
    color: 'from-yellow-600 to-amber-600',
    actions: ['moudre', 'petrir', 'cuire', 'vendre'],
    ressources_necessaires: ['Blé', 'Bois de chauffage']
  },
  epicerie: {
    name: 'Épicerie',
    emoji: '🏪',
    description: 'Vente des produits de la ferme',
    color: 'from-blue-500 to-indigo-500',
    actions: ['fixer_prix', 'vendre', 'preparer_paniers', 'gerer_stock'],
    produits_vendus: 'Tous les produits de la ferme'
  },
  ferme_pedagogique: {
    name: 'Ferme Pédagogique',
    emoji: '🐄',
    description: 'Élevage et pâturage',
    color: 'from-brown-500 to-amber-700',
    actions: ['deplacer_animaux', 'traire', 'ramasser_oeufs', 'nourrir'],
    animaux: ['Vaches', 'Poules', 'Chèvres']
  },
  compost: {
    name: 'Composterie',
    emoji: '♻️',
    description: 'Transformation en fertilité',
    color: 'from-emerald-700 to-green-800',
    actions: ['ajouter_dechets', 'retourner', 'recolter_compost', 'analyser'],
    produits: ['Compost mûr', 'Thé de compost']
  }
};

export const ROLES_FERME = [
  {
    id: 'maraicher',
    name: 'Maraîcher·ère',
    emoji: '👨‍🌾',
    description: 'Cultive les légumes dans la Milpa et la Jouale',
    zones: ['milpa', 'jouale', 'compost'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'arboriste',
    name: 'Arboriste',
    emoji: '🌳',
    description: 'Soigne les arbres fruitiers et les haies',
    zones: ['jouale', 'bocage', 'foret_jardin'],
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'boulanger',
    name: 'Boulanger·ère',
    emoji: '🥖',
    description: 'Transforme le blé en pain',
    zones: ['boulangerie', 'epicerie'],
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'eleveur',
    name: 'Éleveur·se',
    emoji: '🐄',
    description: 'Prend soin des animaux',
    zones: ['ferme_pedagogique', 'bocage', 'compost'],
    color: 'from-brown-500 to-amber-700'
  },
  {
    id: 'epicier',
    name: 'Épicier·ère',
    emoji: '🏪',
    description: 'Gère la vente et les paniers',
    zones: ['epicerie', 'boulangerie'],
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'jardinier_foret',
    name: 'Jardinier·ère Forestier',
    emoji: '🌲',
    description: 'Développe la forêt comestible',
    zones: ['foret_jardin', 'bocage', 'compost'],
    color: 'from-green-700 to-emerald-800'
  }
];

export const SCHEDULES_FERME = {
  maraicher: [
    { hour: 7, zone: 'milpa', duration: 180, label: 'Semer et entretenir la Milpa' },
    { hour: 10, zone: 'jouale', duration: 180, label: 'Maraîchage sous les arbres' },
    { hour: 13, zone: 'compost', duration: 120, label: 'Apporter les déchets verts' },
    { hour: 15, zone: 'epicerie', duration: 120, label: 'Livrer les récoltes' }
  ],
  arboriste: [
    { hour: 8, zone: 'jouale', duration: 180, label: 'Tailler les fruitiers' },
    { hour: 11, zone: 'bocage', duration: 180, label: 'Entretenir les haies' },
    { hour: 14, zone: 'foret_jardin', duration: 180, label: 'Planter en strates' }
  ],
  boulanger: [
    { hour: 6, zone: 'boulangerie', duration: 120, label: 'Préparer le four' },
    { hour: 8, zone: 'boulangerie', duration: 180, label: 'Pétrir et cuire' },
    { hour: 11, zone: 'epicerie', duration: 120, label: 'Livrer le pain' },
    { hour: 13, zone: 'milpa', duration: 120, label: 'Récolter le blé (saison)' }
  ],
  eleveur: [
    { hour: 7, zone: 'ferme_pedagogique', duration: 120, label: 'Traire et nourrir' },
    { hour: 9, zone: 'bocage', duration: 180, label: 'Déplacer au pâturage' },
    { hour: 12, zone: 'compost', duration: 120, label: 'Gérer le fumier' },
    { hour: 14, zone: 'ferme_pedagogique', duration: 120, label: 'Ramasser les œufs' }
  ],
  epicier: [
    { hour: 8, zone: 'epicerie', duration: 180, label: 'Réceptionner les produits' },
    { hour: 11, zone: 'epicerie', duration: 180, label: 'Vendre aux clients' },
    { hour: 14, zone: 'boulangerie', duration: 120, label: 'Récupérer le pain' },
    { hour: 16, zone: 'epicerie', duration: 120, label: 'Préparer les paniers' }
  ],
  jardinier_foret: [
    { hour: 8, zone: 'foret_jardin', duration: 180, label: 'Planter en strates' },
    { hour: 11, zone: 'bocage', duration: 180, label: 'Enrichir les haies' },
    { hour: 14, zone: 'compost', duration: 120, label: 'Mulcher et fertiliser' }
  ]
};

export const ZONE_PAGES = {
  centre_formation: 'FermeCentreFormation',
  milpa: 'FermeMilpa',
  permaculture: 'FermePermaculture',
  pepiniere: 'FermePepiniere',
  jouale: 'FermeJouale',
  bocage: 'FermeBocage',
  foret_jardin: 'FermeForetJardin',
  boulangerie: 'FermeBoulangerie',
  epicerie: 'FermeEpicerie',
  ferme_pedagogique: 'FermePedagogique',
  compost: 'FermeCompost'
};