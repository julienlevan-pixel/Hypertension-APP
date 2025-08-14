import { useState } from "react";
import type { GameState } from "@shared/schema";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import Timer from "./Timer";
import FeedbackModal from "./FeedbackModal";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useQuestions } from "@/hooks/useQuestions";

interface GameInterfaceProps {
  gameState: GameState;
  actions: {
    answerQuestion: (answer: string, responseTime: number, isCorrect: boolean) => void;
    nextQuestion: () => void;
  };
}

export default function GameInterface({ gameState, actions }: GameInterfaceProps) {
  const { data: questions, isLoading } = useQuestions();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    selectedAnswer: string;
    explanation: string;
    score: number;
    responseTime: number;
    questionText?: string;
    allOptions?: string[];
  } | null>(null);

  const currentQuestion = questions?.[gameState.currentLevel]?.[gameState.currentQuestionIndex];

  const handleAnswerSubmit = (answer: string, responseTime: number) => {
    setSelectedAnswer(answer);
    const isCorrect = currentQuestion?.reponse_correcte === answer;
    const score = calculateScore(isCorrect, responseTime);
    
    setFeedback({
      isCorrect,
      explanation: currentQuestion?.explication || "Consultez vos notes de cours pour mieux comprendre ce concept médical important.",
      correctAnswer: currentQuestion?.reponse_correcte || "",
      selectedAnswer: answer,
      score,
      responseTime,
      questionText: currentQuestion?.question || "",
      allOptions: [currentQuestion?.optionA, currentQuestion?.optionB, currentQuestion?.optionC, currentQuestion?.optionD].filter(Boolean) || []
    });
    
    setShowFeedback(true);
    actions.answerQuestion(answer, responseTime, isCorrect);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setFeedback(null);
    actions.nextQuestion();
  };

  const calculateScore = (isCorrect: boolean, timeInSeconds: number) => {
    const basePoints = isCorrect ? 100 : 0;
    const maxTime = 30;
    const speedBonus = Math.max(0, 50 * (1 - timeInSeconds / maxTime));
    return basePoints + Math.round(speedBonus);
  };



  if (isLoading || !currentQuestion) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((gameState.currentLevel - 1) * 5 + gameState.currentQuestionIndex + 1) / 20 * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Progress and Stats Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          
          {/* Level Progress */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Niveau</span>
              <span className="text-medical-blue font-bold ml-1">{gameState.currentLevel}</span>
              <span className="text-gray-400">/ 4</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Question</span>
              <span className="text-medical-blue font-bold ml-1">{gameState.currentQuestionIndex + 1}</span>
              <span className="text-gray-400">/ 5</span>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar percentage={progressPercentage} />

          {/* Timer and Score */}
          <div className="flex items-center space-x-6">
            <Timer onTimeUpdate={() => {}} />
            <div className="text-center">
              <div className="text-2xl font-bold text-success-green">{gameState.score.toLocaleString()}</div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <QuestionCard 
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            disabled={showFeedback}
          />

          {/* Error Counter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Erreurs totales :</span>
                  <span className="text-error-red font-bold ml-1">{gameState.totalErrors}</span>
                  <span className="text-gray-400">/ 3</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Erreurs consécutives :</span>
                  <span className="text-error-red font-bold ml-1">{gameState.consecutiveErrors}</span>
                  <span className="text-gray-400">/ 2</span>
                </div>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i <= gameState.totalErrors ? 'bg-error-red' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Level Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 text-medical-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Niveaux de Bloom
            </h4>
            <div className="space-y-2">
              {[
                { level: 1, name: "Connaissance" },
                { level: 2, name: "Compréhension" },
                { level: 3, name: "Application" },
                { level: 4, name: "Analyse" }
              ].map(({ level, name }) => (
                <div 
                  key={level}
                  className={`flex items-center justify-between p-2 rounded-lg border-l-4 ${
                    level < gameState.currentLevel 
                      ? 'bg-green-50 border-success-green'
                      : level === gameState.currentLevel
                      ? 'bg-medical-blue bg-opacity-10 border-medical-blue'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    level < gameState.currentLevel 
                      ? 'text-success-green'
                      : level === gameState.currentLevel
                      ? 'text-medical-blue'
                      : 'text-gray-600'
                  }`}>
                    {level}. {name}
                  </span>
                  {level < gameState.currentLevel ? (
                    <svg className="w-4 h-4 text-success-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : level > gameState.currentLevel ? (
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 text-medical-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Statistiques
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bonnes réponses</span>
                <span className="font-semibold text-success-green">{gameState.correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Questions répondues</span>
                <span className="font-semibold text-gray-900">{gameState.questionsAnswered}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Précision</span>
                <span className="font-semibold text-medical-blue">
                  {gameState.questionsAnswered > 0 
                    ? Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFeedback && feedback && (
        <FeedbackModal
          feedback={feedback}
          onContinue={handleContinue}
        />
      )}


    </div>
  );
}
