import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  BookOpen, Search, MessageCircle, Send, X, TreeDeciduous, 
  Droplets, Leaf, Recycle, Bug, Sprout, Zap, Globe, Dna 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageBubble from '@/components/encyclopedia/MessageBubble';

const themes = [
  {
    id: 'forets',
    name: 'Forêts',
    icon: TreeDeciduous,
    color: 'from-green-600 to-emerald-700',
    description: 'Poumons de la Terre, écosystèmes complexes',
    content: {
      intro: "La forêt n'est pas un décor, mais un système vital, une 'ville du vivant' où chaque organisme a une fonction. Elle fonctionne par coopération, pas par compétition. Les forêts couvrent 31% de la surface terrestre et abritent 80% de la biodiversité terrestre.",
      facts: [
        "Les arbres absorbent le CO₂, produisent de l'oxygène via la photosynthèse et régulent le climat",
        "Chaque année, 7 à 15 tonnes de feuilles par hectare tombent et forment l'humus, base de la fertilité",
        "Le mycélium (champignons) crée une symbiose avec les racines et permet la communication entre arbres",
        "Les décomposeurs (vers, insectes, bactéries) transforment la matière morte en nutriments : la mort nourrit la vie",
        "La forêt produit des phytoncides, ions négatifs et terpènes bénéfiques pour la santé humaine",
        "Un sol forestier vivant stocke le carbone, régule l'eau et protège contre l'érosion"
      ],
      actions: [
        "Protéger les forêts existantes contre la pollution et les déchets",
        "Replanter des essences locales adaptées, pas des monocultures de résineux",
        "Éduquer les jeunes générations au rôle vital des forêts",
        "Participer à l'achat et la protection collective des forêts",
        "Respecter les cycles naturels et la biodiversité forestière"
      ]
    }
  },
  {
    id: 'agroecologie',
    name: 'Agroécologie',
    icon: Sprout,
    color: 'from-lime-600 to-green-700',
    description: 'Agriculture respectueuse de la nature',
    content: {
      intro: "L'agroécologie est une agriculture qui respecte simultanément la nature (sols, eau, biodiversité), les animaux, les êtres humains, et qui redistribue équitablement les surplus. Elle réconcilie production alimentaire, biodiversité, santé des sols et bien-être des agriculteurs.",
      facts: [
        "Un sol vivant nourrit les plantes : abandon du labour, couverture végétale permanente, rôle central des vers de terre",
        "Le semis direct sous couvert améliore la fertilité, stocke le carbone et réduit l'érosion",
        "La biodiversité cultivée (ex: Milpa - maïs, haricots, courges) rend le système résilient",
        "Le pâturage tournant dynamique fertilise naturellement les sols et assure l'autonomie fourragère",
        "Les animaux (chevaux, ânes) remplacent le tracteur, réduisant le compactage des sols",
        "L'agroforesterie et les haies protègent la faune, régulent le climat local et préviennent l'érosion",
        "L'agriculture est le principal consommateur d'eau douce : l'agroécologie la protège"
      ],
      actions: [
        "Soutenir les fermes agroécologiques locales",
        "Créer un jardin en semis direct sous couvert",
        "Pratiquer les associations de cultures bénéfiques",
        "Protéger et planter des haies indigènes",
        "Favoriser l'autonomie alimentaire et énergétique locale"
      ]
    }
  },
  {
    id: 'eau',
    name: 'Eau',
    icon: Droplets,
    color: 'from-blue-600 to-cyan-700',
    description: 'Or bleu, ressource vitale',
    content: {
      intro: "L'eau est l'élément fondateur de toute forme de vie sur Terre. Elle n'est pas seulement une ressource utilitaire, mais un système global, dynamique et fragile, qui relie les montagnes, les sols, les rivières, les océans, l'atmosphère et les êtres vivants. Sans eau, il n'y a ni sol vivant, ni forêt, ni agriculture, ni humanité.",
      facts: [
        "Toute vie connue dépend de l'eau : le corps humain en est composé majoritairement",
        "Le cycle de l'eau est fermé : la quantité totale ne change pas, mais sa qualité peut se dégrader",
        "L'eau circule entre océans, atmosphère, nuages, sols, nappes phréatiques et rivières",
        "Les sols vivants riches en humus permettent l'infiltration et le stockage, les sols dégradés causent ruissellement et inondations",
        "Seulement 2,5% de l'eau terrestre est douce, et 1% est accessible et potable",
        "Les zones humides sont les 'reins de la planète' : elles abritent la biodiversité, filtrent l'eau et amortissent les crues",
        "L'eau régule le climat en transportant la chaleur et en influençant les précipitations",
        "L'agriculture utilise 70% de l'eau douce : l'agroécologie la protège avec des sols couverts et des haies",
        "Pollution : plastiques, pesticides, engrais, rejets industriels - polluer l'eau, c'est polluer tout le vivant"
      ],
      actions: [
        "Réduire le gaspillage d'eau au quotidien",
        "Protéger les sources et restaurer les zones humides",
        "Installer des récupérateurs d'eau de pluie",
        "Soutenir une agriculture respectueuse de l'eau",
        "Ne jamais polluer les cours d'eau",
        "Sensibiliser dès l'enfance : l'eau appartient à tous les êtres vivants"
      ]
    }
  },
  {
    id: 'climat',
    name: 'Climat',
    icon: Leaf,
    color: 'from-teal-600 to-emerald-700',
    description: 'Régulateur vital de la planète',
    content: {
      intro: "Le climat correspond à l'ensemble des conditions atmosphériques moyennes (température, précipitations, vents) observées sur une longue période. Il constitue un pilier fondamental du fonctionnement de la planète, car il conditionne la vie, les paysages, les écosystèmes et les activités humaines. Le climat résulte d'un équilibre naturel complexe entre l'énergie solaire, l'atmosphère, les océans, les sols, les forêts et les êtres vivants.",
      facts: [
        "☀️ L'énergie solaire : Le Soleil est la source principale d'énergie de la Terre. Une partie est réfléchie, une autre absorbée, maintenant une température compatible avec la vie",
        "🌡️ L'effet de serre naturel : Les gaz à effet de serre (vapeur d'eau, CO₂, méthane) retiennent la chaleur et empêchent la Terre de devenir trop froide. Sans cet effet, la planète serait inhabitable",
        "⚠️ Le dérèglement climatique : L'activité humaine augmente excessivement la concentration de gaz à effet de serre, provoquant un réchauffement global rapide",
        "🌊 Le rôle des océans : Les océans absorbent plus de 90% de l'excès de chaleur. Ils régulent le climat mondial grâce aux courants marins, mais subissent acidification, réchauffement et élévation du niveau",
        "🌳 Le rôle des forêts : Véritables régulateurs climatiques qui stockent le carbone, influencent les précipitations, rafraîchissent l'air et protègent les sols",
        "💧 Le cycle de l'eau et le climat : Le climat influence le cycle de l'eau. En retour, l'eau régule la température de la planète. Le dérèglement intensifie sécheresses et inondations",
        "❄️ Les glaces : Les glaciers et calottes polaires réfléchissent la lumière solaire (effet albédo). Leur fonte accélère le réchauffement et la montée des mers",
        "🌱 Le rôle des sols : Les sols vivants stockent du carbone et de l'eau. Des sols dégradés libèrent du CO₂ et aggravent le dérèglement"
      ],
      actions: [
        "Réduction des émissions de gaz à effet de serre",
        "Protection des forêts et des océans",
        "Transition énergétique vers les renouvelables",
        "Agroécologie et sols vivants",
        "Sobriété et justice climatique",
        "Éducation et coopération internationale"
      ]
    }
  },
  {
    id: 'recyclage',
    name: 'Tri Sélectif & Recyclage Suisse',
    icon: Recycle,
    color: 'from-emerald-600 to-teal-700',
    description: 'Normes OLED et économie circulaire',
    content: {
      intro: "La Suisse applique des normes strictes de tri sélectif conformes à la Loi fédérale sur la protection de l'environnement (LPE) et l'Ordonnance sur les déchets (OLED). Le système suisse comprend 9 types de poubelles avec des destinations et valorisations spécifiques pour chaque flux de déchets.",
      facts: [
        "📄 Papier/Carton (Bleu) → Papeteries suisses → Nouveaux papiers, cartons et emballages",
        "♻️ Plastiques/PET (Jaune) → Centre Plastiques → T-shirts, sacs, porte-monnaies, fibres textiles. Exemple : filets de pêche et cordages de marina recyclés en vêtements",
        "🍾 Verre (Vert) → Verreries suisses → Nouvelles bouteilles et bocaux (tri par couleur)",
        "🥕 Biodéchets (Marron) → Méthanisation/compostage → Biogaz pour chauffage, compost, engrais naturel",
        "🥫 Aluminium (Rouge) → Fonderie IGORA → Aluminium secondaire, vélos, canettes, pièces automobiles",
        "🛢️ Huiles alimentaires → Filière biodiesel agréée → Biodiesel pour véhicules et chauffage (plus d'incinération)",
        "🔋 Piles/Batteries → Centres cantonaux agréés → Récupération métaux précieux, neutralisation sécurisée",
        "💡 Ampoules/Néons → Centres agréés → Récupération verre et métaux, neutralisation mercure",
        "🗑️ Incinérables (Noir) → Valorisation énergétique → Électricité et chauffage urbain",
        "La Suisse vise un taux de recyclage supérieur à 50% et suit les référentiels ISO 14001, Swisstainable et Clef Verte",
        "Le tri sélectif est OBLIGATOIRE en Suisse : l'éducation commence dès l'enfance"
      ],
      actions: [
        "Trier selon les 9 catégories suisses (papier, plastique, verre, organique, aluminium, huiles, piles, ampoules, incinérable)",
        "Apporter les cordages et filets usés au recyclage (deviennent des vêtements)",
        "Collecter les huiles de friture pour le biodiesel (ne plus les jeter)",
        "Rapporter piles et ampoules aux points de collecte spécialisés",
        "Séparer le verre par couleur (blanc, brun, vert)",
        "Composter tous les biodéchets pour produire biogaz et engrais",
        "Soutenir l'économie circulaire locale et les filières de valorisation suisses",
        "Éduquer les jeunes générations aux normes OLED dès le plus jeune âge"
      ]
    }
  },
  {
    id: 'especes',
    name: 'Espèces en danger',
    icon: Bug,
    color: 'from-orange-600 to-red-700',
    description: 'Biodiversité en péril',
    content: {
      intro: "1 million d'espèces sont menacées d'extinction dans les prochaines décennies.",
      facts: [
        "68% des populations d'animaux sauvages ont disparu depuis 1970",
        "Les insectes pollinisateurs sont en déclin de 40%",
        "Le braconnage tue 30 000 éléphants par an"
      ],
      actions: [
        "Soutenir les réserves naturelles",
        "Ne pas acheter de produits issus d'espèces menacées",
        "Créer des refuges pour la biodiversité locale"
      ]
    }
  },
  {
    id: 'permaculture',
    name: 'Permaculture & Alimentation',
    icon: Sprout,
    color: 'from-green-600 to-lime-700',
    description: 'Systèmes alimentaires durables',
    content: {
      intro: "La permaculture crée des écosystèmes alimentaires productifs et résilients.",
      facts: [
        "La permaculture peut produire 10 fois plus qu'une agriculture conventionnelle sur la même surface",
        "Un tiers de la nourriture mondiale est gaspillée",
        "L'alimentation végétale réduit l'empreinte carbone de 50%"
      ],
      actions: [
        "Créer un jardin en permaculture",
        "Réduire le gaspillage alimentaire",
        "Adopter une alimentation plus végétale"
      ]
    }
  },
  {
    id: 'energies',
    name: 'Énergies',
    icon: Zap,
    color: 'from-yellow-600 to-orange-700',
    description: 'Transition énergétique',
    content: {
      intro: "Les énergies renouvelables sont la clé de la lutte contre le changement climatique.",
      facts: [
        "Les énergies renouvelables représentent 29% de la production électrique mondiale",
        "Le solaire et l'éolien sont désormais moins chers que les énergies fossiles",
        "La production d'énergie représente 73% des émissions de gaz à effet de serre"
      ],
      actions: [
        "Réduire sa consommation d'énergie",
        "Choisir un fournisseur d'électricité verte",
        "Installer des panneaux solaires si possible"
      ]
    }
  },
  {
    id: 'biosphere',
    name: 'Biosphère',
    icon: Globe,
    color: 'from-blue-600 to-purple-700',
    description: 'Système vivant planétaire',
    content: {
      intro: "La biosphère est l'ensemble des écosystèmes terrestres interconnectés.",
      facts: [
        "La biosphère contient environ 550 gigatonnes de carbone",
        "Elle régule le climat et les cycles de l'eau",
        "9 des 15 limites planétaires ont été franchies"
      ],
      actions: [
        "Comprendre les interconnexions écologiques",
        "Protéger les écosystèmes clés",
        "Respecter les limites planétaires"
      ]
    }
  },
  {
    id: 'origines',
    name: 'Origines de la vie',
    icon: Dna,
    color: 'from-purple-600 to-pink-700',
    description: 'Histoire du vivant sur Terre',
    content: {
      intro: "La vie sur Terre est apparue il y a environ 3,8 milliards d'années.",
      facts: [
        "Les premiers organismes étaient des bactéries unicellulaires",
        "L'oxygène atmosphérique vient de la photosynthèse des cyanobactéries",
        "5 extinctions de masse ont marqué l'histoire du vivant"
      ],
      actions: [
        "Étudier l'évolution et la paléontologie",
        "Comprendre notre place dans le vivant",
        "Préserver le patrimoine génétique"
      ]
    }
  }
];

