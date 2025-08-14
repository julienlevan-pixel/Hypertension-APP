export function calculateScore(isCorrect: boolean, timeInSeconds: number): number {
  const basePoints = isCorrect ? 100 : 0;
  const maxTime = 30; // seconds max for response
  const speedBonus = Math.max(0, 50 * (1 - timeInSeconds / maxTime));
  return basePoints + Math.round(speedBonus);
}
