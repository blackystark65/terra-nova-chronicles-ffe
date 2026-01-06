import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Trophy, Star, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Configuration du puzzle (4x4 = 16 pièces)
const GRID_SIZE = 4;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

// Niveaux de difficulté
const DIFFICULTY_LEVELS = [
  { id: 'facile', name: 'Facile', opacity: 0.9 },
  { id: 'intermediaire', name: 'Intermédiaire', opacity: 0.75 },
  { id: 'moyen', name: 'Moyen', opacity: 0.5 },
  { id: 'difficile', name: 'Difficile', opacity: 0.25 },
  { id: 'tres-difficile', name: 'Très Difficile', opacity: 0 }
];

// Différents puzzles disponibles
const PUZZLES = [
  {
    id: 'planet',
    name: 'Planète Terre',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/af6a6b206_green-earth-globe-with-continents-oceans.png',
    color: 'from-blue-500 to-green-500'
  },
  {
    id: 'animals',
    name: 'Animaux Sauvages',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=800&fit=crop',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=800&fit=crop',
    color: 'from-green-500 to-lime-500'
  },
  {
    id: 'recycling',
    name: 'Recyclage',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=800&fit=crop',
    color: 'from-teal-500 to-cyan-500'
  }
];

export default function PuzzlePage() {
  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [puzzleSelection, setPuzzleSelection] = useState(true);
  const [difficulty, setDifficulty] = useState(null);
  const [showDifficultySelection, setShowDifficultySelection] = useState(false);

  useEffect(() => {
    if (gameStarted && selectedPuzzle) {
      initializePuzzle();
    }
  }, [gameStarted, selectedPuzzle]);

  const initializePuzzle = () => {
    // Créer les pièces du puzzle
    const puzzlePieces = [];
    for (let i = 0; i < TOTAL_PIECES; i++) {
      puzzlePieces.push({
        id: i,
        correctPosition: i,
        row: Math.floor(i / GRID_SIZE),
        col: i % GRID_SIZE,
      });
    }

    // Mélanger les pièces
    const shuffled = [...puzzlePieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);

    // Initialiser le plateau vide
    setBoard(Array(TOTAL_PIECES).fill(null));
    setScore(0);
    setIsComplete(false);
  };

  const handleDragStart = (piece) => {
    setDraggedPiece(piece);
  };

  const handleDrop = (position) => {
    if (!draggedPiece) return;

    const newBoard = [...board];
    
    // Si la case est déjà occupée, échanger
    const existingPiece = newBoard[position];
    if (existingPiece) {
      // Retourner la pièce existante dans la zone de pièces
      setPieces([...pieces, existingPiece]);
    }

    // Placer la nouvelle pièce
    newBoard[position] = draggedPiece;
    setBoard(newBoard);

    // Retirer la pièce de la zone de pièces
    setPieces(pieces.filter(p => p.id !== draggedPiece.id));

    // Vérifier si c'est la bonne position
    if (draggedPiece.correctPosition === position) {
      setScore(score + 1);
    }

    // Vérifier si le puzzle est complet
    checkCompletion(newBoard);

    setDraggedPiece(null);
  };

  const handleRemovePiece = (position) => {
    const piece = board[position];
    if (!piece) return;

    const newBoard = [...board];
    newBoard[position] = null;
    setBoard(newBoard);

    setPieces([...pieces, piece]);

    // Recalculer le score
    const correctPieces = newBoard.filter((p, i) => p && p.correctPosition === i).length;
    setScore(correctPieces);
  };

  const checkCompletion = (currentBoard) => {
    const allPlaced = currentBoard.every(p => p !== null);
    const allCorrect = currentBoard.every((p, i) => p && p.correctPosition === i);
    
    if (allPlaced && allCorrect) {
      setIsComplete(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setPieces([]);
    setBoard([]);
    setScore(0);
    setIsComplete(false);
    setPuzzleSelection(true);
    setSelectedPuzzle(null);
    setDifficulty(null);
    setShowDifficultySelection(false);
  };

  const startPuzzle = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setPuzzleSelection(false);
    setShowDifficultySelection(true);
  };

  const startGameWithDifficulty = (difficultyLevel) => {
    setDifficulty(difficultyLevel);
    setShowDifficultySelection(false);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/349c14a99_digital-screen-with-environment-day.jpg)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/80 via-purple-950/70 to-blue-950/80" />
      
      <BiolumiHeader currentPage="Puzzle" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {puzzleSelection ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Trophy className="w-24 h-24 text-blue-400 mx-auto mb-6" />
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Puzzles Écologiques
              </h1>
              <p className="text-xl text-blue-300 mb-8 max-w-2xl mx-auto">
                Choisis un puzzle et reconstitue l'image en plaçant toutes les pièces au bon endroit !
              </p>
              <div className="mb-8">
                <p className="text-lg text-blue-200">
                  🧩 {TOTAL_PIECES} pièces par puzzle • 1 point par pièce bien placée
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {PUZZLES.map((puzzle) => (
                  <motion.div
                    key={puzzle.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startPuzzle(puzzle)}
                    className="cursor-pointer"
                  >
                    <div className={`relative rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br ${puzzle.color}`}>
                      <img 
                        src={puzzle.image} 
                        alt={puzzle.name}
                        className="w-full h-64 object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{puzzle.name}</h3>
                        <p className="text-white/80">{TOTAL_PIECES} pièces</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : showDifficultySelection ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Choisis ton niveau de difficulté
              </h2>
              <p className="text-xl text-blue-300 mb-8 max-w-2xl mx-auto">
                Plus c'est difficile, moins tu vois la photo de référence !
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
                {DIFFICULTY_LEVELS.map((level) => (
                  <motion.div
                    key={level.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startGameWithDifficulty(level)}
                    className="cursor-pointer"
                  >
                    <div className="relative rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-gradient-to-br from-purple-500 to-blue-600 p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">{level.name}</h3>
                      <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                        <img 
                          src={selectedPuzzle.image} 
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                          style={{ opacity: level.opacity }}
                        />
                        {level.opacity === 0 && (
                          <div className="absolute inset-0 bg-black flex items-center justify-center">
                            <span className="text-white text-lg font-bold">❓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-white/80 text-sm">
                        Photo visible à {Math.round(level.opacity * 100)}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => setShowDifficultySelection(false)}
                variant="outline"
                className="border-blue-400 text-blue-300"
              >
                ← Retour aux puzzles
              </Button>
            </motion.div>
          ) : !isComplete ? (
            <>
              {/* Score */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-blue-400/30">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">
                        {score} / {TOTAL_PIECES}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-purple-400/30">
                    <span className="text-lg font-bold text-white">{selectedPuzzle?.name}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-yellow-400/30">
                    <span className="text-lg font-bold text-yellow-300">{difficulty?.name}</span>
                  </div>
                </div>
                <Button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-white/10 border border-blue-400"
                >
                  <RotateCcw className="w-5 h-5" />
                  Changer de Puzzle
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Plateau de puzzle */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-blue-300 text-center">
                    Plateau de Puzzle
                  </h2>
                  <div 
                    className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-2 border-4 border-blue-400/30"
                    style={{ aspectRatio: '1' }}
                  >
                    {/* Photo de référence en fond */}
                    {difficulty && difficulty.opacity > 0 && (
                      <div 
                        className="absolute rounded-2xl overflow-hidden pointer-events-none"
                        style={{ 
                          opacity: difficulty.opacity,
                          inset: '0.5rem',
                        }}
                      >
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url(${selectedPuzzle.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-4 gap-1 h-full relative z-10">
                      {board.map((piece, index) => (
                        <motion.div
                          key={index}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(index)}
                          onClick={() => piece && handleRemovePiece(index)}
                          className={`relative border rounded overflow-hidden cursor-pointer transition-all ${
                            piece 
                              ? piece.correctPosition === index
                                ? 'border-green-400 bg-green-500/20'
                                : 'border-yellow-400 bg-yellow-500/20'
                              : 'border-blue-400/30 bg-blue-950/30'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {piece && (
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundImage: `url(${selectedPuzzle.image})`,
                                backgroundSize: `${GRID_SIZE * 100}%`,
                                backgroundPosition: `${(piece.col * 100) / (GRID_SIZE - 1)}% ${(piece.row * 100) / (GRID_SIZE - 1)}%`,
                              }}
                            />
                          )}
                          {piece && piece.correctPosition === index && (
                            <div className="absolute top-0 right-0">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Zone des pièces disponibles */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-blue-300 text-center">
                    Pièces Disponibles ({pieces.length})
                  </h2>
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-2 border-4 border-purple-400/30 min-h-[500px] max-h-[600px] overflow-y-auto">
                    <div className="grid grid-cols-4 gap-1">
                      {pieces.map((piece) => (
                        <motion.div
                          key={piece.id}
                          draggable
                          onDragStart={() => handleDragStart(piece)}
                          className="relative aspect-square border border-purple-400 rounded overflow-hidden cursor-move hover:border-purple-300 transition-all"
                          whileHover={{ scale: 1.15, rotate: 5, zIndex: 10 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage: `url(${selectedPuzzle.image})`,
                              backgroundSize: `${GRID_SIZE * 100}%`,
                              backgroundPosition: `${(piece.col * 100) / (GRID_SIZE - 1)}% ${(piece.row * 100) / (GRID_SIZE - 1)}%`,
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-blue-200 text-sm mt-2">
                    💡 Glisse-dépose ou clique sur les pièces
                  </p>
                </div>
              </div>
            </>
          ) : null}

          {/* Message de victoire */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              >
                <div className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-md">
                  <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-black text-emerald-600 mb-4">
                    Bravo ! 🎉
                  </h2>
                  <p className="text-xl text-gray-700 mb-6">
                    Tu as reconstitué le puzzle !
                  </p>
                  <p className="text-3xl font-bold text-emerald-600 mb-8">
                    Score parfait : {TOTAL_PIECES}/{TOTAL_PIECES}
                  </p>
                  <Button
                    onClick={resetGame}
                    className="px-8 py-6 text-xl bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    Rejouer
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}