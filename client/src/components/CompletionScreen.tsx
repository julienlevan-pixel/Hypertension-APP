import { useState } from "react";
import type { GameState } from "@shared/schema";
import { useLeaderboard } from "@/hooks/useLeaderboard";

interface CompletionScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onShowLeaderboard: () => void;
}

export default function CompletionScreen({ gameState, onRestart, onShowLeaderboard }: CompletionScreenProps) {
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);
  const { saveScore, isScoreEligibleForLeaderboard } = useLeaderboard();
  
  const isEligible = isScoreEligibleForLeaderboard(gameState.score);

  const totalTime = 240; // Mock total time in seconds
  const accuracy = Math.round((gameState.correctAnswers / gameState.questionsAnswered) * 100);
  const averageTime = totalTime / gameState.questionsAnswered;

  const handleSaveScore = () => {
    if (playerName.trim()) {
      saveScore({
        name: playerName.trim(),
        score: gameState.score,
        time: totalTime,
        level: gameState.currentLevel,
        accuracy,
        date: new Date().toLocaleDateString('fr-FR'),
        isCompleted: true,
        correctAnswersInLevel: gameState.correctAnswersInCurrentLevel || 0,
      });
      setSaved(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-success-green rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Félicitations !</h2>
        <p className="text-lg text-gray-600 mb-6">
          Vous avez terminé avec succès tous les niveaux du quiz HTA. Excellent travail !
        </p>
      </div>

      {/* Final Score Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-success-green mb-2">
            {gameState.score.toLocaleString()}
          </div>
          <div className="text-lg text-gray-600">Score Total</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-medical-blue">{formatTime(totalTime)}</div>
            <div className="text-sm text-gray-600">Temps total</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-success-green">{accuracy}%</div>
            <div className="text-sm text-gray-600">Précision</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-warning-orange">{averageTime.toFixed(1)}s</div>
            <div className="text-sm text-gray-600">Temps moyen</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{gameState.currentLevel}</div>
            <div className="text-sm text-gray-600">Niveau atteint</div>
          </div>
        </div>
      </div>

      {/* Name Input for Leaderboard - Only if eligible */}
      {!saved && isEligible && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Enregistrer votre score</h3>
          <div className="max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Entrez votre nom ou pseudo" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-medical-blue"
            />
            <button 
              onClick={handleSaveScore}
              disabled={!playerName.trim()}
              className="btn-primary w-full mt-3 bg-medical-blue hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Enregistrer dans le Classement
            </button>
          </div>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-center">
          <svg className="w-6 h-6 text-success-green mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <p className="text-success-green font-semibold">Score enregistré avec succès !</p>
        </div>
      )}

      <div className="text-center space-y-3">
        <button 
          onClick={onRestart}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors mr-4"
        >
          <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Nouveau Quiz
        </button>
        <button 
          onClick={onShowLeaderboard}
          className="btn-primary bg-medical-blue hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Voir le Classement
        </button>
      </div>
    </div>
  );
}
