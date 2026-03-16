import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { ArrowLeft, ShoppingCart, Coins, Trash2, Package, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { computeRewards } from '@/lib/rewardPlayer';

const FICHES_PEDAGOGIQUES = {
  fleurs_comestibles: {
    titre: 'Fleurs Comestibles',
    emoji: '🌸',
    sections: [
      {
        titre: 'Quand semer ?',
        contenu: 'Printemps (mars-mai) pour la plupart. Certaines variétés en automne (septembre-octobre).'
      },
      {
        titre: 'Comment obtenir les graines ?',
        contenu: 'Récolter les graines matures en fin de saison. Laisser sécher les fleurs fanées. Extraire les graines et les conserver au sec.'
      },
      {
        titre: 'Comment les produire ?',
        contenu: 'Semer en godets à la serre. Repiquer en pleine terre après les gelées. Arroser régulièrement. Éclaircir si nécessaire.'
      },
      {
        titre: 'Comment les récolter ?',
        contenu: 'Cueillir le matin après la rosée. Choisir les fleurs épanouies. Éviter celles traitées aux pesticides.'
      },
      {
        titre: 'Fleurs comestibles courantes',
        liste: ['Capucine (goût poivré)', 'Pensée (douce)', 'Bourrache (goût concombre)', 'Calendula (légèrement épicé)', 'Lavande (parfumée)', 'Rose (sucrée)', 'Violette (délicate)', 'Souci (piquante)']
      }
    ]
  },
  tomates: {
    titre: 'Tomates Bio',
    emoji: '🍅',
    sections: [
      {
        titre: 'Quand semer ?',
        contenu: 'Février-mars en serre chauffée. Avril-mai en pleine terre après les gelées.'
      },
      {
        titre: 'Comment obtenir les graines ?',
        contenu: 'Choisir une tomate bien mûre. Extraire les graines. Les faire fermenter 2-3 jours dans l\'eau. Rincer et sécher.'
      },
      {
        titre: 'Culture',
        contenu: 'Planter profond pour favoriser les racines. Tuteurer les plants. Arroser au pied. Pailler le sol. Tailler les gourmands.'
      },
      {
        titre: 'Récolte',
        contenu: 'Juillet à octobre. Cueillir quand bien colorées. Récolter régulièrement pour stimuler la production.'
      },
      {
        titre: 'Variétés populaires',
        liste: ['Cœur de bœuf (grosse)', 'Cerise (petite)', 'Roma (allongée)', 'Noire de Crimée (pourpre)', 'Ananas (jaune)', 'Green Zebra (rayée)']
      }
    ]
  },
  compost: {
    titre: 'Compost Bio',
    emoji: '♻️',
    sections: [
      {
        titre: 'Qu\'est-ce que le compost ?',
        contenu: 'Matière organique décomposée naturellement. Riche en nutriments pour les plantes. Améliore la structure du sol.'
      },
      {
        titre: 'Comment le fabriquer ?',
        contenu: 'Alterner couches vertes (déchets cuisine, herbe) et brunes (feuilles sèches, carton). Maintenir l\'humidité. Aérer régulièrement. Compter 6-12 mois de maturation.'
      },
      {
        titre: 'Ingrédients à composter',
        liste: ['Épluchures de fruits et légumes', 'Marc de café', 'Coquilles d\'œufs', 'Feuilles mortes', 'Tontes de gazon', 'Cartons non imprimés', 'Branchages broyés']
      },
      {
        titre: 'À éviter',
        liste: ['Viande et poisson', 'Produits laitiers', 'Plantes malades', 'Mauvaises herbes en graines']
      },
      {
        titre: 'Utilisation',
        contenu: 'Le compost est prêt quand il est brun foncé, friable et sent la terre. L\'incorporer au sol ou l\'utiliser en paillage.'
      }
    ]
  },
  terreau: {
    titre: 'Terreau Bio',
    emoji: '🪴',
    sections: [
      {
        titre: 'Composition',
        contenu: 'Mélange de compost mûr, tourbe, sable et matières organiques. pH équilibré pour la croissance des plantes.'
      },
      {
        titre: 'Fabrication maison',
        contenu: 'Mélanger 1/3 compost, 1/3 terre de jardin, 1/3 sable. Tamiser pour obtenir une texture fine. Laisser reposer 2 semaines.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Semis et boutures. Rempotage des plantes. Plantation en pots. Amélioration du sol du jardin.'
      },
      {
        titre: 'Conservation',
        contenu: 'Stocker au sec dans un endroit aéré. Utiliser dans l\'année pour garder ses propriétés nutritives.'
      }
    ]
  },
  micropousses: {
    titre: 'Micro-pousses',
    emoji: '🌾',
    sections: [
      {
        titre: 'Qu\'est-ce que c\'est ?',
        contenu: 'Jeunes pousses de légumes et herbes récoltées après 7-21 jours. Concentrées en nutriments et saveurs.'
      },
      {
        titre: 'Comment semer ?',
        contenu: 'Utiliser des plateaux peu profonds. Étaler du terreau humide. Semer dense. Couvrir légèrement. Vaporiser d\'eau. Placer à la lumière.'
      },
      {
        titre: 'Comment récolter ?',
        contenu: 'Couper avec des ciseaux propres juste au-dessus du terreau quand les premières vraies feuilles apparaissent.'
      },
      {
        titre: 'Comment consommer ?',
        contenu: 'Rincer délicatement à l\'eau froide. Utiliser fraîches en salades, sandwichs, smoothies. Ne pas cuire pour garder les nutriments.'
      },
      {
        titre: 'Variétés populaires',
        liste: ['Radis (piquant)', 'Roquette (poivré)', 'Moutarde (fort)', 'Basilic (aromatique)', 'Pois (sucré)', 'Tournesol (croquant)', 'Betterave (terreux)']
      }
    ]
  },
  pain_complet: {
    titre: 'Pain Complet',
    emoji: '🥖',
    sections: [
      {
        titre: 'Ingrédients',
        contenu: 'Farine complète bio (blé, seigle, épeautre). Eau. Levain naturel. Sel.'
      },
      {
        titre: 'Production du levain',
        contenu: 'Mélanger farine et eau à parts égales. Laisser fermenter 5-7 jours en nourrissant quotidiennement. Le levain est prêt quand il double de volume.'
      },
      {
        titre: 'Fabrication du pain',
        contenu: 'Pétrir la pâte 10-15 min. Laisser lever 2-4h. Façonner. Laisser pousser 1-2h. Cuire à 240°C pendant 30-40 min.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Riche en fibres. Meilleure digestion. Index glycémique plus bas. Plus de vitamines et minéraux que le pain blanc.'
      }
    ]
  },
  lait: {
    titre: 'Lait Frais de la Ferme',
    emoji: '🥛',
    sections: [
      {
        titre: 'Production',
        contenu: 'Traite manuelle ou mécanique des vaches, chèvres ou brebis. Deux traites par jour (matin et soir).'
      },
      {
        titre: 'Processus',
        contenu: 'Nettoyage des mamelles. Traite dans des conditions d\'hygiène strictes. Filtrage immédiat. Refroidissement rapide à 4°C.'
      },
      {
        titre: 'Conservation',
        contenu: 'À consommer dans les 3-4 jours. Garder au réfrigérateur. Ne pas rompre la chaîne du froid.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Riche en calcium et protéines. Vitamines A, D et B12. Lait cru: contient des enzymes et probiotiques bénéfiques.'
      }
    ]
  },
  plants_tomate: {
    titre: 'Plants de Tomate',
    emoji: '🌱',
    sections: [
      {
        titre: 'Production en pépinière',
        contenu: 'Semis en godets février-mars. Température 20-25°C. Repiquage après 3-4 semaines. Plants prêts en 6-8 semaines.'
      },
      {
        titre: 'Plantation',
        contenu: 'Attendre fin des gelées (mi-mai). Espacer de 50-70cm. Planter profond. Tuteurer dès la plantation.'
      },
      {
        titre: 'Entretien',
        contenu: 'Arroser régulièrement au pied. Pailler pour garder l\'humidité. Tailler les gourmands. Fertiliser avec du compost.'
      }
    ]
  },
  plants_salade: {
    titre: 'Plants de Salade',
    emoji: '🌿',
    sections: [
      {
        titre: 'Production',
        contenu: 'Semis toute l\'année en pépinière. Repiquage après 4-5 semaines. Croissance rapide (6-8 semaines).'
      },
      {
        titre: 'Plantation',
        contenu: 'Espacer de 25-30cm. Sol frais et léger. Mi-ombre en été.'
      },
      {
        titre: 'Récolte',
        contenu: 'Couper au couteau ou arracher avec racine. Récolter tôt le matin.'
      }
    ]
  },
  plantes_aromatiques: {
    titre: 'Plantes Aromatiques',
    emoji: '🪴',
    sections: [
      {
        titre: 'Variétés populaires',
        liste: ['Basilic (annuel)', 'Persil (bisannuel)', 'Ciboulette (vivace)', 'Menthe (vivace)', 'Thym (vivace)', 'Romarin (vivace)']
      },
      {
        titre: 'Culture',
        contenu: 'En pot ou pleine terre. Sol drainant. Exposition ensoleillée. Arrosage modéré.'
      },
      {
        titre: 'Récolte',
        contenu: 'Couper les tiges au besoin. Ne pas tout récolter d\'un coup. Récolter avant la floraison pour plus de saveur.'
      }
    ]
  },
  carottes: {
    titre: 'Carottes Bio',
    emoji: '🥕',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Semis direct mars-juillet. Sol meuble et profond. Éclaircir à 5cm. Pas de fumier frais.'
      },
      {
        titre: 'Récolte',
        contenu: '3-4 mois après semis. Arracher avec fourche-bêche. Conservation en cave ou terre.'
      }
    ]
  },
  salades: {
    titre: 'Salades Fraîches',
    emoji: '🥬',
    sections: [
      {
        titre: 'Variétés',
        liste: ['Laitue (douce)', 'Batavia (croquante)', 'Feuille de chêne (tendre)', 'Roquette (poivrée)', 'Mâche (hivernale)']
      },
      {
        titre: 'Culture',
        contenu: 'Semis échelonnés toute l\'année. Sol frais. Arrosage régulier.'
      },
      {
        titre: 'Récolte',
        contenu: 'Feuille par feuille ou plant entier. Récolter avant montée en graines.'
      }
    ]
  },
  pommes: {
    titre: 'Pommes du Verger',
    emoji: '🍎',
    sections: [
      {
        titre: 'Variétés',
        liste: ['Golden (sucrée)', 'Gala (croquante)', 'Reinette (acidulée)', 'Boskoop (à cuire)']
      },
      {
        titre: 'Récolte',
        contenu: 'Août-octobre selon variétés. Tester en tournant légèrement. Cueillir avec le pédoncule.'
      },
      {
        titre: 'Conservation',
        contenu: 'Cave fraîche et aérée. Trier régulièrement. Dure 2-6 mois selon variétés.'
      }
    ]
  },
  fraises: {
    titre: 'Fraises du Jardin',
    emoji: '🍓',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Plantation printemps ou automne. Sol riche en humus. Pailler la terre. Supprimer les stolons.'
      },
      {
        titre: 'Récolte',
        contenu: 'Mai-juillet. Cueillir avec le pédoncule. Récolter tous les 2-3 jours. Déguster rapidement.'
      }
    ]
  },
  pain_seigle: {
    titre: 'Pain de Seigle',
    emoji: '🍞',
    sections: [
      {
        titre: 'Particularités',
        contenu: 'Farine de seigle + blé. Mie dense et compacte. Goût prononcé. Excellente conservation.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Très riche en fibres. Minéraux (fer, magnésium). Satiété durable. Bon pour la digestion.'
      }
    ]
  },
  beurre: {
    titre: 'Beurre Fermier',
    emoji: '🧈',
    sections: [
      {
        titre: 'Fabrication',
        contenu: 'Crème du lait (maturation 12-24h). Barattage jusqu\'à séparation. Malaxage et lavage. Moulage.'
      },
      {
        titre: 'Conservation',
        contenu: 'Au réfrigérateur 2-3 semaines. Peut se congeler. Protéger de la lumière.'
      }
    ]
  },
  fromage: {
    titre: 'Fromage Artisanal',
    emoji: '🧀',
    sections: [
      {
        titre: 'Fabrication',
        contenu: 'Caillage du lait (présure). Égouttage du caillé. Moulage et pressage. Salage. Affinage.'
      },
      {
        titre: 'Types',
        liste: ['Frais (chèvre, ricotta)', 'Pâte molle (camembert)', 'Pâte pressée (tomme)', 'Pâte dure (comté)']
      }
    ]
  },
  bouquet_champetre: {
    titre: 'Bouquet Champêtre',
    emoji: '💐',
    sections: [
      {
        titre: 'Composition',
        contenu: 'Mélange de fleurs des champs et du jardin. Marguerites, bleuets, cosmos, zinnias, lavande.'
      },
      {
        titre: 'Conservation',
        contenu: 'Couper les tiges en biais. Eau fraîche changée tous les 2 jours. Retirer feuilles immergées. Dure 7-10 jours.'
      }
    ]
  },
  bouquet_roses: {
    titre: 'Bouquet de Roses',
    emoji: '🌹',
    sections: [
      {
        titre: 'Variétés',
        contenu: 'Roses parfumées du jardin. Rouges, roses, blanches ou jaunes. Taillées le matin.'
      },
      {
        titre: 'Conservation',
        contenu: 'Recouper les tiges sous l\'eau. Enlever épines basses. Vase propre eau fraîche. Dure 5-8 jours.'
      }
    ]
  },
  poires: {
    titre: 'Poires du Verger',
    emoji: '🍐',
    sections: [
      {
        titre: 'Variétés',
        liste: ['Williams (juteuse)', 'Conférence (sucrée)', 'Comice (fondante)', 'Louise Bonne (parfumée)']
      },
      {
        titre: 'Récolte',
        contenu: 'Août-octobre. Cueillir avant maturité complète. Finir de mûrir à température ambiante.'
      },
      {
        titre: 'Conservation',
        contenu: 'Cave fraîche et ventilée. Dure 2-4 mois selon variétés.'
      }
    ]
  },
  framboises: {
    titre: 'Framboises',
    emoji: '🍓',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Arbuste vivace. Plantation automne ou printemps. Sol riche et frais. Tailler les tiges après récolte.'
      },
      {
        titre: 'Récolte',
        contenu: 'Juin-juillet (remontantes jusqu\'en octobre). Cueillir délicatement. Très fragiles. À consommer rapidement.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Riche en vitamine C et antioxydants. Fibres. Faible en calories.'
      }
    ]
  },
  myrtilles: {
    titre: 'Myrtilles',
    emoji: '🫐',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Sol acide indispensable. Plantation automne. Arrosage régulier. Paillage conseillé.'
      },
      {
        titre: 'Récolte',
        contenu: 'Juillet-août. Cueillir les baies bien bleues. Se conservent quelques jours au frais.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Super-aliment. Antioxydants puissants. Bon pour la vue et la mémoire.'
      }
    ]
  },
  groseilles: {
    titre: 'Groseilles',
    emoji: '🍒',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Arbuste rustique. Pousse partout. Peu exigeant. Tailler en hiver.'
      },
      {
        titre: 'Récolte',
        contenu: 'Juin-juillet. Cueillir en grappes. Acidulées et rafraîchissantes.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Confitures, gelées, coulis, sirops. Excellentes en pâtisserie.'
      }
    ]
  },
  cassis: {
    titre: 'Cassis',
    emoji: '🫐',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Groseillier à fruits noirs. Très rustique. Sol riche et frais.'
      },
      {
        titre: 'Récolte',
        contenu: 'Juillet. Baies noires brillantes. Très parfumées. Riches en vitamine C.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Confitures, sirops, crème de cassis. Infusions de bourgeons (anti-inflammatoire).'
      }
    ]
  },
  kiwi: {
    titre: 'Kiwis',
    emoji: '🥝',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Liane fruitière. Besoin de tuteur ou pergola. Plant mâle et femelle nécessaires.'
      },
      {
        titre: 'Récolte',
        contenu: 'Octobre-novembre. Cueillir avant les gelées. Finir de mûrir à température ambiante.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Champion de vitamine C (plus qu\'une orange). Fibres. Aide à la digestion.'
      }
    ]
  },
  melon: {
    titre: 'Melons',
    emoji: '🍈',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Plante gourmande en chaleur. Semis sous abri en avril. Plantation mai. Arrosage régulier.'
      },
      {
        titre: 'Récolte',
        contenu: 'Juillet-septembre. Mûr quand il se détache facilement. Parfum sucré. Croûte souple.'
      },
      {
        titre: 'Conservation',
        contenu: 'Se garde quelques jours à température ambiante. Une fois coupé, au réfrigérateur.'
      }
    ]
  },
  pasteque: {
    titre: 'Pastèques',
    emoji: '🍉',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Besoin de chaleur et espace. Semis sous abri en avril. Plantation mai. Pailler le sol.'
      },
      {
        titre: 'Récolte',
        contenu: 'Août-septembre. Mûre quand la vrille sèche et le son creux. Très rafraîchissante.'
      },
      {
        titre: 'Bienfaits',
        contenu: '90% d\'eau. Hydratante. Vitamines A et C. Faible en calories.'
      }
    ]
  },
  chataignes: {
    titre: 'Châtaignes',
    emoji: '🌰',
    sections: [
      {
        titre: 'Production',
        contenu: 'Fruit du châtaignier. Récolte octobre-novembre. Ramasser les bogues tombées au sol.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Grillées, bouillies, en purée, farine. Aliment de base historique dans certaines régions.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Riche en glucides complexes. Fibres. Sans gluten. Minéraux (potassium, magnésium).'
      }
    ]
  },
  noix: {
    titre: 'Noix',
    emoji: '🥜',
    sections: [
      {
        titre: 'Production',
        contenu: 'Fruit du noyer. Récolte septembre-octobre. Séchage nécessaire avant consommation.'
      },
      {
        titre: 'Conservation',
        contenu: 'En coque: plusieurs mois au sec. Décortiquées: quelques semaines au frais.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Oméga-3. Protéines végétales. Vitamines E et B. Bon pour le cerveau et le cœur.'
      }
    ]
  },
  courges: {
    titre: 'Courges',
    emoji: '🎃',
    sections: [
      {
        titre: 'Variétés',
        liste: ['Potiron (grosse)', 'Butternut (allongée)', 'Potimarron (sucrée)', 'Spaghetti (filaments)']
      },
      {
        titre: 'Culture',
        contenu: 'Semis avril-mai. Plantation après gelées. Gourmande en eau et compost. Récolte avant gelées.'
      },
      {
        titre: 'Conservation',
        contenu: 'Se garde plusieurs mois au sec et au frais. Peau épaisse protectrice.'
      }
    ]
  },
  courgettes: {
    titre: 'Courgettes',
    emoji: '🥒',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Semis avril-mai. Pousse rapide. Arrosage régulier. Récolter jeunes (15-20cm).'
      },
      {
        titre: 'Récolte',
        contenu: 'Juin-octobre. Cueillir tous les 2-3 jours. Plus on récolte, plus ça produit.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Crue, grillée, farcie, en gratin, ratatouille. Fleurs aussi comestibles.'
      }
    ]
  },
  concombres: {
    titre: 'Concombres',
    emoji: '🥒',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Semis mai. Arrosage abondant. Tuteurage conseillé. Récolte juillet-septembre.'
      },
      {
        titre: 'Récolte',
        contenu: 'Cueillir régulièrement quand fermes et verts. Ne pas laisser jaunir.'
      },
      {
        titre: 'Bienfaits',
        contenu: '95% d\'eau. Très hydratant. Faible en calories. Rafraîchissant.'
      }
    ]
  },
  aubergines: {
    titre: 'Aubergines',
    emoji: '🍆',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Besoin de chaleur. Semis sous abri mars. Plantation mai. Tuteurage nécessaire.'
      },
      {
        titre: 'Récolte',
        contenu: 'Juillet-septembre. Cueillir brillantes et fermes. Peau lisse et tendue.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Grillée, farcie, caviar, moussaka, ratatouille. Ne se mange pas crue.'
      }
    ]
  },
  betteraves: {
    titre: 'Betteraves',
    emoji: '🟣',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Semis avril-juin. Sol profond et frais. Éclaircir à 10cm. Récolte octobre.'
      },
      {
        titre: 'Conservation',
        contenu: 'Excellente conservation en cave. Plusieurs mois.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Riche en antioxydants. Fer. Bonne pour le sang. Détoxifiante.'
      }
    ]
  },
  celeri_rave: {
    titre: 'Céleri-rave',
    emoji: '🥔',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Semis sous abri mars. Repiquage mai. Arrosage régulier. Récolte automne.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Rémoulade, purée, potage, gratin. Cru ou cuit. Saveur prononcée.'
      },
      {
        titre: 'Conservation',
        contenu: 'Se garde plusieurs semaines au frais.'
      }
    ]
  },
  choux_blanc: {
    titre: 'Chou Blanc',
    emoji: '🥬',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Semis printemps-été. Repiquage après 6 semaines. Sol riche. Récolte automne-hiver.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Choucroute, potée, salade crue, soupe. Très polyvalent.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Riche en vitamine C. Fibres. Peu calorique. Bon pour la digestion.'
      }
    ]
  },
  choux_rouge: {
    titre: 'Chou Rouge',
    emoji: '🥬',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Même culture que le chou blanc. Couleur due aux anthocyanes.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Salade crue, braisé, accompagnement. Joli en pickles.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Antioxydants puissants. Vitamines. Anti-inflammatoire.'
      }
    ]
  },
  choux_rave: {
    titre: 'Chou-rave',
    emoji: '🥬',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Pousse rapide (2 mois). Semis mars-juillet. Récolter jeune et tendre.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Cru en salade, cuit vapeur, gratin. Goût doux de chou et navet.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Vitamine C. Fibres. Digeste.'
      }
    ]
  },
  choux_chinois: {
    titre: 'Chou Chinois',
    emoji: '🥬',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Semis juillet-août pour récolte automne. Croissance rapide. Aime la fraîcheur.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Sauté au wok, soupe, salade, kimchi. Feuilles tendres et croquantes.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Très riche en vitamines. Faible en calories. Très digeste.'
      }
    ]
  },
  haricots: {
    titre: 'Haricots',
    emoji: '🫘',
    sections: [
      {
        titre: 'Variétés',
        liste: ['Verts (filets)', 'Beurre (jaunes)', 'À rames (grimpants)', 'Nains (compacts)']
      },
      {
        titre: 'Culture',
        contenu: 'Semis mai-juillet. Chaleur nécessaire. Arrosage régulier. Récolte 2-3 mois après.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Protéines végétales. Fibres. Vitamines. Pauvres en calories.'
      }
    ]
  },
  mais: {
    titre: 'Maïs',
    emoji: '🌽',
    sections: [
      {
        titre: 'Culture',
        contenu: 'Semis mai en poquets. Chaleur et eau nécessaires. Pollinisation par le vent.'
      },
      {
        titre: 'Récolte',
        contenu: 'Août-septembre. Grains laiteux quand on perce. Soies brunies.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Frais (épis bouillis/grillés), pop-corn, farine, polenta.'
      }
    ]
  },
  poulet: {
    titre: 'Poulet Fermier',
    emoji: '🍗',
    sections: [
      {
        titre: 'Élevage',
        contenu: 'Poulets élevés en plein air. Alimentation céréales et herbe. Croissance lente (120 jours minimum).'
      },
      {
        titre: 'Qualité',
        contenu: 'Chair ferme et goûteuse. Bien-être animal respecté. Parcours herbeux.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Protéines de qualité. Faible en graisses. Vitamines B.'
      }
    ]
  },
  lapin: {
    titre: 'Lapin Fermier',
    emoji: '🐰',
    sections: [
      {
        titre: 'Élevage',
        contenu: 'Lapins élevés en clapiers spacieux. Alimentation foin, herbe, céréales. Croissance naturelle.'
      },
      {
        titre: 'Qualité',
        contenu: 'Viande blanche maigre. Saveur délicate. Élevage traditionnel.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Très riche en protéines. Pauvre en graisses. Fer et vitamines B.'
      }
    ]
  },
  agneau: {
    titre: 'Agneau Fermier',
    emoji: '🐑',
    sections: [
      {
        titre: 'Élevage',
        contenu: 'Agneaux élevés avec leur mère en pâturage. Alimentation lait maternel puis herbe. Respectueux du bien-être.'
      },
      {
        titre: 'Qualité',
        contenu: 'Viande tendre et savoureuse. Élevage extensif en prairie.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Protéines complètes. Fer, zinc, vitamines B12. Riche en oméga-3 si élevé à l\'herbe.'
      }
    ]
  },
  boeuf: {
    titre: 'Bœuf Fermier',
    emoji: '🥩',
    sections: [
      {
        titre: 'Élevage',
        contenu: 'Bovins élevés en pâturage. Alimentation herbe et foin. Croissance lente et naturelle.'
      },
      {
        titre: 'Qualité',
        contenu: 'Viande persillée et goûteuse. Maturée selon tradition. Race locale adaptée.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Excellente source de protéines. Fer héminique. Vitamines B12. Zinc.'
      }
    ]
  },
  eau_source: {
    titre: 'Eau de Source',
    emoji: '💧',
    sections: [
      {
        titre: 'Origine',
        contenu: 'Eau puisée directement à la source locale. Filtration naturelle par les roches.'
      },
      {
        titre: 'Qualité',
        contenu: 'Pure et naturelle. Minéraux naturels. Contrôles réguliers.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Hydratation essentielle. Minéraux naturels. Pas de traitement chimique.'
      }
    ]
  },
  eau_gazeuse: {
    titre: 'Eau Gazeuse CO2',
    emoji: '🫧',
    sections: [
      {
        titre: 'Production',
        contenu: 'Eau de source gazéifiée naturellement ou par ajout de CO2 alimentaire.'
      },
      {
        titre: 'Utilisation',
        contenu: 'Désaltérante. Base de cocktails. Digestion facilitée.'
      },
      {
        titre: 'Bienfaits',
        contenu: 'Hydratation. Sensation de fraîcheur. Aide à la digestion.'
      }
    ]
  },
  hydromel: {
    titre: 'Hydromel Artisanal',
    emoji: '🍯',
    sections: [
      {
        titre: 'Qu\'est-ce que c\'est ?',
        contenu: 'Boisson alcoolisée ancestrale obtenue par fermentation de miel et d\'eau. "Boisson des dieux" dans la mythologie nordique.'
      },
      {
        titre: 'Fabrication',
        contenu: 'Mélange de miel et eau. Fermentation avec levures (plusieurs mois). Vieillissement en fût. Titrage 10-15°.'
      },
      {
        titre: 'Dégustation',
        contenu: 'Saveur douce et miellée. Servi frais. Apéritif ou accompagnement dessert.'
      }
    ]
  },
  biere: {
    titre: 'Bière Artisanale',
    emoji: '🍺',
    sections: [
      {
        titre: 'Fabrication',
        contenu: 'Brassage de malt d\'orge, houblon et eau. Fermentation. Maturation. Production locale.'
      },
      {
        titre: 'Variétés',
        liste: ['Blonde (douce)', 'Ambrée (maltée)', 'Brune (torréfiée)', 'IPA (houblonnée)']
      },
      {
        titre: 'Dégustation',
        contenu: 'Servir fraîche (6-8°C). Accompagne plats rustiques. Tradition brassicole locale.'
      }
    ]
  }
};

