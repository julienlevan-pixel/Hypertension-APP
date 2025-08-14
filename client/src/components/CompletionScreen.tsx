import { useState, useMemo } from "react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

type CompletionScreenProps = {
  gameState: any;
  onRestart: () => void;
  onShowLeaderboard: () => void;
};

export default function CompletionScreen({
  gameState,
  onRestart,
  onShowLeaderboard,
}: CompletionScreenProps) {
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);
  const { addEntry } = useLeaderboard();

  // Valeurs "safe" (pas de crash si gameState partiel)
  const answered = Number(
    gameState?.questionsAnswered ?? gameState?.answersCount ?? 0
  );
  const correct = Number(gameState?.correctAnswers ?? gameState?.correct ?? 0);
  const score = Number(gameState?.score ?? 0);
  const level = Number(gameState?.currentLevel ?? gameState?.level ?? 1);
  const totalTime = Number(gameState?.totalTime ?? 240);

  const percentRaw = answered > 0 ? (correct / answered) * 100 : 0;

  const percentLabel = useMemo(
    () =>
      new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 }).format(
        percentRaw
      ) + " %",
    [percentRaw]
  );

  const averageTime = useMemo(
    () => (answered > 0 ? totalTime / answered : 0),
    [totalTime, answered]
  );

  const isEligible = score > 0 && answered > 0;

  const formatTime = (seconds: number) => {
    const s = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveScore = () => {
    const name = playerName.trim();
    if (!name) return;

    addEntry.mutate(
      {
        name: name.slice(0, 40),
        score,
        percent: percentRaw, // 0..100
      },
      { onSuccess: () => setSaved(true), onError: (e: any) => console.error(e) }
    );
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
          Vous avez terminé le quiz HTA. Excellent travail !
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-success-green mb-2">
            {new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 0 }).format(score)}
          </div>
          <div className="text-lg text-gray-600">Score Total</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-medical-blue">
              {formatTime(totalTime)}
            </div>
            <div className="text-sm text-gray-600">Temps total</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-success-green">
              {percentLabel}
            </div>
            <div className="text-sm text-gray-600">Précision</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-warning-orange">
              {averageTime.toFixed(1)}s
            </div>
            <div className="text-sm text-gray-600">Temps moyen</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{level}</div>
            <div className="text-sm text-gray-600">Niveau atteint</div>
          </div>
        </div>
      </div>

      {!saved && isEligible && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Enregistrer votre score
          </h3>
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
              disabled={!playerName.trim() || addEntry.isPending}
              className="btn-primary w-full mt-3 bg-medical-blue hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {addEntry.isPending ? "Enregistrement..." : "Enregistrer dans le Classement"}
            </button>
          </div>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-center">
          <p className="text-success-green font-semibold">Score enregistré avec succès !</p>
        </div>
      )}

      <div className="text-center space-y-3">
        <button
          onClick={onRestart}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors mr-4"
        >
          Nouveau Quiz
        </button>
        <button
          onClick={onShowLeaderboard}
          className="btn-primary bg-medical-blue hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Voir le Classement
        </button>
      </div>
    </div>
  );
}