export default function EncyclopediaPage() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBryan, setShowBryan] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenBryan = async () => {
    setShowBryan(true);
    if (!conversationId) {
      try {
        const conversation = await base44.agents.createConversation({
          agent_name: 'bryan',
          metadata: {
            name: 'Consultation Encyclopédie',
            description: 'Questions sur l\'environnement'
          }
        });
        setConversationId(conversation.id);
        setMessages(conversation.messages || []);
      } catch (error) {
        console.error('Erreur création conversation:', error);
      }
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || isLoading) return;

    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');

    try {
      const conversation = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: userMessage
      });
    } catch (error) {
      console.error('Erreur envoi message:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Fond papier ancien */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" />
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Ctext x="10" y="50" font-size="80" opacity="0.1"%3E📖%3C/text%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />

      <BiolumiHeader currentPage="Encyclopedia" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header livre */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-100 border-2 border-amber-300 mb-6 shadow-lg">
              <BookOpen className="w-6 h-6 text-amber-700" />
              <span className="text-amber-800 font-bold text-lg">Encyclopédie Terra Nova</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 text-amber-900">
              Le Grand Livre de l'Environnement
            </h1>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto mb-6">
              Explore les connaissances sur notre planète avec Bryan, ton guide expert
            </p>

            {/* Barre de recherche */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
              <Input
                type="text"
                placeholder="Rechercher un thème..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg border-2 border-amber-300 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg"
              />
            </div>
          </motion.div>

          {/* Grille des thèmes - Style pages de livre */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredThemes.map((theme, i) => {
              const Icon = theme.icon;
              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setSelectedTheme(theme)}
                  className="cursor-pointer"
                >
                  <div className="relative p-6 rounded-2xl bg-white border-4 border-amber-200 shadow-xl hover:shadow-2xl transition-all overflow-hidden">
                    {/* Effet texture papier */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" 
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 46, 0.1) 2px, rgba(139, 92, 46, 0.1) 4px)'
                      }} 
                    />

                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-amber-900 mb-2">{theme.name}</h3>
                      <p className="text-sm text-amber-700">{theme.description}</p>

                      <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
                        <BookOpen className="w-4 h-4" />
                        <span>Lire le chapitre →</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bouton Bryan - Toujours visible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={handleOpenBryan}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl hover:scale-110 transition-all group relative"
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/afe59f0bf_moienmangas.jpg"
                alt="Bryan"
                className="w-full h-full rounded-full object-cover border-4 border-white"
              />
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-400 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </motion.div>
            </Button>
            <div className="absolute -top-12 right-0 bg-amber-900 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Demande à Bryan !
            </div>
          </motion.div>
        </div>
      </main>

      {/* Modal détail thème */}
      <AnimatePresence>
        {selectedTheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTheme(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl bg-white border-4 border-amber-300 shadow-2xl"
            >
              <div className="sticky top-0 bg-gradient-to-r from-amber-100 to-orange-100 p-6 border-b-4 border-amber-300 flex items-start justify-between z-10">
                <div className="flex items-center gap-4">
                  {React.createElement(selectedTheme.icon, { className: 'w-10 h-10 text-amber-700' })}
                  <div>
                    <h2 className="text-3xl font-bold text-amber-900">{selectedTheme.name}</h2>
                    <p className="text-amber-700">{selectedTheme.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTheme(null)}
                  className="p-2 rounded-xl bg-amber-200 hover:bg-amber-300 transition-colors"
                >
                  <X className="w-6 h-6 text-amber-800" />
                </button>
              </div>

              <div className="p-8">
                <div className="prose prose-amber max-w-none">
                  <p className="text-lg text-amber-900 leading-relaxed mb-6">
                    {selectedTheme.content.intro}
                  </p>

                  <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <Leaf className="w-6 h-6" />
                    Faits clés
                  </h3>
                  <ul className="space-y-2 mb-8">
                    {selectedTheme.content.facts.map((fact, i) => (
                      <li key={i} className="text-amber-800 bg-amber-50 p-3 rounded-lg">
                        {fact}
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    Actions concrètes
                  </h3>
                  <ul className="space-y-2">
                    {selectedTheme.content.actions.map((action, i) => (
                      <li key={i} className="text-amber-800 bg-emerald-50 p-3 rounded-lg">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => {
                    setSelectedTheme(null);
                    handleOpenBryan();
                  }}
                  className="w-full mt-8 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Poser une question à Bryan sur ce thème
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Bryan */}
      <AnimatePresence>
        {showBryan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBryan(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl h-[80vh] rounded-3xl bg-gradient-to-br from-white to-emerald-50 border-4 border-emerald-300 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header Bryan */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/afe59f0bf_moienmangas.jpg"
                    alt="Bryan"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-white">Bryan</h3>
                    <p className="text-emerald-100">Expert en environnement</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBryan(false)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <img 
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/afe59f0bf_moienmangas.jpg"
                      alt="Bryan"
                      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-emerald-300 shadow-lg"
                    />
                    <h4 className="text-xl font-bold text-emerald-800 mb-2">Salut ! Je suis Bryan 👋</h4>
                    <p className="text-emerald-600">
                      Je peux répondre à toutes tes questions sur l'environnement,<br />
                      la biodiversité, le climat et bien plus encore !
                    </p>
                  </div>
                ) : (
                  messages.map((message, i) => (
                    <MessageBubble key={i} message={message} />
                  ))
                )}
                {isLoading && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </motion.div>
                    <span>Bryan réfléchit...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t-4 border-emerald-200 bg-white">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Pose ta question à Bryan..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1 py-6 text-lg border-2 border-emerald-300 rounded-xl"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-8 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}