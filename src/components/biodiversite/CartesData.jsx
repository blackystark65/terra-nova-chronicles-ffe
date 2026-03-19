// ─────────────────────────────────────────────────────────────────
// BASE DE DONNÉES BIODIVERSITÉ EUROPÉENNE — 80+ espèces
// Thème : écosystèmes, faune, flore, interactions avec le milieu
// ─────────────────────────────────────────────────────────────────

export const CARTES = [

  // ═══════════════════════════════
  // OISEAUX — chanteurs et communs
  // ═══════════════════════════════
  { id: 'rouge_gorge', nom: 'Rouge-gorge', nom_en: 'Robin', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-orange-500 to-red-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Erithacus_rubecula_with_cocked_head.jpg/320px-Erithacus_rubecula_with_cocked_head.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Erithacus_rubecula_song.ogg',
    description: 'Petit oiseau au ventre orange. Chant flûté. Disperse les graines en forêt.', points: 10 },

  { id: 'merle', nom: 'Merle noir', nom_en: 'Blackbird', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-slate-700 to-slate-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Turdus-merula-002.jpg/320px-Turdus-merula-002.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Turdus-merula-song.ogg',
    description: 'Bec jaune chez le mâle. Chant mélodieux au crépuscule. Disperse les baies.', points: 10 },

  { id: 'pic_epeiche', nom: 'Pic épeiche', nom_en: 'Great spotted woodpecker', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-red-600 to-rose-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Dendrocopos_major_-_01.jpg/320px-Dendrocopos_major_-_01.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Dendrocopos_major_drum.ogg',
    description: 'Creuse les arbres morts, logeant chouettes et chauves-souris. Essentiel.', points: 15 },

  { id: 'chouette', nom: 'Chouette hulotte', nom_en: 'Tawny owl', categorie: 'Oiseau', emoji: '🦉', couleur: 'from-amber-700 to-yellow-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Strix_aluco_-_01.jpg/320px-Strix_aluco_-_01.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Strix_aluco_hoot.ogg',
    description: 'Rapace nocturne. Régule les populations de rongeurs en forêt.', points: 15 },

  { id: 'mesange', nom: 'Mésange bleue', nom_en: 'Blue tit', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-blue-500 to-cyan-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Cyanistes_caeruleus_-_Parc_naturel_regional_du_Perche_-_02.jpg/320px-Cyanistes_caeruleus_-_Parc_naturel_regional_du_Perche_-_02.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cyanistes_caeruleus_song.ogg',
    description: 'Mange des chenilles ravageuses. Indispensable à l\'équilibre des forêts.', points: 10 },

  { id: 'fauvette', nom: 'Fauvette à tête noire', nom_en: 'Blackcap warbler', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-gray-600 to-slate-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Sylvia_atricapilla_-_01.jpg/320px-Sylvia_atricapilla_-_01.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Sylvia_atricapilla_song.ogg',
    description: 'Chant puissant. Disperseur clé de graines de baies sauvages.', points: 12 },

  { id: 'hirondelle', nom: 'Hirondelle de fenêtre', nom_en: 'House martin', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-slate-600 to-blue-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Common_house_martin.jpg/320px-Common_house_martin.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Delichon_urbicum_song.ogg',
    description: 'Migrateur africain. Capture des insectes en vol. Bioindicateur de qualité de l\'air.', points: 12 },

  { id: 'cigogne', nom: 'Cigogne blanche', nom_en: 'White stork', categorie: 'Oiseau', emoji: '🦢', couleur: 'from-slate-200 to-slate-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ciconia_ciconia_-_02.jpg/320px-Ciconia_ciconia_-_02.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Ciconia_ciconia_clattering.ogg',
    description: 'Grand migrateur. Régule grenouilles et rongeurs dans les zones humides.', points: 15 },

  { id: 'martin_pecheur', nom: 'Martin-pêcheur', nom_en: 'Common kingfisher', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-blue-500 to-orange-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Alcedo_atthis_-_Riserva_Naturale_Tevere_Farfa.jpg/320px-Alcedo_atthis_-_Riserva_Naturale_Tevere_Farfa.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Alcedo_atthis_call.ogg',
    description: 'Plumage bleu turquoise. Indicateur de rivières propres et poissonneuses.', points: 18 },

  { id: 'faucon_crecerelle', nom: 'Faucon crécerelle', nom_en: 'Common kestrel', categorie: 'Oiseau', emoji: '🦅', couleur: 'from-amber-600 to-red-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Falco_tinnunculus_-_01.jpg/320px-Falco_tinnunculus_-_01.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Falco_tinnunculus_call.ogg',
    description: 'Rapace diurne qui fait du "vol du Saint-Esprit". Régule les campagnols.', points: 15 },

  { id: 'milan_noir', nom: 'Milan noir', nom_en: 'Black kite', categorie: 'Oiseau', emoji: '🦅', couleur: 'from-amber-800 to-stone-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Black_Kite_Milvus_migrans.jpg/320px-Black_Kite_Milvus_migrans.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Milvus_migrans_call.ogg',
    description: 'Rapace migrateur. Nettoie carcasses et déchets organiques — éboueur naturel.', points: 15 },

  { id: 'buse', nom: 'Buse variable', nom_en: 'Common buzzard', categorie: 'Oiseau', emoji: '🦅', couleur: 'from-amber-700 to-stone-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Buteo_buteo_1_%28Marek_Szczepanek%29.jpg/320px-Buteo_buteo_1_%28Marek_Szczepanek%29.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Buteo_buteo_mew.ogg',
    description: 'Rapace commun des campagnes. Consomme mulots, campagnols et lapereaux.', points: 12 },

  { id: 'pic_vert', nom: 'Pic vert', nom_en: 'Green woodpecker', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-green-600 to-lime-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Picus_viridis_sharpened.jpg/320px-Picus_viridis_sharpened.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Picus_viridis_call.ogg',
    description: 'Fouille les fourmilières. Son "rire" caractéristique. Essentiel aux sols.', points: 15 },

  { id: 'roitelet', nom: 'Roitelet huppé', nom_en: 'Goldcrest', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-yellow-500 to-green-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Regulus_regulus_regulus_male.jpg/320px-Regulus_regulus_regulus_male.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Regulus_regulus_song.ogg',
    description: 'Le plus petit oiseau d\'Europe. Mange les œufs d\'insectes ravageurs en hiver.', points: 18 },

  { id: 'tourterelle', nom: 'Tourterelle des bois', nom_en: 'European turtle dove', categorie: 'Oiseau', emoji: '🕊️', couleur: 'from-rose-400 to-amber-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Streptopelia_turtur_-_01.jpg/320px-Streptopelia_turtur_-_01.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Streptopelia_turtur_song.ogg',
    description: 'Espèce en déclin critique. Migrateur d\'Afrique. Symbole de la paix.', points: 20 },

  { id: 'bergeronnette', nom: 'Bergeronnette grise', nom_en: 'White wagtail', categorie: 'Oiseau', emoji: '🐦', couleur: 'from-slate-400 to-gray-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Motacilla_alba_alba_male.jpg/320px-Motacilla_alba_alba_male.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Motacilla_alba_call.ogg',
    description: 'Queue toujours en mouvement. Mange les insectes des zones humides.', points: 12 },

  // ═══════════════════
  // MAMMIFÈRES
  // ═══════════════════
  { id: 'renard', nom: 'Renard roux', nom_en: 'Red fox', categorie: 'Mammifère', emoji: '🦊', couleur: 'from-orange-600 to-red-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rotfuchs_2.jpg/320px-Rotfuchs_2.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Vulpes_vulpes_call.ogg',
    description: 'Régulateur de rongeurs et lapins. Disperse des graines en mangeant des fruits.', points: 10 },

  { id: 'chevreuil', nom: 'Chevreuil', nom_en: 'Roe deer', categorie: 'Mammifère', emoji: '🦌', couleur: 'from-amber-600 to-orange-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Capreolus_capreolus_2_%28Kees_Vegelin%29.jpg/320px-Capreolus_capreolus_2_%28Kees_Vegelin%29.jpg',
    son_url: null,
    description: 'Petit cervidé qui broute et taille naturellement la végétation forestière.', points: 12 },

  { id: 'herisson', nom: 'Hérisson', nom_en: 'Hedgehog', categorie: 'Mammifère', emoji: '🦔', couleur: 'from-yellow-700 to-amber-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Erinaceus_europaeus_LC0119.jpg/320px-Erinaceus_europaeus_LC0119.jpg',
    son_url: null,
    description: 'Consomme limaces, escargots et insectes. Allié précieux du jardinier.', points: 10 },

  { id: 'blaireau', nom: 'Blaireau', nom_en: 'Badger', categorie: 'Mammifère', emoji: '🦡', couleur: 'from-gray-600 to-zinc-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/European_badger.jpg/320px-European_badger.jpg',
    son_url: null,
    description: 'Fouisseur qui aère le sol. Mange les vers de terre et régule les terriers.', points: 15 },

  { id: 'chauve_souris', nom: 'Chauve-souris commune', nom_en: 'Common pipistrelle', categorie: 'Mammifère', emoji: '🦇', couleur: 'from-purple-800 to-indigo-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Pipistrellus_pipistrellus.jpg/320px-Pipistrellus_pipistrellus.jpg',
    son_url: null,
    description: 'Mange 3000 moustiques par nuit ! Pollinise certaines fleurs nocturnes.', points: 15 },

  { id: 'ecureuil', nom: 'Écureuil roux', nom_en: 'Red squirrel', categorie: 'Mammifère', emoji: '🐿️', couleur: 'from-red-600 to-amber-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sciurus_vulgaris_Variable_Motor_Glasgow.jpg/320px-Sciurus_vulgaris_Variable_Motor_Glasgow.jpg',
    son_url: null,
    description: 'Enterre des glands et noisettes oubliés — plante ainsi de futurs chênes !', points: 12 },

  { id: 'loutre', nom: 'Loutre d\'Europe', nom_en: 'European otter', categorie: 'Mammifère', emoji: '🦦', couleur: 'from-amber-800 to-stone-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/European_otter_%28Lutra_lutra%29.jpg/320px-European_otter_%28Lutra_lutra%29.jpg',
    son_url: null,
    description: 'Indicateur de rivières propres. Régule les poissons et amphibiens.', points: 18 },

  // ═══════════════════
  // BATRACIENS & REPTILES
  // ═══════════════════
  { id: 'grenouille', nom: 'Grenouille verte', nom_en: 'Green frog', categorie: 'Batracien', emoji: '🐸', couleur: 'from-green-500 to-emerald-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Rana_esculenta_-_Naaldwijk.jpg/320px-Rana_esculenta_-_Naaldwijk.jpg',
    son_url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Rana_ridibunda.ogg',
    description: 'Bioindicateur de la santé des zones humides. Mange moustiques et insectes.', points: 10 },

  { id: 'salamandre', nom: 'Salamandre tachetée', nom_en: 'Fire salamander', categorie: 'Batracien', emoji: '🦎', couleur: 'from-yellow-500 to-slate-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Salamandra_salamandra_Luc_Viatour.jpg/320px-Salamandra_salamandra_Luc_Viatour.jpg',
    son_desc: null,
    description: 'Amphibien des sous-bois humides. Peau toxique. Indicateur de forêts saines.', points: 20 },

  { id: 'triton', nom: 'Triton alpestre', nom_en: 'Alpine newt', categorie: 'Batracien', emoji: '🦎', couleur: 'from-blue-600 to-indigo-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ichthyosaura_alpestris_male_%28Luc_Viatour%29.jpg/320px-Ichthyosaura_alpestris_male_%28Luc_Viatour%29.jpg',
    son_desc: null,
    description: 'Se reproduit dans les mares propres et fraîches. Ventre orange caractéristique.', points: 20 },

  { id: 'lezard', nom: 'Lézard vert', nom_en: 'Green lizard', categorie: 'Reptile', emoji: '🦎', couleur: 'from-lime-500 to-green-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Lacerta_viridis_male_%28Luc_Viatour%29.jpg/320px-Lacerta_viridis_male_%28Luc_Viatour%29.jpg',
    son_desc: null,
    description: 'Régule les insectes des lisières. Indicateur de milieux chauds et ensoleillés.', points: 12 },

  { id: 'orvet', nom: 'Orvet fragile', nom_en: 'Slow worm', categorie: 'Reptile', emoji: '🐍', couleur: 'from-amber-500 to-yellow-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Anguis_fragilis.jpg/320px-Anguis_fragilis.jpg',
    son_desc: null,
    description: 'Lézard sans pattes inoffensif. Mange limaces et vers — ami du compost !', points: 15 },

  { id: 'couleuvre', nom: 'Couleuvre à collier', nom_en: 'Grass snake', categorie: 'Reptile', emoji: '🐍', couleur: 'from-green-700 to-emerald-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Natrix_natrix_2_%28Piotr_Kuczynski%29.jpg/320px-Natrix_natrix_2_%28Piotr_Kuczynski%29.jpg',
    son_desc: null,
    description: 'Serpent non venimeux. Excellent nageur, régule grenouilles et petits rongeurs.', points: 15 },

  // ═══════════════════
  // INSECTES POLLINISATEURS
  // ═══════════════════
  { id: 'abeille', nom: 'Abeille mellifère', nom_en: 'Honeybee', categorie: 'Insecte', emoji: '🐝', couleur: 'from-yellow-400 to-amber-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_flying.jpg/320px-Apis_mellifera_flying.jpg',
    son_desc: 'Honeybee buzzing, high pitched hum busy bee in flowers',
    description: 'Pollinisatrice de 80% des plantes à fleurs. Sans elle, l\'agriculture s\'effondre.', points: 10 },

  { id: 'bourdon', nom: 'Bourdon des prés', nom_en: 'Bumblebee', categorie: 'Insecte', emoji: '🐝', couleur: 'from-yellow-500 to-orange-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Bombus_pascuorum_Niels_Elzenga.jpg/320px-Bombus_pascuorum_Niels_Elzenga.jpg',
    son_desc: 'Bumblebee low deep buzzing, loud rumble buzz in flower',
    description: 'Pollinise par vibration (buzz pollination). Indispensable aux tomates sauvages.', points: 10 },

  { id: 'papillon_paon', nom: 'Paon du jour', nom_en: 'Peacock butterfly', categorie: 'Insecte', emoji: '🦋', couleur: 'from-red-600 to-purple-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Aglais_io_top.jpg/320px-Aglais_io_top.jpg',
    son_desc: null,
    description: 'Papillon aux ocelles en forme d\'yeux. Se nourrit des fleurs de l\'ortie.', points: 12 },

  { id: 'papillon_monarque', nom: 'Vulcain', nom_en: 'Red admiral butterfly', categorie: 'Insecte', emoji: '🦋', couleur: 'from-red-700 to-slate-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Vanessa_atalanta_Mietesheim.jpg/320px-Vanessa_atalanta_Mietesheim.jpg',
    son_desc: null,
    description: 'Migrateur partiel. Pollinisateur des lilas et orties. Apparaît en automne.', points: 15 },

  { id: 'coccinelle', nom: 'Coccinelle à 7 points', nom_en: 'Seven-spot ladybird', categorie: 'Insecte', emoji: '🐞', couleur: 'from-red-500 to-red-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Coccinella_septempunctata01.jpg/320px-Coccinella_septempunctata01.jpg',
    son_desc: null,
    description: 'Mange 150 pucerons par jour. Alliée essentielle des agriculteurs bio.', points: 10 },

  { id: 'libellule', nom: 'Libellule bleue', nom_en: 'Azure damselfly', categorie: 'Insecte', emoji: '🪲', couleur: 'from-blue-500 to-cyan-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Coenagrion_puella_male_%28aka%29.jpg/320px-Coenagrion_puella_male_%28aka%29.jpg',
    son_desc: null,
    description: 'Prédatrice de moustiques à tous les stades. Indicatrice de zones humides saines.', points: 12 },

  // ═══════════════════
  // FLEURS SAUVAGES
  // ═══════════════════
  { id: 'coquelicot', nom: 'Coquelicot', nom_en: 'Poppy', categorie: 'Fleur', emoji: '🌺', couleur: 'from-red-500 to-rose-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Poppies_in_Flanders_Fields.jpg/320px-Poppies_in_Flanders_Fields.jpg',
    son_desc: null,
    description: 'Indicateur de sol argilo-calcaire perturbé. Nourrit abeilles et papillons.', points: 8 },

  { id: 'pissenlit', nom: 'Pissenlit', nom_en: 'Dandelion', categorie: 'Fleur', emoji: '🌼', couleur: 'from-yellow-400 to-yellow-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Taraxacum_officinale_-_Koeh-183.jpg/320px-Taraxacum_officinale_-_Koeh-183.jpg',
    son_desc: null,
    description: 'Première source de pollen au printemps pour les abeilles. Feuilles comestibles.', points: 8 },

  { id: 'primevere', nom: 'Primevère officinale', nom_en: 'Cowslip', categorie: 'Fleur', emoji: '🌼', couleur: 'from-yellow-400 to-amber-500',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Primula_veris_flowers.jpg/320px-Primula_veris_flowers.jpg',
    son_desc: null,
    description: 'Première fleur du printemps. Hôte du papillon Azuré. Fleurs médicinales.', points: 12 },

  { id: 'violette', nom: 'Violette odorante', nom_en: 'Sweet violet', categorie: 'Fleur', emoji: '💜', couleur: 'from-violet-500 to-purple-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/ViolettaOdorata.jpg/320px-ViolettaOdorata.jpg',
    son_desc: null,
    description: 'Parfum délicat. Hôte de chenilles de fritillaires. Comestible en salade.', points: 10 },

  { id: 'bourrache', nom: 'Bourrache officinale', nom_en: 'Borage', categorie: 'Fleur', emoji: '🌸', couleur: 'from-blue-400 to-indigo-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Borago_officinalis_flower.jpg/320px-Borago_officinalis_flower.jpg',
    son_desc: null,
    description: 'Fleurs bleues comestibles. Attire bourdons et abeilles. Compagne idéale des tomates.', points: 12 },

  { id: 'millepertuis', nom: 'Millepertuis perforé', nom_en: 'St John\'s wort', categorie: 'Fleur', emoji: '🌼', couleur: 'from-yellow-500 to-orange-500',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hypericum_perforatum_flowers.jpg/320px-Hypericum_perforatum_flowers.jpg',
    son_desc: null,
    description: 'Plante médicinale aux fleurs jaunes. Refuge de nombreux insectes pollinisateurs.', points: 12 },

  { id: 'valerian', nom: 'Valériane officinale', nom_en: 'Common valerian', categorie: 'Fleur', emoji: '🌸', couleur: 'from-pink-400 to-rose-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Valeriana_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-279.jpg/320px-Valeriana_officinalis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-279.jpg',
    son_desc: null,
    description: 'Attire irrésistiblement les chats et les papillons. Racines médicinales sédatives.', points: 12 },

  { id: 'caillou_blanc', nom: 'Marguerite commune', nom_en: 'Oxeye daisy', categorie: 'Fleur', emoji: '🌼', couleur: 'from-white/20 to-yellow-500',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Leucanthemum_vulgare_%28Marguerite%29.jpg/320px-Leucanthemum_vulgare_%28Marguerite%29.jpg',
    son_desc: null,
    description: 'Prairie fleurie. Nourrit guêpes, abeilles et syrphes pollinisateurs.', points: 8 },

  // ═══════════════════
  // ARBUSTES & PETITS FRUITS
  // ═══════════════════
  { id: 'sureau', nom: 'Sureau noir', nom_en: 'Elderberry', categorie: 'Arbuste', emoji: '🌳', couleur: 'from-purple-600 to-indigo-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Sambucus_nigra_003.jpg/320px-Sambucus_nigra_003.jpg',
    son_desc: null,
    description: 'Arbuste mellifère. Fleurs et baies comestibles. Refuge pour 50 espèces d\'insectes.', points: 12 },

  { id: 'aubepine', nom: 'Aubépine', nom_en: 'Hawthorn', categorie: 'Arbuste', emoji: '🌳', couleur: 'from-rose-500 to-red-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Crataegus_monogyna_flowers.jpg/320px-Crataegus_monogyna_flowers.jpg',
    son_desc: null,
    description: 'Épines protègent oiseaux nicheurs. Baies rouges nourrissent merles et grives en hiver.', points: 12 },

  { id: 'prunellier', nom: 'Prunellier', nom_en: 'Blackthorn', categorie: 'Arbuste', emoji: '🌳', couleur: 'from-slate-700 to-purple-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Prunus_spinosa_flowers.jpg/320px-Prunus_spinosa_flowers.jpg',
    son_desc: null,
    description: 'Premier à fleurir avant les feuilles. Prunelles pour le gin et gelées. Refuge à insectes.', points: 12 },

  { id: 'noisetier', nom: 'Noisetier commun', nom_en: 'Common hazel', categorie: 'Arbuste', emoji: '🌰', couleur: 'from-amber-600 to-brown-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Corylus_avellana_002.jpg/320px-Corylus_avellana_002.jpg',
    son_desc: null,
    description: 'Noisettes pour écureuils et geais. Pollinisation par le vent dès janvier.', points: 12 },

  { id: 'myrtille', nom: 'Myrtille', nom_en: 'Bilberry', categorie: 'Arbuste', emoji: '🫐', couleur: 'from-indigo-600 to-purple-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Vaccinium_myrtillus.jpg/320px-Vaccinium_myrtillus.jpg',
    son_desc: null,
    description: 'Sous-arbuste des forêts acides. Baies riches en antioxydants. Nourriture de gelinottes.', points: 12 },

  { id: 'framboisier', nom: 'Framboisier', nom_en: 'Raspberry', categorie: 'Arbuste', emoji: '🍓', couleur: 'from-pink-600 to-red-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Framboise_r.jpg/320px-Framboise_r.jpg',
    son_desc: null,
    description: 'Colonise les clairières forestières. Baies adorées des oiseaux et des ours.', points: 10 },

  { id: 'ronce', nom: 'Ronce commune', nom_en: 'Blackberry', categorie: 'Arbuste', emoji: '🫐', couleur: 'from-slate-800 to-purple-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Blackberry_flowers_arp.jpg/320px-Blackberry_flowers_arp.jpg',
    son_desc: null,
    description: 'Mûres essentielles pour oiseaux migrateurs en automne. Épines protègent nids.', points: 10 },

  { id: 'genêt', nom: 'Genêt à balais', nom_en: 'Broom', categorie: 'Arbuste', emoji: '🌿', couleur: 'from-yellow-500 to-green-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Cytisus_scoparius_close.jpg/320px-Cytisus_scoparius_close.jpg',
    son_desc: null,
    description: 'Fixe l\'azote dans le sol pauvre. Fleurs mellifères. Habitat de la fauvette.', points: 15 },

  { id: 'viorne', nom: 'Viorne obier', nom_en: 'Guelder rose', categorie: 'Arbuste', emoji: '🌸', couleur: 'from-white/20 to-green-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Snowball_tree_%28Viburnum_opulus%29.jpg/320px-Snowball_tree_%28Viburnum_opulus%29.jpg',
    son_desc: null,
    description: 'Baies rouges en grappes. Nourrit les merles et listes en hiver. Fleurs en couronne.', points: 12 },

  // ═══════════════════
  // ARBRES FRUITIERS SAUVAGES & FORESTIERS
  // ═══════════════════
  { id: 'chene', nom: 'Chêne pédonculé', nom_en: 'English oak', categorie: 'Arbre', emoji: '🌳', couleur: 'from-amber-700 to-green-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Quercus_robur_%28Eiche%29.jpg/320px-Quercus_robur_%28Eiche%29.jpg',
    son_desc: null,
    description: 'Roi des forêts. Abrite 500 espèces d\'insectes. Les glands nourrissent sangliers et geais.', points: 15 },

  { id: 'hetre', nom: 'Hêtre commun', nom_en: 'European beech', categorie: 'Arbre', emoji: '🌳', couleur: 'from-green-700 to-emerald-900',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Fagus_sylvatica_%28Zell_am_See%29.jpg/320px-Fagus_sylvatica_%28Zell_am_See%29.jpg',
    son_desc: null,
    description: 'Faînes riches en lipides, nourriture des geais et pinsons. Bois mort refuge à insectes.', points: 15 },

  { id: 'merisier', nom: 'Merisier', nom_en: 'Wild cherry', categorie: 'Arbre', emoji: '🍒', couleur: 'from-red-500 to-rose-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Prunus_avium_flowers.jpg/320px-Prunus_avium_flowers.jpg',
    son_desc: null,
    description: 'Cerisier sauvage. Fleurs nectarifères printanières. Cerises pour merles et fauvettes.', points: 12 },

  { id: 'pommier_sauvage', nom: 'Pommier sauvage', nom_en: 'Crab apple', categorie: 'Arbre', emoji: '🍎', couleur: 'from-red-400 to-green-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Apple_tree_blossoms.jpg/320px-Apple_tree_blossoms.jpg',
    son_desc: null,
    description: 'Pollinisateur des pommiers cultivés. Petites pommes sauvages pour la gelée.', points: 12 },

  { id: 'alisier', nom: 'Alisier blanc', nom_en: 'Whitebeam', categorie: 'Arbre', emoji: '🌳', couleur: 'from-green-500 to-slate-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sorbus_aria_2006-04-25.jpg/320px-Sorbus_aria_2006-04-25.jpg',
    son_desc: null,
    description: 'Baies orangées pour oiseaux migrateurs. Résiste aux sols calcaires secs.', points: 15 },

  { id: 'frene', nom: 'Frêne commun', nom_en: 'Common ash', categorie: 'Arbre', emoji: '🌳', couleur: 'from-gray-500 to-green-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Fraxinus_excelsior_%28Gemeine_Esche%29_%281%29.jpg/320px-Fraxinus_excelsior_%28Gemeine_Esche%29_%281%29.jpg',
    son_desc: null,
    description: 'Bois élastique traditionnel. Graines (samares) nourrissent mésanges en hiver.', points: 12 },

  { id: 'tilleul', nom: 'Tilleul à grandes feuilles', nom_en: 'Large-leaved lime', categorie: 'Arbre', emoji: '🌳', couleur: 'from-yellow-400 to-green-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tilia_platyphyllos_flowers_1.jpg/320px-Tilia_platyphyllos_flowers_1.jpg',
    son_desc: null,
    description: 'Fleurs mellifères par excellence. Le bourdonnement des abeilles l\'enveloppe en juillet.', points: 12 },

  { id: 'poirier_sauvage', nom: 'Poirier sauvage', nom_en: 'Wild pear', categorie: 'Arbre', emoji: '🍐', couleur: 'from-green-500 to-yellow-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Pyrus_communis_subsp_pyraster_flowers_2.jpg/320px-Pyrus_communis_subsp_pyraster_flowers_2.jpg',
    son_desc: null,
    description: 'Arbre rare et précieux. Pollinisateur des poiriers cultivés. Bois dur et durable.', points: 15 },

  // ═══════════════════
  // AROMATIQUES & MÉDICINALES
  // ═══════════════════
  { id: 'menthe', nom: 'Menthe sauvage', nom_en: 'Wild mint', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-green-400 to-teal-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Minze.jpg/320px-Minze.jpg',
    son_desc: null,
    description: 'Colonise les berges. Attire papillons et abeilles. Repousse les pucerons.', points: 10 },

  { id: 'thym', nom: 'Thym serpolet', nom_en: 'Wild thyme', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-pink-400 to-purple-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Thymus_serpyllum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-275.jpg/320px-Thymus_serpyllum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-275.jpg',
    son_desc: null,
    description: 'Tapisse les pelouses sèches. Refuge de l\'Azuré du serpolet — papillon rare.', points: 10 },

  { id: 'ortie', nom: 'Ortie dioïque', nom_en: 'Stinging nettle', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-green-600 to-emerald-800',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Urtica_dioica_7.jpg/320px-Urtica_dioica_7.jpg',
    son_desc: null,
    description: 'Hôte de 40 espèces de papillons. Riche en fer. Lisier d\'ortie = engrais naturel.', points: 10 },

  { id: 'lavande', nom: 'Lavande vraie', nom_en: 'True lavender', categorie: 'Aromatique', emoji: '💜', couleur: 'from-purple-500 to-violet-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Above_the_Lavender_Fields.jpg/320px-Above_the_Lavender_Fields.jpg',
    son_desc: null,
    description: 'Attire bourdons, abeilles et papillons. Huile essentielle antiseptique naturelle.', points: 10 },

  { id: 'romarin', nom: 'Romarin', nom_en: 'Rosemary', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-blue-400 to-green-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Rosemaryflower.jpg/320px-Rosemaryflower.jpg',
    son_desc: null,
    description: 'Fleurs bleues mellifères dès janvier. Répulsif naturel contre les mouches.', points: 10 },

  { id: 'achillee', nom: 'Achillée millefeuille', nom_en: 'Yarrow', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-white/20 to-green-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Achillea_millefolium_-_Koeh-083.jpg/320px-Achillea_millefolium_-_Koeh-083.jpg',
    son_desc: null,
    description: 'Plante médicinale hémostatique. Attire guêpes et syrphes prédateurs d\'insectes.', points: 12 },

  { id: 'fenouil', nom: 'Fenouil sauvage', nom_en: 'Wild fennel', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-yellow-400 to-green-600',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Foeniculum_vulgare_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-063.jpg/320px-Foeniculum_vulgare_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-063.jpg',
    son_desc: null,
    description: 'Plante hôte du machaon (papillon). Fleurs en ombelles pour syrphes et guêpes.', points: 12 },

  { id: 'consoude', nom: 'Consoude officinale', nom_en: 'Common comfrey', categorie: 'Aromatique', emoji: '🌿', couleur: 'from-purple-400 to-green-700',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Symphytum_officinale_L_%28Comfrey%29.jpg/320px-Symphytum_officinale_L_%28Comfrey%29.jpg',
    son_desc: null,
    description: 'Accumulatrice de potasse. Lisier de consoude = engrais bio. Fleurs adorées des bourdons.', points: 12 },

];

export const CATEGORIES = ['Tout', 'Oiseau', 'Mammifère', 'Batracien', 'Reptile', 'Insecte', 'Fleur', 'Arbuste', 'Arbre', 'Aromatique'];

export const CAT_COLORS = {
  'Oiseau':     'from-blue-500 to-cyan-600',
  'Mammifère':  'from-orange-500 to-amber-700',
  'Batracien':  'from-green-500 to-teal-700',
  'Reptile':    'from-lime-500 to-green-700',
  'Insecte':    'from-yellow-400 to-orange-600',
  'Fleur':      'from-pink-500 to-rose-700',
  'Arbuste':    'from-violet-500 to-purple-700',
  'Arbre':      'from-emerald-600 to-green-800',
  'Aromatique': 'from-teal-400 to-emerald-700',
};