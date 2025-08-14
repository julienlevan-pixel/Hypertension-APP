import { useState, useEffect } from "react";
import type { LeaderboardEntry, InsertLeaderboardEntry } from "@shared/schema";

const STORAGE_KEY = 'hta-leaderboard';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLeaderboard(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing leaderboard data:', error);
        setLeaderboard([]);
      }
    }
  }, []);

  const saveScore = (entry: InsertLeaderboardEntry) => {
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };

    setLeaderboard(prev => {
      // Remove any existing entry for the same player if it's not completed
      const filteredPrev = prev.filter(existing => 
        existing.name !== entry.name || existing.isCompleted
      );
      
      const updated = [...filteredPrev, newEntry]
        .sort((a, b) => {
          // Sort by completion status first (completed games first), then by score
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? -1 : 1;
          }
          return b.score - a.score || a.time - b.time;
        })
        .slice(0, 10); // Keep only top 10
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isScoreEligibleForLeaderboard = (score: number) => {
    if (leaderboard.length < 10) return true;
    const lowestScore = leaderboard[leaderboard.length - 1]?.score || 0;
    return score > lowestScore;
  };

  return {
    leaderboard,
    saveScore,
    isScoreEligibleForLeaderboard,
  };
}