const RAYONS = {
  serre: {
    nom: 'Serre & Pépinière',
    emoji: '🌱',
    color: 'from-green-600 to-emerald-700',
    produits: [
      { id: 'plants_tomate', nom: 'Plant Tomate', emoji: '🌱', prix: 3 },
      { id: 'plants_salade', nom: 'Plant Salade', emoji: '🌿', prix: 2 },
      { id: 'micropousses', nom: 'Micro-pousses', emoji: '🌾', prix: 5 },
      { id: 'fleurs_comestibles', nom: 'Fleurs Comestibles', emoji: '🌸', prix: 4 },
      { id: 'plantes_aromatiques', nom: 'Plantes Aromatiques', emoji: '🌿', prix: 6 }
    ]
  },
  fruits: {
    nom: 'Fruits du Verger',
    emoji: '🍎',
    color: 'from-red-600 to-pink-700',
    produits: [
      { id: 'pommes', nom: 'Pommes', emoji: '🍎', prix: 8 },
      { id: 'poires', nom: 'Poires', emoji: '🍐', prix: 8 },
      { id: 'fraises', nom: 'Fraises', emoji: '🍓', prix: 12 },
      { id: 'framboises', nom: 'Framboises', emoji: '🫐', prix: 15 },
      { id: 'myrtilles', nom: 'Myrtilles', emoji: '🫐', prix: 14 },
      { id: 'groseilles', nom: 'Groseilles', emoji: '🍇', prix: 10 },
      { id: 'cassis', nom: 'Cassis', emoji: '🍇', prix: 12 },
      { id: 'kiwi', nom: 'Kiwis', emoji: '🥝', prix: 10 },
      { id: 'melon', nom: 'Melons', emoji: '🍈', prix: 9 },
      { id: 'pasteque', nom: 'Pastèques', emoji: '🍉', prix: 7 }
    ]
  },
  fruits_secs: {
    nom: 'Fruits à Coque',
    emoji: '🌰',
    color: 'from-amber-700 to-orange-800',
    produits: [
      { id: 'chataignes', nom: 'Châtaignes', emoji: '🌰', prix: 11 },
      { id: 'noix', nom: 'Noix', emoji: '🥜', prix: 13 }
    ]
  },
  legumes: {
    nom: 'Légumes du Potager',
    emoji: '🥕',
    color: 'from-orange-600 to-red-700',
    produits: [
      { id: 'tomates', nom: 'Tomates', emoji: '🍅', prix: 7 },
      { id: 'carottes', nom: 'Carottes', emoji: '🥕', prix: 5 },
      { id: 'salades', nom: 'Salades', emoji: '🥬', prix: 6 },
      { id: 'courges', nom: 'Courges', emoji: '🎃', prix: 6 },
      { id: 'courgettes', nom: 'Courgettes', emoji: '🥒', prix: 5 },
      { id: 'concombres', nom: 'Concombres', emoji: '🥒', prix: 5 },
      { id: 'aubergines', nom: 'Aubergines', emoji: '🍆', prix: 7 },
      { id: 'betteraves', nom: 'Betteraves', emoji: '🟣', prix: 6 },
      { id: 'celeri_rave', nom: 'Céleri-rave', emoji: '🥔', prix: 6 },
      { id: 'choux_blanc', nom: 'Chou blanc', emoji: '🥬', prix: 5 },
      { id: 'choux_rouge', nom: 'Chou rouge', emoji: '🥬', prix: 5 },
      { id: 'choux_rave', nom: 'Chou-rave', emoji: '🥬', prix: 6 },
      { id: 'choux_chinois', nom: 'Chou chinois', emoji: '🥬', prix: 7 },
      { id: 'haricots', nom: 'Haricots', emoji: '🫘', prix: 8 },
      { id: 'mais', nom: 'Maïs', emoji: '🌽', prix: 4 }
    ]
  },
  viandes: {
    nom: 'Viandes de la Ferme',
    emoji: '🥩',
    color: 'from-red-700 to-rose-800',
    produits: [
      { id: 'poulet', nom: 'Poulet', emoji: '🍗', prix: 25 },
      { id: 'lapin', nom: 'Lapin', emoji: '🐰', prix: 28 },
      { id: 'agneau', nom: 'Agneau', emoji: '🐑', prix: 35 },
      { id: 'boeuf', nom: 'Bœuf', emoji: '🥩', prix: 40 }
    ]
  },
  boulangerie: {
    nom: 'Boulangerie',
    emoji: '🥖',
    color: 'from-amber-600 to-yellow-700',
    produits: [
      { id: 'pain_complet', nom: 'Pain Complet', emoji: '🥖', prix: 8 },
      { id: 'pain_seigle', nom: 'Pain Seigle', emoji: '🍞', prix: 9 }
    ]
  },
  laitiers: {
    nom: 'Produits Laitiers',
    emoji: '🥛',
    color: 'from-blue-600 to-cyan-700',
    produits: [
      { id: 'lait', nom: 'Lait Frais', emoji: '🥛', prix: 7 },
      { id: 'beurre', nom: 'Beurre', emoji: '🧈', prix: 10 },
      { id: 'fromage', nom: 'Fromage', emoji: '🧀', prix: 12 }
    ]
  },
  boissons: {
    nom: 'Boissons',
    emoji: '💧',
    color: 'from-cyan-600 to-blue-700',
    produits: [
      { id: 'eau_source', nom: 'Eau de Source', emoji: '💧', prix: 3 },
      { id: 'eau_gazeuse', nom: 'Eau Gazeuse CO2', emoji: '💧', prix: 4 },
      { id: 'hydromel', nom: 'Hydromel', emoji: '🍯', prix: 18 },
      { id: 'biere', nom: 'Bière artisanale', emoji: '🍺', prix: 15 }
    ]
  },
  jardinage: {
    nom: 'Compost & Terreau',
    emoji: '♻️',
    color: 'from-brown-600 to-stone-700',
    produits: [
      { id: 'compost', nom: 'Sac Compost', emoji: '♻️', prix: 6 },
      { id: 'terreau', nom: 'Sac Terreau', emoji: '🌱', prix: 7 }
    ]
  },
  fleurs: {
    nom: 'Bouquets',
    emoji: '💐',
    color: 'from-pink-600 to-rose-700',
    produits: [
      { id: 'bouquet_champetre', nom: 'Bouquet Champêtre', emoji: '💐', prix: 12 },
      { id: 'bouquet_roses', nom: 'Bouquet Roses', emoji: '🌹', prix: 15 }
    ]
  }
};

