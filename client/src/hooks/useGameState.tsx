import { useState, useCallback } from "react";
import type { GameState } from "@shared/schema";
import { checkGameOver, checkLevelProgression } from "@/utils/gameLogic";
import { calculateScore } from "@/utils/scoreCalculator";

const initialGameState: GameState = {
  currentLevel: 1,
  currentQuestionIndex: 0,
  score: 0,
  totalErrors: 0,
  consecutiveErrors: 0,
  correctAnswers: 0,
  questionsAnswered: 0,
  correctAnswersInCurrentLevel: 0,
  isPlaying: false,
  isGameOver: false,
  isCompleted: false,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const startGame = useCallback(() => {
    setGameState({
      ...initialGameState,
      isPlaying: true,
      startTime: Date.now(),
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  const answerQuestion = useCallback((answer: string, responseTime: number, isCorrect: boolean) => {
    setGameState(prev => {
      const questionScore = calculateScore(isCorrect, responseTime);
      
      const newGameState = {
        ...prev,
        score: prev.score + questionScore,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        correctAnswersInCurrentLevel: prev.correctAnswersInCurrentLevel + (isCorrect ? 1 : 0),
        totalErrors: prev.totalErrors + (isCorrect ? 0 : 1),
        consecutiveErrors: isCorrect ? 0 : prev.consecutiveErrors + 1,
      };

      // Check for game over conditions
      if (checkGameOver(newGameState)) {
        return {
          ...newGameState,
          isPlaying: false,
          isGameOver: true,
        };
      }

      return newGameState;
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setGameState(prev => {
      const newQuestionIndex = prev.currentQuestionIndex + 1;
      
      // Check if we need to advance to next level
      if (checkLevelProgression(prev.correctAnswersInCurrentLevel)) {
        if (prev.currentLevel === 4) {
          // Game completed
          return {
            ...prev,
            isPlaying: false,
            isCompleted: true,
          };
        } else {
          // Next level
          return {
            ...prev,
            currentLevel: prev.currentLevel + 1,
            currentQuestionIndex: 0,
            correctAnswersInCurrentLevel: 0,
          };
        }
      }

      // Next question in same level
      return {
        ...prev,
        currentQuestionIndex: newQuestionIndex,
      };
    });
  }, []);

  return {
    gameState,
    actions: {
      startGame,
      resetGame,
      answerQuestion,
      nextQuestion,
    },
  };
}
