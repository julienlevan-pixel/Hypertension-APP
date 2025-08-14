import React, { useState } from "react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

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
  // Callbacks sûrs
  const safeRestart = () => typeof onRestart === "function" && onRestart();
  const safeShowLb = () => typeof onShowLeaderboard === "function" && onShowLeaderboard();

  // State local
  const [playerName, setPlayerName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hook API (POST/GET /api/leaderboard)
  const { addEntry } = useLeaderboard();

  // Valeurs "safe"
  const score = Number(gameState?.score ?? 0);
  const answered = Number(gameState?.questionsAnswered ?? gameState?.answersCount ?? 0);
  const correct  = Number(gameState?.correctAnswers   ?? gameState?.correct       ?? 0);
  const level    = Number(gameState?.currentLevel ?? gameState?.level ?? 1);

  const percent = answered > 0 ? (correct / answered) * 100 : 0; // 0..100
  const percentLabel =
    new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 }).format(percent) + " %";

  const handleSaveScore = () => {
    setMessage(null);
    setErrorMsg(null);

    const name = playerName.trim();
    if (!name) {
      setErrorMsg("Veuillez entrer un nom.");
      return;
    }
    if (score <= 0 || answered <= 0) {
      setErrorMsg("Score non éligible (pas de réponses ou score nul).");
      return;
    }

    // Envoi à l’API — IMPORTANT: inclure percent
    addEntry.mutate(
      { name: name.slice(0, 40), score, percent },
      {
        onSuccess: () => setMessage("Score enregistré avec succès !"),
        onError: (e: any) =>
          setErrorMsg(e?.message || "Impossible d’enregistrer le score."),
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
        </svg>
      </div>

      <h2 className="text-4xl font-bold text-gray-900 mb-2">Fin de la partie</h2>
      <p className="text-gray-600 mb-2">
        Score : <span className="font-semibold">{new Intl.NumberFormat("fr-CA").format(score)}</span>
        {" • "}
        Niveau atteint : <span className="font-semibold">{level}</span>
      </p>
      <p className="text-gray-500 mb-6">Précision : {percentLabel}</p>

      <div className="space-x-3 mb-6">
        <button
          onClick={safeRestart}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Recommencer
        </button>

        {/* Lisibilité ++ : texte bleu sur fond blanc avec bordure */}
        <button
          onClick={safeShowLb}
          className="bg-white text-medical-blue border border-medical-blue hover:bg-medical-blue hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Voir le Classement
        </button>
      </div>

      {/* Formulaire d'enregistrement */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-4 max-w-md mx-auto text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
          Enregistrer mon score
        </h3>
        <label className="block text-sm text-gray-700 mb-1">Nom / Pseudo</label>
        <input
          type="text"
          placeholder="Entrez votre nom"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-medical-blue"
        />

        {errorMsg && <p className="text-red-600 text-sm mt-2">{errorMsg}</p>}
        {message && <p className="text-green-700 text-sm mt-2">{message}</p>}

        <button
          onClick={handleSaveScore}
          disabled={!playerName.trim() || addEntry.isPending}
          className="w-full mt-3 bg-medical-blue hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {addEntry.isPending ? "Enregistrement..." : "Enregistrer mon score"}
        </button>
      </div>
    </div>
  );
}
