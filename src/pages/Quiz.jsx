import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BiolumiHeader from '@/components/shared/BiolumiHeader';
import { BookOpen, CheckCircle, XCircle, Trophy, Leaf, TreeDeciduous, Droplets, Sprout, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categoryIcons = {
  permaculture: Sprout,
  foret: TreeDeciduous,
  agroecologie: Leaf,
  eau: Droplets,
  climat: Globe
};

const categoryColors = {
  permaculture: 'from-lime-600 to-green-700',
  foret: 'from-green-600 to-emerald-700',
  agroecologie: 'from-emerald-600 to-teal-700',
  eau: 'from-blue-600 to-cyan-700',
  climat: 'from-teal-600 to-emerald-700'
};

const QuizCard = ({ quiz, onStart }) => {
  const Icon = categoryIcons[quiz.category] || BookOpen;
  const colorClass = categoryColors[quiz.category] || 'from-emerald-500 to-teal-500';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-emerald-400/20 overflow-hidden cursor-pointer"
      onClick={() => onStart(quiz)}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 blur-2xl`} />
      
      <div className="relative">
        <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${colorClass} mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-xl font-bold text-emerald-300 mb-2">{quiz.title}</h3>
        <p className="text-emerald-200/70 mb-4 text-sm">{quiz.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-emerald-400">
            {quiz.questions?.length || 0} questions
          </div>
          <Button className={`bg-gradient-to-r ${colorClass} hover:opacity-90`}>
            Commencer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const QuizQuestion = ({ question, questionIndex, onAnswer, selectedAnswers }) => {
  const isMultiple = question.correct_answers?.length > 1;

  const handleSelect = (optionIndex) => {
    if (isMultiple) {
      const newAnswers = selectedAnswers.includes(optionIndex)
        ? selectedAnswers.filter(i => i !== optionIndex)
        : [...selectedAnswers, optionIndex];
      onAnswer(newAnswers);
    } else {
      onAnswer([optionIndex]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 mb-4">
          Question {questionIndex + 1}
        </div>
        <h3 className="text-2xl font-bold text-emerald-300 mb-2">{question.question}</h3>
        {isMultiple && (
          <p className="text-sm text-emerald-400/70">Plusieurs réponses possibles</p>
        )}
      </div>

      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleSelect(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full p-4 rounded-xl text-left transition-all border-2
              ${selectedAnswers.includes(index)
                ? 'bg-emerald-500/20 border-emerald-400'
                : 'bg-white/5 border-transparent hover:bg-white/10'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAnswers.includes(index) ? 'border-emerald-400 bg-emerald-400' : 'border-emerald-400/30'
              }`}>
                {selectedAnswers.includes(index) && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-emerald-200">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

const QuizResults = ({ quiz, userAnswers, onRestart, onClose }) => {
  const score = quiz.questions.reduce((acc, q, i) => {
    const userAnswer = userAnswers[i] || [];
    const correctAnswers = q.correct_answers || [];
    const isCorrect = userAnswer.length === correctAnswers.length &&
      userAnswer.every(a => correctAnswers.includes(a));
    return acc + (isCorrect ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / quiz.questions.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
        <Trophy className="w-16 h-16 text-white" />
      </div>

      <div>
        <h2 className="text-4xl font-bold text-emerald-300 mb-2">{percentage}%</h2>
        <p className="text-emerald-200/70">
          {score} / {quiz.questions.length} bonnes réponses
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {quiz.questions.map((q, i) => {
          const userAnswer = userAnswers[i] || [];
          const correctAnswers = q.correct_answers || [];
          const isCorrect = userAnswer.length === correctAnswers.length &&
            userAnswer.every(a => correctAnswers.includes(a));

          return (
            <div key={i} className="p-4 rounded-xl bg-white/5 text-left">
              <div className="flex items-start gap-3 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <p className="text-emerald-200 font-semibold mb-1">{q.question}</p>
                  {!isCorrect && (
                    <div className="text-sm text-emerald-300/70 mt-2">
                      <p className="mb-1">✅ Bonne(s) réponse(s) : {correctAnswers.map(idx => q.options[idx]).join(', ')}</p>
                      {q.explanation && <p className="italic">💡 {q.explanation}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button onClick={onRestart} variant="outline" className="flex-1">
          Recommencer
        </Button>
        <Button onClick={onClose} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500">
          Terminer
        </Button>
      </div>
    </motion.div>
  );
};

export default function QuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const { data: quizzes } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => base44.entities.Quiz.list()
  });

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleNextQuestion = () => {
    if (selectedAnswers.length === 0) return;

    const newAnswers = { ...userAnswers, [currentQuestionIndex]: selectedAnswers };
    setUserAnswers(newAnswers);
    setSelectedAnswers([]);

    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleClose = () => {
    setSelectedQuiz(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6959886137576a65dcfe1370/970771c57_save-earth-planet-world-concept.jpg)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/70 via-emerald-950/60 to-teal-950/70" />
      
      {/* Bulles bioluminescentes flottantes */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/20 blur-xl"
            style={{
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
      
      <BiolumiHeader currentPage="Quiz" />

      <main className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {!selectedQuiz ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 mb-6">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Quiz Éducatifs</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  Teste tes Connaissances
                </h1>
                <p className="text-lg text-emerald-300/70 max-w-2xl mx-auto">
                  Évalue ton niveau sur les thèmes environnementaux et apprends de nouvelles choses
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes?.map((quiz, i) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <QuizCard quiz={quiz} onStart={handleStartQuiz} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-emerald-400/20"
              >
                {!showResults ? (
                  <>
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-emerald-300">{selectedQuiz.title}</h2>
                        <button onClick={handleClose} className="text-emerald-400 hover:text-emerald-300">
                          ✕
                        </button>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <QuizQuestion
                        key={currentQuestionIndex}
                        question={selectedQuiz.questions[currentQuestionIndex]}
                        questionIndex={currentQuestionIndex}
                        onAnswer={setSelectedAnswers}
                        selectedAnswers={selectedAnswers}
                      />
                    </AnimatePresence>

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswers.length === 0}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
                      >
                        {currentQuestionIndex + 1 === selectedQuiz.questions.length ? 'Voir les résultats' : 'Question suivante →'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <QuizResults
                    quiz={selectedQuiz}
                    userAnswers={userAnswers}
                    onRestart={handleRestart}
                    onClose={handleClose}
                  />
                )}
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}