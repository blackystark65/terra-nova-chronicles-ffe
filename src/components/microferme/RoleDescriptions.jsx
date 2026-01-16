// Cahiers des charges détaillés pour chaque poste de la micro-ferme

export const ROLE_DESCRIPTIONS = {
  maraicher: {
    title: 'Maraîcher·ère',
    emoji: '👨‍🌾',
    zones: ['Milpa', 'Jouale', 'Compost'],
    description: 'Tu es responsable de la production de légumes et du soin du sol.',
    
    tasks: [
      {
        title: '1. Réceptionner les plantons',
        details: 'Récupère les plantons produits dans la pépinière. Vérifie leur santé et leur taille avant de les planter.',
        icon: '🌱'
      },
      {
        title: '2. Planter dans les zones',
        details: 'Plante les plantons dans la Milpa (maïs, haricots, courges) et dans la Jouale (légumes sous les arbres fruitiers). Respecte les associations de plantes.',
        icon: '🌿'
      },
      {
        title: '3. Récolter les légumes',
        details: 'Récolte les légumes arrivés à maturité. Identifie le bon moment pour chaque espèce. Sois délicat pour ne pas abîmer les plantes.',
        icon: '🥕'
      },
      {
        title: '4. Entretenir les surfaces',
        details: 'Désherbe régulièrement, observe les plantes, identifie les maladies ou ravageurs.',
        icon: '🧹'
      },
      {
        title: '5. Pailler les chemins',
        details: 'Mets du bois broyé (BRF) dans les chemins pour limiter l\'herbe et conserver l\'humidité.',
        icon: '🪵'
      },
      {
        title: '6. Amender les buttes',
        details: 'Récupère les feuilles mortes de la Jouale pour amender et nourrir les buttes de permaculture. C\'est un apport précieux en matière organique.',
        icon: '🍂'
      },
      {
        title: '7. Livrer à l\'épicerie',
        details: 'Apporte tes récoltes à l\'épicerie pour qu\'elles soient vendues. Note les quantités.',
        icon: '📦'
      }
    ],
    
    competences: [
      'Connaître les associations de plantes',
      'Reconnaître les stades de maturité',
      'Gérer le cycle de vie des cultures',
      'Travailler avec les cycles naturels'
    ]
  },

  arboriste: {
    title: 'Arboriste',
    emoji: '🌳',
    zones: ['Jouale', 'Bocage', 'Forêt-Jardin'],
    description: 'Tu prends soin des arbres fruitiers, des haies et de la forêt comestible.',
    
    tasks: [
      {
        title: '1. Tailler les arbres fruitiers',
        details: 'Taille les pommiers, poiriers et autres fruitiers dans la Jouale. Élimine les branches mortes, aère le houppier pour laisser passer la lumière.',
        icon: '✂️'
      },
      {
        title: '2. Guider la vigne',
        details: 'Attache les sarments de vigne, guide leur croissance le long des supports.',
        icon: '🍇'
      },
      {
        title: '3. Planter des arbres',
        details: 'Plante de nouveaux arbres fruitiers ou forestiers selon les besoins de la ferme.',
        icon: '🌱'
      },
      {
        title: '4. Entretenir les haies',
        details: 'Taille et maintiens les haies champêtres du bocage. Elles abritent la biodiversité et protègent du vent.',
        icon: '🌿'
      },
      {
        title: '5. Récolter les fruits',
        details: 'Récolte les pommes, poires, baies sauvages. Livre-les à l\'épicerie.',
        icon: '🍎'
      },
      {
        title: '6. Développer la forêt-jardin',
        details: 'Plante en strates (arbres, arbustes, herbacées) pour créer un écosystème forestier comestible.',
        icon: '🌲'
      },
      {
        title: '7. Observer la biodiversité',
        details: 'Identifie les oiseaux, insectes et petits mammifères qui habitent les arbres et haies.',
        icon: '🦜'
      }
    ],
    
    competences: [
      'Connaître la taille des fruitiers',
      'Comprendre les strates forestières',
      'Identifier les espèces d\'arbres',
      'Travailler en hauteur en sécurité'
    ]
  },

  boulanger: {
    title: 'Boulanger·ère',
    emoji: '🥖',
    zones: ['Boulangerie', 'Épicerie'],
    description: 'Tu transformes le blé en pain, un aliment de base pour la communauté.',
    
    tasks: [
      {
        title: '1. Réceptionner le blé',
        details: 'Récupère le blé récolté dans la Milpa. Vérifie sa qualité et son taux d\'humidité.',
        icon: '🌾'
      },
      {
        title: '2. Moudre la farine',
        details: 'Utilise le moulin pour transformer le blé en farine. Obtiens différentes textures selon le pain voulu.',
        icon: '⚙️'
      },
      {
        title: '3. Préparer la pâte',
        details: 'Mélange la farine, l\'eau, le sel et le levain. Pétris la pâte jusqu\'à obtenir la bonne consistance.',
        icon: '🫳'
      },
      {
        title: '4. Laisser lever',
        details: 'Laisse la pâte reposer et fermenter. Le levain fait gonfler la pâte.',
        icon: '⏰'
      },
      {
        title: '5. Façonner les pains',
        details: 'Forme des baguettes, miches ou pains spéciaux selon les demandes.',
        icon: '🥖'
      },
      {
        title: '6. Cuire au four',
        details: 'Allume le four à bois (bois du bocage). Enfourne et surveille la cuisson.',
        icon: '🔥'
      },
      {
        title: '7. Livrer à l\'épicerie',
        details: 'Apporte le pain frais à l\'épicerie chaque matin.',
        icon: '🏪'
      }
    ],
    
    competences: [
      'Maîtriser les proportions',
      'Comprendre la fermentation',
      'Gérer la température du four',
      'Respecter les temps de repos'
    ]
  },

  eleveur: {
    title: 'Éleveur·se',
    emoji: '🐄',
    zones: ['Ferme Pédagogique', 'Bocage', 'Compost'],
    description: 'Tu prends soin des animaux et gères le pâturage tournant.',
    
    tasks: [
      {
        title: '1. Nourrir les animaux',
        details: 'Distribue le foin, les grains et l\'eau fraîche aux vaches, chèvres et poules.',
        icon: '🌾'
      },
      {
        title: '2. Traire les vaches et chèvres',
        details: 'Effectue la traite matin et soir. Sois doux et régulier.',
        icon: '🥛'
      },
      {
        title: '3. Ramasser les œufs',
        details: 'Collecte les œufs frais des poules chaque jour. Vérifie leur santé.',
        icon: '🥚'
      },
      {
        title: '4. Déplacer au pâturage',
        details: 'Pratique le pâturage tournant : déplace les animaux vers de nouvelles parcelles du bocage. Cela régénère l\'herbe et fertilise le sol naturellement.',
        icon: '🌱'
      },
      {
        title: '5. Surveiller la santé',
        details: 'Observe chaque animal quotidiennement. Détecte les signes de maladie ou de stress.',
        icon: '👁️'
      },
      {
        title: '6. Gérer le fumier',
        details: 'Collecte le fumier et apporte-le au compost. C\'est une ressource précieuse pour fertiliser les cultures.',
        icon: '♻️'
      },
      {
        title: '7. Livrer les produits',
        details: 'Apporte le lait, les œufs et les fromages à l\'épicerie.',
        icon: '📦'
      }
    ],
    
    competences: [
      'Connaître le comportement animal',
      'Pratiquer le pâturage tournant',
      'Identifier les maladies courantes',
      'Transformer le lait (optionnel)'
    ]
  },

  epicier: {
    title: 'Épicier·ère',
    emoji: '🏪',
    zones: ['Épicerie', 'Boulangerie'],
    description: 'Tu gères la vente des produits de la ferme et la relation avec les clients.',
    
    tasks: [
      {
        title: '1. Réceptionner les produits',
        details: 'Chaque matin, reçois les livraisons du maraîcher, de l\'arboriste, du boulanger et de l\'éleveur. Vérifie les quantités et la qualité.',
        icon: '📦'
      },
      {
        title: '2. Organiser l\'espace',
        details: 'Arrange les produits de manière attractive. Mets en avant les produits de saison.',
        icon: '🛒'
      },
      {
        title: '3. Fixer les prix',
        details: 'Détermine le prix de chaque produit en fonction du travail fourni, de la saison et de la demande.',
        icon: '💰'
      },
      {
        title: '4. Vendre aux clients',
        details: 'Accueille les clients, conseille-les, encaisse les ventes. Explique l\'origine des produits.',
        icon: '🤝'
      },
      {
        title: '5. Gérer les stocks',
        details: 'Note ce qui se vend bien ou moins bien. Ajuste les commandes aux autres postes.',
        icon: '📊'
      },
      {
        title: '6. Préparer les paniers',
        details: 'Compose des paniers hebdomadaires équilibrés pour les abonnés (légumes, fruits, pain, œufs, fromage).',
        icon: '🧺'
      },
      {
        title: '7. Communiquer',
        details: 'Informe les autres postes sur les besoins des clients et les tendances.',
        icon: '💬'
      }
    ],
    
    competences: [
      'Calculer rapidement',
      'Communiquer avec les clients',
      'Gérer un inventaire',
      'Comprendre l\'économie locale'
    ]
  },

  jardinier_foret: {
    title: 'Jardinier·ère Forestier',
    emoji: '🌲',
    zones: ['Forêt-Jardin', 'Bocage', 'Compost'],
    description: 'Tu crées et entretiens un écosystème forestier comestible et résilient.',
    
    tasks: [
      {
        title: '1. Planter en strates',
        details: 'Crée des strates de végétation : canopée (grands arbres), sous-bois (arbustes), herbacées, couvre-sol, racines, grimpantes. Chaque strate a sa fonction.',
        icon: '🌳'
      },
      {
        title: '2. Enrichir le sol',
        details: 'Apporte du compost, du BRF, des feuilles mortes. Nourris le sol pour qu\'il nourrisse les plantes.',
        icon: '🍂'
      },
      {
        title: '3. Mulcher',
        details: 'Couvre le sol de matière organique (paille, feuilles, bois broyé) pour conserver l\'humidité et empêcher les adventices.',
        icon: '🌾'
      },
      {
        title: '4. Récolter les fruits forestiers',
        details: 'Cueille les fruits des arbres, arbustes et plantes sauvages (châtaignes, noisettes, framboises, oseille).',
        icon: '🌰'
      },
      {
        title: '5. Cultiver les champignons',
        details: 'Inocule les bûches avec des spores de champignons comestibles (pleurotes, shiitakes).',
        icon: '🍄'
      },
      {
        title: '6. Observer l\'écosystème',
        details: 'Identifie les interactions entre plantes, champignons, insectes et animaux. La forêt-jardin est un milieu vivant.',
        icon: '🔍'
      },
      {
        title: '7. Connecter avec le bocage',
        details: 'Enrichis les haies du bocage avec des espèces comestibles. Crée des corridors écologiques.',
        icon: '🌿'
      }
    ],
    
    competences: [
      'Comprendre les strates forestières',
      'Connaître les plantes sauvages',
      'Identifier les champignons',
      'Penser en écosystème'
    ]
  }
};