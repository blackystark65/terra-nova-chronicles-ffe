import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Trophy, Star, XCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Base de données de 52 animaux avec catégories et emojis
const animalsData = [
  // Animaux éteints (17 cartes)
  { id: 'extinct-1', name: 'Dodo', category: 'extinct', emoji: '🦤', biome: 'islands' },
  { id: 'extinct-2', name: 'Mammouth', category: 'extinct', emoji: '🦣', biome: 'arctic' },
  { id: 'extinct-3', name: 'Tigre de Tasmanie', category: 'extinct', emoji: '🐅', biome: 'temperate' },
  { id: 'extinct-4', name: 'Quagga', category: 'extinct', emoji: '🦓', biome: 'savanna' },
  { id: 'extinct-5', name: 'Grand Pingouin', category: 'extinct', emoji: '🐧', biome: 'arctic' },
  { id: 'extinct-6', name: 'Moa', category: 'extinct', emoji: '🦅', biome: 'forest' },
  { id: 'extinct-7', name: 'Tigre à Dents de Sabre', category: 'extinct', emoji: '🐯', biome: 'savanna' },
  { id: 'extinct-8', name: 'Dauphin de Chine', category: 'extinct', emoji: '🐬', biome: 'ocean' },
  { id: 'extinct-9', name: 'Pigeon Migrateur', category: 'extinct', emoji: '🕊️', biome: 'forest' },
  { id: 'extinct-10', name: 'Ours Atlas', category: 'extinct', emoji: '🐻', biome: 'mountains' },
  { id: 'extinct-11', name: 'Loup de Tasmanie', category: 'extinct', emoji: '🐺', biome: 'forest' },
  { id: 'extinct-12', name: 'Éléphant Nain', category: 'extinct', emoji: '🐘', biome: 'islands' },
  { id: 'extinct-13', name: 'Rhinocéros Laineux', category: 'extinct', emoji: '🦏', biome: 'arctic' },
  { id: 'extinct-14', name: 'Lion des Cavernes', category: 'extinct', emoji: '🦁', biome: 'savanna' },
  { id: 'extinct-15', name: 'Mégalodon', category: 'extinct', emoji: '🦈', biome: 'ocean' },
  { id: 'extinct-16', name: 'Paresseux Géant', category: 'extinct', emoji: '🦥', biome: 'rainforest' },
  { id: 'extinct-17', name: 'Tortue Géante', category: 'extinct', emoji: '🐢', biome: 'islands' },

  // Animaux en voie d'extinction (18 cartes)
  { id: 'endangered-1', name: 'Tigre du Bengale', category: 'endangered', emoji: '🐅', biome: 'rainforest' },
  { id: 'endangered-2', name: 'Panda Géant', category: 'endangered', emoji: '🐼', biome: 'temperate' },
  { id: 'endangered-3', name: 'Gorille des Montagnes', category: 'endangered', emoji: '🦍', biome: 'rainforest' },
  { id: 'endangered-4', name: 'Éléphant d\'Asie', category: 'endangered', emoji: '🐘', biome: 'rainforest' },
  { id: 'endangered-5', name: 'Rhinocéros Noir', category: 'endangered', emoji: '🦏', biome: 'savanna' },
  { id: 'endangered-6', name: 'Orang-outan', category: 'endangered', emoji: '🦧', biome: 'rainforest' },
  { id: 'endangered-7', name: 'Léopard des Neiges', category: 'endangered', emoji: '🐆', biome: 'mountains' },
  { id: 'endangered-8', name: 'Ours Polaire', category: 'endangered', emoji: '🐻‍❄️', biome: 'arctic' },
  { id: 'endangered-9', name: 'Baleine Bleue', category: 'endangered', emoji: '🐋', biome: 'ocean' },
  { id: 'endangered-10', name: 'Tortue Luth', category: 'endangered', emoji: '🐢', biome: 'ocean' },
  { id: 'endangered-11', name: 'Jaguar', category: 'endangered', emoji: '🐆', biome: 'rainforest' },
  { id: 'endangered-12', name: 'Vaquita', category: 'endangered', emoji: '🐬', biome: 'ocean' },
  { id: 'endangered-13', name: 'Condor de Californie', category: 'endangered', emoji: '🦅', biome: 'mountains' },
  { id: 'endangered-14', name: 'Lynx Ibérique', category: 'endangered', emoji: '🐈', biome: 'temperate' },
  { id: 'endangered-15', name: 'Pangolin', category: 'endangered', emoji: '🦔', biome: 'savanna' },
  { id: 'endangered-16', name: 'Dugong', category: 'endangered', emoji: '🦭', biome: 'ocean' },
  { id: 'endangered-17', name: 'Tamanoir', category: 'endangered', emoji: '🐜', biome: 'savanna' },
  { id: 'endangered-18', name: 'Aigle Royal', category: 'endangered', emoji: '🦅', biome: 'mountains' },

  // Animaux sauvés (17 cartes)
  { id: 'saved-1', name: 'Bison d\'Amérique', category: 'saved', emoji: '🦬', biome: 'savanna' },
  { id: 'saved-2', name: 'Loutre de Mer', category: 'saved', emoji: '🦦', biome: 'ocean' },
  { id: 'saved-3', name: 'Baleine à Bosse', category: 'saved', emoji: '🐋', biome: 'ocean' },
  { id: 'saved-4', name: 'Alligator d\'Amérique', category: 'saved', emoji: '🐊', biome: 'wetlands' },
  { id: 'saved-5', name: 'Faucon Pèlerin', category: 'saved', emoji: '🦅', biome: 'mountains' },
  { id: 'saved-6', name: 'Éléphant de Mer', category: 'saved', emoji: '🦭', biome: 'ocean' },
  { id: 'saved-7', name: 'Crocodile Marin', category: 'saved', emoji: '🐊', biome: 'ocean' },
  { id: 'saved-8', name: 'Loup Gris', category: 'saved', emoji: '🐺', biome: 'forest' },
  { id: 'saved-9', name: 'Castor', category: 'saved', emoji: '🦫', biome: 'wetlands' },
  { id: 'saved-10', name: 'Pygargue à Tête Blanche', category: 'saved', emoji: '🦅', biome: 'forest' },
  { id: 'saved-11', name: 'Oryx d\'Arabie', category: 'saved', emoji: '🦌', biome: 'desert' },
  { id: 'saved-12', name: 'Ibis Chauve', category: 'saved', emoji: '🦩', biome: 'wetlands' },
  { id: 'saved-13', name: 'Tortue Verte', category: 'saved', emoji: '🐢', biome: 'ocean' },
  { id: 'saved-14', name: 'Koala', category: 'saved', emoji: '🐨', biome: 'temperate' },
  { id: 'saved-15', name: 'Cheval de Przewalski', category: 'saved', emoji: '🐴', biome: 'savanna' },
  { id: 'saved-16', name: 'Cerf du Père David', category: 'saved', emoji: '🦌', biome: 'wetlands' },
  { id: 'saved-17', name: 'Panda Roux', category: 'saved', emoji: '🦊', biome: 'temperate' },
];

