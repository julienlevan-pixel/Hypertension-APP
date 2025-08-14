import React from "react";

type Props = {
  gameState?: any;
  onRestart?: () => void;
  onShowLeaderboard?: () => void;
};

export default function GameOverScreen({
  gameState,
  onRestart,
  onShowLeaderboard,
}: Props) {
  // Wrappers sûrs : on ne JAMAIS appelle la prop directement
  const safeRestart = () => {
    if (typeof onRestart === "function") onRestart();
    else console.warn("[GameOverScreen] onRestart n'est pas une fonction");
  };
  const safeShowLb = () => {
    if (typeof onShowLeaderboard === "function") onShowLeaderboard();
    else console.warn("[GameOverScreen] onShowLeaderboard n'est pas une fonction");
  };

  // Valeurs "safe" (évite tout crash si le state est partiel)
  const score = Number(gameState?.score ?? 0);
  const level = Number(gameState?.currentLevel ?? gameState?.level ?? 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <div className="w-24 h-24 bg-warning-orange rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
        </svg>
      </div>
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Fin de la partie</h2>
      <p className="text-gray-600 mb-6">
        Score : <span className="font-semibold">{new Intl.NumberFormat("fr-CA").format(score)}</span> •
        Niveau atteint : <span className="font-semibold">{level}</span>
      </p>

      <div className="space-x-3">
        <button
          onClick={safeRestart}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Recommencer
        </button>
        <button
          onClick={safeShowLb}
          className="btn-primary bg-medical-blue hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Voir le Classement
        </button>
      </div>
    </div>
  );
}
