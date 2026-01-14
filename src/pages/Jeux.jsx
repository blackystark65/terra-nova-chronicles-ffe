import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Star, XCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  const { data: animalsData = [], isLoading } = useQuery({
    queryKey: ['animalCards'],
    queryFn: () => base44.entities.AnimalCard.list()
  });

  useEffect(() => {
    if (gameStarted && animalsData.length > 0) {
      const shuffled = [...animalsData].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setCurrentCard(shuffled[0]);
    }
  }, [gameStarted, animalsData]);

  const checkAnswer = (selectedCategory) => {
    if (!currentCard) return;

    const correctCategory = currentCard.category === selectedCategory;
    
    // Vérifier si le nom est correct (accepter français ET anglais)
    const userGuessLower = userGuess.toLowerCase().trim();
    const correctNameFrLower = currentCard.name.toLowerCase().trim();
    const correctNameEnLower = currentCard.name_en?.toLowerCase().trim() || '';
    
    // Accepter si le nom contient au moins 3 caractères et correspond au nom français OU anglais
    const correctName = userGuessLower.length >= 3 && (
      correctNameFrLower.includes(userGuessLower) || 
      userGuessLower.includes(correctNameFrLower.split(' ')[0]) ||
      userGuessLower === correctNameFrLower ||
      correctNameEnLower.includes(userGuessLower) ||
      userGuessLower.includes(correctNameEnLower.split(' ')[0]) ||
      userGuessLower === correctNameEnLower
    );
    
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
          {isLoading ? (
            <div className="text-center py-20">
              <div className="text-2xl text-emerald-300">Chargement des cartes...</div>
            </div>
          ) : !gameStarted ? (
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
                Classe {animalsData.length} animaux dans les bonnes catégories et trouve leurs noms !
              </p>
              <p className="text-sm text-emerald-400 mb-8">
                💡 Pour modifier les cartes, allez dans le Dashboard → Data → AnimalCard
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 px-2">
                  {/* Panier Gauche - Éteints */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => checkAnswer('extinct')}
                    className="cursor-pointer order-1 sm:order-1"
                  >
                    <div className={`h-32 sm:h-64 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${categoryColors.extinct} border-2 sm:border-4 border-white/20 flex flex-col items-center justify-center p-3 sm:p-6 shadow-2xl`}>
                      <XCircle className="w-8 h-8 sm:w-16 sm:h-16 text-white mb-2 sm:mb-4" />
                      <h3 className="text-base sm:text-2xl font-bold text-white text-center">
                        {categoryLabels.extinct}
                      </h3>
                    </div>
                  </motion.div>

                  {/* Paquet de cartes au centre */}
                  <div className="flex flex-col items-center gap-3 sm:gap-6 order-3 sm:order-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative"
                    >
                      <div className={`w-48 h-72 sm:w-64 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white bg-gradient-to-br ${categoryColors[currentCard.category]} relative`}>
                        {currentCard.image ? (
                          <img 
                            src={currentCard.image} 
                            alt={currentCard.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', currentCard.image);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                            🐾
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-center py-4">
                          <p className="text-sm opacity-60">Trouve le nom !</p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="w-full max-w-sm space-y-2 sm:space-y-3 px-2">
                      <Input
                        type="text"
                        placeholder="Nom de l'animal..."
                        value={userGuess}
                        onChange={(e) => setUserGuess(e.target.value)}
                        className="w-full py-4 sm:py-6 text-base sm:text-lg border-2 border-emerald-400 bg-white/90"
                      />
                      <p className="text-emerald-300 text-center text-xs sm:text-sm">
                        Clique sur un panier pour valider
                      </p>
                    </div>
                  </div>

                  {/* Panier Droite - Sauvés */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => checkAnswer('saved')}
                    className="cursor-pointer order-2 sm:order-3"
                  >
                    <div className={`h-32 sm:h-64 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${categoryColors.saved} border-2 sm:border-4 border-white/20 flex flex-col items-center justify-center p-3 sm:p-6 shadow-2xl`}>
                      <CheckCircle className="w-8 h-8 sm:w-16 sm:h-16 text-white mb-2 sm:mb-4" />
                      <h3 className="text-base sm:text-2xl font-bold text-white text-center">
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
                    Score Final: {score} / {animalsData.length * 2} points
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
                <div className="flex justify-center px-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => checkAnswer('endangered')}
                    className="cursor-pointer w-full max-w-sm sm:w-96"
                  >
                    <div className={`h-32 sm:h-64 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${categoryColors.endangered} border-2 sm:border-4 border-white/20 flex flex-col items-center justify-center p-3 sm:p-6 shadow-2xl`}>
                      <Trophy className="w-8 h-8 sm:w-16 sm:h-16 text-white mb-2 sm:mb-4" />
                      <h3 className="text-base sm:text-2xl font-bold text-white text-center">
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
                        {currentCard?.name_en && (
                          <span className="text-sm text-gray-500"> ({currentCard.name_en})</span>
                        )}
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