import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import GameInterface from "@/components/GameInterface";
import GameOverScreen from "@/components/GameOverScreen";
import CompletionScreen from "@/components/CompletionScreen";
import LeaderboardModal from "@/components/LeaderboardModal";
import { useGameState } from "@/hooks/useGameState";

export default function Home() {
  const { gameState, actions } = useGameState();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const renderCurrentScreen = () => {
    if (gameState.isGameOver) {
      return <GameOverScreen gameState={gameState} onRestart={actions.resetGame} onShowLeaderboard={() => setShowLeaderboard(true)} />;
    }
    
    if (gameState.isCompleted) {
      return <CompletionScreen 
        gameState={gameState} 
        onRestart={actions.resetGame} 
        onShowLeaderboard={() => setShowLeaderboard(true)} 
      />;
    }
    
    if (gameState.isPlaying) {
      return <GameInterface gameState={gameState} actions={actions} />;
    }
    
    return <WelcomeScreen onStart={actions.startGame} onShowLeaderboard={() => setShowLeaderboard(true)} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-medical-blue text-white p-2 rounded-lg">
                {/* Blood pressure monitor icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.69 2 6 4.69 6 8c0 .68.12 1.33.32 1.95L12 22l5.68-12.05c.2-.62.32-1.27.32-1.95C18 4.69 15.31 2 12 2z"/>
                  <circle cx="12" cy="8" r="2.5" fill="white"/>
                  <rect x="10.5" y="6.5" width="3" height="3" rx="0.5" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HTA Quiz</h1>
                <p className="text-xs text-gray-500">Formation Médicale Interactive</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowLeaderboard(true)}
                className="text-gray-600 hover:text-medical-blue transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {renderCurrentScreen()}

      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}
