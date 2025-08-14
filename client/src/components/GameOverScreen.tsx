import type { GameState } from "@shared/schema";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useState } from "react";

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onShowLeaderboard: () => void;
}

export default function GameOverScreen({ gameState, onRestart, onShowLeaderboard }: GameOverScreenProps) {
  const { isScoreEligibleForLeaderboard, saveScore } = useLeaderboard();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);

  const isEligible = isScoreEligibleForLeaderboard(gameState.score);

  const handleSaveScore = () => {
    if (!playerName.trim()) return;
    
    const accuracy = gameState.questionsAnswered > 0 
      ? (gameState.correctAnswers / gameState.questionsAnswered) * 100 
      : 0;
    
    const currentTime = gameState.startTime 
      ? Math.floor((Date.now() - gameState.startTime) / 1000) 
      : 0;

    saveScore({
      name: playerName,
      score: gameState.score,
      level: gameState.currentLevel,
      time: currentTime,
      accuracy,
      date: new Date().toLocaleDateString('fr-FR'),
      isCompleted: false,
      correctAnswersInLevel: gameState.correctAnswersInCurrentLevel,
    });

    setShowSaveModal(false);
    setSaved(true);
    setPlayerName("");
  };
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="w-20 h-20 bg-error-red rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Terminé</h2>
        <p className="text-lg text-gray-600 mb-4">
          Vous avez dépassé le nombre d'erreurs autorisées. Ne vous découragez pas, l'apprentissage est un processus !
        </p>
        
        {/* Score Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-2xl font-bold text-gray-900 mb-2">{gameState.score.toLocaleString()} points</div>
          <div className="text-sm text-gray-600 space-x-4">
            <span>Niveau {gameState.currentLevel}</span>
            <span>•</span>
            <span>{gameState.correctAnswers}/{gameState.questionsAnswered} bonnes réponses</span>
            {gameState.questionsAnswered > 0 && (
              <>
                <span>•</span>
                <span>{Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100)}% de précision</span>
              </>
            )}
          </div>
        </div>

        {/* Top 10 Save Option */}
        {isEligible && !saved && !showSaveModal && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-yellow-800 font-semibold">🏆 Score éligible pour le Top 10 !</span>
            </div>
            <button 
              onClick={() => setShowSaveModal(true)}
              className="btn-primary bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Enregistrer mon score
            </button>
          </div>
        )}

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-green-800">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Score enregistré dans le classement !
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button 
            onClick={onRestart}
            className="btn-primary w-full bg-medical-blue hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Recommencer le Quiz
          </button>
          <button 
            onClick={onShowLeaderboard}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Voir le Classement
          </button>
        </div>
      </div>

      {/* Save Score Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🏆 Enregistrer votre score
            </h3>
            <p className="text-gray-600 mb-4">
              Votre score de {gameState.score.toLocaleString()} points peut figurer dans le top 10 !
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre nom
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-medical-blue"
                placeholder="Entrez votre nom..."
                maxLength={20}
              />
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleSaveScore}
                disabled={!playerName.trim()}
                className="btn-primary flex-1 bg-medical-blue hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Sauvegarder
              </button>
              <button 
                onClick={() => setShowSaveModal(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
