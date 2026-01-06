import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { Trophy, Star, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Image de la planète à utiliser pour le puzzle
const PLANET_IMAGE = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/af6a6b206_green-earth-globe-with-continents-oceans.png';

// Configuration du puzzle (4x4 = 16 pièces)
const GRID_SIZE = 4;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

export default function PuzzlePage() {
  const [pieces, setPieces] = useState([]);
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      initializePuzzle();
    }
  }, [gameStarted]);

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
          {!gameStarted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Trophy className="w-24 h-24 text-blue-400 mx-auto mb-6" />
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Puzzle de la Planète
              </h1>
              <p className="text-xl text-blue-300 mb-8 max-w-2xl mx-auto">
                Reconstitue l'image de notre Terre en plaçant toutes les pièces au bon endroit !
              </p>
              <div className="mb-8">
                <p className="text-lg text-blue-200">
                  🧩 {TOTAL_PIECES} pièces à assembler • 1 point par pièce bien placée
                </p>
              </div>
              <Button
                onClick={() => setGameStarted(true)}
                className="px-8 py-6 text-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Commencer le Puzzle
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Score */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-blue-400/30">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">
                    Score: {score} / {TOTAL_PIECES}
                  </span>
                </div>
                <Button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-white/10 border border-blue-400"
                >
                  <RotateCcw className="w-5 h-5" />
                  Recommencer
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Plateau de puzzle */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-blue-300 text-center">
                    Plateau de Puzzle
                  </h2>
                  <div 
                    className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-4 border-4 border-blue-400/30"
                    style={{ aspectRatio: '1' }}
                  >
                    <div className="grid grid-cols-4 gap-1 h-full">
                      {board.map((piece, index) => (
                        <motion.div
                          key={index}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(index)}
                          onClick={() => piece && handleRemovePiece(index)}
                          className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
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
                                backgroundImage: `url(${PLANET_IMAGE})`,
                                backgroundSize: `${GRID_SIZE * 100}%`,
                                backgroundPosition: `${(piece.col / (GRID_SIZE - 1)) * 100}% ${(piece.row / (GRID_SIZE - 1)) * 100}%`,
                              }}
                            />
                          )}
                          {piece && piece.correctPosition === index && (
                            <div className="absolute top-1 right-1">
                              <CheckCircle className="w-4 h-4 text-green-400" />
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
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 border-4 border-purple-400/30 min-h-[500px]">
                    <div className="grid grid-cols-4 gap-2">
                      {pieces.map((piece) => (
                        <motion.div
                          key={piece.id}
                          draggable
                          onDragStart={() => handleDragStart(piece)}
                          className="relative aspect-square border-2 border-purple-400 rounded-lg overflow-hidden cursor-move hover:border-purple-300 transition-all"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundImage: `url(${PLANET_IMAGE})`,
                              backgroundSize: `${GRID_SIZE * 100}%`,
                              backgroundPosition: `${(piece.col / (GRID_SIZE - 1)) * 100}% ${(piece.row / (GRID_SIZE - 1)) * 100}%`,
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-blue-200 text-sm">
                    Glisse-dépose les pièces sur le plateau
                  </p>
                </div>
              </div>

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
                        Tu as reconstitué la planète Terre !
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}