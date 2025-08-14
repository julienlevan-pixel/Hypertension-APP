import { z } from "zod";

export const questionSchema = z.object({
  niveau: z.number().min(1).max(4),
  domaine: z.string(),
  question: z.string(),
  optionA: z.string(),
  optionB: z.string(),
  optionC: z.string(),
  optionD: z.string(),
  reponse_correcte: z.enum(['A', 'B', 'C', 'D']),
  explication: z.string(),
  reference: z.string(),
});

export const leaderboardEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number(),
  time: z.number(),
  level: z.number(),
  accuracy: z.number(),
  date: z.string(),
  isCompleted: z.boolean().default(false),
  correctAnswersInLevel: z.number().default(0),
});

export const gameStateSchema = z.object({
  currentLevel: z.number().min(1).max(4),
  currentQuestionIndex: z.number(),
  score: z.number(),
  totalErrors: z.number(),
  consecutiveErrors: z.number(),
  correctAnswers: z.number(),
  questionsAnswered: z.number(),
  correctAnswersInCurrentLevel: z.number().default(0),
  startTime: z.number().optional(),
  isPlaying: z.boolean(),
  isGameOver: z.boolean(),
  isCompleted: z.boolean(),
});

export type Question = z.infer<typeof questionSchema>;
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type GameState = z.infer<typeof gameStateSchema>;

export const insertLeaderboardEntrySchema = leaderboardEntrySchema.omit({ id: true });
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
