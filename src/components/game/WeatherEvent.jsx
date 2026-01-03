import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CloudRain, Sun, Wind, Snowflake, AlertTriangle, Check, X } from 'lucide-react';

const events = {
  drought: {
    title: "Sécheresse ! 🌵",
    description: "Le soleil tape fort et tes plantes ont soif. Comment vas-tu protéger ton jardin ?",
    icon: Sun,
    color: "from-orange-400 to-red-500",
    solutions: [
      { id: 'mulch', label: 'Pailler le sol', correct: true, feedback: "Excellent ! Le paillage garde l'humidité dans le sol." },
      { id: 'trees', label: 'Planter des arbres pour l\'ombre', correct: true, feedback: "Parfait ! Les arbres protègent du soleil et gardent la fraîcheur." },
      { id: 'chemicals', label: 'Utiliser des produits chimiques', correct: false, feedback: "Non ! Les produits chimiques nuisent à la nature. Essaie une solution naturelle !" },
    ],
  },
  storm: {
    title: "Tempête en approche ! 🌪️",
    description: "Un vent violent menace tes cultures. Comment les protéger ?",
    icon: Wind,
    color: "from-slate-500 to-slate-700",
    solutions: [
      { id: 'hedge', label: 'Planter des haies brise-vent', correct: true, feedback: "Super ! Les haies protègent naturellement du vent." },
      { id: 'plastic', label: 'Couvrir de plastique', correct: false, feedback: "Le plastique pollue ! Préfère une solution durable." },
      { id: 'trees', label: 'Utiliser l\'agroforesterie', correct: true, feedback: "Génial ! Les arbres forment un bouclier naturel." },
    ],
  },
  pests: {
    title: "Invasion de pucerons ! 🐛",
    description: "Des insectes attaquent tes plantes. Que fais-tu ?",
    icon: AlertTriangle,
    color: "from-red-400 to-rose-500",
    solutions: [
      { id: 'ladybugs', label: 'Attirer des coccinelles', correct: true, feedback: "Bravo ! Les coccinelles mangent les pucerons naturellement." },
      { id: 'pesticides', label: 'Utiliser des pesticides', correct: false, feedback: "Les pesticides tuent aussi les insectes utiles ! Mauvaise idée." },
      { id: 'companions', label: 'Planter de la lavande', correct: true, feedback: "Excellent ! La lavande repousse naturellement les parasites." },
    ],
  },
};

export default function WeatherEvent({ event, onSolve, onClose }) {
  const [selectedSolution, setSelectedSolution] = React.useState(null);
  const [feedback, setFeedback] = React.useState(null);

  if (!event) return null;

  const eventData = events[event] || events.drought;
  const Icon = eventData.icon;

  const handleSolution = (solution) => {
    setSelectedSolution(solution.id);
    setFeedback({ correct: solution.correct, message: solution.feedback });

    if (solution.correct) {
      setTimeout(() => {
        onSolve(solution.id);
        setSelectedSolution(null);
        setFeedback(null);
      }, 2500);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${eventData.color} p-6 text-white relative overflow-hidden`}>
            {/* Animation de fond */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-4 rounded-2xl bg-white/20"
              >
                <Icon className="w-10 h-10" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">{eventData.title}</h2>
                <p className="text-white/90 text-sm mt-1">{eventData.description}</p>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div className="p-6 space-y-3">
            <h3 className="font-semibold text-slate-700 mb-4">Choisis ta solution :</h3>

            {eventData.solutions.map((solution) => (
              <motion.button
                key={solution.id}
                onClick={() => !feedback && handleSolution(solution)}
                disabled={!!feedback}
                className={`
                  w-full p-4 rounded-xl text-left
                  transition-all duration-300
                  ${selectedSolution === solution.id
                    ? solution.correct
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-red-100 border-2 border-red-500'
                    : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                  }
                  ${feedback && selectedSolution !== solution.id ? 'opacity-50' : ''}
                `}
                whileHover={!feedback ? { scale: 1.02 } : {}}
                whileTap={!feedback ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">{solution.label}</span>
                  {selectedSolution === solution.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {solution.correct ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`
                    p-4 rounded-xl mt-4
                    ${feedback.correct
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                    }
                  `}
                >
                  <p className={feedback.correct ? 'text-green-700' : 'text-red-700'}>
                    {feedback.message}
                  </p>
                  {!feedback.correct && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setSelectedSolution(null);
                        setFeedback(null);
                      }}
                    >
                      Réessayer
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}