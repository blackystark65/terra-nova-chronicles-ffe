export const ESPECES = {
  transformateurs: {
    label: 'Transformateurs — Macrofaune',
    emoji: '🪱',
    borderColor: 'border-amber-400/40',
    textColor: 'text-amber-300',
    bgColor: 'bg-amber-500/10',
    role: 'Broyeurs : ingèrent les débris végétaux grossiers.',
    points: 10,
    especes: [
      { id: 'lombric', nom: 'Lombric (ver de terre)', emoji: '🪱', difficulte: 'facile', expert: false, description: 'Aère et enrichit le sol, roi de la décomposition.' },
      { id: 'cloporte', nom: 'Cloporte', emoji: '🦗', difficulte: 'facile', expert: false, description: 'Crustacé terrestre, mange les végétaux en décomposition.' },
      { id: 'diplopode', nom: 'Diplopode (mille-pattes)', emoji: '🐛', difficulte: 'moyen', expert: false, description: 'Broie les feuilles mortes, plusieurs centaines de pattes.' },
      { id: 'limace', nom: 'Limace', emoji: '🐌', difficulte: 'facile', expert: false, description: 'Décompose matières végétales humides.' },
    ]
  },
  predateurs: {
    label: 'Prédateurs — Mésofaune & Macrofaune',
    emoji: '🦂',
    borderColor: 'border-red-400/40',
    textColor: 'text-red-300',
    bgColor: 'bg-red-500/10',
    role: 'Régulent la population de décomposeurs, aèrent le sol.',
    points: 20,
    especes: [
      { id: 'carabe', nom: 'Carabe doré', emoji: '🪲', difficulte: 'moyen', expert: false, description: 'Coléoptère prédateur à reflets métalliques dorés.' },
      { id: 'staphylin', nom: 'Staphylin', emoji: '🪲', difficulte: 'moyen', expert: false, description: 'Petit coléoptère chasseur, élytres très courts.' },
      { id: 'araignee', nom: 'Araignée', emoji: '🕷️', difficulte: 'facile', expert: false, description: 'Capture les insectes décomposeurs dans sa toile.' },
      { id: 'pseudoscorpion', nom: 'Pseudoscorpion', emoji: '🦂', difficulte: 'expert', expert: true, description: '⭐ Défi Expert : minuscule prédateur sans dard, rarissime !' },
    ]
  },
  nettoyeurs: {
    label: 'Nettoyeurs — Microfaune & Champignons',
    emoji: '🍄',
    borderColor: 'border-emerald-400/40',
    textColor: 'text-emerald-300',
    bgColor: 'bg-emerald-500/10',
    role: 'Dégradation chimique des matières organiques.',
    points: 15,
    especes: [
      { id: 'champignon', nom: 'Champignon / Mycélium', emoji: '🍄', difficulte: 'facile', expert: false, description: 'Photos de mycélium (filaments blancs) acceptées.' },
      { id: 'collembole', nom: 'Collembole', emoji: '🦟', difficulte: 'expert', expert: true, description: '⭐ Défi Expert : micro-arthropode sauteur, visible à 1000x.' },
    ]
  }
};

export const TEAMS_CONFIG = [
  {
    id: 'team1',
    name: 'Les Fouisseurs',
    emoji: '🦔',
    gradient: 'from-blue-700/80 to-cyan-800/80',
    border: 'border-blue-400/40',
    bg: 'bg-blue-500/20',
    badge: 'bg-blue-500',
    btn: 'bg-blue-500/30 text-blue-200 hover:bg-blue-500/50',
    capturesKey: 'captures_team1',
    membersKey: 'members_team1',
    scoreKey: 'score_team1',
    codeKey: 'code_team1',
  },
  {
    id: 'team2',
    name: 'Les Mycorhizes',
    emoji: '🍄',
    gradient: 'from-purple-700/80 to-pink-800/80',
    border: 'border-purple-400/40',
    bg: 'bg-purple-500/20',
    badge: 'bg-purple-500',
    btn: 'bg-purple-500/30 text-purple-200 hover:bg-purple-500/50',
    capturesKey: 'captures_team2',
    membersKey: 'members_team2',
    scoreKey: 'score_team2',
    codeKey: 'code_team2',
  },
];

export const DIFFICULTE_COLORS = {
  facile: 'bg-green-500/20 text-green-300 border-green-400/30',
  moyen: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  expert: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
};

export function calcScore(captures = {}) {
  let score = 0;
  let expertBonus = 0;

  Object.values(ESPECES).forEach(groupe => {
    groupe.especes.forEach(espece => {
      if (captures[espece.id]) {
        score += groupe.points;
        if (espece.expert) expertBonus += 30;
      }
    });
  });

  const hasPredateur = ['carabe', 'staphylin', 'araignee', 'pseudoscorpion'].some(id => captures[id]);
  const hasProie = ['lombric', 'cloporte', 'diplopode', 'collembole'].some(id => captures[id]);
  const chainBonus = hasPredateur && hasProie ? 50 : 0;

  const allGroups = Object.values(ESPECES).every(g => g.especes.some(e => captures[e.id]));
  const biodiversiteBonus = allGroups ? 100 : 0;

  return { score: score + expertBonus + chainBonus + biodiversiteBonus, expertBonus, chainBonus, biodiversiteBonus };
}

export function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Récompenses pour l'équipe gagnante
export const WINNER_REWARDS = {
  xp: 200,
  credits: 150,
  badge: {
    badge_id: 'biofocus_winner',
    name: '🔬 Enquêteur de l\'Humus',
  }
};

export const PARTICIPANT_REWARDS = {
  xp: 75,
  credits: 50,
  badge: {
    badge_id: 'biofocus_participant',
    name: '🪱 Explorateur du Sol',
  }
};