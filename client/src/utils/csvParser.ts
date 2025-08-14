import type { Question } from "@shared/schema";

export function parseCSV(csvText: string): Question[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const questions: Question[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length >= 10) {
      const question: Question = {
        niveau: parseInt(values[0]),
        domaine: values[1],
        question: values[2],
        optionA: values[3],
        optionB: values[4],
        optionC: values[5],
        optionD: values[6],
        reponse_correcte: values[7] as 'A' | 'B' | 'C' | 'D',
        explication: values[8],
        reference: values[9],
      };
      
      questions.push(question);
    }
  }
  
  return questions;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
