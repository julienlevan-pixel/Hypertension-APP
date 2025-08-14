import { useLeaderboard } from "@/hooks/useLeaderboard";
// ⬇️ importe ton PNG
import leaderboardIcon from "@/assets/leaderboard.png";

interface LeaderboardModalProps {
  onClose: () => void;
}

export default function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const { leaderboard } = useLeaderboard();

  // Date sûre: accepte string ISO ou timestamp (number)
  const formatDate = (dateInput: string | number) => {
    const d = typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);
    return d.toLocaleDateString("fr-CA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Score uniforme (évite les différences d'appareil)
  const formatScore = (n: number) =>
    new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 0 }).format(n);

  // Pourcentage avec 2 décimales max (supporte 0–1 ou 0–100)
  const formatPercent = (p: number) => {
    const raw = Number(p);
    const val = raw <= 1 ? raw * 100 : raw; // si jamais accuracy est 0–1
    return new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 }).format(val) + " %";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            {/* ⬇️ remplace l'icône par le PNG */}
            <img
              src={leaderboardIcon}
              alt="Classement"
              className="w-6 h-6 mr-3 inline-block align-middle"
            />
            Classement
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            {/* ⬇️ icône vide remplacée aussi */}
            <img
              src={leaderboardIcon}
              alt=""
              aria-hidden
              className="w-12 h-12 opacity-40 mx-auto mb-4"
            />
            <p className="text-gray-600">Aucun score enregistré pour le moment.</p>
            <p className="text-sm text-gray-500 mt-2">Soyez le premier à terminer le quiz !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const isTop3 = index < 3;
              const bgColor =
                index === 0
                  ? "bg-yellow-50 border-yellow-200"
                  : index === 1
                  ? "bg-gray-50 border-gray-200"
                  : index === 2
                  ? "bg-orange-50 border-orange-200"
