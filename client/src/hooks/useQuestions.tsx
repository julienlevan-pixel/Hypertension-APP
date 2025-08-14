import { useQuery } from "@tanstack/react-query";
import type { Question } from "@shared/schema";
import { parseCSV, shuffleArray } from "@/utils/csvParser";

export function useQuestions() {
  return useQuery({
    queryKey: ['/api/questions'],
    queryFn: async () => {
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      const csvText = await response.text();
      const questions = parseCSV(csvText);
      
      // Organize questions by level and randomize
      const questionsByLevel: Record<number, Question[]> = {};
      
      for (let level = 1; level <= 4; level++) {
        const levelQuestions = questions.filter(q => q.niveau === level);
        questionsByLevel[level] = shuffleArray(levelQuestions);
      }
      
      return questionsByLevel;
    },
    staleTime: Infinity, // Questions don't change during session
  });
}