export default function FermeEpicerie() {
  const [chariot, setChariot] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [ficheOuverte, setFicheOuverte] = useState(null);
  const [modeEpicier, setModeEpicier] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => base44.entities.EcoProfile.list()
  });

  const profile = profiles?.[0];

  const { data: caisses } = useQuery({
    queryKey: ['caisseFerme'],
    queryFn: () => base44.entities.CaisseFerme.list(),
  });

  const caisse = caisses?.[0];

  const { data: stocks } = useQuery({
    queryKey: ['stockEpicerie'],
    queryFn: () => base44.entities.StockEpicerie.list(),
  });

  const { data: roleEpicier } = useQuery({
    queryKey: ['roleEpicier', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const roles = await base44.entities.RoleFerme.filter({ created_by: user.email, role: 'epicier' });
      return roles[0] || null;
    },
    enabled: !!user?.email,
  });

  // Mutation achat client — vide le chariot et affiche succès
  const updateProfileAchatMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EcoProfile.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles']);
      setFeedback({ type: 'success', message: '✅ Achat effectué ! Crédits déduits.' });
      setChariot([]);
      setTimeout(() => setFeedback(null), 3000);
    },
  });

  // Mutation générique profil (épicier, etc.) — sans vider le chariot
  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EcoProfile.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles']);
    },
  });

  const updateCaisseMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CaisseFerme.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['caisseFerme']);
    },
  });

  const createCaisseMutation = useMutation({
    mutationFn: (data) => base44.entities.CaisseFerme.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['caisseFerme']);
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.StockEpicerie.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['stockEpicerie']);
    },
  });

  const createStockMutation = useMutation({
    mutationFn: (data) => base44.entities.StockEpicerie.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['stockEpicerie']);
    },
  });

  const payerEpicier = (montant, description) => {
    if (!profile || !caisse) return;
    // La caisse paie l'épicier depuis ses réserves
    const nouvelleTransaction = {
      type: 'salaire',
      montant: montant,
      eleve_email: user?.email || 'inconnu',
      description: description,
      date: new Date().toISOString()
    };
    // Crédits + XP + badges ferme via computeRewards
    const updates = computeRewards(profile, { xp: montant * 2, credits: montant, ferme_action: true });
    updateProfileMutation.mutate({ id: profile.id, data: updates });
    updateCaisseMutation.mutate({
      id: caisse.id,
      data: {
        total_credits: Math.max(0, (caisse.total_credits || 0) - montant),
        salaires_verses: (caisse.salaires_verses || 0) + montant,
        derniere_transaction: new Date().toISOString(),
        historique_transactions: [...(caisse.historique_transactions || []), nouvelleTransaction]
      }
    });
  };

  const [caisseInitialisee, setCaisseInitialisee] = React.useState(false);

  React.useEffect(() => {
    if (!caisse && user && !caisseInitialisee) {
      createCaisseMutation.mutate({
        total_credits: 1000,
        revenus_epicerie: 0,
        salaires_verses: 0,
        historique_transactions: []
      });
      setCaisseInitialisee(true);
    }
  }, [caisse, user, caisseInitialisee]);

  // Vider le chariot après 24h
  React.useEffect(() => {
    if (profile?.derniere_visite_epicerie) {
      const derniereVisite = new Date(profile.derniere_visite_epicerie);
      const maintenant = new Date();
      const heuresEcoulees = (maintenant - derniereVisite) / (1000 * 60 * 60);
      
      if (heuresEcoulees >= 24 && profile.articles_achetes?.length > 0) {
        updateProfileAchatMutation.mutate({
          id: profile.id,
          data: {
            articles_achetes: [],
            derniere_visite_epicerie: new Date().toISOString()
          }
        });
        setFeedback({ type: 'success', message: '🔄 Chariot vidé après 24h - Tu peux racheter !' });
        setTimeout(() => setFeedback(null), 3000);
      }
    }
  }, [profile?.derniere_visite_epicerie]);

  // Charger les articles depuis le profil
  React.useEffect(() => {
    if (profile?.articles_achetes && profile.articles_achetes.length > 0) {
      setChariot(profile.articles_achetes.map(article => ({
        ...article,
        uniqueId: article.id + '_' + article.date_achat,
        estNouveau: false
      })));
    }
  }, [profile]);

  const creditsDisponibles = profile?.credits || 0;
  
  // Séparer les articles déjà achetés des nouveaux
  const articlesNouveaux = chariot.filter(item => item.estNouveau === true);
  const totalChariot = articlesNouveaux.reduce((acc, item) => acc + item.prix, 0);
  
  const peutAjouterArticle = (prix) => {
    return (totalChariot + prix) <= creditsDisponibles;
  };

  const ajouterAuChariot = (produit, stockDispo) => {
    if (!stockDispo || stockDispo.quantite <= 0) {
      setFeedback({ type: 'error', message: '❌ Rupture de stock ! Demande à l\'épicier de réapprovisionner' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    
    if (peutAjouterArticle(produit.prix)) {
      const nouvelArticle = { ...produit, uniqueId: Date.now(), estNouveau: true };
      setChariot([...chariot, nouvelArticle]);
      setFeedback({ type: 'success', message: `${produit.nom} ajouté !` });
      setTimeout(() => setFeedback(null), 1000);
    } else {
      setFeedback({ type: 'error', message: '❌ Budget insuffisant !' });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const retirerDuChariot = (uniqueId) => {
    const article = chariot.find(item => item.uniqueId === uniqueId);
    if (!article || !article.estNouveau) {
      setFeedback({ type: 'error', message: '❌ Article déjà acheté, impossible de le retirer !' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    setChariot(chariot.filter(item => item.uniqueId !== uniqueId));
  };

  const validerAchat = () => {
    if (articlesNouveaux.length === 0) {
      setFeedback({ type: 'error', message: '❌ Aucun nouvel article à payer !' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    // Préparer les nouveaux articles avec la date d'achat
    const articlesAvecDate = articlesNouveaux.map(item => ({
      id: item.id,
      nom: item.nom,
      emoji: item.emoji,
      prix: item.prix,
      date_achat: new Date().toISOString()
    }));

    // Ajouter aux articles existants
    const tousLesArticles = [...(profile?.articles_achetes || []), ...articlesAvecDate];

    // Déduire du stock
    articlesNouveaux.forEach(item => {
      const stockItem = stocks?.find(s => s.produit_id === item.id);
      if (stockItem && stockItem.quantite > 0) {
        updateStockMutation.mutate({
          id: stockItem.id,
          data: { quantite: stockItem.quantite - 1 }
        });
      }
    });

    updateProfileAchatMutation.mutate({
      id: profile.id,
      data: {
        credits: creditsDisponibles - totalChariot,
        articles_achetes: tousLesArticles,
        derniere_visite_epicerie: new Date().toISOString()
      }
    });

    // Alimenter la caisse avec les revenus
    if (caisse) {
      const nouvelleTransaction = {
        type: 'vente',
        montant: totalChariot,
        eleve_email: user?.email || 'inconnu',
        description: `Achat de ${articlesNouveaux.length} articles`,
        date: new Date().toISOString()
      };

      updateCaisseMutation.mutate({
        id: caisse.id,
        data: {
          total_credits: (caisse.total_credits ?? 0) + totalChariot,
          revenus_epicerie: (caisse.revenus_epicerie ?? 0) + totalChariot,
          derniere_transaction: new Date().toISOString(),
          historique_transactions: [...(caisse.historique_transactions ?? []), nouvelleTransaction]
        }
      });
    }
  };

  const reapprovisionner = (produit, rayonId) => {
    if (!roleEpicier) {
      setFeedback({ type: 'error', message: '❌ Tu dois être épicier pour réapprovisionner !' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    const stockExistant = stocks?.find(s => s.produit_id === produit.id);
    
    if (stockExistant) {
      updateStockMutation.mutate({
        id: stockExistant.id,
        data: {
          quantite: stockExistant.quantite + 10,
          derniere_livraison: new Date().toISOString()
        }
      });
    } else {
      createStockMutation.mutate({
        produit_id: produit.id,
        nom: produit.nom,
        emoji: produit.emoji,
        rayon: rayonId,
        quantite: 10,
        prix: produit.prix,
        derniere_livraison: new Date().toISOString()
      });
    }
    
    // Payer l'épicier pour son travail de réapprovisionnement
    payerEpicier(5, `Réapprovisionnement: +10 ${produit.nom}`);
    
    setFeedback({ type: 'success', message: `📦 +10 ${produit.nom} livrés ! (+5 crédits)` });
    setTimeout(() => setFeedback(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950">
        <BiolumiHeader currentPage="MicroFerme" />

        <main className="pt-20 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <Link to={createPageUrl('MicroFerme')}>
              <Button variant="outline" className="mb-4 border-emerald-400 text-emerald-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>

            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-emerald-300 mb-4">
                🏪 Épicerie de la Ferme - Circuit Court
              </h1>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-emerald-400/30">
                  <Coins className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-300 text-xl font-bold">Mon salaire: {creditsDisponibles} crédits</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl px-6 py-3 border border-emerald-400/30">
                  <span className="text-white text-lg font-bold">💰 Caisse Ferme: {caisse?.total_credits || 0} crédits</span>
                </div>
              </div>
              {roleEpicier && (
                <div className="flex flex-col items-center gap-2 mb-4">
                  <Button
                    onClick={() => setModeEpicier(!modeEpicier)}
                    className={`${
                      modeEpicier 
                        ? 'bg-gradient-to-r from-orange-600 to-red-700 border-2 border-orange-300' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-700'
                    }`}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {modeEpicier ? '🛒 Passer en Mode Client' : '📦 Passer en Mode Épicier'}
                  </Button>
                  {modeEpicier && (
                    <div className="text-xs text-purple-300 bg-purple-900/30 border border-purple-400/30 rounded-xl px-4 py-2">
                      📦 <strong>Mode Épicier actif</strong> — Clique sur un article pour réapprovisionner +10 unités (+5 crédits)
                    </div>
                  )}
                </div>
              )}
              <p className="text-emerald-300/70 mt-2 text-sm">
                🌍 Tu travailles → Tu es payé → Tu achètes ici → L'argent finance les salaires
              </p>
            </div>

            {/* Rayons */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {Object.entries(RAYONS).map(([rayonId, rayon]) => (
                <div key={rayonId} className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-emerald-400/20">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${rayon.color} mb-3`}>
                    <span className="text-2xl">{rayon.emoji}</span>
                    <span className="text-white font-bold">{rayon.nom}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {rayon.produits.map((produit) => {
                      const stockDispo = stocks?.find(s => s.produit_id === produit.id);
                      const quantiteStock = stockDispo?.quantite || 0;
                      const dejaAchete = articlesNouveaux.some(item => item.id === produit.id);
                      const enRupture = quantiteStock === 0;
                      const canAdd = peutAjouterArticle(produit.prix) && !dejaAchete && !enRupture;
                      
                      return (
                        <motion.button
                          key={produit.id}
                          onClick={() => {
                            if (modeEpicier) {
                              reapprovisionner(produit, rayonId);
                            } else {
                              canAdd && ajouterAuChariot(produit, stockDispo);
                            }
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-xl border-2 text-center transition-all relative ${
                            modeEpicier
                              ? 'bg-purple-500/20 border-purple-400 cursor-pointer hover:bg-purple-500/30'
                              : dejaAchete
                              ? 'bg-emerald-900/50 border-emerald-500 opacity-60 cursor-not-allowed'
                              : enRupture
                              ? 'bg-red-900/50 border-red-600 opacity-50 cursor-not-allowed'
                              : !canAdd 
                              ? 'bg-gray-900/50 border-gray-600 opacity-40 cursor-not-allowed' 
                              : 'bg-white/5 border-white/20 hover:bg-emerald-500/20 hover:border-emerald-400 cursor-pointer'
                          }`}
                        >
                          <div className="text-3xl mb-1">{produit.emoji}</div>
                          <div className="text-emerald-200 text-xs font-semibold mb-1 leading-tight">{produit.nom}</div>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Coins className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-300 text-xs font-bold">{produit.prix}</span>
                          </div>
                          {modeEpicier ? (
                            <>
                              <div className={`text-[9px] font-bold mt-1 ${enRupture ? 'text-red-400' : 'text-emerald-300'}`}>
                                📦 Stock: {quantiteStock}
                              </div>
                              <div className="text-[9px] text-purple-300 mt-0.5">+10 → +5 💰</div>
                            </>
                          ) : (
                            <>
                              {dejaAchete && <div className="text-emerald-400 text-[10px] mt-1">✓ Dans chariot</div>}
                              {enRupture && !dejaAchete && <div className="text-red-400 text-[10px] mt-1">❌ Rupture</div>}
                              {!enRupture && !dejaAchete && (
                                <div className={`text-[9px] mt-1 ${quantiteStock < 3 ? 'text-orange-400' : 'text-white/40'}`}>
                                  Stock: {quantiteStock}
                                </div>
                              )}
                            </>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Chariot Central + Caisse */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-4 border-emerald-400/30 min-h-[300px]">
                  <div className="flex items-center gap-3 mb-6">
                    <ShoppingCart className="w-8 h-8 text-emerald-400" />
                    <h2 className="text-3xl font-bold text-emerald-300">Chariot</h2>
                    <span className="text-emerald-300/70">({chariot.length} articles)</span>
                  </div>

                  {chariot.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingCart className="w-24 h-24 mx-auto mb-4 text-emerald-400/30" />
                      <p className="text-emerald-300/50 text-xl">Clique sur les articles pour les ajouter</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                      {chariot.map((item) => (
                        <motion.div
                          key={item.uniqueId}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          onClick={() => setFicheOuverte(item.id)}
                          className="relative p-3 rounded-xl bg-emerald-500/20 border-2 border-emerald-400/50 text-center group cursor-pointer hover:bg-emerald-500/30 transition-all"
                        >
                          {item.estNouveau && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                retirerDuChariot(item.uniqueId);
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          )}
                          <div className="text-4xl mb-1">{item.emoji}</div>
                          <div className="text-yellow-300 text-xs font-bold">{item.prix}</div>
                          <div className="text-emerald-300 text-[10px] mt-1 opacity-0 group-hover:opacity-100">ℹ️ Info</div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Caisse */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 backdrop-blur-xl rounded-2xl p-6 border-2 border-yellow-400/30 sticky top-24">
                  <h2 className="text-2xl font-bold text-yellow-300 mb-6 text-center">💰 Caisse</h2>

                  <div className="space-y-4 mb-6">
                    <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                      <div className="text-yellow-300/70 text-sm mb-1">Articles:</div>
                      <div className="text-yellow-200 text-2xl font-bold">{chariot.length}</div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                      <div className="text-yellow-300/70 text-sm mb-1">Total:</div>
                      <div className="flex items-center gap-2">
                        <Coins className="w-6 h-6 text-yellow-400" />
                        <span className="text-yellow-300 text-3xl font-bold">{totalChariot}</span>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                      <div className="text-yellow-300/70 text-sm mb-1">Reste:</div>
                      <span className={`text-2xl font-bold ${
                        creditsDisponibles - totalChariot >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {creditsDisponibles - totalChariot}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={validerAchat}
                    disabled={articlesNouveaux.length === 0 || totalChariot > creditsDisponibles}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 py-6 text-lg disabled:opacity-50"
                  >
                    {articlesNouveaux.length === 0 ? '🛒 Rien à payer' :
                     totalChariot > creditsDisponibles ? '❌ Crédits insuffisants' :
                     `✅ Payer ${totalChariot} crédits`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div className={`px-6 py-3 rounded-xl shadow-2xl border-2 text-white font-bold ${
                feedback.type === 'success' ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300'
              }`}>
                {feedback.message}
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Modale Fiche Pédagogique */}
          <AnimatePresence>
          {ficheOuverte && FICHES_PEDAGOGIQUES[ficheOuverte] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFicheOuverte(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-emerald-900 to-green-950 rounded-3xl p-8 max-w-3xl max-h-[90vh] overflow-y-auto border-4 border-emerald-400/50 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">{FICHES_PEDAGOGIQUES[ficheOuverte].emoji}</span>
                    <h2 className="text-4xl font-bold text-emerald-300">{FICHES_PEDAGOGIQUES[ficheOuverte].titre}</h2>
                  </div>
                  <button
                    onClick={() => setFicheOuverte(null)}
                    className="text-emerald-400 hover:text-emerald-300 text-4xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {FICHES_PEDAGOGIQUES[ficheOuverte].sections.map((section, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30"
                    >
                      <h3 className="text-2xl font-bold text-emerald-300 mb-3 flex items-center gap-2">
                        📚 {section.titre}
                      </h3>
                      {section.contenu && (
                        <p className="text-emerald-200 leading-relaxed text-lg">{section.contenu}</p>
                      )}
                      {section.liste && (
                        <ul className="space-y-2 mt-3">
                          {section.liste.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-emerald-200 text-lg">
                              <span className="text-emerald-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => setFicheOuverte(null)}
                  className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 py-6 text-lg"
                >
                  Fermer
                </Button>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>
          </div>
          );
          }