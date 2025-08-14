import { useLeaderboard } from "@/hooks/useLeaderboard";
// Si alias '@' OK :
import leaderboardIcon from "@/assets/leaderboard.png";
// Sinon chemin relatif (ex) :
// import leaderboardIcon from "../assets/leaderboard.png";

interface LeaderboardModalProps {
  onClose: () => void;
}

export default function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const { entries } = useLeaderboard();

  const formatDate = (dateInput: string | number) => {
    const d = typeof dateInput === "number" ? new Date(dateInput) : new Date(dateInput);
    return d.toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" });
  };

  const formatTime = (seconds: number) => {
    const s = Number.isFinite(seconds) ? seconds : 0;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatScore = (n: number) =>
    new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 0 }).format(n);

  const formatPercent = (p: number) => {
    const val = p <= 1 ? p * 100 : p; // support 0–1 ou 0–100
    return new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 2 }).format(val) + " %";
  };

  // TOP 10 : tri score desc, puis percent desc, puis date récente
  const top = [...entries]
    .sort(
      (a, b) =>
        (b.score ?? 0) - (a.score ?? 0) ||
        (Number(b.percent ?? 0) - Number(a.percent ?? 0)) ||
        ((b.date ?? 0) - (a.date ?? 0))
    )
    .slice(0, 10);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <img src={leaderboardIcon} alt="Classement" className="w-6 h-6 mr-3 inline-block align-middle" />
            Classement
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Fermer">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {top.length === 0 ? (
          <div className="text-center py-8">
            <img src={leaderboardIcon} alt="" aria-hidden className="w-12 h-12 opacity-40 mx-auto mb-4" />
            <p className="text-gray-600">Aucun score enregistré pour le moment.</p>
            <p className="text-sm text-gray-500 mt-2">Soyez le premier à terminer le quiz !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {top.map((entry, index) => {
              const bgColor =
                index === 0
                  ? "bg-yellow-50 border-yellow-200"
                  : index === 1
                  ? "bg-gray-50 border-gray-200"
                  : index === 2
                  ? "bg-orange-50 border-orange-200"
                  : "bg-white border-gray-200";

              // champs optionnels tolérés (isCompleted/time/level peuvent ne pas exister)
              const showTime = typeof (entry as any).time === "number";
              const isCompleted = Boolean((entry as any).isCompleted);
              const level = (entry as any).level;
              const correctInLevel = (entry as any).correctAnswersInLevel;

              return (
                <div
                  key={`${entry.name}-${index}`}
                  className={`flex items-center justify-between p-4 ${bgColor} border-2 rounded-lg`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-orange-400"
                          : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{entry.name}</span>

                        {typeof (entry as any).isCompleted !== "undefined" && (
                          isCompleted ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              ✓ Terminé
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                              ⏳ En cours
                            </span>
                          )
                        )}
                      </div>

                      <div className="text-sm text-gray-600">
                        {formatDate(entry.date)}
                        {showTime && <> • {formatTime((entry as any).time)}</>}
                        {typeof correctInLevel !== "undefined" && typeof level !== "undefined" && (
                          <span className="ml-2">• Niveau {level} ({correctInLevel}/5)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xl font-bold ${
                        index === 0
                          ? "text-yellow-600"
                          : index === 1
                          ? "text-gray-600"
                          : index === 2
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {formatScore(entry.score)}
                    </div>
                    <div className="text-sm text-gray-600">{formatPercent(entry.percent)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="btn-primary bg-medical-blue hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

