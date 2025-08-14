import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type LeaderboardEntry = {
  name: string;
  score: number;
  percent: number; // 0..100
  date: number;    // timestamp ms
};

export function useLeaderboard() {
  const qc = useQueryClient();

  const query = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const r = await fetch("/api/leaderboard", { cache: "no-store" });
      if (!r.ok) throw new Error("Failed to load leaderboard");
      return (await r.json()) as LeaderboardEntry[];
    },
    staleTime: 0,
  });

  const addEntry = useMutation({
    mutationFn: async (entry: Omit<LeaderboardEntry, "date">) => {
      const r = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!r.ok) throw new Error("Failed to save entry");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leaderboard"] }),
  });

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    addEntry,
  };
}
