import type { GameState } from "@shared/schema";

export function checkGameOver(gameState: GameState): boolean {
  // Game over if 3 total errors OR 2 consecutive errors
  return gameState.totalErrors >= 3 || gameState.consecutiveErrors >= 2;
}

export function checkLevelProgression(correctAnswersInLevel: number): boolean {
  // Progress to next level after 5 correct answers in current level
  return correctAnswersInLevel >= 5;
}

export function calculateProgress(gameState: GameState): number {
  // Calculate overall progress percentage
  const totalQuestions = 20; // 4 levels × 5 questions
  const questionsCompleted = (gameState.currentLevel - 1) * 5 + gameState.currentQuestionIndex;
  return (questionsCompleted / totalQuestions) * 100;
}
