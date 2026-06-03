// Base de données complète ravageurs <-> auxiliaires de culture
// Organisée par secteur d'activité

export const SECTEURS = {
  maraichage: {
    id: 'maraichage',
    nom: 'Maraîchage',
    emoji: '🥦',
    couleur: 'green',
    description: 'Cultures légumières plein champ & sous serre',
  },
  arboriculture: {
    id: 'arboriculture',
    nom: 'Arboriculture',
    emoji: '🍎',
    couleur: 'red',
    description: 'Vergers & production fruitière',
  },
  viticulture: {
    id: 'viticulture',
    nom: 'Viticulture',
    emoji: '🍇',
    couleur: 'purple',
    description: 'Culture de la vigne',
  },
  pepiniere: {
    id: 'pepiniere',
    nom: 'Pépinière',
    emoji: '🌱',
    couleur: 'teal',
    description: 'Plantes ornementales & jeunes plants',
  },
};

export const ECO_PAIRS_ALL = [
  // ─── MARAÎCHAGE ────────────────────────────────────────────────────────
  {
    id: 'mp-001',
    secteur: 'maraichage',
    ravageur: {
      nom: 'Puceron vert du pêcher',
      nomLatin: 'Myzus persicae',
      emoji: '🦗',
      description: 'Colonise tiges et feuilles, transmet des virus.',
    },
    predateur: {
      nom: 'Coccinelle à 7 points',
      nomLatin: 'Coccinella septempunctata',
      emoji: '🐞',
      description: 'Un adulte dévore jusqu\'à 100 pucerons/jour.',
    },
  },
  {
    id: 'mp-002',
    secteur: 'maraichage',
    ravageur: {
      nom: 'Mouche blanche des serres',
      nomLatin: 'Trialeurodes vaporariorum',
      emoji: '🪰',
      description: 'Suceur de sève, affaiblit et encrasse les plantes.',
    },
    predateur: {
      nom: 'Encarsia formosa',
      nomLatin: 'Encarsia formosa',
      emoji: '🦟',
      description: 'Parasitoïde qui pond dans les nymphes de mouche blanche.',
    },
  },
  {
    id: 'mp-003',
    secteur: 'maraichage',
    ravageur: {
      nom: 'Thrips des fleurs',
      nomLatin: 'Frankliniella occidentalis',
      emoji: '🐛',
      description: 'Raye les feuilles et pétales, vecteur de virus.',
    },
    predateur: {
      nom: 'Orius insidiosus',
      nomLatin: 'Orius insidiosus',
      emoji: '🪲',
      description: 'Punaise prédatrice des thrips et acariens.',
    },
  },
  {
    id: 'mp-004',
    secteur: 'maraichage',
    ravageur: {
      nom: 'Acarien tétranyque tisserand',
      nomLatin: 'Tetranychus urticae',
      emoji: '🕷️',
      description: 'Tisse des toiles sur le dessous des feuilles.',
    },
    predateur: {
      nom: 'Phytoseiulus persimilis',
      nomLatin: 'Phytoseiulus persimilis',
      emoji: '🦂',
      description: 'Acarien prédateur spécialisé sur tétranyques.',
    },
  },
  {
    id: 'mp-005',
    secteur: 'maraichage',
    ravageur: {
      nom: 'Chenille de la noctuelle',
      nomLatin: 'Spodoptera exigua',
      emoji: '🐛',
      description: 'Mange le feuillage la nuit, très polyphage.',
    },
    predateur: {
      nom: 'Chrysope commune',
      nomLatin: 'Chrysoperla carnea',
      emoji: '🦗',
      description: 'Les larves de chrysope sont de voraces prédateurs.',
    },
  },
  {
    id: 'mp-006',
    secteur: 'maraichage',
    ravageur: {
      nom: 'Limace grise',
      nomLatin: 'Deroceras reticulatum',
      emoji: '🐌',
      description: 'Mange semis et jeunes plants la nuit.',
    },
    predateur: {
      nom: 'Hérisson d\'Europe',
      nomLatin: 'Erinaceus europaeus',
      emoji: '🦔',
      description: 'Consomme limaces, insectes et vers de terre.',
    },
  },
  {
    id: 'mp-007',
    secteur: 'maraichage',
    ravageur: {
      nom: 'Nématode des racines',
      nomLatin: 'Meloidogyne incognita',
      emoji: '🪱',
      description: 'Parasite interne des racines, galles caractéristiques.',
    },
    predateur: {
      nom: 'Nématode entomopathogène',
      nomLatin: 'Steinernema feltiae',
      emoji: '🪱',
      description: 'Parasite les larves d\'insectes dans le sol.',
    },
  },
  {
    id: 'mp-008',
    secteur: 'maraichage',
    ravageur: {
      nom: 'Sciaride des champignons',
      nomLatin: 'Bradysia spp.',
      emoji: '🦟',
      description: 'Larves détruisent les racines des semis.',
    },
    predateur: {
      nom: 'Hypoaspis miles',
      nomLatin: 'Stratiolaelaps scimitus',
      emoji: '🕷️',
      description: 'Acarien du sol prédateur des larves de sciarides.',
    },
  },

  // ─── ARBORICULTURE ──────────────────────────────────────────────────────
  {
    id: 'ar-001',
    secteur: 'arboriculture',
    ravageur: {
      nom: 'Carpocapse des pommes',
      nomLatin: 'Cydia pomonella',
      emoji: '🐛',
      description: 'Chenille qui creuse les fruits en les rendant impropres.',
    },
    predateur: {
      nom: 'Trichogramme',
      nomLatin: 'Trichogramma cacoeciae',
      emoji: '🦟',
      description: 'Micro-guêpe qui parasite les œufs de carpocapse.',
    },
  },
  {
    id: 'ar-002',
    secteur: 'arboriculture',
    ravageur: {
      nom: 'Puceron lanigère',
      nomLatin: 'Eriosoma lanigerum',
      emoji: '🦗',
      description: 'Forme des colonies cotonneuses sur les rameaux.',
    },
    predateur: {
      nom: 'Aphelinus mali',
      nomLatin: 'Aphelinus mali',
      emoji: '🦟',
      description: 'Parasitoïde spécifique du puceron lanigère.',
    },
  },
  {
    id: 'ar-003',
    secteur: 'arboriculture',
    ravageur: {
      nom: 'Psylle du poirier',
      nomLatin: 'Cacopsylla pyri',
      emoji: '🦗',
      description: 'Excréments collants (miellat) favorisent la fumagine.',
    },
    predateur: {
      nom: 'Anthocoris nemoralis',
      nomLatin: 'Anthocoris nemoralis',
      emoji: '🪲',
      description: 'Punaise prédatrice des psylles et autres ravageurs.',
    },
  },
  {
    id: 'ar-004',
    secteur: 'arboriculture',
    ravageur: {
      nom: 'Zeuzère du bois',
      nomLatin: 'Zeuzera pyrina',
      emoji: '🐛',
      description: 'Chenille xylophage qui creuse les branches.',
    },
    predateur: {
      nom: 'Pic épeiche',
      nomLatin: 'Dendrocopos major',
      emoji: '🐦',
      description: 'Extrait les larves xylophages de l\'écorce.',
    },
  },
  {
    id: 'ar-005',
    secteur: 'arboriculture',
    ravageur: {
      nom: 'Cochenille de San José',
      nomLatin: 'Comstock quadraspidiotus perniciosus',
      emoji: '🦗',
      description: 'Suceur de sève sous carapace circulaire.',
    },
    predateur: {
      nom: 'Chilocorus bipustulatus',
      nomLatin: 'Chilocorus bipustulatus',
      emoji: '🐞',
      description: 'Coccinelle spécialisée dans la prédation des cochenilles.',
    },
  },
  {
    id: 'ar-006',
    secteur: 'arboriculture',
    ravageur: {
      nom: 'Tordeuse des bourgeons',
      nomLatin: 'Archips podana',
      emoji: '🐛',
      description: 'Enroule les feuilles pour s\'y abriter et s\'y nourrir.',
    },
    predateur: {
      nom: 'Bacillus thuringiensis',
      nomLatin: 'Bacillus thuringiensis',
      emoji: '🦠',
      description: 'Bactérie entomopathogène utilisée en biocontrôle.',
    },
  },

  // ─── VITICULTURE ────────────────────────────────────────────────────────
  {
    id: 'vi-001',
    secteur: 'viticulture',
    ravageur: {
      nom: 'Eudémis de la vigne',
      nomLatin: 'Lobesia botrana',
      emoji: '🦋',
      description: '2e génération perfore les grains, favorise la pourriture.',
    },
    predateur: {
      nom: 'Trichogramme euproctidis',
      nomLatin: 'Trichogramma euproctidis',
      emoji: '🦟',
      description: 'Parasite les œufs de la tordeuse de la grappe.',
    },
  },
  {
    id: 'vi-002',
    secteur: 'viticulture',
    ravageur: {
      nom: 'Cicadelle verte de la vigne',
      nomLatin: 'Empoasca vitis',
      emoji: '🦗',
      description: 'Piqûres entrainent un jaunissement (grillure) des feuilles.',
    },
    predateur: {
      nom: 'Anagrus atomus',
      nomLatin: 'Anagrus atomus',
      emoji: '🦟',
      description: 'Parasitoïde des œufs de cicadelles.',
    },
  },
  {
    id: 'vi-003',
    secteur: 'viticulture',
    ravageur: {
      nom: 'Typhlodromes de la vigne',
      nomLatin: 'Panonychus ulmi',
      emoji: '🕷️',
      description: 'Acarien rouge qui bronze le feuillage.',
    },
    predateur: {
      nom: 'Kampimodromus aberrans',
      nomLatin: 'Kampimodromus aberrans',
      emoji: '🦂',
      description: 'Acarien phytoséiide indigène des vignobles.',
    },
  },
  {
    id: 'vi-004',
    secteur: 'viticulture',
    ravageur: {
      nom: 'Cochenille farineuse de la vigne',
      nomLatin: 'Planococcus ficus',
      emoji: '🦗',
      description: 'Colonise les bois et transmet des virus de l\'enroulement.',
    },
    predateur: {
      nom: 'Cryptolaemus montrouzieri',
      nomLatin: 'Cryptolaemus montrouzieri',
      emoji: '🐞',
      description: 'Coccinelle prédatrice des cochenilles farineuses.',
    },
  },

  // ─── PÉPINIÈRE ──────────────────────────────────────────────────────────
  {
    id: 'pe-001',
    secteur: 'pepiniere',
    ravageur: {
      nom: 'Otiorhynque du fraisier',
      nomLatin: 'Otiorhynchus sulcatus',
      emoji: '🪲',
      description: 'Les larves rongent les racines ; adultes découpent les feuilles.',
    },
    predateur: {
      nom: 'Nématode Heterorhabditis',
      nomLatin: 'Heterorhabditis bacteriophora',
      emoji: '🪱',
      description: 'Parasite les larves d\'otiorhynques dans le sol.',
    },
  },
  {
    id: 'pe-002',
    secteur: 'pepiniere',
    ravageur: {
      nom: 'Puceron noir du sureau',
      nomLatin: 'Aphis sambuci',
      emoji: '🦗',
      description: 'Colonies denses sur pousses tendres et jeunes plants.',
    },
    predateur: {
      nom: 'Syrphe porte-plume',
      nomLatin: 'Episyrphus balteatus',
      emoji: '🦟',
      description: 'Les larves de cette mouche consomment des pucerons.',
    },
  },
  {
    id: 'pe-003',
    secteur: 'pepiniere',
    ravageur: {
      nom: 'Acarien rouge des conifères',
      nomLatin: 'Oligonychus ununguis',
      emoji: '🕷️',
      description: 'Bronze et décolore les aiguilles et feuilles.',
    },
    predateur: {
      nom: 'Feltiella acarisuga',
      nomLatin: 'Feltiella acarisuga',
      emoji: '🦟',
      description: 'Cécidomyie dont les larves se nourrissent d\'acariens.',
    },
  },
  {
    id: 'pe-004',
    secteur: 'pepiniere',
    ravageur: {
      nom: 'Mineuse du marronnier',
      nomLatin: 'Cameraria ohridella',
      emoji: '🦋',
      description: 'Larves creusent des mines dans les feuilles.',
    },
    predateur: {
      nom: 'Mésange bleue',
      nomLatin: 'Cyanistes caeruleus',
      emoji: '🐦',
      description: 'Se nourrit des larves de mineuses en hiver.',
    },
  },
];

// Fonction utilitaire pour filtrer par secteur
export function getPairsBySecteur(secteurId) {
  return ECO_PAIRS_ALL.filter(p => p.secteur === secteurId);
}