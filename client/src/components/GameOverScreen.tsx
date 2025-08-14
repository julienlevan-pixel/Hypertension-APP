import React, { useState } from "react";

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
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const safeRestart = () => typeof onRestart === "function" && onRestart();
  const safeShowLb = () => typeof onShowLeaderboard === "function" && onShowLeaderboard();

  const handleSaveScore = async () => {
    const playerName = prompt("Entrez votre nom pour le classement :", "");
    if (!playerName) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playerName,
          score: gameState?.score ?? 0,
        }),
      });

      if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
      setMessage("Score enregistré avec succès !");
    } catch (err) {
      console.error(err);
      setMessage("Impossible d'enregistrer le score.");
    } finally {
      setSaving(false);
    }
  };

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
        Score : <span className="font-semibold">{score}</span> • Niveau atteint : <span className="font-semibold">{level}</span>
      </p>

      <div className="space-x-3 mb-4">
        <button onClick={safeRestart} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg">
          Recommencer
        </button>
        <button onClick={safeShowLb} className="bg-medical-blue text-white font-semibold py-3 px-6 rounded-lg">
          Voir le Classement
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={handleSaveScore}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer mon score"}
        </button>
      </div>

      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}
