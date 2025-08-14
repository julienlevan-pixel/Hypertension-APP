import CompletionScreen from "@/pages/CompletionScreen";

export default function DoneTest() {
  return (
    <CompletionScreen
      gameState={{
        score: 1200,
        questionsAnswered: 20,
        correctAnswers: 18,
        totalTime: 240,
        currentLevel: 4
      }}
      onRestart={() => alert("restart")}
      onShowLeaderboard={() => alert("show leaderboard")}
    />
  );
}