const categoryLabels = {
  extinct: 'Éteints',
  endangered: 'En Danger',
  saved: 'Sauvés'
};

const categoryColors = {
  extinct: 'from-gray-600 to-slate-700',
  endangered: 'from-orange-500 to-red-600',
  saved: 'from-green-500 to-emerald-600'
};

export default function JeuxPage() {
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [baskets, setBaskets] = useState({
    extinct: [],
    endangered: [],
    saved: []
  });
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const shuffled = [...animalsData].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setCurrentCard(shuffled[0]);
    }
  }, [gameStarted]);

  const checkAnswer = (selectedCategory) => {
    if (!currentCard) return;

    const correctCategory = currentCard.category === selectedCategory;
    const correctName = userGuess.toLowerCase().trim() === currentCard.name.toLowerCase().trim();
    
    let points = 0;
    let message = '';

    if (correctCategory && correctName) {
      points = 2;
      message = '🎉 Parfait ! Bon panier ET bon nom !';
    } else if (correctCategory) {
      points = 1;
      message = '👍 Bon panier ! Mais le nom est incorrect.';
    } else if (correctName) {
      points = 1;
      message = '📝 Bon nom ! Mais mauvais panier.';
    } else {
      points = 0;
      message = '❌ Mauvais panier et mauvais nom.';
    }

    setScore(score + points);
    setFeedback({ 
      message, 
      points, 
      correctName: currentCard.name,
      correctCategory: categoryLabels[currentCard.category]
    });

    setTimeout(() => {
      const newDeck = deck.slice(1);
      setDeck(newDeck);
      setCurrentCard(newDeck[0] || null);
      setUserGuess('');
      setFeedback(null);
    }, 3000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setDeck([]);
    setCurrentCard(null);
    setBaskets({ extinct: [], endangered: [], saved: [] });
    setUserGuess('');
    setScore(0);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/349c14a99_digital-screen-with-environment-day.jpg)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/80 via-emerald-950/70 to-teal-950/80" />
      
      <BiolumiHeader currentPage="Jeux" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {!gameStarted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Jeu des Cartes Animaux
              </h1>
              <p className="text-xl text-emerald-300 mb-8 max-w-2xl mx-auto">
                Classe 52 animaux dans les bonnes catégories et trouve leurs noms !
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-3 text-emerald-200">
                  <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                  <span>Éteints - Animaux disparus</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-emerald-200">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span>En Danger - Nécessitent protection</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-emerald-200">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Sauvés - Populations récupérées</span>
                </div>
              </div>
              <Button
                onClick={() => setGameStarted(true)}
                className="px-8 py-6 text-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Commencer le Jeu
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Score */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-emerald-400/30">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">Score: {score}</span>
                </div>
                <div className="text-emerald-300 text-lg">
                  Cartes restantes: {deck.length}
                </div>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="border-emerald-400 text-emerald-300"
                >
                  Recommencer
                </Button>
              </div>

              {currentCard ? (
                <div className="grid grid-cols-3 gap-8 mb-12">
                  {/* Panier Gauche - Éteints */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => checkAnswer('extinct')}
                    className="cursor-pointer"
                  >
                    <div className={`h-64 rounded-3xl bg-gradient-to-br ${categoryColors.extinct} border-4 border-white/20 flex flex-col items-center justify-center p-6 shadow-2xl`}>
                      <XCircle className="w-16 h-16 text-white mb-4" />
                      <h3 className="text-2xl font-bold text-white text-center">
                        {categoryLabels.extinct}
                      </h3>
                    </div>
                  </motion.div>

                  {/* Paquet de cartes au centre */}
                  <div className="flex flex-col items-center gap-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotateY: 180 }}
                      className="relative"
                    >
                      <div className={`w-64 h-96 rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-gradient-to-br ${categoryColors[currentCard.category]} flex items-center justify-center`}>
                        <div className="text-9xl">{currentCard.emoji}</div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-center py-4">
                          <p className="text-sm opacity-60">Trouve le nom !</p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="w-full space-y-3">
                      <Input
                        type="text"
                        placeholder="Nom de l'animal..."
                        value={userGuess}
                        onChange={(e) => setUserGuess(e.target.value)}
                        className="w-full py-6 text-lg border-2 border-emerald-400 bg-white/90"
                      />
                      <p className="text-emerald-300 text-center text-sm">
                        Clique sur un panier pour valider
                      </p>
                    </div>
                  </div>

                  {/* Panier Droite - Sauvés */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => checkAnswer('saved')}
                    className="cursor-pointer"
                  >
                    <div className={`h-64 rounded-3xl bg-gradient-to-br ${categoryColors.saved} border-4 border-white/20 flex flex-col items-center justify-center p-6 shadow-2xl`}>
                      <CheckCircle className="w-16 h-16 text-white mb-4" />
                      <h3 className="text-2xl font-bold text-white text-center">
                        {categoryLabels.saved}
                      </h3>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-black text-emerald-300 mb-4">
                    Jeu Terminé !
                  </h2>
                  <p className="text-3xl text-white mb-8">
                    Score Final: {score} / 104 points
                  </p>
                  <Button
                    onClick={resetGame}
                    className="px-8 py-6 text-xl bg-gradient-to-r from-emerald-500 to-teal-500"
                  >
                    Rejouer
                  </Button>
                </motion.div>
              )}

              {/* Panier Bas - En Danger */}
              {currentCard && (
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => checkAnswer('endangered')}
                    className="cursor-pointer w-96"
                  >
                    <div className={`h-64 rounded-3xl bg-gradient-to-br ${categoryColors.endangered} border-4 border-white/20 flex flex-col items-center justify-center p-6 shadow-2xl`}>
                      <Trophy className="w-16 h-16 text-white mb-4" />
                      <h3 className="text-2xl font-bold text-white text-center">
                        {categoryLabels.endangered}
                      </h3>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                  >
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-emerald-400 min-w-96">
                      <p className="text-2xl font-bold text-center mb-2">{feedback.message}</p>
                      <p className="text-lg text-center text-gray-600">
                        Réponse correcte: <span className="font-bold text-emerald-600">{feedback.correctName}</span>
                      </p>
                      <p className="text-lg text-center text-gray-600">
                        Catégorie: <span className="font-bold text-emerald-600">{feedback.correctCategory}</span>
                      </p>
                      <p className="text-xl text-center mt-3 font-bold text-emerald-600">
                        +{feedback.points} point{feedback.points > 1 ? 's' : ''}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </main>
    </div>
  );
}